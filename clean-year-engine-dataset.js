const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, 'vehicle-engine-db-smart-merged.json');
const BACKUP_PATH = path.join(__dirname, 'vehicle-engine-db-smart-merged.pre-clean.bak.json');
const REPORT_PATH = path.join(__dirname, 'vehicle-engine-clean-report.json');
const MAX_VARIANTS_PER_YEAR = Number(process.env.MAX_VARIANTS_PER_YEAR || 8);

function extractYearRangeStart(rangeKey) {
  const text = String(rangeKey || '').trim();
  const match = text.match(/(\d{4})/);
  if (!match) return -1;
  return Number(match[1]);
}

function extractYearRangeEnd(rangeKey) {
  const text = String(rangeKey || '').trim();
  const all = text.match(/\d{4}/g) || [];
  if (!all.length) return -1;
  return Number(all[all.length - 1]);
}

function isPre2012Range(rangeKey) {
  const endYear = extractYearRangeEnd(rangeKey);
  return endYear > 0 && endYear < 2012;
}

function sortYearRangeKeysDesc(keys) {
  return [...(keys || [])].sort((a, b) => {
    const startA = extractYearRangeStart(a);
    const startB = extractYearRangeStart(b);
    if (startA !== startB) return startB - startA;
    return String(a).localeCompare(String(b), undefined, { sensitivity: 'base' });
  });
}

function containsCrEngineLabel(label) {
  const text = String(label || '').toLowerCase();
  return /\bcr\b|common\s*rail/.test(text);
}

function normalizeEngineLabel(label) {
  return String(label || '')
    .toLowerCase()
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractBhpValue(label) {
  const text = String(label || '').toLowerCase();
  const match = text.match(/(\d{2,4})\s*hp\b/);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : null;
}

function getEngineFamilyKey(label) {
  return normalizeEngineLabel(label)
    .replace(/\d{2,4}\s*hp\b/g, '')
    .replace(/\s*-\s*$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractEngineDisplacementValue(label) {
  const text = String(label || '').toLowerCase();
  const liters = text.match(/(\d+(?:\.\d+)?)\s*l\b/);
  if (liters) return Number(liters[1]);

  const cc = text.match(/(\d{3,5})\s*cc\b/);
  if (cc) {
    const value = Number(cc[1]);
    if (Number.isFinite(value) && value > 0) return value / 1000;
  }

  return null;
}

function sortEngineVariants(variants) {
  return [...(variants || [])].sort((a, b) => {
    const da = extractEngineDisplacementValue(a);
    const db = extractEngineDisplacementValue(b);
    if (da !== null && db !== null && da !== db) return da - db;
    if (da !== null && db === null) return -1;
    if (da === null && db !== null) return 1;

    const ha = extractBhpValue(a);
    const hb = extractBhpValue(b);
    if (ha !== null && hb !== null && ha !== hb) return ha - hb;
    if (ha !== null && hb === null) return -1;
    if (ha === null && hb !== null) return 1;

    return String(a).localeCompare(String(b), undefined, { sensitivity: 'base' });
  });
}

function sanitizeYearEngineVariants(engines, yearKey, stats) {
  const list = Array.isArray(engines) ? engines : [];
  const seenLabels = new Set();
  const unique = [];
  const pre2012 = isPre2012Range(yearKey);

  for (const item of list) {
    const label = String(item || '').trim();
    if (!label) continue;

    if (pre2012 && containsCrEngineLabel(label)) {
      stats.removedCrPre2012 += 1;
      continue;
    }

    const normalized = normalizeEngineLabel(label);
    if (!normalized) continue;
    if (seenLabels.has(normalized)) {
      stats.removedExactDuplicates += 1;
      continue;
    }

    seenLabels.add(normalized);
    unique.push(label);
  }

  const sorted = sortEngineVariants(unique);
  const filtered = [];
  const hpByFamily = new Map();

  for (const variant of sorted) {
    const family = getEngineFamilyKey(variant);
    const hp = extractBhpValue(variant);

    if (family && hp !== null) {
      const existingHp = hpByFamily.get(family) || [];
      const isCloseDuplicate = existingHp.some((value) => Math.abs(value - hp) <= 4);
      if (isCloseDuplicate) {
        stats.removedCloseBhpDuplicates += 1;
        continue;
      }
      existingHp.push(hp);
      hpByFamily.set(family, existingHp);
    }

    if (filtered.length >= MAX_VARIANTS_PER_YEAR) {
      stats.removedByCap += 1;
      continue;
    }

    filtered.push(variant);
  }

  return filtered;
}

function main() {
  if (!fs.existsSync(DATA_PATH)) {
    throw new Error(`Missing dataset file: ${DATA_PATH}`);
  }

  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  const source = JSON.parse(raw);

  const stats = {
    makes: 0,
    models: 0,
    yearBuckets: 0,
    variantsBefore: 0,
    variantsAfter: 0,
    removedCrPre2012: 0,
    removedExactDuplicates: 0,
    removedCloseBhpDuplicates: 0,
    removedByCap: 0,
    maxVariantsPerYear: MAX_VARIANTS_PER_YEAR
  };

  const cleaned = {};

  Object.keys(source || {}).forEach((makeKey) => {
    const models = source[makeKey] || {};
    cleaned[makeKey] = {};
    stats.makes += 1;

    Object.keys(models).forEach((modelKey) => {
      const yearMap = models[modelKey] || {};
      const orderedYearMap = {};
      const yearKeys = sortYearRangeKeysDesc(Object.keys(yearMap));
      stats.models += 1;

      yearKeys.forEach((yearKey) => {
        const list = Array.isArray(yearMap[yearKey]) ? yearMap[yearKey] : [];
        stats.yearBuckets += 1;
        stats.variantsBefore += list.length;

        const sanitized = sanitizeYearEngineVariants(list, yearKey, stats);
        stats.variantsAfter += sanitized.length;
        orderedYearMap[yearKey] = sanitized;
      });

      cleaned[makeKey][modelKey] = orderedYearMap;
    });
  });

  fs.copyFileSync(DATA_PATH, BACKUP_PATH);
  fs.writeFileSync(DATA_PATH, JSON.stringify(cleaned, null, 2), 'utf8');
  fs.writeFileSync(REPORT_PATH, JSON.stringify(stats, null, 2), 'utf8');

  console.log('Dataset cleaned successfully.');
  console.log(`Makes: ${stats.makes}`);
  console.log(`Models: ${stats.models}`);
  console.log(`Year buckets: ${stats.yearBuckets}`);
  console.log(`Variants before: ${stats.variantsBefore}`);
  console.log(`Variants after: ${stats.variantsAfter}`);
  console.log(`Removed pre-2012 CR labels: ${stats.removedCrPre2012}`);
  console.log(`Removed exact duplicates: ${stats.removedExactDuplicates}`);
  console.log(`Removed close BHP duplicates (1-4hp): ${stats.removedCloseBhpDuplicates}`);
  console.log(`Removed by cap: ${stats.removedByCap}`);
  console.log(`Backup: ${path.basename(BACKUP_PATH)}`);
  console.log(`Report: ${path.basename(REPORT_PATH)}`);
}

main();
