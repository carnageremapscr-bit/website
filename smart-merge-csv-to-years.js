const fs = require('fs');
const path = require('path');

function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Extract key attributes from an engine label for intelligent matching
 * e.g. "1.4L T-Jet - 155hp" -> { capacity: "1.4", type: "t-jet", power: 155 }
 */
function parseEngineLabel(label) {
  const label_lower = String(label).toLowerCase();
  
  // Extract capacity (supports "1.4L", "1.4", "2.0 tdi")
  const capacityMatch =
    label_lower.match(/\b(\d+\.\d)\s*l\b/) ||
    label_lower.match(/\b(\d+\.\d)\b/);
  const capacity = capacityMatch ? capacityMatch[1] : null;
  
  // Extract power (e.g., "155hp", "150 hp")
  const powerMatch = label_lower.match(/(\d+)\s*(?:hp|ps|kw)/);
  const power = powerMatch ? parseInt(powerMatch[1]) : null;
  
  // Extract engine type keywords (tdi, tfsi, t-jet, multiair, etc.)
  const typePatterns = ['tdi', 'hdi', 'dci', 'crdi', 'tfsi', 'tsi', 't-jet', 'multiair', 'ecoboost', 'vvti', 'diesel', 'petrol', 'hybrid', 'electric'];
  const types = [];
  for (const pattern of typePatterns) {
    if (label_lower.includes(pattern)) {
      types.push(pattern);
    }
  }
  
  // Determine fuel type
  let fuel = 'unknown';
  if (label_lower.includes('diesel') || label_lower.includes('tdi') || label_lower.includes('dci') || label_lower.includes('hdi') || label_lower.includes('crdi')) {
    fuel = 'diesel';
  } else if (label_lower.includes('petrol') || label_lower.includes('tsi') || label_lower.includes('tfsi') || label_lower.includes('t-jet') || label_lower.includes('ecoboost')) {
    fuel = 'petrol';
  } else if (label_lower.includes('hybrid')) {
    fuel = 'hybrid';
  } else if (label_lower.includes('electric') || label_lower.includes('ev')) {
    fuel = 'electric';
  }
  
  return { capacity, power, types, fuel, original: label };
}

/**
 * Deduplicate engines by fuel type + rounded power combination
 * Rounds power to nearest 5 (101-104 hp becomes 100, 105-109 becomes 105, etc.)
 * Returns unique engines, keeping the first occurrence of each rounded power
 */
