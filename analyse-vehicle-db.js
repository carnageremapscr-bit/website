const fs = require('fs');
const path = require('path');

function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function analyse() {
  const dbPath = path.join(__dirname, 'assets', 'js', 'vehicle-database.js');
  const db = require(dbPath);

  const makes = Object.keys(db.VEHICLE_DATABASE || {});

  const missingManufacturerPools = [];
  const missingYearEngineMakes = [];
  const missingModelYearMappings = [];

  const duplicateYearEngines = [];
  const duplicateManufacturerEngines = [];

  // Missing manufacturer / year mappings
  for (const make of makes) {
    const models = db.VEHICLE_DATABASE[make] || [];
    const mfrPool = (db.MANUFACTURER_ENGINES && db.MANUFACTURER_ENGINES[make]) || [];
    const yearMap = (db.VEHICLE_ENGINE_DATABASE && db.VEHICLE_ENGINE_DATABASE[make]) || {};

    if (!mfrPool || mfrPool.length === 0) {
      missingManufacturerPools.push(make);
    }
    if (!yearMap || Object.keys(yearMap).length === 0) {
      missingYearEngineMakes.push(make);
    }

    for (const model of models) {
      const modelSlug = slugify(model);
      if (!yearMap[modelSlug]) {
        missingModelYearMappings.push({ make, model, modelSlug });
      }
    }
  }

  // Duplicates in manufacturer engine pools
  if (db.MANUFACTURER_ENGINES) {
    for (const [make, engines] of Object.entries(db.MANUFACTURER_ENGINES)) {
      if (!Array.isArray(engines) || engines.length === 0) continue;
      const seen = new Map();
      const dups = new Set();
      for (const e of engines) {
        const key = String(e).trim();
        const count = seen.get(key) || 0;
        seen.set(key, count + 1);
        if (count >= 1) {
          dups.add(key);
        }
      }
      if (dups.size > 0) {
        duplicateManufacturerEngines.push({
          make,
          total: engines.length,
          unique: seen.size,
          duplicates: Array.from(dups),
        });
      }
    }
  }

  // Duplicates in year-engine database
  if (db.VEHICLE_ENGINE_DATABASE) {
    for (const [make, models] of Object.entries(db.VEHICLE_ENGINE_DATABASE)) {
      for (const [modelSlug, years] of Object.entries(models || {})) {
        for (const [yearRange, engines] of Object.entries(years || {})) {
          if (!Array.isArray(engines) || engines.length === 0) continue;
          const seen = new Map();
          const dups = new Set();
          for (const e of engines) {
            const key = String(e).trim();
            const count = seen.get(key) || 0;
            seen.set(key, count + 1);
            if (count >= 1) {
              dups.add(key);
            }
          }
          if (dups.size > 0) {
            duplicateYearEngines.push({
              make,
              modelSlug,
              yearRange,
              total: engines.length,
              unique: seen.size,
              duplicates: Array.from(dups),
            });
          }
        }
      }
    }
  }

  const report = {
    summary: {
      makes: makes.length,
      missingManufacturerPools: missingManufacturerPools.length,
      missingYearEngineMakes: missingYearEngineMakes.length,
      missingModelYearMappings: missingModelYearMappings.length,
      duplicateManufacturerEnginePools: duplicateManufacturerEngines.length,
      duplicateYearEngineEntries: duplicateYearEngines.length,
    },
    missingManufacturerPools,
    missingYearEngineMakes,
    missingModelYearMappings,
    duplicateManufacturerEngines,
    duplicateYearEngines,
  };

  const outPath = path.join(__dirname, 'vehicle-db-analysis-report.json');
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8');

  console.log('Analysis written to', outPath);
  console.log(JSON.stringify(report.summary, null, 2));
}

analyse();
