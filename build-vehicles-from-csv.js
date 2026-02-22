const fs = require('fs');
const path = require('path');

// Input CSV and output JSON paths
const INPUT_CSV = path.join(__dirname, 'vehicles-list.csv');
const OUTPUT_JSON = path.join(__dirname, 'vehicles-from-csv.json');

function readCsv(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  // Split lines and drop completely empty ones
  const allLines = raw.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (allLines.length === 0) {
    throw new Error('CSV file is empty');
  }

  // First non-empty line is the header
  const headerLine = allLines[0];
  const headers = parseCsvLine(headerLine).map(cleanFieldName);

  const records = [];
  for (let i = 1; i < allLines.length; i++) {
    const line = allLines[i];
    if (!line.trim()) continue;
    const cols = parseCsvLine(line);
    if (cols.length !== headers.length) {
      // Skip malformed lines, but you could log if needed
      continue;
    }
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = cols[j].trim();
    }
    records.push(row);
  }

  return records;
}

// Basic CSV line parser that respects quotes and uses ';' as delimiter
function parseCsvLine(line) {
  const out = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === ';' && !inQuotes) {
      out.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  out.push(current);
  return out.map(s => s.replace(/^"|"$/g, ''));
}

function cleanFieldName(name) {
  return String(name)
    .replace(/^"|"$/g, '')
    .trim();
}

function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildGroupedFromCsv(records) {
  const grouped = {};

  for (const row of records) {
    const type = (row['Type'] || '').toLowerCase();
    // Focus on cars only for now; change here if you want vans/trucks/bikes too
    if (type !== 'car') continue;

    const brandRaw = row['Brand'] || '';
    const modelRaw = row['Model'] || '';
    if (!brandRaw || !modelRaw) continue;

    const brandSlug = slugify(brandRaw);
    const modelSlug = slugify(modelRaw);

    const version = row['Version'] || '';
    const engineDesc = row['Engine'] || row['Engine type'] || '';
    const fuel = row['Fuel'] || '';
    const powerPsStr = row['Power(PS)'] || row['Power(PS'];
    const powerKwStr = row['Power(KW)'] || '';

    const powerPs = powerPsStr ? parseInt(powerPsStr, 10) : null;
    const powerKw = powerKwStr ? parseInt(powerKwStr, 10) : null;

    const ecuMaker = row['Ecu maker'] || '';
    const mcuType = row['MCU Type'] || '';
    const ecuModel = row['Ecu model'] || '';
    const connMode = row['Connection mode'] || '';
    const price = row['Price'] || '';

    // Build a simple engine label we can later map into the JS DB
    let engineLabel = engineDesc || '';
    if (powerPs && !Number.isNaN(powerPs)) {
      engineLabel = `${engineLabel} - ${powerPs}hp`;
    }

    if (!grouped[brandSlug]) {
      grouped[brandSlug] = {};
    }
    if (!grouped[brandSlug][modelSlug]) {
      grouped[brandSlug][modelSlug] = {
        brand: brandRaw,
        model: modelRaw,
        variants: []
      };
    }

    grouped[brandSlug][modelSlug].variants.push({
      version,
      engine: engineDesc,
      engineType: row['Engine type'] || '',
      fuel,
      powerPS: powerPs,
      powerKW: powerKw,
      engineLabel,
      ecuMaker,
      mcuType,
      ecuModel,
      connectionMode: connMode,
      price
    });
  }

  return grouped;
}

function main() {
  try {
    console.log('Reading CSV from', INPUT_CSV);
    const records = readCsv(INPUT_CSV);
    console.log(`Parsed ${records.length} rows`);

    const grouped = buildGroupedFromCsv(records);

    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(grouped, null, 2), 'utf8');
    console.log('Wrote grouped JSON to', OUTPUT_JSON);
  } catch (err) {
    console.error('Error building vehicles-from-csv.json:', err.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}