function deduplicateByPowerAndFuel(engines) {
  const seen = new Set();
  const result = [];
  
  for (const engine of engines) {
    const label = String(engine).toLowerCase();
    
    // Extract power (e.g., "155hp", "150 hp")
    const powerMatch = label.match(/(\d+)\s*(?:hp|ps|kw)/);
    let power = powerMatch ? parseInt(powerMatch[1]) : null;
    
    // Round power to nearest 5
    if (power !== null) {
      power = Math.round(power / 5) * 5;
    }
    
    // Determine fuel type (distinguish TDI CR from older TDI)
    let fuel = 'unknown';
    if (/diesel|tdi|dci|hdi|crdi/.test(label)) {
      fuel = 'diesel';
      // Distinguish newer CR engines from older ones
      if (/cr|common.?rail/.test(label)) {
        fuel = 'diesel-cr';
      }
    } else if (/petrol|tsi|tfsi|t-jet|ecoboost|vvti|multiair|gdi/.test(label)) {
      fuel = 'petrol';
    } else if (/electric|ev|battery/.test(label)) {
      fuel = 'electric';
    } else if (/hybrid|phev/.test(label)) {
      fuel = 'hybrid';
    }
    
    // Extract engine size so we only dedupe when the size matches (e.g. 1.6 with 1.6)
    const capacityMatch =
      label.match(/\b(\d+\.\d)\s*l\b/) ||
      label.match(/\b(\d+\.\d)\b/);
    const capacity = capacityMatch ? capacityMatch[1] : 'unknown';

    // Deduplicate on fuel + engine size + rounded power
    const key = `${fuel}-${capacity}-${power}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(engine);
    }
  }
  
  return result;
}

/**
 * Score how similar two engine labels are (0-100, higher = more similar)
 */
function scoreEngineMatch(csvEngine, yearEngineLabel) {
  const csv = parseEngineLabel(csvEngine.engineLabel);
  const year = parseEngineLabel(yearEngineLabel);
  
  let score = 0;
  
  // Capacity match: +40 points (stricter: only ±0.05L)
  if (csv.capacity && year.capacity) {
    const csvCap = parseFloat(csv.capacity);
    const yearCap = parseFloat(year.capacity);
    if (Math.abs(csvCap - yearCap) < 0.05) {
      score += 40;
    } else if (Math.abs(csvCap - yearCap) < 0.1) {
      score += 25;
    }
  }
  
  // Power match: +40 points (allow ±3% tolerance only)
  if (csv.power && year.power) {
    const diff = Math.abs(csv.power - year.power);
    const tolerance = Math.max(3, year.power * 0.03);
    if (diff <= tolerance) {
      score += 40;
    } else if (diff <= tolerance * 1.5) {
      score += 15;
    }
  }
  
  // Fuel type match: +20 points
  if (csv.fuel && year.fuel && csv.fuel === year.fuel) {
    score += 20;
  }
  
  // Engine type overlap: +10 points
  if (csv.types && year.types) {
    const overlap = csv.types.filter(t => year.types.includes(t)).length;
    if (overlap > 0) {
      score += 10;
    }
  }
  
  return Math.min(score, 100);
}

function smartMerge() {
  const dbPath = path.join(__dirname, 'assets', 'js', 'vehicle-database.js');
  const csvPath = path.join(__dirname, 'vehicles-from-csv.json');
  
  const db = require(dbPath);
  const csvData = JSON.parse(fs.readFileSync(csvPath, 'utf8'));
  
  const result = {};
  
  // Deep clone existing VEHICLE_ENGINE_DATABASE
  for (const [make, models] of Object.entries(db.VEHICLE_ENGINE_DATABASE || {})) {
    if (!result[make]) result[make] = {};
    
    for (const [modelSlug, years] of Object.entries(models)) {
      if (!result[make][modelSlug]) result[make][modelSlug] = {};
      
      for (const [yearRange, engines] of Object.entries(years)) {
        result[make][modelSlug][yearRange] = Array.from(engines || []);
      }
    }
  }
  
  // For each make in CSV
  const stats = {
    makesProcessed: 0,
    modelsProcessed: 0,
    enginesAdded: 0,
    enginesMatched: 0,
    perMake: {}
  };
  
  for (const [csvMake, csvModels] of Object.entries(csvData || {})) {
    if (!result[csvMake]) continue;
    
    stats.makesProcessed++;
    stats.perMake[csvMake] = { modelsWithMatches: [], totalEnginesAdded: 0 };
    
    for (const [csvModelSlug, csvModelData] of Object.entries(csvModels)) {
      if (!result[csvMake][csvModelSlug]) continue;
      
      stats.modelsProcessed++;
      const modelYears = result[csvMake][csvModelSlug];
      const csvVariants = csvModelData.variants || [];
      
      if (csvVariants.length === 0) continue;
      
      // For each year range in this model
      for (const [yearRange, yearEngines] of Object.entries(modelYears)) {
        let addedThisYear = 0;
        const existingSet = new Set((yearEngines || []).map(e => String(e).trim()));
        
        // For each CSV engine variant
        for (const variant of csvVariants) {
          const csvLabel = variant.engineLabel;
          
          // Try to find the best match in the existing year engines
          let bestScore = 0;
          let bestMatch = null;
          
          for (const yearEngine of (yearEngines || [])) {
            const score = scoreEngineMatch(variant, yearEngine);
            if (score > bestScore) {
              bestScore = score;
              bestMatch = yearEngine;
            }
          }
          
          // If we found a reasonably close match (score > 65), assign this CSV engine to this year
          if (bestScore > 65) {
            const trimmedLabel = String(csvLabel).trim();
            if (!existingSet.has(trimmedLabel)) {
              modelYears[yearRange].push(trimmedLabel);
              existingSet.add(trimmedLabel);
              addedThisYear++;
              stats.enginesAdded++;
              stats.enginesMatched++;
            }
          }
        }
        
        // Deduplicate by fuel type + power
        if (modelYears[yearRange]) {
          modelYears[yearRange] = deduplicateByPowerAndFuel(modelYears[yearRange]);
        }
        
        if (addedThisYear > 0) {
          stats.perMake[csvMake].modelsWithMatches.push(csvModelSlug);
          stats.perMake[csvMake].totalEnginesAdded += addedThisYear;
        }
      }
    }
  }

  // Final cleanup pass: enforce dedupe across all makes/models/year buckets
  for (const make of Object.keys(result)) {
    for (const modelSlug of Object.keys(result[make] || {})) {
      for (const yearRange of Object.keys(result[make][modelSlug] || {})) {
        result[make][modelSlug][yearRange] = deduplicateByPowerAndFuel(
          result[make][modelSlug][yearRange] || []
        );
      }
    }
  }
  
  // Write output
  const outDbPath = path.join(__dirname, 'vehicle-engine-db-smart-merged.json');
  fs.writeFileSync(outDbPath, JSON.stringify(result, null, 2), 'utf8');
  
  const statsPath = path.join(__dirname, 'smart-merge-stats.json');
  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), 'utf8');
  
  console.log('Smart merge completed!');
  console.log(JSON.stringify(stats, null, 2));
}

smartMerge();
