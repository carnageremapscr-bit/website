const fs = require('fs');
const path = require('path');

// Paths
const VEHICLE_DB_PATH = path.join(__dirname, 'assets', 'js', 'vehicle-database.js');
const CSV_GROUPED_PATH = path.join(__dirname, 'vehicles-from-csv.json');
const OUTPUT_MERGED_PATH = path.join(__dirname, 'vehicle-engine-db-merged-from-csv.json');
const OUTPUT_REPORT_PATH = path.join(__dirname, 'vehicle-engine-db-merged-from-csv-report.json');

function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function loadJsonModule(p) {
  const resolved = path.resolve(p);
  // eslint-disable-next-line global-require, import/no-dynamic-require
  return require(resolved);
}

function mergeCsvIntoYearEngines() {
  const carnageDb = loadJsonModule(VEHICLE_DB_PATH);
  const csvGrouped = loadJsonModule(CSV_GROUPED_PATH);

  const existingModels = carnageDb.VEHICLE_DATABASE || {};
  const existingYearEngines = carnageDb.VEHICLE_ENGINE_DATABASE || {};

  // Deep clone existing year engines so we never mutate the original module
  const mergedYearEngines = JSON.parse(JSON.stringify(existingYearEngines));

  const report = {
    makesSeenInCsv: 0,
    makesMatchedToDb: 0,
    modelsProcessed: 0,
    modelsMatchedWithYearData: 0,
    modelsSkippedNoYearData: 0,
    enginesAdded: 0,
    perMake: {}
  };

  for (const [csvMakeKey, models] of Object.entries(csvGrouped || {})) {
    report.makesSeenInCsv += 1;

    if (!existingModels[csvMakeKey]) {
      continue; // manufacturer not present in DB, skip safely
    }

    report.makesMatchedToDb += 1;
    if (!report.perMake[csvMakeKey]) {
      report.perMake[csvMakeKey] = {
        modelsWithYearData: [],
        modelsWithoutYearData: []
      };
    }

    const makeYearMap = mergedYearEngines[csvMakeKey] || {};

    for (const [csvModelSlug, csvModelData] of Object.entries(models || {})) {
      report.modelsProcessed += 1;

      const variants = Array.isArray(csvModelData.variants) ? csvModelData.variants : [];
      if (variants.length === 0) continue;

      // Determine the model key used in VEHICLE_ENGINE_DATABASE, if any
      let modelKey = null;

      if (makeYearMap[csvModelSlug]) {
        modelKey = csvModelSlug;
      } else {
        // Try to match by slug against VEHICLE_DATABASE display names
        const displayModels = existingModels[csvMakeKey] || [];
        for (const displayName of displayModels) {
          const slug = slugify(displayName);
          if (slug === csvModelSlug) {
            modelKey = slug;
            break;
          }
        }
      }

      if (!modelKey) {
        // No matching model in existing DB, skip – we don't invent new year ranges
        report.modelsSkippedNoYearData += 1;
        report.perMake[csvMakeKey].modelsWithoutYearData.push({
          modelSlug: csvModelSlug,
          modelName: csvModelData.model || ''
        });
        continue;
      }

      const modelYearMap = makeYearMap[modelKey];
      if (!modelYearMap || typeof modelYearMap !== 'object' || Object.keys(modelYearMap).length === 0) {
        // Manufacturer exists, model exists, but we have no year ranges defined yet
        report.modelsSkippedNoYearData += 1;
        report.perMake[csvMakeKey].modelsWithoutYearData.push({
          modelSlug: csvModelSlug,
          modelName: csvModelData.model || ''
        });
        continue;
      }

      // We have existing year ranges – reuse them and just add CSV engines into those buckets
      report.modelsMatchedWithYearData += 1;
      report.perMake[csvMakeKey].modelsWithYearData.push({
        modelKey,
        modelName: csvModelData.model || '',
        yearRanges: Object.keys(modelYearMap)
      });

      // Collect unique engine labels from CSV for this model
      const csvEngineLabels = new Set();
      for (const variant of variants) {
        const label = (variant && variant.engineLabel) ? String(variant.engineLabel).trim() : '';
        if (label) {
          csvEngineLabels.add(label);
        }
      }

      if (csvEngineLabels.size === 0) continue;

      // Attach each CSV engine label to all existing year ranges for this model
      for (const yearRange of Object.keys(modelYearMap)) {
        if (!Array.isArray(modelYearMap[yearRange])) {
          modelYearMap[yearRange] = [];
        }
        const existingEngineSet = new Set(modelYearMap[yearRange].map(e => String(e)));

        for (const label of csvEngineLabels) {
          if (!existingEngineSet.has(label)) {
            modelYearMap[yearRange].push(label);
            existingEngineSet.add(label);
            report.enginesAdded += 1;
          }
        }
      }
    }

    mergedYearEngines[csvMakeKey] = makeYearMap;
  }

  return { mergedYearEngines, report };
}

function main() {
  try {
    console.log('Loading existing vehicle database from', VEHICLE_DB_PATH);
    console.log('Loading CSV-derived grouped data from', CSV_GROUPED_PATH);

    const { mergedYearEngines, report } = mergeCsvIntoYearEngines();

    fs.writeFileSync(OUTPUT_MERGED_PATH, JSON.stringify(mergedYearEngines, null, 2), 'utf8');
    fs.writeFileSync(OUTPUT_REPORT_PATH, JSON.stringify(report, null, 2), 'utf8');

    console.log('Wrote merged year-engine database to', OUTPUT_MERGED_PATH);
    console.log('Wrote merge report to', OUTPUT_REPORT_PATH);
  } catch (err) {
    console.error('Error merging CSV into year-engine database:', err.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}
