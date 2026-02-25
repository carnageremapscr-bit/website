const fs = require('fs');

function norm(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseLine(line) {
  const match = line.match(/^"[^"]*";"([^"]*)";"([^"]*)";"([^"]*)";/);
  if (!match) return null;
  return {
    type: norm(match[1]),
    make: norm(match[2]),
    model: String(match[3] || '').trim()
  };
}

function getEngineMakeKeyForCars(makeKey, yearEnginesMap) {
  if (!makeKey || !yearEnginesMap) return null;
  if (yearEnginesMap[makeKey]) return makeKey;

  const aliases = {
    'alfa-romeo': 'alfa',
    'mercedes-benz': 'mercedes',
    'mercedes': 'mercedes',
    'vw': 'volkswagen',
    'vauxhall': 'opel',
    'ssangyong': 'ssang-yong'
  };

  const alias = aliases[makeKey];
  if (alias && yearEnginesMap[alias]) return alias;

  const compact = makeKey.replace(/-/g, '');
  const allKeys = Object.keys(yearEnginesMap);

  for (const key of allKeys) {
    if (String(key).replace(/-/g, '') === compact) return key;
  }

  for (const key of allKeys) {
    const candidate = String(key).replace(/-/g, '');
    if (candidate.includes(compact) || compact.includes(candidate)) return key;
  }

  return null;
}

const csvLines = fs.readFileSync('vehicles-list.csv', 'utf8').split(/\r?\n/).filter(Boolean);
const yearEngines = JSON.parse(fs.readFileSync('reg-lookup/data/vehicles.json', 'utf8'));
const modelsByType = {};

for (let i = 1; i < csvLines.length; i++) {
  const row = parseLine(csvLines[i]);
  if (!row) continue;

  const type = row.type || 'other';
  if (!row.make || !row.model) continue;

  if (!modelsByType[type]) modelsByType[type] = {};
  if (!modelsByType[type][row.make]) modelsByType[type][row.make] = new Set();
  modelsByType[type][row.make].add(row.model);
}

let carMakes = Object.keys(modelsByType.car || {});
const rawCarCount = carMakes.length;

carMakes = carMakes.filter((makeKey) => !!getEngineMakeKeyForCars(makeKey, yearEngines));
const afterEngineMatch = carMakes.length;

const excludedFromCars = new Set(['arctic-cat', 'ashok-layland']);
carMakes = carMakes.filter((makeKey) => !excludedFromCars.has(makeKey));

console.log('raw_car_makes=' + rawCarCount);
console.log('after_engine_match=' + afterEngineMatch);
console.log('final_car_makes=' + carMakes.length);
console.log('contains_arctic_cat=' + carMakes.includes('arctic-cat'));
console.log('contains_ashok_layland=' + carMakes.includes('ashok-layland'));
console.log('first_50=' + carMakes.slice(0, 50).join(', '));
