// Carnage Remaps Portal - Complete System with Auth & Admin
(function() {
  'use strict';

  // API Configuration - Auto-detect environment
  // For production: Set this to your Railway backend URL
  const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3002'
    : 'https://web-production-df12d.up.railway.app'; // Your Railway backend URL
  
  // Expose API_URL globally for other modules
  window.CARNAGE_API_URL = API_URL;

  const DB_NAME = 'CarnageRemapsDB';
  const DB_VERSION = 2;
  const STORE_NAME = 'files';
  let db = null;
  let currentTicketId = null;

  // Contact Settings (configurable by admin)
  let CONTACT_SETTINGS = {
    whatsappNumber: '07546371963',
    email: 'carnageremaps@gmail.com'
  };

  // Load contact settings from localStorage
  function loadContactSettings() {
    const saved = localStorage.getItem('contactSettings');
    if (saved) {
      CONTACT_SETTINGS = JSON.parse(saved);
    }
  }

  // Save contact settings to localStorage
  function saveContactSettings(settings) {
    CONTACT_SETTINGS = settings;
    localStorage.setItem('contactSettings', JSON.stringify(settings));
  }

  loadContactSettings();

  // Comprehensive Vehicle Database (central source)
  const VEHICLE_DATABASE = (window.CarnageVehicleDB && window.CarnageVehicleDB.VEHICLE_DATABASE) || {};

  // Year-Model-Engine Database (central source)
  const VEHICLE_ENGINE_DATABASE = (window.CarnageVehicleDB && window.CarnageVehicleDB.VEHICLE_ENGINE_DATABASE) || {};

  function replaceObjectContents(target, source) {
    Object.keys(target || {}).forEach((key) => delete target[key]);
    Object.assign(target, source || {});
  }

  function formatManufacturerLabel(key) {
    const value = String(key || '');
    return value
      .split('-')
      .map((part) => {
        const p = part.toLowerCase();
        if (p === 'vw') return 'VW';
        if (p === 'bmw') return 'BMW';
        if (p === 'mg') return 'MG';
        if (p === 'ds') return 'DS';
        return p.charAt(0).toUpperCase() + p.slice(1);
      })
      .join(' ');
  }

  function populateManufacturerSelect(selectEl) {
    if (!selectEl) return;
    const current = selectEl.value;
    const manufacturers = Object.keys(VEHICLE_DATABASE).sort();
    selectEl.innerHTML = '<option value="">Select Manufacturer</option>';
    manufacturers.forEach((manufacturer) => {
      const option = document.createElement('option');
      option.value = manufacturer;
      option.textContent = formatManufacturerLabel(manufacturer);
      selectEl.appendChild(option);
    });
    if (current && manufacturers.includes(current)) {
      selectEl.value = current;
    }
  }

  let vehicleDataHydrationPromise = null;
  function hydrateVehicleDataFromAPI() {
    if (vehicleDataHydrationPromise) return vehicleDataHydrationPromise;

    vehicleDataHydrationPromise = fetch(`${API_URL}/api/vehicles?v=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Vehicle API ${response.status}`);
        return response.json();
      })
      .then((data) => {
        replaceObjectContents(VEHICLE_DATABASE, data.models || {});
        replaceObjectContents(VEHICLE_ENGINE_DATABASE, data.yearEngines || {});
        return data;
      })
      .catch((error) => {
        console.warn('Vehicle API hydrate failed, using local fallback database:', error);
        return null;
      });

    return vehicleDataHydrationPromise;
  }

  hydrateVehicleDataFromAPI();

  const DYNAMIC_ENGINE_DATA = {};

  // Initialize IndexedDB
  function initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        db = request.result;
        resolve(db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create files store
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
          objectStore.createIndex('name', 'name', { unique: false });
          objectStore.createIndex('uploadDate', 'uploadDate', { unique: false });
        }

        // Create transactions store
        if (!db.objectStoreNames.contains('TRANSACTIONS')) {
          const transStore = db.createObjectStore('TRANSACTIONS', { keyPath: 'id' });
          transStore.createIndex('userId', 'userId', { unique: false });
          transStore.createIndex('date', 'date', { unique: false });
        }

        // Create top-up requests store
        if (!db.objectStoreNames.contains('TOPUP_REQUESTS')) {
          const topupStore = db.createObjectStore('TOPUP_REQUESTS', { keyPath: 'id', autoIncrement: true });
          topupStore.createIndex('userId', 'userId', { unique: false });
          topupStore.createIndex('status', 'status', { unique: false });
        }
        
        // Create admin notifications store
        if (!db.objectStoreNames.contains('adminNotifications')) {
          const notifStore = db.createObjectStore('adminNotifications', { keyPath: 'id', autoIncrement: true });
          notifStore.createIndex('read', 'read', { unique: false });
          notifStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        // Create top-up requests store (separate from transactions)
        if (!db.objectStoreNames.contains('topUpRequests')) {
          const topupReqStore = db.createObjectStore('topUpRequests', { keyPath: 'id', autoIncrement: true });
          topupReqStore.createIndex('userId', 'userId', { unique: false });
          topupReqStore.createIndex('status', 'status', { unique: false });
        }
      };
    });
  }

  // Helper to open/get the database
  function openDB() {
    if (db) return Promise.resolve(db);
    return initDB();
  }

  // Save file to IndexedDB
  function saveFile(fileData) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.add(fileData);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Get all files from IndexedDB
  // Note: getAllFiles, deleteFile, getFileById are now provided by SupabaseFiles via compatibility layer
  // These are local wrappers that use the global functions
  
  function getAllFiles() {
    return window.getAllFiles ? window.getAllFiles() : Promise.resolve([]);
  }

  function deleteFile(id) {
    return window.deleteFile ? window.deleteFile(id) : Promise.reject(new Error('deleteFile not loaded'));
  }

  function getFileById(id) {
    return window.getFileById ? window.getFileById(id) : Promise.reject(new Error('getFileById not loaded'));
  }

  // Alias for deleteFile (for consistency)
  const deleteFileById = deleteFile;

  // Update file status in IndexedDB
  function updateFileStatus(id, newStatus) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      const getRequest = objectStore.get(id);
      
      getRequest.onsuccess = () => {
        const file = getRequest.result;
        if (file) {
          file.status = newStatus;
          const updateRequest = objectStore.put(file);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          reject(new Error('File not found'));
        }
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // Format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Get file extension
  function getFileExtension(filename) {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'FILE';
  }

  // Tab Navigation
  function initTabs() {
    const navLinks = document.querySelectorAll('[data-tab]');
    const tabs = document.querySelectorAll('.cr-tab');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = link.getAttribute('data-tab');
        
        // Update nav active state - works with both old and new selectors
        document.querySelectorAll('.nav-item, .cr-nav a').forEach(a => a.classList.remove('active'));
        document.querySelectorAll(`.nav-item[data-tab="${tabName}"], .cr-nav a[data-tab="${tabName}"]`).forEach(a => a.classList.add('active'));
        
        // Update tab active state
        tabs.forEach(tab => tab.classList.remove('active'));
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        // Refresh credit display when switching tabs
        updateCreditDisplay();
        
        // Refresh files list if switching to files tab
        if (tabName === 'files') {
          displayFiles();
        }
        
        // Update dashboard stats if switching to dashboard
        if (tabName === 'dashboard') {
          updateDashboardStats();
        }

        // Load billing data if switching to billing tab
        if (tabName === 'billing') {
          clearCreditCache(); // Clear cache for fresh data
          loadCreditBalance();
          loadTransactionHistory();
          loadActiveSubscriptions();
        }

        // Load admin data if switching to admin tab
        if (tabName === 'admin') {
          loadTopUpRequests();
        }
        
        // Initialize pricing page if switching to pricing tab
        if (tabName === 'pricing') {
          initializePricingPage();
        }
        
        // Initialize ECU search when switching to ecu-database tab
        if (tabName === 'ecu-database') {
          initializeEcuSearch();
        }
      });
    });
  }

  // Helper function to normalize model names for database lookup
  function normalizeModelKey(modelName) {
    return modelName.toLowerCase()
      .replace(/[^a-z0-9!.#\s-]/g, '') // Remove special chars except !, ., #, space, hyphen
      .replace(/\s+/g, '-')             // Replace spaces with hyphens
      .replace(/--+/g, '-');            // Replace multiple hyphens with single
  }
  
  // Helper function to find model in database with multiple key variations
  function findModelInDatabase(manufacturer, modelKey) {
    if (!VEHICLE_ENGINE_DATABASE[manufacturer]) return null;
    
    // Try the direct key first
    if (VEHICLE_ENGINE_DATABASE[manufacturer][modelKey]) {
      return modelKey;
    }
    
    // Try removing hyphens between numbers/letters (e.g., ds-3-crossback -> ds3-crossback)
    const noHyphenKey = modelKey.replace(/-(\d)/g, '$1');
    if (VEHICLE_ENGINE_DATABASE[manufacturer][noHyphenKey]) {
      return noHyphenKey;
    }
    
    // Try adding hyphens between numbers/letters (e.g., mg4-ev -> mg-4-ev)
    const withHyphenKey = modelKey.replace(/([a-z])(\d)/gi, '$1-$2').replace(/(\d)([a-z])/gi, '$1-$2');
    if (VEHICLE_ENGINE_DATABASE[manufacturer][withHyphenKey]) {
      return withHyphenKey;
    }
    
    // Try without any special handling of numbers
    const simpleKey = modelKey.replace(/[^a-z0-9-]/g, '');
    if (VEHICLE_ENGINE_DATABASE[manufacturer][simpleKey]) {
      return simpleKey;
    }
    
    return null;
  }

  // Function to find engine data with fallback logic (used by upload and vehicle search)
  function findEngineData(engineKey) {
    console.log('findEngineData called with:', engineKey);
    
    // Normalize the key first
    let normalizedKey = engineKey.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/\./g, '')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, '');
    
    console.log('Normalized key:', normalizedKey);
    
    // Try exact match first
    if (ENGINE_ECU_DATABASE[normalizedKey]) {
      console.log('Exact match found');
      return ENGINE_ECU_DATABASE[normalizedKey];
    }
    
    // Try removing variant names (GTI, R, GTD, BiTurbo, etc.)
    const variants = ['gti', 'gtd', 'r', 'rs', 's', 'st', 'biturbo', 'bi-turbo', 'etsi', 'e-tsi', 'tdi-e', 'phev', 'hybrid', 'sport', 'performance', 'edition', 'black-edition', 'special', 'vti', 'vvt-i', 'evo', 'line', 's-line', 'm-sport', 'amg', 'quattro', '4motion', 'xdrive', 'bluemotion', 'greenline', 'gt', 'se', 'sel', 'titanium', 'zetec', 'st-line', 'fr', 'xcellence', 'monte-carlo'];
    let cleanedKey = normalizedKey;
    
    for (const variant of variants) {
      // Remove variant from middle (e.g., "20-tsi-gti-245hp" → "20-tsi-245hp")
      cleanedKey = cleanedKey.replace(new RegExp(`-${variant}(?=-|$)`, 'gi'), '');
    }
    
    // Clean up any double dashes
    cleanedKey = cleanedKey.replace(/--+/g, '-');
    
    // Try cleaned key
    if (cleanedKey !== engineKey && ENGINE_ECU_DATABASE[cleanedKey]) {
      return ENGINE_ECU_DATABASE[cleanedKey];
    }
    
    // Extract capacity and power from the key
    const capacityPowerMatch = normalizedKey.match(/^(\d+)-(.*?)-(\d+hp)$/);
    if (capacityPowerMatch) {
      const capacity = capacityPowerMatch[1];
      const engineType = capacityPowerMatch[2];
      const power = capacityPowerMatch[3];
      
      console.log('Parsed engine - Capacity:', capacity, 'Type:', engineType, 'Power:', power);
      
      // Try different engine type variations for same capacity/power
      const typeVariations = [
        engineType,
        engineType.replace(/tdi/gi, 'hdi'),
        engineType.replace(/hdi/gi, 'tdi'),
        engineType.replace(/tdi/gi, 'dci'),
        engineType.replace(/dci/gi, 'tdi'),
        engineType.replace(/tdi/gi, 'crdi'),
        engineType.replace(/crdi/gi, 'tdi'),
        engineType.replace(/tsi/gi, 'tfsi'),
        engineType.replace(/tfsi/gi, 'tsi'),
        engineType.replace(/tsi/gi, 'gdi'),
        engineType.replace(/gdi/gi, 'tsi'),
        engineType.replace(/tsi/gi, 't-gdi'),
        engineType.replace(/t-gdi/gi, 'tsi'),
        engineType.replace(/bluehdi/gi, 'hdi'),
        engineType.replace(/hdi/gi, 'bluehdi'),
        engineType.replace(/puretech/gi, 'vti'),
        engineType.replace(/vti/gi, 'puretech'),
        engineType.replace(/ecoboost/gi, 'tdci'),
        engineType.replace(/tdci/gi, 'ecoboost'),
        engineType.replace(/ecotec/gi, 'cdti'),
        engineType.replace(/cdti/gi, 'ecotec'),
        engineType.replace(/skyactiv-d/gi, 'diesel'),
        engineType.replace(/skyactiv-g/gi, 'petrol'),
        engineType.replace(/mpi/gi, 'fsi'),
        engineType.replace(/fsi/gi, 'mpi'),
        // Try just "tdi", "tsi", etc. without other parts
        engineType.replace(/-.*$/, ''),
        'tdi', 'tsi', 'tfsi', 'diesel', 'petrol'
      ];
      
      // Try each variation
      for (const variation of typeVariations) {
        const variantKey = `${capacity}-${variation}-${power}`;
        if (ENGINE_ECU_DATABASE[variantKey]) {
          console.log('Match found with variation:', variantKey);
          return ENGINE_ECU_DATABASE[variantKey];
        }
      }
      
      // Try matching by capacity and power only (best fallback)
      console.log('Trying capacity+power match only...');
      for (const [key, data] of Object.entries(ENGINE_ECU_DATABASE)) {
        if (key.startsWith(capacity + '-') && key.endsWith('-' + power)) {
          console.log('Match found by capacity+power:', key);
          return data;
        }
      }
      
      // Try matching with ±10hp tolerance (increased from ±5)
      const powerValue = parseInt(power.replace('hp', ''));
      console.log('Trying power tolerance match for', powerValue, 'hp...');
      for (let i = -10; i <= 10; i++) {
        const tolerantPower = `${powerValue + i}hp`;
        for (const [key, data] of Object.entries(ENGINE_ECU_DATABASE)) {
          if (key.startsWith(capacity + '-') && key.endsWith('-' + tolerantPower)) {
            console.log('Match found with power tolerance:', key);
            return data;
          }
        }
      }
      
      // Last resort: match just by capacity with similar power range
      console.log('Last resort: matching by capacity only...');
      const capacityMatches = Object.entries(ENGINE_ECU_DATABASE).filter(([key]) => 
        key.startsWith(capacity + '-')
      );
      if (capacityMatches.length > 0) {
        // Find closest power match
        let closest = null;
        let closestDiff = Infinity;
        for (const [key, data] of capacityMatches) {
          const keyPower = parseInt(key.match(/-(\d+)hp$/)?.[1] || 0);
          const diff = Math.abs(keyPower - powerValue);
          if (diff < closestDiff) {
            closestDiff = diff;
            closest = { key, data };
          }
        }
        if (closest && closestDiff <= 30) {
          console.log('Closest match found:', closest.key, '(diff:', closestDiff, 'hp)');
          return closest.data;
        }
      }
    }
    
    console.log('No engine data found for:', engineKey);
    return null;
  }

  // Upload functionality (wizard-based)
  function initUpload() {
    const dropZone = document.getElementById('drop-zone-wizard');
    const fileInput = document.getElementById('file-input-wizard');
    const nextBtn = document.getElementById('next-step-btn');
    const backBtn = document.getElementById('back-step-btn');
    const submitBtn = document.getElementById('submit-upload-btn');
    const viewFilesBtn = document.getElementById('view-files-wizard-btn');
    
    // Initialize vehicle selection dropdowns
    const manufacturerSelect = document.getElementById('vehicle-manufacturer');
    const modelSelect = document.getElementById('vehicle-model');
    const yearSelect = document.getElementById('vehicle-year');
    const engineSelect = document.getElementById('vehicle-engine');
    const vrmInput = document.getElementById('vehicle-registration');
    const vrmLookupBtn = document.getElementById('vrm-lookup-btn');
    const vrmStatus = document.getElementById('vrm-lookup-status');
    
    console.log('Vehicle dropdowns found:', {
      manufacturer: !!manufacturerSelect,
      model: !!modelSelect,
      year: !!yearSelect,
      engine: !!engineSelect
    });

    populateManufacturerSelect(manufacturerSelect);
    hydrateVehicleDataFromAPI().then(() => {
      populateManufacturerSelect(manufacturerSelect);
    });
    
    // Initialize vehicle details card as hidden
    const detailsCard = document.getElementById('vehicle-details-display');
    if (detailsCard) {
      detailsCard.style.display = 'none';
    }

    // VRM lookup via backend proxy
    const setVrmStatus = (message, tone = 'info') => {
      if (!vrmStatus) return;
      vrmStatus.textContent = message;
      vrmStatus.className = `vrm-status vrm-${tone}`;
    };

    const normalizeMakeKey = (make) => {
      if (!make) return '';
      const key = make.toLowerCase().trim();
      const aliases = {
        'mercedes-benz': 'mercedes',
        'mercedes benz': 'mercedes',
        'land rover': 'land-rover',
        'alfa romeo': 'alfa-romeo',
        'rolls royce': 'rolls-royce',
        'vw': 'volkswagen',
        'vauxhall': 'vauxhall',
        'bmc': 'mini'
      };
      if (aliases[key]) return aliases[key];
      return key.replace(/[^a-z0-9]+/g, '-').replace(/--+/g, '-');
    };

    const matchesYearRange = (rangeText, year) => {
      if (!rangeText || Number.isNaN(year)) return false;
      const clean = rangeText.trim();
      const [start, end] = clean.split('-').map(v => parseInt(v, 10));
      if (!Number.isNaN(start) && !Number.isNaN(end)) return year >= start && year <= end;
      if (!Number.isNaN(start) && clean.endsWith('+')) return year >= start;
      return year === start;
    };

    const normalizeEngineText = (text) => (text || '')
      .toLowerCase()
      .replace(/[^a-z0-9.\s-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const buildEngineCandidates = (vehicle) => {
      const candidates = [];
      if (vehicle.engineLabel) candidates.push(vehicle.engineLabel);
      if (vehicle.engine) candidates.push(vehicle.engine);
      if (vehicle.engineCapacity && vehicle.fuelType) {
        candidates.push(`${vehicle.engineCapacity} ${vehicle.fuelType}`);
      }
      if (vehicle.engineCapacity) {
        candidates.push(String(vehicle.engineCapacity));
      }
      if (vehicle.powerBhp) {
        const powerText = String(vehicle.powerBhp).toLowerCase().includes('hp')
          ? String(vehicle.powerBhp)
          : `${vehicle.powerBhp}hp`;
        candidates.push(powerText);
      }
      return candidates
        .map(normalizeEngineText)
        .filter(Boolean);
    };

    const trySelectOption = (selectEl, matcher) => {
      if (!selectEl) return null;
      const match = Array.from(selectEl.options).find((opt) => matcher(opt));
      if (match) {
        selectEl.value = match.value;
        selectEl.dispatchEvent(new Event('change'));
        return match;
      }
      return null;
    };

    const applyVrmSuggestion = (vehicle) => {
      const result = {
        manufacturer: false,
        model: false,
        year: false,
        engine: false
      };

      if (!vehicle || !manufacturerSelect) return result;

      if (vehicle.make) {
        const makeKey = normalizeMakeKey(vehicle.make);
        const matchedManufacturer = trySelectOption(
          manufacturerSelect,
          (opt) => opt.value === makeKey || normalizeMakeKey(opt.textContent) === makeKey
        );
        result.manufacturer = !!matchedManufacturer;
      }

      if (result.manufacturer && vehicle.model && modelSelect) {
        const modelKey = normalizeModelKey(vehicle.model);
        const matchedModel = trySelectOption(
          modelSelect,
          (opt) => opt.value === modelKey || normalizeModelKey(opt.textContent) === modelKey
        );
        result.model = !!matchedModel;
      }

      if (result.model && vehicle.year && yearSelect) {
        const yearNum = parseInt(vehicle.year, 10);
        const matchedYear = trySelectOption(
          yearSelect,
          (opt) => matchesYearRange(opt.value, yearNum)
        );
        result.year = !!matchedYear;
      }

      if (result.year && vehicle.engineLabel && engineSelect) {
        const normalizedCandidates = buildEngineCandidates(vehicle);
        const matchedEngine = trySelectOption(
          engineSelect,
          (opt) => opt.value && normalizedCandidates.some((candidate) => normalizeEngineText(opt.textContent).includes(candidate))
        );
        result.engine = !!matchedEngine;
      }

      return result;
    };

    const handleVrmLookup = async () => {
      if (!vrmInput) return;
      const vrmValue = vrmInput.value.trim();
      if (!vrmValue) {
        setVrmStatus('Enter a registration to look up.', 'error');
        return;
      }

      const vrm = vrmValue.replace(/\s+/g, '').toUpperCase();
      vrmInput.value = vrm;
      setVrmStatus('Looking up vehicle...', 'loading');

      if (vrmLookupBtn) {
        vrmLookupBtn.disabled = true;
        vrmLookupBtn.textContent = 'Checking...';
      }

      try {
        const response = await fetch(`${API_URL}/api/dvla-lookup?vrm=${encodeURIComponent(vrm)}`);
        let data = {};
        try {
          data = await response.json();
        } catch (parseError) {
          data = {};
        }

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Lookup failed');
        }

        const selection = applyVrmSuggestion(data.vehicle || {});
        const filled = [
          selection.manufacturer ? 'make' : null,
          selection.model ? 'model' : null,
          selection.year ? 'year' : null,
          selection.engine ? 'engine' : null
        ].filter(Boolean).join(', ');

        const summary = [data.vehicle?.make, data.vehicle?.model, data.vehicle?.year].filter(Boolean).join(' ');
        const needsEngine = selection.year && !selection.engine;
        const suffix = filled ? `Filled: ${filled}.` : 'Please confirm details.';
        const engineNote = needsEngine ? ' Select the correct engine if it differs.' : '';

        setVrmStatus(`Found ${summary || 'vehicle'}. ${suffix}${engineNote}`, 'success');
      } catch (err) {
        setVrmStatus(err.message || 'Lookup failed', 'error');
      } finally {
        if (vrmLookupBtn) {
          vrmLookupBtn.disabled = false;
          vrmLookupBtn.textContent = 'Lookup';
        }
      }
    };

    if (vrmLookupBtn && vrmInput) {
      vrmLookupBtn.addEventListener('click', handleVrmLookup);
      vrmInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleVrmLookup();
        }
      });
    }
    
    // Expose vehicle matching function globally for dashboard use
    window.matchVehicleFromAPI = function(vehicle) {
      if (!vehicleDatabase || !manufacturerSelect) {
        console.warn('Vehicle database not available for matching');
        return null;
      }
      
      try {
        const selection = applyVrmSuggestion(vehicle);
        const filled = [
          selection.manufacturer ? 'make' : null,
          selection.model ? 'model' : null,
          selection.year ? 'year' : null,
          selection.engine ? 'engine' : null
        ].filter(Boolean).join(', ');
        
        const summary = [vehicle.make, vehicle.model, vehicle.year].filter(Boolean).join(' ');
        const needsEngine = selection.year && !selection.engine;
        const suffix = filled ? `Filled: ${filled}` : 'Please confirm details';
        const engineNote = needsEngine ? ' Select the correct engine if it differs' : '';
        
        return `${summary || 'Vehicle'} - ${suffix}${engineNote}`;
      } catch (e) {
        console.error('Vehicle matching error:', e);
        return null;
      }
    };
    
    if (manufacturerSelect && modelSelect) {
      console.log('Attaching vehicle selection event listeners...');
      
      // Populate models when manufacturer changes
      manufacturerSelect.addEventListener('change', (e) => {
        const manufacturer = e.target.value;
        console.log('Manufacturer changed to:', manufacturer);
        modelSelect.innerHTML = '<option value="">Select Model</option>';
        yearSelect.innerHTML = '<option value="">Select Year Range</option>';
        engineSelect.innerHTML = '<option value="">Select Engine</option>';
        
        // Populate models
        if (manufacturer && VEHICLE_DATABASE[manufacturer]) {
          console.log('Found models for', manufacturer, ':', VEHICLE_DATABASE[manufacturer]);
          VEHICLE_DATABASE[manufacturer].forEach(model => {
            const option = document.createElement('option');
            option.value = normalizeModelKey(model);
            option.textContent = model;
            modelSelect.appendChild(option);
          });
          console.log('Populated', VEHICLE_DATABASE[manufacturer].length, 'models');
        } else {
          console.warn('No models found for manufacturer:', manufacturer);
        }
      });

      // Populate year ranges when model changes
      modelSelect.addEventListener('change', (e) => {
        const manufacturer = manufacturerSelect.value;
        const model = e.target.value;
        console.log('Model changed to:', model, 'for manufacturer:', manufacturer);
        yearSelect.innerHTML = '<option value="">Select Year Range</option>';
        engineSelect.innerHTML = '<option value="">Select Engine</option>';
        
        // Find the correct model key in the database
        const actualModelKey = findModelInDatabase(manufacturer, model);
        console.log('Found model key:', actualModelKey);
        
        if (manufacturer && actualModelKey && VEHICLE_ENGINE_DATABASE[manufacturer] && VEHICLE_ENGINE_DATABASE[manufacturer][actualModelKey]) {
          // Get all year ranges for this model
          const yearRanges = Object.keys(VEHICLE_ENGINE_DATABASE[manufacturer][actualModelKey]);
          console.log('Found year ranges:', yearRanges);
          
          // Sort year ranges by start year descending
          yearRanges.sort((a, b) => {
            const startA = parseInt(a.split('-')[0]);
            const startB = parseInt(b.split('-')[0]);
            return startB - startA;
          });
          
          yearRanges.forEach(range => {
            const option = document.createElement('option');
            option.value = range;
            option.textContent = range;
            yearSelect.appendChild(option);
          });
          
          // Store the actual key for later use
          modelSelect.dataset.actualKey = actualModelKey;
          console.log('Populated', yearRanges.length, 'year ranges');
        } else {
          // Fallback to standard year ranges if model not in detailed database
          const fallbackYears = ['2021-2026', '2017-2020', '2013-2016', '2009-2012', '2005-2008', '2000-2004'];
          fallbackYears.forEach(range => {
            const option = document.createElement('option');
            option.value = range;
            option.textContent = range;
            yearSelect.appendChild(option);
          });
          modelSelect.dataset.actualKey = '';
          console.log('Using fallback year ranges');
        }
        
        // updateVehicleDetails(); // Disabled for upload - no need to show details
      });

      // Populate engines when year range changes
      yearSelect.addEventListener('change', (e) => {
        const manufacturer = manufacturerSelect.value;
        const model = modelSelect.value;
        const actualModelKey = modelSelect.dataset.actualKey || model;
        const yearRange = e.target.value;
        console.log('Year changed to:', yearRange, 'for model:', actualModelKey);
        engineSelect.innerHTML = '<option value="">Select Engine</option>';
        
        let engines = null;
        if (manufacturer && actualModelKey && yearRange && VEHICLE_ENGINE_DATABASE[manufacturer] && VEHICLE_ENGINE_DATABASE[manufacturer][actualModelKey]) {
          // Get engines for this specific year range
          engines = VEHICLE_ENGINE_DATABASE[manufacturer][actualModelKey][yearRange];
          console.log('Found engines from database:', engines);
        }
        
        // Strict mode: only show year-verified engines
        if (!engines || engines.length === 0) {
          const option = document.createElement('option');
          option.value = '';
          option.textContent = 'No verified engines for selected year';
          engineSelect.appendChild(option);
          engineSelect.disabled = true;
          console.warn('No verified engines for selected model/year:', manufacturer, actualModelKey, yearRange);
          return;
        }

        engineSelect.disabled = false;

        engines.forEach(engine => {
          const option = document.createElement('option');
          option.value = engine.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '').replace(/--+/g, '-');
          option.textContent = engine;
          option.dataset.label = engine;
          engineSelect.appendChild(option);
        });
        console.log('Populated', engines.length, 'engines');
        
        // updateVehicleDetails(); // Disabled for upload - no need to show details
      });
      
      // Update details when engine changes
      // Disabled for upload - we don't need to show the detailed vehicle card
      // if (engineSelect) {
      //   engineSelect.addEventListener('change', updateVehicleDetails);
      // }
    }

    // Function to update vehicle details display
    function updateVehicleDetails() {
      const manufacturer = manufacturerSelect?.value || '';
      const model = modelSelect?.value || '';
      const engine = engineSelect?.value || '';
      
      const detailsCard = document.getElementById('vehicle-details-display');
      if (!detailsCard) return;

      // If no engine selected, hide the card
      if (!engine) {
        detailsCard.style.display = 'none';
        return;
      }

      // Try to find engine data with fallback logic
      const engineData = findEngineData(engine);
      
      if (!engineData) {
        detailsCard.style.display = 'none';
        return;
      }

      detailsCard.style.display = 'block';

      // Update header
      const manufacturerName = manufacturerSelect.options[manufacturerSelect.selectedIndex]?.text || 'Vehicle';
      const modelName = modelSelect.options[modelSelect.selectedIndex]?.text || 'Model';
      const engineName = engineSelect.options[engineSelect.selectedIndex]?.text || '';
      const headerElement = detailsCard.querySelector('.vehicle-header h4');
      if (headerElement) {
        headerElement.textContent = `${manufacturerName} → ${modelName} → ${engineName}`;
      }

      // Update engine specs using specific selectors
      const specItems = detailsCard.querySelectorAll('.spec-item');
      
      // Engine Capacity (first spec-item)
      if (specItems[0]) {
        const capacityValue = specItems[0].querySelector('.spec-value');
        if (capacityValue) capacityValue.textContent = engineData.capacity;
      }
      
      // Cylinders (second spec-item)
      if (specItems[1]) {
        const cylindersValue = specItems[1].querySelector('.spec-value');
        if (cylindersValue) cylindersValue.textContent = engineData.cylinders;
      }
      
      // Aspiration (third spec-item - has spec-badge class)
      if (specItems[2]) {
        const aspirationValue = specItems[2].querySelector('.spec-badge');
        if (aspirationValue) aspirationValue.textContent = engineData.aspiration;
      }
      
      // Engine Bore (fourth spec-item)
      if (specItems[3]) {
        const boreValue = specItems[3].querySelector('.spec-value');
        if (boreValue) boreValue.textContent = engineData.bore;
      }
      
      // Fuel (fifth spec-item - has spec-badge-fuel class)
      if (specItems[4]) {
        const fuelValue = specItems[4].querySelector('.spec-badge-fuel');
        if (fuelValue) {
          fuelValue.textContent = engineData.fuel;
          // Update fuel badge color
          if (engineData.fuel === 'Diesel') {
            fuelValue.style.background = '#10b981';
            fuelValue.style.color = '#fff';
          } else if (engineData.fuel === 'Petrol') {
            fuelValue.style.background = '#3b82f6';
            fuelValue.style.color = '#fff';
          } else if (engineData.fuel.includes('Hybrid')) {
            fuelValue.style.background = '#8b5cf6';
            fuelValue.style.color = '#fff';
          } else {
            fuelValue.style.background = '#6b7280';
            fuelValue.style.color = '#fff';
          }
        }
      }

      // Update ECU section
      const ecuContainer = detailsCard.querySelector('.ecu-section');
      if (ecuContainer) {
        const ecuBadgesHtml = engineData.ecu.map(ecu => 
          `<div class="ecu-badge">${ecu}</div>`
        ).join('');
        
        ecuContainer.innerHTML = `
          <div class="ecu-header">
            <span class="ecu-icon">💾</span>
            <span>ECUs:</span>
          </div>
          <div class="ecu-badges">${ecuBadgesHtml}</div>
        `;
      }

      // Update tools section
      const toolsSection = detailsCard.querySelector('.tools-compatibility');
      if (toolsSection) {
        const toolLogosHtml = engineData.tools.map(tool => 
          `<div class="tool-logo">${tool}</div>`
        ).join('');
        
        toolsSection.innerHTML = `
          <div class="tools-header">
            <span class="tools-icon">🔧</span>
            <span>Check your tool's compatibility:</span>
          </div>
          <div class="tools-logos">${toolLogosHtml}</div>
        `;
      }
      
      // Update performance gains section
      const performanceSection = detailsCard.querySelector('.performance-section');
      if (performanceSection && engineData.stock && engineData.stage1) {
        const stage1PowerGain = engineData.stage1.power - engineData.stock.power;
        const stage1TorqueGain = engineData.stage1.torque - engineData.stock.torque;
        
        performanceSection.innerHTML = `
          <div class="performance-header">
            <span class="performance-icon">⚡</span>
            <span>Options available:</span>
          </div>
          <div class="stage-options">
            <div class="stage-badge">✓ Specific DTC Disable</div>
            <div class="stage-badge">✓ Launch control</div>
            <div class="stage-badge">✓ Pops & Bangs</div>
            <div class="stage-badge">✓ Start/Stop Disable</div>
            <div class="stage-badge">✓ Decat</div>
            <div class="stage-badge">✓ Speed Limiter Disable</div>
            <div class="stage-badge">✓ Anti lag</div>
          </div>
          
          <div class="performance-gains">
            <div class="stage-card">
              <div class="stage-header">Stage 1</div>
              <div class="gain-row">
                <div class="gain-item">
                  <span class="gain-label">POWER:</span>
                  <div class="gain-values">
                    <span class="stock-value">${engineData.stock.power}</span>
                    <span class="arrow">→</span>
                    <span class="tuned-value">${engineData.stage1.power}</span>
                    <span class="gain-plus">+${stage1PowerGain}</span>
                    <span class="unit">hp</span>
                  </div>
                </div>
                <div class="gain-item">
                  <span class="gain-label">TORQUE:</span>
                  <div class="gain-values">
                    <span class="stock-value">${engineData.stock.torque}</span>
                    <span class="arrow">→</span>
                    <span class="tuned-value">${engineData.stage1.torque}</span>
                    <span class="gain-plus">+${stage1TorqueGain}</span>
                    <span class="unit">nm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="quote-section" style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; text-align: center;">
            <div style="color: white; font-size: 18px; font-weight: 600; margin-bottom: 15px;">
              💬 Get Your Custom Quote
            </div>
            <div style="color: rgba(255,255,255,0.9); margin-bottom: 20px; font-size: 14px;">
              Interested in this tune? Contact us for a personalized quote!
            </div>
            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
              <button class="quote-btn whatsapp-quote" style="background: #25D366; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 14px; transition: all 0.3s;">
                <span style="font-size: 18px;">📱</span>
                WhatsApp Quote
              </button>
              <button class="quote-btn email-quote" style="background: #EA4335; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 14px; transition: all 0.3s;">
                <span style="font-size: 18px;">📧</span>
                Email Quote
              </button>
            </div>
          </div>
        `;
      }
      
      // Add event listeners for quote buttons
      setTimeout(() => {
        const whatsappBtn = document.querySelector('.whatsapp-quote');
        const emailBtn = document.querySelector('.email-quote');
        
        if (whatsappBtn) {
          whatsappBtn.addEventListener('click', () => {
            const manufacturer = manufacturerSelect.options[manufacturerSelect.selectedIndex]?.text || 'Unknown';
            const model = modelSelect.options[modelSelect.selectedIndex]?.text || 'Unknown';
            const year = yearSelect.options[yearSelect.selectedIndex]?.text || 'Unknown';
            const engine = engineSelect.options[engineSelect.selectedIndex]?.text || 'Unknown';
            
            const message = encodeURIComponent(
              `Hi! I'm interested in getting a quote for:\n\n` +
              `Vehicle: ${manufacturer} ${model}\n` +
              `Year: ${year}\n` +
              `Engine: ${engine}\n` +
              `Stage: Stage 1 Remap\n\n` +
              `Stock Power: ${engineData.stock.power}hp → Tuned: ${engineData.stage1.power}hp (+${engineData.stage1.power - engineData.stock.power}hp)\n` +
              `Stock Torque: ${engineData.stock.torque}nm → Tuned: ${engineData.stage1.torque}nm (+${engineData.stage1.torque - engineData.stock.torque}nm)\n\n` +
              `Please provide me with a quote and any additional information I need to know.\n\n` +
              `Thank you!`
            );
            
            window.open(`https://wa.me/${CONTACT_SETTINGS.whatsappNumber.replace(/\s/g, '')}?text=${message}`, '_blank');
          });
        }
        
        if (emailBtn) {
          emailBtn.addEventListener('click', () => {
            const manufacturer = manufacturerSelect.options[manufacturerSelect.selectedIndex]?.text || 'Unknown';
            const model = modelSelect.options[modelSelect.selectedIndex]?.text || 'Unknown';
            const year = yearSelect.options[yearSelect.selectedIndex]?.text || 'Unknown';
            const engine = engineSelect.options[engineSelect.selectedIndex]?.text || 'Unknown';
            
            const subject = encodeURIComponent(`Quote Request: ${manufacturer.toUpperCase()} ${model} - ${engine}`);
            const body = encodeURIComponent(
              `Hi,\n\n` +
              `I'm interested in getting a quote for a remap on my vehicle:\n\n` +
              `Vehicle Details:\n` +
              `- Make: ${manufacturer.toUpperCase()}\n` +
              `- Model: ${model}\n` +
              `- Year: ${year}\n` +
              `- Engine: ${engine}\n\n` +
              `Performance Gains (Stage 1):\n` +
              `- Power: ${engineData.stock.power}hp → ${engineData.stage1.power}hp (+${engineData.stage1.power - engineData.stock.power}hp)\n` +
              `- Torque: ${engineData.stock.torque}nm → ${engineData.stage1.torque}nm (+${engineData.stage1.torque - engineData.stock.torque}nm)\n\n` +
              `Additional Options I'm interested in:\n` +
              `[ ] Specific DTC Disable\n` +
              `[ ] Launch Control\n` +
              `[ ] Pops & Bangs\n` +
              `[ ] Start/Stop Disable\n` +
              `[ ] Decat\n` +
              `[ ] Speed Limiter Disable\n` +
              `[ ] Anti Lag\n\n` +
              `Please provide me with:\n` +
              `- Pricing\n` +
              `- Availability\n` +
              `- Any other information I need to know\n\n` +
              `Thank you!\n\n` +
              `Best regards`
            );
            
            window.location.href = `mailto:${CONTACT_SETTINGS.email}?subject=${subject}&body=${body}`;
          });
        }
      }, 100);
    }
    
    if (!dropZone || !fileInput) return;
    
    let uploadedFile = null;
    
    // Click drop zone to browse
    dropZone.addEventListener('click', () => {
      fileInput.click();
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        uploadedFile = e.target.files[0];
        showFileInfo(uploadedFile);
      }
    });
    
    // Drag and drop
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = '#3b82f6';
    });
    
    dropZone.addEventListener('dragleave', () => {
      dropZone.style.borderColor = '#334155';
    });
    
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = '#334155';
      if (e.dataTransfer.files.length > 0) {
        uploadedFile = e.dataTransfer.files[0];
        fileInput.files = e.dataTransfer.files;
        showFileInfo(uploadedFile);
      }
    });
    
    // Show file info
    function showFileInfo(file) {
      dropZone.style.display = 'none';
      const fileInfo = document.getElementById('uploaded-file-info');
      fileInfo.style.display = 'flex';
      document.getElementById('uploaded-file-name').textContent = file.name;
      document.getElementById('uploaded-file-size').textContent = formatFileSize(file.size);
    }
    
    // Remove file
    const removeBtn = document.getElementById('remove-file-btn');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        uploadedFile = null;
        fileInput.value = '';
        dropZone.style.display = 'block';
        document.getElementById('uploaded-file-info').style.display = 'none';
      });
    }
    
    // Next step
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        // Validate step 1
        if (!uploadedFile) {
          alert('Please upload a file');
          return;
        }
        
        // Switch to step 2
        document.getElementById('wizard-step-1').classList.remove('active');
        document.getElementById('wizard-step-2').classList.add('active');
        document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
        document.querySelector('[data-step="2"]').classList.add('active');
      });
    }
    
    // Back step
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        document.getElementById('wizard-step-2').classList.remove('active');
        document.getElementById('wizard-step-1').classList.add('active');
        document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
        document.querySelector('[data-step="1"]').classList.add('active');
      });
    }
    
    // Submit
    if (submitBtn) {
      submitBtn.addEventListener('click', async () => {
        if (!uploadedFile) {
          alert('Please upload a file');
          return;
        }
        
        try {
          // Get form data
          const vehicleType = document.getElementById('vehicle-type').value;
          const manufacturer = document.getElementById('vehicle-manufacturer').value;
          const model = document.getElementById('vehicle-model').value;
          const year = document.getElementById('vehicle-year').value;
          const engine = document.getElementById('vehicle-engine').value;
          const registration = document.getElementById('vehicle-registration').value;
          const transmission = document.querySelector('input[name="transmission"]:checked').value;
          const solution = document.querySelector('input[name="solution"]:checked')?.value || 'stage1';
          
          // Get display names from dropdowns
          const manufacturerSelect = document.getElementById('vehicle-manufacturer');
          const manufacturerName = manufacturerSelect.options[manufacturerSelect.selectedIndex]?.text || manufacturer;
          const modelSelect = document.getElementById('vehicle-model');
          const modelName = modelSelect.options[modelSelect.selectedIndex]?.text || model;
          const engineSelect = document.getElementById('vehicle-engine');
          const engineName = engineSelect.options[engineSelect.selectedIndex]?.text || engine;
          
          console.log('Form values:', {
            manufacturer, model, year, engine, registration,
            manufacturerName, modelName, engineName
          });
          
          // Collect selected solutions with pricing
          const selectedSolutions = [];
          const solutionRadio = document.querySelector('input[name="solution"]:checked');
          if (solutionRadio) {
            const solutionCard = solutionRadio.closest('.solution-card-modern');
            const solutionName = solutionCard.querySelector('h4').textContent;
            // Use data-price attribute for more reliable pricing
            const price = parseInt(solutionRadio.getAttribute('data-price')) || 0;
            selectedSolutions.push({ name: solutionName, price: price });
          }
          
          // Collect selected options with pricing
          const selectedOptions = [];
          document.querySelectorAll('input[name="option"]:checked').forEach(checkbox => {
            const optionCard = checkbox.closest('.option-card-modern');
            const optionName = optionCard.querySelector('.option-name-modern').textContent.trim();
            // Use data-price attribute for more reliable pricing
            const price = parseInt(checkbox.getAttribute('data-price')) || 0;
            
            selectedOptions.push({
              name: optionName,
            price: price
          });
        });
        
        // Calculate total price
        let totalPrice = 0;
        selectedSolutions.forEach(s => totalPrice += s.price);
        selectedOptions.forEach(o => totalPrice += o.price);
        
        // Read file as Data URL (base64) for proper storage and download
        const fileData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(uploadedFile);
        });
        
        // Get current user info
        const currentUser = CarnageAuth.getCurrentUser();
        const customerEmail = currentUser ? currentUser.email : 'unknown@unknown.com';
        const customerName = currentUser ? currentUser.name : 'Unknown';
        
        // Check user has sufficient credit
        const userCredit = await CarnageAuth.getUserCredit();
        if (userCredit < totalPrice) {
          alert(`Insufficient credit! You need £${totalPrice.toFixed(2)} but only have £${userCredit.toFixed(2)}.\n\nPlease top up your account in the Billing tab.`);
          return;
        }
        
        // Upload to Supabase with complete vehicle info
        const fileMetadata = {
          filename: uploadedFile.name,
          size: uploadedFile.size,
          customerEmail: customerEmail,
          customerName: customerName,
          vehicle: `${manufacturerName} ${modelName}`,
          manufacturer: manufacturerName || manufacturer,
          model: modelName || model,
          year: year,
          engine: engineName || engine,
          registration: registration,
          transmission: transmission,
          ecu: 'Bosch EDC17',
          tcu: 'N/A',
          tool: 'Autotuner',
          stage: solution,
          solutions: selectedSolutions,
          options: selectedOptions,
          totalPrice: totalPrice,
          status: 'queued'
        };
        
        console.log('🚀 UPLOADING FILE WITH METADATA:');
        console.log('  Customer:', customerName, '(', customerEmail, ')');
        console.log('  Vehicle:', `${manufacturerName} ${modelName} ${year}`);
        console.log('  Engine:', engineName);
        console.log('  Registration:', registration);
        console.log('  Full metadata:', JSON.stringify(fileMetadata, null, 2));
        
        await SupabaseFiles.uploadFile(fileMetadata, uploadedFile);
          
          console.log('✅ FILE UPLOADED SUCCESSFULLY TO SUPABASE');
          
          // Deduct the total price from user's credit balance
          await CarnageAuth.updateUserCredit(-totalPrice);
          
          // Add transaction record
          try {
            await CarnageAuth.addTransaction({
              type: 'file_upload',
              amount: -totalPrice,
              description: `File Upload: ${uploadedFile.name} - ${manufacturerName} ${modelName} ${engineName}`,
              timestamp: new Date().toISOString(),
              details: {
                fileName: uploadedFile.name,
                vehicle: `${manufacturerName} ${modelName}`,
                solutions: selectedSolutions.map(s => s.name).join(', '),
                options: selectedOptions.map(o => o.name).join(', ')
              }
            });
          } catch (transactionError) {
            console.error('Failed to add transaction record:', transactionError);
            // Continue with success flow even if transaction logging fails
          }
          
          // Update credit display
          if (typeof loadCreditBalance === 'function') {
            loadCreditBalance();
          }
          if (typeof updateCreditDisplay === 'function') {
            updateCreditDisplay();
          }
          
          // Show success message with auto-dismiss - PROMINENT BANNER
          const successMsg = document.createElement('div');
          successMsg.id = 'upload-success-banner';
          successMsg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            padding: 40px 50px;
            border-radius: 12px;
            font-size: 18px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 8px 24px rgba(0,0,0,0.4);
            text-align: center;
            border-left: 6px solid #2e7d32;
          `;
          successMsg.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 10px;">✅ FILE UPLOAD CONFIRMED</div>
            <div style="font-size: 16px; margin: 10px 0;">📧 Email notification sent to admin</div>
            <div style="font-size: 14px; color: #e8f5e9; margin-top: 15px;">Redirecting to Files tab...</div>
          `;
          document.body.appendChild(successMsg);
          
          console.log('🎉 SUCCESS BANNER DISPLAYED');
          
          // Auto-dismiss after 4 seconds
          setTimeout(() => {
            if (document.getElementById('upload-success-banner')) {
              successMsg.style.opacity = '0';
              successMsg.style.transition = 'opacity 0.3s ease-out';
              setTimeout(() => successMsg.remove(), 300);
            }
          }, 4000);
          
          // Show success
          document.getElementById('upload-success-wizard').style.display = 'block';
          
          // Reset form
          uploadedFile = null;
          fileInput.value = '';
          dropZone.style.display = 'block';
          document.getElementById('uploaded-file-info').style.display = 'none';
          document.getElementById('wizard-step-2').classList.remove('active');
          document.getElementById('wizard-step-1').classList.add('active');
          document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
          document.querySelector('[data-step="1"]').classList.add('active');
          
          // Update dashboard and auto-navigate to files tab after 3 seconds
          updateDashboardStats();
          console.log('📄 Navigating to Files tab in 3 seconds...');
          setTimeout(() => {
            const filesTab = document.querySelector('[data-tab="files"]');
            if (filesTab) {
              filesTab.click();
              console.log('🔄 Navigated to Files tab');
            }
          }, 3000);
          
        } catch (error) {
          console.error('Upload error:', error);
          alert('Error uploading file: ' + error.message);
        }
      });
    }
    
    // View files button
    if (viewFilesBtn) {
      viewFilesBtn.addEventListener('click', () => {
        document.querySelector('[data-tab="files"]').click();
      });
    }
  }

  // Handle file upload
  async function handleFiles(files) {
    const fileArray = Array.from(files);
    const maxSize = 100 * 1024 * 1024; // 100MB
    
    // Validate files
    const validFiles = fileArray.filter(file => {
      if (file.size > maxSize) {
        alert(`${file.name} is too large. Maximum file size is 100MB.`);
        return false;
      }
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    // Show progress
    const progressContainer = document.getElementById('upload-progress');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const successMessage = document.getElementById('upload-success');
    
    progressContainer.style.display = 'block';
    successMessage.style.display = 'none';
    
    // Process files
    let completed = 0;
    const total = validFiles.length;
    
    for (const file of validFiles) {
      try {
        // Read file as base64
        const fileData = await readFileAsBase64(file);
        
        // Get current user info
        const currentUser = CarnageAuth.getCurrentUser();
        const customerEmail = currentUser ? currentUser.email : 'unknown@unknown.com';
        const customerName = currentUser ? currentUser.name : 'Unknown';
        
        // Save to IndexedDB
        await saveFile({
          name: file.name,
          size: file.size,
          type: file.type,
          data: fileData,
          uploadDate: new Date().toISOString(),
          customerEmail: customerEmail,
          customerName: customerName,
          status: 'queued'
        });
        
        completed++;
        const progress = (completed / total) * 100;
        progressFill.style.width = progress + '%';
        progressText.textContent = `Uploading ${completed} of ${total} files...`;
        
      } catch (error) {
        console.error('Error uploading file:', error);
        alert(`Error uploading ${file.name}`);
      }
    }
    
    // Show success
    progressContainer.style.display = 'none';
    successMessage.style.display = 'block';
    
    // Reset file input
    document.getElementById('file-input').value = '';
    
    // Update dashboard
    updateDashboardStats();
  }

  // Read file as base64
  function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  // Display files in the Files tab (table format)
  async function displayFiles() {
    const tableBody = document.getElementById('files-table-body');
    
    if (!tableBody) return;
    
    try {
      const allFiles = await getAllFiles();
      
      // Get current user's email and role
      const currentUser = CarnageAuth.getCurrentUser();
      const userEmail = currentUser ? currentUser.email : null;
      const isAdminUser = await CarnageAuth.isAdmin();
      
      // Filter files based on role
      // Admin sees ALL files, regular users see only their own
      const files = isAdminUser 
        ? allFiles 
        : (userEmail ? allFiles.filter(file => file.customerEmail === userEmail) : []);
      
      if (files.length === 0) {
        const emptyMessage = isAdminUser 
          ? 'No files uploaded yet by any user.'
          : 'No files uploaded yet. <a href="#" data-tab="upload">Upload your first file</a>';
        tableBody.innerHTML = `<tr><td colspan="${isAdminUser ? 8 : 6}" class="table-empty">${emptyMessage}</td></tr>`;
        // Re-bind tab navigation
        const link = tableBody.querySelector('[data-tab]');
        if (link) {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.cr-nav [data-tab="upload"]').click();
          });
        }
        return;
      }
      
      // Sort by upload date (newest first)
      files.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
      
      // Update table header based on role
      const tableHeader = document.querySelector('#files-table-wrapper thead tr');
      if (tableHeader) {
        if (isAdminUser) {
          tableHeader.innerHTML = `
            <th>#</th>
            <th class="sortable" data-sort="date">Last Updated <span class="sort-icon">↕</span></th>
            <th class="sortable" data-sort="customer">Customer <span class="sort-icon">↕</span></th>
            <th class="sortable" data-sort="email">Email <span class="sort-icon">↕</span></th>
            <th class="sortable" data-sort="name">Vehicle <span class="sort-icon">↕</span></th>
            <th class="sortable" data-sort="registration">Registration <span class="sort-icon">↕</span></th>
            <th class="sortable" data-sort="status">Status <span class="sort-icon">↕</span></th>
            <th>Action</th>
          `;
        } else {
          tableHeader.innerHTML = `
            <th>#</th>
            <th class="sortable" data-sort="date">Last Updated <span class="sort-icon">↕</span></th>
            <th class="sortable" data-sort="name">Vehicle <span class="sort-icon">↕</span></th>
            <th class="sortable" data-sort="registration">Registration <span class="sort-icon">↕</span></th>
            <th class="sortable" data-sort="status">Status <span class="sort-icon">↕</span></th>
            <th>Action</th>
          `;
        }
      }
      
      // Build table rows
      tableBody.innerHTML = files.map((file, index) => {
        const uploadDate = new Date(file.uploadDate);
        const now = new Date();
        const diffTime = Math.abs(now - uploadDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        
        let timeAgo = '';
        if (diffDays === 0) {
          if (diffHours === 0) {
            timeAgo = 'Just now';
          } else {
            timeAgo = `${diffHours}h ago`;
          }
        } else {
          timeAgo = `${diffDays}d ago`;
        }
        
        const status = file.status || 'queued';
        const statusClass = `status-${status}`;
        const statusText = status === 'in-progress' ? 'In Progress' : 
                          status === 'queued' ? 'Queued' : 
                          status === 'completed' ? 'Completed' :
                          'Returned';
        
        // Build vehicle display string
        const manufacturer = file.manufacturer || '';
        const model = file.model || '';
        const year = file.year || '';
        const engine = file.engine || 'Unknown Engine';
        
        const vehicleDisplay = manufacturer && model 
          ? `${manufacturer} ${model} ${year}`.trim()
          : (file.vehicle || 'Unknown Vehicle');
        
        const fullVehicleInfo = `${vehicleDisplay}<br><small style="opacity:0.7">${engine}</small>`;
        
        // Message count
        const messageCount = file.messages ? file.messages.length : 0;
        const messageBadge = messageCount > 0 
          ? `<span style="background:#10b981;color:white;padding:2px 6px;border-radius:10px;font-size:0.75rem;font-weight:600;margin-left:4px;">${messageCount}</span>` 
          : '';
        
        // Admin sees customer info, regular users don't
        if (isAdminUser) {
          const customerName = file.customerName || 'Unknown';
          const customerEmail = file.customerEmail || 'N/A';
          const requirements = file.requirements || 'No requirements specified';
          
          return `
            <tr data-file-id="${file.id}">
              <td>${file.id || index + 1}</td>
              <td>${timeAgo}</td>
              <td><strong>${escapeHtml(customerName)}</strong></td>
              <td>${escapeHtml(customerEmail)}</td>
              <td>${fullVehicleInfo}</td>
              <td>${escapeHtml(file.registration || 'N/A')}</td>
              <td><span class="status-badge ${statusClass}">${statusText}</span></td>
              <td>
                <button class="btn small primary view-file-btn" data-file-id="${file.id}" title="View Details">
                  💬 View${messageBadge}
                </button>
                <button class="btn small danger delete-file-btn" data-file-id="${file.id}" title="Delete">Delete</button>
              </td>
            </tr>
          `;
        } else {
          return `
            <tr data-file-id="${file.id}">
              <td>${file.id || index + 1}</td>
              <td>${timeAgo}</td>
              <td>${fullVehicleInfo}</td>
              <td>${escapeHtml(file.registration || 'N/A')}</td>
              <td><span class="status-badge ${statusClass}">${statusText}</span></td>
              <td>
                <button class="btn small primary view-file-btn" data-file-id="${file.id}" title="View Details">
                  💬 View${messageBadge}
                </button>
              </td>
            </tr>
          `;
        }
      }).join('');
      
      // Bind action buttons
      document.querySelectorAll('.view-file-btn').forEach(btn => {
        btn.addEventListener('click', () => viewFileDetails(parseInt(btn.dataset.fileId)));
      });
      
      document.querySelectorAll('.delete-file-btn').forEach(btn => {
        btn.addEventListener('click', () => confirmDeleteFile(parseInt(btn.dataset.fileId)));
      });
      
    } catch (error) {
      console.error('Error displaying files:', error);
      tableBody.innerHTML = '<tr><td colspan="6" class="table-error">Error loading files. Please refresh the page.</td></tr>';
    }
  }

  // View file details in modal
  async function viewFileDetails(fileId) {
    try {
      // Get file from Supabase
      const file = await getFileById(fileId);
      
      if (!file) {
        alert('File not found');
        return;
      }
      
      const isAdminUser = await CarnageAuth.isAdmin();
      const uploadDate = new Date(file.uploadDate).toLocaleString();
      
      // Build vehicle info display
      const manufacturer = file.manufacturer || 'Unknown';
      const model = file.model || 'Unknown';
      const year = file.year || 'Unknown';
      const engine = file.engine || 'Unknown';
      const registration = file.registration || 'N/A';
        
        let modalContent = `
          <div class="modal-overlay" id="file-details-modal" onclick="if(event.target === this) this.remove()">
            <div class="modal">
              <div class="modal-content">
                <div class="modal-header">
                  <h2>File Details</h2>
                  <button class="modal-close" onclick="document.getElementById('file-details-modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                  <h3>Vehicle Information</h3>
                  <div class="info-grid">
                    <div class="info-item">
                      <label>Manufacturer:</label>
                      <span>${escapeHtml(manufacturer)}</span>
                    </div>
                    <div class="info-item">
                      <label>Model:</label>
                      <span>${escapeHtml(model)}</span>
                    </div>
                    <div class="info-item">
                      <label>Year:</label>
                      <span>${escapeHtml(year)}</span>
                    </div>
                    <div class="info-item">
                      <label>Engine:</label>
                      <span>${escapeHtml(engine)}</span>
                    </div>
                    <div class="info-item">
                      <label>Registration:</label>
                      <span>${escapeHtml(registration)}</span>
                    </div>
                </div>
        `;
        
        // Show customer details and tuning options for admin
        if (isAdminUser) {
          modalContent += `
                <h3 style="border-bottom: 2px solid #dc2626; padding-bottom: 0.5rem; color: #dc2626;">👤 Customer Information</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <label>Name:</label>
                    <span><strong>${escapeHtml(file.customerName || 'Unknown')}</strong></span>
                  </div>
                  <div class="info-item">
                    <label>Email:</label>
                    <span><a href="mailto:${escapeHtml(file.customerEmail || '')}" style="color: #3b82f6;">${escapeHtml(file.customerEmail || 'N/A')}</a></span>
                  </div>
                  <div class="info-item full-width" style="background: #f3f4f6; padding: 0.75rem; border-radius: 6px;">
                    <label>Customer Requirements:</label>
                    <span style="font-style: italic;">${escapeHtml(file.requirements || 'No requirements specified')}</span>
                  </div>
                </div>
          `;
          
          // Display tuning options for admin
          if (file.solutions || file.options) {
            modalContent += `
                <h3 style="border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; color: #8b5cf6;">🔧 Tuning Options Requested</h3>
                <div class="info-grid">
            `;
            
            // Display selected stage/solution
            if (file.solutions && file.solutions.length > 0) {
              modalContent += `
                  <div class="info-item full-width" style="background: #f0fdf4; padding: 0.75rem; border-radius: 6px; border-left: 4px solid #10b981;">
                    <label>Selected Stage:</label>
                    <span><strong style="color: #059669; font-size: 1.1rem;">${escapeHtml(file.solutions[0].name)}</strong> <span style="color: #10b981; font-weight: 600;">(£${file.solutions[0].price})</span></span>
                  </div>
              `;
            }
            
            // Display selected options
            if (file.options && file.options.length > 0) {
              const optionsList = file.options.map(opt => 
                opt.price > 0 ? `<span style="background: #dbeafe; padding: 0.25rem 0.5rem; border-radius: 4px; margin-right: 0.5rem; display: inline-block; margin-bottom: 0.5rem;">${escapeHtml(opt.name)} <strong style="color: #2563eb;">(+£${opt.price})</strong></span>` : `<span style="background: #e5e7eb; padding: 0.25rem 0.5rem; border-radius: 4px; margin-right: 0.5rem; display: inline-block; margin-bottom: 0.5rem;">${escapeHtml(opt.name)}</span>`
              ).join('');
              
              modalContent += `
                  <div class="info-item full-width">
                    <label>Additional Options:</label>
                    <div>${optionsList}</div>
                  </div>
              `;
              
              // Calculate total price with discount
              const solutionPrice = file.solutions && file.solutions.length > 0 ? file.solutions[0].price : 0;
              const optionsTotal = file.options.reduce((sum, opt) => sum + (opt.price || 0), 0);
              const subtotal = solutionPrice + optionsTotal;
              
              // Display total price
              modalContent += `
                <div class="info-item full-width" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1rem; border-radius: 8px; margin-top: 0.5rem;">
                  <label style="color: white; font-size: 1rem;">💰 Total Price:</label>
                  <span style="color: white; font-size: 1.5rem; font-weight: 700;">£${subtotal}</span>
                </div>
              `;
            }
            
            // Display transmission
            if (file.transmission) {
              modalContent += `
                  <div class="info-item">
                    <label>Transmission:</label>
                    <span style="background: #fef3c7; padding: 0.25rem 0.75rem; border-radius: 4px; font-weight: 600;">${escapeHtml(file.transmission.charAt(0).toUpperCase() + file.transmission.slice(1))}</span>
                  </div>
              `;
            }
            
            modalContent += `
                </div>
            `;
          }
        }
        
        modalContent += `
                <h3>File Information</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <label>Filename:</label>
                    <span>${escapeHtml(file.name)}</span>
                  </div>
                  <div class="info-item">
                    <label>Size:</label>
                    <span>${formatFileSize(file.size)}</span>
                  </div>
                  <div class="info-item">
                    <label>Upload Date:</label>
                    <span>${uploadDate}</span>
                  </div>
                  <div class="info-item">
                    <label>Status:</label>
                    <span class="status-badge status-${file.status || 'queued'}" id="modal-status-badge">${capitalizeStatus(file.status || 'queued')}</span>
                  </div>
        `;
        
        // Show tuned file info if uploaded (admin only)
        if (isAdminUser && file.tunedFile) {
          const tunedUploadDate = new Date(file.tunedFile.uploadDate).toLocaleString();
          modalContent += `
                  <div class="info-item full-width" style="background: #e8f5e9; padding: 0.75rem; border-radius: 4px; margin-top: 0.5rem;">
                    <label style="color: #2e7d32;">✓ Tuned File Uploaded:</label>
                    <span style="color: #2e7d32;"><strong>${escapeHtml(file.tunedFile.name)}</strong> (${formatFileSize(file.tunedFile.size)}) - ${tunedUploadDate}</span>
                  </div>
          `;
        }
        
        modalContent += `
                </div>
              </div>
              <div class="modal-footer">
        `;
        
        // Add status management controls for admin
        if (isAdminUser) {
          modalContent += `
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
                  <button class="btn" style="background: #6c757d; color: white;" onclick="changeFileStatus(${fileId}, 'queued')">Mark as Queued</button>
                  <button class="btn" style="background: #ffc107; color: #000;" onclick="changeFileStatus(${fileId}, 'in-progress')">Mark as In Progress</button>
                  <button class="btn" style="background: #28a745; color: white;" onclick="changeFileStatus(${fileId}, 'completed')">Mark as Completed</button>
                  <button class="btn" style="background: #dc3545; color: white;" onclick="changeFileStatus(${fileId}, 'returned')">Mark as Returned</button>
                </div>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
                  <button class="btn" style="background: #007bff; color: white;" onclick="uploadTunedFile(${fileId})">
                    <span style="margin-right: 0.5rem;">📤</span> Upload Tuned File
                  </button>
                  <button class="btn" style="background: #17a2b8; color: white;" onclick="returnTunedFileToClient(${fileId})">
                    <span style="margin-right: 0.5rem;">📧</span> Send Tuned File to Client
                  </button>
                </div>
          `;
        }
        
        modalContent += `
                <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                  <button class="btn primary" onclick="downloadFile(${fileId})">Download Original File</button>
        `;
        
        // Add download tuned file button if tuned file exists (check both Supabase and IndexedDB formats)
        if (file.tunedFile || file.modifiedFile || file.modified_file) {
          modalContent += `
                  <button class="btn" id="download-tuned-btn-${fileId}" style="background: linear-gradient(135deg, #10b981, #059669); color: white; font-weight: 700; box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4); animation: pulse-green 2s infinite;" onclick="downloadTunedFile(${fileId})">
                    ⚡ Download Tuned File ⚡
                  </button>
          `;
        } else {
          // Show placeholder button when no tuned file is available
          modalContent += `
                  <button class="btn" disabled style="background: #6b7280; color: white; opacity: 0.6; cursor: not-allowed;">
                    🔧 Tuned File Not Ready
                  </button>
          `;
        }
        
        modalContent += `
                  <button class="btn secondary" onclick="document.getElementById('file-details-modal').remove()">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalContent);
    } catch (error) {
      console.error('Error viewing file:', error);
      alert('Error loading file details');
    }
  }

  // Change file status (admin only)
  async function changeFileStatus(fileId, newStatus) {
    try {
      console.log('Changing file status:', fileId, 'to', newStatus);
      
      // Use Supabase updateFile if available, otherwise fall back to IndexedDB
      if (window.updateFile) {
        await window.updateFile(fileId, { status: newStatus });
      } else {
        await updateFileStatus(fileId, newStatus);
      }
      
      // Update the status badge in the modal
      const statusBadge = document.getElementById('modal-status-badge');
      if (statusBadge) {
        statusBadge.className = `status-badge status-${newStatus}`;
        statusBadge.textContent = capitalizeStatus(newStatus);
      }
      
      // Refresh the files display
      await displayFiles();
      
      // Show success message
      console.log(`✅ File status updated to: ${newStatus}`);
      alert(`File status updated to: ${capitalizeStatus(newStatus)}`);
    } catch (error) {
      console.error('❌ Error updating file status:', error);
      alert('Failed to update file status: ' + error.message);
    }
  }

  // Capitalize status for display
  function capitalizeStatus(status) {
    if (!status) return 'Queued';
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  // Upload tuned file for a customer's original file (admin only)
  async function uploadTunedFile(originalFileId) {
    try {
      // Create file input element
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.bin,.hex,.ori,.mod';
      
      fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
          // Upload modified file to Supabase
          const result = await SupabaseFiles.uploadModifiedFile(originalFileId, file, file.name);
          
          alert('Tuned file uploaded successfully!');
          
          // Close and reopen modal to show updated info
          document.getElementById('file-details-modal').remove();
          viewFileDetails(originalFileId);
        } catch (error) {
          console.error('Error uploading tuned file:', error);
          alert('Failed to upload tuned file: ' + error.message);
        }
      };
      
      // Trigger file selection
      fileInput.click();
    } catch (error) {
      console.error('Error in uploadTunedFile:', error);
      alert('Failed to upload tuned file');
    }
  }

  // Send tuned file to client via email/notification (admin only)
  async function returnTunedFileToClient(fileId) {
    try {
      console.log('Returning tuned file to client for file ID:', fileId);
      
      // Get file details using Supabase
      const file = await getFileById(fileId);
      
      if (!file) {
        alert('File not found');
        return;
      }
      
      // Check for tuned file (handle both formats)
      const tunedFileUrl = file.modifiedFile || file.modified_file;
      
      if (!tunedFileUrl) {
        alert('No tuned file has been uploaded yet. Please upload the tuned file first.');
        return;
      }
      
      // Get customer details (handle both formats)
      const customerName = file.customerName || file.customer_name || 'Customer';
      const customerEmail = file.customerEmail || file.customer_email || '';
      const fileName = file.filename || file.name || 'tuned_file.bin';
      
      if (!customerEmail) {
        alert('Customer email not found. Cannot send file.');
        return;
      }
      
      // Confirm action
      const confirmed = confirm(`Send tuned file to ${customerName} (${customerEmail})?\n\nThis will:\n1. Mark the file as "returned"\n2. Send an email notification to the customer\n3. Provide them with a download link`);
      
      if (!confirmed) return;
      
      // Update status to returned
      await changeFileStatus(fileId, 'returned');
      
      // Create email notification
      const emailSubject = `Your Tuned File is Ready - ${fileName}`;
      const emailBody = `Hi ${customerName},\n\nGreat news! Your tuned file is ready for download.\n\nFile: ${fileName}\nDownload Link: ${tunedFileUrl}\n\nPlease download your file within the next 30 days.\n\nIf you have any questions, please contact us.\n\nBest regards,\nCarnage Remaps Team`;
      
      // In production, you would send this via your email service
      // For now, we'll open the default email client
      const mailtoLink = `mailto:${customerEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      
      window.location.href = mailtoLink;
      
      // Also download the file for admin's records
      const a = document.createElement('a');
      a.href = tunedFileUrl;
      a.download = 'tuned_' + fileName;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      console.log('✅ File marked as returned and email template opened');
      alert(`✅ File marked as "returned"\n\nEmail template opened with download link for ${customerEmail}`);
      
      // Refresh the file display
      await displayFiles();
      
    } catch (error) {
      console.error('❌ Error returning file to client:', error);
      alert('Failed to return file to client: ' + error.message);
    }
  }

  // Update pagination display
  function updatePagination(totalFiles) {
    const startEl = document.getElementById('pagination-start');
    const endEl = document.getElementById('pagination-end');
    const totalEl = document.getElementById('pagination-total');
    
    if (startEl) startEl.textContent = totalFiles > 0 ? '1' : '0';
    if (endEl) endEl.textContent = totalFiles.toString();
    if (totalEl) totalEl.textContent = totalFiles.toString();
  }

  // Initialize Vehicle Search page
  function initVehicleSearch() {
    const searchManufacturer = document.getElementById('search-manufacturer');
    const searchModel = document.getElementById('search-model');
    const searchYear = document.getElementById('search-year');
    const searchEngine = document.getElementById('search-engine');
    const searchBtn = document.getElementById('search-vehicle-btn');
    const searchResults = document.getElementById('search-results');
    const emptyState = document.getElementById('search-empty-state');
    // VRM elements for search page
    const vrmInputSearch = document.getElementById('search-vrm');
    const vrmBtnSearch = document.getElementById('search-vrm-btn');
    const vrmStatusSearch = document.getElementById('search-vrm-status');
    
    if (!searchManufacturer || !searchModel || !searchYear || !searchEngine || !searchBtn) return;

    populateManufacturerSelect(searchManufacturer);
    hydrateVehicleDataFromAPI().then(() => {
      populateManufacturerSelect(searchManufacturer);
    });
    
    // Populate model dropdown when manufacturer changes
    searchManufacturer.addEventListener('change', (e) => {
      const manufacturer = e.target.value;
      searchModel.innerHTML = '<option value="">Select Model</option>';
      searchYear.innerHTML = '<option value="">Select Year</option>';
      searchEngine.innerHTML = '<option value="">Select Engine</option>';
      
      if (manufacturer && VEHICLE_DATABASE[manufacturer]) {
        VEHICLE_DATABASE[manufacturer].forEach(model => {
          const option = document.createElement('option');
          option.value = normalizeModelKey(model);
          option.textContent = model;
          searchModel.appendChild(option);
        });
      }
    });
    
    // Populate year dropdown when model changes
    searchModel.addEventListener('change', (e) => {
      const manufacturer = searchManufacturer.value;
      const model = e.target.value;
      searchYear.innerHTML = '<option value="">Select Year Range</option>';
      searchEngine.innerHTML = '<option value="">Select Engine</option>';
      
      // Find the correct model key in the database
      const actualModelKey = findModelInDatabase(manufacturer, model);
      
      if (manufacturer && actualModelKey && VEHICLE_ENGINE_DATABASE[manufacturer][actualModelKey]) {
        // Get all year ranges for this model and display them directly
        const yearRanges = Object.keys(VEHICLE_ENGINE_DATABASE[manufacturer][actualModelKey]);
        
        // Sort year ranges by start year descending
        yearRanges.sort((a, b) => {
          const startA = parseInt(a.split('-')[0]);
          const startB = parseInt(b.split('-')[0]);
          return startB - startA;
        });
        
        yearRanges.forEach(range => {
          const option = document.createElement('option');
          option.value = range;
          option.textContent = range;
          searchYear.appendChild(option);
        });
        
        // Store the actual key for later use
        searchModel.dataset.actualKey = actualModelKey;
      } else {
        // Fallback to standard year ranges if model not in detailed database
        const fallbackYears = ['2021-2026', '2017-2020', '2013-2016', '2009-2012', '2005-2008', '2000-2004'];
        fallbackYears.forEach(range => {
          const option = document.createElement('option');
          option.value = range;
          option.textContent = range;
          searchYear.appendChild(option);
        });
        searchModel.dataset.actualKey = '';
      }
    });
    
    // Populate engine dropdown when year range changes
    searchYear.addEventListener('change', (e) => {
      const manufacturer = searchManufacturer.value;
      const model = searchModel.value;
      const actualModelKey = searchModel.dataset.actualKey || model;
      const yearRange = e.target.value;
      searchEngine.innerHTML = '<option value="">Select Engine</option>';
      
      let engines = null;
      
      if (manufacturer && actualModelKey && yearRange && VEHICLE_ENGINE_DATABASE[manufacturer] && VEHICLE_ENGINE_DATABASE[manufacturer][actualModelKey]) {
        // Get engines for this specific year range
        engines = VEHICLE_ENGINE_DATABASE[manufacturer][actualModelKey][yearRange];
      }
      
      // Strict mode: only show year-verified engines
      if (!engines || engines.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No verified engines for selected year';
        searchEngine.appendChild(option);
        searchEngine.disabled = true;
        return;
      }

      searchEngine.disabled = false;

      engines.forEach(engine => {
        const option = document.createElement('option');
        option.value = engine.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '').replace(/--+/g, '-');
        option.textContent = engine;
        searchEngine.appendChild(option);
      });
    });

    // --- VRM Lookup for Vehicle Search ---
    const displayVehicleDetailsCard = (vehicle) => {
      // Create a details card showing all rich vehicle data - integrated with existing design
      if (!vrmStatusSearch || !vrmStatusSearch.parentElement) return;
      
      let detailsHtml = `<div style="margin-top: 1.5rem; padding: 1.5rem; background: #1a2a3a; border-radius: 8px; border: 1px solid #2d4059;">`;
      
      // Identification section
      if (vehicle.vin || vehicle.engineNumber || vehicle.v5cCount) {
        detailsHtml += `<div style="margin-bottom: 1.5rem;">
          <h4 style="margin: 0 0 0.75rem 0; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Identification</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            ${vehicle.vin ? `<div style="padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: 6px;"><div style="font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 0.25rem;">VIN</div><div style="font-size: 0.875rem; color: #f1f5f9; font-family: monospace;">${vehicle.vin}</div></div>` : ''}
            ${vehicle.engineNumber ? `<div style="padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: 6px;"><div style="font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 0.25rem;">Engine #</div><div style="font-size: 0.875rem; color: #f1f5f9; font-family: monospace;">${vehicle.engineNumber}</div></div>` : ''}
            ${vehicle.v5cCount ? `<div style="padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: 6px;"><div style="font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 0.25rem;">V5C Count</div><div style="font-size: 0.875rem; color: #f1f5f9;">${vehicle.v5cCount}</div></div>` : ''}
          </div>
        </div>`;
      }
      
      // Performance section
      if (vehicle.powerBhp || vehicle.torqueNm || vehicle.maxSpeedKph || vehicle.co2) {
        detailsHtml += `<div style="margin-bottom: 1.5rem;">
          <h4 style="margin: 0 0 0.75rem 0; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Performance</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.75rem;">
            ${vehicle.powerBhp ? `<div style="padding: 0.75rem; background: linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.05)); border-radius: 6px; border-left: 3px solid #3b82f6;"><div style="font-size: 0.75rem; color: #94a3b8; margin-bottom: 0.25rem;">Power</div><div style="font-size: 1rem; font-weight: 600; color: #3b82f6;">${vehicle.powerBhp}<span style="font-size: 0.875rem;">bhp</span></div>${vehicle.powerRpm ? `<div style="font-size: 0.75rem; color: #64748b;">@ ${vehicle.powerRpm}rpm</div>` : ''}</div>` : ''}
            ${vehicle.torqueNm ? `<div style="padding: 0.75rem; background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05)); border-radius: 6px; border-left: 3px solid #10b981;"><div style="font-size: 0.75rem; color: #94a3b8; margin-bottom: 0.25rem;">Torque</div><div style="font-size: 1rem; font-weight: 600; color: #10b981;">${vehicle.torqueNm}<span style="font-size: 0.875rem;">nm</span></div>${vehicle.torqueRpm ? `<div style="font-size: 0.75rem; color: #64748b;">@ ${vehicle.torqueRpm}rpm</div>` : ''}</div>` : ''}
            ${vehicle.maxSpeedKph ? `<div style="padding: 0.75rem; background: linear-gradient(135deg, rgba(251,146,60,0.1), rgba(251,146,60,0.05)); border-radius: 6px; border-left: 3px solid #fb923c;"><div style="font-size: 0.75rem; color: #94a3b8; margin-bottom: 0.25rem;">Max Speed</div><div style="font-size: 1rem; font-weight: 600; color: #fb923c;">${vehicle.maxSpeedKph}<span style="font-size: 0.875rem;">kph</span></div></div>` : ''}
            ${vehicle.co2 ? `<div style="padding: 0.75rem; background: linear-gradient(135deg, rgba(168,85,247,0.1), rgba(168,85,247,0.05)); border-radius: 6px; border-left: 3px solid #a855f7;"><div style="font-size: 0.75rem; color: #94a3b8; margin-bottom: 0.25rem;">CO₂</div><div style="font-size: 1rem; font-weight: 600; color: #a855f7;">${vehicle.co2}<span style="font-size: 0.875rem;">g/km</span></div></div>` : ''}
          </div>
        </div>`;
      }
      
      // Engine section
      if (vehicle.numberOfCylinders || vehicle.bore || vehicle.stroke || vehicle.aspiration || vehicle.valveGear || vehicle.fuelTankCapacity) {
        detailsHtml += `<div style="margin-bottom: 1.5rem;">
          <h4 style="margin: 0 0 0.75rem 0; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Engine Details</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.75rem; font-size: 0.875rem;">
            ${vehicle.numberOfCylinders ? `<div style="padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: 6px;"><div style="font-size: 0.7rem; color: #94a3b8; margin-bottom: 0.25rem;">Cylinders</div><div style="color: #f1f5f9;">${vehicle.numberOfCylinders}</div></div>` : ''}
            ${vehicle.aspiration ? `<div style="padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: 6px;"><div style="font-size: 0.7rem; color: #94a3b8; margin-bottom: 0.25rem;">Aspiration</div><div style="color: #f1f5f9; font-size: 0.8rem;">${vehicle.aspiration}</div></div>` : ''}
            ${vehicle.bore ? `<div style="padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: 6px;"><div style="font-size: 0.7rem; color: #94a3b8; margin-bottom: 0.25rem;">Bore</div><div style="color: #f1f5f9;">${vehicle.bore}mm</div></div>` : ''}
            ${vehicle.stroke ? `<div style="padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: 6px;"><div style="font-size: 0.7rem; color: #94a3b8; margin-bottom: 0.25rem;">Stroke</div><div style="color: #f1f5f9;">${vehicle.stroke}mm</div></div>` : ''}
            ${vehicle.valveGear ? `<div style="padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: 6px;"><div style="font-size: 0.7rem; color: #94a3b8; margin-bottom: 0.25rem;">Valve Gear</div><div style="color: #f1f5f9; font-size: 0.8rem;">${vehicle.valveGear}</div></div>` : ''}
            ${vehicle.fuelTankCapacity ? `<div style="padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: 6px;"><div style="font-size: 0.7rem; color: #94a3b8; margin-bottom: 0.25rem;">Fuel Tank</div><div style="color: #f1f5f9;">${vehicle.fuelTankCapacity}L</div></div>` : ''}
          </div>
        </div>`;
      }
      
      // Transmission & Drive
      if (vehicle.numberOfGears || vehicle.transmissionType || vehicle.driveType) {
        detailsHtml += `<div style="margin-bottom: 1.5rem;">
          <h4 style="margin: 0 0 0.75rem 0; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Transmission & Drive</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.75rem;">
            ${vehicle.numberOfGears ? `<div style="padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: 6px;"><div style="font-size: 0.7rem; color: #94a3b8; margin-bottom: 0.25rem;">Gears</div><div style="color: #f1f5f9; font-size: 0.875rem;">${vehicle.numberOfGears}</div></div>` : ''}
            ${vehicle.transmissionType ? `<div style="padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: 6px;"><div style="font-size: 0.7rem; color: #94a3b8; margin-bottom: 0.25rem;">Type</div><div style="color: #f1f5f9; font-size: 0.8rem;">${vehicle.transmissionType}</div></div>` : ''}
            ${vehicle.driveType ? `<div style="padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: 6px;"><div style="font-size: 0.7rem; color: #94a3b8; margin-bottom: 0.25rem;">Drive</div><div style="color: #f1f5f9; font-size: 0.8rem;">${vehicle.driveType}</div></div>` : ''}
          </div>
        </div>`;
      }
      
      // Body & Dimensions
      if (vehicle.numberOfDoors || vehicle.numberOfSeats || vehicle.length || vehicle.width || vehicle.height || vehicle.wheelbase) {
        detailsHtml += `<div style="margin-bottom: 1.5rem;">
          <h4 style="margin: 0 0 0.75rem 0; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Body & Dimensions</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 0.75rem; font-size: 0.875rem;">
            ${vehicle.numberOfDoors ? `<div style="padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: 6px;"><div style="font-size: 0.7rem; color: #94a3b8; margin-bottom: 0.25rem;">Doors</div><div style="color: #f1f5f9;">${vehicle.numberOfDoors}</div></div>` : ''}
            ${vehicle.numberOfSeats ? `<div style="padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: 6px;"><div style="font-size: 0.7rem; color: #94a3b8; margin-bottom: 0.25rem;">Seats</div><div style="color: #f1f5f9;">${vehicle.numberOfSeats}</div></div>` : ''}
            ${vehicle.length ? `<div style="padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: 6px;"><div style="font-size: 0.7rem; color: #94a3b8; margin-bottom: 0.25rem;">Length</div><div style="color: #f1f5f9;">${(vehicle.length / 1000).toFixed(2)}m</div></div>` : ''}
            ${vehicle.width ? `<div style="padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: 6px;"><div style="font-size: 0.7rem; color: #94a3b8; margin-bottom: 0.25rem;">Width</div><div style="color: #f1f5f9;">${(vehicle.width / 1000).toFixed(2)}m</div></div>` : ''}
            ${vehicle.height ? `<div style="padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: 6px;"><div style="font-size: 0.7rem; color: #94a3b8; margin-bottom: 0.25rem;">Height</div><div style="color: #f1f5f9;">${(vehicle.height / 1000).toFixed(2)}m</div></div>` : ''}
            ${vehicle.wheelbase ? `<div style="padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: 6px;"><div style="font-size: 0.7rem; color: #94a3b8; margin-bottom: 0.25rem;">Wheelbase</div><div style="color: #f1f5f9;">${(vehicle.wheelbase / 1000).toFixed(2)}m</div></div>` : ''}
          </div>
        </div>`;
      }
      
      // Weight & Towing
      if (vehicle.kerbWeight || vehicle.grossWeight || vehicle.towingCapacityBraked || vehicle.towingCapacityUnbraked) {
        detailsHtml += `<div style="margin-bottom: 0;">
          <h4 style="margin: 0 0 0.75rem 0; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Weight & Towing</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.75rem;">
            ${vehicle.kerbWeight ? `<div style="padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: 6px;"><div style="font-size: 0.7rem; color: #94a3b8; margin-bottom: 0.25rem;">Kerb</div><div style="color: #f1f5f9;">${vehicle.kerbWeight}kg</div></div>` : ''}
            ${vehicle.grossWeight ? `<div style="padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: 6px;"><div style="font-size: 0.7rem; color: #94a3b8; margin-bottom: 0.25rem;">Gross</div><div style="color: #f1f5f9;">${vehicle.grossWeight}kg</div></div>` : ''}
            ${vehicle.towingCapacityBraked ? `<div style="padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: 6px;"><div style="font-size: 0.7rem; color: #94a3b8; margin-bottom: 0.25rem;">Tow (B)</div><div style="color: #f1f5f9;">${vehicle.towingCapacityBraked}kg</div></div>` : ''}
            ${vehicle.towingCapacityUnbraked ? `<div style="padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: 6px;"><div style="font-size: 0.7rem; color: #94a3b8; margin-bottom: 0.25rem;">Tow (UB)</div><div style="color: #f1f5f9;">${vehicle.towingCapacityUnbraked}kg</div></div>` : ''}
          </div>
        </div>`;
      }
      
      detailsHtml += `</div>`;
      
      // Find or create container for details
      let detailsContainer = vrmStatusSearch.parentElement.querySelector('.vrm-details-card');
      if (!detailsContainer) {
        detailsContainer = document.createElement('div');
        detailsContainer.className = 'vrm-details-card';
        vrmStatusSearch.parentElement.appendChild(detailsContainer);
      }
      detailsContainer.innerHTML = detailsHtml;
    };

    const setVrmStatusSearch = (message, tone = 'info') => {
      if (!vrmStatusSearch) return;
      vrmStatusSearch.textContent = message;
      const base = 'vrm-status';
      const toneClass = `vrm-${tone}`;
      vrmStatusSearch.className = `${base} ${toneClass}`.trim();
    };

    const guessModelForVehicle = (vehicle) => {
      const makeKey = normalizeMakeKeySearch(vehicle.make);
      const yearNum = vehicle.year ? parseInt(vehicle.year, 10) : vehicle.yearOfManufacture ? parseInt(vehicle.yearOfManufacture, 10) : null;
      if (!makeKey || !VEHICLE_ENGINE_DATABASE[makeKey]) return null;

      const parseDisplacement = (text) => {
        const match = String(text || '').match(/(\d+(?:\.\d+)?)\s*(?:l|L)?/);
        if (!match) return null;
        const val = parseFloat(match[1]);
        return Number.isNaN(val) ? null : val;
      };

      const fuelKey = (text) => {
        const t = (text || '').toLowerCase();
        if (/diesel|tdi|d\b/.test(t)) return 'diesel';
        if (/petrol|tsi|gdi|tfs|tfsi|p\b/.test(t)) return 'petrol';
        return null;
      };

      // Infer target displacement in liters from DVLA capacity
      const targetDispLiters = (() => {
        const raw = vehicle.engineCapacity;
        if (!raw) return null;
        const n = parseFloat(raw);
        if (Number.isNaN(n)) return null;
        return n > 20 ? n / 1000 : n;
      })();

      // Infer target fuel
      const targetFuel = fuelKey(vehicle.fuelType || vehicle.engine || vehicle.engineLabel || '');

      // Model popularity bias for tiebreak (VW example)
      const modelBias = {
        'golf': -0.1,
        'polo': 0.2,
        'up': 0.3,
        'passat': 0.1,
        'tiguan': 0.15,
        'jetta': 0.25
      };

      let best = null;
      let bestScore = Number.POSITIVE_INFINITY;

      Object.entries(VEHICLE_ENGINE_DATABASE[makeKey]).forEach(([modelKey, ranges]) => {
        Object.entries(ranges).forEach(([range, engines]) => {
          // Year score
          let yearScore = 0;
          if (yearNum) {
            const [start, end] = range.split('-').map(v => parseInt(v, 10));
            if (!Number.isNaN(start) && !Number.isNaN(end) && yearNum >= start && yearNum <= end) {
              const mid = (start + end) / 2;
              yearScore = Math.abs(mid - yearNum);
            } else {
              yearScore = 50; // penalize out-of-range
            }
          }

          // Engine score (count matches for displacement + fuel within this model/year)
          let engineScore = 0;
          if (Array.isArray(engines) && engines.length) {
            let dispMatches = 0;
            let fuelMatches = 0;
            engines.forEach((eng) => {
              const disp = parseDisplacement(eng);
              const fe = fuelKey(eng);
              // Check displacement match (within 0.2L)
              if (targetDispLiters && disp && Math.abs(disp - targetDispLiters) <= 0.2) {
                dispMatches++;
              }
              // Check fuel match
              if (targetFuel && fe === targetFuel) {
                fuelMatches++;
              }
            });
            engineScore = -dispMatches * 2 - fuelMatches; // negative because we minimize score; more matches = lower score
          } else {
            engineScore = 10; // penalty if no engines listed
          }

          // Apply model bias
          const bias = modelBias[modelKey] || 0;

          const score = yearScore + engineScore + bias;
          if (score < bestScore) {
            bestScore = score;
            best = modelKey;
          }
        });
      });

      if (!best) {
        const firstModel = Object.keys(VEHICLE_ENGINE_DATABASE[makeKey])[0];
        if (firstModel) best = firstModel;
      }

      return best;
    };

    const normalizeMakeKeySearch = (make) => {
      if (!make) return '';
      const key = make.toLowerCase().trim();
      const aliases = {
        'mercedes-benz': 'mercedes',
        'mercedes benz': 'mercedes',
        'land rover': 'land-rover',
        'alfa romeo': 'alfa-romeo',
        'rolls royce': 'rolls-royce',
        'vw': 'volkswagen',
        'vauxhall': 'vauxhall',
        'bmc': 'mini'
      };
      if (aliases[key]) return aliases[key];
      return key.replace(/[^a-z0-9]+/g, '-').replace(/--+/g, '-');
    };

    const matchesYearRangeSearch = (rangeText, year) => {
      if (!rangeText || Number.isNaN(year)) return false;
      const clean = rangeText.trim();
      const [start, end] = clean.split('-').map(v => parseInt(v, 10));
      if (!Number.isNaN(start) && !Number.isNaN(end)) return year >= start && year <= end;
      if (!Number.isNaN(start) && clean.endsWith('+')) return year >= start;
      return year === start;
    };

    const normalizeEngineTextSearch = (text) => (text || '')
      .toLowerCase()
      .replace(/[^a-z0-9.\s-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const buildEngineCandidatesSearch = (vehicle) => {
      const candidates = [];
      if (vehicle.engineLabel) candidates.push(vehicle.engineLabel);
      if (vehicle.engine) candidates.push(vehicle.engine);
      if (vehicle.engineCapacity && vehicle.fuelType) {
        candidates.push(`${vehicle.engineCapacity} ${vehicle.fuelType}`);
      }
      if (vehicle.engineCapacity) {
        const raw = String(vehicle.engineCapacity);
        candidates.push(raw);
        const numeric = parseFloat(raw);
        if (!Number.isNaN(numeric)) {
          // Add liter variant when capacity looks like cc
          if (numeric > 20) {
            const liters = numeric / 1000;
            candidates.push(liters.toFixed(1));
            candidates.push(`${liters.toFixed(1)}l`);
          } else {
            candidates.push(numeric.toFixed(1));
            candidates.push(`${numeric.toFixed(1)}l`);
          }
        }
      }
      if (vehicle.powerBhp) {
        const powerText = String(vehicle.powerBhp).toLowerCase().includes('hp')
          ? String(vehicle.powerBhp)
          : `${vehicle.powerBhp}hp`;
        candidates.push(powerText);
      }
      return Array.from(new Set(candidates
        .map(normalizeEngineTextSearch)
        .filter(Boolean)));
    };

    const parseEngineOptionSearch = (text) => {
      const t = normalizeEngineTextSearch(text);
      const displacementMatch = t.match(/(\d+(?:\.\d+)?)\s*l/);
      const hpMatch = t.match(/(\d+)hp/);
      const fuel = /diesel|d\b/.test(t) ? 'diesel' : (/petrol|ts[ie]|fsi|gdi|p\b/.test(t) ? 'petrol' : null);
      let displacement = null;
      if (displacementMatch) {
        displacement = parseFloat(displacementMatch[1]);
      }
      return {
        displacement,
        hp: hpMatch ? parseInt(hpMatch[1], 10) : null,
        fuel,
        raw: t
      };
    };

    const trySelectOptionSearch = (selectEl, matcher) => {
      if (!selectEl) return null;
      const match = Array.from(selectEl.options).find((opt) => matcher(opt));
      if (match) {
        selectEl.value = match.value;
        selectEl.dispatchEvent(new Event('change'));
        return match;
      }
      return null;
    };

    const applyVrmSuggestionSearch = (vehicle) => {
      const result = { manufacturer: false, model: false, year: false, engine: false };
      if (!vehicle || !searchManufacturer) return result;

      const selectAndTrigger = (selectEl, option) => {
        if (!selectEl || !option) return null;
        selectEl.value = option.value;
        selectEl.dispatchEvent(new Event('change'));
        return option;
      };

      // Normalize year from yearOfManufacture when DVLA provides it
      if (!vehicle.year && vehicle.yearOfManufacture) {
        vehicle.year = vehicle.yearOfManufacture;
      }

      const deriveModelKeysSearch = (modelRaw) => {
        if (!modelRaw) return [];
        const cleaned = modelRaw
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        if (!cleaned) return [];
        const parts = cleaned.split(' ');
        const candidates = new Set();

        const pushModel = (text) => {
          if (!text) return;
          const norm = normalizeModelKey(text);
          if (norm) candidates.add(norm);
        };

        pushModel(cleaned); // full string
        pushModel(parts[0]); // first token (e.g., a3, golf, focus)
        if (parts.length >= 2) {
          pushModel(`${parts[0]} ${parts[1]}`); // first two tokens
          if (parts[1] === 'series' || parts[1] === 'class') {
            pushModel(`${parts[0]}-${parts[1]}`); // 3-series, c-class
          }
        }
        return Array.from(candidates);
      };

      if (vehicle.make) {
        const makeKey = normalizeMakeKeySearch(vehicle.make);
        const matchedManufacturer = trySelectOptionSearch(
          searchManufacturer,
          (opt) => opt.value === makeKey || normalizeMakeKeySearch(opt.textContent) === makeKey
        );
        result.manufacturer = !!matchedManufacturer;
      }

      if (result.manufacturer && vehicle.model && searchModel) {
        const modelKeys = deriveModelKeysSearch(vehicle.model);
        let matchedModel = null;

        // Exact/normalized matches across candidate keys
        for (const candidate of modelKeys) {
          matchedModel = trySelectOptionSearch(
            searchModel,
            (opt) => opt.value === candidate || normalizeModelKey(opt.textContent) === candidate
          );
          if (matchedModel) break;
        }

        // Fuzzy fallback: substring match either way for any candidate
        if (!matchedModel) {
          matchedModel = trySelectOptionSearch(
            searchModel,
            (opt) => {
              const optKey = normalizeModelKey(opt.textContent);
              return modelKeys.some((mk) => optKey.includes(mk) || mk.includes(optKey));
            }
          );
        }

        // If still nothing and only one real option exists, auto-select it
        if (!matchedModel && searchModel.options.length === 2) {
          matchedModel = selectAndTrigger(searchModel, searchModel.options[1]);
        }

        // If we have manufacturer but no model match, at least select first available
        if (!matchedModel) {
          const firstReal = Array.from(searchModel.options).find((opt) => opt.value);
          if (firstReal) {
            matchedModel = selectAndTrigger(searchModel, firstReal);
          }
        }
        result.model = !!matchedModel;
      }

      if (result.model && vehicle.year && searchYear) {
        const yearNum = parseInt(vehicle.year, 10);
        let matchedYear = trySelectOptionSearch(
          searchYear,
          (opt) => matchesYearRangeSearch(opt.value, yearNum)
        );

        // Fallback: pick closest range if within any; otherwise the first non-empty option
        if (!matchedYear && searchYear.options.length > 1 && !Number.isNaN(yearNum)) {
          const candidates = Array.from(searchYear.options).filter((opt) => opt.value);
          let best = null;
          let bestScore = Number.POSITIVE_INFINITY;
          candidates.forEach((opt) => {
            const [start, endRaw] = opt.value.split('-');
            const startNum = parseInt(start, 10);
            const endNum = parseInt(endRaw, 10);
            if (!Number.isNaN(startNum) && !Number.isNaN(endNum) && yearNum >= startNum && yearNum <= endNum) {
              const mid = (startNum + endNum) / 2;
              const score = Math.abs(mid - yearNum);
              if (score < bestScore) {
                bestScore = score;
                best = opt;
              }
            }
          });
          if (!best && candidates.length) best = candidates[0];
          if (best) {
            matchedYear = selectAndTrigger(searchYear, best);
          }
        }
        result.year = !!matchedYear;
      }

      if (result.year && searchEngine) {
        const normalizedCandidates = buildEngineCandidatesSearch(vehicle);
        let matchedEngine = null;

        if (normalizedCandidates.length) {
          // Score all options and pick best based on displacement/fuel/power proximity
          const targetDispLiters = (() => {
            if (!vehicle.engineCapacity) return null;
            const n = parseFloat(vehicle.engineCapacity);
            if (Number.isNaN(n)) return null;
            return n > 20 ? n / 1000 : n;
          })();
          const targetFuel = normalizeEngineTextSearch(vehicle.fuelType || '').includes('diesel') ? 'diesel'
            : (vehicle.fuelType ? 'petrol' : null);
          const targetHp = vehicle.powerBhp ? parseInt(vehicle.powerBhp, 10) : null;

          let best = null;
          let bestScore = Number.POSITIVE_INFINITY;

          Array.from(searchEngine.options).forEach((opt) => {
            if (!opt.value) return;
            const parsed = parseEngineOptionSearch(opt.textContent);

            let score = 0;

            if (targetDispLiters && parsed.displacement) {
              score += Math.abs(parsed.displacement - targetDispLiters) * 8; // weight displacement strongly
            } else if (targetDispLiters && !parsed.displacement) {
              score += 5; // penalty if we can't compare displacement
            }

            if (targetHp && parsed.hp) {
              score += Math.abs(parsed.hp - targetHp) * 0.1;
            }

            if (targetFuel && parsed.fuel && targetFuel !== parsed.fuel) {
              score += 5; // penalty for fuel mismatch
            }

            // If any candidate string is contained, give a small bonus
            const containsCandidate = normalizedCandidates.some((cand) => parsed.raw.includes(cand));
            if (containsCandidate) score -= 1;

            if (score < bestScore) {
              bestScore = score;
              best = opt;
            }
          });

          if (best) {
            matchedEngine = trySelectOptionSearch(searchEngine, (opt) => opt === best);
          }
        }

        // Fallback: if only one real option exists, pick it
        if (!matchedEngine && searchEngine.options.length === 2) {
          matchedEngine = selectAndTrigger(searchEngine, searchEngine.options[1]);
        }

        // Fallback: pick first non-empty option
        if (!matchedEngine) {
          const firstReal = Array.from(searchEngine.options).find((opt) => opt.value);
          if (firstReal) matchedEngine = selectAndTrigger(searchEngine, firstReal);
        }
        result.engine = !!matchedEngine;
      }

      return result;
    };

    const handleVrmLookupSearch = async () => {
      if (!vrmInputSearch) return;
      const vrmValue = vrmInputSearch.value.trim();
      if (!vrmValue) {
        setVrmStatusSearch('Enter a registration to look up.', 'error');
        return;
      }

      const vrm = vrmValue.replace(/\s+/g, '').toUpperCase();
      vrmInputSearch.value = vrm;
      setVrmStatusSearch('Looking up vehicle...', 'loading');

      if (vrmBtnSearch) {
        vrmBtnSearch.disabled = true;
        vrmBtnSearch.textContent = 'Checking...';
      }

      try {
        // Primary: DVLA
        const response = await fetch(`${API_URL}/api/dvla-lookup?vrm=${encodeURIComponent(vrm)}`);
        let data = {};
        try { data = await response.json(); } catch (_) { data = {}; }
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Lookup failed');
        }

        let vehicle = data.vehicle || {};
        let usedFallback = false;

        // Fallback: CheckCar if model/engine data is missing
        const needsModel = !vehicle.model;
        const needsEngine = !vehicle.engine && !vehicle.engineLabel && !vehicle.engineCapacity;
        if (needsModel || needsEngine) {
          try {
            const ccResp = await fetch(`${API_URL}/api/vrm-lookup?vrm=${encodeURIComponent(vrm)}`);
            let ccData = {};
            try { ccData = await ccResp.json(); } catch (_) { ccData = {}; }
            if (ccResp.ok && ccData.success && ccData.vehicle) {
              usedFallback = true;
              // Merge: keep DVLA make/year, fill missing model/engine fields from CheckCar
              vehicle = {
                ...ccData.vehicle,
                ...vehicle, // DVLA wins for make/year if present
              };
            }
          } catch (_) {
            // Ignore fallback errors
          }
        }

        const selection = applyVrmSuggestionSearch(vehicle);
        const filled = [
          selection.manufacturer ? 'make' : null,
          selection.model ? 'model' : null,
          selection.year ? 'year' : null,
          selection.engine ? 'engine' : null
        ].filter(Boolean).join(', ');

        const summary = [vehicle?.make, vehicle?.model, vehicle?.year].filter(Boolean).join(' ');
        const engineSpec = [vehicle?.powerBhp ? `${vehicle.powerBhp}hp` : null, vehicle?.torqueNm ? `${vehicle.torqueNm}nm` : null].filter(Boolean).join(' + ');
        const needsEngineNote = selection.year && !selection.engine;
        const suffix = filled ? `Filled: ${filled}.` : 'Please confirm details.';
        const engineNote = needsEngineNote ? ' Select the correct engine to continue.' : '';
        const perfDetail = engineSpec ? ` [${engineSpec}]` : '';
        const vinDetail = vehicle?.vin ? ` • VIN: ${vehicle.vin}` : '';
        setVrmStatusSearch(`Found ${summary || 'vehicle'}${perfDetail}${vinDetail}. ${suffix}${engineNote}`, 'success');

        // Display detailed vehicle specs card
        displayVehicleDetailsCard(vehicle);

        // If engine wasn’t auto-selected, scroll and highlight the engine selector
        if (needsEngineNote && searchEngine) {
          const fg = searchEngine.closest('.form-group') || searchEngine;
          fg.classList.add('highlight-pulse');
          searchEngine.focus();
          fg.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => fg.classList.remove('highlight-pulse'), 3000);
        }

        // Auto-run search when we have at least an engine selected
        if (selection.engine && searchBtn) {
          // Delay slightly to allow dropdown change handlers to complete
          setTimeout(() => searchBtn.click(), 50);
        }
      } catch (err) {
        setVrmStatusSearch(err.message || 'Lookup failed', 'error');
      } finally {
        if (vrmBtnSearch) {
          vrmBtnSearch.disabled = false;
          vrmBtnSearch.textContent = 'Lookup';
        }
      }
    };

    if (vrmBtnSearch && vrmInputSearch) {
      vrmBtnSearch.addEventListener('click', handleVrmLookupSearch);
      vrmInputSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleVrmLookupSearch();
        }
      });
    }
    
    // Search button click
    searchBtn.addEventListener('click', () => {
      const manufacturer = searchManufacturer.value;
      const model = searchModel.value;
      const yearRange = searchYear.value;
      const engineValue = searchEngine.value;
      
      if (!manufacturer || !model || !yearRange || !engineValue) {
        alert('Please select manufacturer, model, year range, and engine');
        return;
      }
      
      // Get display names
      const manufacturerName = searchManufacturer.options[searchManufacturer.selectedIndex].text;
      const modelName = searchModel.options[searchModel.selectedIndex].text;
      const engineText = searchEngine.options[searchEngine.selectedIndex].text;
      
      // Hide empty state, show results
      if (emptyState) emptyState.style.display = 'none';
      if (searchResults) {
        searchResults.style.display = 'block';
        searchResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      
      // Update vehicle header
      document.getElementById('result-vehicle-name').textContent = `${manufacturerName} → ${modelName} → ${engineText}`;
      document.getElementById('result-engine-name').textContent = engineText;
      
      // Try to find engine data using the proper lookup function
      let engineKey = engineText.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/\./g, '')
        .replace(/hp.*$/i, 'hp');
      
      console.log('Vehicle Search - Looking for engine:', engineText);
      console.log('Vehicle Search - Generated key:', engineKey);
      
      // Use global findEngineData function for proper matching
      const engineData = findEngineData(engineKey);
      
      console.log('Vehicle Search - Found engine data:', engineData ? 'YES' : 'NO');
      if (engineData) {
        console.log('Vehicle Search - Engine data:', engineData);
      }
      
      if (engineData) {
        // Populate all data
        document.getElementById('result-capacity').textContent = engineData.capacity;
        document.getElementById('result-cylinders').textContent = engineData.cylinders;
        document.getElementById('result-aspiration').textContent = engineData.aspiration;
        document.getElementById('result-bore').textContent = engineData.bore;
        document.getElementById('result-fuel').textContent = engineData.fuel;
        
        // ECU badges
        const ecuContainer = document.getElementById('result-ecu-badges');
        ecuContainer.innerHTML = engineData.ecu.map(ecu => 
          `<span style="background: #3b82f6; color: white; padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.875rem; font-weight: 500;">${ecu}</span>`
        ).join('');
        
        // Tools
        const toolsContainer = document.getElementById('result-tools');
        toolsContainer.innerHTML = engineData.tools.map(tool => 
          `<div style="background: #475569; color: white; padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.875rem; font-weight: 500;">${tool}</div>`
        ).join('');
        
        // Performance - Stage 1
        if (engineData.stock && engineData.stage1) {
          const powerGain = engineData.stage1.power - engineData.stock.power;
          const torqueGain = engineData.stage1.torque - engineData.stock.torque;
          
          console.log('Setting performance data:', {
            stockPower: engineData.stock.power,
            stage1Power: engineData.stage1.power,
            powerGain: powerGain,
            stockTorque: engineData.stock.torque,
            stage1Torque: engineData.stage1.torque,
            torqueGain: torqueGain
          });
          
          document.getElementById('result-stock-power').textContent = engineData.stock.power;
          document.getElementById('result-stage1-power').textContent = engineData.stage1.power;
          document.getElementById('result-gain-power').textContent = `+${powerGain}`;
          
          document.getElementById('result-stock-torque').textContent = engineData.stock.torque;
          document.getElementById('result-stage1-torque').textContent = engineData.stage1.torque;
          document.getElementById('result-gain-torque').textContent = `+${torqueGain}`;
          
          // Show/hide Stage 2 section
          const stage2Section = document.getElementById('stage2-section');
          if (engineData.stage2) {
            const powerGain2 = engineData.stage2.power - engineData.stock.power;
            const torqueGain2 = engineData.stage2.torque - engineData.stock.torque;
            
            document.getElementById('result-stock-power-s2').textContent = engineData.stock.power;
            document.getElementById('result-stage2-power').textContent = engineData.stage2.power;
            document.getElementById('result-gain-power-s2').textContent = `(+${powerGain2} hp)`;
            
            document.getElementById('result-stock-torque-s2').textContent = engineData.stock.torque;
            document.getElementById('result-stage2-torque').textContent = engineData.stage2.torque;
            document.getElementById('result-gain-torque-s2').textContent = `(+${torqueGain2} nm)`;
            
            stage2Section.style.display = 'block';
          } else {
            stage2Section.style.display = 'none';
          }
          
          // Show/hide Stage 3 section
          const stage3Section = document.getElementById('stage3-section');
          if (engineData.stage3) {
            const powerGain3 = engineData.stage3.power - engineData.stock.power;
            const torqueGain3 = engineData.stage3.torque - engineData.stock.torque;
            
            document.getElementById('result-stock-power-s3').textContent = engineData.stock.power;
            document.getElementById('result-stage3-power').textContent = engineData.stage3.power;
            document.getElementById('result-gain-power-s3').textContent = `(+${powerGain3} hp)`;
            
            document.getElementById('result-stock-torque-s3').textContent = engineData.stock.torque;
            document.getElementById('result-stage3-torque').textContent = engineData.stage3.torque;
            document.getElementById('result-gain-torque-s3').textContent = `(+${torqueGain3} nm)`;
            
            stage3Section.style.display = 'block';
          } else {
            stage3Section.style.display = 'none';
          }
        } else {
          console.warn('Missing stock or stage1 data in engine data');
          // Set fallback values
          document.getElementById('result-stock-power').textContent = '-';
          document.getElementById('result-stage1-power').textContent = '-';
          document.getElementById('result-gain-power').textContent = '-';
          document.getElementById('result-stock-torque').textContent = '-';
          document.getElementById('result-stage1-torque').textContent = '-';
          document.getElementById('result-gain-torque').textContent = '-';
          
          // Hide Stage 2 and Stage 3 sections when no data
          document.getElementById('stage2-section').style.display = 'none';
          document.getElementById('stage3-section').style.display = 'none';
        }
      } else {
        // Show basic info only
        document.getElementById('result-capacity').textContent = 'Data pending';
        document.getElementById('result-cylinders').textContent = '-';
        document.getElementById('result-aspiration').textContent = 'Turbocharged';
        document.getElementById('result-bore').textContent = '-';
        document.getElementById('result-fuel').textContent = 'Diesel';
        
        document.getElementById('result-ecu-badges').innerHTML = '<span style="color: #94a3b8;">ECU data pending</span>';
        document.getElementById('result-tools').innerHTML = '<span style="color: #94a3b8;">Tool data pending</span>';
        
        // Extract HP from engine text
        const hpMatch = engineText.match(/(\d+)hp/i);
        const stockPower = hpMatch ? parseInt(hpMatch[1]) : 150;
        const estimatedStage1Power = Math.round(stockPower * 1.25);
        const powerGain = estimatedStage1Power - stockPower;
        
        document.getElementById('result-stock-power').textContent = stockPower;
        document.getElementById('result-stage1-power').textContent = estimatedStage1Power;
        document.getElementById('result-gain-power').textContent = `+${powerGain}`;
        
        document.getElementById('result-stock-torque').textContent = '-';
        document.getElementById('result-stage1-torque').textContent = '-';
        document.getElementById('result-gain-torque').textContent = '-';
        
        // Hide Stage 2 and Stage 3 sections for basic info
        document.getElementById('stage2-section').style.display = 'none';
        document.getElementById('stage3-section').style.display = 'none';
      }
    });
    
    // Print button functionality
    const printResultsBtn = document.getElementById('print-results-btn');
    if (printResultsBtn) {
      printResultsBtn.addEventListener('click', () => {
        window.print();
      });
    }
    
    // Helper function to get vehicle quote message
    function getQuoteMessage() {
      const vehicleName = document.getElementById('result-vehicle-name')?.textContent || 'Unknown Vehicle';
      const engineName = document.getElementById('result-engine-name')?.textContent || 'Unknown Engine';
      const stockPower = document.getElementById('result-stock-power')?.textContent || 'N/A';
      const stockTorque = document.getElementById('result-stock-torque')?.textContent || 'N/A';
      const stage1Power = document.getElementById('result-stage1-power')?.textContent || 'N/A';
      const stage1Torque = document.getElementById('result-stage1-torque')?.textContent || 'N/A';
      
      return {
        full: `Vehicle Quote Request

Vehicle: ${vehicleName}
Engine: ${engineName}

Stock Performance:
Power: ${stockPower} HP
Torque: ${stockTorque} NM

Stage 1 Potential:
Power: ${stage1Power} HP
Torque: ${stage1Torque} NM

I would like to request a quote for tuning this vehicle.`,
        subject: `Quote Request: ${vehicleName}`,
        vehicleName,
        engineName,
        stockPower,
        stockTorque,
        stage1Power,
        stage1Torque
      };
    }
    
    // WhatsApp quote button
    const whatsappBtn = document.getElementById('quote-whatsapp-btn');
    if (whatsappBtn) {
      whatsappBtn.addEventListener('click', () => {
        const quote = getQuoteMessage();
        const phoneNumber = '447546371963'; // Carnage Remaps WhatsApp
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(quote.full)}`;
        window.open(whatsappUrl, '_blank');
      });
    }
    
    // Email quote button
    const emailBtn = document.getElementById('quote-email-btn');
    if (emailBtn) {
      emailBtn.addEventListener('click', () => {
        const quote = getQuoteMessage();
        const emailAddress = 'carnageremaps@gmail.com'; // Carnage Remaps Email
        const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(quote.subject)}&body=${encodeURIComponent(quote.full)}`;
        window.location.href = mailtoUrl;
      });
    }
    
    // SMS quote button
    const smsBtn = document.getElementById('quote-sms-btn');
    if (smsBtn) {
      smsBtn.addEventListener('click', () => {
        const quote = getQuoteMessage();
        const phoneNumber = '447546371963'; // Carnage Remaps SMS
        const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(quote.full)}`;
        window.location.href = smsUrl;
      });
    }
  }

  // Initialize settings functionality
  async function initSettings() {
    // Check subscription status and lock/unlock embed section
    // Admins bypass subscription requirement
    const isAdmin = await CarnageAuth.isAdmin();
    const hasSubscription = isAdmin || await hasActiveEmbedSubscription();
    const embedSection = document.querySelector('#settings-tab .settings-card');
    
    if (!hasSubscription && embedSection) {
      // Add locked overlay to embed section
      const overlay = document.createElement('div');
      overlay.id = 'embed-locked-overlay';
      overlay.style.cssText = `
        position: relative;
        pointer-events: none;
        opacity: 0.6;
        user-select: none;
      `;
      
      // Wrap the embed section content
      const embedContent = embedSection.innerHTML;
      embedSection.innerHTML = `
        <div style="position: relative;">
          <div style="${overlay.style.cssText}">
            ${embedContent}
          </div>
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.95); padding: 2rem; border-radius: 12px; text-align: center; border: 2px solid #8b5cf6; box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3); z-index: 10; max-width: 400px;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🔒</div>
            <h3 style="margin: 0 0 0.5rem 0; color: #fff;">Subscription Required</h3>
            <p style="color: #94a3b8; margin: 0 0 1.5rem 0; font-size: 0.875rem;">The embed widget feature requires an active subscription.</p>
            <button onclick="document.querySelector('[data-tab=\\'billing\\']').click()" style="padding: 0.75rem 1.5rem; background: #8b5cf6; color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; width: 100%;">
              Subscribe Now - £9.99/month
            </button>
          </div>
        </div>
      `;
    }
    
    // Embed Code Generator
    const generateEmbedBtn = document.getElementById('generate-embed-btn');
    const embedLogoUrl = document.getElementById('embed-logo-url');
    const embedPrimaryColor = document.getElementById('embed-primary-color');
    const embedPrimaryColorText = document.getElementById('embed-primary-color-text');
    const embedBgColor = document.getElementById('embed-bg-color');
    const embedBgColorText = document.getElementById('embed-bg-color-text');
    const embedWidth = document.getElementById('embed-width');
    const embedCodeContainer = document.getElementById('embed-code-container');
    const embedCodeOutput = document.getElementById('embed-code-output');
    const embedCodeOutputCompact = document.getElementById('embed-code-output-compact');
    const copyEmbedBtn = document.getElementById('copy-embed-btn');
    const copyEmbedCompactBtn = document.getElementById('copy-embed-compact-btn');
    const uploadLogoBtn = document.getElementById('upload-logo-btn');

    // Hidden file input for uploads
    let _hiddenLogoInput = null;
    function ensureHiddenInput() {
      if (_hiddenLogoInput) return _hiddenLogoInput;
      _hiddenLogoInput = document.createElement('input');
      _hiddenLogoInput.type = 'file';
      _hiddenLogoInput.accept = 'image/*';
      _hiddenLogoInput.style.display = 'none';
      document.body.appendChild(_hiddenLogoInput);
      return _hiddenLogoInput;
    }

    // Sync color inputs
    if (embedPrimaryColor && embedPrimaryColorText) {
      embedPrimaryColor.addEventListener('input', (e) => {
        embedPrimaryColorText.value = e.target.value;
      });
      embedPrimaryColorText.addEventListener('input', (e) => {
        if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
          embedPrimaryColor.value = e.target.value;
        }
      });
    }

    if (embedBgColor && embedBgColorText) {
      embedBgColor.addEventListener('input', (e) => {
        embedBgColorText.value = e.target.value;
      });
      embedBgColorText.addEventListener('input', (e) => {
        if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
          embedBgColor.value = e.target.value;
        }
      });
    }

    // Generate embed code
    if (generateEmbedBtn) {
      generateEmbedBtn.addEventListener('click', async () => {
        // Check if user has active embed subscription (admins bypass)
        const isAdminUser = await CarnageAuth.isAdmin();
        const hasSubscription = isAdminUser || await hasActiveEmbedSubscription();
        if (!hasSubscription) {
          const upgrade = confirm('🔒 Embed Widget Access Required\n\nThe embed widget feature requires an active subscription (£9.99/month).\n\nVehicle lookup is FREE for all users, but embedding the widget on external websites requires a subscription.\n\nWould you like to go to the Billing tab to subscribe?');
          if (upgrade) {
            // Switch to billing tab
            document.querySelectorAll('nav[class*="tabs"] a').forEach(link => {
              link.classList.remove('active');
              if (link.getAttribute('data-tab') === 'billing') {
                link.classList.add('active');
              }
            });
            document.querySelectorAll('.cr-tab').forEach(tab => {
              tab.classList.remove('active');
            });
            document.getElementById('billing-tab').classList.add('active');
          }
          return;
        }

        const primaryColor = embedPrimaryColorText.value || '#dc2626';
        const bgColor = embedBgColorText.value || '#1a1a1a';
        const width = embedWidth.value || '100%';
        // Branding / contact inputs (use current inputs even if not saved)
        const embedLogoVal = (embedLogoUrl?.value || '').trim();
        const settingsWhatsappVal = (document.getElementById('settings-whatsapp')?.value || '').trim();
        const settingsEmailVal = (document.getElementById('settings-email')?.value || '').trim();

        // If key branding/contact fields are empty, prompt user to fill them first
        if (!embedLogoVal || !settingsWhatsappVal || !settingsEmailVal) {
          const fill = confirm('Some branding/contact fields (logo, WhatsApp or email) are empty.\n\nPress OK to open the settings so you can fill them before creating the embed, or Cancel to continue without them.');
          if (fill) {
            // Focus the first empty field
            if (!embedLogoVal) {
              embedLogoUrl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              embedLogoUrl?.focus();
            } else if (!settingsWhatsappVal) {
              const el = document.getElementById('settings-whatsapp');
              el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              el?.focus();
            } else if (!settingsEmailVal) {
              const el = document.getElementById('settings-email');
              el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              el?.focus();
            }
            return;
          }
        }
        // Appearance settings
        const searchTitleVal = (document.getElementById('search-title')?.value || '').trim();
        const searchDescVal = (document.getElementById('search-description')?.value || '').trim();
        const showYearDropdownVal = document.getElementById('show-year-dropdown')?.checked ? '1' : '0';
        const showPerformanceBadgesVal = document.getElementById('show-performance-badges')?.checked ? '1' : '0';
        const showStageCardsVal = document.getElementById('show-stage-cards')?.checked ? '1' : '0';

        // Always use HTTPS for external sites
        const baseUrl = 'https://web-production-df12d.up.railway.app';
        // Cache-busting version - increment when embed.html changes
        const embedVersion = '4';

        // Build query string with all settings (include branding/contact when present)
        const fallbackEmail = sessionStorage.getItem('userEmail') || '';
        const embedEmail = settingsEmailVal || fallbackEmail;

        const params = [
          `v=${embedVersion}`,
          `color=${encodeURIComponent(primaryColor)}`,
          `bg=${encodeURIComponent(bgColor)}`,
          searchTitleVal ? `title=${encodeURIComponent(searchTitleVal)}` : '',
          searchDescVal ? `desc=${encodeURIComponent(searchDescVal)}` : '',
          embedLogoVal ? `logo=${encodeURIComponent(embedLogoVal)}` : '',
          settingsWhatsappVal ? `wa=${encodeURIComponent(settingsWhatsappVal)}` : '',
          embedEmail ? `email=${encodeURIComponent(embedEmail)}` : '',
          `showYear=${showYearDropdownVal}`,
          `showPerf=${showPerformanceBadgesVal}`,
          `showStages=${showStageCardsVal}`
        ].filter(Boolean).join('&');

        const baseSrc = `${baseUrl}/embed.html?${params}`;
        let iframeId = null;

        try {
          iframeId = await createIframeRecord('embed', baseSrc, {
            title: searchTitleVal || 'Vehicle Search Widget',
            colorAccent: primaryColor,
            colorBg: bgColor,
            logoUrl: embedLogoVal,
            whatsapp: settingsWhatsappVal,
            contactEmail: settingsEmailVal
          });
        } catch (err) {
          console.log('Iframe create note:', err.message);
        }

        const srcWithId = iframeId ? `${baseSrc}&iframeId=${encodeURIComponent(iframeId)}` : baseSrc;

        const embedCode = `<!-- Carnage Remaps Vehicle Search Widget -->
<!-- Works with: Wix, WordPress, Squarespace, Shopify, any HTML site -->
<!-- Just copy and paste this code into an HTML embed element -->

<iframe 
  src="${srcWithId}" 
  width="${width}" 
  height="550" 
  style="border:none;border-radius:12px;max-width:100%;" 
  title="Carnage Remaps Vehicle Search"
  loading="lazy">
</iframe>

<!-- End Carnage Remaps Widget -->`;
        const compactCode = `<iframe src="${srcWithId}" width="${width}" height="550" style="border:none;border-radius:12px;max-width:100%;" title="Carnage Remaps Vehicle Search" loading="lazy"></iframe>`;

        if (embedCodeOutput) embedCodeOutput.value = embedCode;
        if (embedCodeOutputCompact) embedCodeOutputCompact.value = compactCode;
        if (embedCodeContainer) {
          embedCodeContainer.style.display = 'block';
          embedCodeContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    }

    // Shared helper: create iframe record in Supabase
    async function createIframeRecord(type, url, meta = {}) {
      const email = meta.email || sessionStorage.getItem('userEmail') || '';
      const userId = sessionStorage.getItem('userId');
      if (!email) return null; // avoid failing silently on backend validation

      const payload = {
        type,
        url,
        email,
        user_id: userId ? parseInt(userId) : null,
        title: meta.title || null,
        color_accent: meta.colorAccent || null,
        color_bg: meta.colorBg || null,
        logo_url: meta.logoUrl || null,
        whatsapp: meta.whatsapp || null,
        contact_email: meta.contactEmail || null
      };

      const resp = await fetch('/api/iframes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await resp.json();
      if (resp.ok && data.success && data.iframe?.id) return data.iframe.id;
      console.warn('Iframe record not created:', data.error || data.message || resp.statusText);
      return null;
    }

    // VRM Lookup Embed Generator
    const generateVrmEmbedBtn = document.getElementById('generate-vrm-embed-btn');
    const vrmLogoUrl = document.getElementById('vrm-logo-url');
    const vrmAccentColor = document.getElementById('vrm-accent-color');
    const vrmAccentColorText = document.getElementById('vrm-accent-color-text');
    const vrmBgColor = document.getElementById('vrm-bg-color');
    const vrmBgColorText = document.getElementById('vrm-bg-color-text');
    const vrmWhatsapp = document.getElementById('vrm-whatsapp');
    const vrmEmailInput = document.getElementById('vrm-email');
    const vrmEmbedCodeContainer = document.getElementById('vrm-embed-code-container');
    const vrmEmbedCodeOutput = document.getElementById('vrm-embed-code-output');
    const copyVrmEmbedBtn = document.getElementById('copy-vrm-embed-btn');

    // Sync VRM color inputs
    if (vrmAccentColor && vrmAccentColorText) {
      vrmAccentColor.addEventListener('input', (e) => {
        vrmAccentColorText.value = e.target.value;
      });
      vrmAccentColorText.addEventListener('input', (e) => {
        if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
          vrmAccentColor.value = e.target.value;
        }
      });
    }

    if (vrmBgColor && vrmBgColorText) {
      vrmBgColor.addEventListener('input', (e) => {
        vrmBgColorText.value = e.target.value;
      });
      vrmBgColorText.addEventListener('input', (e) => {
        if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
          vrmBgColor.value = e.target.value;
        }
      });
    }

    // Generate VRM embed code
    if (generateVrmEmbedBtn) {
      generateVrmEmbedBtn.addEventListener('click', async () => {
        // Check if user has active VRM subscription (admins bypass)
        let isAdminUser = sessionStorage.getItem('isAdmin') === 'true';
        try {
          if (!isAdminUser && typeof CarnageAuth !== 'undefined' && CarnageAuth?.isAdmin) {
            isAdminUser = await CarnageAuth.isAdmin();
          }
        } catch (err) {
          console.warn('Admin check failed:', err);
        }

        const hasSubscription = isAdminUser || await hasActiveVrmSubscription();
        
        if (!hasSubscription) {
          const upgrade = confirm('🔒 VRM Lookup Access Required\n\nThe VRM lookup embed feature requires an active subscription (£17.99/month).\n\nVehicle lookup is FREE for all users, but embedding the widget on external websites requires a subscription.\n\nWould you like to go to the Billing tab to subscribe?');
          if (upgrade) {
            document.getElementById('billing-tab').classList.add('active');
            document.getElementById('settings-tab').classList.remove('active');
            const settingsPanel = document.getElementById('settings-tab');
            const billingPanel = document.getElementById('billing-tab');
            if (settingsPanel) settingsPanel.style.display = 'none';
            if (billingPanel) billingPanel.style.display = 'block';
            
            // Scroll to subscription section
            setTimeout(() => {
              const subSection = document.querySelector('[id*="active-subscriptions"]')?.parentElement;
              if (subSection) subSection.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
          return;
        }

        const accentColor = vrmAccentColorText?.value || '#dc2626';
        const bgColor = vrmBgColorText?.value || '#0f172a';
        const logoVal = (vrmLogoUrl?.value || '').trim();
        const waVal = (vrmWhatsapp?.value || '').trim();
        const emailVal = (vrmEmailInput?.value || '').trim();

        const baseUrl = 'https://web-production-df12d.up.railway.app';
        
        const fallbackEmail = sessionStorage.getItem('userEmail') || '';
        const vrmEmailParam = emailVal || fallbackEmail;

        const params = [
          `color=${encodeURIComponent(accentColor)}`,
          `bg=${encodeURIComponent(bgColor)}`,
          logoVal ? `logo=${encodeURIComponent(logoVal)}` : '',
          waVal ? `wa=${encodeURIComponent(waVal)}` : '',
          vrmEmailParam ? `email=${encodeURIComponent(vrmEmailParam)}` : ''
        ].filter(Boolean).join('&');

        const baseSrc = `${baseUrl}/test-vrm.html?${params}`;
        let iframeId = null;

        try {
          iframeId = await createIframeRecord('vrm', baseSrc, {
            title: 'VRM Lookup Widget',
            colorAccent: accentColor,
            colorBg: bgColor,
            logoUrl: logoVal,
            whatsapp: waVal,
            contactEmail: emailVal
          });
        } catch (err) {
          console.log('Iframe create note:', err.message);
        }

        const srcWithId = iframeId ? `${baseSrc}&iframeId=${encodeURIComponent(iframeId)}` : baseSrc;
        const embedCode = `<iframe src="${srcWithId}" width="100%" height="600" style="border:none;border-radius:12px;max-width:100%;" title="VRM Lookup" loading="lazy"></iframe>`;

        if (vrmEmbedCodeOutput) vrmEmbedCodeOutput.value = embedCode;
        if (vrmEmbedCodeContainer) {
          vrmEmbedCodeContainer.style.display = 'block';
          vrmEmbedCodeContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    }

    // Copy VRM embed code
    if (copyVrmEmbedBtn && vrmEmbedCodeOutput) {
      copyVrmEmbedBtn.addEventListener('click', () => {
        vrmEmbedCodeOutput.select();
        document.execCommand('copy');
        copyVrmEmbedBtn.textContent = '✓ Copied!';
        setTimeout(() => {
          copyVrmEmbedBtn.textContent = '📋 Copy';
        }, 2000);
      });
    }

    // Subscribe to VRM Lookup
    const subscribeVrmBtn = document.getElementById('subscribe-vrm-btn');
    if (subscribeVrmBtn) {
      subscribeVrmBtn.addEventListener('click', async () => {
        const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
        const hasSubscription = isAdmin || await hasActiveVrmSubscription();
        
        if (hasSubscription) {
          alert('✅ You already have an active VRM Lookup subscription!');
          return;
        }
        
        await createVrmSubscription();
      });
    }

    // Copy embed code
    if (copyEmbedBtn) {
      copyEmbedBtn.addEventListener('click', () => {
        if (!embedCodeOutput) return;
        embedCodeOutput.select();
        document.execCommand('copy');
        copyEmbedBtn.textContent = '✓ Copied!';
        setTimeout(() => {
          copyEmbedBtn.textContent = '📋 Copy';
        }, 2000);
      });
    }
    if (copyEmbedCompactBtn) {
      copyEmbedCompactBtn.addEventListener('click', () => {
        if (!embedCodeOutputCompact) return;
        embedCodeOutputCompact.select();
        document.execCommand('copy');
        copyEmbedCompactBtn.textContent = '✓ Copied!';
        setTimeout(() => {
          copyEmbedCompactBtn.textContent = '📋 Copy';
        }, 2000);
      });
    }
    // Upload logo button
    if (uploadLogoBtn && embedLogoUrl) {
      uploadLogoBtn.addEventListener('click', () => {
        const input = ensureHiddenInput();
        input.value = '';
        input.click();
        input.onchange = async () => {
          const file = input.files[0];
          if (!file) return;
          // Basic client-side validation
          if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
          }
          const form = new FormData();
          form.append('logo', file);
          uploadLogoBtn.textContent = 'Uploading...';
          console.log('📤 Starting file upload to /api/upload-logo');
          console.log('   File name:', file.name);
          console.log('   File size:', file.size);
          console.log('   File type:', file.type);
          try {
            console.log('📡 Sending fetch request...');
            const resp = await fetch('/api/upload-logo', {
              method: 'POST',
              body: form
            });
            console.log('✅ Response received:', resp.status, resp.statusText);
            if (!resp.ok) throw new Error('Upload failed: ' + resp.statusText);
            const data = await resp.json();
            console.log('📦 Response data:', data);
            if (data.url) {
              console.log('✅ URL received:', data.url);
              embedLogoUrl.value = data.url;
              uploadLogoBtn.textContent = '✓ Uploaded';
              setTimeout(() => uploadLogoBtn.textContent = '⬆️ Upload', 2000);
            } else {
              throw new Error('No URL returned');
            }
          } catch (err) {
            console.error('❌ Logo upload error', err);
            uploadLogoBtn.textContent = '❌ Failed';
            alert('Upload failed. Check server and try again.');
            uploadLogoBtn.textContent = '⬆️ Upload';
          }
        };
      });
    }
    // Appearance Settings
    const applyAppearanceBtn = document.getElementById('apply-appearance-btn');
    const searchTitle = document.getElementById('search-title');
    const searchDescription = document.getElementById('search-description');
    const showYearDropdown = document.getElementById('show-year-dropdown');
    const showPerformanceBadges = document.getElementById('show-performance-badges');
    const showStageCards = document.getElementById('show-stage-cards');

    if (applyAppearanceBtn) {
      applyAppearanceBtn.addEventListener('click', () => {
        // Apply title and description
        const vehicleSearchTitle = document.querySelector('#vehicle-search-tab h2');
        const vehicleSearchDesc = document.querySelector('#vehicle-search-tab > p');
        
        if (vehicleSearchTitle && searchTitle) {
          vehicleSearchTitle.textContent = searchTitle.value;
        }
        if (vehicleSearchDesc && searchDescription) {
          vehicleSearchDesc.textContent = searchDescription.value;
        }

        // Toggle year dropdown
        const yearField = document.querySelector('.search-field:nth-child(3)');
        if (yearField) {
          yearField.style.display = showYearDropdown.checked ? 'block' : 'none';
        }

        // Toggle performance badges
        const performanceBadges = document.getElementById('search-performance-options');
        if (performanceBadges) {
          performanceBadges.style.display = showPerformanceBadges.checked ? 'flex' : 'none';
        }

        // Toggle stage cards visibility
        const stageCards = document.querySelectorAll('.stage-card-search');
        if (stageCards.length > 0) {
          stageCards.forEach(card => {
            card.style.display = showStageCards.checked ? 'block' : 'none';
          });
        }

        // Show success message
        applyAppearanceBtn.innerHTML = '<span>✓ Applied Successfully!</span>';
        setTimeout(() => {
          applyAppearanceBtn.innerHTML = '<span>✓ Apply Changes</span>';
        }, 2000);
      });
    }

    // Contact Settings
    const saveContactBtn = document.getElementById('save-contact-settings-btn');
    const settingsWhatsapp = document.getElementById('settings-whatsapp');
    const settingsEmail = document.getElementById('settings-email');
    const contactMessage = document.getElementById('contact-settings-message');

    // Load existing contact settings
    if (settingsWhatsapp && settingsEmail) {
      settingsWhatsapp.value = CONTACT_SETTINGS.whatsappNumber;
      settingsEmail.value = CONTACT_SETTINGS.email;
    }

    if (saveContactBtn) {
      saveContactBtn.addEventListener('click', () => {
        const newSettings = {
          whatsappNumber: settingsWhatsapp.value.trim(),
          email: settingsEmail.value.trim()
        };

        // Validate inputs
        if (!newSettings.whatsappNumber) {
          showContactMessage('Please enter a WhatsApp number', 'error');
          return;
        }

        if (!newSettings.email || !newSettings.email.includes('@')) {
          showContactMessage('Please enter a valid email address', 'error');
          return;
        }

        // Save settings
        saveContactSettings(newSettings);
        showContactMessage('Contact settings saved successfully!', 'success');
        
        // Update button text
        saveContactBtn.innerHTML = '<span>✓ Saved Successfully!</span>';
        setTimeout(() => {
          saveContactBtn.innerHTML = '<span>💾 Save Contact Settings</span>';
        }, 2000);
      });
    }

    function showContactMessage(message, type) {
      if (!contactMessage) return;
      
      contactMessage.textContent = message;
      contactMessage.style.display = 'block';
      contactMessage.style.background = type === 'success' 
        ? 'rgba(16, 185, 129, 0.2)' 
        : 'rgba(239, 68, 68, 0.2)';
      contactMessage.style.color = type === 'success' ? '#10b981' : '#ef4444';
      contactMessage.style.border = type === 'success'
        ? '1px solid rgba(16, 185, 129, 0.3)'
        : '1px solid rgba(239, 68, 68, 0.3)';
      
      setTimeout(() => {
        contactMessage.style.display = 'none';
      }, 3000);
    }

    // Calculate and update database statistics
    updateDatabaseStats();
  }

  // Update database statistics
  function updateDatabaseStats() {
    const statManufacturers = document.getElementById('stat-manufacturers');
    const statModels = document.getElementById('stat-models');
    const statYearRanges = document.getElementById('stat-year-ranges');
    const statEngines = document.getElementById('stat-engines');

    if (statManufacturers) {
      // Count manufacturers with data in VEHICLE_ENGINE_DATABASE
      const manufacturersWithData = Object.keys(VEHICLE_ENGINE_DATABASE).length;
      statManufacturers.textContent = manufacturersWithData;
    }

    if (statModels) {
      // Count total models
      let totalModels = 0;
      Object.values(VEHICLE_ENGINE_DATABASE).forEach(manufacturer => {
        totalModels += Object.keys(manufacturer).length;
      });
      statModels.textContent = `${totalModels}+`;
    }

    if (statYearRanges) {
      // Count total year ranges
      let totalYearRanges = 0;
      Object.values(VEHICLE_ENGINE_DATABASE).forEach(manufacturer => {
        Object.values(manufacturer).forEach(model => {
          totalYearRanges += Object.keys(model).length;
        });
      });
      statYearRanges.textContent = `${totalYearRanges}+`;
    }

    if (statEngines) {
      // Count engines in ENGINE_ECU_DATABASE
      const totalEngines = Object.keys(ENGINE_ECU_DATABASE).length;
      statEngines.textContent = `${totalEngines}+`;
    }
  }

  // Initialize support ticket system
  function initSupport() {
    const newTicketBtn = document.getElementById('new-ticket-btn');
    const cancelTicketBtn = document.getElementById('cancel-ticket-btn');
    const createTicketForm = document.getElementById('create-ticket-form');
    const newTicketFormContainer = document.getElementById('new-ticket-form');
    
    if (!newTicketBtn) return;
    
    // Show/hide new ticket form
    newTicketBtn.addEventListener('click', () => {
      newTicketFormContainer.style.display = 'block';
    });
    
    if (cancelTicketBtn) {
      cancelTicketBtn.addEventListener('click', () => {
        newTicketFormContainer.style.display = 'none';
        createTicketForm.reset();
      });
    }
    
    // Create ticket
    if (createTicketForm) {
      createTicketForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const subject = document.getElementById('ticket-subject').value;
        const priority = document.getElementById('ticket-priority').value;
        const message = document.getElementById('ticket-message').value;
        const userId = sessionStorage.getItem('userId');
        const userName = sessionStorage.getItem('userName');
        
        try {
          // Create ticket in Supabase
          const ticket = await CarnageSupport.createTicket(subject, message, priority);
          
          alert('Ticket created successfully!');
          createTicketForm.reset();
          newTicketFormContainer.style.display = 'none';
          displayUserTickets();
          updateDashboardStats();
        } catch (error) {
          console.error('Error creating ticket:', error);
          alert('Error creating ticket: ' + error.message);
          alert('Error creating ticket');
        }
      });
    }
    
    // Display user tickets
    displayUserTickets();
  }

  // Display user tickets
  async function displayUserTickets() {
    const userId = parseInt(sessionStorage.getItem('userId'));
    const ticketsList = document.getElementById('tickets-list');
    
    if (!ticketsList) return;
    
    try {
      const tickets = await CarnageSupport.getTicketsByUserId(userId);
      
      if (tickets.length === 0) {
        ticketsList.innerHTML = '<p class="empty-state">No support tickets yet</p>';
        return;
      }
      
      tickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      ticketsList.innerHTML = tickets.map(ticket => `
        <div class="ticket-card" data-ticket-id="${ticket.id}">
          <div class="ticket-header">
            <h4 class="ticket-subject">${escapeHtml(ticket.subject)}</h4>
            <div class="ticket-badges">
              <span class="ticket-badge status-${ticket.status}">${ticket.status}</span>
              <span class="ticket-badge priority-${ticket.priority}">${ticket.priority}</span>
            </div>
          </div>
          <p class="ticket-meta">Created ${new Date(ticket.createdAt).toLocaleDateString()}</p>
        </div>
      `).join('');
      
      // Bind click events
      ticketsList.querySelectorAll('.ticket-card').forEach(card => {
        card.addEventListener('click', () => {
          const ticketId = parseInt(card.dataset.ticketId);
          showTicketModal(ticketId);
        });
      });
    } catch (error) {
      console.error('Error displaying tickets:', error);
    }
  }

  // Show ticket modal
  async function showTicketModal(ticketId) {
    console.log('🎫 showTicketModal called with ticketId:', ticketId);
    console.log('Function context:', this);
    console.log('Arguments:', arguments);
    try {
      const modal = document.getElementById('ticket-modal');
      console.log('Modal element:', modal);
      
      if (!modal) {
        console.error('❌ Modal element not found!');
        alert('Modal element not found in DOM');
        return;
      }
      
      console.log('📡 Fetching ticket data...');
      const ticket = await CarnageSupport.getTicketById(ticketId);
      
      console.log('✅ Ticket data received:', ticket);
      
      if (!ticket) {
        alert('Ticket not found');
        return;
      }
      
      currentTicketId = ticketId;
      
      // Check if user is admin
      const isAdmin = await CarnageAuth.isAdmin();
      console.log('👤 User is admin:', isAdmin);
      
      // Handle both date formats
      const createdDate = ticket.createdAt || ticket.created_at;
      
      console.log('📝 Populating modal fields...');
      document.getElementById('modal-ticket-subject').textContent = ticket.subject;
      document.getElementById('modal-ticket-status').textContent = ticket.status.toUpperCase();
      document.getElementById('modal-ticket-status').className = `ticket-badge status-${ticket.status}`;
      document.getElementById('modal-ticket-priority').textContent = (ticket.priority || 'normal').toUpperCase();
      document.getElementById('modal-ticket-priority').className = `ticket-badge priority-${ticket.priority || 'normal'}`;
      document.getElementById('modal-ticket-date').textContent = new Date(createdDate).toLocaleDateString();
      
      // Fetch messages from Supabase
      const messagesContainer = document.getElementById('ticket-messages');
      let messages = [];
      
      if (window.SupabaseSupport && window.SupabaseSupport.getMessagesByTicketId) {
        try {
          messages = await window.SupabaseSupport.getMessagesByTicketId(ticketId);
          console.log('Fetched messages:', messages);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
      
      // Display messages
      if (messages && messages.length > 0) {
        messagesContainer.innerHTML = messages.map(msg => {
          const isAdminMessage = msg.is_admin || msg.isAdmin;
          const messageClass = isAdminMessage ? 'ticket-message admin-message' : 'ticket-message user-message';
          const senderName = msg.sender_name || msg.senderName || 'Unknown';
          const timestamp = msg.created_at || msg.timestamp;
          
          return `
            <div class="${messageClass}">
              <div class="ticket-message-header">
                <span class="ticket-message-sender">${escapeHtml(senderName)} ${isAdminMessage ? '(Support Team)' : ''}</span>
                <span class="ticket-message-time">${formatNotificationTime(new Date(timestamp))}</span>
              </div>
              <div class="ticket-message-content">${escapeHtml(msg.message)}</div>
            </div>
          `;
        }).join('');
      } else {
        // Show the initial ticket message
        messagesContainer.innerHTML = `
          <div class="ticket-message user-message">
            <div class="ticket-message-header">
              <span class="ticket-message-sender">${escapeHtml(ticket.userName || 'User')}</span>
              <span class="ticket-message-time">${formatNotificationTime(new Date(createdDate))}</span>
            </div>
            <div class="ticket-message-content">${escapeHtml(ticket.message || ticket.subject)}</div>
          </div>
        `;
      }
      
      // For admins, add status control buttons
      const modalBody = modal.querySelector('.modal-body');
      let adminControls = modal.querySelector('.admin-ticket-controls');
      
      if (isAdmin) {
        if (!adminControls) {
          adminControls = document.createElement('div');
          adminControls.className = 'admin-ticket-controls';
          adminControls.style.cssText = 'padding: 1rem; background: #f9fafb; border-radius: 8px; margin-bottom: 1rem; border: 1px solid #e5e7eb;';
          
          adminControls.innerHTML = `
            <h4 style="margin: 0 0 0.75rem 0; font-size: 0.875rem; color: #374151;">Admin Controls</h4>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button class="btn small" id="ticket-status-open" data-status="open" style="background: #f59e0b; border-color: #f59e0b;">Mark Open</button>
              <button class="btn small" id="ticket-status-progress" data-status="in-progress" style="background: #3b82f6; border-color: #3b82f6;">In Progress</button>
              <button class="btn small" id="ticket-status-resolved" data-status="resolved" style="background: #10b981; border-color: #10b981;">Resolve</button>
            </div>
          `;
          
          modalBody.insertBefore(adminControls, modalBody.firstChild);
        }
        
        // Bind status change buttons
        adminControls.querySelectorAll('[data-status]').forEach(btn => {
          btn.onclick = async () => {
            const newStatus = btn.dataset.status;
            console.log('🔄 Changing ticket status to:', newStatus);
            try {
              const result = await CarnageSupport.updateTicketStatus(ticketId, newStatus);
              console.log('✅ Status updated:', result);
              
              // Update UI
              document.getElementById('modal-ticket-status').textContent = newStatus.toUpperCase();
              document.getElementById('modal-ticket-status').className = `ticket-badge status-${newStatus}`;
              
              // Show success feedback
              const originalText = btn.textContent;
              btn.textContent = '✓ Updated';
              setTimeout(() => {
                btn.textContent = originalText;
              }, 1500);
              
              // Refresh ticket list
              await loadAdminTickets();
              console.log('✅ Ticket list refreshed');
            } catch (error) {
              console.error('❌ Error updating ticket status:', error);
              alert('Failed to update ticket status: ' + error.message);
            }
          };
        });
      } else if (adminControls) {
        adminControls.remove();
      }
      
      console.log('🎬 Displaying modal...');
      modal.style.display = 'flex';
      modal.style.zIndex = '99999';
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.right = '0';
      modal.style.bottom = '0';
      modal.style.width = '100vw';
      modal.style.height = '100vh';
      modal.style.pointerEvents = 'auto';
      modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.style.overflow = 'auto';
      modal.style.opacity = '1';
      modal.style.visibility = 'visible';
      
      // Make sure modal content is visible
      const modalContent = modal.querySelector('.modal-content');
      if (modalContent) {
        modalContent.style.display = 'flex';
        modalContent.style.pointerEvents = 'auto';
        modalContent.style.position = 'relative';
        modalContent.style.zIndex = '100000';
        modalContent.style.opacity = '1';
        modalContent.style.visibility = 'visible';
        modalContent.style.backgroundColor = '#ffffff';
        console.log('Modal content styled:', modalContent);
      } else {
        console.error('⚠️ Modal content not found!');
      }
      
      console.log('✅ Modal displayed successfully!');
      console.log('Modal computed display:', window.getComputedStyle(modal).display);
      console.log('Modal computed visibility:', window.getComputedStyle(modal).visibility);
      console.log('Modal computed opacity:', window.getComputedStyle(modal).opacity);
      
      // Scroll messages to bottom
      setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 100);
      
    } catch (error) {
      console.error('❌ Error showing ticket modal:', error);
      alert('Error loading ticket details: ' + error.message);
    }
  }

  // Export to window for inline onclick handlers
  window.showTicketModal = showTicketModal;

  // Close ticket modal
  function closeTicketModal() {
    const modal = document.getElementById('ticket-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  // Setup ticket modal close button
  const closeTicketBtn = document.getElementById('close-ticket-modal');
  if (closeTicketBtn) {
    closeTicketBtn.onclick = closeTicketModal;
  }
  
  // Setup ticket reply form
  const replyForm = document.getElementById('reply-ticket-form');
  if (replyForm) {
    replyForm.onsubmit = async (e) => {
      e.preventDefault();
      const message = document.getElementById('reply-message').value.trim();
      
      if (!message || !currentTicketId) return;
      
      const userId = sessionStorage.getItem('userId');
      const userName = sessionStorage.getItem('userName');
      const userRole = sessionStorage.getItem('userRole');
      
      try {
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        await CarnageSupport.addMessageToTicket(
          currentTicketId, 
          message, 
          parseInt(userId), 
          userName, 
          userRole || 'user'
        );
        
        document.getElementById('reply-message').value = '';
        
        // Show success
        submitBtn.textContent = '✓ Sent';
        
        // Refresh the modal
        await showTicketModal(currentTicketId);
        
        setTimeout(() => {
          submitBtn.textContent = 'Send Reply';
          submitBtn.disabled = false;
        }, 1000);
        
      } catch (error) {
        console.error('Error adding message:', error);
        alert('Error sending message. Please try again.');
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Send Reply';
        submitBtn.disabled = false;
      }
    };
  }

  // Initialize admin panel
  // Debounce mechanism for admin user loading
  let adminUsersLoadTimeout = null;
  let isLoadingAdminUsers = false;
  let adminVrmInitialized = false;
  
  function initAdmin() {
    const adminTabBtns = document.querySelectorAll('.admin-tab-btn');
    const adminPanels = document.querySelectorAll('.admin-panel');
    
    if (adminTabBtns.length === 0) return;
    
    // Tab switching
    adminTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabName = btn.dataset.adminTab;
        console.log('Admin tab clicked:', tabName);
        
        adminTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        adminPanels.forEach(panel => {
          panel.classList.remove('active');
          console.log('Removing active from:', panel.id);
        });
        
        const targetPanel = document.getElementById(`admin-${tabName}`);
        console.log('Activating panel:', `admin-${tabName}`, targetPanel);
        if (targetPanel) {
          targetPanel.classList.add('active');
          console.log('Panel activated. Display:', window.getComputedStyle(targetPanel).display);
        }
        
        // Load data for the selected tab with debouncing
        if (tabName === 'users') {
          if (!isLoadingAdminUsers) loadAdminUsers();
        }
        if (tabName === 'tickets') {
          console.log('Calling loadAdminTickets...');
          loadAdminTickets();
        }
        if (tabName === 'files') loadAdminFiles();
        if (tabName === 'notifications') loadNotificationSettings();
        if (tabName === 'vrm' && !adminVrmInitialized) {
          initAdminVrmPanel();
          adminVrmInitialized = true;
        }
        if (tabName === 'iframes') {
          loadAdminIframes();
        }
        if (tabName === 'credit') {
          if (!isLoadingAdminUsers) loadAdminUsers(); // Load users for credit management
        }
        if (tabName === 'topups') loadTopUpRequests();
        if (tabName === 'overview') {
          loadAdminOverview(); // Only load when overview tab is clicked
          loadAdminNotifications(); // Load recent activity
        }
        if (tabName === 'subscriptions') loadAdminSubscriptions();
      });
    });
    
    // Load overview stats in background (non-blocking)
    setTimeout(() => {
      loadAdminOverview();
      loadAdminNotifications(); // Load recent activity on initial load
    }, 0);
  }

  // Admin VRM panel
  function initAdminVrmPanel() {
    const vrmInput = document.getElementById('admin-vrm-input');
    const vrmBtn = document.getElementById('admin-vrm-btn');
    const vrmStatus = document.getElementById('admin-vrm-status');
    const vrmResult = document.getElementById('admin-vrm-result');
    const preview = document.getElementById('admin-vrm-preview');
    const plateBg = document.getElementById('admin-plate-bg');
    const plateText = document.getElementById('admin-plate-text');
    const flagBg = document.getElementById('admin-flag-bg');
    const btnStart = document.getElementById('admin-btn-start');
    const btnEnd = document.getElementById('admin-btn-end');
    const accentLight = document.getElementById('admin-accent-light');
    const gold = document.getElementById('admin-gold');
    const bgDark = document.getElementById('admin-bg-dark');
    const bgPanel = document.getElementById('admin-bg-panel');
    const applyThemeBtn = document.getElementById('admin-apply-vrm-theme');
    const resetThemeBtn = document.getElementById('admin-reset-vrm-theme');
    const embedOutput = document.getElementById('admin-vrm-embed-output');
    const copyEmbedBtn = document.getElementById('admin-vrm-copy-btn');
    const contactPhone = document.getElementById('admin-contact-phone');
    const contactEmail = document.getElementById('admin-contact-email');

    // Prefill contact inputs from saved CONTACT_SETTINGS so embeds carry defaults
    if (contactPhone && !contactPhone.value && CONTACT_SETTINGS.whatsappNumber) {
      contactPhone.value = CONTACT_SETTINGS.whatsappNumber;
    }
    if (contactEmail && !contactEmail.value && CONTACT_SETTINGS.email) {
      contactEmail.value = CONTACT_SETTINGS.email;
    }

    const defaultTheme = {
      plateBg: '#ffcc00',
      plateText: '#000000',
      flagBg: '#003399',
      btnStart: '#00bcd4',
      btnEnd: '#0097a7',
      accent: '#dc2626',
      accentLight: '#ef4444',
      gold: '#ffc107',
      bgDark: '#0f172a',
      bgPanel: '#1e293b'
    };

    const buildEmbed = () => {
      const params = new URLSearchParams({
        color: btnStart?.value || defaultTheme.accent,
        colorLight: accentLight?.value || defaultTheme.accentLight,
        gold: gold?.value || defaultTheme.gold,
        bg: bgDark?.value || defaultTheme.bgDark,
        bgPanel: bgPanel?.value || defaultTheme.bgPanel
      });

      const waVal = (contactPhone?.value || CONTACT_SETTINGS.whatsappNumber || '').trim();
      if (waVal) params.set('wa', waVal);
      const emailVal = (contactEmail?.value || CONTACT_SETTINGS.email || '').trim();
      if (emailVal) params.set('email', emailVal);
      const gradient = `linear-gradient(135deg, ${params.get('bg')} 0%, ${params.get('bgPanel')} 50%, ${params.get('bg')} 100%)`;
      params.set('bgGradient', gradient);
      const src = `https://web-production-df12d.up.railway.app/test-vrm.html?${params.toString()}`;
      return `<iframe src="${src}" width="100%" height="520" style="border:none;border-radius:12px;max-width:100%;" title="Carnage VRM Lookup" loading="lazy"></iframe>`;
    };

    const updateEmbedOutput = () => {
      if (embedOutput) embedOutput.value = buildEmbed();
    };

    const applyTheme = () => {
      if (!preview) return;
      const dark = bgDark?.value || defaultTheme.bgDark;
      const panel = bgPanel?.value || defaultTheme.bgPanel;
      const gradient = `linear-gradient(135deg, ${dark} 0%, ${panel} 50%, ${dark} 100%)`;

      preview.style.setProperty('--plate-bg', plateBg?.value || defaultTheme.plateBg);
      preview.style.setProperty('--plate-text', plateText?.value || defaultTheme.plateText);
      preview.style.setProperty('--plate-flag-bg', flagBg?.value || defaultTheme.flagBg);
      preview.style.setProperty('--plate-flag-text', plateBg?.value || defaultTheme.plateBg);
      preview.style.setProperty('--vrm-btn-start', btnStart?.value || defaultTheme.btnStart);
      preview.style.setProperty('--vrm-btn-end', btnEnd?.value || defaultTheme.btnEnd);
      preview.style.setProperty('--accent-color', btnStart?.value || defaultTheme.accent);
      preview.style.setProperty('--accent-light', accentLight?.value || defaultTheme.accentLight);
      preview.style.setProperty('--gold-color', gold?.value || defaultTheme.gold);
      preview.style.setProperty('--bg-dark', dark);
      preview.style.setProperty('--bg-panel', panel);
      preview.style.setProperty('--bg-gradient', gradient);
      preview.style.background = gradient;
      preview.style.borderColor = `${btnStart?.value || defaultTheme.accent}35`;

      updateEmbedOutput();
    };

    const resetTheme = () => {
      if (plateBg) plateBg.value = defaultTheme.plateBg;
      if (plateText) plateText.value = defaultTheme.plateText;
      if (flagBg) flagBg.value = defaultTheme.flagBg;
      if (btnStart) btnStart.value = defaultTheme.btnStart;
      if (btnEnd) btnEnd.value = defaultTheme.btnEnd;
      if (accentLight) accentLight.value = defaultTheme.accentLight;
      if (gold) gold.value = defaultTheme.gold;
      if (bgDark) bgDark.value = defaultTheme.bgDark;
      if (bgPanel) bgPanel.value = defaultTheme.bgPanel;
      applyTheme();
    };

    const setStatus = (msg, tone = 'info') => {
      if (!vrmStatus) return;
      vrmStatus.textContent = msg;
      vrmStatus.className = `vrm-status vrm-${tone}`;
    };

    const renderResult = (vehicle) => {
      if (!vrmResult) return;
      if (!vehicle) {
        vrmResult.innerHTML = '<div style="padding:1rem;text-align:center;color:#94a3b8;">No data returned.</div>';
        return;
      }

      const baseHp = Number(vehicle.powerBhp) || null;
      const baseTq = Number(vehicle.torqueNm) || null;
      const isTurbo = ((vehicle.aspiration || '').toLowerCase().includes('turbo')) || ((vehicle.induction || '').toLowerCase().includes('turbo'));
      const gainSet = isTurbo
        ? [{ label: 'Stage 1', hp: 0.20, tq: 0.25 }, { label: 'Stage 2', hp: 0.30, tq: 0.35 }, { label: 'Stage 3', hp: 0.45, tq: 0.55 }]
        : [{ label: 'Stage 1', hp: 0.12, tq: 0.15 }, { label: 'Stage 2', hp: 0.18, tq: 0.22 }, { label: 'Stage 3', hp: 0.25, tq: 0.28 }];

      const perfCards = (baseHp && baseTq) ? gainSet.map(({ label, hp, tq }, idx) => {
        const tunedHp = Math.round(baseHp * (1 + hp));
        const tunedTq = Math.round(baseTq * (1 + tq));
        const hpGain = Math.round(baseHp * hp);
        const tqGain = Math.round(baseTq * tq);
        const stageColors = [
          { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.35)', title: '#93c5fd', accent: '#60a5fa' },
          { bg: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.3)', title: '#fed7aa', accent: '#fb923c' },
          { bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.3)', title: '#fca5a5', accent: '#f87171' }
        ];
        const colors = stageColors[idx] || stageColors[0];
        
        // Define parts requirements for each stage
        const stageRequirements = isTurbo ? [
          'Remap Only',
          'Downpipe + Remap',
          'Turbo Upgrade + Fueling'
        ] : [
          'Remap Only',
          'Exhaust + Intake + Remap',
          'Cams + Full Exhaust + Remap'
        ];
        const requirements = stageRequirements[idx] || 'Remap Only';
        
        return `
          <div style="background:linear-gradient(135deg, ${colors.bg}, rgba(30,41,59,0.2));border:2px solid ${colors.border};border-radius:14px;padding:1rem;transition:all 0.3s ease;cursor:default;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.9rem;">
              <span style="font-weight:800;font-size:1rem;color:${colors.title};">${label}</span>
              <span style="font-size:0.7rem;color:#cbd5e1;background:${colors.bg};padding:0.35rem 0.65rem;border-radius:6px;border:1px solid ${colors.border};font-weight:600;letter-spacing:0.3px;">${requirements}</span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.75rem;">
              <div style="background:linear-gradient(135deg, rgba(15,23,42,0.8), rgba(30,41,59,0.6));border-radius:12px;padding:0.8rem;border:1px solid ${colors.border};opacity:0.9;">
                <div style="color:#cbd5e1;font-size:0.75rem;font-weight:700;margin-bottom:0.4rem;text-transform:uppercase;letter-spacing:0.4px;">⚡ Power</div>
                <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:0.5rem;margin-bottom:0.4rem;">
                  <div style="color:#e2e8f0;font-size:0.85rem;"><span style="color:#94a3b8;font-weight:500;">${baseHp}</span><span style="color:#64748b;margin:0 0.25rem;">→</span><span style="font-weight:700;font-size:0.95rem;color:${colors.accent};">${tunedHp}</span></div>
                  <span style="color:#22c55e;font-weight:800;font-size:0.9rem;">+${hpGain}</span>
                </div>
                <div style="color:#64748b;font-size:0.75rem;font-weight:500;">bhp</div>
              </div>
              <div style="background:linear-gradient(135deg, rgba(15,23,42,0.8), rgba(30,41,59,0.6));border-radius:12px;padding:0.8rem;border:1px solid ${colors.border};opacity:0.9;">
                <div style="color:#cbd5e1;font-size:0.75rem;font-weight:700;margin-bottom:0.4rem;text-transform:uppercase;letter-spacing:0.4px;">💨 Torque</div>
                <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:0.5rem;margin-bottom:0.4rem;">
                  <div style="color:#e2e8f0;font-size:0.85rem;"><span style="color:#94a3b8;font-weight:500;">${baseTq}</span><span style="color:#64748b;margin:0 0.25rem;">→</span><span style="font-weight:700;font-size:0.95rem;color:${colors.accent};">${tunedTq}</span></div>
                  <span style="color:#22c55e;font-weight:800;font-size:0.9rem;">+${tqGain}</span>
                </div>
                <div style="color:#64748b;font-size:0.75rem;font-weight:500;">Nm</div>
              </div>
            </div>
          </div>`;
      }).join('') : '<div style="padding:1rem;background:rgba(59,130,246,0.08);border:2px solid rgba(59,130,246,0.2);border-radius:12px;color:#94a3b8;text-align:center;font-size:0.9rem;">Power/torque data unavailable.</div>';

      const specData = [
        { label: 'Make/Model', val: [vehicle.make, vehicle.model].filter(Boolean).join(' ') },
        { label: 'Year', val: vehicle.year },
        { label: 'Fuel', val: vehicle.fuelType },
        { label: 'Engine', val: vehicle.engineLabel || vehicle.engine },
        { label: 'Capacity', val: vehicle.engineCapacity },
        { label: 'VIN', val: vehicle.vin },
        { label: 'Engine No.', val: vehicle.engineNumber },
        { label: 'Drive', val: vehicle.driveType },
        { label: 'Transmission', val: vehicle.transmission || vehicle.transmissionType },
        { label: 'Max Speed', val: vehicle.maxSpeed || vehicle.maxSpeedMph || vehicle.maxSpeedKph },
      ].filter(({ val }) => val);

      const specGrid = specData.map(({ label, val }, idx) => `
        <div style="display:grid;grid-template-columns:140px 1fr;gap:1rem;padding:0.65rem 0;border-bottom:1px solid rgba(255,255,255,0.06);">
          <span style="color:#93c5fd;font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;">${label}</span>
          <span style="color:#e2e8f0;font-weight:600;font-size:0.95rem;word-break:break-word;">${val}</span>
        </div>`).join('');

      vrmResult.innerHTML = `
        <div style="display:grid;gap:1.25rem;">
          <div style="background:linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));border:2px solid rgba(255,255,255,0.12);border-radius:14px;padding:1.25rem;backdrop-filter:blur(10px);">
            <div style="color:#93c5fd;font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:1rem;display:flex;align-items:center;gap:0.5rem;"><span>📋</span> Vehicle Identification</div>
            <div style="display:grid;gap:0.5rem;font-size:0.9rem;">${specGrid}</div>
          </div>
          <div style="background:linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.04));border:2px solid rgba(59,130,246,0.25);border-radius:14px;padding:1.25rem;backdrop-filter:blur(10px);">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.95rem;flex-wrap:wrap;gap:0.5rem;">
              <div>
                <div style="color:#93c5fd;font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;display:flex;align-items:center;gap:0.5rem;"><span>🚀</span> Estimated Performance Gains</div>
                <div style="color:#94a3b8;font-size:0.8rem;margin-top:0.35rem;">Stock → Tuned | Approximations based on engine type</div>
              </div>
            </div>
            <div style="display:grid;gap:0.75rem;">${perfCards}</div>
          </div>
        </div>
      `;
    };

    const performLookup = async () => {
      if (!vrmInput) return;
      const raw = vrmInput.value.trim();
      if (!raw) {
        setStatus('Enter a registration.', 'error');
        return;
      }
      const vrm = raw.replace(/\s+/g, '').toUpperCase();
      vrmInput.value = vrm;
      setStatus('Looking up vehicle...', 'loading');
      if (vrmBtn) {
        vrmBtn.disabled = true;
        vrmBtn.textContent = 'Checking...';
      }
      try {
        const fetchJson = async (url) => {
          const resp = await fetch(url);
          let data = {};
          try { data = await resp.json(); } catch (_) { data = {}; }
          return { resp, data };
        };

        let vehicle = null;
        let usedFallback = false;
        let dvlaError = '';

        // Primary: DVLA
        try {
          const { resp, data } = await fetchJson(`${API_URL}/api/dvla-lookup?vrm=${encodeURIComponent(vrm)}`);
          if (resp.ok && data.success && data.vehicle) {
            vehicle = data.vehicle;
          } else {
            dvlaError = data.error || 'DVLA lookup failed';
          }
        } catch (err) {
          dvlaError = err.message || 'DVLA lookup failed';
        }

        // Fallback / enrich: CheckCar normalized payload
        try {
          const { resp, data } = await fetchJson(`${API_URL}/api/vrm-lookup?vrm=${encodeURIComponent(vrm)}`);
          if (resp.ok && data.success && data.vehicle) {
            usedFallback = true;
            vehicle = { ...(data.vehicle || {}), ...(vehicle || {}) }; // DVLA overrides when present
          }
        } catch (_) {
          // ignore
        }

        if (!vehicle) {
          throw new Error(dvlaError || 'Lookup failed');
        }

        renderResult(vehicle);
        const summary = [vehicle?.make, vehicle?.model].filter(Boolean).join(' ');
        const year = vehicle?.year ? ` (${vehicle.year})` : '';
        const fallbackNote = usedFallback ? ' ✓' : '';
        setStatus(`Found ${summary}${year}${fallbackNote}`, 'success');
      } catch (err) {
        console.error('Admin VRM lookup error:', err);
        renderResult(null);
        setStatus(err.message || 'Lookup failed', 'error');
      } finally {
        if (vrmBtn) {
          vrmBtn.disabled = false;
          vrmBtn.textContent = 'Find';
        }
      }
    };

    if (applyThemeBtn) applyThemeBtn.addEventListener('click', applyTheme);
    if (resetThemeBtn) resetThemeBtn.addEventListener('click', resetTheme);
    [plateBg, plateText, flagBg, btnStart, btnEnd, accentLight, gold, bgDark, bgPanel].forEach(ctrl => {
      if (ctrl) ctrl.addEventListener('input', applyTheme);
    });
    [contactPhone, contactEmail].forEach(ctrl => {
      if (ctrl) ctrl.addEventListener('input', updateEmbedOutput);
    });
    applyTheme();
    updateEmbedOutput();

    if (vrmBtn) vrmBtn.addEventListener('click', performLookup);
    if (vrmInput) {
      vrmInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          performLookup();
        }
      });
    }

    if (embedOutput) embedOutput.value = buildEmbed();
    if (copyEmbedBtn) {
      copyEmbedBtn.addEventListener('click', async () => {
        if (!embedOutput) return;

        try {
          const match = embedOutput.value.match(/src="([^"]+)"/);
          const src = match?.[1];
          if (src) {
            const iframeId = await createIframeRecord('vrm', src, {
              title: 'VRM Lookup Widget',
              logoUrl: logoUrl?.value || null,
              whatsapp: contactPhone?.value || CONTACT_SETTINGS.whatsappNumber || null,
              contactEmail: contactEmail?.value || CONTACT_SETTINGS.email || null,
              colorAccent: btnStart?.value || null,
              colorBg: bgDark?.value || null
            });

            if (iframeId) {
              const srcWithId = src.includes('iframeId=') ? src : `${src}${src.includes('?') ? '&' : '?'}iframeId=${encodeURIComponent(iframeId)}`;
              embedOutput.value = embedOutput.value.replace(src, srcWithId);
            }
          }
        } catch (err) {
          console.log('Iframe tracking note:', err.message);
        }

        embedOutput.select();
        document.execCommand('copy');
        copyEmbedBtn.textContent = '✓ Copied!';
        setTimeout(() => { copyEmbedBtn.textContent = '📋 Copy Code'; }, 1800);
      });
    }
  }
  
  // Load admin subscriptions
  async function loadAdminSubscriptions() {
    const tbody = document.getElementById('subscriptions-tbody');
    const activeCount = document.getElementById('active-subs-count');
    const pastdueCount = document.getElementById('pastdue-subs-count');
    const cancelledCount = document.getElementById('cancelled-subs-count');
    const revenueEl = document.getElementById('monthly-revenue');
    
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="6" style="padding: 2rem; text-align: center; color: #9ca3af;">Loading subscriptions...</td></tr>';
    
    try {
      const subscriptions = await CarnageAuth.getAllSubscriptions();
      
      // Calculate stats
      const active = subscriptions.filter(s => s.status === 'active');
      const pastdue = subscriptions.filter(s => s.status === 'past_due');
      const cancelled = subscriptions.filter(s => s.status === 'cancelled');
      const monthlyRevenue = active.reduce((sum, s) => {
        const typeKey = (s.type || '').toLowerCase();
        const fallbackAmount = typeKey.includes('vrm') ? 1799 : 999;
        return sum + (s.price_amount || fallbackAmount);
      }, 0) / 100;
      
      if (activeCount) activeCount.textContent = active.length;
      if (pastdueCount) pastdueCount.textContent = pastdue.length;
      if (cancelledCount) cancelledCount.textContent = cancelled.length;
      if (revenueEl) revenueEl.textContent = '£' + monthlyRevenue.toFixed(2);
      
      if (subscriptions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="padding: 2rem; text-align: center; color: #9ca3af;">No subscriptions yet. Subscriptions will appear here when users subscribe to the embed widget or the VRM lookup.</td></tr>';
        return;
      }
      
      tbody.innerHTML = subscriptions.map(sub => {
        const statusColors = {
          'active': '#10b981',
          'past_due': '#f59e0b',
          'cancelled': '#ef4444',
          'inactive': '#6b7280'
        };
        const typeColors = {
          'embed': '#3b82f6',
          'premium': '#a855f7',
          'vrm': '#22c55e'
        };
        const typeLabels = {
          'embed': 'Embed Widget',
          'premium': 'Premium',
          'vrm': 'VRM Lookup'
        };
        const statusColor = statusColors[sub.status] || '#6b7280';
        const typeKey = (sub.type || 'embed').toLowerCase();
        const typeColor = typeColors[typeKey] || '#9ca3af';
        const typeLabel = typeLabels[typeKey] || (sub.type || 'Subscription');
        const fallbackAmount = typeKey.includes('vrm') ? 1799 : 999;
        const priceAmount = sub.price_amount || fallbackAmount;
        const amount = '£' + (priceAmount / 100).toFixed(2);
        const periodEnd = sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : '-';
        const created = sub.created_at ? new Date(sub.created_at).toLocaleDateString() : '-';
        const isActive = sub.status === 'active';
        
        return `
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px; color: #fff;">${sub.email || 'Unknown'}</td>
            <td style="padding: 12px; text-align: center;">
              <span style="background: ${statusColor}20; color: ${statusColor}; padding: 4px 12px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">
                ${sub.status}
              </span>
            </td>
            <td style="padding: 12px; text-align: center;">
              <span style="background:${typeColor}20;color:${typeColor};padding:4px 12px;border-radius:12px;font-size:0.75rem;font-weight:600;text-transform:uppercase;">
                ${typeLabel}
              </span>
            </td>
            <td style="padding: 12px; text-align: right; font-weight: 600; color: #fff;">${amount}/mo</td>
            <td style="padding: 12px; text-align: center; color: #9ca3af;">${periodEnd}</td>
            <td style="padding: 12px; text-align: center;">
              <div style="display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap;">
                ${isActive ? `
                  <button onclick="toggleSubscriptionStatus('${sub.email}', 'cancelled')" style="background:#ef4444;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:0.75rem;font-weight:600;">
                    ❌ Deactivate
                  </button>
                ` : `
                  <button onclick="toggleSubscriptionStatus('${sub.email}', 'active')" style="background:#22c55e;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:0.75rem;font-weight:600;">
                    ✅ Activate
                  </button>
                `}
                <button onclick="extendSubscription('${sub.email}')" style="background:#3b82f6;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:0.75rem;font-weight:600;">
                  ⏰ +30 Days
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
      
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      tbody.innerHTML = '<tr><td colspan="6" style="padding: 2rem; text-align: center; color: #ef4444;">❌ Error loading subscriptions:<br>' + error.message + '</td></tr>';
    }
  }
  
  // Global subscription management functions
  window.refreshAdminSubscriptions = loadAdminSubscriptions;
  
  window.showAddSubscriptionModal = function() {
    const modal = document.getElementById('add-subscription-modal');
    if (modal) modal.style.display = 'flex';
  };
  
  window.closeAddSubscriptionModal = function() {
    const modal = document.getElementById('add-subscription-modal');
    if (modal) modal.style.display = 'none';
  };
  
  window.createManualSubscription = async function() {
    const email = document.getElementById('new-sub-email')?.value?.trim();
    const type = document.getElementById('new-sub-type')?.value || 'embed';
    const days = parseInt(document.getElementById('new-sub-days')?.value) || 30;
    
    if (!email) {
      alert('Please enter a valid email address');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/admin/activate-subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type, days })
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`✅ Subscription activated for ${email}!\n\nType: ${type}\nDuration: ${days} days`);
        closeAddSubscriptionModal();
        loadAdminSubscriptions();
      } else {
        alert('❌ Error: ' + (result.error || 'Failed to activate subscription'));
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert('❌ Error: ' + error.message);
    }
  };
  
  window.toggleSubscriptionStatus = async function(email, newStatus) {
    const action = newStatus === 'active' ? 'activate' : 'deactivate';
    if (!confirm(`Are you sure you want to ${action} subscription for ${email}?`)) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/admin/update-subscription-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, status: newStatus })
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`✅ Subscription ${action}d for ${email}`);
        loadAdminSubscriptions();
      } else {
        alert('❌ Error: ' + (result.error || 'Failed to update subscription'));
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      alert('❌ Error: ' + error.message);
    }
  };
  
  window.extendSubscription = async function(email) {
    if (!confirm(`Extend subscription for ${email} by 30 days?`)) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/admin/extend-subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, days: 30 })
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`✅ Subscription extended by 30 days for ${email}\n\nNew expiry: ${new Date(result.newPeriodEnd).toLocaleDateString()}`);
        loadAdminSubscriptions();
      } else {
        alert('❌ Error: ' + (result.error || 'Failed to extend subscription'));
      }
    } catch (error) {
      console.error('Error extending subscription:', error);
      alert('❌ Error: ' + error.message);
    }
  };
  
  window.fixAllSubscriptionTypes = async function() {
    if (!confirm('This will update all subscriptions with type "subscription" to type "embed".\n\nContinue?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/admin/fix-subscription-types`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`✅ Fixed ${result.fixed} subscription(s)`);
        loadAdminSubscriptions();
      } else {
        alert('❌ Error: ' + (result.error || 'Failed to fix subscriptions'));
      }
    } catch (error) {
      console.error('Error fixing subscriptions:', error);
      alert('❌ Error: ' + error.message);
    }
  };

  // Load admin overview
  async function loadAdminOverview() {
    try {
      // Show loading indicators
      const userCountEl = document.getElementById('admin-total-users');
      const filesCountEl = document.getElementById('admin-total-files');
      const ticketsCountEl = document.getElementById('admin-open-tickets');
      const storageEl = document.getElementById('admin-storage-used');
      
      if (userCountEl) userCountEl.textContent = '...';
      if (filesCountEl) filesCountEl.textContent = '...';
      if (ticketsCountEl) ticketsCountEl.textContent = '...';
      if (storageEl) storageEl.textContent = '...';
      
      // Load data in parallel for better performance
      const [users, files, stats] = await Promise.all([
        CarnageAuth.getAllUsers(),
        getAllFiles(),
        CarnageSupport.getTicketStats()
      ]);
      
      if (userCountEl) userCountEl.textContent = users.length;
      if (filesCountEl) filesCountEl.textContent = files.length;
      if (ticketsCountEl) ticketsCountEl.textContent = stats.open;
      
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      if (storageEl) storageEl.textContent = formatFileSize(totalSize);
    } catch (error) {
      console.error('Error loading admin overview:', error);
      // Show error state
      const userCountEl = document.getElementById('admin-total-users');
      const filesCountEl = document.getElementById('admin-total-files');
      const ticketsCountEl = document.getElementById('admin-open-tickets');
      const storageEl = document.getElementById('admin-storage-used');
      
      if (userCountEl) userCountEl.textContent = '0';
      if (filesCountEl) filesCountEl.textContent = '0';
      if (ticketsCountEl) ticketsCountEl.textContent = '0';
      if (storageEl) storageEl.textContent = '0 MB';
    }
  }

  // Load admin users
  async function loadAdminUsers() {
    const container = document.getElementById('admin-users-list');
    const countBadge = document.getElementById('user-count-badge');
    
    if (!container) {
      console.error('Container admin-users-list not found');
      return;
    }
    
    // Prevent concurrent loading
    if (isLoadingAdminUsers) {
      console.log('Admin users already loading, skipping...');
      return;
    }
    
    isLoadingAdminUsers = true;
    console.log('Starting to load admin users...');
    
    try {
      // Show loading state
      container.innerHTML = '<tr><td colspan="5" class="empty-cell">Loading users...</td></tr>';
      
      // Check if CarnageAuth exists
      if (!window.CarnageAuth) {
        throw new Error('CarnageAuth is not initialized');
      }
      
      console.log('Fetching users from database...');
      const users = await CarnageAuth.getAllUsers();
      console.log('Users loaded successfully:', users ? users.length : 0, 'users');
      if (users && users.length > 0) {
        console.log('🔍 Sample user 0:', JSON.stringify(users[0], null, 2));
        console.log('💰 User 0 credits value:', users[0].credits, 'type:', typeof users[0].credits);
        // Log all users' credits for debugging
        console.log('📊 All users credits:', users.map(u => ({ name: u.name, credits: u.credits })));
      }
      
      if (!users) {
        throw new Error('getAllUsers returned null or undefined');
      }
      
      // Update count badge
      if (countBadge) {
        countBadge.textContent = `${users.length} user${users.length !== 1 ? 's' : ''}`;
      }
      
      // Render clean user table
      if (users.length === 0) {
        container.innerHTML = '<tr><td colspan="5" class="empty-cell">No users found</td></tr>';
      } else {
        container.innerHTML = users.map(user => `
          <tr data-user-id="${user.id}">
            <td>
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div style="width: 36px; height: 36px; background: ${user.role === 'admin' ? '#fef2f2' : '#eff6ff'}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; color: ${user.role === 'admin' ? '#dc2626' : '#3b82f6'};">
                  ${user.name ? user.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <div style="font-weight: 500; color: #1e293b;">${escapeHtml(user.name)}</div>
                  <div style="font-size: 0.8rem; color: #64748b;">${escapeHtml(user.email)}</div>
                </div>
              </div>
            </td>
            <td style="text-align: center;">
              <span style="background: ${user.role === 'admin' ? '#fef2f2' : '#eff6ff'}; color: ${user.role === 'admin' ? '#dc2626' : '#3b82f6'}; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">
                ${user.role}
              </span>
            </td>
            <td style="text-align: right; font-weight: 600; color: ${(parseFloat(user.credits) || 0) > 0 ? '#10b981' : '#94a3b8'};">
              £${(parseFloat(user.credits) || 0).toFixed(2)}
            </td>
            <td style="text-align: center;">
              <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; color: ${user.is_active ? '#10b981' : '#94a3b8'};">
                <span style="width: 6px; height: 6px; background: ${user.is_active ? '#10b981' : '#d1d5db'}; border-radius: 50%;"></span>
                ${user.is_active ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td style="text-align: center;">
              <button onclick="(function(){ const userId = '${user.id}'; console.log('🔘 Manage clicked for:', userId); window.openUserDetailModal(userId); })()" 
                      style="background: #f3f4f6; border: 1px solid #e5e7eb; color: #374151; padding: 0.375rem 0.75rem; border-radius: 6px; font-size: 0.8rem; cursor: pointer; font-weight: 500; transition: all 0.15s;">
                Manage
              </button>
            </td>
          </tr>
        `).join('');
      }
      
      console.log('User table rendered');
    } catch (error) {
      console.error('Error loading users:', error);
      container.innerHTML = `<tr><td colspan="5" class="empty-cell" style="color: #dc2626;">
        Error: ${error.message}<br>
        <button onclick="loadAdminUsers()" style="margin-top: 0.75rem; background: var(--cr-primary); color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer;">Retry</button>
      </td></tr>`;
    } finally {
      setTimeout(() => {
        isLoadingAdminUsers = false;
      }, 500);
    }
  }

  // Load admin iframes
  async function loadAdminIframes() {
    const container = document.getElementById('admin-iframes-list');
    if (!container) return;

    try {
      container.innerHTML = '<tr><td colspan="6" class="empty-cell">Loading iframes...</td></tr>';

      const response = await fetch('/api/admin/iframes');

      if (!response.ok) throw new Error('Failed to fetch iframes');

      const { iframes } = await response.json();

      // Update counts
      document.getElementById('iframe-total-count').textContent = iframes.length;
      document.getElementById('iframe-active-count').textContent = iframes.filter(i => i.status !== 'locked').length;
      document.getElementById('iframe-locked-count').textContent = iframes.filter(i => i.status === 'locked').length;

      if (iframes.length === 0) {
        container.innerHTML = '<tr><td colspan="6" class="empty-cell">No iframes created yet</td></tr>';
        return;
      }

      container.innerHTML = iframes.map(iframe => {
        const created = new Date(iframe.created_at).toLocaleDateString();
        const statusValue = iframe.status || (iframe.locked ? 'locked' : 'active');
        const isLocked = statusValue === 'locked';
        const status = isLocked ? '🔒 Locked' : '🔓 Active';
        const statusColor = isLocked ? '#ef4444' : '#22c55e';
        const urlPreview = iframe.url || iframe.embed_url || '';
        const shortUrl = urlPreview ? urlPreview.replace(/^https?:\/\//, '').slice(0, 80) : '—';
        const subActive = iframe.has_active_subscription;
        const subType = iframe.subscription_type || (iframe.type === 'vrm' ? 'vrm' : 'embed');
        const subBadge = subActive ? `Active ${subType}` : 'No active sub';
        const subColor = subActive ? '#22c55e' : '#f97316';
        const expiry = iframe.subscription_expires ? new Date(iframe.subscription_expires).toLocaleDateString() : null;
        const creatorEmail = iframe.email || iframe.contact_email || '—';
        
        return `
          <tr>
            <td>
              <div style="display:flex;flex-direction:column;gap:6px;max-width:340px;">
                <span style="font-size:0.8rem;color:#e2e8f0;font-weight:700;">${(iframe.type || 'embed').toUpperCase()}</span>
                <a href="${urlPreview || '#'}" target="_blank" rel="noopener" style="font-size:0.8rem;color:#93c5fd;text-decoration:${urlPreview ? 'underline' : 'none'};word-break:break-all;">${shortUrl}</a>
                <span style="display:inline-flex;gap:6px;align-items:center;font-size:0.8rem;color:${subColor};font-weight:700;">
                  <span style="background:${subColor}20;color:${subColor};padding:0.25rem 0.55rem;border-radius:999px;">${subBadge}</span>
                  ${expiry ? `<span style=\"color:#94a3b8;font-weight:600;\">exp ${expiry}</span>` : ''}
                </span>
              </div>
            </td>
            <td>
              <div style="display:flex;flex-direction:column;gap:4px;">
                <span style="font-size:0.9rem;color:#e2e8f0;font-weight:700;">${creatorEmail}</span>
                ${iframe.user_id ? `<span style=\"font-size:0.75rem;color:#94a3b8;\">ID: ${iframe.user_id}</span>` : ''}
              </div>
            </td>
            <td>
              <span style="background:${isLocked ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)'};color:${statusColor};padding:0.3rem 0.75rem;border-radius:6px;font-size:0.8rem;font-weight:600;display:inline-block;">
                ${status}
              </span>
            </td>
            <td style="font-size:0.85rem;color:#cbd5e1;">${created}</td>
            <td style="font-size:0.85rem;color:#cbd5e1;font-weight:600;"><span style="background:rgba(100,116,139,0.2);padding:0.25rem 0.5rem;border-radius:4px;">${iframe.uses || 0}</span></td>
            <td style="text-align:center;">
              <button class="toggle-iframe-btn" data-iframe-id="${iframe.id}" data-current-status="${statusValue}" style="background:${isLocked ? '#22c55e' : '#ef4444'};color:#fff;border:none;padding:0.4rem 0.8rem;border-radius:6px;cursor:pointer;font-size:0.8rem;margin-right:0.5rem;font-weight:600;">
                ${isLocked ? '🔓 Unlock' : '🔒 Lock'}
              </button>
            </td>
          </tr>
        `;
      }).join('');
      
      // Attach event listeners to toggle buttons - do this AFTER setting innerHTML
      console.log('📍 Looking for toggle buttons...');
      const toggleButtons = document.querySelectorAll('.toggle-iframe-btn');
      console.log(`Found ${toggleButtons.length} toggle buttons`);
      
      toggleButtons.forEach((btn, index) => {
        const iframeId = btn.dataset.iframeId;
        const currentStatus = btn.dataset.currentStatus;
        console.log(`Attaching listener to button ${index}: iframe=${iframeId}, status=${currentStatus}`);
        
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          const id = this.dataset.iframeId;
          const status = this.dataset.currentStatus;
          console.log(`🖱️ Button clicked! iframe=${id}, status=${status}`);
          window.toggleIframeStatus(id, status);
        });
      });
      
      console.log(`✅ Attached listeners to all ${toggleButtons.length} buttons`);
    } catch (error) {
      console.error('Error loading iframes:', error);
      container.innerHTML = `<tr><td colspan="6" class="empty-cell" style="color:#dc2626;">Error loading iframes: ${error.message}</td></tr>`;
    }
  }

  // VRM availability toggle (admin)
  async function loadVrmStatus() {
    const statusText = document.getElementById('vrm-status-text');
    const btn = document.getElementById('vrm-toggle-btn');
    if (!statusText || !btn) return;

    try {
      const resp = await fetch('/api/vrm-status');
      const data = resp.ok ? await resp.json() : { enabled: true };
      const enabled = !!data.enabled;
      statusText.textContent = enabled ? 'VRM lookup is ENABLED' : 'VRM lookup is DISABLED';
      statusText.style.color = enabled ? '#34d399' : '#f87171';
      btn.textContent = enabled ? 'Disable VRM' : 'Enable VRM';
      btn.style.background = enabled ? '#ef4444' : '#22c55e';
      btn.style.color = '#0b0f19';
    } catch (err) {
      statusText.textContent = 'Unable to load status';
      statusText.style.color = '#fbbf24';
    }
  }

  async function toggleVrmStatus() {
    const statusText = document.getElementById('vrm-status-text');
    const btn = document.getElementById('vrm-toggle-btn');
    if (!btn) return;

    try {
      const current = statusText?.textContent?.includes('ENABLED');
      const resp = await fetch('/api/admin/vrm-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': sessionStorage.getItem('userEmail') || ''
        },
        body: JSON.stringify({ enabled: !current })
      });

      if (!resp.ok) throw new Error('Failed to toggle');
      await loadVrmStatus();
    } catch (err) {
      alert('Unable to toggle VRM: ' + err.message);
    }
  }

  // Toggle iframe status (exposed globally)
  window.toggleIframeStatus = async function(iframeId, currentStatus) {
    try {
      console.log(`🔄 Starting toggle: iframeId=${iframeId}, currentStatus=${currentStatus}`);
      
      if (!iframeId) {
        throw new Error('No iframe ID provided');
      }
      
      if (!currentStatus) {
        throw new Error('No current status provided');
      }
      
      // Note: backend expects current status, will toggle it
      const payload = { status: currentStatus };
      console.log(`📤 Sending payload:`, payload);
      
      const response = await fetch(`/api/admin/iframes/${iframeId}/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      console.log(`📥 Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Server error: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      console.log(`📦 Response data:`, data);
      
      if (data.success) {
        const newStatus = currentStatus === 'locked' ? 'active' : 'locked';
        console.log(`✅ Iframe ${iframeId} toggled to ${newStatus}`);
        
        // Refresh the list
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms for DB to settle
        loadAdminIframes();
      } else {
        alert('Error: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Toggle error:', error);
      alert('Error: ' + error.message);
    }
  };

  // Initialize iframe tracking when admin iframes tab is clicked
  document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('admin-iframes-refresh-btn');
    if (refreshBtn) {
      refreshBtn.onclick = loadAdminIframes;
    }
    const vrmToggleBtn = document.getElementById('vrm-toggle-btn');
    if (vrmToggleBtn) {
      vrmToggleBtn.onclick = toggleVrmStatus;
      loadVrmStatus();
    }
  });

  // Load iframes when tab is selected
  document.addEventListener('tabselected', (e) => {
    if (e.detail?.tabId === 'admin-iframes') {
      loadAdminIframes();
      loadVrmStatus();
    }
  });

  // Load admin tickets
  async function loadAdminTickets() {
    console.log('=== loadAdminTickets called ===');
    const container = document.getElementById('admin-tickets-list');
    
    if (!container) {
      console.error('Admin tickets container not found');
      return;
    }
    
    console.log('Container found:', container);
    console.log('Container display:', window.getComputedStyle(container).display);
    console.log('Container parent:', container.parentElement);
    console.log('Parent display:', window.getComputedStyle(container.parentElement).display);
    
    // Show loading state
    container.innerHTML = `
      <div style="padding: 3rem; text-align: center; color: #9ca3af;">
        <p style="font-size: 2rem; margin: 0;">⏳</p>
        <p style="margin: 1rem 0 0 0;">Loading tickets...</p>
      </div>
    `;
    
    try {
      // Ensure CarnageSupport is initialized
      if (!window.CarnageSupport) {
        throw new Error('CarnageSupport module not loaded');
      }
      
      // Wait for initialization if needed (with retry)
      let retries = 0;
      const maxRetries = 5;
      
      while (!window.CarnageSupport.isInitialized() && retries < maxRetries) {
        console.log(`Waiting for CarnageSupport to initialize... (attempt ${retries + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 200)); // Wait 200ms
        retries++;
      }
      
      // If still not initialized after retries, initialize now
      if (!window.CarnageSupport.isInitialized()) {
        console.log('Force initializing CarnageSupport...');
        await CarnageSupport.init();
      }
      
      console.log('CarnageSupport is ready, fetching tickets...');
      const tickets = await CarnageSupport.getAllTickets();
      console.log('Tickets fetched:', tickets.length);
      
      if (tickets.length === 0) {
        container.innerHTML = `
          <div style="padding: 3rem; text-align: center; color: #9ca3af;">
            <p style="font-size: 3rem; margin: 0;">🎫</p>
            <p style="margin: 1rem 0 0 0;">No support tickets yet</p>
            <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; opacity: 0.7;">Tickets will appear here when users request support</p>
          </div>
        `;
        return;
      }
      
      tickets.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.created_at);
        const dateB = new Date(b.createdAt || b.created_at);
        return dateB - dateA;
      });
      
      container.innerHTML = tickets.map(ticket => {
        // Get the first message or use subject as preview
        const messagePreview = ticket.message || ticket.subject || 'No message';
        const previewText = messagePreview.substring(0, 100);
        
        // Handle date format
        const createdDate = ticket.createdAt || ticket.created_at;
        const dateStr = createdDate ? new Date(createdDate).toLocaleDateString() : 'Unknown date';
        
        return `
        <div class="ticket-card" 
             data-ticket-id="${ticket.id}" 
             data-status="${ticket.status}" 
             onclick="console.log('Inline onclick fired for ticket ${ticket.id}'); window.showTicketModal(${ticket.id});"
             style="cursor: pointer; user-select: none; position: relative; z-index: 1;">
          <div class="ticket-header">
            <h4 class="ticket-subject">${escapeHtml(ticket.subject || 'No Subject')}</h4>
            <div class="ticket-badges">
              <span class="ticket-badge status-${ticket.status}">${ticket.status.toUpperCase()}</span>
              <span class="ticket-badge priority-${ticket.priority || 'normal'}">${(ticket.priority || 'normal').toUpperCase()}</span>
            </div>
          </div>
          <p class="ticket-meta">By ${escapeHtml(ticket.userName || 'Unknown')} • ${dateStr}</p>
          <p style="color: #6b7280; font-size: 0.875rem; margin: 0.5rem 0 0 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(previewText)}${messagePreview.length > 100 ? '...' : ''}</p>
        </div>
        `;
      }).join('');
      
      console.log('Tickets rendered, cards count:', container.querySelectorAll('.ticket-card').length);
      
      // Bind click events
      const ticketCards = container.querySelectorAll('.ticket-card');
      console.log('Found ticket cards:', ticketCards.length);
      
      ticketCards.forEach((card, index) => {
        console.log(`Attaching click handler to card ${index + 1}`, card);
        card.style.cursor = 'pointer';
        
        // Add click handler
        const clickHandler = (e) => {
          console.log('🖱️ CLICK EVENT FIRED!');
          e.preventDefault();
          e.stopPropagation();
          const ticketId = parseInt(card.dataset.ticketId);
          console.log('🎫 Ticket card clicked! ID:', ticketId);
          console.log('Calling showTicketModal function...');
          try {
            showTicketModal(ticketId);
          } catch (error) {
            console.error('Error calling showTicketModal:', error);
          }
        };
        
        card.addEventListener('click', clickHandler);
        
        // Also add pointer events to make sure it's clickable
        card.style.pointerEvents = 'auto';
      });
      
      // Setup filter functionality
      const filterBtns = document.querySelectorAll('.ticket-filters .filter-btn');
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const filter = btn.dataset.filter;
          
          // Update active state
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          
          // Filter tickets
          const ticketCards = container.querySelectorAll('.ticket-card');
          ticketCards.forEach(card => {
            const status = card.dataset.status;
            if (filter === 'all') {
              card.style.display = 'block';
            } else {
              card.style.display = status === filter ? 'block' : 'none';
            }
          });
        });
      });
      
    } catch (error) {
      console.error('Error loading tickets:', error);
      console.error('Error details:', error.message, error.stack);
      container.innerHTML = `
        <div style="padding: 3rem; text-align: center; color: #ef4444;">
          <p style="font-size: 2rem; margin: 0;">⚠️</p>
          <p style="margin: 1rem 0 0 0;">Error loading tickets</p>
          <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem;">${error.message || 'Unknown error'}</p>
          <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer;">Refresh Page</button>
        </div>
      `;
    }
  }

  // Load admin files
  async function loadAdminFiles() {
    const container = document.getElementById('admin-files-list');
    
    try {
      const files = await getAllFiles();
      
      if (files.length === 0) {
        container.innerHTML = '<p class="empty-state">No files uploaded yet</p>';
        return;
      }
      
      files.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
      
      // Status color mapping
      const statusColors = {
        'queued': '#6b7280',
        'in-progress': '#3b82f6',
        'completed': '#10b981',
        'returned': '#8b5cf6',
        'pending': '#f59e0b'
      };
      
      const getStatusBadge = (status) => {
        const displayStatus = status || 'queued';
        const color = statusColors[displayStatus] || '#6b7280';
        return `<span style="display:inline-block;background:${color};color:white;padding:4px 8px;border-radius:4px;font-size:0.75rem;font-weight:600;">${capitalizeStatus(displayStatus)}</span>`;
      };
      
      container.innerHTML = files.map(file => {
        const messageCount = file.messages ? file.messages.length : 0;
        const messageBadge = messageCount > 0 
          ? `<span style="position:absolute;top:-8px;right:-8px;background:#10b981;color:white;padding:4px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;box-shadow:0 2px 4px rgba(0,0,0,0.1);">${messageCount}</span>` 
          : '';
        
        const status = file.status || 'queued';
        
        return `
          <div class="file-card" style="position:relative;">
            ${messageBadge}
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:0.5rem;">
              <div class="file-card-icon">${getFileExtension(file.name).substring(0, 3)}</div>
              ${getStatusBadge(status)}
            </div>
            <h3 class="file-card-name">${escapeHtml(file.name)}</h3>
            <p class="file-card-meta">
              ${escapeHtml(file.customerName || 'Unknown')} • ${formatFileSize(file.size)} • ${new Date(file.uploadDate).toLocaleDateString()}
            </p>
            ${messageCount > 0 ? `<p style="color:#10b981;font-size:0.875rem;margin:0.5rem 0;">💬 ${messageCount} message${messageCount > 1 ? 's' : ''}</p>` : ''}
            
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin:0.75rem 0;">
              <button class="status-btn" data-file-id="${file.id}" data-status="in-progress" style="background:#3b82f6;color:white;border:none;padding:0.4rem 0.75rem;border-radius:4px;cursor:pointer;font-size:0.875rem;">🔄 In Progress</button>
              <button class="status-btn" data-file-id="${file.id}" data-status="completed" style="background:#10b981;color:white;border:none;padding:0.4rem 0.75rem;border-radius:4px;cursor:pointer;font-size:0.875rem;">✅ Completed</button>
              <button class="status-btn" data-file-id="${file.id}" data-status="returned" style="background:#8b5cf6;color:white;border:none;padding:0.4rem 0.75rem;border-radius:4px;cursor:pointer;font-size:0.875rem;">↩️ Returned</button>
            </div>
            
            <div class="file-card-actions">
              <button class="btn small primary view-admin-file-btn" data-file-id="${file.id}">View & Respond</button>
              <button class="btn small secondary download-btn" data-file-id="${file.id}">Download</button>
              <button class="btn small danger delete-btn" data-file-id="${file.id}">Delete</button>
            </div>
          </div>
        `;
      }).join('');
      
      // Bind status buttons
      container.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const fileId = parseInt(btn.dataset.fileId);
          const newStatus = btn.dataset.status;
          await changeFileStatus(fileId, newStatus);
          await loadAdminFiles(); // Refresh list
        });
      });
      
      // Bind action buttons
      container.querySelectorAll('.view-admin-file-btn').forEach(btn => {
        btn.addEventListener('click', () => viewFileDetails(parseInt(btn.dataset.fileId)));
      });
      
      container.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', () => downloadFile(parseInt(btn.dataset.fileId)));
      });
      
      container.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => confirmDeleteFile(parseInt(btn.dataset.fileId)));
      });
    } catch (error) {
      console.error('Error loading files:', error);
      container.innerHTML = '<p style="color: #ef4444; text-align: center; padding: 2rem;">❌ Error loading files:<br>' + error.message + '</p>';
    }
  }

  // Load admin notifications
  async function loadAdminNotifications() {
    // Call the notification loader specifically for the overview container
    await loadRecentNotifications('admin-notifications-list');
  }
  
  // Helper function for notification time formatting
  function formatNotificationTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  }
  
  // Helper function for badge colors
  function getBadgeColor(status) {
    const colors = {
      'queued': '#f59e0b',
      'in-progress': '#3b82f6',
      'completed': '#10b981',
      'returned': '#10b981',
      'open': '#f59e0b',
      'resolved': '#10b981',
      'closed': '#6b7280'
    };
    return colors[status] || '#94a3b8';
  }

  // Download file - USER VERSION (uses Supabase)
  async function downloadFile(fileId) {
    try {
      console.log('🔽 User downloading file:', fileId);
      const file = await getFileById(fileId);
      
      if (!file) {
        alert('❌ File not found');
        return;
      }
      
      console.log('📦 File data:', file);
      
      // Supabase stores file URLs, not blobs
      const fileUrl = file.originalFile || file.original_file;
      console.log('📎 File URL:', fileUrl);
      
      if (fileUrl) {
        const fileName = file.filename || file.name || 'download.bin';
        
        console.log('⬇️ Attempting download:', fileName, 'from', fileUrl);
        
        // Check if URL is accessible
        try {
          const response = await fetch(fileUrl, { method: 'HEAD' });
          console.log('📡 Response status:', response.status, response.statusText);
          
          if (!response.ok) {
            let errorMsg = `❌ Storage Error (${response.status}): `;
            
            switch(response.status) {
              case 400:
                errorMsg += 'Bad Request - The file URL is malformed or invalid.\n\n';
                errorMsg += `URL: ${fileUrl}\n\n`;
                errorMsg += 'This usually means:\n';
                errorMsg += '• Supabase storage bucket is not configured\n';
                errorMsg += '• File was uploaded to wrong storage path\n';
                errorMsg += '• Storage URL format has changed\n\n';
                errorMsg += 'Please contact admin to check Supabase storage setup.';
                break;
              case 403:
                errorMsg += 'Access Denied - Storage bucket permissions are incorrect.';
                break;
              case 404:
                errorMsg += 'File Not Found - The file has been deleted or moved.';
                break;
              default:
                errorMsg += `${response.statusText}\n\nURL: ${fileUrl}`;
            }
            
            console.error('❌ File URL not accessible:', response.status, fileUrl);
            alert(errorMsg);
            return;
          }
        } catch (fetchError) {
          console.error('❌ Network error accessing file:', fetchError);
          
          let errorMsg = '❌ Network Error: Cannot reach file storage.\n\n';
          errorMsg += `URL: ${fileUrl}\n\n`;
          errorMsg += 'This could mean:\n';
          errorMsg += '• No internet connection\n';
          errorMsg += '• Supabase storage service is down\n';
          errorMsg += '• CORS policy blocking the request\n\n';
          errorMsg += 'Please try again or contact support.';
          
          alert(errorMsg);
          return;
        }
        
        // Create temporary link and trigger download
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = fileName;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        console.log('✅ Download initiated:', fileName);
      } else if (file.data) {
        // Fallback for old IndexedDB format
        console.log('📦 Using legacy data format');
        const a = document.createElement('a');
        a.href = file.data;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        console.error('❌ No file URL found in:', file);
        alert('❌ File data not available. The file may not have been uploaded to storage yet.');
      }
    } catch (error) {
      console.error('❌ Error downloading file:', error);
      alert('Failed to download file: ' + error.message);
    }
  }

  // Download tuned file - USER VERSION (uses Supabase)
  async function downloadTunedFile(fileId) {
    try {
      console.log('🔽 User downloading tuned file:', fileId);
      const file = await getFileById(fileId);
      
      if (!file) {
        alert('❌ File not found');
        return;
      }
      
      console.log('📦 File data:', file);
      
      // Supabase stores file URLs
      const tunedUrl = file.modifiedFile || file.modified_file;
      console.log('📎 Tuned file URL:', tunedUrl);
      
      if (tunedUrl) {
        const fileName = 'tuned_' + (file.filename || file.name || 'download.bin');
        
        console.log('⬇️ Attempting tuned file download:', fileName, 'from', tunedUrl);
        
        // Check if URL is accessible
        try {
          const response = await fetch(tunedUrl, { method: 'HEAD' });
          console.log('📡 Tuned file response status:', response.status, response.statusText);
          
          if (!response.ok) {
            let errorMsg = `❌ Tuned File Storage Error (${response.status}): `;
            
            switch(response.status) {
              case 400:
                errorMsg += 'Bad Request - The tuned file URL is malformed or invalid.\n\n';
                errorMsg += `URL: ${tunedUrl}\n\n`;
                errorMsg += 'This usually means:\n';
                errorMsg += '• File has not been tuned yet\n';
                errorMsg += '• Supabase storage bucket is not configured\n';
                errorMsg += '• Tuned file was uploaded to wrong storage path\n\n';
                errorMsg += 'Please contact admin or wait for file to be tuned.';
                break;
              case 403:
                errorMsg += 'Access Denied - Storage bucket permissions are incorrect.';
                break;
              case 404:
                errorMsg += 'Tuned File Not Found - The file has not been tuned yet or was deleted.';
                break;
              default:
                errorMsg += `${response.statusText}\n\nURL: ${tunedUrl}`;
            }
            
            console.error('❌ Tuned file URL not accessible:', response.status, tunedUrl);
            alert(errorMsg);
            return;
          }
        } catch (fetchError) {
          console.error('❌ Network error accessing tuned file:', fetchError);
          
          let errorMsg = '❌ Network Error: Cannot reach tuned file storage.\n\n';
          errorMsg += `URL: ${tunedUrl}\n\n`;
          errorMsg += 'This could mean:\n';
          errorMsg += '• No internet connection\n';
          errorMsg += '• Supabase storage service is down\n';
          errorMsg += '• File has not been tuned yet\n\n';
          errorMsg += 'Please try again or contact support.';
          
          alert(errorMsg);
          return;
        }
        
        // Create temporary link and trigger download
        const a = document.createElement('a');
        a.href = tunedUrl;
        a.download = fileName;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        console.log('✅ Tuned file download initiated:', fileName);
      } else if (file.tunedFile && file.tunedFile.data) {
        // Fallback for old IndexedDB format
        console.log('📦 Using legacy tuned file format');
        const a = document.createElement('a');
        a.href = file.tunedFile.data;
        a.download = file.tunedFile.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        console.error('❌ No tuned file URL found in:', file);
        alert('❌ No tuned file available for download. The file may not have been tuned yet.');
      }
    } catch (error) {
      console.error('❌ Error downloading tuned file:', error);
      alert('Failed to download tuned file: ' + error.message);
    }
  }

  // Confirm delete file
  function confirmDeleteFile(fileId) {
    if (confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      deleteFileAndRefresh(fileId);
    }
  }

  // Delete file and refresh display
  async function deleteFileAndRefresh(fileId) {
    try {
      await deleteFile(fileId);
      displayFiles();
      updateDashboardStats();
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error deleting file');
    }
  }

  // Update dashboard statistics
  async function updateDashboardStats() {
    try {
      const allFiles = await getAllFiles();
      const userId = parseInt(sessionStorage.getItem('userId'));
      const isAdmin = await CarnageAuth.isAdmin();
      
      if (isAdmin) {
        // ADMIN VIEW - Show system-wide statistics
        const allUsers = await CarnageAuth.getAllUsers();
        const allTickets = await CarnageSupport.getAllTickets();
        const openTickets = allTickets.filter(t => t.status === 'open' || t.status === 'in-progress');
        
        // Calculate today/week/month breakdown for ALL users
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const filesToday = allFiles.filter(f => new Date(f.uploadDate) >= today).length;
        const filesWeek = allFiles.filter(f => new Date(f.uploadDate) >= weekAgo).length;
        const filesMonth = allFiles.filter(f => new Date(f.uploadDate) >= monthStart).length;
        
        // Update today/week/month stats
        const todayEl = document.getElementById('files-today');
        const weekEl = document.getElementById('files-week');
        const monthEl = document.getElementById('files-month');
        if (todayEl) todayEl.textContent = filesToday;
        if (weekEl) weekEl.textContent = filesWeek;
        if (monthEl) monthEl.textContent = filesMonth;
        
        // Total files across all users
        document.getElementById('total-files-count').textContent = allFiles.length;
        
        // Completed files across all users
        const completedFiles = allFiles.filter(f => f.status === 'returned' || f.status === 'completed');
        const completedEl = document.getElementById('files-completed');
        if (completedEl) completedEl.textContent = completedFiles.length;
        
        // Total storage across all users
        const totalSize = allFiles.reduce((sum, file) => sum + file.size, 0);
        const storageUsedEl = document.getElementById('storage-used');
        if (storageUsedEl) storageUsedEl.textContent = formatFileSize(totalSize);
        
        // Open tickets across all users
        const openTicketsEl = document.getElementById('open-tickets-count');
        if (openTicketsEl) openTicketsEl.textContent = openTickets.length;
        
        // Latest upload across all users
        if (allFiles.length > 0) {
          const latest = allFiles.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))[0];
          const latestUploadEl = document.getElementById('latest-upload');
          if (latestUploadEl) {
            latestUploadEl.textContent = `${latest.vehicle || latest.name} (${latest.customerName || 'Unknown'})`;
          }
        } else {
          const latestUploadEl = document.getElementById('latest-upload');
          if (latestUploadEl) {
            latestUploadEl.textContent = 'No files yet';
          }
        }
        
      } else {
        // REGULAR USER VIEW - Show only their own statistics
        const tickets = await CarnageSupport.getTicketsByUserId(userId);
        const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in-progress');
        
        // Get current user's email
        const currentUser = CarnageAuth.getCurrentUser();
        const userEmail = currentUser ? currentUser.email : null;
        
        console.log('👤 Current user email:', userEmail);
        console.log('📁 All files:', allFiles.length);
        
        // Filter files to only show current user's files
        const files = userEmail 
          ? allFiles.filter(file => {
              const fileEmail = file.customerEmail || file.customer_email;
              const matches = fileEmail === userEmail;
              if (matches) {
                console.log('✅ File matches:', file.filename || file.name, 'Email:', fileEmail);
              }
              return matches;
            })
          : [];
        
        console.log('📊 User\'s files:', files.length);
        
        // Calculate today/week/month breakdown
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const filesToday = files.filter(f => new Date(f.uploadDate) >= today).length;
        const filesWeek = files.filter(f => new Date(f.uploadDate) >= weekAgo).length;
        const filesMonth = files.filter(f => new Date(f.uploadDate) >= monthStart).length;
        
        // Update today/week/month stats
        const todayEl = document.getElementById('files-today');
        const weekEl = document.getElementById('files-week');
        const monthEl = document.getElementById('files-month');
        if (todayEl) todayEl.textContent = filesToday;
        if (weekEl) weekEl.textContent = filesWeek;
        if (monthEl) monthEl.textContent = filesMonth;
        
        // Total files (user's files only)
        const totalFilesEl = document.getElementById('total-files-count');
        if (totalFilesEl) totalFilesEl.textContent = files.length;
        
        // Files completed (using returned status)
        const completedFiles = files.filter(f => f.status === 'returned' || f.status === 'completed');
        const completedEl = document.getElementById('files-completed');
        if (completedEl) completedEl.textContent = completedFiles.length;
        
        // Total storage used (user's files only)
        const totalSize = files.reduce((sum, file) => sum + file.size, 0);
        const storageEl = document.getElementById('storage-used');
        if (storageEl) storageEl.textContent = formatFileSize(totalSize);
        
        // Open tickets
        const openTicketsEl = document.getElementById('open-tickets-count');
        if (openTicketsEl) openTicketsEl.textContent = openTickets.length;
        
        // Latest upload (user's files only)
        const latestUploadEl = document.getElementById('latest-upload');
        if (latestUploadEl) {
          if (files.length > 0) {
            const latest = files.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))[0];
            latestUploadEl.textContent = latest.vehicle || latest.name;
          } else {
            latestUploadEl.textContent = 'No files yet';
          }
        }
        
        // Update discount progress (for regular users only)
        updateDiscountProgress(files);
      }
    } catch (error) {
      console.error('Error updating dashboard:', error);
    }
  }

  // Update file upload statistics for current user
  function updateDiscountProgress(userFiles) {
    console.log('📊 Updating file upload statistics:', userFiles);
    
    // Get current date info
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Calculate last 6 months of data for the graph
    const monthsData = [];
    const monthLabels = [];
    
    for (let i = 5; i >= 0; i--) {
      let month = currentMonth - i;
      let year = currentYear;
      
      if (month < 0) {
        month += 12;
        year -= 1;
      }
      
      const monthFiles = userFiles.filter(file => {
        const uploadDate = file.uploadDate || file.upload_date;
        if (!uploadDate) return false;
        const fileDate = new Date(uploadDate);
        return fileDate.getMonth() === month && fileDate.getFullYear() === year;
      });
      
      const fileCount = monthFiles.length;
      monthsData.push(fileCount);
      
      // Create month label
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      monthLabels.push(monthNames[month]);
    }
    
    // Get files for current month
    const filesThisMonth = userFiles.filter(file => {
      const uploadDate = file.uploadDate || file.upload_date;
      if (!uploadDate) return false;
      const fileDate = new Date(uploadDate);
      return fileDate.getMonth() === currentMonth && fileDate.getFullYear() === currentYear;
    });
    
    // Get files for last month
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const filesLastMonth = userFiles.filter(file => {
      const uploadDate = file.uploadDate || file.upload_date;
      if (!uploadDate) return false;
      const fileDate = new Date(uploadDate);
      return fileDate.getMonth() === lastMonth && fileDate.getFullYear() === lastMonthYear;
    });
    
    console.log(`📅 This month (${currentMonth}/${currentYear}): ${filesThisMonth.length} files`);
    console.log(`� Last month (${lastMonth}/${lastMonthYear}): ${filesLastMonth.length} files`);
    
    // Update current month count
    const thisMonthEl = document.getElementById('files-this-month-count');
    if (thisMonthEl) {
      thisMonthEl.textContent = filesThisMonth.length;
    }
    
    // Update last month count
    const lastMonthEl = document.getElementById('files-last-month-count');
    if (lastMonthEl) {
      lastMonthEl.textContent = filesLastMonth.length;
    }
    
    // Create or update the Chart.js graph
    createUploadStatsChart(monthLabels, monthsData);
  }

  // Create file upload statistics chart
  let uploadStatsChart = null;
  function createUploadStatsChart(labels, filesData) {
    console.log('🎨 Creating upload stats chart...');
    console.log('📊 Labels:', labels);
    console.log('📊 Data:', filesData);
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
      console.error('❌ Chart.js is not loaded!');
      return;
    }
    
    const canvas = document.getElementById('upload-stats-chart');
    if (!canvas) {
      console.warn('❌ Upload stats chart canvas not found');
      return;
    }
    
    console.log('✅ Canvas found:', canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (uploadStatsChart) {
      console.log('🗑️ Destroying old chart');
      uploadStatsChart.destroy();
    }
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 350);
    gradient.addColorStop(0, 'rgba(139, 92, 246, 0.8)');
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0.2)');
    
    try {
      // Create new chart
      uploadStatsChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Files Uploaded',
              data: filesData,
              backgroundColor: gradient,
              borderColor: 'rgba(139, 92, 246, 1)',
              borderWidth: 2,
              borderRadius: 8,
              hoverBackgroundColor: 'rgba(139, 92, 246, 1)'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                  size: 13,
                  weight: '600'
                },
                color: '#0f172a'
              }
            },
            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              padding: 12,
              cornerRadius: 8,
              titleFont: {
                size: 14,
                weight: 'bold'
              },
              bodyFont: {
                size: 13
              },
              callbacks: {
                label: function(context) {
                  const count = context.parsed.y;
                  return `Files uploaded: ${count}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                font: {
                  size: 12
                },
                color: '#64748b'
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.05)',
                drawBorder: false
              },
              title: {
                display: true,
                text: 'Number of Files',
                font: {
                  size: 13,
                  weight: 'bold'
                },
                color: '#0f172a',
                padding: 10
              }
            },
            x: {
              grid: {
                display: false,
                drawBorder: false
              },
              ticks: {
                font: {
                  size: 12,
                  weight: '600'
                },
                color: '#0f172a'
              }
            }
          }
        }
      });
      
      console.log('✅ Upload statistics chart created successfully!');
    } catch (error) {
      console.error('❌ Error creating chart:', error);
    }
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Migration: Add customerEmail to existing files
  async function migrateExistingFiles() {
    try {
      const files = await getAllFiles();
      let migrated = 0;
      
      for (const file of files) {
        // Skip if already has customerEmail
        if (file.customerEmail) continue;
        
        // Set default email for files without owner
        // Admin can reassign these later if needed
        const updatedFile = {
          ...file,
          customerEmail: 'legacy@carnageremaps.com',
          customerName: 'Legacy User'
        };
        
        // Update the file
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        await new Promise((resolve, reject) => {
          const request = objectStore.put(updatedFile);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
        
        migrated++;
      }
      
      if (migrated > 0) {
        console.log(`Migrated ${migrated} legacy files with default customerEmail`);
      }
    } catch (error) {
      console.error('Error migrating files:', error);
    }
  }

  // Migration: Add creditBalance to existing users
  async function migrateExistingUsers() {
    try {
      const users = await CarnageAuth.getAllUsers();
      let migrated = 0;
      
      for (const user of users) {
        // Skip if already has creditBalance
        if (typeof user.creditBalance === 'number') continue;
        
        // Add creditBalance: 0 to existing users
        user.creditBalance = 0;
        
        // Update the user in database
        await CarnageAuth.updateUser(user.id, { creditBalance: 0 });
        
        migrated++;
      }
      
      if (migrated > 0) {
        console.log(`✅ Added creditBalance to ${migrated} existing users`);
      }
    } catch (error) {
      console.error('Error migrating users:', error);
    }
  }

  // ============================
  // BILLING & CREDIT FUNCTIONS
  // ============================

  async function loadCreditBalance() {
    try {
      const user = window.CarnageAuth.currentUser;
      if (!user) return;

      const credit = await window.CarnageAuth.getUserCredit(user.id);
      const creditBalanceEl = document.getElementById('credit-balance');
      if (creditBalanceEl) {
        creditBalanceEl.textContent = `£${credit.toFixed(2)}`;
      }
    } catch (error) {
      console.error('Error loading credit balance:', error);
    }
  }

    // Wrapper function for backward compatibility
    async function subscribeToWidget() {
      await createEmbedSubscription();
    }

    // Create embed subscription via Stripe
    // Money goes to YOUR Stripe account, subscription activated via webhook
    async function createEmbedSubscription() {
      try {
        const userId = sessionStorage.getItem('userId');
        const userEmail = sessionStorage.getItem('userEmail');
        const userName = sessionStorage.getItem('userName');
        
        if (!userId || !userEmail) {
          alert('Please log in to subscribe');
          return;
        }
        
        if (!STRIPE_ENABLED || !stripe) {
          alert('Payment system not configured. Please contact support.');
          return;
        }
        
        // Show loading indicator
        const loadingMsg = document.createElement('div');
        loadingMsg.id = 'stripe-loading';
        loadingMsg.textContent = '🔄 Setting up your subscription...';
        loadingMsg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:30px 40px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.15);z-index:10000;font-size:1.1rem;font-weight:600;color:#1e293b;';
        document.body.appendChild(loadingMsg);
        
        console.log('💳 Creating Stripe subscription - Payment will go to YOUR account monthly');
        
        // Create Stripe subscription checkout via your backend
        // Your backend should:
        // 1. Create a Stripe subscription (recurring monthly payment)
        // 2. Money goes to YOUR Stripe account every month
        // 3. On successful payment (webhook), activate subscription in database
        const response = await fetch(`${API_URL}/api/create-subscription-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            userEmail: userEmail,
            userName: userName,
            plan: 'embed-widget',
            amount: 9.99,
            currency: 'gbp',
            interval: 'month',
            description: 'Vehicle Stats Widget - Monthly Subscription',
            successUrl: `${window.location.origin}${window.location.pathname}?payment=success&type=subscription`,
            cancelUrl: `${window.location.origin}${window.location.pathname}?payment=cancelled`
          })
        });
        
        const loading = document.getElementById('stripe-loading');
        if (loading) document.body.removeChild(loading);
        
        if (!response.ok) {
          throw new Error('Failed to create subscription session - Backend API required');
        }
        
        const session = await response.json();
        
        // Redirect to Stripe Checkout for subscription (money goes to YOUR account)
        const result = await stripe.redirectToCheckout({
          sessionId: session.sessionId
        });
        
        if (result.error) {
          throw new Error(result.error.message);
        }
        
      } catch (error) {
        console.error('Error creating subscription:', error);
        const loading = document.getElementById('stripe-loading');
        if (loading) document.body.removeChild(loading);
        alert('Error: ' + error.message + '\n\nPlease ensure your backend API is set up. See STRIPE_SETUP.md');
      }
    }

  function generateWidgetEmbedCode(user) {
    const apiKey = btoa(`${user.id}-${Date.now()}`); // Simple API key generation
    const embedCode = `<!-- Carnage Remaps Vehicle Stats Widget -->
<div id="carnage-widget"></div>
<script src="https://carnageremaps.com/widget.js"></script>
<script>
  CarnageWidget.init({
    apiKey: '${apiKey}',
    container: 'carnage-widget'
  });
</script>`;

    // Show modal with embed code
    const modal = document.createElement('div');
    modal.className = 'cr-modal-overlay';
    modal.innerHTML = `
      <div class="cr-modal-content" style="max-width: 600px;">
        <div class="cr-modal-header">
          <h2>🎉 Widget Embed Code</h2>
          <button class="cr-modal-close" onclick="this.closest('.cr-modal-overlay').remove()">&times;</button>
        </div>
        <div class="cr-modal-body">
          <p style="margin-bottom: 15px; color: #666;">Copy and paste this code into your website where you want the widget to appear:</p>
          <textarea readonly style="width: 100%; height: 200px; font-family: monospace; font-size: 12px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; background: #f5f5f5;">${embedCode}</textarea>
          <button class="cr-btn cr-btn-primary" style="margin-top: 15px;" onclick="navigator.clipboard.writeText(\`${embedCode.replace(/`/g, '\\`')}\`); showNotification('Embed code copied to clipboard!', 'success')">
            📋 Copy to Clipboard
          </button>
          <p style="margin-top: 15px; color: #999; font-size: 14px;">
            <strong>Note:</strong> This code has also been sent to your email.
          </p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  async function requestTopUp() {
    try {
      const user = window.CarnageAuth.currentUser;
      if (!user) {
        showNotification('Please log in to add credit', 'error');
        return;
      }

      const amountInput = document.getElementById('topup-amount');
      const amount = parseFloat(amountInput.value);

      if (!amount || amount < 10) {
        showNotification('Minimum top up amount is £10', 'error');
        return;
      }

      // Use Stripe for direct payment (already implemented in initiateTopUp)
      if (typeof initiateTopUp === 'function') {
        await initiateTopUp();
      } else {
        showNotification('Payment system not available. Please contact support.', 'error');
      }
      
    } catch (error) {
      console.error('Error processing payment:', error);
      showNotification('Failed to process payment. Please try again.', 'error');
    }
  }

  function showTopUpModal() {
    const modal = document.getElementById('topup-modal');
    if (modal) modal.style.display = 'flex';
  }

  function closeTopUpModal() {
    const modal = document.getElementById('topup-modal');
    if (modal) modal.style.display = 'none';
  }

  async function loadTransactionHistory() {
    try {
      const user = window.CarnageAuth.currentUser;
      if (!user) return;

      const db = await openDB();
      const transactions = await new Promise((resolve, reject) => {
        const transaction = db.transaction(['TRANSACTIONS'], 'readonly');
        const store = transaction.objectStore('TRANSACTIONS');
        const index = store.index('userId');
        const request = index.getAll(user.id);
        
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });

      const historyContainer = document.getElementById('transaction-history');
      if (!historyContainer) return;

      if (transactions.length === 0) {
        historyContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No transactions yet</p>';
        return;
      }

      // Sort by date (newest first)
      transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

      historyContainer.innerHTML = transactions.map(t => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #eee;">
          <div>
            <div style="font-weight: 500; color: #333;">${t.description}</div>
            <div style="font-size: 12px; color: #999;">${new Date(t.date).toLocaleString()}</div>
          </div>
          <div style="font-weight: bold; color: ${t.amount >= 0 ? '#27ae60' : '#e74c3c'};">
            ${t.amount >= 0 ? '+' : ''}£${Math.abs(t.amount).toFixed(2)}
          </div>
        </div>
      `).join('');
      
    } catch (error) {
      console.error('Error loading transaction history:', error);
    }
  }

  async function loadActiveSubscriptions() {
    try {
      const user = window.CarnageAuth.currentUser;
      if (!user) return;

      const subscriptions = await window.CarnageAuth.getUserSubscriptions(user.id);
      const activeSubscriptions = subscriptions.filter(s => s.status === 'active');

      const subsContainer = document.getElementById('active-subscriptions');
      if (!subsContainer) return;

      if (activeSubscriptions.length === 0) {
        subsContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No active subscriptions</p>';
        return;
      }

      subsContainer.innerHTML = activeSubscriptions.map(s => {
        const nextBilling = new Date(s.nextBilling);
        const daysUntil = Math.ceil((nextBilling - new Date()) / (1000 * 60 * 60 * 24));
        
        let subscriptionLabel = s.type;
        if (s.type === 'vehicle-stats-widget') subscriptionLabel = '📊 Vehicle Stats Widget';
        if (s.type === 'embed' || s.type === 'embed-widget' || s.type === 'embed_widget') subscriptionLabel = '🔗 Embed Widget';
        if (s.type === 'vrm' || s.type === 'vrm-lookup' || s.type === 'vrm_lookup') subscriptionLabel = '🚗 VRM Lookup';
        
        return `
          <div style="padding: 15px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 10px; background: white;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <div>
                <div style="font-weight: 600; color: #333; margin-bottom: 5px;">
                  ${subscriptionLabel}
                </div>
                <div style="font-size: 14px; color: #666;">
                  £${s.price.toFixed(2)}/month
                </div>
                <div style="font-size: 12px; color: #999; margin-top: 5px;">
                  Next billing in ${daysUntil} days
                </div>
              </div>
              <button class="cr-btn" style="background: #e74c3c; color: white; padding: 6px 12px; font-size: 12px;" onclick="cancelSubscription('${s.id}')">
                Cancel
              </button>
            </div>
          </div>
        `;
      }).join('');
      
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    }
  }

  async function cancelSubscription(subscriptionId) {
    if (!confirm('Are you sure you want to cancel this subscription? It will remain active until the end of the current billing period.')) {
      return;
    }

    try {
      const user = window.CarnageAuth.currentUser;
      if (!user) return;

      const db = await openDB();
      const userRecord = await new Promise((resolve, reject) => {
        const transaction = db.transaction(['USERS_STORE'], 'readwrite');
        const store = transaction.objectStore('USERS_STORE');
        const request = store.get(user.id);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      if (userRecord && userRecord.subscriptions) {
        const subIndex = userRecord.subscriptions.findIndex(s => s.id === subscriptionId);
        if (subIndex !== -1) {
          userRecord.subscriptions[subIndex].status = 'cancelled';
          
          await new Promise((resolve, reject) => {
            const transaction = db.transaction(['USERS_STORE'], 'readwrite');
            const store = transaction.objectStore('USERS_STORE');
            const request = store.put(userRecord);
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
          });

          showNotification('Subscription cancelled successfully', 'success');
          loadActiveSubscriptions();
        }
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      showNotification('Failed to cancel subscription', 'error');
    }
  }

  async function addTransaction(userId, transaction) {
    try {
      const db = await openDB();
      const record = {
        ...transaction,
        userId: userId,
        id: Date.now().toString()
      };

      await new Promise((resolve, reject) => {
        const txn = db.transaction(['TRANSACTIONS'], 'readwrite');
        const store = txn.objectStore('TRANSACTIONS');
        const request = store.add(record);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  }

  // Admin credit management functions
  // Admin credit management functions - exposed to global scope
  window.adminAddCredit = async function() {
    try {
      const userEmail = document.getElementById('admin-credit-email').value;
      const amount = parseFloat(document.getElementById('admin-credit-amount').value);

      if (!userEmail || !amount || amount <= 0) {
        alert('Please enter valid email and amount');
        return;
      }

      // Get all users
      const users = await CarnageAuth.getAllUsers();
      const user = users.find(u => u.email === userEmail);
      
      if (!user) {
        alert('User not found with email: ' + userEmail);
        return;
      }

      // Confirm action
      const currentBalance = await CarnageAuth.getUserCredit(user.id);
      const confirmed = confirm(`Add £${amount.toFixed(2)} to ${userEmail}?\n\nCurrent Balance: £${currentBalance.toFixed(2)}\nNew Balance: £${(currentBalance + amount).toFixed(2)}`);
      if (!confirmed) return;

      // Add credit to user
      await CarnageAuth.updateUserCredit(amount, user.id);
      
      // Clear credit cache to force refresh
      clearCreditCache();
      
      // Add transaction record
      await CarnageAuth.addTransaction({
        type: 'credit',
        amount: amount,
        description: 'Credit added by admin'
      }, user.id);

      const newBalance = await CarnageAuth.getUserCredit(user.id);
      alert(`✅ Successfully added £${amount.toFixed(2)} to ${userEmail}\n\nNew Balance: £${newBalance.toFixed(2)}`);
      
      document.getElementById('admin-credit-email').value = '';
      document.getElementById('admin-credit-amount').value = '';
      
      // Update credit display in header
      await updateCreditDisplay();
      
      // Refresh the admin users list
      await loadAdminUsers();
      
    } catch (error) {
      console.error('Error adding credit:', error);
      alert('Failed to add credit: ' + error.message);
    }
  };

  window.adminRemoveCredit = async function() {
    try {
      const userEmail = document.getElementById('admin-credit-email').value;
      const amount = parseFloat(document.getElementById('admin-credit-amount').value);

      if (!userEmail || !amount || amount <= 0) {
        alert('Please enter valid email and amount');
        return;
      }

      // Get all users
      const users = await CarnageAuth.getAllUsers();
      const user = users.find(u => u.email === userEmail);
      
      if (!user) {
        alert('User not found with email: ' + userEmail);
        return;
      }

      // Confirm action
      const currentBalance = await CarnageAuth.getUserCredit(user.id);
      const confirmed = confirm(`⚠️ Remove £${amount.toFixed(2)} from ${userEmail}?\n\nCurrent Balance: £${currentBalance.toFixed(2)}\nNew Balance: £${(currentBalance - amount).toFixed(2)}`);
      if (!confirmed) return;

      // Remove credit from user
      await CarnageAuth.updateUserCredit(-amount, user.id);
      
      // Clear credit cache to force refresh
      clearCreditCache();
      
      // Add transaction record
      await CarnageAuth.addTransaction({
        type: 'debit',
        amount: -amount,
        description: 'Credit removed by admin'
      }, user.id);

      const newBalance = await CarnageAuth.getUserCredit(user.id);
      alert(`✅ Successfully removed £${amount.toFixed(2)} from ${userEmail}\n\nNew Balance: £${newBalance.toFixed(2)}`);
      
      document.getElementById('admin-credit-email').value = '';
      document.getElementById('admin-credit-amount').value = '';
      
      // Update credit display in header
      await updateCreditDisplay();
      
      // Refresh the admin users list
      await loadAdminUsers();
      
    } catch (error) {
      console.error('Error removing credit:', error);
      alert('Failed to remove credit: ' + error.message);
    }
  };

  // Quick add credit from user list - exposed to global scope
  window.quickAddCredit = async function(userEmail) {
    const amount = prompt(`Add credit to ${userEmail}\n\nEnter amount (£):`);
    if (!amount) return;
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Invalid amount');
      return;
    }

    try {
      // Get all users
      const users = await CarnageAuth.getAllUsers();
      const user = users.find(u => u.email === userEmail);
      
      if (!user) {
        alert('User not found');
        return;
      }

      // Add credit to user
      await CarnageAuth.updateUserCredit(parsedAmount, user.id);
      
      // Clear credit cache to force refresh
      clearCreditCache();
      
      // Add transaction record
      await CarnageAuth.addTransaction({
        type: 'credit',
        amount: parsedAmount,
        description: 'Quick credit added by admin'
      }, user.id);

      const newBalance = await CarnageAuth.getUserCredit(user.id);
      alert(`✅ Successfully added £${parsedAmount.toFixed(2)} to ${userEmail}\n\nNew Balance: £${newBalance.toFixed(2)}`);
      
      // Update credit display in header
      await updateCreditDisplay();
      
      // Only refresh if we're on the credit tab
      const creditPanel = document.getElementById('admin-credit');
      if (creditPanel && creditPanel.classList.contains('active')) {
        // Use setTimeout to prevent blocking and allow UI to update
        setTimeout(() => loadAdminUsers(), 100);
      }
      
    } catch (error) {
      console.error('Error adding credit:', error);
      alert('Failed to add credit: ' + error.message);
    }
  }

  async function loadTopUpRequests() {
    try {
      const db = await openDB();
      const requests = await new Promise((resolve, reject) => {
        const transaction = db.transaction(['TOPUP_REQUESTS'], 'readonly');
        const store = transaction.objectStore('TOPUP_REQUESTS');
        const request = store.getAll();
        
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });

      const pendingRequests = requests.filter(r => r.status === 'pending');
      const requestsContainer = document.getElementById('topup-requests-list');
      if (!requestsContainer) return;

      if (pendingRequests.length === 0) {
        requestsContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No pending top-up requests</p>';
        return;
      }

      requestsContainer.innerHTML = pendingRequests.map(r => `
        <div style="padding: 15px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 10px; background: white;">
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <div>
              <div style="font-weight: 600; color: #333;">${r.userEmail}</div>
              <div style="font-size: 14px; color: #666; margin: 5px 0;">Amount: £${r.amount.toFixed(2)}</div>
              <div style="font-size: 12px; color: #999;">${new Date(r.requestDate).toLocaleString()}</div>
            </div>
            <div style="display: flex; gap: 10px;">
              <button class="cr-btn cr-btn-primary" style="padding: 6px 12px; font-size: 12px;" onclick="approveTopUp('${r.id}', '${r.userId}', ${r.amount})">
                ✓ Approve
              </button>
              <button class="cr-btn" style="background: #e74c3c; color: white; padding: 6px 12px; font-size: 12px;" onclick="rejectTopUp('${r.id}')">
                ✗ Reject
              </button>
            </div>
          </div>
        </div>
      `).join('');
      
    } catch (error) {
      console.error('Error loading top-up requests:', error);
    }
  }

  async function approveTopUp(requestId, userId, amount) {
    try {
      // Add credit to user
      await window.CarnageAuth.updateUserCredit(amount, userId);
      
      // Add transaction
      await addTransaction(userId, {
        type: 'top-up',
        amount: amount,
        description: 'Account top-up (approved by admin)',
        date: new Date().toISOString()
      });

      // Update request status
      const db = await openDB();
      const request = await new Promise((resolve, reject) => {
        const transaction = db.transaction(['TOPUP_REQUESTS'], 'readwrite');
        const store = transaction.objectStore('TOPUP_REQUESTS');
        const getRequest = store.get(requestId);
        
        getRequest.onsuccess = () => resolve(getRequest.result);
        getRequest.onerror = () => reject(getRequest.error);
      });

      if (request) {
        request.status = 'approved';
        request.approvedDate = new Date().toISOString();
        
        await new Promise((resolve, reject) => {
          const transaction = db.transaction(['TOPUP_REQUESTS'], 'readwrite');
          const store = transaction.objectStore('TOPUP_REQUESTS');
          const putRequest = store.put(request);
          
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        });
      }

      showNotification(`Top-up approved! £${amount.toFixed(2)} added to account.`, 'success');
      loadTopUpRequests();
      
    } catch (error) {
      console.error('Error approving top-up:', error);
      showNotification('Failed to approve top-up', 'error');
    }
  }

  async function rejectTopUp(requestId) {
    try {
      const db = await openDB();
      const request = await new Promise((resolve, reject) => {
        const transaction = db.transaction(['TOPUP_REQUESTS'], 'readwrite');
        const store = transaction.objectStore('TOPUP_REQUESTS');
        const getRequest = store.get(requestId);
        
        getRequest.onsuccess = () => resolve(getRequest.result);
        getRequest.onerror = () => reject(getRequest.error);
      });

      if (request) {
        request.status = 'rejected';
        request.rejectedDate = new Date().toISOString();
        
        await new Promise((resolve, reject) => {
          const transaction = db.transaction(['TOPUP_REQUESTS'], 'readwrite');
          const store = transaction.objectStore('TOPUP_REQUESTS');
          const putRequest = store.put(request);
          
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        });
      }

      showNotification('Top-up request rejected', 'success');
      loadTopUpRequests();
      
    } catch (error) {
      console.error('Error rejecting top-up:', error);
      showNotification('Failed to reject top-up', 'error');
    }
  }

  // Make billing functions globally accessible
  window.loadCreditBalance = loadCreditBalance;
  window.subscribeToWidget = subscribeToWidget;
  window.requestTopUp = requestTopUp;
  window.showTopUpModal = showTopUpModal;
  window.closeTopUpModal = closeTopUpModal;
  window.cancelSubscription = cancelSubscription;
  window.adminAddCredit = adminAddCredit;
  window.adminRemoveCredit = adminRemoveCredit;
  window.quickAddCredit = quickAddCredit;
  window.approveTopUp = approveTopUp;
  window.rejectTopUp = rejectTopUp;

  // Initialize app
  document.addEventListener('DOMContentLoaded', async () => {
    console.log('Carnage Remaps Portal - Initializing...');
    
    try {
      // Wait for Supabase modules to load (increased timeout for module loading)
      let attempts = 0;
      while (!window.CarnageAuth && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
        if (attempts % 10 === 0) {
          console.log('Waiting for Supabase modules...', attempts * 100, 'ms');
        }
      }
      
      if (!window.CarnageAuth) {
        console.error('CarnageAuth not found after 5 seconds');
        console.log('Available globals:', {
          SupabaseAuth: !!window.SupabaseAuth,
          CarnageAuth: !!window.CarnageAuth,
          supabase: !!window.supabase,
          supabaseClient: !!window.supabaseClient
        });
        throw new Error('Supabase modules failed to load');
      }
      
      console.log('Supabase modules loaded');
      
      // Initialize Supabase modules
      await CarnageAuth.init();
      await CarnageSupport.init();
      
      console.log('Databases initialized');
      
      // Check storage bucket configuration
      if (window.SupabaseFiles && window.SupabaseFiles.ensureStorageBucket) {
        const storageOk = await SupabaseFiles.ensureStorageBucket();
        if (!storageOk) {
          console.warn('⚠️ Storage bucket configuration issues detected. File uploads/downloads may not work properly.');
        }
      }
      
      // Check authentication
      const isAuth = await CarnageAuth.isAuthenticated();
      
      if (isAuth) {
        showPortal();
      } else {
        showLogin();
      }
      
    } catch (error) {
      console.error('Initialization error:', error);
      alert('Error initializing portal. Please refresh the page.');
    }
  });

  // Show login screen
  function showLogin() {
    document.body.classList.add('not-authenticated');
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('main-portal').style.display = 'none';
    
    initLoginForms();
  }

  // Show main portal
  async function showPortal() {
    document.body.classList.remove('not-authenticated');
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-portal').style.display = 'block';
    
    // Set user name
    const userName = sessionStorage.getItem('userName');
    document.getElementById('user-name-display').textContent = userName || 'User';
    document.getElementById('dashboard-user-name').textContent = userName || 'User';
    
    // Clear credit cache to force fresh fetch on portal load
    clearCreditCache();
    
    // Update credit display
    await updateCreditDisplay();
    
    // Show/hide admin link and support link based on user role
    const isAdminUser = await CarnageAuth.isAdmin();
    const adminLink = document.getElementById('admin-nav-link');
    const supportLink = document.querySelector('[data-tab="support"]');
    
    if (adminLink) {
      adminLink.style.display = isAdminUser ? 'block' : 'none';
    }
    
    // Hide support tab for admins (they use admin panel)
    if (supportLink) {
      supportLink.style.display = isAdminUser ? 'none' : 'block';
    }
    
    // Initialize portal features
    initTabs();
    initUpload();
    initVehicleSearch();
    initSettings();
    initSupport();
    initLogout();
    initAdminUpload();
    initBilling();
    initStatusControl();
    initFileMessaging();
    
    if (isAdminUser) {
      initAdmin();
    }
    
    // Update dashboard
    updateDashboardStats();
    
    // Initialize online/offline status
    updateOnlineStatus();
    // Update status every minute
    setInterval(updateOnlineStatus, 60000);
    
    // Check for Stripe payment callback
    if (STRIPE_ENABLED) {
      checkStripeCallback();
    }
    
    // Check for URL parameters (from embed widget)
    checkEmbedParameters();
  }

  // Check and handle embed widget URL parameters
  function checkEmbedParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('autosearch') === 'true') {
      const manufacturer = urlParams.get('manufacturer');
      const model = urlParams.get('model');
      const year = urlParams.get('year');
      const engine = urlParams.get('engine');
      
      if (manufacturer && model && year && engine) {
        // Switch to vehicle search tab
        document.querySelectorAll('.tab-link').forEach(t => t.classList.remove('active'));
        document.querySelector('[data-tab="vehicle-search"]')?.classList.add('active');
        
        document.querySelectorAll('.cr-tab').forEach(t => t.classList.remove('active'));
        document.getElementById('vehicle-search-tab')?.classList.add('active');
        
        // Pre-fill the search form
        setTimeout(() => {
          const mfrSelect = document.getElementById('manufacturer-select');
          const mdlSelect = document.getElementById('model-select');
          const yrSelect = document.getElementById('year-select');
          const engSelect = document.getElementById('engine-select');
          
          if (mfrSelect) {
            mfrSelect.value = manufacturer;
            mfrSelect.dispatchEvent(new Event('change'));
            
            // Wait for models to load, then select
            setTimeout(() => {
              if (mdlSelect) {
                mdlSelect.value = model;
                mdlSelect.dispatchEvent(new Event('change'));
                
                // Wait for years to load, then select
                setTimeout(() => {
                  if (yrSelect) {
                    yrSelect.value = year;
                    yrSelect.dispatchEvent(new Event('change'));
                    
                    // Wait for engines to load, then select and search
                    setTimeout(() => {
                      if (engSelect) {
                        engSelect.value = engine;
                        engSelect.dispatchEvent(new Event('change'));
                        
                        // Trigger search
                        setTimeout(() => {
                          const searchBtn = document.getElementById('search-btn');
                          if (searchBtn && !searchBtn.disabled) {
                            searchBtn.click();
                          }
                        }, 300);
                      }
                    }, 300);
                  }
                }, 300);
              }
            }, 300);
          }
        }, 500);
        
        // Clear URL parameters after processing
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }

  // Initialize login forms
  function initLoginForms() {
    // Tab switching
    document.querySelectorAll('.login-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const formType = tab.dataset.form;
        
        // Update tabs
        document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update forms
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        const targetForm = document.getElementById(`${formType}-form`);
        if (targetForm) {
          targetForm.classList.add('active');
        }
      });
    });
    
    // Sign in form
    document.getElementById('signin-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('signin-email').value;
      const password = document.getElementById('signin-password').value;
      const errorEl = document.getElementById('signin-error');
      
      try {
        await CarnageAuth.signIn(email, password);
        errorEl.classList.remove('show');
        showPortal();
      } catch (error) {
        errorEl.textContent = error.message;
        errorEl.classList.add('show');
      }
    });
    
    // Register form
    document.getElementById('register-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const confirm = document.getElementById('register-password-confirm').value;
      const errorEl = document.getElementById('register-error');
      
      if (password !== confirm) {
        errorEl.textContent = 'Passwords do not match';
        errorEl.classList.add('show');
        return;
      }
      
      if (password.length < 8) {
        errorEl.textContent = 'Password must be at least 8 characters';
        errorEl.classList.add('show');
        return;
      }
      
      try {
        console.log('Attempting registration:', { name, email });
        const result = await CarnageAuth.register(email, password, name);
        console.log('Registration result:', result);
        
        // Notify admin of new user registration
        fetch(`${API_URL}/api/notify-new-user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_name: name,
            user_email: email,
            registration_time: new Date().toISOString()
          })
        }).catch(err => console.warn('New user notification failed:', err));
        
        console.log('Attempting auto-login...');
        await CarnageAuth.signIn(email, password);
        console.log('Auto-login successful');
        
        errorEl.classList.remove('show');
        showPortal();
      } catch (error) {
        console.error('Registration error:', error);
        errorEl.textContent = error.message || 'Registration failed. Please try again.';
        errorEl.classList.add('show');
      }
    });
    
    // Public Vehicle Search functionality
    initPublicVehicleSearch();
    
    // Go to Sign In button
    const gotoSigninBtn = document.getElementById('goto-signin-btn');
    if (gotoSigninBtn) {
      gotoSigninBtn.addEventListener('click', () => {
        // Switch to Sign In tab
        document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
        document.querySelector('[data-form="signin"]').classList.add('active');
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        document.getElementById('signin-form').classList.add('active');
      });
    }
  }
  
  // Public Vehicle Search Functions
  function initPublicVehicleSearch() {
    const manufacturerSelect = document.getElementById('public-manufacturer');
    const modelSelect = document.getElementById('public-model');
    const yearSelect = document.getElementById('public-year');
    const engineSelect = document.getElementById('public-engine');
    const searchBtn = document.getElementById('public-search-btn');

    populateManufacturerSelect(manufacturerSelect);
    hydrateVehicleDataFromAPI().then(() => {
      populateManufacturerSelect(manufacturerSelect);
    });
    
    // Vehicle data (comprehensive database - same as authenticated version)
    const vehicleData = {
      'audi': {
        'A3': {
          '2005-2012': {
            '1.6 TDI - 105hp': { power: 105, torque: 250, type: 'diesel' },
            '1.9 TDI - 105hp': { power: 105, torque: 250, type: 'diesel' },
            '2.0 TDI - 140hp': { power: 140, torque: 320, type: 'diesel' },
            '1.4 TFSI - 125hp': { power: 125, torque: 200, type: 'petrol' },
            '1.8 TFSI - 160hp': { power: 160, torque: 250, type: 'petrol' },
            '2.0 TFSI - 200hp': { power: 200, torque: 280, type: 'petrol' }
          },
          '2013-2020': {
            '1.6 TDI - 110hp': { power: 110, torque: 250, type: 'diesel' },
            '2.0 TDI - 150hp': { power: 150, torque: 340, type: 'diesel' },
            '1.0 TFSI - 115hp': { power: 115, torque: 200, type: 'petrol' },
            '1.4 TFSI - 150hp': { power: 150, torque: 250, type: 'petrol' },
            '2.0 TFSI - 190hp': { power: 190, torque: 320, type: 'petrol' }
          },
          '2021-2024': {
            '2.0 TDI - 150hp': { power: 150, torque: 360, type: 'diesel' },
            '1.0 TFSI - 110hp': { power: 110, torque: 200, type: 'petrol' },
            '1.5 TFSI - 150hp': { power: 150, torque: 250, type: 'petrol' },
            '2.0 TFSI - 245hp': { power: 245, torque: 370, type: 'petrol' }
          }
        },
        'A4': {
          '2005-2015': {
            '2.0 TDI - 143hp': { power: 143, torque: 340, type: 'diesel' },
            '2.7 TDI - 190hp': { power: 190, torque: 400, type: 'diesel' },
            '3.0 TDI - 240hp': { power: 240, torque: 500, type: 'diesel' },
            '1.8 TFSI - 160hp': { power: 160, torque: 250, type: 'petrol' },
            '2.0 TFSI - 211hp': { power: 211, torque: 350, type: 'petrol' }
          },
          '2016-2023': {
            '2.0 TDI - 150hp': { power: 150, torque: 320, type: 'diesel' },
            '2.0 TDI - 190hp': { power: 190, torque: 400, type: 'diesel' },
            '3.0 TDI - 272hp': { power: 272, torque: 600, type: 'diesel' },
            '1.4 TFSI - 150hp': { power: 150, torque: 250, type: 'petrol' },
            '2.0 TFSI - 252hp': { power: 252, torque: 370, type: 'petrol' }
          }
        },
        'A6': {
          '2005-2018': {
            '2.0 TDI - 177hp': { power: 177, torque: 380, type: 'diesel' },
            '3.0 TDI - 272hp': { power: 272, torque: 600, type: 'diesel' },
            '2.0 TFSI - 252hp': { power: 252, torque: 370, type: 'petrol' },
            '3.0 TFSI - 333hp': { power: 333, torque: 440, type: 'petrol' }
          }
        },
        'Q3': {
          '2011-2023': {
            '2.0 TDI - 150hp': { power: 150, torque: 340, type: 'diesel' },
            '1.4 TFSI - 150hp': { power: 150, torque: 250, type: 'petrol' },
            '2.0 TFSI - 230hp': { power: 230, torque: 350, type: 'petrol' }
          }
        },
        'Q5': {
          '2008-2024': {
            '2.0 TDI - 143hp': { power: 143, torque: 340, type: 'diesel' },
            '2.0 TDI - 190hp': { power: 190, torque: 400, type: 'diesel' },
            '3.0 TDI - 272hp': { power: 272, torque: 600, type: 'diesel' },
            '2.0 TFSI - 252hp': { power: 252, torque: 370, type: 'petrol' }
          }
        }
      },
      'bmw': {
        '1 Series': {
          '2004-2013': {
            '118d - 143hp': { power: 143, torque: 320, type: 'diesel' },
            '120d - 177hp': { power: 177, torque: 350, type: 'diesel' },
            '118i - 143hp': { power: 143, torque: 220, type: 'petrol' },
            '120i - 170hp': { power: 170, torque: 210, type: 'petrol' }
          },
          '2011-2019': {
            '116d - 116hp': { power: 116, torque: 260, type: 'diesel' },
            '118d - 150hp': { power: 150, torque: 320, type: 'diesel' },
            '120d - 190hp': { power: 190, torque: 400, type: 'diesel' },
            '118i - 136hp': { power: 136, torque: 220, type: 'petrol' },
            '125i - 224hp': { power: 224, torque: 310, type: 'petrol' }
          }
        },
        '3 Series': {
          '2005-2011': {
            '316d - 116hp': { power: 116, torque: 260, type: 'diesel' },
            '318d - 143hp': { power: 143, torque: 320, type: 'diesel' },
            '320d - 163hp': { power: 163, torque: 340, type: 'diesel' },
            '330d - 245hp': { power: 245, torque: 520, type: 'diesel' },
            '316i - 122hp': { power: 122, torque: 180, type: 'petrol' },
            '318i - 143hp': { power: 143, torque: 220, type: 'petrol' },
            '320i - 170hp': { power: 170, torque: 210, type: 'petrol' },
            '325i - 218hp': { power: 218, torque: 250, type: 'petrol' },
            '330i - 272hp': { power: 272, torque: 320, type: 'petrol' }
          },
          '2012-2019': {
            '316d - 116hp': { power: 116, torque: 260, type: 'diesel' },
            '318d - 150hp': { power: 150, torque: 320, type: 'diesel' },
            '320d - 184hp': { power: 184, torque: 380, type: 'diesel' },
            '330d - 258hp': { power: 258, torque: 560, type: 'diesel' },
            '316i - 136hp': { power: 136, torque: 220, type: 'petrol' },
            '320i - 184hp': { power: 184, torque: 270, type: 'petrol' },
            '328i - 245hp': { power: 245, torque: 350, type: 'petrol' },
            '335i - 306hp': { power: 306, torque: 400, type: 'petrol' }
          },
          '2019-2024': {
            '318d - 150hp': { power: 150, torque: 350, type: 'diesel' },
            '320d - 190hp': { power: 190, torque: 400, type: 'diesel' },
            '330d - 265hp': { power: 265, torque: 580, type: 'diesel' },
            '320i - 184hp': { power: 184, torque: 300, type: 'petrol' },
            '330i - 258hp': { power: 258, torque: 400, type: 'petrol' }
          }
        },
        '5 Series': {
          '2003-2017': {
            '520d - 190hp': { power: 190, torque: 400, type: 'diesel' },
            '525d - 218hp': { power: 218, torque: 500, type: 'diesel' },
            '530d - 258hp': { power: 258, torque: 560, type: 'diesel' },
            '520i - 184hp': { power: 184, torque: 270, type: 'petrol' },
            '528i - 245hp': { power: 245, torque: 350, type: 'petrol' },
            '535i - 306hp': { power: 306, torque: 400, type: 'petrol' }
          }
        },
        'X3': {
          '2003-2024': {
            'X3 20d - 190hp': { power: 190, torque: 400, type: 'diesel' },
            'X3 30d - 265hp': { power: 265, torque: 580, type: 'diesel' },
            'X3 20i - 184hp': { power: 184, torque: 290, type: 'petrol' },
            'X3 30i - 252hp': { power: 252, torque: 350, type: 'petrol' }
          }
        },
        'X5': {
          '2007-2024': {
            'X5 30d - 258hp': { power: 258, torque: 560, type: 'diesel' },
            'X5 40d - 313hp': { power: 313, torque: 630, type: 'diesel' },
            'X5 35i - 306hp': { power: 306, torque: 400, type: 'petrol' },
            'X5 50i - 407hp': { power: 407, torque: 600, type: 'petrol' }
          }
        }
      },
      'mercedes': {
        'A-Class': {
          '2005-2018': {
            'A160 CDI - 82hp': { power: 82, torque: 180, type: 'diesel' },
            'A180 CDI - 109hp': { power: 109, torque: 250, type: 'diesel' },
            'A200 CDI - 136hp': { power: 136, torque: 300, type: 'diesel' },
            'A160 - 102hp': { power: 102, torque: 150, type: 'petrol' },
            'A180 - 122hp': { power: 122, torque: 200, type: 'petrol' },
            'A200 - 156hp': { power: 156, torque: 250, type: 'petrol' }
          },
          '2018-2024': {
            'A180d - 116hp': { power: 116, torque: 260, type: 'diesel' },
            'A200d - 150hp': { power: 150, torque: 320, type: 'diesel' },
            'A180 - 136hp': { power: 136, torque: 200, type: 'petrol' },
            'A200 - 163hp': { power: 163, torque: 250, type: 'petrol' },
            'A250 - 224hp': { power: 224, torque: 350, type: 'petrol' }
          }
        },
        'C-Class': {
          '2007-2014': {
            'C180 CDI - 120hp': { power: 120, torque: 270, type: 'diesel' },
            'C200 CDI - 136hp': { power: 136, torque: 300, type: 'diesel' },
            'C220 CDI - 170hp': { power: 170, torque: 400, type: 'diesel' },
            'C250 CDI - 204hp': { power: 204, torque: 500, type: 'diesel' },
            'C180 - 156hp': { power: 156, torque: 250, type: 'petrol' },
            'C200 - 184hp': { power: 184, torque: 270, type: 'petrol' },
            'C250 - 204hp': { power: 204, torque: 310, type: 'petrol' }
          },
          '2014-2021': {
            'C180d - 116hp': { power: 116, torque: 260, type: 'diesel' },
            'C200d - 136hp': { power: 136, torque: 300, type: 'diesel' },
            'C220d - 170hp': { power: 170, torque: 400, type: 'diesel' },
            'C250d - 204hp': { power: 204, torque: 500, type: 'diesel' },
            'C180 - 156hp': { power: 156, torque: 250, type: 'petrol' },
            'C200 - 184hp': { power: 184, torque: 300, type: 'petrol' },
            'C250 - 211hp': { power: 211, torque: 350, type: 'petrol' }
          },
          '2021-2024': {
            'C200d - 163hp': { power: 163, torque: 360, type: 'diesel' },
            'C220d - 194hp': { power: 194, torque: 400, type: 'diesel' },
            'C300d - 265hp': { power: 265, torque: 550, type: 'diesel' },
            'C200 - 204hp': { power: 204, torque: 300, type: 'petrol' },
            'C300 - 258hp': { power: 258, torque: 370, type: 'petrol' }
          }
        },
        'E-Class': {
          '2009-2023': {
            'E200d - 150hp': { power: 150, torque: 360, type: 'diesel' },
            'E220d - 194hp': { power: 194, torque: 400, type: 'diesel' },
            'E300d - 245hp': { power: 245, torque: 500, type: 'diesel' },
            'E350d - 258hp': { power: 258, torque: 620, type: 'diesel' },
            'E200 - 184hp': { power: 184, torque: 300, type: 'petrol' },
            'E250 - 211hp': { power: 211, torque: 350, type: 'petrol' },
            'E300 - 245hp': { power: 245, torque: 370, type: 'petrol' }
          }
        },
        'GLA': {
          '2014-2024': {
            'GLA200d - 136hp': { power: 136, torque: 300, type: 'diesel' },
            'GLA220d - 177hp': { power: 177, torque: 350, type: 'diesel' },
            'GLA200 - 163hp': { power: 163, torque: 250, type: 'petrol' },
            'GLA250 - 224hp': { power: 224, torque: 350, type: 'petrol' }
          }
        },
        'GLC': {
          '2015-2024': {
            'GLC200d - 163hp': { power: 163, torque: 360, type: 'diesel' },
            'GLC220d - 194hp': { power: 194, torque: 400, type: 'diesel' },
            'GLC300d - 245hp': { power: 245, torque: 500, type: 'diesel' },
            'GLC200 - 197hp': { power: 197, torque: 320, type: 'petrol' },
            'GLC300 - 258hp': { power: 258, torque: 370, type: 'petrol' }
          }
        }
      },
      'volkswagen': {
        'Golf': {
          '2005-2012': {
            '1.4 TDI - 80hp': { power: 80, torque: 195, type: 'diesel' },
            '1.6 TDI - 105hp': { power: 105, torque: 250, type: 'diesel' },
            '1.9 TDI - 105hp': { power: 105, torque: 250, type: 'diesel' },
            '2.0 TDI - 140hp': { power: 140, torque: 320, type: 'diesel' },
            '1.4 TSI - 122hp': { power: 122, torque: 200, type: 'petrol' },
            '1.4 TSI - 160hp': { power: 160, torque: 240, type: 'petrol' },
            '2.0 GTI - 210hp': { power: 210, torque: 280, type: 'petrol' }
          },
          '2013-2020': {
            '1.6 TDI - 110hp': { power: 110, torque: 250, type: 'diesel' },
            '2.0 TDI - 150hp': { power: 150, torque: 340, type: 'diesel' },
            '1.0 TSI - 110hp': { power: 110, torque: 200, type: 'petrol' },
            '1.4 TSI - 125hp': { power: 125, torque: 200, type: 'petrol' },
            '1.4 TSI - 150hp': { power: 150, torque: 250, type: 'petrol' },
            '2.0 GTI - 230hp': { power: 230, torque: 350, type: 'petrol' }
          },
          '2020-2024': {
            '2.0 TDI - 115hp': { power: 115, torque: 300, type: 'diesel' },
            '2.0 TDI - 150hp': { power: 150, torque: 360, type: 'diesel' },
            '1.0 TSI - 110hp': { power: 110, torque: 200, type: 'petrol' },
            '1.5 TSI - 130hp': { power: 130, torque: 200, type: 'petrol' },
            '1.5 TSI - 150hp': { power: 150, torque: 250, type: 'petrol' },
            '2.0 GTI - 245hp': { power: 245, torque: 370, type: 'petrol' }
          }
        },
        'Passat': {
          '2005-2014': {
            '1.6 TDI - 105hp': { power: 105, torque: 250, type: 'diesel' },
            '1.9 TDI - 105hp': { power: 105, torque: 250, type: 'diesel' },
            '2.0 TDI - 140hp': { power: 140, torque: 320, type: 'diesel' },
            '2.0 TDI - 170hp': { power: 170, torque: 350, type: 'diesel' },
            '1.4 TSI - 122hp': { power: 122, torque: 200, type: 'petrol' },
            '1.8 TSI - 160hp': { power: 160, torque: 250, type: 'petrol' },
            '2.0 TSI - 200hp': { power: 200, torque: 280, type: 'petrol' }
          },
          '2014-2024': {
            '1.6 TDI - 120hp': { power: 120, torque: 300, type: 'diesel' },
            '2.0 TDI - 150hp': { power: 150, torque: 340, type: 'diesel' },
            '2.0 TDI - 190hp': { power: 190, torque: 400, type: 'diesel' },
            '1.4 TSI - 125hp': { power: 125, torque: 200, type: 'petrol' },
            '1.4 TSI - 150hp': { power: 150, torque: 250, type: 'petrol' },
            '2.0 TSI - 220hp': { power: 220, torque: 350, type: 'petrol' }
          }
        },
        'Polo': {
          '2005-2017': {
            '1.2 TDI - 75hp': { power: 75, torque: 180, type: 'diesel' },
            '1.4 TDI - 90hp': { power: 90, torque: 230, type: 'diesel' },
            '1.6 TDI - 105hp': { power: 105, torque: 250, type: 'diesel' },
            '1.2 TSI - 90hp': { power: 90, torque: 160, type: 'petrol' },
            '1.4 TSI - 150hp': { power: 150, torque: 250, type: 'petrol' }
          },
          '2017-2024': {
            '1.6 TDI - 95hp': { power: 95, torque: 250, type: 'diesel' },
            '1.0 TSI - 95hp': { power: 95, torque: 175, type: 'petrol' },
            '1.0 TSI - 110hp': { power: 110, torque: 200, type: 'petrol' },
            '1.5 TSI - 150hp': { power: 150, torque: 250, type: 'petrol' }
          }
        },
        'Tiguan': {
          '2007-2024': {
            '2.0 TDI - 140hp': { power: 140, torque: 320, type: 'diesel' },
            '2.0 TDI - 150hp': { power: 150, torque: 340, type: 'diesel' },
            '2.0 TDI - 190hp': { power: 190, torque: 400, type: 'diesel' },
            '1.4 TSI - 150hp': { power: 150, torque: 250, type: 'petrol' },
            '2.0 TSI - 180hp': { power: 180, torque: 280, type: 'petrol' },
            '2.0 TSI - 220hp': { power: 220, torque: 350, type: 'petrol' }
          }
        }
      },
      'ford': {
        'Focus': {
          '2005-2018': {
            '1.6 TDCi - 115hp': { power: 115, torque: 270, type: 'diesel' },
            '2.0 TDCi - 150hp': { power: 150, torque: 340, type: 'diesel' },
            '1.0 EcoBoost - 125hp': { power: 125, torque: 170, type: 'petrol' },
            '1.5 EcoBoost - 150hp': { power: 150, torque: 240, type: 'petrol' },
            '2.0 EcoBoost - 250hp': { power: 250, torque: 345, type: 'petrol' }
          },
          '2018-2024': {
            '1.5 EcoBlue - 120hp': { power: 120, torque: 300, type: 'diesel' },
            '2.0 EcoBlue - 150hp': { power: 150, torque: 370, type: 'diesel' },
            '1.0 EcoBoost - 125hp': { power: 125, torque: 170, type: 'petrol' },
            '1.5 EcoBoost - 150hp': { power: 150, torque: 240, type: 'petrol' },
            '2.3 EcoBoost - 280hp': { power: 280, torque: 420, type: 'petrol' }
          }
        },
        'Fiesta': {
          '2008-2023': {
            '1.5 TDCi - 95hp': { power: 95, torque: 215, type: 'diesel' },
            '1.6 TDCi - 95hp': { power: 95, torque: 215, type: 'diesel' },
            '1.0 EcoBoost - 100hp': { power: 100, torque: 170, type: 'petrol' },
            '1.0 EcoBoost - 125hp': { power: 125, torque: 170, type: 'petrol' },
            '1.6 EcoBoost - 200hp': { power: 200, torque: 290, type: 'petrol' }
          }
        },
        'Mondeo': {
          '2007-2022': {
            '1.6 TDCi - 115hp': { power: 115, torque: 270, type: 'diesel' },
            '2.0 TDCi - 150hp': { power: 150, torque: 340, type: 'diesel' },
            '2.0 TDCi - 180hp': { power: 180, torque: 400, type: 'diesel' },
            '1.5 EcoBoost - 160hp': { power: 160, torque: 240, type: 'petrol' },
            '2.0 EcoBoost - 240hp': { power: 240, torque: 345, type: 'petrol' }
          }
        },
        'Kuga': {
          '2008-2024': {
            '1.5 EcoBlue - 120hp': { power: 120, torque: 300, type: 'diesel' },
            '2.0 EcoBlue - 150hp': { power: 150, torque: 370, type: 'diesel' },
            '2.0 EcoBlue - 190hp': { power: 190, torque: 400, type: 'diesel' },
            '1.5 EcoBoost - 150hp': { power: 150, torque: 240, type: 'petrol' },
            '2.0 EcoBoost - 245hp': { power: 245, torque: 390, type: 'petrol' }
          }
        }
      },
      'vauxhall': {
        'Astra': {
          '2004-2015': {
            '1.3 CDTi - 90hp': { power: 90, torque: 200, type: 'diesel' },
            '1.7 CDTi - 110hp': { power: 110, torque: 260, type: 'diesel' },
            '1.9 CDTi - 150hp': { power: 150, torque: 320, type: 'diesel' },
            '1.4 Turbo - 140hp': { power: 140, torque: 200, type: 'petrol' },
            '1.6 Turbo - 180hp': { power: 180, torque: 230, type: 'petrol' }
          },
          '2015-2024': {
            '1.6 CDTi - 110hp': { power: 110, torque: 300, type: 'diesel' },
            '1.6 CDTi - 136hp': { power: 136, torque: 320, type: 'diesel' },
            '1.0 Turbo - 105hp': { power: 105, torque: 166, type: 'petrol' },
            '1.4 Turbo - 125hp': { power: 125, torque: 200, type: 'petrol' },
            '1.4 Turbo - 150hp': { power: 150, torque: 245, type: 'petrol' }
          }
        },
        'Corsa': {
          '2006-2019': {
            '1.3 CDTi - 75hp': { power: 75, torque: 170, type: 'diesel' },
            '1.3 CDTi - 95hp': { power: 95, torque: 200, type: 'diesel' },
            '1.0 Turbo - 90hp': { power: 90, torque: 166, type: 'petrol' },
            '1.4 Turbo - 100hp': { power: 100, torque: 130, type: 'petrol' }
          },
          '2019-2024': {
            '1.5 Diesel - 100hp': { power: 100, torque: 250, type: 'diesel' },
            '1.2 Turbo - 100hp': { power: 100, torque: 205, type: 'petrol' },
            '1.2 Turbo - 130hp': { power: 130, torque: 230, type: 'petrol' }
          }
        },
        'Insignia': {
          '2008-2024': {
            '1.6 CDTi - 110hp': { power: 110, torque: 300, type: 'diesel' },
            '1.6 CDTi - 136hp': { power: 136, torque: 320, type: 'diesel' },
            '2.0 CDTi - 160hp': { power: 160, torque: 350, type: 'diesel' },
            '1.4 Turbo - 140hp': { power: 140, torque: 200, type: 'petrol' },
            '1.6 Turbo - 170hp': { power: 170, torque: 280, type: 'petrol' },
            '2.0 Turbo - 250hp': { power: 250, torque: 400, type: 'petrol' }
          }
        }
      },
      'land-rover': {
        'Discovery Sport': {
          '2014-2024': {
            '2.0 TD4 - 150hp': { power: 150, torque: 380, type: 'diesel' },
            '2.0 TD4 - 180hp': { power: 180, torque: 430, type: 'diesel' },
            '2.0 Si4 - 240hp': { power: 240, torque: 340, type: 'petrol' }
          }
        },
        'Range Rover Evoque': {
          '2011-2024': {
            '2.0 TD4 - 150hp': { power: 150, torque: 380, type: 'diesel' },
            '2.0 TD4 - 180hp': { power: 180, torque: 430, type: 'diesel' },
            '2.0 Si4 - 240hp': { power: 240, torque: 340, type: 'petrol' }
          }
        },
        'Range Rover Sport': {
          '2005-2024': {
            '3.0 SDV6 - 256hp': { power: 256, torque: 600, type: 'diesel' },
            '3.0 SDV8 - 339hp': { power: 339, torque: 700, type: 'diesel' },
            '3.0 V6 SC - 380hp': { power: 380, torque: 450, type: 'petrol' },
            '5.0 V8 SC - 510hp': { power: 510, torque: 625, type: 'petrol' }
          }
        }
      },
      'nissan': {
        'Qashqai': {
          '2007-2024': {
            '1.5 dCi - 110hp': { power: 110, torque: 260, type: 'diesel' },
            '1.6 dCi - 130hp': { power: 130, torque: 320, type: 'diesel' },
            '2.0 dCi - 150hp': { power: 150, torque: 320, type: 'diesel' },
            '1.2 DIG-T - 115hp': { power: 115, torque: 190, type: 'petrol' },
            '1.6 DIG-T - 163hp': { power: 163, torque: 240, type: 'petrol' }
          }
        },
        'Juke': {
          '2010-2024': {
            '1.5 dCi - 110hp': { power: 110, torque: 260, type: 'diesel' },
            '1.0 DIG-T - 114hp': { power: 114, torque: 180, type: 'petrol' },
            '1.6 DIG-T - 190hp': { power: 190, torque: 240, type: 'petrol' }
          }
        },
        'X-Trail': {
          '2007-2024': {
            '1.6 dCi - 130hp': { power: 130, torque: 320, type: 'diesel' },
            '2.0 dCi - 150hp': { power: 150, torque: 380, type: 'diesel' },
            '1.3 DIG-T - 160hp': { power: 160, torque: 270, type: 'petrol' },
            '2.0 - 144hp': { power: 144, torque: 200, type: 'petrol' }
          }
        }
      },
      'toyota': {
        'Auris': {
          '2007-2018': {
            '1.4 D-4D - 90hp': { power: 90, torque: 205, type: 'diesel' },
            '2.0 D-4D - 124hp': { power: 124, torque: 310, type: 'diesel' },
            '1.2 T - 116hp': { power: 116, torque: 185, type: 'petrol' },
            '1.6 VVT-i - 132hp': { power: 132, torque: 160, type: 'petrol' }
          }
        },
        'Avensis': {
          '2009-2018': {
            '1.6 D-4D - 112hp': { power: 112, torque: 270, type: 'diesel' },
            '2.0 D-4D - 124hp': { power: 124, torque: 310, type: 'diesel' },
            '2.2 D-4D - 150hp': { power: 150, torque: 340, type: 'diesel' },
            '1.6 VVT-i - 132hp': { power: 132, torque: 160, type: 'petrol' },
            '2.0 VVT-i - 152hp': { power: 152, torque: 196, type: 'petrol' }
          }
        },
        'RAV4': {
          '2006-2024': {
            '2.0 D-4D - 124hp': { power: 124, torque: 310, type: 'diesel' },
            '2.2 D-4D - 150hp': { power: 150, torque: 340, type: 'diesel' },
            '2.0 VVT-i - 158hp': { power: 158, torque: 196, type: 'petrol' },
            '2.5 VVT-i - 197hp': { power: 197, torque: 243, type: 'petrol' }
          }
        }
      },
      'peugeot': {
        '208': {
          '2012-2024': {
            '1.4 HDi - 68hp': { power: 68, torque: 160, type: 'diesel' },
            '1.6 BlueHDi - 100hp': { power: 100, torque: 254, type: 'diesel' },
            '1.2 PureTech - 82hp': { power: 82, torque: 118, type: 'petrol' },
            '1.2 PureTech - 110hp': { power: 110, torque: 205, type: 'petrol' },
            '1.6 THP - 156hp': { power: 156, torque: 240, type: 'petrol' }
          }
        },
        '308': {
          '2013-2024': {
            '1.6 BlueHDi - 100hp': { power: 100, torque: 254, type: 'diesel' },
            '1.6 BlueHDi - 120hp': { power: 120, torque: 300, type: 'diesel' },
            '2.0 BlueHDi - 150hp': { power: 150, torque: 370, type: 'diesel' },
            '1.2 PureTech - 110hp': { power: 110, torque: 205, type: 'petrol' },
            '1.2 PureTech - 130hp': { power: 130, torque: 230, type: 'petrol' },
            '1.6 THP - 205hp': { power: 205, torque: 285, type: 'petrol' }
          }
        },
        '508': {
          '2010-2024': {
            '1.6 BlueHDi - 120hp': { power: 120, torque: 300, type: 'diesel' },
            '2.0 BlueHDi - 150hp': { power: 150, torque: 370, type: 'diesel' },
            '2.0 BlueHDi - 180hp': { power: 180, torque: 400, type: 'diesel' },
            '1.6 PureTech - 180hp': { power: 180, torque: 250, type: 'petrol' },
            '1.6 THP - 205hp': { power: 205, torque: 285, type: 'petrol' }
          }
        },
        '3008': {
          '2016-2024': {
            '1.5 BlueHDi - 130hp': { power: 130, torque: 300, type: 'diesel' },
            '2.0 BlueHDi - 150hp': { power: 150, torque: 370, type: 'diesel' },
            '2.0 BlueHDi - 180hp': { power: 180, torque: 400, type: 'diesel' },
            '1.2 PureTech - 130hp': { power: 130, torque: 230, type: 'petrol' },
            '1.6 PureTech - 180hp': { power: 180, torque: 250, type: 'petrol' }
          }
        }
      },
      'renault': {
        'Clio': {
          '2005-2019': {
            '1.5 dCi - 75hp': { power: 75, torque: 190, type: 'diesel' },
            '1.5 dCi - 90hp': { power: 90, torque: 220, type: 'diesel' },
            '1.5 dCi - 110hp': { power: 110, torque: 260, type: 'diesel' },
            '0.9 TCe - 90hp': { power: 90, torque: 135, type: 'petrol' },
            '1.2 TCe - 120hp': { power: 120, torque: 190, type: 'petrol' },
            '1.6 RS - 200hp': { power: 200, torque: 240, type: 'petrol' }
          },
          '2019-2024': {
            '1.5 Blue dCi - 85hp': { power: 85, torque: 220, type: 'diesel' },
            '1.5 Blue dCi - 115hp': { power: 115, torque: 260, type: 'diesel' },
            '1.0 TCe - 100hp': { power: 100, torque: 160, type: 'petrol' },
            '1.3 TCe - 130hp': { power: 130, torque: 240, type: 'petrol' }
          }
        },
        'Megane': {
          '2008-2024': {
            '1.5 dCi - 110hp': { power: 110, torque: 260, type: 'diesel' },
            '1.6 dCi - 130hp': { power: 130, torque: 320, type: 'diesel' },
            '1.2 TCe - 115hp': { power: 115, torque: 190, type: 'petrol' },
            '1.3 TCe - 140hp': { power: 140, torque: 240, type: 'petrol' },
            '1.6 TCe - 205hp': { power: 205, torque: 300, type: 'petrol' },
            '2.0 RS - 280hp': { power: 280, torque: 390, type: 'petrol' }
          }
        },
        'Kadjar': {
          '2015-2024': {
            '1.5 dCi - 110hp': { power: 110, torque: 260, type: 'diesel' },
            '1.6 dCi - 130hp': { power: 130, torque: 320, type: 'diesel' },
            '1.3 TCe - 140hp': { power: 140, torque: 240, type: 'petrol' },
            '1.3 TCe - 160hp': { power: 160, torque: 260, type: 'petrol' }
          }
        }
      },
      'citroen': {
        'C3': {
          '2010-2024': {
            '1.4 HDi - 70hp': { power: 70, torque: 160, type: 'diesel' },
            '1.6 BlueHDi - 100hp': { power: 100, torque: 254, type: 'diesel' },
            '1.2 PureTech - 82hp': { power: 82, torque: 118, type: 'petrol' },
            '1.2 PureTech - 110hp': { power: 110, torque: 205, type: 'petrol' }
          }
        },
        'C4': {
          '2010-2024': {
            '1.6 BlueHDi - 100hp': { power: 100, torque: 254, type: 'diesel' },
            '1.6 BlueHDi - 120hp': { power: 120, torque: 300, type: 'diesel' },
            '2.0 BlueHDi - 150hp': { power: 150, torque: 370, type: 'diesel' },
            '1.2 PureTech - 110hp': { power: 110, torque: 205, type: 'petrol' },
            '1.2 PureTech - 130hp': { power: 130, torque: 230, type: 'petrol' },
            '1.6 THP - 165hp': { power: 165, torque: 240, type: 'petrol' }
          }
        },
        'C5 Aircross': {
          '2018-2024': {
            '1.5 BlueHDi - 130hp': { power: 130, torque: 300, type: 'diesel' },
            '2.0 BlueHDi - 180hp': { power: 180, torque: 400, type: 'diesel' },
            '1.2 PureTech - 130hp': { power: 130, torque: 230, type: 'petrol' },
            '1.6 PureTech - 180hp': { power: 180, torque: 250, type: 'petrol' }
          }
        }
      },
      'seat': {
        'Ibiza': {
          '2008-2024': {
            '1.4 TDI - 80hp': { power: 80, torque: 195, type: 'diesel' },
            '1.6 TDI - 95hp': { power: 95, torque: 250, type: 'diesel' },
            '1.0 TSI - 95hp': { power: 95, torque: 175, type: 'petrol' },
            '1.0 TSI - 110hp': { power: 110, torque: 200, type: 'petrol' },
            '1.5 TSI - 150hp': { power: 150, torque: 250, type: 'petrol' }
          }
        },
        'Leon': {
          '2005-2024': {
            '1.6 TDI - 105hp': { power: 105, torque: 250, type: 'diesel' },
            '2.0 TDI - 150hp': { power: 150, torque: 340, type: 'diesel' },
            '1.4 TSI - 125hp': { power: 125, torque: 200, type: 'petrol' },
            '1.4 TSI - 150hp': { power: 150, torque: 250, type: 'petrol' },
            '2.0 TSI - 190hp': { power: 190, torque: 320, type: 'petrol' },
            '2.0 Cupra - 300hp': { power: 300, torque: 400, type: 'petrol' }
          }
        },
        'Ateca': {
          '2016-2024': {
            '1.6 TDI - 115hp': { power: 115, torque: 250, type: 'diesel' },
            '2.0 TDI - 150hp': { power: 150, torque: 340, type: 'diesel' },
            '1.0 TSI - 115hp': { power: 115, torque: 200, type: 'petrol' },
            '1.4 TSI - 150hp': { power: 150, torque: 250, type: 'petrol' },
            '2.0 TSI - 190hp': { power: 190, torque: 320, type: 'petrol' }
          }
        }
      },
      'skoda': {
        'Fabia': {
          '2007-2024': {
            '1.4 TDI - 90hp': { power: 90, torque: 230, type: 'diesel' },
            '1.6 TDI - 105hp': { power: 105, torque: 250, type: 'diesel' },
            '1.0 TSI - 95hp': { power: 95, torque: 175, type: 'petrol' },
            '1.0 TSI - 110hp': { power: 110, torque: 200, type: 'petrol' }
          }
        },
        'Octavia': {
          '2004-2024': {
            '1.6 TDI - 105hp': { power: 105, torque: 250, type: 'diesel' },
            '2.0 TDI - 150hp': { power: 150, torque: 340, type: 'diesel' },
            '1.4 TSI - 125hp': { power: 125, torque: 200, type: 'petrol' },
            '1.4 TSI - 150hp': { power: 150, torque: 250, type: 'petrol' },
            '2.0 TSI - 190hp': { power: 190, torque: 320, type: 'petrol' },
            '2.0 RS - 245hp': { power: 245, torque: 370, type: 'petrol' }
          }
        },
        'Superb': {
          '2008-2024': {
            '1.6 TDI - 120hp': { power: 120, torque: 250, type: 'diesel' },
            '2.0 TDI - 150hp': { power: 150, torque: 340, type: 'diesel' },
            '2.0 TDI - 190hp': { power: 190, torque: 400, type: 'diesel' },
            '1.4 TSI - 150hp': { power: 150, torque: 250, type: 'petrol' },
            '2.0 TSI - 190hp': { power: 190, torque: 320, type: 'petrol' },
            '2.0 TSI - 280hp': { power: 280, torque: 350, type: 'petrol' }
          }
        }
      },
      'volvo': {
        'V40': {
          '2012-2019': {
            'D2 - 120hp': { power: 120, torque: 280, type: 'diesel' },
            'D3 - 150hp': { power: 150, torque: 320, type: 'diesel' },
            'D4 - 190hp': { power: 190, torque: 400, type: 'diesel' },
            'T2 - 122hp': { power: 122, torque: 200, type: 'petrol' },
            'T3 - 152hp': { power: 152, torque: 240, type: 'petrol' },
            'T4 - 190hp': { power: 190, torque: 300, type: 'petrol' },
            'T5 - 254hp': { power: 254, torque: 350, type: 'petrol' }
          }
        },
        'XC60': {
          '2008-2024': {
            'D4 - 190hp': { power: 190, torque: 400, type: 'diesel' },
            'D5 - 235hp': { power: 235, torque: 480, type: 'diesel' },
            'T4 - 190hp': { power: 190, torque: 300, type: 'petrol' },
            'T5 - 254hp': { power: 254, torque: 350, type: 'petrol' },
            'T6 - 320hp': { power: 320, torque: 400, type: 'petrol' }
          }
        },
        'XC90': {
          '2002-2024': {
            'D5 - 235hp': { power: 235, torque: 480, type: 'diesel' },
            'T5 - 254hp': { power: 254, torque: 350, type: 'petrol' },
            'T6 - 320hp': { power: 320, torque: 400, type: 'petrol' }
          }
        }
      },
      'alfa-romeo': {
        'Giulietta': {
          '2010-2020': {
            '1.4 TB - 120hp': { power: 120, torque: 206, type: 'petrol' },
            '1.4 TB - 170hp': { power: 170, torque: 250, type: 'petrol' },
            '1.8 TB - 235hp': { power: 235, torque: 340, type: 'petrol' },
            '1.6 JTDM - 105hp': { power: 105, torque: 320, type: 'diesel' },
            '2.0 JTDM - 150hp': { power: 150, torque: 380, type: 'diesel' }
          }
        },
        'Stelvio': {
          '2017-2024': {
            '2.0 TB - 200hp': { power: 200, torque: 330, type: 'petrol' },
            '2.0 TB - 280hp': { power: 280, torque: 400, type: 'petrol' },
            '2.2 D - 160hp': { power: 160, torque: 450, type: 'diesel' },
            '2.2 D - 210hp': { power: 210, torque: 470, type: 'diesel' }
          }
        }
      },
      'bentley': {
        'Continental GT': {
          '2003-2024': {
            '6.0 W12 - 560hp': { power: 560, torque: 650, type: 'petrol' },
            '6.0 W12 - 626hp': { power: 626, torque: 820, type: 'petrol' },
            '4.0 V8 - 507hp': { power: 507, torque: 660, type: 'petrol' }
          }
        },
        'Bentayga': {
          '2016-2024': {
            '6.0 W12 - 608hp': { power: 608, torque: 900, type: 'petrol' },
            '4.0 V8 - 550hp': { power: 550, torque: 770, type: 'petrol' },
            '4.0 V8 D - 435hp': { power: 435, torque: 900, type: 'diesel' }
          }
        }
      },
      'chery': {
        'Tiggo 7': {
          '2019-2024': {
            '1.5 Turbo - 147hp': { power: 147, torque: 210, type: 'petrol' }
          }
        }
      },
      'chrysler': {
        '300C': {
          '2005-2024': {
            '2.7 V6 - 190hp': { power: 190, torque: 260, type: 'petrol' },
            '3.5 V6 - 250hp': { power: 250, torque: 350, type: 'petrol' },
            '5.7 V8 - 340hp': { power: 340, torque: 390, type: 'petrol' },
            '6.1 SRT8 - 425hp': { power: 425, torque: 569, type: 'petrol' }
          }
        }
      },
      'dacia': {
        'Duster': {
          '2010-2024': {
            '1.5 dCi - 110hp': { power: 110, torque: 260, type: 'diesel' },
            '1.3 TCe - 130hp': { power: 130, torque: 240, type: 'petrol' },
            '1.0 TCe - 100hp': { power: 100, torque: 160, type: 'petrol' }
          }
        },
        'Logan': {
          '2004-2024': {
            '1.5 dCi - 90hp': { power: 90, torque: 220, type: 'diesel' },
            '1.0 SCe - 75hp': { power: 75, torque: 95, type: 'petrol' },
            '0.9 TCe - 90hp': { power: 90, torque: 140, type: 'petrol' }
          }
        }
      },
      'ds': {
        'DS 3': {
          '2016-2024': {
            '1.2 PureTech - 110hp': { power: 110, torque: 205, type: 'petrol' },
            '1.2 PureTech - 130hp': { power: 130, torque: 230, type: 'petrol' },
            '1.5 BlueHDi - 100hp': { power: 100, torque: 250, type: 'diesel' }
          }
        },
        'DS 7': {
          '2017-2024': {
            '1.6 PureTech - 180hp': { power: 180, torque: 250, type: 'petrol' },
            '1.6 PureTech - 225hp': { power: 225, torque: 300, type: 'petrol' },
            '2.0 BlueHDi - 180hp': { power: 180, torque: 400, type: 'diesel' }
          }
        }
      },
      'fiat': {
        'Punto': {
          '2005-2018': {
            '1.3 JTD - 75hp': { power: 75, torque: 190, type: 'diesel' },
            '1.3 JTD - 90hp': { power: 90, torque: 200, type: 'diesel' },
            '1.4 T-Jet - 120hp': { power: 120, torque: 180, type: 'petrol' },
            '1.4 T-Jet - 165hp': { power: 165, torque: 230, type: 'petrol' }
          }
        },
        '500': {
          '2007-2024': {
            '1.3 JTD - 75hp': { power: 75, torque: 190, type: 'diesel' },
            '1.3 JTD - 95hp': { power: 95, torque: 200, type: 'diesel' },
            '1.4 T-Jet - 135hp': { power: 135, torque: 180, type: 'petrol' },
            '1.4 Abarth - 160hp': { power: 160, torque: 230, type: 'petrol' }
          }
        }
      },
      'honda': {
        'Civic': {
          '2006-2024': {
            '1.6 i-DTEC - 120hp': { power: 120, torque: 300, type: 'diesel' },
            '2.2 i-DTEC - 150hp': { power: 150, torque: 350, type: 'diesel' },
            '1.0 VTEC - 129hp': { power: 129, torque: 180, type: 'petrol' },
            '1.5 VTEC - 182hp': { power: 182, torque: 240, type: 'petrol' },
            '2.0 Type R - 320hp': { power: 320, torque: 400, type: 'petrol' }
          }
        },
        'CR-V': {
          '2007-2024': {
            '1.6 i-DTEC - 160hp': { power: 160, torque: 350, type: 'diesel' },
            '2.2 i-DTEC - 150hp': { power: 150, torque: 350, type: 'diesel' },
            '1.5 VTEC - 193hp': { power: 193, torque: 243, type: 'petrol' },
            '2.0 i-VTEC - 155hp': { power: 155, torque: 192, type: 'petrol' }
          }
        }
      },
      'hyundai': {
        'i30': {
          '2007-2024': {
            '1.6 CRDi - 110hp': { power: 110, torque: 260, type: 'diesel' },
            '1.6 CRDi - 136hp': { power: 136, torque: 320, type: 'diesel' },
            '1.0 T-GDi - 120hp': { power: 120, torque: 172, type: 'petrol' },
            '1.4 T-GDi - 140hp': { power: 140, torque: 242, type: 'petrol' },
            '2.0 T-GDi N - 275hp': { power: 275, torque: 353, type: 'petrol' }
          }
        },
        'Tucson': {
          '2004-2024': {
            '1.7 CRDi - 115hp': { power: 115, torque: 280, type: 'diesel' },
            '2.0 CRDi - 185hp': { power: 185, torque: 400, type: 'diesel' },
            '1.6 T-GDi - 177hp': { power: 177, torque: 265, type: 'petrol' },
            '2.0 T-GDi - 230hp': { power: 230, torque: 353, type: 'petrol' }
          }
        }
      },
      'infiniti': {
        'Q50': {
          '2013-2024': {
            '2.2d - 170hp': { power: 170, torque: 400, type: 'diesel' },
            '3.0t - 300hp': { power: 300, torque: 400, type: 'petrol' },
            '3.0t - 400hp': { power: 400, torque: 475, type: 'petrol' }
          }
        }
      },
      'jaguar': {
        'XE': {
          '2015-2024': {
            '2.0d - 163hp': { power: 163, torque: 380, type: 'diesel' },
            '2.0d - 180hp': { power: 180, torque: 430, type: 'diesel' },
            '2.0 - 200hp': { power: 200, torque: 320, type: 'petrol' },
            '2.0 - 250hp': { power: 250, torque: 365, type: 'petrol' }
          }
        },
        'F-Pace': {
          '2016-2024': {
            '2.0d - 163hp': { power: 163, torque: 380, type: 'diesel' },
            '2.0d - 204hp': { power: 204, torque: 430, type: 'diesel' },
            '2.0 - 250hp': { power: 250, torque: 365, type: 'petrol' },
            '3.0 V6 S - 380hp': { power: 380, torque: 450, type: 'petrol' }
          }
        }
      },
      'jeep': {
        'Grand Cherokee': {
          '2005-2024': {
            '3.0 CRD - 218hp': { power: 218, torque: 550, type: 'diesel' },
            '3.0 CRD - 250hp': { power: 250, torque: 570, type: 'diesel' },
            '3.6 V6 - 286hp': { power: 286, torque: 347, type: 'petrol' },
            '5.7 V8 - 352hp': { power: 352, torque: 520, type: 'petrol' },
            '6.2 SRT - 707hp': { power: 707, torque: 875, type: 'petrol' }
          }
        },
        'Compass': {
          '2007-2024': {
            '1.6 MultiJet - 120hp': { power: 120, torque: 320, type: 'diesel' },
            '2.0 MultiJet - 170hp': { power: 170, torque: 350, type: 'diesel' },
            '1.4 MultiAir - 170hp': { power: 170, torque: 250, type: 'petrol' },
            '2.0 MultiAir - 240hp': { power: 240, torque: 350, type: 'petrol' }
          }
        }
      },
      'kia': {
        'Ceed': {
          '2007-2024': {
            '1.6 CRDi - 115hp': { power: 115, torque: 280, type: 'diesel' },
            '1.6 CRDi - 136hp': { power: 136, torque: 320, type: 'diesel' },
            '1.0 T-GDi - 120hp': { power: 120, torque: 172, type: 'petrol' },
            '1.4 T-GDi - 140hp': { power: 140, torque: 242, type: 'petrol' },
            '1.6 T-GDi GT - 204hp': { power: 204, torque: 265, type: 'petrol' }
          }
        },
        'Sportage': {
          '2004-2024': {
            '1.7 CRDi - 115hp': { power: 115, torque: 280, type: 'diesel' },
            '2.0 CRDi - 185hp': { power: 185, torque: 400, type: 'diesel' },
            '1.6 T-GDi - 177hp': { power: 177, torque: 265, type: 'petrol' },
            '2.0 T-GDi - 245hp': { power: 245, torque: 353, type: 'petrol' }
          }
        }
      },
      'lancia': {
        'Delta': {
          '2008-2014': {
            '1.4 T-Jet - 120hp': { power: 120, torque: 180, type: 'petrol' },
            '1.4 T-Jet - 165hp': { power: 165, torque: 230, type: 'petrol' },
            '1.6 D MultiJet - 120hp': { power: 120, torque: 320, type: 'diesel' },
            '1.9 D MultiJet - 190hp': { power: 190, torque: 400, type: 'diesel' }
          }
        }
      },
      'land-rover': {
        'Discovery': {
          '2004-2024': {
            '2.0 Sd4 - 240hp': { power: 240, torque: 500, type: 'diesel' },
            '3.0 Td6 - 258hp': { power: 258, torque: 600, type: 'diesel' },
            '2.0 Si4 - 240hp': { power: 240, torque: 340, type: 'petrol' },
            '3.0 V6 SC - 340hp': { power: 340, torque: 450, type: 'petrol' }
          }
        },
        'Range Rover Evoque': {
          '2011-2024': {
            '2.0 eD4 - 150hp': { power: 150, torque: 380, type: 'diesel' },
            '2.0 TD4 - 180hp': { power: 180, torque: 430, type: 'diesel' },
            '2.0 Si4 - 240hp': { power: 240, torque: 340, type: 'petrol' },
            '2.0 Si4 - 290hp': { power: 290, torque: 400, type: 'petrol' }
          }
        }
      },
      'lexus': {
        'IS': {
          '2005-2024': {
            '2.2d - 177hp': { power: 177, torque: 400, type: 'diesel' },
            '2.5 - 208hp': { power: 208, torque: 252, type: 'petrol' },
            '3.5 - 306hp': { power: 306, torque: 378, type: 'petrol' }
          }
        },
        'NX': {
          '2014-2024': {
            '2.0 - 238hp': { power: 238, torque: 350, type: 'petrol' },
            '3.5 - 306hp': { power: 306, torque: 370, type: 'petrol' }
          }
        }
      },
      'maserati': {
        'Ghibli': {
          '2013-2024': {
            '3.0 V6 D - 275hp': { power: 275, torque: 600, type: 'diesel' },
            '3.0 V6 - 350hp': { power: 350, torque: 500, type: 'petrol' },
            '3.0 V6 S - 410hp': { power: 410, torque: 550, type: 'petrol' }
          }
        },
        'Levante': {
          '2016-2024': {
            '3.0 V6 D - 275hp': { power: 275, torque: 600, type: 'diesel' },
            '3.0 V6 - 350hp': { power: 350, torque: 500, type: 'petrol' },
            '3.8 V8 - 580hp': { power: 580, torque: 730, type: 'petrol' }
          }
        }
      },
      'mazda': {
        '3': {
          '2003-2024': {
            '1.6 D - 105hp': { power: 105, torque: 270, type: 'diesel' },
            '2.2 D - 150hp': { power: 150, torque: 380, type: 'diesel' },
            '1.5 - 120hp': { power: 120, torque: 153, type: 'petrol' },
            '2.0 - 165hp': { power: 165, torque: 210, type: 'petrol' },
            '2.3 MPS - 260hp': { power: 260, torque: 380, type: 'petrol' }
          }
        },
        'CX-5': {
          '2012-2024': {
            '2.2 D - 150hp': { power: 150, torque: 380, type: 'diesel' },
            '2.2 D - 175hp': { power: 175, torque: 420, type: 'diesel' },
            '2.0 - 165hp': { power: 165, torque: 210, type: 'petrol' },
            '2.5 - 194hp': { power: 194, torque: 258, type: 'petrol' }
          }
        }
      },
      'mini': {
        'Cooper': {
          '2006-2024': {
            '1.5 D - 116hp': { power: 116, torque: 270, type: 'diesel' },
            '2.0 D - 150hp': { power: 150, torque: 330, type: 'diesel' },
            '1.2 - 102hp': { power: 102, torque: 180, type: 'petrol' },
            '1.5 - 136hp': { power: 136, torque: 220, type: 'petrol' },
            '2.0 S - 192hp': { power: 192, torque: 280, type: 'petrol' },
            '2.0 JCW - 231hp': { power: 231, torque: 320, type: 'petrol' }
          }
        },
        'Countryman': {
          '2010-2024': {
            '2.0 D - 150hp': { power: 150, torque: 330, type: 'diesel' },
            '2.0 D ALL4 - 190hp': { power: 190, torque: 400, type: 'diesel' },
            '1.5 - 136hp': { power: 136, torque: 220, type: 'petrol' },
            '2.0 S - 192hp': { power: 192, torque: 280, type: 'petrol' },
            '2.0 JCW - 306hp': { power: 306, torque: 450, type: 'petrol' }
          }
        }
      },
      'mitsubishi': {
        'Lancer': {
          '2007-2017': {
            '1.5 - 109hp': { power: 109, torque: 143, type: 'petrol' },
            '1.8 - 143hp': { power: 143, torque: 178, type: 'petrol' },
            '2.0 - 150hp': { power: 150, torque: 197, type: 'petrol' },
            '2.0 Evolution - 295hp': { power: 295, torque: 366, type: 'petrol' }
          }
        },
        'Outlander': {
          '2007-2024': {
            '2.2 DI-D - 150hp': { power: 150, torque: 380, type: 'diesel' },
            '2.4 - 169hp': { power: 169, torque: 226, type: 'petrol' },
            '3.0 V6 - 224hp': { power: 224, torque: 285, type: 'petrol' }
          }
        }
      },
      'nissan': {
        'Qashqai': {
          '2007-2024': {
            '1.5 dCi - 110hp': { power: 110, torque: 260, type: 'diesel' },
            '1.6 dCi - 130hp': { power: 130, torque: 320, type: 'diesel' },
            '1.3 DIG-T - 140hp': { power: 140, torque: 240, type: 'petrol' },
            '1.6 DIG-T - 163hp': { power: 163, torque: 240, type: 'petrol' }
          }
        },
        'X-Trail': {
          '2007-2024': {
            '1.6 dCi - 130hp': { power: 130, torque: 320, type: 'diesel' },
            '2.0 dCi - 177hp': { power: 177, torque: 380, type: 'diesel' },
            '1.3 DIG-T - 160hp': { power: 160, torque: 270, type: 'petrol' },
            '2.5 - 169hp': { power: 169, torque: 233, type: 'petrol' }
          }
        }
      },
      'porsche': {
        '911': {
          '2004-2024': {
            '3.4 Carrera - 350hp': { power: 350, torque: 390, type: 'petrol' },
            '3.8 Carrera S - 400hp': { power: 400, torque: 440, type: 'petrol' },
            '3.8 Turbo - 540hp': { power: 540, torque: 710, type: 'petrol' },
            '3.8 Turbo S - 580hp': { power: 580, torque: 750, type: 'petrol' }
          }
        },
        'Cayenne': {
          '2002-2024': {
            '3.0 Diesel - 262hp': { power: 262, torque: 580, type: 'diesel' },
            '4.2 Diesel - 385hp': { power: 385, torque: 850, type: 'diesel' },
            '3.0 - 340hp': { power: 340, torque: 450, type: 'petrol' },
            '4.0 Turbo - 550hp': { power: 550, torque: 770, type: 'petrol' }
          }
        },
        'Macan': {
          '2014-2024': {
            '3.0 Diesel - 258hp': { power: 258, torque: 580, type: 'diesel' },
            '2.0 - 252hp': { power: 252, torque: 370, type: 'petrol' },
            '3.0 S - 354hp': { power: 354, torque: 480, type: 'petrol' },
            '3.6 Turbo - 440hp': { power: 440, torque: 600, type: 'petrol' }
          }
        }
      },
      'saab': {
        '9-3': {
          '2003-2014': {
            '1.9 TiD - 120hp': { power: 120, torque: 280, type: 'diesel' },
            '1.9 TiD - 150hp': { power: 150, torque: 320, type: 'diesel' },
            '2.0T - 210hp': { power: 210, torque: 300, type: 'petrol' },
            '2.8 V6 - 255hp': { power: 255, torque: 350, type: 'petrol' }
          }
        }
      },
      'subaru': {
        'Impreza': {
          '2007-2024': {
            '1.5 - 110hp': { power: 110, torque: 144, type: 'petrol' },
            '2.0 - 150hp': { power: 150, torque: 196, type: 'petrol' },
            '2.5 WRX - 268hp': { power: 268, torque: 350, type: 'petrol' },
            '2.5 STI - 300hp': { power: 300, torque: 407, type: 'petrol' }
          }
        },
        'Forester': {
          '2008-2024': {
            '2.0 - 150hp': { power: 150, torque: 196, type: 'petrol' },
            '2.5 - 184hp': { power: 184, torque: 239, type: 'petrol' },
            '2.0 XT - 241hp': { power: 241, torque: 350, type: 'petrol' }
          }
        }
      },
      'suzuki': {
        'Swift': {
          '2005-2024': {
            '1.0 BoosterJet - 112hp': { power: 112, torque: 160, type: 'petrol' },
            '1.2 - 94hp': { power: 94, torque: 118, type: 'petrol' },
            '1.4 BoosterJet - 140hp': { power: 140, torque: 230, type: 'petrol' },
            '1.6 Sport - 136hp': { power: 136, torque: 160, type: 'petrol' }
          }
        },
        'Vitara': {
          '2015-2024': {
            '1.0 BoosterJet - 112hp': { power: 112, torque: 160, type: 'petrol' },
            '1.4 BoosterJet - 140hp': { power: 140, torque: 220, type: 'petrol' },
            '1.6 - 120hp': { power: 120, torque: 156, type: 'petrol' }
          }
        }
      },
      'tesla': {
        'Model 3': {
          '2017-2024': {
            'Standard Range - 283hp': { power: 283, torque: 340, type: 'electric' },
            'Long Range - 350hp': { power: 350, torque: 510, type: 'electric' },
            'Performance - 480hp': { power: 480, torque: 640, type: 'electric' }
          }
        },
        'Model S': {
          '2012-2024': {
            '75D - 386hp': { power: 386, torque: 525, type: 'electric' },
            '100D - 422hp': { power: 422, torque: 660, type: 'electric' },
            'P100D - 772hp': { power: 772, torque: 1155, type: 'electric' }
          }
        }
      },
      'toyota': {
        'Corolla': {
          '2007-2024': {
            '1.4 D-4D - 90hp': { power: 90, torque: 205, type: 'diesel' },
            '2.0 D-4D - 124hp': { power: 124, torque: 310, type: 'diesel' },
            '1.33 VVT-i - 101hp': { power: 101, torque: 132, type: 'petrol' },
            '1.6 VVT-i - 132hp': { power: 132, torque: 160, type: 'petrol' },
            '2.0 - 170hp': { power: 170, torque: 203, type: 'petrol' }
          }
        },
        'RAV4': {
          '2006-2024': {
            '2.0 D-4D - 124hp': { power: 124, torque: 310, type: 'diesel' },
            '2.2 D-4D - 150hp': { power: 150, torque: 340, type: 'diesel' },
            '2.0 VVT-i - 158hp': { power: 158, torque: 196, type: 'petrol' },
            '2.5 - 203hp': { power: 203, torque: 243, type: 'petrol' }
          }
        }
      }
    };
    
    // Year ranges for public search (fallback only)
    const PUBLIC_YEAR_RANGES = ['2021-2024', '2017-2020', '2013-2016', '2009-2012', '2005-2008', '2000-2004'];
    
    // Manufacturer change handler - use main VEHICLE_DATABASE
    manufacturerSelect.addEventListener('change', function() {
      const manufacturer = this.value;
      
      // Clear dependent dropdowns
      modelSelect.innerHTML = '<option value="">Select Model</option>';
      yearSelect.innerHTML = '<option value="">Select Year Range</option>';
      engineSelect.innerHTML = '<option value="">Select Engine</option>';
      
      if (manufacturer && VEHICLE_DATABASE[manufacturer]) {
        VEHICLE_DATABASE[manufacturer].forEach(model => {
          const option = document.createElement('option');
          option.value = model;
          option.textContent = model;
          modelSelect.appendChild(option);
        });
      }
    });
    
    // Model change handler - use VEHICLE_ENGINE_DATABASE for year ranges when available
    modelSelect.addEventListener('change', function() {
      const manufacturer = manufacturerSelect.value;
      const model = this.value;
      
      // Clear dependent dropdowns
      yearSelect.innerHTML = '<option value="">Select Year Range</option>';
      engineSelect.innerHTML = '<option value="">Select Engine</option>';
      
      if (manufacturer && model) {
        // Try to find model in VEHICLE_ENGINE_DATABASE for accurate year ranges
        const modelKey = model.toLowerCase().replace(/\s+/g, '-');
        const actualModelKey = findModelInDatabase(manufacturer, modelKey);
        
        if (actualModelKey && VEHICLE_ENGINE_DATABASE[manufacturer] && VEHICLE_ENGINE_DATABASE[manufacturer][actualModelKey]) {
          // Use year ranges from the detailed database
          const yearRanges = Object.keys(VEHICLE_ENGINE_DATABASE[manufacturer][actualModelKey]);
          yearRanges.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
          });
        } else {
          // Fall back to standard year ranges
          PUBLIC_YEAR_RANGES.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
          });
        }
      }
    });
    
    // Year change handler - use VEHICLE_ENGINE_DATABASE for specific engines when available
    yearSelect.addEventListener('change', function() {
      const manufacturer = manufacturerSelect.value;
      const model = modelSelect.value;
      const year = this.value;
      
      // Clear engine dropdown
      engineSelect.innerHTML = '<option value="">Select Engine</option>';
      
      if (manufacturer && model && year) {
        // Try to find model in VEHICLE_ENGINE_DATABASE for accurate engines
        const modelKey = model.toLowerCase().replace(/\s+/g, '-');
        const actualModelKey = findModelInDatabase(manufacturer, modelKey);
        
        let engines = null;
        if (actualModelKey && VEHICLE_ENGINE_DATABASE[manufacturer] && VEHICLE_ENGINE_DATABASE[manufacturer][actualModelKey]) {
          engines = VEHICLE_ENGINE_DATABASE[manufacturer][actualModelKey][year];
        }
        
        // Strict mode: only show year-verified engines
        if (!engines || engines.length === 0) {
          const option = document.createElement('option');
          option.value = '';
          option.textContent = 'No verified engines for selected year';
          engineSelect.appendChild(option);
          engineSelect.disabled = true;
          return;
        }

        engineSelect.disabled = false;

        engines.forEach(engine => {
          const option = document.createElement('option');
          option.value = engine;
          option.textContent = engine;
          engineSelect.appendChild(option);
        });
      }
    });
    
    // Search button handler - parse engine data from string
    searchBtn.addEventListener('click', function() {
      const manufacturer = manufacturerSelect.value;
      const model = modelSelect.value;
      const year = yearSelect.value;
      const engine = engineSelect.value;
      
      if (!manufacturer || !model || !year || !engine) {
        alert('Please select all vehicle details before searching');
        return;
      }
      
      // Parse engine data from string (e.g. "2.0 TDI - 150hp")
      const hpMatch = engine.match(/(\d+)\s*hp/i);
      const stockHP = hpMatch ? parseInt(hpMatch[1]) : 150;
      const isDiesel = /tdi|cdi|hdi|dci|jtd|d-4d|crdi|bluehdi|skyactiv-d|diesel|multijet/i.test(engine);
      const stockTorque = Math.round(stockHP * (isDiesel ? 2.2 : 1.1));
      
      const engineData = {
        power: stockHP,
        torque: stockTorque,
        type: isDiesel ? 'diesel' : 'petrol'
      };
      displayPublicSearchResults(manufacturer, model, year, engine, engineData);
    });
  }
  
  function displayPublicSearchResults(manufacturer, model, year, engine, engineData) {
    const resultsContainer = document.getElementById('public-search-results');
    
    // Calculate stage 1 gains (typical gains)
    const stage1PowerGain = engineData.type === 'diesel' ? 
      Math.round(engineData.power * 0.25) : Math.round(engineData.power * 0.15);
    const stage1TorqueGain = engineData.type === 'diesel' ? 
      Math.round(engineData.torque * 0.25) : Math.round(engineData.torque * 0.20);
    
    const stage1Power = engineData.power + stage1PowerGain;
    const stage1Torque = engineData.torque + stage1TorqueGain;
    
    // ECU data based on manufacturer and engine type
    const getECUData = (manufacturer, engineType, engine) => {
      const ecuMapping = {
        'audi': engineType === 'diesel' ? ['Bosch EDC17C46', 'Bosch EDC17CP14'] : ['Bosch MED17.5.5', 'Simos18.1'],
        'bmw': engineType === 'diesel' ? ['Bosch EDC17CP02', 'Bosch EDC17CP09'] : ['Bosch MSD80', 'Bosch MEVD17.2.2'],
        'mercedes': engineType === 'diesel' ? ['Bosch EDC16CP31', 'Continental SID314'] : ['Bosch ME9.7', 'Continental SIM271DE20'],
        'volkswagen': engineType === 'diesel' ? ['Bosch EDC17U05', 'Bosch EDC17C74'] : ['Bosch MED17.5.25', 'Simos18.6'],
        'ford': engineType === 'diesel' ? ['Bosch EDC17C10', 'Bosch EDC17CP65'] : ['Bosch MED17.0', 'Visteon DCU101'],
        'vauxhall': engineType === 'diesel' ? ['Bosch EDC16C39', 'Delphi DCM3.7'] : ['Bosch ME7.6.2', 'Delco E83'],
        'land-rover': ['Bosch EDC17CP11', 'Denso SH7058'],
        'nissan': ['Hitachi', 'Continental SID305'],
        'toyota': ['Denso 89661', 'Toyota 89070'],
        'peugeot': engineType === 'diesel' ? ['Bosch EDC17C10', 'Continental SID807'] : ['Bosch ME7.4.5', 'Magneti Marelli IAW 6LP'],
        'renault': engineType === 'diesel' ? ['Bosch EDC15C3', 'Continental SID301'] : ['Siemens Fenix 5', 'Bosch ME7.4.4'],
        'citroen': engineType === 'diesel' ? ['Bosch EDC17C10', 'Continental SID807'] : ['Bosch ME7.4.5', 'Magneti Marelli IAW 6LP'],
        'seat': engineType === 'diesel' ? ['Bosch EDC17U05', 'Bosch EDC17C74'] : ['Bosch MED17.5.25', 'Simos18.6'],
        'skoda': engineType === 'diesel' ? ['Bosch EDC17U05', 'Bosch EDC17C74'] : ['Bosch MED17.5.25', 'Simos18.6'],
        'volvo': engineType === 'diesel' ? ['Bosch EDC17CP22', 'Continental SID803A'] : ['Bosch ME9.0', 'Denso SH7058S']
      };
      return ecuMapping[manufacturer] || ['Bosch EDC17', 'Continental SID'];
    };
    
    const ecus = getECUData(manufacturer, engineData.type, engine);
    
    resultsContainer.innerHTML = `
      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 0; overflow: hidden; max-width: 100%; box-sizing: border-box;">
        <!-- Vehicle Header -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 1rem; border-bottom: 1px solid #334155;">
          <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
            <div style="width: 40px; height: 40px; background: #dc2626; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: bold; color: white; flex-shrink: 0;">
              ${manufacturer.charAt(0).toUpperCase()}
            </div>
            <div style="min-width: 0; flex: 1;">
              <h3 style="margin: 0; font-size: 1rem; color: white; word-wrap: break-word;">${manufacturer.charAt(0).toUpperCase() + manufacturer.slice(1)} ${model}</h3>
              <p style="margin: 0.25rem 0 0; color: #94a3b8; font-size: 0.75rem;">${year} • ${engine}</p>
            </div>
          </div>
        </div>
        
        <!-- Engine Specs -->
        <div style="padding: 1rem; background: #0f172a;">
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 1rem;">
            <div>
              <div style="color: #64748b; font-size: 0.7rem; margin-bottom: 0.2rem;">Capacity:</div>
              <div style="color: white; font-weight: 600; font-size: 0.85rem;">${engine.includes('1.0') ? '1.0L' : engine.includes('1.2') ? '1.2L' : engine.includes('1.4') ? '1.4L' : engine.includes('1.5') ? '1.5L' : engine.includes('1.6') ? '1.6L' : engine.includes('1.8') ? '1.8L' : engine.includes('1.9') ? '1.9L' : engine.includes('2.0') ? '2.0L' : engine.includes('2.2') ? '2.2L' : engine.includes('2.5') ? '2.5L' : engine.includes('3.0') ? '3.0L' : 'N/A'}</div>
            </div>
            <div>
              <div style="color: #64748b; font-size: 0.7rem; margin-bottom: 0.2rem;">Cylinders:</div>
              <div style="color: white; font-weight: 600; font-size: 0.85rem;">${engine.includes('3.0') ? '6' : '4'}</div>
            </div>
            <div>
              <div style="color: #64748b; font-size: 0.7rem; margin-bottom: 0.2rem;">Aspiration:</div>
              <div style="color: white; font-weight: 600; background: #3b82f6; padding: 0.2rem 0.5rem; border-radius: 4px; display: inline-block; font-size: 0.75rem;">Turbo</div>
            </div>
            <div>
              <div style="color: #64748b; font-size: 0.7rem; margin-bottom: 0.2rem;">Fuel:</div>
              <div style="color: white; font-weight: 600; background: ${engineData.type === 'diesel' ? '#10b981' : '#ef4444'}; padding: 0.2rem 0.5rem; border-radius: 4px; display: inline-block; font-size: 0.75rem;">${engineData.type.charAt(0).toUpperCase() + engineData.type.slice(1)}</div>
            </div>
          </div>
          
          <!-- Options Available -->
          <div style="border-top: 1px solid #334155; padding-top: 1rem; margin-bottom: 1rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <span style="font-size: 1rem;">⚡</span>
              <span style="color: white; font-weight: 600; font-size: 0.85rem;">Tuning options:</span>
            </div>
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
              <div style="background: transparent; border: 1px solid #22c55e; color: #22c55e; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.65rem; font-weight: 500;">✓ DTC</div>
              <div style="background: transparent; border: 1px solid #22c55e; color: #22c55e; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.65rem; font-weight: 500;">✓ EGR</div>
              <div style="background: transparent; border: 1px solid #22c55e; color: #22c55e; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.65rem; font-weight: 500;">✓ DPF</div>
              <div style="background: transparent; border: 1px solid #22c55e; color: #22c55e; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.65rem; font-weight: 500;">✓ AdBlue</div>
              <div style="background: transparent; border: 1px solid #22c55e; color: #22c55e; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.65rem; font-weight: 500;">✓ Pops</div>
              <div style="background: transparent; border: 1px solid #22c55e; color: #22c55e; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.65rem; font-weight: 500;">✓ Launch</div>
            </div>
          </div>
          
          <!-- Stage 1 Performance -->
          <div style="border-top: 1px solid #334155; padding-top: 1rem;">
            <div style="background: linear-gradient(135deg, #475569 0%, #64748b 100%); border-radius: 10px; padding: 1rem; color: white;">
              <div style="font-size: 0.9rem; font-weight: 700; margin-bottom: 1rem; text-align: center; letter-spacing: 0.5px;">STAGE 1 GAINS</div>
              
              <!-- Power Comparison -->
              <div style="margin-bottom: 1rem;">
                <div style="font-size: 0.75rem; color: #cbd5e1; margin-bottom: 0.5rem; font-weight: 600; letter-spacing: 0.5px; text-align: center;">POWER (HP)</div>
                <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 0.5rem; align-items: center;">
                  <!-- Stock Power -->
                  <div style="text-align: center; padding: 0.5rem; background: rgba(0,0,0,0.2); border-radius: 6px;">
                    <div style="font-size: 0.65rem; color: #94a3b8; margin-bottom: 0.25rem; font-weight: 600; text-transform: uppercase;">Stock</div>
                    <div style="font-size: 1.25rem; font-weight: 700; color: #94a3b8;">${engineData.power}</div>
                    <div style="font-size: 0.6rem; color: #94a3b8;">hp</div>
                  </div>
                  
                  <!-- Arrow -->
                  <div style="color: #22c55e; font-size: 1rem; font-weight: 700;">→</div>
                  
                  <!-- Stage 1 Power -->
                  <div style="text-align: center; padding: 0.5rem; background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 6px;">
                    <div style="font-size: 0.65rem; color: #22c55e; margin-bottom: 0.25rem; font-weight: 600; text-transform: uppercase;">Stage 1</div>
                    <div style="font-size: 1.25rem; font-weight: 700; color: #22c55e;">${stage1Power}</div>
                    <div style="font-size: 0.6rem; color: #22c55e;">hp (+${stage1PowerGain})</div>
                  </div>
                </div>
              </div>
              
              <!-- Torque Comparison -->
              <div>
                <div style="font-size: 0.75rem; color: #cbd5e1; margin-bottom: 0.5rem; font-weight: 600; letter-spacing: 0.5px; text-align: center;">TORQUE (NM)</div>
                <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 0.5rem; align-items: center;">
                  <!-- Stock Torque -->
                  <div style="text-align: center; padding: 0.5rem; background: rgba(0,0,0,0.2); border-radius: 6px;">
                    <div style="font-size: 0.65rem; color: #94a3b8; margin-bottom: 0.25rem; font-weight: 600; text-transform: uppercase;">Stock</div>
                    <div style="font-size: 1.25rem; font-weight: 700; color: #94a3b8;">${engineData.torque}</div>
                    <div style="font-size: 0.6rem; color: #94a3b8;">nm</div>
                  </div>
                  
                  <!-- Arrow -->
                  <div style="color: #22c55e; font-size: 1rem; font-weight: 700;">→</div>
                  
                  <!-- Stage 1 Torque -->
                  <div style="text-align: center; padding: 0.5rem; background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 6px;">
                    <div style="font-size: 0.65rem; color: #22c55e; margin-bottom: 0.25rem; font-weight: 600; text-transform: uppercase;">Stage 1</div>
                    <div style="font-size: 1.25rem; font-weight: 700; color: #22c55e;">${stage1Torque}</div>
                    <div style="font-size: 0.6rem; color: #22c55e;">nm (+${stage1TorqueGain})</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Quote Contact Options -->
        <div style="padding: 1rem; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);">
          <h3 style="text-align: center; color: white; margin: 0 0 0.75rem 0; font-size: 1rem;">🎯 Get a Quote</h3>
          <p style="text-align: center; color: white; opacity: 0.9; margin: 0 0 0.75rem 0; font-size: 0.75rem;">
            Custom options • Professional support
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center;">
            <!-- WhatsApp Button -->
            <button onclick="openQuoteWhatsApp('${manufacturer}', '${model}', '${engine}', '${year}')" class="quote-contact-btn" style="background: #25D366; color: white; font-weight: 600; font-size: 0.75rem; padding: 0.5rem 0.75rem; border-radius: 8px; border: none; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.3); transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 0.4rem; flex: 1; min-width: 90px; max-width: 150px; justify-content: center;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>WhatsApp</span>
            </button>
            
            <!-- Email Button -->
            <button onclick="openQuoteEmail('${manufacturer}', '${model}', '${engine}', '${year}')" class="quote-contact-btn" style="background: #EA4335; color: white; font-weight: 600; font-size: 0.75rem; padding: 0.5rem 0.75rem; border-radius: 8px; border: none; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.3); transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 0.4rem; flex: 1; min-width: 90px; max-width: 150px; justify-content: center;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>Email</span>
            </button>
            
            <!-- SMS Button -->
            <button onclick="openQuoteSMS('${manufacturer}', '${model}', '${engine}', '${year}')" class="quote-contact-btn" style="background: #0088cc; color: white; font-weight: 600; font-size: 0.75rem; padding: 0.5rem 0.75rem; border-radius: 8px; border: none; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.3); transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 0.4rem; flex: 1; min-width: 90px; max-width: 150px; justify-content: center;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>SMS</span>
            </button>
          </div>
        </div>
      </div>
    `;
    
    resultsContainer.style.display = 'block';
  }
  
  // Quote contact functions for public search
  function openQuoteWhatsApp(manufacturer, model, engine, year) {
    const message = `Hi! I'd like a quote for tuning my ${manufacturer} ${model} ${engine} (${year}). I saw the performance gains on your website and I'm interested in Stage 1 tuning. Can you provide pricing and availability?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '447546371963'; // UK format
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  }
  
  function openQuoteEmail(manufacturer, model, engine, year) {
    const subject = `Tuning Quote Request - ${manufacturer} ${model} ${engine} (${year})`;
    const body = `Hi Carnage Remaps,

I'm interested in getting a quote for tuning my vehicle:

Vehicle: ${manufacturer} ${model}
Engine: ${engine}
Year: ${year}

I've seen the Stage 1 performance gains on your website and would like to know:
- Pricing for Stage 1 tune
- Available options (DPF removal, EGR removal, etc.)
- Turnaround time
- Installation options

Please get back to me with a detailed quote.

Best regards`;
    
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    window.open(`mailto:carnageremaps@gmail.com?subject=${encodedSubject}&body=${encodedBody}`, '_blank');
  }
  
  function openQuoteSMS(manufacturer, model, engine, year) {
    const message = `Quote request: ${manufacturer} ${model} ${engine} (${year}) - Stage 1 tune. Please contact me with pricing and availability.`;
    const encodedMessage = encodeURIComponent(message);
    const smsNumber = '447546371963'; // UK format
    window.open(`sms:${smsNumber}?body=${encodedMessage}`, '_blank');
  }

  // File Detail Modal Functions
  let currentFileId = null;

  async function openFileDetailModal(fileId) {
    currentFileId = fileId;
    const modal = document.getElementById('file-detail-modal');
    
    console.log('Opening file detail modal for file ID:', fileId);
    
    try {
      const file = await getFileById(fileId);
      console.log('File data retrieved:', file);
      
      if (!file) {
        alert('File not found');
        return;
      }
      
      // Populate vehicle information
      document.getElementById('fd-make').textContent = file.make || 'N/A';
      document.getElementById('fd-model').textContent = file.model || 'N/A';
      document.getElementById('fd-year').textContent = file.year || 'N/A';
      document.getElementById('fd-engine').textContent = file.engine || 'N/A';
      document.getElementById('fd-registration').textContent = file.registration || 'N/A';
      document.getElementById('fd-transmission').textContent = file.transmission || 'Automatic';
      
      // Populate ECU information
      document.getElementById('fd-ecu').textContent = file.ecu || 'N/A';
      document.getElementById('fd-tcu').textContent = file.tcu || 'N/A';
      document.getElementById('fd-tool').textContent = file.tool || 'Autotuner';
      document.getElementById('fd-filename').textContent = file.name || 'N/A';
      
      // Populate solutions
      const solutionsEl = document.getElementById('fd-solutions');
      if (file.solutions && file.solutions.length > 0) {
        solutionsEl.innerHTML = file.solutions.map(s => 
          `<div class="detail-list-item with-price">${s.name} - £${s.price}</div>`
        ).join('');
      } else {
        solutionsEl.innerHTML = '<div class="detail-list-item">No solutions selected</div>';
      }
      
      // Populate options
      const optionsEl = document.getElementById('fd-options');
      if (file.options && file.options.length > 0) {
        optionsEl.innerHTML = file.options.map(o => 
          o.price ? `<div class="detail-list-item with-price">${o.name} - £${o.price}</div>` :
                   `<div class="detail-list-item">${o.name}</div>`
        ).join('');
      } else {
        optionsEl.innerHTML = '<div class="detail-list-item">No additional options selected</div>';
      }
      
      // Calculate and display pricing
      let total = 0;
      const pricingEl = document.getElementById('fd-pricing');
      let pricingHTML = '';
      
      if (file.solutions) {
        file.solutions.forEach(s => {
          total += s.price || 0;
          pricingHTML += `<div><span>${s.name}</span><span>£${s.price || 0}</span></div>`;
        });
      }
      
      if (file.options) {
        file.options.forEach(o => {
          if (o.price) {
            total += o.price;
            pricingHTML += `<div><span>${o.name}</span><span>£${o.price}</span></div>`;
          }
        });
      }
      
      pricingEl.innerHTML = pricingHTML;
      document.getElementById('fd-total').textContent = `£${total}`;
      
      // Setup download buttons
      document.getElementById('fd-download-original').onclick = () => downloadOriginalFile(fileId);
      
      const modifiedBtn = document.getElementById('fd-download-modified');
      const downloadMessage = document.getElementById('fd-download-message');
      
      if (file.modifiedFile) {
        modifiedBtn.style.display = 'block';
        modifiedBtn.onclick = () => {
          downloadModifiedFile(fileId);
          // Show success message
          if (downloadMessage) {
            downloadMessage.style.display = 'block';
            downloadMessage.style.background = 'rgba(16,185,129,0.1)';
            downloadMessage.style.border = '1px solid rgba(16,185,129,0.3)';
            downloadMessage.style.color = '#10b981';
            downloadMessage.innerHTML = '✓ Your tuned file is downloading! Check your downloads folder.';
            setTimeout(() => {
              downloadMessage.style.display = 'none';
            }, 5000);
          }
        };
      } else {
        modifiedBtn.style.display = 'none';
      }
      
      // Setup support button
      document.getElementById('fd-open-support').onclick = () => {
        // Close file detail modal
        closeFileDetailModal();
        // Switch to support tab
        document.querySelectorAll('.cr-nav a').forEach(link => link.classList.remove('active'));
        document.querySelector('[data-tab="support"]').classList.add('active');
        document.querySelectorAll('.cr-tab').forEach(tab => tab.classList.remove('active'));
        document.getElementById('support-tab').classList.add('active');
        // Pre-fill support form with file info
        const subject = `Support for File: ${file.vehicle || file.name}`;
        const message = `I need help with my file:\n\nFile ID: ${fileId}\nVehicle: ${file.vehicle || 'N/A'}\nUpload Date: ${new Date(file.uploadDate).toLocaleString()}\n\nIssue: `;
        document.getElementById('support-subject').value = subject;
        document.getElementById('support-message').value = message;
        // Scroll to top
        window.scrollTo(0, 0);
      };
      
      document.getElementById('fd-download-invoice').onclick = () => downloadInvoice(fileId);
      
      // Show/hide admin sections
      const sessionData = await CarnageAuth.getCurrentSession();
      if (sessionData && sessionData.session && sessionData.session.role === 'admin') {
        document.body.classList.add('is-admin');
        document.getElementById('fd-admin-upload').style.display = 'block';
        document.getElementById('fd-admin-status').style.display = 'block';
        
        // Set current status
        document.getElementById('fd-status-select').value = file.status || 'queued';
      } else {
        document.body.classList.remove('is-admin');
        document.getElementById('fd-admin-upload').style.display = 'none';
        document.getElementById('fd-admin-status').style.display = 'none';
      }
      
      // Load messages
      loadFileMessages(fileId);
      
      // Show modal
      modal.style.display = 'flex';
      
    } catch (error) {
      console.error('Error loading file details:', error);
      alert('Error loading file details');
    }
  }

  // Make functions globally accessible
  window.openFileDetailModal = openFileDetailModal;
  
  window.closeFileDetailModal = function() {
    const modal = document.getElementById('file-detail-modal');
    if (modal) {
      modal.style.display = 'none';
    }
    currentFileId = null;
  };

  // Close modal when clicking outside
  document.addEventListener('click', (e) => {
    const modal = document.getElementById('file-detail-modal');
    if (modal && e.target === modal) {
      window.closeFileDetailModal();
    }
  });

  // getFileById is now provided by compatibility layer via window.getFileById
  // Removed duplicate IndexedDB version

  function updateFileInDB(fileId, updates) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      const getRequest = objectStore.get(fileId);
      
      getRequest.onsuccess = () => {
        const file = getRequest.result;
        if (file) {
          Object.assign(file, updates);
          const updateRequest = objectStore.put(file);
          updateRequest.onsuccess = () => resolve(file);
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          reject(new Error('File not found'));
        }
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  function downloadOriginalFile(fileId) {
    getFileById(fileId).then(file => {
      if (!file) {
        alert('File not found');
        return;
      }
      
      // Supabase stores file URLs, not blobs
      if (file.originalFile || file.original_file) {
        const fileUrl = file.originalFile || file.original_file;
        const fileName = file.filename || file.name || 'download.bin';
        
        // Create temporary link and trigger download
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = fileName;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        console.log('✅ Downloading original file:', fileName);
      } else if (file.data) {
        // Fallback for old IndexedDB format
        const blob = new Blob([file.data], { type: file.type || 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        alert('File data not available');
      }
    }).catch(error => {
      console.error('Error downloading file:', error);
      alert('Failed to download file');
    });
  }

  function downloadModifiedFile(fileId) {
    getFileById(fileId).then(file => {
      if (!file) {
        alert('File not found');
        return;
      }
      
      // Supabase stores file URLs
      if (file.modifiedFile || file.modified_file) {
        const fileUrl = file.modifiedFile || file.modified_file;
        const fileName = 'tuned_' + (file.filename || file.name || 'download.bin');
        
        // Create temporary link and trigger download
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = fileName;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        console.log('✅ Downloading tuned file:', fileName);
      } else if (file.modifiedFile && file.modifiedFile.data) {
        // Fallback for old IndexedDB format
        const blob = new Blob([file.modifiedFile.data], { type: file.modifiedFile.type || 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.modifiedFile.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        alert('Tuned file not available');
      }
    }).catch(error => {
      console.error('Error downloading tuned file:', error);
      alert('Failed to download tuned file');
    });
  }

  function downloadInvoice(fileId) {
    getFileById(fileId).then(file => {
      if (file) {
        // Generate simple invoice
        let total = 0;
        let items = '';
        
        if (file.solutions) {
          file.solutions.forEach(s => {
            total += s.price || 0;
            items += `${s.name}: £${s.price || 0}\n`;
          });
        }
        
        if (file.options) {
          file.options.forEach(o => {
            if (o.price) {
              total += o.price;
              items += `${o.name}: £${o.price}\n`;
            }
          });
        }
        
        const invoice = `
CARNAGE REMAPS - INVOICE
========================

Vehicle: ${file.make} ${file.model} ${file.year}
Engine: ${file.engine}
Registration: ${file.registration}

SERVICES:
${items}

TOTAL: £${total}

Thank you for choosing Carnage Remaps!
        `;
        
        const blob = new Blob([invoice], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice_${file.registration}_${file.id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    });
  }

  // Admin upload modified file
  function initAdminUpload() {
    const uploadZone = document.getElementById('admin-upload-zone');
    const fileInput = document.getElementById('admin-file-input');
    const fileInfo = document.getElementById('admin-file-info');
    const uploadBtn = document.getElementById('admin-upload-btn');
    let selectedFile = null;
    
    uploadZone.addEventListener('click', () => fileInput.click());
    
    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.classList.add('drag-over');
    });
    
    uploadZone.addEventListener('dragleave', () => {
      uploadZone.classList.remove('drag-over');
    });
    
    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('drag-over');
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleAdminFile(files[0]);
      }
    });
    
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleAdminFile(e.target.files[0]);
      }
    });
    
    function handleAdminFile(file) {
      selectedFile = file;
      fileInfo.style.display = 'block';
      fileInfo.innerHTML = `
        <strong>Selected file:</strong> ${file.name} (${formatFileSize(file.size)})
      `;
      uploadBtn.style.display = 'block';
    }
    
    uploadBtn.addEventListener('click', async () => {
      if (!selectedFile || !currentFileId) return;
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          await updateFileInDB(currentFileId, {
            modifiedFile: {
              name: selectedFile.name,
              data: e.target.result,
              type: selectedFile.type,
              size: selectedFile.size,
              uploadDate: new Date().toISOString()
            },
            status: 'completed'
          });
          
          alert('Modified file uploaded successfully!');
          fileInfo.style.display = 'none';
          uploadBtn.style.display = 'none';
          fileInput.value = '';
          document.getElementById('fd-download-modified').style.display = 'flex';
          document.getElementById('fd-status-select').value = 'completed';
          displayFiles(); // Refresh file list
        } catch (error) {
          console.error('Error uploading modified file:', error);
          alert('Error uploading modified file');
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    });
  }

  // Update file status
  function initStatusControl() {
    document.getElementById('fd-update-status').addEventListener('click', async () => {
      if (!currentFileId) return;
      
      const newStatus = document.getElementById('fd-status-select').value;
      
      try {
        await updateFileInDB(currentFileId, { status: newStatus });
        alert('Status updated successfully!');
        displayFiles(); // Refresh file list
      } catch (error) {
        console.error('Error updating status:', error);
        alert('Error updating status');
      }
    });
  }

  // File messaging system
  async function loadFileMessages(fileId) {
    const messagesContainer = document.getElementById('file-messages');
    const headerEl = document.getElementById('file-messages-header');
    
    try {
      const file = await getFileById(fileId);
      const sessionData = await CarnageAuth.getCurrentSession();
      const isAdmin = sessionData.session.role === 'admin';
      
      if (file && file.messages && file.messages.length > 0) {
        // Update header with count
        if (headerEl) {
          headerEl.innerHTML = `Messages <span style="background:#10b981;color:white;padding:4px 10px;border-radius:12px;font-size:0.875rem;margin-left:8px;">${file.messages.length}</span>`;
        }
        
        messagesContainer.innerHTML = file.messages.map(msg => {
          const isOwnMessage = (isAdmin && msg.sender === 'admin') || (!isAdmin && msg.sender === 'user');
          const senderLabel = isAdmin ? (msg.sender === 'admin' ? 'You' : file.customerName || 'Customer') : (msg.sender === 'user' ? 'You' : 'Support Team');
          
          // Format time nicely
          const msgDate = new Date(msg.timestamp);
          const now = new Date();
          const diffMs = now - msgDate;
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMs / 3600000);
          const diffDays = Math.floor(diffMs / 86400000);
          
          let timeStr;
          if (diffMins < 1) {
            timeStr = 'Just now';
          } else if (diffMins < 60) {
            timeStr = `${diffMins}m ago`;
          } else if (diffHours < 24) {
            timeStr = `${diffHours}h ago`;
          } else if (diffDays < 7) {
            timeStr = `${diffDays}d ago`;
          } else {
            timeStr = msgDate.toLocaleDateString();
          }
          
          return `
            <div class="file-message ${msg.sender}-message">
              <div class="file-message-header">
                <span class="file-message-sender">${escapeHtml(senderLabel)}</span>
                <span class="file-message-time">${timeStr}</span>
              </div>
              <div class="file-message-content">${escapeHtml(msg.content)}</div>
            </div>
          `;
        }).join('');
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      } else {
        // Update header with no count
        if (headerEl) {
          headerEl.textContent = 'Messages';
        }
        
        messagesContainer.innerHTML = `
          <div style="padding: 2rem; text-align: center; color: #9ca3af;">
            <p style="margin:0;font-size:2rem;">💬</p>
            <p style="margin:0.5rem 0 0 0;">No messages yet</p>
            <p style="margin:0.5rem 0 0 0;font-size:0.875rem;opacity:0.7;">Start a conversation about this file</p>
          </div>
        `;
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      messagesContainer.innerHTML = '<p style="text-align:center;color:#dc2626;padding:2rem;">Error loading messages</p>';
    }
  }

  async function initFileMessaging() {
    const sendBtn = document.getElementById('send-file-message');
    const textarea = document.getElementById('file-message-text');
    
    if (!sendBtn || !textarea) return;
    
    // Auto-resize textarea as user types
    textarea.addEventListener('input', () => {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    });
    
    // Send on button click
    sendBtn.addEventListener('click', async () => {
      await sendFileMessage();
    });
    
    // Send on Ctrl+Enter
    textarea.addEventListener('keydown', async (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        await sendFileMessage();
      }
    });
    
    async function sendFileMessage() {
      const content = textarea.value.trim();
      
      if (!content || !currentFileId) return;
      
      try {
        sendBtn.disabled = true;
        textarea.disabled = true;
        sendBtn.innerHTML = '<span style="opacity:0.7">Sending...</span>';
        
        const sessionData = await CarnageAuth.getCurrentSession();
        const file = await getFileById(currentFileId);
        
        if (!file.messages) {
          file.messages = [];
        }
        
        file.messages.push({
          sender: sessionData.session.role === 'admin' ? 'admin' : 'user',
          content: content,
          timestamp: new Date().toISOString()
        });
        
        await updateFileInDB(currentFileId, { messages: file.messages });
        
        textarea.value = '';
        textarea.style.height = 'auto';
        loadFileMessages(currentFileId);
        
        // Refresh file lists to update message counts
        if (sessionData.session.role === 'admin') {
          loadAdminFiles();
        }
        displayFiles();
        
        // Success feedback
        sendBtn.innerHTML = '✓ Sent';
        setTimeout(() => {
          sendBtn.innerHTML = 'Send Message';
        }, 1500);
        
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.');
        sendBtn.innerHTML = 'Send Message';
      } finally {
        sendBtn.disabled = false;
        textarea.disabled = false;
        textarea.focus();
      }
    }
  }

    // Initialize logout
    function initLogout() {
      document.getElementById('logout-btn').addEventListener('click', async () => {
        await CarnageAuth.signOut();
        location.reload();
      });
    }
    
    // ============================================
    // BILLING SYSTEM - All payments via Stripe
    // ============================================
    
    // Stripe Configuration
    // IMPORTANT: All payments go to YOUR Stripe account
    // 
    // BACKEND API REQUIRED:
    // =====================
    // 1. ONE-TIME PAYMENTS (Wallet Top-Ups):
    //    POST /api/create-checkout-session
    //    - Creates Stripe Checkout session for one-time payment
    //    - Returns: { id: session_id }
    //    - Money goes to YOUR Stripe account
    //    - Webhook updates user wallet balance after payment
    //
    // 2. RECURRING SUBSCRIPTIONS (Embed Widget):
    //    POST /api/create-subscription-session
    //    - Creates Stripe Checkout session with subscription mode
    //    - Set up recurring billing (£9.99/month)
    //    - Returns: { id: session_id }
    //    - Webhooks handle: subscription.created, invoice.paid, subscription.deleted
    //    - Activate/deactivate user access based on subscription status
    //
    // 3. STRIPE WEBHOOKS (Essential for production):
    //    POST /api/webhooks/stripe
    //    - checkout.session.completed -> Activate subscription or add credits
    //    - invoice.payment_succeeded -> Renew subscription for another month
    //    - invoice.payment_failed -> Notify user, retry or suspend access
    //    - customer.subscription.deleted -> Deactivate user access
    //
    // 4. CANCEL SUBSCRIPTION:
    //    POST /api/cancel-subscription
    //    - Calls Stripe API: stripe.subscriptions.update(id, { cancel_at_period_end: true })
    //    - User keeps access until period ends
    //
    // NOTE: Running from file:// protocol will fail - use HTTP server
    //
    const STRIPE_ENABLED = true; // Enable Stripe payments
    const STRIPE_PUBLISHABLE_KEY = 'pk_live_51R5Q5XRlB9jtRSJmkKFR9qMlMxHoCUELHbsvg3wNbf4OTevs38IDMHL0orMt3PhtBFVgPdjEfs8VNwhNQeOgcZBt00wxwQYHdo'; // Your Stripe publishable key
    let stripe = null;
    
    // Initialize Stripe with retry mechanism (waits for deferred script to load)
    function initStripe() {
      if (STRIPE_ENABLED && typeof Stripe !== 'undefined') {
        stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
        console.log('✅ Stripe initialized - All payments will go to your account');
        return true;
      }
      return false;
    }
    
    // Try to init immediately
    if (!initStripe()) {
      // If Stripe not loaded yet, wait for it
      console.log('⏳ Waiting for Stripe library to load...');
      let stripeRetries = 0;
      const stripeCheckInterval = setInterval(() => {
        if (initStripe()) {
          clearInterval(stripeCheckInterval);
        } else if (stripeRetries++ > 50) {
          clearInterval(stripeCheckInterval);
          console.warn('⚠️ Stripe not initialized after 5s - Payment system disabled');
        }
      }, 100);
    }
    
    // Helper function to generate unique IDs
    function generateId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }
    
    // Helper function to clear credit cache
    function clearCreditCache() {
      creditDisplayCache = null;
      creditDisplayCacheTime = 0;
      sessionStorage.removeItem('userCredit');
      sessionStorage.removeItem('userCreditTime');
    }
    
    // Update credit display in header
    // Credit display cache
    let creditDisplayCache = null;
    let creditDisplayCacheTime = 0;
    const CREDIT_CACHE_DURATION = 5000; // 5 seconds
    
    async function updateCreditDisplay() {
      try {
        const currentUser = CarnageAuth.getCurrentUser();
        if (!currentUser) return;
        
        // Always fetch fresh data for the logged-in user
        const creditBalance = await CarnageAuth.getUserCredit(currentUser.id);
        console.log('Credit balance fetched for display:', creditBalance);
        
        const creditDisplay = document.getElementById('user-credit-display');
        if (creditDisplay) {
          creditDisplay.textContent = `Credits: £${creditBalance.toFixed(2)}`;
          creditDisplay.style.display = 'inline-flex';
        }
      } catch (error) {
        console.error('Error updating credit display:', error);
      }
    }
    
    // Initialize billing tab
    function initBilling() {
      const billingSection = document.getElementById('billing-tab');
      if (!billingSection) return;
      
      // Update payment method info
      const paymentInfo = document.getElementById('payment-method-info');
      if (paymentInfo) {
        if (STRIPE_ENABLED) {
          paymentInfo.innerHTML = '<strong>💳 Instant Payment:</strong> Credits are added immediately after successful payment via Stripe. All major credit/debit cards accepted.';
          paymentInfo.parentElement.style.background = '#dcfce7';
          paymentInfo.parentElement.style.borderColor = '#22c55e';
          paymentInfo.style.color = '#166534';
        } else {
          paymentInfo.innerHTML = '<strong>💡 How it works:</strong> Top-up requests are submitted for admin approval. Once approved, credits will be added to your account.';
        }
      }
      
      loadCreditBalance();
      loadTransactionHistory();
      loadSubscriptions();
      initTopUpButtons();
      initSubscriptionButtons();
    }
    
    // Load and display credit balance
    async function loadCreditBalance() {
      try {
        // Clear cache to get fresh data
        clearCreditCache();
        
        const creditBalance = await CarnageAuth.getUserCredit();
        console.log('Loading credit balance for billing tab:', creditBalance);
        const balanceDisplay = document.getElementById('credit-balance-display');
        if (balanceDisplay) {
          balanceDisplay.textContent = `£${creditBalance.toFixed(2)}`;
        }
        await updateCreditDisplay(); // Also update header
      } catch (error) {
        console.error('Error loading credit balance:', error);
      }
    }
    
    // Load transaction history
    async function loadTransactionHistory() {
      try {
        const transactions = await CarnageAuth.getTransactionHistory();
        const tbody = document.getElementById('transaction-history-tbody');
        if (!tbody) return;
        
        if (!transactions || transactions.length === 0) {
          tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 2rem; color: #6b7280;">No transactions yet</td></tr>';
          return;
        }
        
        tbody.innerHTML = transactions.map(t => `
          <tr>
            <td>${new Date(t.timestamp).toLocaleString()}</td>
            <td><span class="transaction-type ${t.type}">${t.type}</span></td>
            <td class="${t.amount >= 0 ? 'amount-positive' : 'amount-negative'}">£${Math.abs(t.amount).toFixed(2)}</td>
            <td>${t.description || '-'}</td>
          </tr>
        `).join('');
      } catch (error) {
        console.error('Error loading transaction history:', error);
      }
    }
    
    // Load active subscriptions
    async function loadSubscriptions() {
      try {
        const subscriptions = await CarnageAuth.getActiveSubscriptions();
        const container = document.getElementById('subscriptions-container');
        if (!container) return;
        
        if (!subscriptions || subscriptions.length === 0) {
          container.innerHTML = '<p style="color: #6b7280; text-align: center; padding: 2rem;">No active subscriptions</p>';
          return;
        }
        
        container.innerHTML = subscriptions.map(sub => `
          <div class="subscription-card">
            <div class="subscription-header">
              <h4>${sub.name}</h4>
              <span class="subscription-status ${sub.status}">${sub.status}</span>
            </div>
            <div class="subscription-details">
              <p><strong>Price:</strong> £${sub.price.toFixed(2)}/month</p>
              <p><strong>Next billing:</strong> ${new Date(sub.nextBillingDate).toLocaleDateString()}</p>
              <p><strong>Started:</strong> ${new Date(sub.startDate).toLocaleDateString()}</p>
            </div>
            <button class="btn danger" onclick="cancelSubscription('${sub.id}')">Cancel Subscription</button>
          </div>
        `).join('');
      } catch (error) {
        console.error('Error loading subscriptions:', error);
      }
    }
    
    // Initialize top-up buttons
    function initTopUpButtons() {
      // Quick amount buttons
      const quickAmounts = [10, 20, 50, 100];
      quickAmounts.forEach(amount => {
        const btn = document.getElementById(`topup-${amount}`);
        if (btn) {
          btn.addEventListener('click', () => initiateTopUp(amount));
        }
      });
      
      // Custom amount
      const customBtn = document.getElementById('topup-custom-btn');
      const customInput = document.getElementById('topup-custom-amount');
      if (customBtn && customInput) {
        customBtn.addEventListener('click', () => {
          const amount = parseFloat(customInput.value);
          if (amount && amount >= 1 && amount <= 1000) {
            initiateTopUp(amount);
          } else {
            alert('Please enter an amount between £1 and £1000');
          }
        });
      }
    }
    
    // Initialize subscription buttons
    function initSubscriptionButtons() {
      const subscribeBtn = document.getElementById('subscribe-embed-btn');
      if (subscribeBtn) {
        subscribeBtn.addEventListener('click', async () => {
          const hasActive = await hasActiveEmbedSubscription();
          if (hasActive) {
            alert('You already have an active embed subscription!');
            return;
          }
          await createEmbedSubscription();
        });
      }
    }
    
    // Validation constants
    const MIN_TOPUP = 1;
    const MAX_TOPUP = 5000;
    
    // Initiate Stripe top-up or manual request
    async function initiateTopUp(amount) {
      try {
        // Validate amount
        if (!amount || isNaN(amount) || amount < MIN_TOPUP || amount > MAX_TOPUP) {
          alert(`Amount must be between £${MIN_TOPUP} and £${MAX_TOPUP}`);
          return;
        }
        
        if (STRIPE_ENABLED && stripe) {
          // Stripe integration enabled
          await initiateStripeTopUp(amount);
        } else {
          // Manual approval workflow
          await initiateManualTopUp(amount);
        }
      } catch (error) {
        console.error('Error initiating top-up:', error);
        alert('Error submitting top-up request. Please try again.');
      }
    }
    
    // Initiate Stripe checkout for top-up
    // Money goes to YOUR Stripe account, user's wallet balance updated via webhook
    async function initiateStripeTopUp(amount) {
      try {
        const userId = sessionStorage.getItem('userId');
        const userEmail = sessionStorage.getItem('userEmail');
        const userName = sessionStorage.getItem('userName');
        
        if (!userId || !userEmail) {
          alert('Please log in to continue');
          return;
        }
        
        // Show loading indicator
        const loadingMsg = document.createElement('div');
        loadingMsg.id = 'stripe-loading';
        loadingMsg.textContent = '🔄 Redirecting to secure Stripe checkout...';
        loadingMsg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:30px 40px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.15);z-index:10000;font-size:1.1rem;font-weight:600;color:#1e293b;';
        document.body.appendChild(loadingMsg);
        
        console.log(`💳 Creating Stripe checkout for £${amount} - Payment will go to YOUR account`);

        // Prevent attempts to call backend when page is opened via file:// (CORS / protocol issues)
        if (window.location.protocol === 'file:') {
          // Remove loading indicator
          const existing = document.getElementById('stripe-loading');
          if (existing) existing.remove();
          alert('Cannot reach backend API when running the page from the file system (file://).\n\nPlease serve the site over HTTP (for example run a local server) and try again.\n\nSuggested: run in PowerShell from the project folder:\n   python -m http.server 8000\nor\n   npx http-server .\n');
          return;
        }

        // Create Stripe checkout session via your backend
        // Your backend should:
        // 1. Create a Stripe checkout session for the amount
        // 2. Money goes to YOUR Stripe account
        // 3. On successful payment (webhook), update user's wallet balance in database
        const response = await fetch(`${API_URL}/api/create-checkout-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amount,
            currency: 'gbp',
            userId: userId,
            userEmail: userEmail,
            userName: userName,
            type: 'wallet_topup',
            description: `Wallet Top-Up - £${amount}`,
            successUrl: `${window.location.origin}${window.location.pathname}?payment=success&amount=${amount}&type=topup`,
            cancelUrl: `${window.location.origin}${window.location.pathname}?payment=cancelled`
          })
        });
        
  // Remove loading indicator (safe remove)
  const existing = document.getElementById('stripe-loading');
  if (existing) existing.remove();
        
        if (!response.ok) {
          throw new Error('Failed to create checkout session - Backend API required');
        }
        
        const session = await response.json();
        
        // Redirect to Stripe Checkout (money goes to YOUR account)
        const result = await stripe.redirectToCheckout({
          sessionId: session.sessionId
        });
        
        if (result.error) {
          throw new Error(result.error.message);
        }
        
      } catch (error) {
        const existing = document.getElementById('stripe-loading');
        if (existing) existing.remove();
        console.error('Error initiating Stripe top-up:', error);
        throw error;
      }
    }
    
    // Initiate manual top-up request (admin approval required)
    async function initiateManualTopUp(amount) {
      const userId = sessionStorage.getItem('userId');
      const userEmail = sessionStorage.getItem('userEmail');
      const userName = sessionStorage.getItem('userName');
      
      try {
        // Save to Supabase instead of IndexedDB for persistence
        const { data, error } = await supabase
          .from('top_up_requests')
          .insert({
            user_id: userId,
            email: userEmail,
            user_name: userName,
            amount: amount,
            status: 'pending'
          })
          .select();
        
        if (error) throw new Error(error.message);
        
        // Send admin email notification
        const emailHtml = `<h2>💰 Manual Top-Up Request</h2><p><strong>User:</strong> ${userName} (${userEmail})</p><p><strong>Amount:</strong> £${amount.toFixed(2)}</p><p><strong>Action Required:</strong> Approve or reject in admin panel</p><p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>`;
        
        // Fetch admin email from backend (or use default)
        // For now, we'll create a server endpoint to handle this
        await fetch('/api/notify-topup-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_name: userName,
            user_email: userEmail,
            amount: amount,
            request_id: data[0].id
          })
        }).catch(err => console.warn('Email notification failed:', err));
        
        alert(`✅ Top-up request submitted!\n\n£${amount.toFixed(2)} will be added to your account once approved by an admin.\n\nYou'll receive a notification when processed.`);
        
      } catch (error) {
        console.error('Error submitting top-up request:', error);
        alert('Failed to submit top-up request. Please try again.');
      }
    }
    
    // Handle successful Stripe payment (called from success page or webhook)
    async function handleStripeSuccess(sessionId) {
      try {
        console.log('🔍 Verifying payment session:', sessionId);
        
        // Verify and track payment with backend (this ensures payment is tracked even if webhook fails)
        const response = await fetch(`${API_URL}/api/verify-and-track-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId })
        });
        
        if (!response.ok) {
          // Fallback to legacy verify endpoint
          const legacyResponse = await fetch(`${API_URL}/api/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId })
          });
          
          if (!legacyResponse.ok) {
            throw new Error('Payment verification failed');
          }
          
          const data = await legacyResponse.json();
          clearCreditCache();
          await updateCreditDisplay();
          await loadCreditBalance();
          alert(`✅ Payment successful!\n\n£${data.amount?.toFixed(2) || 'Your top-up'} has been added to your account.`);
          return true;
        }
        
        const data = await response.json();
        console.log('✅ Payment verified:', data);
        
        // Refresh credit display
        clearCreditCache();
        await updateCreditDisplay();
        await loadCreditBalance();
        
        if (data.type === 'topup') {
          alert(`✅ Payment successful!\n\n£${data.amount?.toFixed(2)} has been added to your account.\nNew balance: £${data.newBalance?.toFixed(2) || 'Updated'}`);
        } else if (data.type === 'subscription') {
          alert(`🎉 Subscription activated!\n\nYou now have access to the embed widget.\nAmount: £${data.amount?.toFixed(2)}/month`);
          // Refresh subscription status
          if (typeof initSettings === 'function') {
            await initSettings();
          }
        } else {
          alert(`✅ Payment successful!`);
        }
        
        return true;
      } catch (error) {
        console.error('Error handling Stripe success:', error);
        alert('Payment successful, but there was an error updating your balance. Please contact support if your credit doesn\'t appear.');
        return false;
      }
    }
    
    // Check URL for Stripe success/cancel
    function checkStripeCallback() {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      const success = urlParams.get('success');
      const canceled = urlParams.get('canceled');
      const subscriptionSuccess = urlParams.get('subscription');
      const subscriptionType = urlParams.get('type');
      const paymentSuccess = urlParams.get('payment');
      
      console.log('🔍 Checking Stripe callback params:', { sessionId, success, canceled, subscriptionSuccess, subscriptionType, paymentSuccess });
      
      if (success === 'true' && sessionId) {
        // One-time payment successful (wallet top-up)
        handleStripeSuccess(sessionId);
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (paymentSuccess === 'success' && sessionId) {
        // Payment success with session ID (new format)
        handleStripeSuccess(sessionId);
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (canceled === 'true' || paymentSuccess === 'cancelled') {
        // Payment canceled
        alert('Payment was canceled. Your card has not been charged.');
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (subscriptionSuccess === 'success') {
        // Subscription activated successfully - pass session ID for verification
        handleSubscriptionSuccess(subscriptionType || 'embed', sessionId);
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (subscriptionSuccess === 'cancelled') {
        // Subscription setup cancelled
        alert('Subscription setup was cancelled. You have not been charged.');
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
    
    // Handle successful subscription activation
    async function handleSubscriptionSuccess(subscriptionType, sessionId) {
      try {
        console.log('🔍 Verifying subscription:', subscriptionType, sessionId);
        
        // If we have a session ID, verify with backend first
        if (sessionId) {
          try {
            const response = await fetch(`${API_URL}/api/verify-and-track-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sessionId })
            });
            
            if (response.ok) {
              const data = await response.json();
              console.log('✅ Subscription verified via API:', data);
              
              alert('🎉 Subscription activated successfully!\n\nYou now have access to the embed widget feature.\n\nYour card will be charged £9.99 monthly. You can cancel anytime from the Billing tab.');
              
              // Refresh subscription display
              if (typeof loadSubscriptions === 'function') {
                loadSubscriptions();
              }
              
              // Reload settings to unlock embed section
              if (typeof initSettings === 'function') {
                await initSettings();
              }
              
              return;
            }
          } catch (verifyError) {
            console.warn('API verification failed, falling back to local:', verifyError);
          }
        }
        
        // Fallback: Create local subscription record
        const subscription = {
          id: generateId(),
          userId: sessionStorage.getItem('userId'),
          name: subscriptionType === 'embed' ? 'Embed Widget Access' : 'Premium Subscription',
          price: 9.99,
          status: 'active',
          startDate: new Date().toISOString(),
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          type: subscriptionType,
          paymentMethod: 'stripe_recurring'
        };
        
        // Save subscription
        await CarnageAuth.createSubscription(subscription);
        
        alert('🎉 Subscription activated successfully!\n\nYou now have access to the embed widget feature.\n\nYour card will be charged £9.99 monthly. You can cancel anytime from the Billing tab.');
        
        // Refresh subscription display
        if (typeof loadSubscriptions === 'function') {
          loadSubscriptions();
        }
        
        // Reload settings to unlock embed section
        if (typeof initSettings === 'function') {
          await initSettings();
        }
        
      } catch (error) {
        console.error('Error activating subscription:', error);
        alert('Subscription payment successful, but there was an error activating your access. Please contact support.');
      }
    }
    
    // Create embed subscription via Stripe recurring payment
    async function createEmbedSubscription() {
      try {
        const userId = sessionStorage.getItem('userId');
        const userEmail = sessionStorage.getItem('userEmail');
        const userName = sessionStorage.getItem('userName');
        
        if (!userId || !userEmail) {
          alert('Please log in to continue');
          return;
        }
        
        const subscriptionPrice = 9.99;
        
        const confirmed = confirm(`Start Embed Widget subscription for £${subscriptionPrice.toFixed(2)}/month?\n\n✓ Billed monthly to your card via Stripe\n✓ Automatic recurring payments\n✓ Cancel anytime\n\nYou will be redirected to secure Stripe checkout.`);
        if (!confirmed) return;
        
        // Show loading indicator
        const loadingMsg = document.createElement('div');
        loadingMsg.id = 'stripe-loading';
        loadingMsg.textContent = '🔄 Redirecting to secure Stripe checkout...';
        loadingMsg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:30px 40px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.15);z-index:10000;font-size:1.1rem;font-weight:600;color:#1e293b;';
        document.body.appendChild(loadingMsg);
        
        console.log(`💳 Creating Stripe subscription checkout for £${subscriptionPrice}/month`);
        
        // Prevent attempts to call backend when page is opened via file://
        if (window.location.protocol === 'file:') {
          const existing = document.getElementById('stripe-loading');
          if (existing) existing.remove();
          alert('Cannot reach backend API when running the page from the file system (file://).\n\nPlease serve the site over HTTP (for example run a local server) and try again.\n\nSuggested: run in PowerShell from the project folder:\n   python -m http.server 8000\nor\n   npx http-server .\n');
          return;
        }
        
        // Create Stripe subscription checkout session
        // Your backend should:
        // 1. Create a Stripe subscription (recurring payment)
        // 2. Set up monthly billing at £9.99
        // 3. On successful subscription (webhook), activate user's embed access
        // 4. Handle subscription lifecycle events (payment_failed, subscription_cancelled, etc.)
        const response = await fetch(`${API_URL}/api/create-subscription-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            priceId: 'price_1SPUIFRlB9jtRSJm2AqFTJUC', // Your Stripe Price ID for £9.99/month recurring
            userId: userId,
            userEmail: userEmail,
            userName: userName,
            subscriptionType: 'embed_widget',
            successUrl: `${window.location.origin}${window.location.pathname}?subscription=success&type=embed`,
            cancelUrl: `${window.location.origin}${window.location.pathname}?subscription=cancelled`
          })
        });
        
        // Remove loading indicator
        const existing = document.getElementById('stripe-loading');
        if (existing) existing.remove();
        
        if (!response.ok) {
          throw new Error('Failed to create subscription session - Backend API required');
        }
        
        const session = await response.json();
        
        // Redirect to Stripe Checkout for subscription setup
        if (stripe) {
          const result = await stripe.redirectToCheckout({
            sessionId: session.sessionId
          });
          
          if (result.error) {
            throw new Error(result.error.message);
          }
        } else {
          throw new Error('Stripe not initialized');
        }
        
      } catch (error) {
        const existing = document.getElementById('stripe-loading');
        if (existing) existing.remove();
        console.error('Error creating subscription:', error);
        
        // Offer wallet payment as fallback
        const useWallet = confirm('Stripe checkout unavailable.\n\nWould you like to pay from your wallet balance instead?\n\n💳 Wallet subscription: £9.99/month\n💰 Your current balance: £' + (sessionStorage.getItem('userCredits') || '0') + '\n\n(Wallet subscriptions must be manually renewed monthly)');
        
        if (useWallet) {
          await createWalletSubscription();
        }
      }
    }
    
    // Create subscription using wallet balance
    async function createWalletSubscription() {
      try {
        const userId = sessionStorage.getItem('userId');
        const userEmail = sessionStorage.getItem('userEmail');
        const userName = sessionStorage.getItem('userName');
        const currentCredits = parseFloat(sessionStorage.getItem('userCredits') || '0');
        const subscriptionPrice = 9.99;
        
        if (currentCredits < subscriptionPrice) {
          alert(`Insufficient wallet balance.\n\nRequired: £${subscriptionPrice.toFixed(2)}\nYour balance: £${currentCredits.toFixed(2)}\n\nPlease top up your wallet first.`);
          return;
        }
        
        // Deduct from wallet
        const newBalance = currentCredits - subscriptionPrice;
        await CarnageAuth.updateCredits(parseInt(userId), -subscriptionPrice);
        sessionStorage.setItem('userCredits', newBalance.toString());
        updateCreditDisplay(newBalance);
        
        // Create subscription via wallet API
        const response = await fetch(`${API_URL}/api/wallet-subscription`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userId,
            email: userEmail,
            userName: userName,
            type: 'embed',
            amount: subscriptionPrice,
            periodStart: new Date().toISOString(),
            periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to create wallet subscription');
        }
        
        alert(`✅ Subscription activated!\n\n£${subscriptionPrice.toFixed(2)} deducted from your wallet.\nNew balance: £${newBalance.toFixed(2)}\n\n⚠️ Note: Wallet subscriptions must be manually renewed each month.`);
        
        // Refresh the page to update subscription status
        loadSubscriptions();
        if (typeof initSettings === 'function') {
          await initSettings();
        }
        
      } catch (error) {
        console.error('Error creating wallet subscription:', error);
        alert('Failed to create subscription. Please try again or contact support.');
      }
    }
    
    // Cancel subscription
    async function cancelSubscription(subscriptionId) {
      const confirmed = confirm('⚠️ Cancel Subscription?\n\nAre you sure you want to cancel this subscription?\n\n• Your access will continue until the end of the current billing period\n• Automatic payments will stop\n• You can re-subscribe anytime\n\nNote: For Stripe recurring subscriptions, you should also cancel in your Stripe customer portal to stop billing.');
      if (!confirmed) return;
      
      try {
        // Cancel in local database
        await CarnageAuth.cancelSubscription(subscriptionId);
        
        // In production, you should also:
        // 1. Call your backend API to cancel the Stripe subscription
        // 2. The backend calls Stripe API: stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true })
        // 3. Stripe webhook confirms cancellation and updates your database
        
        // For now, show instructions
        const subscription = await CarnageAuth.getActiveSubscriptions();
        const sub = subscription.find(s => s.id === subscriptionId);
        
        if (sub && sub.paymentMethod === 'stripe_recurring') {
          alert('✓ Subscription marked for cancellation\n\nIMPORTANT: To stop Stripe billing, you also need to:\n\n1. Log into your Stripe Customer Portal\n2. Cancel the subscription there\n\nOr contact support to cancel it for you.\n\n(In production, this would be automated via backend API)');
        } else {
          alert('Subscription cancelled successfully');
        }
        
        loadSubscriptions();
        
        // Reload settings to lock embed section if needed
        if (typeof initSettings === 'function') {
          await initSettings();
        }
        
      } catch (error) {
        console.error('Error cancelling subscription:', error);
        alert('Error cancelling subscription');
      }
    }
    
    // Check if user has active embed subscription
    async function hasActiveEmbedSubscription() {
      try {
        console.log('🔎 hasActiveEmbedSubscription called');
        const subscriptions = await CarnageAuth.getActiveSubscriptions();
        console.log('📋 Raw subscriptions received:', subscriptions);
        // Accept 'embed', 'embed-widget', 'embed_widget', or 'subscription' types for embed access
        const validTypes = ['embed', 'embed-widget', 'embed_widget', 'subscription'];
        const hasValid = subscriptions.some(sub => {
          const typeMatch = validTypes.includes(sub.type) || (sub.type && sub.type.includes('embed'));
          console.log('🔍 Checking subscription:', {
            id: sub.id,
            type: sub.type,
            status: sub.status,
            typeMatch: typeMatch,
            statusActive: sub.status === 'active'
          });
          return typeMatch && sub.status === 'active';
        });
        console.log('✅ Subscription check result:', subscriptions.length, 'found, hasValid:', hasValid);
        return hasValid;
      } catch (error) {
        console.error('❌ Error checking subscription:', error);
        return false;
      }
    }
    
    // Check if user has active VRM subscription
    async function hasActiveVrmSubscription() {
      try {
        console.log('🔎 hasActiveVrmSubscription called');
        const subscriptions = await CarnageAuth.getActiveSubscriptions();
        console.log('📋 Raw subscriptions received:', subscriptions);
        // Accept 'vrm', 'vrm-lookup', 'vrm_lookup' types for VRM access
        const validTypes = ['vrm', 'vrm-lookup', 'vrm_lookup'];
        const hasValid = (subscriptions || []).some(sub => {
          const typeMatch = validTypes.includes(sub.type) || (sub.type && sub.type.includes('vrm'));
          console.log('🔍 Checking VRM subscription:', {
            id: sub.id,
            type: sub.type,
            status: sub.status,
            typeMatch: typeMatch,
            statusActive: sub.status === 'active'
          });
          return typeMatch && sub.status === 'active';
        });
        console.log('✅ VRM Subscription check result:', subscriptions.length, 'found, hasValid:', hasValid);
        if (hasValid) return true;

        const userEmail = sessionStorage.getItem('userEmail');
        if (!userEmail) return false;

        try {
          const resp = await fetch(`${API_URL}/api/check-subscription/${encodeURIComponent(userEmail)}`);
          const data = resp.ok ? await resp.json() : null;
          const subs = data?.subscriptions || [];
          const fallbackValid = subs.some(sub => {
            const typeMatch = validTypes.includes(sub.type) || (sub.type && sub.type.includes('vrm'));
            return typeMatch && sub.status === 'active';
          });
          console.log('✅ VRM Subscription fallback result:', fallbackValid);
          return fallbackValid;
        } catch (fallbackError) {
          console.warn('VRM subscription fallback failed:', fallbackError);
          return false;
        }
      } catch (error) {
        console.error('❌ Error checking VRM subscription:', error);
        return false;
      }
    }
    
    // Create VRM subscription via Stripe recurring payment
    async function createVrmSubscription() {
      try {
        const userId = sessionStorage.getItem('userId');
        const userEmail = sessionStorage.getItem('userEmail');
        const userName = sessionStorage.getItem('userName');
        
        if (!userId || !userEmail) {
          alert('Please log in to continue');
          return;
        }
        
        const subscriptionPrice = 17.99;
        
        const confirmed = confirm(`Start VRM Lookup subscription for £${subscriptionPrice.toFixed(2)}/month?\n\n✓ Billed monthly to your card via Stripe\n✓ Automatic recurring payments\n✓ Cancel anytime\n\nYou will be redirected to secure Stripe checkout.`);
        if (!confirmed) return;
        
        // Show loading indicator
        const loadingMsg = document.createElement('div');
        loadingMsg.id = 'stripe-loading';
        loadingMsg.textContent = '🔄 Redirecting to secure Stripe checkout...';
        loadingMsg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:30px 40px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.15);z-index:10000;font-size:1.1rem;font-weight:600;color:#1e293b;';
        document.body.appendChild(loadingMsg);
        
        console.log(`💳 Creating Stripe subscription checkout for £${subscriptionPrice}/month`);
        
        // Prevent attempts to call backend when page is opened via file://
        if (window.location.protocol === 'file:') {
          const existing = document.getElementById('stripe-loading');
          if (existing) existing.remove();
          alert('Cannot reach backend API when running the page from the file system (file://).\n\nPlease serve the site over HTTP (for example run a local server) and try again.\n\nSuggested: run in PowerShell from the project folder:\n   python -m http.server 8000\nor\n   npx http-server .\n');
          return;
        }
        
        // Create Stripe subscription checkout session
        // Your backend should:
        // 1. Create a Stripe subscription (recurring payment)
        // 2. Set up monthly billing at £17.99
        // 3. On successful subscription (webhook), activate user's VRM access
        // 4. Handle subscription lifecycle events (payment_failed, subscription_cancelled, etc.)
        const response = await fetch(`${API_URL}/api/create-subscription-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            priceId: 'price_1SPUIFRlB9jtRSJm2BqFTJUD', // Your Stripe Price ID for £17.99/month recurring
            userId: userId,
            userEmail: userEmail,
            userName: userName,
            subscriptionType: 'vrm_lookup',
            successUrl: `${window.location.origin}${window.location.pathname}?subscription=success&type=vrm`,
            cancelUrl: `${window.location.origin}${window.location.pathname}?subscription=cancelled`
          })
        });
        
        // Remove loading indicator
        const existing = document.getElementById('stripe-loading');
        if (existing) existing.remove();
        
        if (!response.ok) {
          throw new Error('Failed to create subscription session - Backend API required');
        }
        
        const data = await response.json();
        
        if (data.url) {
          // Redirect to Stripe Checkout
          window.location.href = data.url;
        } else if (data.sessionId && stripe) {
          const result = await stripe.redirectToCheckout({
            sessionId: data.sessionId
          });
          if (result.error) {
            throw new Error(result.error.message);
          }
        } else {
          throw new Error('No checkout URL or session ID returned');
        }
      } catch (error) {
        console.error('❌ Error creating VRM subscription:', error);
        alert(`Error: ${error.message}`);
      }
    }
    
    // Save top-up request to DB
    async function saveTopUpRequest(request) {
      return new Promise((resolve, reject) => {
        const dbRequest = indexedDB.open(FILES_DB_NAME, FILES_DB_VERSION);
        
        dbRequest.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction(['topUpRequests'], 'readwrite');
          const store = transaction.objectStore('topUpRequests');
          
          const addRequest = store.add(request);
          
          addRequest.onsuccess = () => resolve();
          addRequest.onerror = () => reject(addRequest.error);
        };
        
        dbRequest.onerror = () => reject(dbRequest.error);
      });
    }
    
    // Create admin notification
    async function createAdminNotification(notification) {
      return new Promise((resolve, reject) => {
        const dbRequest = indexedDB.open(FILES_DB_NAME, FILES_DB_VERSION);
        
        dbRequest.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction(['adminNotifications'], 'readwrite');
          const store = transaction.objectStore('adminNotifications');
          
          const notif = {
            id: generateId(),
            ...notification,
            timestamp: new Date().toISOString(),
            read: false
          };
          
          const addRequest = store.add(notif);
          
          addRequest.onsuccess = () => resolve();
          addRequest.onerror = () => reject(addRequest.error);
        };
        
        dbRequest.onerror = () => reject(dbRequest.error);
      });
    }
    
    // ============================================
    // END BILLING SYSTEM
    // ============================================
    
    // ============================================
    // USER DETAIL MODAL
    // ============================================
    
    let currentModalUserId = null;
    
    async function openUserDetailModal(userId) {
      console.log('🔍 OPENING USER MODAL - USER ID:', userId);
      
      try {
        // Validate we have the modal element
        const modal = document.getElementById('user-detail-modal');
        if (!modal) {
          console.error('❌ Modal element not found!');
          alert('Error: Modal not found on page');
          return;
        }
        console.log('✅ Modal element found');

        // Get user data
        console.log('📡 Fetching user data...');
        currentModalUserId = userId;
        const user = await CarnageAuth.getUserById(userId);
        console.log('✅ User data received:', user);
        console.log('💰 User credits from DB:', user.credits, 'type:', typeof user.credits);

        if (!user) {
          alert('User not found');
          return;
        }

        // Populate user info
        console.log('📝 Populating modal fields...');
        const idField = document.getElementById('modal-user-id');
        const nameField = document.getElementById('modal-user-name');
        const emailField = document.getElementById('modal-user-email');
        const roleField = document.getElementById('modal-user-role');
        const createdField = document.getElementById('modal-user-created');
        const statusField = document.getElementById('modal-user-status');
        const balanceField = document.getElementById('modal-wallet-balance');

        if (!idField || !nameField || !emailField) {
          console.error('❌ Modal fields not found!');
          alert('Error: Modal fields missing');
          return;
        }

        idField.textContent = user.id;
        nameField.textContent = user.name;
        emailField.textContent = user.email;
        roleField.innerHTML = `
          <span style="background: ${user.role === 'admin' ? '#dc2626' : '#3b82f6'}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 0.875rem; font-weight: 600; text-transform: uppercase;">
            ${user.role}
          </span>
        `;
        createdField.textContent = new Date(user.created_at).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        statusField.innerHTML = `
          <span style="background: ${user.is_active ? '#10b981' : '#6b7280'}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 0.875rem; font-weight: 500;">
            ${user.is_active ? 'Active' : 'Disabled'}
          </span>
        `;

        // Populate wallet - ensure we have fresh data with credits
        const balance = parseFloat(user.credits) || 0;
        console.log('💵 Setting balance to:', balance);
        balanceField.textContent = `£${balance.toFixed(2)}`;

        // Show/hide admin controls
        const currentUser = await CarnageAuth.getCurrentUser();
        const adminControls = document.getElementById('modal-admin-controls');
        if (currentUser && currentUser.role === 'admin') {
          adminControls.style.display = 'block';
          console.log('✅ Admin controls shown');
        } else {
          adminControls.style.display = 'none';
          console.log('ℹ️ Admin controls hidden (not admin)');
        }

        // Load activity
        console.log('📊 Loading user activity...');
        await loadUserActivity(userId);

        // Show modal
        console.log('🎬 Showing modal...');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        console.log('✅ USER MODAL OPENED SUCCESSFULLY');
      } catch (error) {
        console.error('❌ ERROR OPENING MODAL:', error);
        alert('Error loading user details: ' + error.message);
      }
    }
    
    function closeUserDetailModal() {
      document.getElementById('user-detail-modal').style.display = 'none';
      document.body.style.overflow = 'auto';
      currentModalUserId = null;
      document.getElementById('modal-credit-amount').value = '';
    }
    
    async function loadUserActivity(userId) {
      const activityDiv = document.getElementById('modal-user-activity');
      
      try {
        // Get the user's email
        const user = await CarnageAuth.getUserById(userId);
        if (!user) throw new Error('User not found');
        
        console.log('📊 Loading activity for user:', user.email);
        
        // Get user's files by email
        const files = await getAllFiles();
        console.log('📁 Total files in database:', files.length);
        console.log('📋 Sample files:', files.slice(0, 3).map(f => ({ name: f.filename, email: f.customerEmail })));
        
        const userFiles = files.filter(f => f.customerEmail === user.email);
        console.log('🔍 Files matching user email:', userFiles.length);
        
        // Count by status
        const pending = userFiles.filter(f => f.status === 'queued').length;
        const processing = userFiles.filter(f => f.status === 'processing' || f.status === 'in-progress').length;
        const completed = userFiles.filter(f => f.status === 'completed' || f.status === 'returned').length;
        
        activityDiv.innerHTML = `
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1rem;">
            <div style="text-align: center; padding: 1rem; background: rgba(59, 130, 246, 0.1); border-radius: 8px; border: 1px solid rgba(59, 130, 246, 0.3);">
              <div style="font-size: 1.5rem; font-weight: 700; color: #3b82f6;">${pending}</div>
              <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.25rem;">Pending</div>
            </div>
            <div style="text-align: center; padding: 1rem; background: rgba(251, 146, 60, 0.1); border-radius: 8px; border: 1px solid rgba(251, 146, 60, 0.3);">
              <div style="font-size: 1.5rem; font-weight: 700; color: #fb923c;">${processing}</div>
              <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.25rem;">Processing</div>
            </div>
            <div style="text-align: center; padding: 1rem; background: rgba(16, 185, 129, 0.1); border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.3);">
              <div style="font-size: 1.5rem; font-weight: 700; color: #10b981;">${completed}</div>
              <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.25rem;">Completed</div>
            </div>
          </div>
          <div style="padding: 0.75rem; background: rgba(255,255,255,0.03); border-radius: 6px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span style="color: #94a3b8;">Total Files:</span>
              <span style="font-weight: 600;">${userFiles.length}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">Last Upload:</span>
              <span style="font-weight: 600;">${userFiles.length > 0 ? new Date(Math.max(...userFiles.map(f => new Date(f.uploadDate)))).toLocaleDateString() : 'None'}</span>
            </div>
          </div>
        `;
      } catch (error) {
        console.error('Error loading user activity:', error);
        activityDiv.innerHTML = '<div style="color: #dc2626;">Error loading activity</div>';
      }
    }
    
    async function modalAddCredit() {
      const amount = parseFloat(document.getElementById('modal-credit-amount').value);
      
      if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
      }
      
      // Get current user and confirm
      const user = await CarnageAuth.getUserById(currentModalUserId);
      const currentBalance = user.credits || 0;
      const newBalance = currentBalance + amount;
      
      if (!confirm(`Add £${amount.toFixed(2)} to ${user.name}?\n\nCurrent Balance: £${currentBalance.toFixed(2)}\nNew Balance: £${newBalance.toFixed(2)}`)) {
        return;
      }
      
      try {
        console.log('💳 Adding credit:', amount, 'to user:', currentModalUserId);
        await CarnageAuth.updateUserCredit(amount, currentModalUserId);
        console.log('✅ Credit added successfully');
        alert(`£${amount.toFixed(2)} added successfully`);
        
        // Refresh modal data
        console.log('🔄 Refreshing modal data...');
        const updatedUser = await CarnageAuth.getUserById(currentModalUserId);
        console.log('👤 Updated user data:', updatedUser);
        const newBalance = parseFloat(updatedUser.credits) || 0;
        console.log('💰 New balance:', newBalance);
        document.getElementById('modal-wallet-balance').textContent = `£${newBalance.toFixed(2)}`;
        document.getElementById('modal-credit-amount').value = '';
        
        // Refresh user table
        console.log('📋 Refreshing user table...');
        await loadAdminUsers();
        console.log('✅ Modal and table refreshed');
      } catch (error) {
        console.error('❌ Error adding credit:', error);
        alert('Error adding credit: ' + error.message);
      }
    }
    
    async function modalRemoveCredit() {
      const amount = parseFloat(document.getElementById('modal-credit-amount').value);
      
      if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
      }
      
      // Get current user and confirm
      const user = await CarnageAuth.getUserById(currentModalUserId);
      const currentBalance = user.credits || 0;
      const newBalance = currentBalance - amount;
      
      if (!confirm(`⚠️ Remove £${amount.toFixed(2)} from ${user.name}?\n\nCurrent Balance: £${currentBalance.toFixed(2)}\nNew Balance: £${newBalance.toFixed(2)}`)) {
        return;
      }
      
      try {
        await CarnageAuth.updateUserCredit(-amount, currentModalUserId);
        alert(`£${amount.toFixed(2)} removed successfully`);
        
        // Refresh modal data
        const user = await CarnageAuth.getUserById(currentModalUserId);
        document.getElementById('modal-wallet-balance').textContent = `£${(user.credits || 0).toFixed(2)}`;
        document.getElementById('modal-credit-amount').value = '';
        
        // Refresh user table
        await loadAdminUsers();
      } catch (error) {
        console.error('Error removing credit:', error);
        alert('Error removing credit');
      }
    }
    
    async function modalToggleUserStatus() {
      try {
        const user = await CarnageAuth.getUserById(currentModalUserId);
        
        // Prevent deactivating admin accounts
        if (user.role === 'admin' && user.isActive) {
          showToast('Cannot deactivate admin accounts', 'error');
          return;
        }
        
        if (!confirm('Are you sure you want to toggle this user\'s status?')) {
          return;
        }
        
        await CarnageAuth.updateUser(currentModalUserId, { isActive: !user.isActive });
        
        showToast(`User ${user.isActive ? 'disabled' : 'enabled'} successfully`, 'success');
        
        // Refresh modal
        await openUserDetailModal(currentModalUserId);
        loadAdminUsers();
      } catch (error) {
        console.error('Error toggling user status:', error);
        showToast('Error updating user status', 'error');
      }
    }
    
    async function modalDeleteUser() {
      const user = await CarnageAuth.getUserById(currentModalUserId);
      
      // Prevent deleting admin accounts
      if (user.role === 'admin') {
        showToast('Cannot delete admin accounts', 'error');
        return;
      }
      
      if (!confirm(`⚠️ WARNING: Are you sure you want to DELETE ${user.name}'s account?\n\nThis will permanently delete:\n- User account\n- All uploaded files\n- All activity history\n\nThis action CANNOT be undone!`)) {
        return;
      }
      
      if (!confirm('Final confirmation: Type YES in the next prompt to confirm deletion')) {
        return;
      }
      
      const confirmation = prompt('Type YES to confirm account deletion:');
      if (confirmation !== 'YES') {
        showToast('Deletion cancelled', 'info');
        return;
      }
      
      try {
        // Delete all user's files first
        const files = await getAllFiles();
        const userFiles = files.filter(f => f.userId === currentModalUserId);
        for (const file of userFiles) {
          await deleteFile(file.id);
        }
        
        // Delete user
        await CarnageAuth.deleteUser(currentModalUserId);
        
        showToast('User account deleted successfully', 'success');
        closeUserDetailModal();
        loadAdminUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        showToast('Error deleting user account', 'error');
      }
    }
    
    // ============================================
    // END USER DETAIL MODAL
    // ============================================
    
    // Expose functions globally for onclick handlers
    window.viewFileDetails = viewFileDetails;
    window.changeFileStatus = changeFileStatus;
    window.uploadTunedFile = uploadTunedFile;
    window.returnTunedFileToClient = returnTunedFileToClient;
    window.downloadFile = downloadFile;
    window.downloadTunedFile = downloadTunedFile;
    window.deleteFileById = deleteFileById;
    window.cancelSubscription = cancelSubscription;
    window.updateCreditDisplay = updateCreditDisplay;
    window.loadAdminUsers = loadAdminUsers;
    window.openUserDetailModal = openUserDetailModal;
    window.closeUserDetailModal = closeUserDetailModal;
    window.modalAddCredit = modalAddCredit;
    window.modalRemoveCredit = modalRemoveCredit;
    window.modalToggleUserStatus = modalToggleUserStatus;
    window.modalDeleteUser = modalDeleteUser;
    
    // ============================================
    // FILE TYPE SELECTION (ECU vs Transmission)
    // ============================================
    
    // Current selected file type
    let selectedFileType = 'ecu';
    
    // Function to select file type
    function selectFileType(type) {
      console.log('Selecting file type:', type);
      selectedFileType = type;
      
      // Update button states
      const ecuBtn = document.getElementById('file-type-ecu');
      const transBtn = document.getElementById('file-type-transmission');
      
      if (ecuBtn && transBtn) {
        if (type === 'ecu') {
          ecuBtn.classList.add('active');
          transBtn.classList.remove('active');
        } else {
          ecuBtn.classList.remove('active');
          transBtn.classList.add('active');
        }
      }
      
      // Store the selection for upload
      window.currentFileType = type;
      console.log('File type set to:', type);
    }
    
    // Expose function globally
    window.selectFileType = selectFileType;
    window.currentFileType = 'ecu';
    
    // ============================================
    // ECU LOOKUP ENHANCED FUNCTIONS
    // ============================================
    
    // Quick select manufacturer from filter buttons
    function quickSelectManufacturer(manufacturer) {
      console.log('Quick selecting manufacturer:', manufacturer);
      const select = document.getElementById('search-manufacturer');
      if (select) {
        select.value = manufacturer;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Update quick filter button states
        document.querySelectorAll('.quick-filter-btn').forEach(btn => {
          btn.classList.remove('active');
          if (btn.dataset.manufacturer === manufacturer) {
            btn.classList.add('active');
          }
        });
        
        // Update progress steps
        updateSearchProgress(1);
      }
    }
    
    // Reset ECU search form
    function resetECUSearch() {
      console.log('Resetting ECU search');
      const manufacturer = document.getElementById('search-manufacturer');
      const model = document.getElementById('search-model');
      const year = document.getElementById('search-year');
      const engine = document.getElementById('search-engine');
      const results = document.getElementById('search-results');
      const emptyState = document.getElementById('search-empty-state');
      const searchBtn = document.getElementById('search-vehicle-btn');
      
      if (manufacturer) manufacturer.value = '';
      if (model) {
        model.innerHTML = '<option value="">Select Model</option>';
        model.disabled = true;
      }
      if (year) {
        year.innerHTML = '<option value="">Select Year Range</option>';
        year.disabled = true;
      }
      if (engine) {
        engine.innerHTML = '<option value="">Select Engine</option>';
        engine.disabled = true;
      }
      if (results) results.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      if (searchBtn) searchBtn.disabled = true;
      
      // Reset quick filter buttons
      document.querySelectorAll('.quick-filter-btn').forEach(btn => btn.classList.remove('active'));
      
      // Reset progress steps
      updateSearchProgress(0);
    }
    
    // Update search progress indicator
    function updateSearchProgress(step) {
      document.querySelectorAll('.progress-step').forEach((el, index) => {
        el.classList.remove('active', 'completed');
        if (index < step) {
          el.classList.add('completed');
        } else if (index === step) {
          el.classList.add('active');
        }
      });
    }
    
    // Expose ECU lookup functions globally
    window.quickSelectManufacturer = quickSelectManufacturer;
    window.resetECUSearch = resetECUSearch;
    window.updateSearchProgress = updateSearchProgress;
    
    // Clear all ECU Database filters
    function clearECUDatabaseFilters() {
      // Clear search input
      const searchInput = document.getElementById('ecu-search-input');
      if (searchInput) searchInput.value = '';
      
      // Reset all filter dropdowns
      const brandFilter = document.getElementById('ecu-filter-brand');
      const typeFilter = document.getElementById('ecu-filter-type');
      const toolFilter = document.getElementById('ecu-filter-tool');
      const sortBy = document.getElementById('ecu-sort-by');
      
      if (brandFilter) brandFilter.value = '';
      if (typeFilter) typeFilter.value = '';
      if (toolFilter) toolFilter.value = '';
      if (sortBy) sortBy.value = 'model';
      
      // Hide results and show empty state
      const searchResults = document.getElementById('ecu-search-results');
      const resultsSummary = document.getElementById('ecu-results-summary');
      
      if (searchResults) searchResults.style.display = 'none';
      if (resultsSummary) resultsSummary.style.display = 'none';
      
      // Reset compare mode count
      const compareCount = document.getElementById('compare-count');
      if (compareCount) compareCount.textContent = '(0)';
      
      // Show confirmation
      console.log('✅ ECU Database filters cleared');
    }
    window.clearECUDatabaseFilters = clearECUDatabaseFilters;
    
    // ============================================
    // PRICING PAGE FUNCTIONALITY
    // ============================================
    
    // Initialize pricing page functionality
    function initializePricingPage() {
      // Initialize ECU search
      initializeEcuSearch();
    }
    
    // ECU Search functionality with advanced features
    function initializeEcuSearch() {
      const searchInput = document.getElementById('ecu-search-input');
      const searchResults = document.getElementById('ecu-search-results');
      
      if (!searchInput || !searchResults) return;
      
      // Comprehensive ECU Database for search
      const ecuDatabase = [
        // Bosch EDC16 Series (Common Rail Diesel)
        {
          model: "EDC16C31",
          brand: "Bosch",
          type: "Diesel",
          applications: ["Audi A3 2.0 TDI (2003-2008)", "VW Golf 2.0 TDI (2003-2008)", "Seat Leon 2.0 TDI (2005-2009)", "Skoda Octavia 2.0 TDI"],
          features: ["DPF Compatible", "EGR Compatible", "MAP Sensor", "2000+ BAR Injection"],
          tools: ["KESS3: Full Read/Write", "K-TAG: Full Support", "Autotuner: Read Only", "CMD Flash: OBD"],
          power: "140-170 HP",
          notes: "Popular VAG diesel ECU, reliable for Stage 1 tuning"
        },
        {
          model: "EDC16C34",
          brand: "Bosch", 
          type: "Diesel",
          applications: ["BMW 320d E90 (2005-2010)", "BMW 520d E60 (2005-2010)", "BMW X3 2.0d E83", "BMW 123d E87"],
          features: ["DPF Compatible", "EGR Compatible", "AdBlue Ready", "BMW CAN Protocol"],
          tools: ["KESS3: Full Support", "K-TAG: Full Support", "CMD Flash: Full", "Autotuner: Tricore"],
          power: "163-204 HP",
          notes: "BMW common diesel ECU, responds well to tuning with 30-40 HP gains"
        },
        {
          model: "EDC16C39",
          brand: "Bosch",
          type: "Diesel",
          applications: ["Renault Master 2.5 dCi", "Opel Movano 2.5 CDTI", "Nissan Interstar 2.5 dCi"],
          features: ["DPF Compatible", "EGR Compatible", "Commercial Vehicle"],
          tools: ["KESS3: Full", "Autotuner: Full", "K-TAG: Boot Mode"],
          power: "100-150 HP",
          notes: "Commercial vehicle ECU, good for economy and power tuning"
        },
        // Bosch EDC17 Series (Advanced Diesel)
        {
          model: "EDC17C46",
          brand: "Bosch",
          type: "Diesel",
          applications: ["Audi A4 3.0 TDI (2011-2015)", "VW Touareg 3.0 TDI", "Porsche Cayenne 3.0 TDI", "Audi Q7 3.0 TDI"],
          features: ["Advanced DPF", "Variable EGR", "AdBlue SCR", "Piezo Injectors"],
          tools: ["KESS3: Full Support", "Autotuner: Full", "Magic: Read Only", "PCMFlash: Tricore"],
          power: "211-262 HP",
          notes: "Premium V6 diesel ECU with excellent tuning potential (+50-70 HP)"
        },
        {
          model: "EDC17C49",
          brand: "Bosch",
          type: "Diesel",
          applications: ["Mercedes C220 CDI W204", "Mercedes E220 CDI W212", "Mercedes Sprinter 2.1 CDI"],
          features: ["DPF Compatible", "EGR Compatible", "AdBlue SCR", "Mercedes CAN"],
          tools: ["KESS3: Full", "Autotuner: Full", "K-TAG: Full", "CMD Flash: OBD"],
          power: "170-204 HP",
          notes: "Mercedes diesel ECU, reliable tuning with good torque gains"
        },
        {
          model: "EDC17C64",
          brand: "Bosch",
          type: "Diesel",
          applications: ["Ford Ranger 3.2 TDCi", "Ford Transit 2.0 TDCi", "Mazda BT-50 3.2 TDCi"],
          features: ["DPF Compatible", "EGR Compatible", "High-Pressure System"],
          tools: ["KESS3: Full", "CMD Flash: Full", "Magic: OBD", "Autotuner: Full"],
          power: "155-200 HP",
          notes: "Ford commercial diesel, good response to tuning"
        },
        // Bosch MED17 Series (Petrol Turbo)
        {
          model: "MED17.5",
          brand: "Bosch",
          type: "Petrol",
          applications: ["Audi A3 2.0 TFSI", "VW Golf GTI Mk6", "Seat Leon Cupra", "Skoda Octavia RS"],
          features: ["Direct Injection", "Turbo Control", "Lambda Control"],
          tools: ["KESS3: Full", "K-TAG: Full", "PCMFlash: Full", "Autotuner: Full"],
          power: "200-211 HP",
          notes: "Popular VAG turbo petrol, safe for Stage 1 & 2 tuning"
        },
        {
          model: "MED17.5.5",
          brand: "Bosch",
          type: "Petrol",
          applications: ["Audi S3 8P 2.0 TFSI", "VW Golf R Mk6 2.0 TSI", "Seat Cupra R 2.0 TSI"],
          features: ["GPF Compatible", "OPF Ready", "Advanced Knock Control"],
          tools: ["KESS3: Full", "K-TAG: Full", "PCMFlash: Full", "Autotuner: Tricore"],
          power: "265-300 HP",
          notes: "High-performance VAG petrol, 350+ HP achievable with supporting mods"
        },
        {
          model: "MED17.1",
          brand: "Bosch",
          type: "Petrol",
          applications: ["BMW 135i N54", "BMW 335i N54", "BMW Z4 35i", "BMW X6 35i"],
          features: ["Twin Turbo", "Direct Injection", "BMW FlexFuel"],
          tools: ["KESS3: Full", "Autotuner: Full", "K-TAG: Boot Mode", "CMD Flash: OBD"],
          power: "306-326 HP",
          notes: "Legendary N54 engine ECU, massive tuning potential 400+ HP"
        },
        {
          model: "MED17.1.1",
          brand: "Bosch",
          type: "Petrol",
          applications: ["BMW 335i N55", "BMW 535i N55", "BMW X5 35i N55", "BMW M135i"],
          features: ["Single Twin-Scroll Turbo", "Valvetronic", "Direct Injection"],
          tools: ["KESS3: Full", "Autotuner: Full", "CMD Flash: Full", "K-TAG: Full"],
          power: "306-326 HP",
          notes: "N55 engine ECU, reliable 400 HP with bolt-ons"
        },
        // Siemens/Continental Series
        {
          model: "SID301",
          brand: "Siemens/Continental",
          type: "Diesel",
          applications: ["Renault Megane 1.5 dCi", "Nissan Qashqai 1.5 dCi", "Dacia Duster 1.5 dCi", "Renault Scenic 1.5 dCi"],
          features: ["DPF Compatible", "EGR Compatible", "Common Rail"],
          tools: ["KESS3: Full", "Autotuner: Full", "CMD Flash: Read", "K-TAG: Boot"],
          power: "85-110 HP",
          notes: "Popular 1.5 dCi ECU, safe 20-30 HP gains"
        },
        {
          model: "SID803A",
          brand: "Siemens/Continental",
          type: "Diesel",
          applications: ["Peugeot 308 2.0 HDi", "Citroen C4 2.0 HDi", "Ford Focus 2.0 TDCi"],
          features: ["DPF Compatible", "EGR Compatible", "PSA Protocol"],
          tools: ["KESS3: Full", "K-TAG: Read Only", "Magic: Full", "Autotuner: OBD"],
          power: "136-163 HP",
          notes: "PSA group diesel ECU, good tuning response"
        },
        {
          model: "SID807",
          brand: "Siemens/Continental",
          type: "Diesel",
          applications: ["Peugeot 508 2.2 HDi", "Citroen C5 2.2 HDi", "Ford Ranger 2.2 TDCi"],
          features: ["DPF Compatible", "AdBlue Ready", "EGR Compatible"],
          tools: ["KESS3: Full", "Autotuner: Full", "CMD Flash: Full", "Magic: OBD"],
          power: "150-204 HP",
          notes: "Larger PSA diesel, excellent torque gains possible"
        },
        // Magneti Marelli Series
        {
          model: "IAW5SF9",
          brand: "Magneti Marelli",
          type: "Petrol",
          applications: ["Fiat Punto 1.4 T-Jet", "Alfa Romeo MiTo 1.4 TB", "Abarth 500 1.4 T-Jet"],
          features: ["Turbo Control", "Lambda Compatible", "MultiAir"],
          tools: ["KESS3: Full", "Autotuner: Full", "PCMFlash: Read", "K-TAG: Boot"],
          power: "120-180 HP",
          notes: "Fun little turbo ECU, safe Stage 1 gains"
        },
        {
          model: "IAW6F.SF",
          brand: "Magneti Marelli",
          type: "Petrol",
          applications: ["Fiat 500 Abarth 1.4", "Alfa Romeo Giulietta 1.4 TB", "Lancia Delta 1.4 T-Jet"],
          features: ["MultiAir Technology", "Turbo Control", "Sport Mode"],
          tools: ["KESS3: Full", "Autotuner: Full", "K-TAG: Full", "PCMFlash: Full"],
          power: "135-170 HP",
          notes: "Modern FCA turbo ECU with good tuning potential"
        },
        // Delphi/Aptiv Series
        {
          model: "DCM3.5",
          brand: "Delphi/Aptiv",
          type: "Diesel",
          applications: ["Ford Transit 2.2 TDCi", "Ford Ranger 2.2 TDCi", "Mazda 6 2.2 SkyActiv-D"],
          features: ["DPF Compatible", "Euro 5 Compliant", "Common Rail"],
          tools: ["KESS3: Full", "CMD Flash: Full", "Magic: Read", "Autotuner: OBD"],
          power: "125-155 HP",
          notes: "Ford commercial diesel, reliable tuning"
        },
        {
          model: "DCM6.2",
          brand: "Delphi/Aptiv",
          type: "Diesel",
          applications: ["Ford Ranger 3.2 TDCi", "Ford Transit 2.0 EcoBlue", "Ford F-150 3.0 TDCi"],
          features: ["Advanced DPF", "AdBlue SCR", "High-Pressure CR"],
          tools: ["KESS3: Full", "Autotuner: Full", "CMD Flash: Full", "Magic: Full"],
          power: "170-213 HP",
          notes: "Modern Ford diesel with excellent tuning response"
        },
        // Denso Series
        {
          model: "Denso 2760",
          brand: "Denso",
          type: "Diesel",
          applications: ["Toyota Land Cruiser 3.0 D-4D", "Toyota Hilux 3.0 D-4D", "Lexus RX 3.0 D-4D"],
          features: ["D-4D System", "DPF Compatible", "Variable Turbo"],
          tools: ["KESS3: Full", "Autotuner: Full", "K-TAG: Boot", "CMD Flash: OBD"],
          power: "173-190 HP",
          notes: "Toyota diesel ECU, conservative but reliable tuning"
        },
        {
          model: "Denso 89663",
          brand: "Denso",
          type: "Petrol",
          applications: ["Subaru WRX STI", "Subaru Forester XT", "Subaru Legacy GT"],
          features: ["Turbo Control", "AWD System", "Sport Mode"],
          tools: ["KESS3: Full", "K-TAG: Full", "PCMFlash: Full", "Autotuner: Read"],
          power: "265-305 HP",
          notes: "Subaru boxer turbo ECU, 400+ HP achievable"
        },
        // Mitsubishi/Melco
        {
          model: "MH8304F",
          brand: "Mitsubishi",
          type: "Petrol",
          applications: ["Mitsubishi Lancer Evolution X", "Mitsubishi Pajero 3.2 DiD"],
          features: ["Advanced AWD", "Turbo Control", "Launch Control Ready"],
          tools: ["KESS3: Full", "K-TAG: Full", "Autotuner: Boot", "ECUFlash: Full"],
          power: "295-350 HP",
          notes: "Evo X ECU, legendary tuning platform 500+ HP capable"
        },
        // BMW DME Series
        {
          model: "MSS60",
          brand: "Siemens (BMW)",
          type: "Petrol",
          applications: ["BMW M5 E60 V10", "BMW M6 E63 V10"],
          features: ["V10 Engine", "Individual Throttle Bodies", "High-Rev"],
          tools: ["KESS3: Full", "K-TAG: Boot Mode", "Autotuner: Read", "CMD Flash: Limited"],
          power: "507-550 HP",
          notes: "Exotic V10 ECU, limited tuning potential but exhaust mods help"
        },
        {
          model: "MSV80",
          brand: "Siemens (BMW)",
          type: "Petrol",
          applications: ["BMW M3 E90 V8", "BMW M3 E92 V8", "BMW M3 E93 V8"],
          features: ["V8 High-Rev", "Individual Throttle", "M-Mode"],
          tools: ["KESS3: Full", "Autotuner: Full", "K-TAG: Full", "CMD Flash: OBD"],
          power: "420-450 HP",
          notes: "S65 V8 ECU, 450+ HP with full exhaust and tune"
        },
        // Mercedes-Benz ME/MEG Series
        {
          model: "ME9.7",
          brand: "Bosch (Mercedes)",
          type: "Petrol",
          applications: ["Mercedes C63 AMG W204", "Mercedes E63 AMG W212", "Mercedes SLS AMG"],
          features: ["M156/M159 V8", "Performance Mode", "AMG Protocol"],
          tools: ["KESS3: Full", "Autotuner: Full", "CMD Flash: Full", "K-TAG: Boot"],
          power: "457-571 HP",
          notes: "AMG V8 ECU, 600+ HP achievable with bolt-ons"
        },
        // VAG Simos Series
        {
          model: "Simos18.1",
          brand: "Continental (VW)",
          type: "Petrol",
          applications: ["VW Golf GTI Mk7.5", "Audi S3 8V", "Seat Leon Cupra 300", "Skoda Octavia RS"],
          features: ["GPF Compatible", "Latest OBD", "Advanced Knock Control"],
          tools: ["KESS3: Full", "Autotuner: Full", "PCMFlash: Tricore", "Magic: OBD"],
          power: "290-310 HP",
          notes: "Latest VAG turbo ECU, 380+ HP with IS38 turbo"
        },
        {
          model: "Simos18.10",
          brand: "Continental (VW)",
          type: "Petrol",
          applications: ["Audi RS3 8V", "VW Golf R Mk7.5", "Audi TTRS 8S"],
          features: ["5-Cylinder Turbo", "Launch Control", "Quattro System"],
          tools: ["KESS3: Full", "Autotuner: Full", "PCMFlash: Full", "K-TAG: Boot"],
          power: "400-450 HP",
          notes: "RS3/TTRS ECU, 500+ HP achievable with hybrid turbo"
        },
        // ===== EXPANDED ECU DATABASE - 200+ ADDITIONAL ECUs =====
        
        // Bosch EDC15 Series (Older Diesels - 1999-2008)
        {
          model: "EDC15V",
          brand: "Bosch",
          type: "Diesel",
          applications: ["VW Golf 1.9 TDI Mk4", "Audi A3 1.9 TDI", "Seat Leon 1.9 TDI", "Skoda Octavia 1.9 TDI"],
          features: ["Early Common Rail", "EGR Compatible", "Pump-Duse"],
          tools: ["KESS3: Full", "K-TAG: Full", "CMD Flash: OBD", "Galletto: Full"],
          power: "90-130 HP",
          notes: "Classic VAG diesel ECU, legendary tuning platform 170+ HP achievable"
        },
        {
          model: "EDC15P",
          brand: "Bosch",
          type: "Diesel",
          applications: ["VW Passat 1.9 TDI", "Audi A4 1.9 TDI B6", "Skoda Superb 1.9 TDI"],
          features: ["Pump Düse", "EGR System", "Intercooler"],
          tools: ["KESS3: Full", "K-TAG: Full", "Autotuner: Full", "CMD Flash: OBD"],
          power: "100-130 HP",
          notes: "Reliable PD diesel, excellent torque gains 30-40%"
        },
        {
          model: "EDC15P+",
          brand: "Bosch",
          type: "Diesel",
          applications: ["VW Golf 1.9 TDI Mk5", "Audi A3 2.0 TDI 8P", "Seat Altea 2.0 TDI"],
          features: ["Advanced PD", "16V Engine", "Variable Geometry Turbo"],
          tools: ["KESS3: Full", "K-TAG: Full", "Autotuner: Full", "Magic: OBD"],
          power: "140-170 HP",
          notes: "16V PD diesel, 200+ HP with supporting mods"
        },
        {
          model: "EDC15M",
          brand: "Bosch",
          type: "Diesel",
          applications: ["BMW 318d E46", "BMW 320d E46", "BMW 525d E39"],
          features: ["BMW CAN", "DDE System", "Common Rail"],
          tools: ["KESS3: Full", "K-TAG: Boot", "CMD Flash: OBD", "Autotuner: Read"],
          power: "115-163 HP",
          notes: "Early BMW diesel ECU, good tuning response"
        },
        
        // Bosch EDC16 Extended Series
        {
          model: "EDC16U1",
          brand: "Bosch",
          type: "Diesel",
          applications: ["VW Transporter T5 2.5 TDI", "VW Multivan 2.5 TDI", "VW Caravelle 2.5 TDI"],
          features: ["5-Cylinder", "Commercial Grade", "DPF Optional"],
          tools: ["KESS3: Full", "K-TAG: Full", "Autotuner: Full", "CMD Flash: Full"],
          power: "130-174 HP",
          notes: "T5 van ECU, popular for economy and power tuning"
        },
        {
          model: "EDC16U31",
          brand: "Bosch",
          type: "Diesel",
          applications: ["VW Passat 2.0 TDI B6", "Audi A4 2.0 TDI B7", "Seat Exeo 2.0 TDI"],
          features: ["Common Rail", "DPF Compatible", "16V 4-Cylinder"],
          tools: ["KESS3: Full", "K-TAG: Full", "Autotuner: Full", "PCMFlash: Full"],
          power: "140-170 HP",
          notes: "Very popular 2.0 TDI ECU, 210+ HP Stage 2 capable"
        },
        {
          model: "EDC16U34",
          brand: "Bosch",
          type: "Diesel",
          applications: ["Audi A6 3.0 TDI C6", "Audi A8 3.0 TDI", "VW Phaeton 3.0 TDI"],
          features: ["V6 Configuration", "Quattro System", "Advanced DPF"],
          tools: ["KESS3: Full", "K-TAG: Full", "Autotuner: Full", "CMD Flash: OBD"],
          power: "204-233 HP",
          notes: "Premium V6 diesel, 300+ HP achievable"
        },
        {
          model: "EDC16C3",
          brand: "Bosch",
          type: "Diesel",
          applications: ["Renault Laguna 1.9 dCi", "Renault Megane 1.9 dCi", "Renault Scenic 1.9 dCi"],
          features: ["Common Rail", "DPF Compatible", "EGR System"],
          tools: ["KESS3: Full", "K-TAG: Full", "CMD Flash: Full", "Magic: OBD"],
          power: "110-130 HP",
          notes: "Renault diesel ECU, reliable 40 HP gains"
        },
        {
          model: "EDC16C8",
          brand: "Bosch",
          type: "Diesel",
          applications: ["Hyundai Santa Fe 2.2 CRDi", "Kia Sorento 2.5 CRDi", "Hyundai Tucson 2.0 CRDi"],
          features: ["Korean Diesel", "VGT Turbo", "Common Rail"],
          tools: ["KESS3: Full", "Autotuner: Full", "K-TAG: Boot", "CMD Flash: OBD"],
          power: "140-197 HP",
          notes: "Korean diesel ECU, good response to tuning"
        },
        {
          model: "EDC16C35",
          brand: "Bosch",
          type: "Diesel",
          applications: ["Peugeot 407 2.0 HDi", "Citroen C5 2.0 HDi", "Ford Mondeo 2.0 TDCi"],
          features: ["PSA/Ford Shared", "DPF System", "Variable Geometry"],
          tools: ["KESS3: Full", "K-TAG: Full", "Autotuner: Full", "Magic: Full"],
          power: "136-163 HP",
          notes: "Shared PSA/Ford platform, excellent tuning results"
        },
        {
          model: "EDC16CP33",
          brand: "Bosch",
          type: "Diesel",
          applications: ["Mercedes Vito 2.2 CDI", "Mercedes Viano 2.2 CDI", "Mercedes Sprinter 906"],
          features: ["Commercial Vehicle", "AdBlue Ready", "DPF System"],
          tools: ["KESS3: Full", "K-TAG: Full", "Autotuner: Full", "CMD Flash: Full"],
          power: "88-163 HP",
          notes: "Mercedes van ECU, economy and power tuning available"
        },
        
        // Bosch EDC17 Extended Series
        {
          model: "EDC17C10",
          brand: "Bosch",
          type: "Diesel",
          applications: ["Ford Focus 2.0 TDCi", "Ford C-Max 2.0 TDCi", "Ford Mondeo 2.0 TDCi"],
          features: ["Advanced DPF", "EGR Control", "Euro 5"],
          tools: ["KESS3: Full", "Autotuner: Full", "K-TAG: Full", "CMD Flash: Full"],
          power: "115-163 HP",
          notes: "Ford diesel ECU, reliable Stage 1 and 2 tuning"
        },
        {
          model: "EDC17C11",
          brand: "Bosch",
          type: "Diesel",
          applications: ["Land Rover Freelander 2.2 TD4", "Land Rover Discovery Sport 2.2 TD4"],
          features: ["AWD Compatible", "Terrain Response", "DPF System"],
          tools: ["KESS3: Full", "K-TAG: Full", "Autotuner: Full", "CMD Flash: OBD"],
          power: "150-190 HP",
          notes: "Land Rover diesel ECU, good power and economy gains"
        },
        {
          model: "EDC17C41",
          brand: "Bosch",
          type: "Diesel",
          applications: ["Mercedes Sprinter 316 CDI", "Mercedes Vito 116 CDI", "VW Crafter 2.0 TDI"],
          features: ["Commercial Grade", "AdBlue SCR", "High Duty Cycle"],
          tools: ["KESS3: Full", "Autotuner: Full", "K-TAG: Full", "Magic: Full"],
          power: "136-190 HP",
          notes: "Heavy-duty commercial ECU, economy tuning popular"
        },
        {
          model: "EDC17C50",
          brand: "Bosch",
          type: "Diesel",
          applications: ["Mini Cooper D", "Mini One D", "BMW 114d F20"],
          features: ["Compact Diesel", "DPF System", "Start-Stop"],
          tools: ["KESS3: Full", "K-TAG: Full", "Autotuner: Full", "CMD Flash: Full"],
          power: "75-116 HP",
          notes: "Mini/BMW small diesel ECU, safe 30 HP gains"
        },
        {
          model: "EDC17C54",
          brand: "Bosch",
          type: "Diesel",
          applications: ["Audi SQ5 3.0 TDI", "Audi A6 3.0 TDI Bi-Turbo", "Audi A7 3.0 TDI Bi-Turbo"],
          features: ["Bi-Turbo System", "Quattro AWD", "Adaptive Cruise"],
          tools: ["KESS3: Full", "K-TAG: Boot", "Autotuner: Full", "PCMFlash: Full"],
          power: "272-326 HP",
          notes: "High-performance V6 diesel, 400+ HP achievable"
        },
        {
          model: "EDC17C55",
          brand: "Bosch",
          type: "Diesel",
          applications: ["Jaguar XE 2.0 D", "Jaguar XF 2.0 D", "Land Rover Evoque 2.0 D"],
          features: ["Ingenium Engine", "Advanced DPF", "AdBlue SCR"],
          tools: ["KESS3: Full", "Autotuner: Full", "K-TAG: Boot", "CMD Flash: OBD"],
          power: "150-240 HP",
          notes: "JLR Ingenium diesel ECU, excellent tuning potential"
        },
        {
          model: "EDC17C57",
          brand: "Bosch",
          type: "Diesel",
          applications: ["Hyundai i30 1.6 CRDi", "Kia Ceed 1.6 CRDi", "Hyundai Tucson 1.6 CRDi"],
          features: ["SmartStream Diesel", "DPF System", "Mild Hybrid Ready"],
          tools: ["KESS3: Full", "Autotuner: Full", "K-TAG: Full", "CMD Flash: Full"],
          power: "115-136 HP",
          notes: "Korean diesel ECU, good economy and power tuning"
        },
        {
          model: "EDC17C60",
          brand: "Bosch",
          type: "Diesel",
          applications: ["Vauxhall Astra 1.6 CDTi", "Opel Insignia 2.0 CDTi", "Chevrolet Cruze 2.0 D"],
          features: ["GM Diesel Platform", "DPF/EGR", "Start-Stop"],
          tools: ["KESS3: Full", "K-TAG: Full", "Autotuner: Full", "Magic: Full"],
          power: "110-170 HP",
          notes: "GM diesel ECU, reliable tuning with good gains"
        },
        {
          model: "EDC17C69",
          brand: "Bosch",
          type: "Diesel",
          applications: ["Fiat Ducato 2.3 MultiJet", "Peugeot Boxer 2.3 BlueHDi", "Citroen Jumper 2.3 BlueHDi"],
          features: ["Commercial Van", "AdBlue SCR", "Euro 6"],
          tools: ["KESS3: Full", "K-TAG: Full", "Autotuner: Full", "CMD Flash: Full"],
          power: "130-180 HP",
          notes: "Commercial van ECU, economy tuning very popular"
        },
        {
          model: "EDC17C74",
          brand: "Bosch",
          type: "Diesel",
          applications: ["Audi Q7 3.0 TDI 4M", "VW Touareg 3.0 TDI CR", "Porsche Cayenne 3.0 D"],
          features: ["Latest Gen Diesel", "48V Mild Hybrid", "Adaptive Air"],
          tools: ["KESS3: Full", "Autotuner: Full", "K-TAG: Tricore", "PCMFlash: Full"],
          power: "231-286 HP",
          notes: "Premium SUV diesel ECU, 350+ HP achievable"
        },
        
        // Bosch MED17 Extended Series
        {
          model: "MED17.1.6",
          brand: "Bosch",
          type: "Petrol",
          applications: ["Lamborghini Huracan 5.2 V10", "Audi R8 5.2 V10", "Lamborghini Gallardo LP560"],
          features: ["V10 Engine", "Direct Injection", "Launch Control"],
          tools: ["KESS3: Full", "K-TAG: Boot", "Autotuner: Bench", "PCMFlash: Tricore"],
          power: "525-640 HP",
          notes: "Supercar V10 ECU, 700+ HP with supporting mods"
        },
        {
          model: "MED17.1.11",
          brand: "Bosch",
          type: "Petrol",
          applications: ["Porsche 911 3.0 Turbo 991", "Porsche Panamera 4.0 V8", "Porsche Cayenne Turbo"],
          features: ["Twin-Turbo V6/V8", "PASM System", "Sport Chrono"],
          tools: ["KESS3: Full", "K-TAG: Boot", "Autotuner: Full", "CMD Flash: Bench"],
          power: "380-680 HP",
          notes: "Porsche performance ECU, excellent tuning potential"
        },
        {
          model: "MED17.5.21",
          brand: "Bosch",
          type: "Petrol",
          applications: ["VW Golf 1.0 TSI", "Seat Ibiza 1.0 TSI", "Skoda Fabia 1.0 TSI", "Audi A1 1.0 TFSI"],
          features: ["3-Cylinder Turbo", "GPF Compatible", "Start-Stop"],
          tools: ["KESS3: Full", "Autotuner: Full", "K-TAG: Full", "PCMFlash: Full"],
          power: "95-115 HP",
          notes: "Small turbo ECU, 150+ HP achievable with mods"
        },
        {
          model: "MED17.5.25",
          brand: "Bosch",
          type: "Petrol",
          applications: ["VW Golf R Mk7", "Audi S3 8V", "Seat Leon Cupra 290", "Skoda Octavia RS 230"],
          features: ["IS38 Turbo", "Haldex AWD", "Launch Control"],
          tools: ["KESS3: Full", "Autotuner: Full", "K-TAG: Full", "PCMFlash: Full"],
          power: "280-310 HP",
          notes: "Golf R/S3 ECU, 400+ HP with IS38 hybrid turbo"
        },
        {
          model: "MED17.7.3",
          brand: "Bosch",
          type: "Petrol",
          applications: ["Mercedes A45 AMG W177", "Mercedes C43 AMG W205", "Mercedes E63 AMG W213"],
          features: ["AMG Performance", "4MATIC+", "Race Mode"],
          tools: ["KESS3: Full", "K-TAG: Boot", "Autotuner: Full", "CMD Flash: Bench"],
          power: "367-639 HP",
          notes: "AMG performance ECU, exceptional tuning results"
        },
        {
          model: "MED17.8.31",
          brand: "Bosch",
          type: "Petrol",
          applications: ["Jaguar F-Type 3.0 V6", "Jaguar XE 2.0 T", "Land Rover Discovery 3.0 V6"],
          features: ["Supercharged V6", "Ingenium 4-Cyl", "Terrain Response"],
          tools: ["KESS3: Full", "K-TAG: Boot", "Autotuner: Full", "CMD Flash: OBD"],
          power: "200-380 HP",
          notes: "JLR petrol ECU, good tuning potential"
        },
        {
          model: "MED17.8.32",
          brand: "Bosch",
          type: "Petrol",
          applications: ["Jaguar F-Type R 5.0 V8", "Range Rover Sport SVR", "Land Rover Defender V8"],
          features: ["Supercharged V8", "Dynamic Mode", "AWD"],
          tools: ["KESS3: Full", "K-TAG: Boot", "Autotuner: Bench", "CMD Flash: Bench"],
          power: "510-600 HP",
          notes: "JLR supercharged V8 ECU, 700+ HP achievable"
        },
        {
          model: "MED17.9.8",
          brand: "Bosch",
          type: "Petrol",
          applications: ["Hyundai i30N", "Kia Stinger GT", "Genesis G70 3.3T"],
          features: ["Korean Performance", "Launch Control", "N Mode"],
          tools: ["KESS3: Full", "Autotuner: Full", "K-TAG: Full", "CMD Flash: Full"],
          power: "247-370 HP",
          notes: "Korean turbo ECU, excellent tuning response"
        },
        {
          model: "MED17.9.21",
          brand: "Bosch",
          type: "Petrol",
          applications: ["Dacia Sandero 1.0 TCe", "Renault Clio 1.3 TCe", "Nissan Micra 1.0 IG-T"],
          features: ["Alliance Platform", "Turbo 3-Cylinder", "GPF Ready"],
          tools: ["KESS3: Full", "Autotuner: Full", "K-TAG: Full", "CMD Flash: OBD"],
          power: "90-155 HP",
          notes: "Budget turbo ECU, good power gains available"
        },
        
        // Bosch MG1/MD1 Series (Latest Generation)
        {
          model: "MG1CS001",
          brand: "Bosch",
          type: "Petrol",
          applications: ["Mercedes A-Class W177", "Mercedes B-Class W247", "Mercedes GLA H247"],
          features: ["Latest Generation", "48V Hybrid", "MBUX System"],
          tools: ["KESS3: Full", "Autotuner: Full", "K-TAG: Tricore", "PCMFlash: Boot"],
          power: "163-224 HP",
          notes: "Latest Mercedes petrol ECU, requires newer tools"
        },
        {
          model: "MG1CS003",
          brand: "Bosch",
          type: "Petrol",
          applications: ["BMW M3 G80", "BMW M4 G82", "BMW M5 F90", "BMW X3M F97"],
          features: ["S58/S63 Engine", "M Mode", "Competition Package"],
          tools: ["KESS3: Full", "K-TAG: Boot", "Autotuner: Bench", "PCMFlash: Tricore"],
          power: "480-625 HP",
          notes: "BMW M performance ECU, 700+ HP achievable"
        },
        {
          model: "MG1CS011",
          brand: "Bosch",
          type: "Petrol",
          applications: ["Audi RS6 C8", "Audi RS7 C8", "Audi RSQ8", "Lamborghini Urus"],
          features: ["4.0 TFSI V8", "Quattro Sport", "Mild Hybrid"],
          tools: ["KESS3: Full", "K-TAG: Tricore", "Autotuner: Bench", "PCMFlash: Full"],
          power: "600-650 HP",
          notes: "Latest VAG V8 ECU, 800+ HP achievable"
        },
        {
          model: "MG1CS111",
          brand: "Bosch",
          type: "Petrol",
          applications: ["VW Golf 8 GTI", "VW Golf 8 R", "Audi A3 8Y", "Seat Leon Mk4"],
          features: ["EA888 Gen4", "GPF System", "Latest OBD"],
          tools: ["KESS3: Full", "Autotuner: Full", "K-TAG: Tricore", "PCMFlash: Full"],
          power: "245-320 HP",
          notes: "Golf 8 generation ECU, Stage 1 safe tuning"
        },
        {
          model: "MD1CS006",
          brand: "Bosch",
          type: "Diesel",
          applications: ["Ford Transit 2.0 EcoBlue", "Ford Ranger 2.0 EcoBlue", "Ford Focus 2.0 EcoBlue"],
          features: ["Latest Ford Diesel", "AdBlue SCR", "Euro 6d"],
          tools: ["KESS3: Full", "Autotuner: Full", "K-TAG: Tricore", "CMD Flash: Full"],
          power: "130-213 HP",
          notes: "Latest Ford diesel ECU, good tuning response"
        },
        {
          model: "MD1CP004",
          brand: "Bosch",
          type: "Diesel",
          applications: ["VW Golf 8 TDI", "Audi A3 2.0 TDI 8Y", "Skoda Octavia 2.0 TDI Mk4"],
          features: ["EA288 Evo", "Twin Dosing", "Latest DPF"],
          tools: ["KESS3: Full", "Autotuner: Full", "K-TAG: Tricore", "PCMFlash: Full"],
          power: "115-200 HP",
          notes: "Latest VAG diesel ECU, requires newer software"
        },
        
        // Continental Simos Extended Series
        {
          model: "Simos6.3",
          brand: "Continental (VW)",
          type: "Petrol",
          applications: ["VW Golf 1.4 TSI Mk6", "VW Scirocco 1.4 TSI", "Audi A3 1.4 TFSI"],
          features: ["Twincharger Ready", "Start-Stop", "Direct Injection"],
          tools: ["KESS3: Full", "K-TAG: Full", "Autotuner: Full", "CMD Flash: OBD"],
          power: "122-160 HP",
          notes: "Popular 1.4 TSI ECU, 200+ HP with hardware"
        },
        {
          model: "Simos7.1",
          brand: "Continental (VW)",
          type: "Petrol",
          applications: ["VW Golf 1.4 TSI Mk5", "Seat Ibiza FR 1.4 TSI", "Skoda Fabia RS 1.4 TSI"],
          features: ["Early TSI", "Supercharger+Turbo Option", "K03 Turbo"],
          tools: ["KESS3: Full", "K-TAG: Full", "Autotuner: Full", "PCMFlash: Full"],
          power: "122-180 HP",
          notes: "Twincharged option, 250+ HP possible"
        },
        {
          model: "Simos12.1",
          brand: "Continental (VW)",
          type: "Petrol",
          applications: ["VW Golf 1.4 TSI Mk7", "Audi A3 1.4 TFSI 8V", "Seat Leon 1.4 TSI"],
          features: ["EA211 Engine", "ACT Cylinder Deactivation", "Efficient"],
          tools: ["KESS3: Full", "K-TAG: Full", "Autotuner: Full", "PCMFlash: Full"],
          power: "122-150 HP",
          notes: "Efficient small turbo, 200 HP achievable"
        },
        {
          model: "Simos18.6",
          brand: "Continental (VW)",
          type: "Petrol",
          applications: ["VW Golf GTI Mk7.5 Performance", "Audi S3 8V FL", "Cupra Ateca"],
          features: ["EA888 Gen3B", "GPF Compatible", "Latest OBD"],
          tools: ["KESS3: Full", "Autotuner: Full", "K-TAG: Tricore", "PCMFlash: Full"],
          power: "300-310 HP",
          notes: "Latest GTI ECU, 400+ HP with hybrid turbo"
        },
        
        // Delphi Extended Series
        {
          model: "DCM3.2",
          brand: "Delphi/Aptiv",
          type: "Diesel",
          applications: ["Ford Focus 1.6 TDCi", "Ford Fiesta 1.6 TDCi", "Volvo V50 1.6 D"],
          features: ["Common Rail", "DPF Compatible", "Euro 4"],
          tools: ["KESS3: Full", "CMD Flash: Full", "K-TAG: Full", "Autotuner: OBD"],
          power: "90-115 HP",
          notes: "Compact diesel ECU, safe 30 HP gains"
        },
        {
          model: "DCM3.7",
          brand: "Delphi/Aptiv",
          type: "Diesel",
          applications: ["Renault Trafic 1.6 dCi", "Vauxhall Vivaro 1.6 CDTi", "Fiat Talento 1.6 D"],
          features: ["Twin-Turbo Option", "Commercial Van", "AdBlue Ready"],
          tools: ["KESS3: Full", "Autotuner: Full", "CMD Flash: Full", "K-TAG: Boot"],
          power: "95-145 HP",
          notes: "Commercial van ECU, economy tuning popular"
        },
        {
          model: "DCM7.1A",
          brand: "Delphi/Aptiv",
          type: "Diesel",
          applications: ["Chevrolet Captiva 2.2 D", "Holden Captiva 2.2 D", "Opel Antara 2.2 CDTi"],
          features: ["GM Diesel", "AWD System", "DPF/EGR"],
          tools: ["KESS3: Full", "K-TAG: Full", "CMD Flash: Full", "Autotuner: OBD"],
          power: "163-184 HP",
          notes: "GM diesel ECU, good tuning response"
        },
        
        // Siemens/Continental Extended Series
        {
          model: "SID305",
          brand: "Siemens/Continental",
          type: "Diesel",
          applications: ["Renault Megane 2.0 dCi", "Renault Laguna 2.0 dCi", "Nissan Qashqai 2.0 dCi"],
          features: ["M9R Engine", "DPF System", "Common Rail"],
          tools: ["KESS3: Full", "Autotuner: Full", "CMD Flash: Full", "K-TAG: Boot"],
          power: "150-180 HP",
          notes: "Larger Renault/Nissan diesel, 220 HP achievable"
        },
        {
          model: "SID310",
          brand: "Siemens/Continental",
          type: "Diesel",
          applications: ["Renault Clio 0.9 TCe", "Dacia Sandero 0.9 TCe", "Nissan Micra 0.9 TCe"],
          features: ["3-Cylinder Turbo", "Small Displacement", "Efficient"],
          tools: ["KESS3: Full", "Autotuner: Full", "K-TAG: Full", "CMD Flash: OBD"],
          power: "90-110 HP",
          notes: "Small turbo petrol ECU, safe Stage 1"
        },
        {
          model: "EMS3110",
          brand: "Continental (Renault)",
          type: "Petrol",
          applications: ["Renault Clio RS 1.6 TCe", "Renault Megane RS 2.0 TCe", "Alpine A110"],
          features: ["RS Performance", "Launch Control", "Sport Mode"],
          tools: ["KESS3: Full", "Autotuner: Full", "K-TAG: Full", "PCMFlash: Full"],
          power: "200-300 HP",
          notes: "Renaultsport ECU, excellent tuning platform"
        },
        {
          model: "EMS3125",
          brand: "Continental (Renault)",
          type: "Petrol",
          applications: ["Renault Captur 1.3 TCe", "Renault Kadjar 1.3 TCe", "Nissan Qashqai 1.3 DIG-T"],
          features: ["Alliance Platform", "GPF Ready", "Turbo 4-Cylinder"],
          tools: ["KESS3: Full", "Autotuner: Full", "K-TAG: Full", "CMD Flash: Full"],
          power: "130-160 HP",
          notes: "Modern Renault-Nissan petrol ECU"
        },
        {
          model: "EMS3155",
          brand: "Continental (Renault)",
          type: "Petrol",
          applications: ["Renault Megane 1.0 TCe", "Dacia Duster 1.0 TCe", "Renault Captur 1.0 TCe"],
          features: ["Small Turbo", "Start-Stop", "Efficient"],
          tools: ["KESS3: Full", "Autotuner: Full", "K-TAG: Full", "CMD Flash: OBD"],
          power: "90-100 HP",
          notes: "Budget turbo ECU, good gains available"
        },
        {
          model: "EMS3180",
          brand: "Continental (Renault)",
          type: "Petrol",
          applications: ["Mercedes A200", "Mercedes GLA 200", "Renault Megane 1.3 TCe"],
          features: ["Shared Platform", "48V Option", "Latest Gen"],
          tools: ["KESS3: Full", "Autotuner: Full", "K-TAG: Tricore", "PCMFlash: Full"],
          power: "140-163 HP",
          notes: "Mercedes-Renault shared ECU, good tuning"
        },
        
        // Denso Extended Series
        {
          model: "SH72543",
          brand: "Denso",
          type: "Petrol",
          applications: ["Toyota Corolla 1.8 VVT-i", "Toyota Yaris GR", "Lexus UX 250h"],
          features: ["TNGA Platform", "Hybrid Compatible", "D-4S Injection"],
          tools: ["KESS3: Full", "Autotuner: Full", "K-TAG: Boot", "Magic: Read"],
          power: "122-261 HP",
          notes: "Toyota petrol ECU, safe tuning available"
        },
        {
          model: "SH72546",
          brand: "Denso",
          type: "Petrol",
          applications: ["Mazda 3 Skyactiv-G", "Mazda CX-5 2.5", "Mazda 6 2.5 Turbo"],
          features: ["Skyactiv Technology", "High Compression", "SPCCI Option"],
          tools: ["KESS3: Full", "Autotuner: Full", "K-TAG: Boot", "CMD Flash: OBD"],
          power: "120-250 HP",
          notes: "Mazda Skyactiv ECU, conservative but effective tuning"
        },
        {
          model: "SH72531",
          brand: "Denso",
          type: "Petrol",
          applications: ["Subaru WRX FA20", "Subaru Forester XT", "Subaru Levorg 1.6T"],
          features: ["Boxer Engine", "SI-DRIVE", "AWD System"],
          tools: ["KESS3: Full", "K-TAG: Full", "Autotuner: Bench", "ECUFlash: Full"],
          power: "170-268 HP",
          notes: "Subaru boxer ECU, 350+ HP achievable"
        },
        
        // Magneti Marelli Extended Series
        {
          model: "IAW5AF.M3",
          brand: "Magneti Marelli",
          type: "Petrol",
          applications: ["Fiat Panda 1.2", "Fiat Punto 1.2", "Lancia Ypsilon 1.2"],
          features: ["Fire Engine", "Small City Car", "Efficient"],
          tools: ["KESS3: Full", "K-TAG: Full", "Autotuner: OBD", "CMD Flash: OBD"],
          power: "65-69 HP",
          notes: "Small Fiat ECU, limited tuning but economy possible"
        },
        {
          model: "IAW5SF8",
          brand: "Magneti Marelli",
          type: "Petrol",
          applications: ["Fiat Bravo 1.4 T-Jet", "Alfa Romeo MiTo 1.4 TB QV", "Lancia Delta 1.4 TB"],
          features: ["T-Jet Turbo", "DNA System", "Sport Mode"],
          tools: ["KESS3: Full", "K-TAG: Full", "Autotuner: Full", "PCMFlash: Full"],
          power: "120-155 HP",
          notes: "Italian turbo ECU, 200+ HP achievable"
        },
        {
          model: "MJD8F3",
          brand: "Magneti Marelli",
          type: "Diesel",
          applications: ["Fiat 500X 1.3 MultiJet", "Jeep Renegade 1.6 MultiJet", "Fiat Tipo 1.3 MultiJet"],
          features: ["MultiJet II", "Start-Stop", "DPF System"],
          tools: ["KESS3: Full", "K-TAG: Full", "Autotuner: Full", "CMD Flash: Full"],
          power: "95-120 HP",
          notes: "Fiat/Jeep diesel ECU, good economy tuning"
        },
        
        // Hitachi Extended Series
        {
          model: "MEC51-202",
          brand: "Hitachi (Nissan)",
          type: "Petrol",
          applications: ["Nissan Juke 1.6 DIG-T", "Nissan Pulsar 1.6 DIG-T", "Nissan Qashqai 1.6 DIG-T"],
          features: ["Direct Injection Turbo", "CVT Compatible", "NISMO Option"],
          tools: ["KESS3: Full", "Autotuner: Full", "K-TAG: Boot", "CMD Flash: OBD"],
          power: "115-218 HP",
          notes: "Nissan turbo ECU, 250+ HP achievable"
        },
        {
          model: "MEC51-600",
          brand: "Hitachi (Nissan)",
          type: "Petrol",
          applications: ["Nissan 370Z", "Nissan GT-R R35", "Infiniti Q60 3.0T"],
          features: ["VR30/VR38 Engine", "AWD System", "Launch Control"],
          tools: ["KESS3: Full", "K-TAG: Boot", "Autotuner: Bench", "ECUTek: Full"],
          power: "300-600 HP",
          notes: "Nissan performance ECU, legendary GT-R platform"
        },
        
        // BMW DDE Series (Diesel)
        {
          model: "DDE6.3",
          brand: "Bosch (BMW)",
          type: "Diesel",
          applications: ["BMW 520d F10", "BMW 320d F30", "BMW X3 20d F25"],
          features: ["B47/N47 Engine", "AdBlue SCR", "Efficient Dynamics"],
          tools: ["KESS3: Full", "K-TAG: Full", "Autotuner: Full", "CMD Flash: OBD"],
          power: "163-190 HP",
          notes: "BMW diesel ECU, safe 40-50 HP gains"
        },
        {
          model: "DDE8.0",
          brand: "Bosch (BMW)",
          type: "Diesel",
          applications: ["BMW 530d G30", "BMW X5 30d G05", "BMW X6 30d G06"],
          features: ["B57 6-Cylinder", "Mild Hybrid", "Latest Tech"],
          tools: ["KESS3: Full", "K-TAG: Boot", "Autotuner: Bench", "PCMFlash: Tricore"],
          power: "265-286 HP",
          notes: "Latest BMW diesel ECU, 350+ HP achievable"
        },
        
        // BMW DME Series (Petrol)
        {
          model: "MEVD17.2",
          brand: "Bosch (BMW)",
          type: "Petrol",
          applications: ["BMW 116i F20", "BMW 316i F30", "BMW X1 18i F48"],
          features: ["B38 3-Cylinder Turbo", "Efficient", "Start-Stop"],
          tools: ["KESS3: Full", "K-TAG: Full", "Autotuner: Full", "CMD Flash: OBD"],
          power: "109-136 HP",
          notes: "Small BMW turbo ECU, 180+ HP achievable"
        },
        {
          model: "MEVD17.2.9",
          brand: "Bosch (BMW)",
          type: "Petrol",
          applications: ["Mini Cooper S F56", "BMW 220i F22", "BMW X2 20i F39"],
          features: ["B48 Engine", "Sport Mode", "JCW Option"],
          tools: ["KESS3: Full", "K-TAG: Full", "Autotuner: Full", "PCMFlash: Full"],
          power: "192-231 HP",
          notes: "Mini/BMW 4-cyl turbo ECU, 300+ HP achievable"
        },
        {
          model: "MG1CS201",
          brand: "Bosch (BMW)",
          type: "Petrol",
          applications: ["BMW M340i G20", "BMW M440i G22", "BMW X3 M40i G01"],
          features: ["B58 Engine", "M Performance", "Launch Control"],
          tools: ["KESS3: Full", "K-TAG: Tricore", "Autotuner: Bench", "PCMFlash: Full"],
          power: "374-387 HP",
          notes: "BMW M Performance 6-cyl ECU, 500+ HP achievable"
        },
        
        // Mercedes ME/MEG Extended Series
        {
          model: "ME17.7.1",
          brand: "Bosch (Mercedes)",
          type: "Petrol",
          applications: ["Mercedes C180 W204", "Mercedes E200 W212", "Mercedes GLK 200"],
          features: ["M271 Engine", "CGI Technology", "BlueEFFICIENCY"],
          tools: ["KESS3: Full", "K-TAG: Full", "Autotuner: Full", "CMD Flash: OBD"],
          power: "156-184 HP",
          notes: "Mercedes petrol ECU, safe tuning available"
        },
        {
          model: "ME17.7.5",
          brand: "Bosch (Mercedes)",
          type: "Petrol",
          applications: ["Mercedes A180 W176", "Mercedes CLA 200 C117", "Mercedes GLA 180 X156"],
          features: ["M270 Engine", "Direct Injection", "Eco Mode"],
          tools: ["KESS3: Full", "K-TAG: Full", "Autotuner: Full", "PCMFlash: Full"],
          power: "122-156 HP",
          notes: "Compact Mercedes ECU, 200+ HP achievable"
        },
        {
          model: "MED40.2",
          brand: "Bosch (Mercedes)",
          type: "Petrol",
          applications: ["Mercedes A35 AMG W177", "Mercedes CLA 35 AMG C118", "Mercedes GLA 35 AMG H247"],
          features: ["M260 AMG", "4MATIC", "AMG Performance"],
          tools: ["KESS3: Full", "K-TAG: Boot", "Autotuner: Full", "PCMFlash: Tricore"],
          power: "306 HP",
          notes: "Entry AMG ECU, 400+ HP achievable"
        },
        
        // PSA Group Extended (Peugeot/Citroen/DS/Opel)
        {
          model: "SID208",
          brand: "Continental (PSA)",
          type: "Diesel",
          applications: ["Peugeot 3008 1.5 BlueHDi", "Citroen C5 Aircross 1.5 BlueHDi", "Opel Grandland 1.5 D"],
          features: ["DV5 Engine", "AdBlue SCR", "Euro 6d"],
          tools: ["KESS3: Full", "K-TAG: Full", "Autotuner: Full", "CMD Flash: Full"],
          power: "130 HP",
          notes: "Modern PSA diesel ECU, good economy tuning"
        },
        {
          model: "VD56.1",
          brand: "Visteon/Delphi (PSA)",
          type: "Petrol",
          applications: ["Peugeot 308 1.2 PureTech", "Citroen C3 1.2 PureTech", "DS 3 1.2 PureTech"],
          features: ["EB2 3-Cylinder Turbo", "GPF Compatible", "Efficient"],
          tools: ["KESS3: Full", "K-TAG: Full", "Autotuner: Full", "CMD Flash: Full"],
          power: "110-155 HP",
          notes: "PureTech turbo ECU, 180+ HP achievable"
        },
        
        // Honda PGM-FI Series
        {
          model: "PGM-FI J37",
          brand: "Honda/Keihin",
          type: "Petrol",
          applications: ["Honda Civic Type R FK8", "Honda Civic 1.5 VTEC Turbo", "Honda CR-V 1.5 VTEC"],
          features: ["VTEC Turbo", "Rev Match", "+R Mode"],
          tools: ["KESS3: Full", "K-TAG: Full", "Autotuner: Boot", "FlashPro: Full"],
          power: "182-320 HP",
          notes: "Type R ECU, 400+ HP with bolt-ons"
        },
        {
          model: "PGM-FI K20",
          brand: "Honda/Keihin",
          type: "Petrol",
          applications: ["Honda Civic Type R EP3/FN2", "Honda S2000 AP1/AP2", "Honda Integra Type R DC5"],
          features: ["i-VTEC", "High Rev", "Sport Exhaust"],
          tools: ["KESS3: Full", "K-TAG: Full", "Hondata: Full", "FlashPro: Full"],
          power: "200-240 HP",
          notes: "Legendary VTEC ECU, NA tuning specialist"
        },
        
        // Volvo Denso/Bosch Series
        {
          model: "ME9.0 Volvo",
          brand: "Bosch (Volvo)",
          type: "Petrol",
          applications: ["Volvo S60 T5", "Volvo V60 T5", "Volvo XC60 T6"],
          features: ["Drive-E Engine", "Supercharger+Turbo", "Polestar Option"],
          tools: ["KESS3: Full", "K-TAG: Full", "Autotuner: Full", "CMD Flash: Full"],
          power: "245-367 HP",
          notes: "Volvo Drive-E ECU, excellent tuning platform"
        },
        
        // Alfa Romeo/Fiat/Jeep Expanded
        {
          model: "MJD9DF",
          brand: "Magneti Marelli (Stellantis)",
          type: "Diesel",
          applications: ["Alfa Romeo Giulia 2.2 D", "Alfa Romeo Stelvio 2.2 D", "Jeep Compass 2.0 MultiJet"],
          features: ["Latest MultiJet", "Q4 AWD", "AdBlue SCR"],
          tools: ["KESS3: Full", "K-TAG: Full", "Autotuner: Full", "CMD Flash: Full"],
          power: "136-210 HP",
          notes: "Stellantis diesel ECU, good tuning response"
        },
        {
          model: "ME17.3.0 Alfa",
          brand: "Bosch (Alfa Romeo)",
          type: "Petrol",
          applications: ["Alfa Romeo Giulia Quadrifoglio", "Alfa Romeo Stelvio QV", "Alfa Romeo 4C"],
          features: ["2.9 V6 Biturbo", "Alfa DNA Pro", "Carbon Ceramic Brakes"],
          tools: ["KESS3: Full", "K-TAG: Boot", "Autotuner: Bench", "CMD Flash: Bench"],
          power: "237-510 HP",
          notes: "Alfa performance ECU, 600+ HP achievable"
        },
        
        // Electric Vehicle Controllers
        {
          model: "BMS/VCU Tesla",
          brand: "Tesla Custom",
          type: "Electric",
          applications: ["Tesla Model 3", "Tesla Model Y", "Tesla Model S", "Tesla Model X"],
          features: ["Dual Motor", "Ludicrous Mode", "Performance Pack"],
          tools: ["KESS3: Read Only", "Ingenext: Full", "Unplugged: Full"],
          power: "283-1020 HP",
          notes: "Tesla EV controller, power delivery tuning available"
        },
        {
          model: "E-Motor BMW",
          brand: "BMW (Electric)",
          type: "Electric",
          applications: ["BMW i3", "BMW i4", "BMW iX", "BMW iX3"],
          features: ["Single/Dual Motor", "xDrive Electric", "Sport Boost"],
          tools: ["KESS3: Read Only", "Autotuner: Limited"],
          power: "170-619 HP",
          notes: "BMW EV controller, limited tuning available"
        },
        
        // Exotic/Performance Extended
        {
          model: "MED17.1.62 Bentley",
          brand: "Bosch (Bentley)",
          type: "Petrol",
          applications: ["Bentley Continental GT V8", "Bentley Bentayga V8", "Bentley Flying Spur V8"],
          features: ["4.0 V8 Twin-Turbo", "Luxury Performance", "AWD"],
          tools: ["KESS3: Full", "K-TAG: Boot", "Autotuner: Bench"],
          power: "507-550 HP",
          notes: "Bentley V8 ECU, 650+ HP achievable"
        },
        {
          model: "ME7.1.1 W12",
          brand: "Bosch (Bentley)",
          type: "Petrol",
          applications: ["Bentley Continental GT W12", "Bentley Flying Spur W12", "Bentley Bentayga W12"],
          features: ["6.0 W12 Twin-Turbo", "Speed Record", "All-Weather"],
          tools: ["KESS3: Full", "K-TAG: Boot", "Autotuner: Bench"],
          power: "600-660 HP",
          notes: "Bentley W12 ECU, 800+ HP achievable"
        },
        {
          model: "ME7.8.1 Porsche",
          brand: "Bosch (Porsche)",
          type: "Petrol",
          applications: ["Porsche 997 Turbo", "Porsche 997 GT2", "Porsche Cayenne Turbo 955"],
          features: ["Classic 911 Turbo", "VTG Turbo", "PASM"],
          tools: ["KESS3: Full", "K-TAG: Boot", "Autotuner: Full"],
          power: "480-530 HP",
          notes: "Classic 997 Turbo ECU, 600+ HP achievable"
        },
        {
          model: "SDI6 Maserati",
          brand: "Bosch (Maserati)",
          type: "Petrol",
          applications: ["Maserati Ghibli 3.0 V6", "Maserati Quattroporte 3.0 V6", "Maserati Levante 3.0 V6"],
          features: ["Ferrari-derived V6", "Twin-Turbo", "GranSport Mode"],
          tools: ["KESS3: Full", "K-TAG: Boot", "Autotuner: Bench"],
          power: "330-430 HP",
          notes: "Maserati V6 ECU, 500+ HP achievable"
        },
        {
          model: "ME7.3.H4 Ferrari",
          brand: "Bosch (Ferrari)",
          type: "Petrol",
          applications: ["Ferrari 488 GTB", "Ferrari F8 Tributo", "Ferrari Roma"],
          features: ["3.9 V8 Turbo", "Side-Slip Control", "Manettino"],
          tools: ["KESS3: Boot Only", "K-TAG: Bench", "Autotuner: Bench"],
          power: "670-720 HP",
          notes: "Ferrari V8 ECU, 800+ HP with supporting mods"
        },
        {
          model: "MED17.3.0 Lambo",
          brand: "Bosch (Lamborghini)",
          type: "Petrol",
          applications: ["Lamborghini Huracan", "Lamborghini Aventador", "Lamborghini Urus"],
          features: ["V10/V12/V8 Options", "AWD", "Corsa Mode"],
          tools: ["KESS3: Boot Only", "K-TAG: Bench", "Autotuner: Bench"],
          power: "610-770 HP",
          notes: "Lamborghini ECU, significant gains possible"
        },
        {
          model: "MED17.8.1 McLaren",
          brand: "Bosch (McLaren)",
          type: "Petrol",
          applications: ["McLaren 570S", "McLaren 720S", "McLaren 765LT"],
          features: ["M838T/M840T Engine", "Proactive Chassis", "Race Mode"],
          tools: ["KESS3: Boot Only", "K-TAG: Bench", "Autotuner: Bench"],
          power: "570-765 HP",
          notes: "McLaren ECU, 900+ HP achievable with mods"
        },
        {
          model: "ME9.7 AMG V8",
          brand: "Bosch (Mercedes)",
          type: "Petrol",
          applications: ["Mercedes C63 AMG W204", "Mercedes E63 AMG W212", "Mercedes ML63 AMG W166"],
          features: ["M156/M157 V8", "AMG Speedshift", "Performance Pack"],
          tools: ["KESS3: Full", "K-TAG: Boot", "Autotuner: Full", "CMD Flash: Full"],
          power: "457-585 HP",
          notes: "Classic AMG V8 ECU, 650+ HP achievable"
        },
        {
          model: "MED17.7.1 AMG V8TT",
          brand: "Bosch (Mercedes)",
          type: "Petrol",
          applications: ["Mercedes C63 AMG W205", "Mercedes E63 AMG W213", "Mercedes GT AMG R190"],
          features: ["M177/M178 V8 Biturbo", "AMG Track Pace", "9G-Tronic"],
          tools: ["KESS3: Full", "K-TAG: Boot", "Autotuner: Bench", "CMD Flash: Bench"],
          power: "476-730 HP",
          notes: "AMG V8 Biturbo ECU, 800+ HP achievable"
        }
      ];
      
      // Update ECU Statistics dynamically
      function updateEcuStats() {
        const totalEcus = ecuDatabase.length;
        const dieselCount = ecuDatabase.filter(e => e.type === 'Diesel').length;
        const petrolCount = ecuDatabase.filter(e => e.type === 'Petrol').length;
        const electricCount = ecuDatabase.filter(e => e.type === 'Electric').length;
        
        // Get unique brands
        const brands = new Set();
        ecuDatabase.forEach(e => {
          // Extract base brand name (before parentheses)
          const baseBrand = e.brand.split(' (')[0];
          brands.add(baseBrand);
        });
        
        // Update DOM elements
        const totalEl = document.getElementById('total-ecus');
        const dieselEl = document.getElementById('diesel-count');
        const petrolEl = document.getElementById('petrol-count');
        const brandsEl = document.getElementById('brands-count');
        
        if (totalEl) totalEl.textContent = totalEcus + '+';
        if (dieselEl) dieselEl.textContent = dieselCount;
        if (petrolEl) petrolEl.textContent = petrolCount + (electricCount > 0 ? '+' + electricCount + ' EV' : '');
        if (brandsEl) brandsEl.textContent = brands.size + '+';
      }
      
      // Initialize stats on load
      updateEcuStats();
      
      searchInput.addEventListener('input', function() {
        performSearch();
      });
      
      // Advanced filter event listeners
      const filterBrand = document.getElementById('ecu-filter-brand');
      const filterType = document.getElementById('ecu-filter-type');
      const filterTool = document.getElementById('ecu-filter-tool');
      const sortBy = document.getElementById('ecu-sort-by');
      
      if (filterBrand) filterBrand.addEventListener('change', performSearch);
      if (filterType) filterType.addEventListener('change', performSearch);
      if (filterTool) filterTool.addEventListener('change', performSearch);
      if (sortBy) sortBy.addEventListener('change', performSearch);
      
      // Button event listeners
      const clearSearch = document.getElementById('ecu-clear-search');
      const viewAllBtn = document.getElementById('ecu-view-all');
      const compareMode = document.getElementById('ecu-compare-mode');
      const exportCSV = document.getElementById('ecu-export-csv');
      const exportJSON = document.getElementById('ecu-export-json');
      
      if (clearSearch) clearSearch.addEventListener('click', clearAllFilters);
      if (viewAllBtn) viewAllBtn.addEventListener('click', viewAllECUs);
      if (compareMode) compareMode.addEventListener('click', toggleComparePanel);
      if (exportCSV) exportCSV.addEventListener('click', () => exportData('csv'));
      if (exportJSON) exportJSON.addEventListener('click', () => exportData('json'));
      
      // Modal event listeners
      const closeModal = document.getElementById('close-ecu-modal');
      const closeCompModal = document.getElementById('close-comparison-modal');
      const compareClose = document.getElementById('compare-close');
      const compareClearAll = document.getElementById('compare-clear-all');
      const compareViewDetails = document.getElementById('compare-view-details');
      
      if (closeModal) closeModal.addEventListener('click', closeDetailModal);
      if (closeCompModal) closeCompModal.addEventListener('click', closeComparisonModal);
      if (compareClose) compareClose.addEventListener('click', toggleComparePanel);
      if (compareClearAll) compareClearAll.addEventListener('click', clearComparison);
      if (compareViewDetails) compareViewDetails.addEventListener('click', showComparisonTable);
      
      // Comparison state and current filtered results
      window.comparisonECUs = [];
      window.compareModeActive = false;
      window.currentFilteredECUs = [];
      
      // Search and filter function
      function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const brandFilter = filterBrand?.value || '';
        const typeFilter = filterType?.value || '';
        const toolFilter = filterTool?.value || '';
        const sortOption = sortBy?.value || 'model';
        
        // Filter results
        let filteredResults = ecuDatabase.filter(ecu => {
          const matchesSearch = !searchTerm || 
            ecu.model.toLowerCase().includes(searchTerm) ||
            ecu.brand.toLowerCase().includes(searchTerm) ||
            ecu.type.toLowerCase().includes(searchTerm) ||
            ecu.applications.some(app => app.toLowerCase().includes(searchTerm)) ||
            ecu.features.some(feat => feat.toLowerCase().includes(searchTerm)) ||
            (ecu.power && ecu.power.toLowerCase().includes(searchTerm)) ||
            (ecu.notes && ecu.notes.toLowerCase().includes(searchTerm));
            
          const matchesBrand = !brandFilter || ecu.brand.includes(brandFilter);
          const matchesType = !typeFilter || ecu.type === typeFilter;
          const matchesTool = !toolFilter || ecu.tools.some(tool => tool.includes(toolFilter));
          
          return matchesSearch && matchesBrand && matchesType && matchesTool;
        });
        
        // Sort results
        filteredResults.sort((a, b) => {
          switch(sortOption) {
            case 'brand':
              return a.brand.localeCompare(b.brand);
            case 'type':
              return a.type.localeCompare(b.type);
            case 'power':
              const getPowerNum = (p) => {
                if (!p) return 0;
                const match = p.match(/(\d+)/);
                return match ? parseInt(match[1]) : 0;
              };
              return getPowerNum(b.power) - getPowerNum(a.power);
            case 'model':
            default:
              return a.model.localeCompare(b.model);
          }
        });
        
        displayResults(filteredResults, searchTerm || brandFilter || typeFilter || toolFilter);
      }
      
      // Display results
      function displayResults(results, hasFilter) {
        const searchResults = document.getElementById('ecu-search-results');
        const searchEmpty = document.getElementById('ecu-search-empty');
        const resultsSummary = document.getElementById('ecu-results-summary');
        
        if (results.length === 0 && hasFilter) {
          searchResults.style.display = 'none';
          searchEmpty.style.display = 'none';
          resultsSummary.style.display = 'block';
          resultsSummary.querySelector('span').textContent = '❌ No ECUs found matching your criteria. Try adjusting your filters.';
          resultsSummary.querySelector('span').style.color = '#ef4444';
          return;
        }
        
        if (results.length === 0 && !hasFilter) {
          searchResults.style.display = 'none';
          searchEmpty.style.display = 'block';
          resultsSummary.style.display = 'none';
          return;
        }
        
        searchEmpty.style.display = 'none';
        searchResults.style.display = 'block';
        resultsSummary.style.display = 'block';
        resultsSummary.querySelector('span').textContent = `✅ Found ${results.length} ECU${results.length > 1 ? 's' : ''} matching your criteria`;
        resultsSummary.querySelector('span').style.color = '#000';
        
        // Store the current filtered results globally for access by view/compare functions
        window.currentFilteredECUs = results;
        
        let resultsHtml = '<div style="display:grid;gap:1.5rem">';
        results.forEach((ecu, index) => {
          const typeColor = ecu.type === 'Diesel' ? '#3b82f6' : '#ef4444';
          const isInComparison = window.comparisonECUs.some(e => e.model === ecu.model);
          
          resultsHtml += `
            <div class="ecu-result" style="border:3px solid ${isInComparison ? '#8b5cf6' : '#e5e7eb'};border-radius:16px;padding:2rem;background:white;box-shadow:0 2px 8px rgba(0,0,0,0.08);transition:all 0.3s;position:relative">
              ${isInComparison ? '<div style="position:absolute;top:1rem;right:1rem;background:#8b5cf6;color:white;padding:0.5rem 1rem;border-radius:8px;font-size:0.75rem;font-weight:600">✓ IN COMPARISON</div>' : ''}
              
              <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem">
                <div>
                  <h4 style="margin:0 0 0.5rem 0;color:#000;font-size:1.5rem">${ecu.brand} <span style="color:#dc2626">${ecu.model}</span></h4>
                  <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap">
                    <span style="background:${typeColor};color:white;padding:0.5rem 1rem;border-radius:8px;font-size:0.9rem;font-weight:600">⛽ ${ecu.type}</span>
                    ${ecu.power ? `<span style="background:#10b981;color:white;padding:0.5rem 1rem;border-radius:8px;font-size:0.9rem;font-weight:600">⚡ ${ecu.power}</span>` : ''}
                  </div>
                </div>
              </div>
              
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1rem;margin-bottom:1.5rem">
                <div style="padding:1rem;background:rgba(59,130,246,0.05);border-left:4px solid #3b82f6;border-radius:8px">
                  <strong style="color:#000;display:flex;align-items:center;gap:0.5rem;margin-bottom:0.75rem;font-size:0.9rem">📱 Applications</strong>
                  <div style="color:#475569;font-size:0.85rem;line-height:1.6">${ecu.applications.slice(0, 3).join('<br>')}</div>
                  ${ecu.applications.length > 3 ? `<div style="color:#64748b;font-size:0.75rem;margin-top:0.5rem;font-style:italic">+${ecu.applications.length - 3} more</div>` : ''}
                </div>
                
                <div style="padding:1rem;background:rgba(16,185,129,0.05);border-left:4px solid #10b981;border-radius:8px">
                  <strong style="color:#000;display:flex;align-items:center;gap:0.5rem;margin-bottom:0.75rem;font-size:0.9rem">⚙️ Features</strong>
                  <div style="display:flex;flex-wrap:wrap;gap:0.5rem">
                    ${ecu.features.slice(0, 4).map(feat => `<span style="background:rgba(16,185,129,0.1);padding:0.25rem 0.75rem;border-radius:6px;font-size:0.75rem;color:#064e3b">${feat}</span>`).join('')}
                  </div>
                </div>
              </div>
              
              ${ecu.notes ? `<div style="padding:1rem;background:rgba(34,197,94,0.1);border-left:4px solid #22c55e;border-radius:8px;margin-bottom:1.5rem">
                <div style="color:#000;font-style:italic;font-size:0.9rem">💡 ${ecu.notes}</div>
              </div>` : ''}
              
              <div style="display:flex;gap:1rem;flex-wrap:wrap">
                <button onclick="viewECUDetails(${index})" class="btn" style="flex:1;background:#3b82f6;color:white;font-weight:600;padding:0.75rem 1.5rem;border-radius:8px;cursor:pointer;border:none">
                  👁️ View Details
                </button>
                <button onclick="toggleECUComparison(${index})" class="btn" style="flex:1;background:${isInComparison ? '#6b7280' : '#8b5cf6'};color:white;font-weight:600;padding:0.75rem 1.5rem;border-radius:8px;cursor:pointer;border:none">
                  ${isInComparison ? '✓ Remove from Compare' : '➕ Add to Compare'}
                </button>
              </div>
            </div>
          `;
        });
        resultsHtml += '</div>';
        
        searchResults.innerHTML = resultsHtml;
      }
      
      // View ECU details
      window.viewECUDetails = function(index) {
        // Use the stored filtered results instead of re-filtering
        if (!window.currentFilteredECUs || !window.currentFilteredECUs[index]) {
          console.error('ECU not found at index', index);
          return;
        }
        
        const ecu = window.currentFilteredECUs[index];
        window.currentDetailECU = ecu;
        
        document.getElementById('modal-ecu-title').textContent = `${ecu.brand} ${ecu.model}`;
        document.getElementById('modal-ecu-subtitle').textContent = ecu.type + ' ECU System';
        document.getElementById('modal-power').textContent = ecu.power || 'N/A';
        document.getElementById('modal-type').textContent = ecu.type;
        
        const typeColor = ecu.type === 'Diesel' ? '#3b82f6' : '#ef4444';
        document.getElementById('modal-type').style.color = typeColor;
        
        document.getElementById('modal-applications').innerHTML = ecu.applications.map(app => 
          `<div style="padding:0.75rem;background:white;border:2px solid #e5e7eb;border-radius:8px;font-weight:500;color:#000">🚗 ${app}</div>`
        ).join('');
        
        document.getElementById('modal-features').innerHTML = ecu.features.map(feat => 
          `<div style="padding:0.75rem;background:rgba(59,130,246,0.05);border-radius:8px;font-weight:500;color:#000;text-align:center">✓ ${feat}</div>`
        ).join('');
        
        document.getElementById('modal-tools').innerHTML = ecu.tools.map(tool => {
          const toolName = tool.split(':')[0];
          const toolSupport = tool.split(':')[1] || '';
          const supportColor = toolSupport.toLowerCase().includes('full') ? '#22c55e' : 
                             toolSupport.toLowerCase().includes('read') ? '#f59e0b' : '#3b82f6';
          return `<div style="padding:0.75rem;background:white;border:2px solid ${supportColor};border-radius:8px;font-weight:600;color:#000">
            <div style="color:${supportColor};margin-bottom:0.25rem">🔧 ${toolName}</div>
            <div style="font-size:0.75rem;color:#64748b">${toolSupport}</div>
          </div>`;
        }).join('');
        
        if (ecu.notes) {
          document.getElementById('modal-notes-section').style.display = 'block';
          document.getElementById('modal-notes').textContent = ecu.notes;
        } else {
          document.getElementById('modal-notes-section').style.display = 'none';
        }
        
        document.getElementById('ecu-detail-modal').style.display = 'block';
      };
      
      // Close modal
      function closeDetailModal() {
        document.getElementById('ecu-detail-modal').style.display = 'none';
      }
      
      // Toggle ECU in comparison
      window.toggleECUComparison = function(index) {
        // Use the stored filtered results instead of re-filtering
        if (!window.currentFilteredECUs || !window.currentFilteredECUs[index]) {
          console.error('ECU not found at index', index);
          return;
        }
        
        const ecu = window.currentFilteredECUs[index];
        
        const existingIndex = window.comparisonECUs.findIndex(e => e.model === ecu.model);
        if (existingIndex >= 0) {
          window.comparisonECUs.splice(existingIndex, 1);
        } else {
          if (window.comparisonECUs.length >= 4) {
            alert('⚠️ Maximum 4 ECUs can be compared at once. Remove one to add another.');
            return;
          }
          window.comparisonECUs.push(ecu);
        }
        
        updateComparePanel();
        performSearch(); // Refresh to update UI
      };
      
      // Update comparison panel
      function updateComparePanel() {
        const compareCount = document.getElementById('compare-count');
        const comparisonCount = document.getElementById('comparison-count');
        const comparisonEcus = document.getElementById('comparison-ecus');
        
        if (compareCount) compareCount.textContent = `(${window.comparisonECUs.length})`;
        if (comparisonCount) comparisonCount.textContent = `(${window.comparisonECUs.length} ECUs)`;
        
        if (window.comparisonECUs.length > 0 && comparisonEcus) {
          comparisonEcus.innerHTML = window.comparisonECUs.map((ecu, i) => `
            <div style="min-width:200px;padding:1rem;background:rgba(139,92,246,0.1);border:2px solid #8b5cf6;border-radius:12px">
              <div style="font-weight:600;color:#000;margin-bottom:0.5rem">${ecu.brand} ${ecu.model}</div>
              <div style="font-size:0.85rem;color:#64748b;margin-bottom:0.75rem">${ecu.type} • ${ecu.power}</div>
              <button onclick="removeFromComparison(${i})" style="width:100%;padding:0.5rem;background:#ef4444;color:white;border:none;border-radius:6px;cursor:pointer;font-weight:600">Remove</button>
            </div>
          `).join('');
        }
      }
      
      // Remove from comparison
      window.removeFromComparison = function(index) {
        window.comparisonECUs.splice(index, 1);
        updateComparePanel();
        performSearch();
        if (window.comparisonECUs.length === 0) {
          document.getElementById('ecu-comparison-panel').style.display = 'none';
        }
      };
      
      // Toggle comparison panel
      function toggleComparePanel() {
        const panel = document.getElementById('ecu-comparison-panel');
        if (window.comparisonECUs.length === 0) {
          alert('ℹ️ No ECUs selected for comparison. Use the "Add to Compare" button on ECU cards.');
          return;
        }
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      }
      
      // Show comparison table
      function showComparisonTable() {
        if (window.comparisonECUs.length < 2) {
          alert('⚠️ Please add at least 2 ECUs to compare.');
          return;
        }
        
        const modal = document.getElementById('ecu-comparison-modal');
        const table = document.getElementById('comparison-table');
        
        let tableHTML = '<thead><tr style="background:#f9fafb;border-bottom:2px solid #e5e7eb"><th style="padding:1rem;text-align:left;font-weight:700;color:#000">Feature</th>';
        window.comparisonECUs.forEach(ecu => {
          tableHTML += `<th style="padding:1rem;text-align:center;font-weight:700;color:#000">${ecu.brand}<br>${ecu.model}</th>`;
        });
        tableHTML += '</tr></thead><tbody>';
        
        // Type
        tableHTML += '<tr style="border-bottom:1px solid #e5e7eb"><td style="padding:1rem;font-weight:600;color:#000">Fuel Type</td>';
        window.comparisonECUs.forEach(ecu => {
          const color = ecu.type === 'Diesel' ? '#3b82f6' : '#ef4444';
          tableHTML += `<td style="padding:1rem;text-align:center"><span style="background:${color};color:white;padding:0.5rem 1rem;border-radius:6px;font-weight:600">${ecu.type}</span></td>`;
        });
        tableHTML += '</tr>';
        
        // Power
        tableHTML += '<tr style="border-bottom:1px solid #e5e7eb"><td style="padding:1rem;font-weight:600;color:#000">Power Range</td>';
        window.comparisonECUs.forEach(ecu => {
          tableHTML += `<td style="padding:1rem;text-align:center;font-weight:600;color:#000">${ecu.power || 'N/A'}</td>`;
        });
        tableHTML += '</tr>';
        
        // Applications
        tableHTML += '<tr style="border-bottom:1px solid #e5e7eb"><td style="padding:1rem;font-weight:600;color:#000">Applications</td>';
        window.comparisonECUs.forEach(ecu => {
          tableHTML += `<td style="padding:1rem;text-align:center;font-size:0.85rem;color:#475569">${ecu.applications.slice(0, 3).join('<br>')}</td>`;
        });
        tableHTML += '</tr>';
        
        // Features
        tableHTML += '<tr style="border-bottom:1px solid #e5e7eb"><td style="padding:1rem;font-weight:600;color:#000">Features</td>';
        window.comparisonECUs.forEach(ecu => {
          tableHTML += `<td style="padding:1rem;text-align:center;font-size:0.85rem;color:#475569">${ecu.features.join(', ')}</td>`;
        });
        tableHTML += '</tr>';
        
        // Tools
        tableHTML += '<tr style="border-bottom:1px solid #e5e7eb"><td style="padding:1rem;font-weight:600;color:#000">Tool Support</td>';
        window.comparisonECUs.forEach(ecu => {
          tableHTML += `<td style="padding:1rem;text-align:center;font-size:0.85rem;color:#475569">${ecu.tools.map(t => t.split(':')[0]).join(', ')}</td>`;
        });
        tableHTML += '</tr>';
        
        tableHTML += '</tbody>';
        table.innerHTML = tableHTML;
        modal.style.display = 'block';
      }
      
      // Close comparison modal
      function closeComparisonModal() {
        document.getElementById('ecu-comparison-modal').style.display = 'none';
      }
      
      // Clear comparison
      function clearComparison() {
        if (confirm('Clear all ECUs from comparison?')) {
          window.comparisonECUs = [];
          updateComparePanel();
          performSearch();
          document.getElementById('ecu-comparison-panel').style.display = 'none';
        }
      }
      
      // Clear all filters
      function clearAllFilters() {
        searchInput.value = '';
        if (filterBrand) filterBrand.value = '';
        if (filterType) filterType.value = '';
        if (filterTool) filterTool.value = '';
        if (sortBy) sortBy.value = 'model';
        
        document.getElementById('ecu-search-results').style.display = 'none';
        document.getElementById('ecu-results-summary').style.display = 'none';
        document.getElementById('ecu-search-empty').style.display = 'block';
      }
      
      // View all ECUs
      function viewAllECUs() {
        clearAllFilters();
        searchInput.value = '';
        performSearch();
      }
      
      // Export data
      function exportData(format) {
        const dataToExport = window.comparisonECUs.length > 0 ? window.comparisonECUs : ecuDatabase;
        
        if (format === 'csv') {
          let csv = 'Brand,Model,Type,Power,Applications,Features,Tools,Notes\n';
          dataToExport.forEach(ecu => {
            csv += `"${ecu.brand}","${ecu.model}","${ecu.type}","${ecu.power}","${ecu.applications.join('; ')}","${ecu.features.join('; ')}","${ecu.tools.join('; ')}","${ecu.notes || ''}"\n`;
          });
          downloadFile(csv, `ecu-database-${Date.now()}.csv`, 'text/csv');
        } else if (format === 'json') {
          const json = JSON.stringify(dataToExport, null, 2);
          downloadFile(json, `ecu-database-${Date.now()}.json`, 'application/json');
        }
      }
      
      function downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
      }
      
      // Modal add to compare
      const modalAddCompare = document.getElementById('modal-add-compare');
      if (modalAddCompare) {
        modalAddCompare.addEventListener('click', () => {
          if (window.currentDetailECU) {
            const existingIndex = window.comparisonECUs.findIndex(e => e.model === window.currentDetailECU.model);
            if (existingIndex >= 0) {
              alert('ℹ️ This ECU is already in your comparison list.');
            } else {
              if (window.comparisonECUs.length >= 4) {
                alert('⚠️ Maximum 4 ECUs can be compared at once.');
                return;
              }
              window.comparisonECUs.push(window.currentDetailECU);
              updateComparePanel();
              alert('✅ ECU added to comparison!');
              performSearch();
            }
          }
        });
      }
      
      // Modal export details
      const modalExport = document.getElementById('modal-export-details');
      if (modalExport) {
        modalExport.addEventListener('click', () => {
          if (window.currentDetailECU) {
            const json = JSON.stringify([window.currentDetailECU], null, 2);
            downloadFile(json, `${window.currentDetailECU.model}-details.json`, 'application/json');
          }
        });
      }
      
      // Export comparison CSV
      const exportCompCSV = document.getElementById('export-comparison-csv');
      if (exportCompCSV) {
        exportCompCSV.addEventListener('click', () => exportData('csv'));
      }
      
      // Clear comparison from modal
      const clearCompModal = document.getElementById('clear-comparison-modal');
      if (clearCompModal) {
        clearCompModal.addEventListener('click', () => {
          clearComparison();
          closeComparisonModal();
        });
      }
    }
    
    // Expose pricing functions globally
    window.initializePricingPage = initializePricingPage;
    window.initializeEcuSearch = initializeEcuSearch;
  

  // Online/Offline Status Function (UK Time 9 AM - 9 PM)
  function updateOnlineStatus() {
    const statusIndicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');
    
    if (!statusIndicator || !statusText) return;
    
    // Get current UK time
    const now = new Date();
    const ukTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/London' }));
    const hours = ukTime.getHours();
    
    // Check if between 9 AM (9) and 9 PM (21)
    const isOnline = hours >= 9 && hours < 21;
    
    if (isOnline) {
      // Online - Green
      statusIndicator.style.background = '#22c55e';
      statusText.textContent = 'Online';
      statusText.style.color = '#22c55e';
    } else {
      // Offline - Red
      statusIndicator.style.background = '#ef4444';
      statusText.textContent = 'Offline';
      statusText.style.color = '#ef4444';
    }
  }

  // Emergency function to reactivate admin account
  window.reactivateAdmin = async function() {
    try {
      const users = await CarnageAuth.getAllUsers();
      const adminUser = users.find(u => u.role === 'admin');
      
      if (!adminUser) {
        console.error('No admin user found');
        return;
      }
      
      await CarnageAuth.updateUser(adminUser.id, { isActive: true });
      console.log('Admin account reactivated successfully');
      alert('Admin account has been reactivated. Please refresh the page and log in.');
    } catch (error) {
      console.error('Error reactivating admin:', error);
      alert('Error reactivating admin account. Check console for details.');
    }
  };

  // Manual storage bucket checker
  window.checkStorageBucket = async function() {
    if (window.SupabaseFiles && window.SupabaseFiles.ensureStorageBucket) {
      console.log('🔍 Manually checking storage bucket...');
      const result = await SupabaseFiles.ensureStorageBucket();
      console.log('📊 Storage check result:', result ? '✅ OK' : '❌ Issues found');
      return result;
    } else {
      console.error('❌ SupabaseFiles module not loaded');
      return false;
    }
  };

  // ============================================
  // NOTIFICATION SETTINGS PANEL
  // ============================================
  
  // Load notification settings and status
  async function loadNotificationSettings() {
    const emailStatus = document.getElementById('email-status');
    const whatsappStatus = document.getElementById('whatsapp-status');
    
    if (!emailStatus && !whatsappStatus) return;
    
    try {
      const apiUrl = window.CARNAGE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/notification-status`);
      const data = await response.json();
      
      // Update email status
      if (emailStatus) {
        if (data.email.configured) {
          emailStatus.innerHTML = `✅ Configured<br><small>Sending to: ${data.email.admin}</small>`;
        } else {
          emailStatus.innerHTML = `❌ Not Configured<br><small>EMAIL_PASSWORD not set</small>`;
        }
      }
      
      // Update WhatsApp status
      if (whatsappStatus) {
        if (data.whatsapp.configured) {
          const method = data.whatsapp.twilio ? 'Twilio' : 'CallMeBot';
          whatsappStatus.innerHTML = `✅ Configured via ${method}`;
        } else {
          whatsappStatus.innerHTML = `⚠️ Not Configured<br><small>Add WHATSAPP_PHONE + API key</small>`;
        }
      }
      
      console.log('📊 Notification status loaded:', data);
      
      // Load the recent notification log for this tab
      await loadRecentNotifications('notification-log');
      
    } catch (error) {
      console.error('Error loading notification status:', error);
      if (emailStatus) emailStatus.innerHTML = '⚠️ Error checking status';
      if (whatsappStatus) whatsappStatus.innerHTML = '⚠️ Error checking status';
    }
  }
  
  // Test admin notification
  window.testAdminNotification = async function() {
    const logContainer = document.getElementById('notification-log');
    const testBtn = document.querySelector('[onclick="testAdminNotification()"]');
    
    if (testBtn) {
      testBtn.disabled = true;
      testBtn.innerHTML = '⏳ Sending...';
    }
    
    try {
      const apiUrl = window.CARNAGE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/test-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      console.log('📧 Test notification response:', data);
      
      // Reload notifications to show the new one
      await loadRecentNotifications();
      
      // Show result alert
      if (data.success) {
        alert('✅ Test notification sent! Check your email/WhatsApp.');
      } else {
        alert('❌ Notification failed: ' + data.message);
      }
      
    } catch (error) {
      console.error('Test notification error:', error);
      alert('❌ Error sending test notification: ' + error.message);
    } finally {
      if (testBtn) {
        testBtn.disabled = false;
        testBtn.innerHTML = '📤 Send Test';
      }
    }
  };

  // Load recent admin notifications from server
  async function loadRecentNotifications(containerId = null) {
    const logContainer = containerId 
      ? document.getElementById(containerId)
      : (document.getElementById('notification-log') || document.getElementById('admin-notifications-list'));
    
    if (!logContainer) {
      console.warn('⚠️ Notification container not found');
      return;
    }
    
    try {
      const apiUrl = window.CARNAGE_API_URL || '';
      console.log('🔍 Fetching notifications from:', `${apiUrl}/api/admin/notifications`);
      const response = await fetch(`${apiUrl}/api/admin/notifications`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      console.log('📋 Loaded notifications:', data);
      console.log('📋 Notification count:', data.count);
      console.log('📋 Notifications array:', data.notifications);
      
      if (data.success && data.notifications && data.notifications.length > 0) {
        // Clear placeholder
        logContainer.innerHTML = '';
        
        // Display each notification
        data.notifications.forEach(notif => {
          const timestamp = new Date(notif.timestamp).toLocaleString('en-GB');
          const logEntry = document.createElement('div');
          logEntry.style.cssText = `
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: rgba(255,255,255,0.05);
            border-left: 4px solid #eab308;
            border-radius: 8px;
            margin-bottom: 0.5rem;
          `;
          logEntry.innerHTML = `
            <span style="font-size: 1.5rem;">${notif.icon || '📋'}</span>
            <div style="flex: 1;">
              <div style="font-weight: 600; color: #fff;">${notif.title}</div>
              <div style="font-size: 0.875rem; color: #9ca3af;">${notif.message}</div>
              ${notif.user ? `<div style="font-size: 0.8rem; color: #6b7280; margin-top: 0.25rem;">👤 ${notif.user}</div>` : ''}
            </div>
            <div style="font-size: 0.8rem; color: #666;">${timestamp}</div>
          `;
          logContainer.appendChild(logEntry);
        });
      } else {
        // Show placeholder
        logContainer.innerHTML = `
          <div class="empty-state">
            <span>📭</span>
            <p>No recent activity</p>
          </div>
        `;
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      logContainer.innerHTML = `
        <div class="empty-state">
          <span>❌</span>
          <p>Failed to load notifications</p>
        </div>
      `;
    }
  }

  // Load notifications when admin panel opens
  document.addEventListener('DOMContentLoaded', () => {
    // Listen for tab changes to notifications tab
    const tabLinks = document.querySelectorAll('[data-tab]');
    tabLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        if (e.target.dataset.tab === 'notifications') {
          setTimeout(() => loadRecentNotifications(), 100);
        }
      });
    });
  });

  // Test admin notification (keep old version for compatibility)
  window.testAdminNotificationOld = async function() {
    const logContainer = document.getElementById('notification-log');
    const testBtn = document.querySelector('[onclick="testAdminNotification()"]');
    
    if (testBtn) {
      testBtn.disabled = true;
      testBtn.innerHTML = '⏳ Sending...';
    }
    
    try {
      const apiUrl = window.CARNAGE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/test-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      console.log('📧 Test notification response:', data);
      
      // Add to log
      if (logContainer) {
        const timestamp = new Date().toLocaleString('en-GB');
        const statusClass = data.success ? 'success' : 'error';
        const statusIcon = data.success ? '✅' : '❌';
        
        const logEntry = document.createElement('div');
        logEntry.style.cssText = `
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: ${data.success ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'};
          border-left: 4px solid ${data.success ? '#22c55e' : '#ef4444'};
          border-radius: 8px;
          margin-bottom: 0.5rem;
        `;
        logEntry.innerHTML = `
          <span style="font-size: 1.5rem;">${statusIcon}</span>
          <div style="flex: 1;">
            <div style="font-weight: 600; color: #fff;">Test Notification</div>
            <div style="font-size: 0.85rem; color: #888;">
              Email: ${data.emailSent ? '✅ Sent' : '❌ Failed'} | 
              WhatsApp: ${data.whatsAppSent ? '✅ Sent' : '❌ Failed'}
            </div>
          </div>
          <div style="font-size: 0.8rem; color: #666;">${timestamp}</div>
        `;
        
        // Clear placeholder if it exists
        const placeholder = logContainer.querySelector('div[style*="text-align:center"]');
        if (placeholder && placeholder.textContent.includes('Notification log')) {
          logContainer.innerHTML = '';
        }
        
        logContainer.insertBefore(logEntry, logContainer.firstChild);
      }
      
      // Show result alert
      if (data.success) {
        alert('✅ Test notification sent! Check your email/WhatsApp.');
      } else {
        alert('❌ Notification failed: ' + data.message);
      }
      
    } catch (error) {
      console.error('Test notification error:', error);
      alert('❌ Error sending test notification: ' + error.message);
    } finally {
      if (testBtn) {
        testBtn.disabled = false;
        testBtn.innerHTML = '📧 Send Test Notification';
      }
    }
  };

})();

