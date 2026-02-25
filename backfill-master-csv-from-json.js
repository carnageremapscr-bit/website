const fs = require('fs');
const path = require('path');

const BASE = __dirname;
const MASTER_CSV = path.join(BASE, 'vehicles-list.csv');
const JSON_GROUPED = path.join(BASE, 'uk-vehicles-grouped.json');
const JSON_REG_LOOKUP = path.join(BASE, 'reg-lookup', 'data', 'vehicles.json');
const BACKUP = path.join(BASE, 'vehicles-list.pre-json-backfill.bak.csv');
const REPORT = path.join(BASE, 'json-backfill-added.csv');

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/["']/g, '')
    .replace(/[^a-z0-9&+\-/\. ]/g, '')
    .replace(/\s+/g, ' ');
}

function keyFromBrandModel(brand, model) {
  return `${normalize(brand)}|${normalize(model)}`;
}

function parseSemicolonCsvLine(line) {
  const cols = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ';' && !inQuotes) {
      cols.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  cols.push(current);
  return cols;
}

function quoteCsvField(value) {
  const str = String(value ?? '');
  return `"${str.replace(/"/g, '""')}"`;
}

function csvRow(values) {
  return values.map(quoteCsvField).join(';');
}

function loadGroupedPairs(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(raw);
  const pairs = [];

  for (const [brand, models] of Object.entries(parsed)) {
    if (!models || typeof models !== 'object') continue;
    for (const model of Object.keys(models)) {
      pairs.push({ brand: String(brand).trim(), model: String(model).trim(), source: 'uk-vehicles-grouped.json' });
    }
  }

  return pairs;
}

function loadRegLookupPairs(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((item) => ({
      brand: String(item.make || '').trim(),
      model: String(item.model || '').trim(),
      source: 'reg-lookup/data/vehicles.json'
    }))
    .filter((item) => item.brand && item.model);
}

function main() {
  if (!fs.existsSync(MASTER_CSV)) throw new Error(`Missing master CSV: ${MASTER_CSV}`);
  if (!fs.existsSync(JSON_GROUPED)) throw new Error(`Missing JSON file: ${JSON_GROUPED}`);
  if (!fs.existsSync(JSON_REG_LOOKUP)) throw new Error(`Missing JSON file: ${JSON_REG_LOOKUP}`);

  const csvRaw = fs.readFileSync(MASTER_CSV, 'utf8');
  const lines = csvRaw.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) throw new Error('Master CSV must contain header and at least one data row.');

  const headerCols = parseSemicolonCsvLine(lines[0]);
  const brandIndex = headerCols.findIndex((h) => normalize(h) === 'brand');
  const modelIndex = headerCols.findIndex((h) => normalize(h) === 'model');
  if (brandIndex === -1 || modelIndex === -1) throw new Error('Master CSV header must include Brand and Model columns.');

  const existingKeys = new Set();
  for (let i = 1; i < lines.length; i += 1) {
    const cols = parseSemicolonCsvLine(lines[i]);
    const brand = cols[brandIndex] || '';
    const model = cols[modelIndex] || '';
    if (!brand || !model) continue;
    existingKeys.add(keyFromBrandModel(brand, model));
  }

  const candidatePairs = [
    ...loadGroupedPairs(JSON_GROUPED),
    ...loadRegLookupPairs(JSON_REG_LOOKUP)
  ];

  const uniqueCandidates = new Map();
  for (const candidate of candidatePairs) {
    const key = keyFromBrandModel(candidate.brand, candidate.model);
    if (!candidate.brand || !candidate.model || !key) continue;
    if (!uniqueCandidates.has(key)) uniqueCandidates.set(key, candidate);
  }

  const additions = [];
  for (const [key, candidate] of uniqueCandidates.entries()) {
    if (existingKeys.has(key)) continue;
    existingKeys.add(key);
    additions.push(candidate);
  }

  if (additions.length === 0) {
    fs.writeFileSync(REPORT, '"Brand","Model","Source"\n', 'utf8');
    console.log('No missing Brand+Model pairs found in selected JSON sources.');
    console.log(`Report written: ${path.basename(REPORT)}`);
    return;
  }

  fs.copyFileSync(MASTER_CSV, BACKUP);

  const addedCsvRows = additions.map((item) => csvRow([
    'JSON-MERGE',
    'Car',
    item.brand,
    item.model,
    '--',
    '-',
    '-',
    '-',
    '',
    '',
    '-',
    '-',
    '-',
    '-',
    '-'
  ]));

  const nextCsv = `${lines.join('\n')}\n${addedCsvRows.join('\n')}\n`;
  fs.writeFileSync(MASTER_CSV, nextCsv, 'utf8');

  const reportLines = [
    csvRow(['Brand', 'Model', 'Source']),
    ...additions
      .sort((a, b) => `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`, undefined, { sensitivity: 'base' }))
      .map((item) => csvRow([item.brand, item.model, item.source]))
  ];
  fs.writeFileSync(REPORT, `${reportLines.join('\n')}\n`, 'utf8');

  console.log(`Existing rows scanned: ${lines.length - 1}`);
  console.log(`Candidate pairs from JSON: ${uniqueCandidates.size}`);
  console.log(`Added missing pairs: ${additions.length}`);
  console.log(`Updated file: ${path.basename(MASTER_CSV)}`);
  console.log(`Backup file: ${path.basename(BACKUP)}`);
  console.log(`Report file: ${path.basename(REPORT)}`);
}

main();
