/**
 * DVLA Vehicle Lookup Client
 * Frontend wrapper for secure DVLA API lookups through your backend
 * 
 * IMPORTANT: The actual API key is kept server-side only!
 * Frontend sends requests to /api/dvla-lookup which proxies to DVLA
 */

class DVLAVehicleLookup {
  constructor(apiEndpoint = '/api/dvla-lookup') {
    this.apiEndpoint = apiEndpoint;
    this.cache = new Map();
    this.cacheTimeout = 60 * 60 * 1000; // 1 hour
  }

  /**
   * Format VRM for display
   * @param {string} vrm - Raw VRM
   * @returns {string} Formatted VRM (e.g., "AB12CDE")
   */
  static formatVRM(vrm) {
    if (!vrm) return '';
    return vrm.trim().toUpperCase().replace(/\s/g, '');
  }

  /**
   * Validate VRM format
   * @param {string} vrm - Vehicle registration mark
   * @returns {boolean}
   */
  static isValidVRM(vrm) {
    const cleaned = DVLAVehicleLookup.formatVRM(vrm);
    return /^[A-Z0-9]{2,7}$/.test(cleaned);
  }

  /**
   * Check if cached result is still valid
   * @param {string} vrm
   * @returns {boolean}
   */
  isCacheValid(vrm) {
    const key = DVLAVehicleLookup.formatVRM(vrm);
    if (!this.cache.has(key)) return false;
    
    const entry = this.cache.get(key);
    const age = Date.now() - entry.timestamp;
    return age < this.cacheTimeout;
  }

  /**
   * Get vehicle from cache if available
   * @param {string} vrm
   * @returns {object|null}
   */
  getFromCache(vrm) {
    const key = DVLAVehicleLookup.formatVRM(vrm);
    if (this.isCacheValid(vrm)) {
      return this.cache.get(key).data;
    }
    this.cache.delete(key);
    return null;
  }

  /**
   * Store vehicle in cache
   * @param {string} vrm
   * @param {object} data
   */
  setCache(vrm, data) {
    const key = DVLAVehicleLookup.formatVRM(vrm);
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Clear cache for a specific VRM or entire cache
   * @param {string} vrm - Optional: clear specific VRM, leave empty to clear all
   */
  clearCache(vrm = null) {
    if (vrm) {
      const key = DVLAVehicleLookup.formatVRM(vrm);
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Lookup vehicle by VRM through backend API
   * @param {string} vrm - Vehicle registration mark
   * @param {object} options - Optional settings
   * @returns {Promise<object>} Vehicle data
   */
  async lookupVehicle(vrm, options = {}) {
    const { useCache = true, throwError = false } = options;

    // Validate VRM format
    if (!DVLAVehicleLookup.isValidVRM(vrm)) {
      const error = 'Invalid VRM format. Must be 2-7 alphanumeric characters.';
      if (throwError) throw new Error(error);
      return { error, success: false };
    }

    // Check cache
    if (useCache) {
      const cached = this.getFromCache(vrm);
      if (cached) {
        console.log(`[DVLA Cache Hit] ${vrm}`);
        return cached;
      }
    }

    try {
      const formattedVRM = DVLAVehicleLookup.formatVRM(vrm);
      console.log(`[DVLA Lookup] Requesting: ${formattedVRM}`);

      const response = await fetch(
        `${this.apiEndpoint}?vrm=${encodeURIComponent(formattedVRM)}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const error = {
          error: data.error || 'Vehicle lookup failed',
          success: false,
          vrm: formattedVRM,
          status: response.status
        };
        if (throwError) throw new Error(data.error);
        return error;
      }

      // Cache successful result
      if (useCache && data.success) {
        this.setCache(vrm, data);
      }

      return data;
    } catch (error) {
      console.error('[DVLA Error]', error);
      const errorResponse = {
        error: error.message || 'Network error',
        success: false,
        vrm: DVLAVehicleLookup.formatVRM(vrm)
      };
      if (throwError) throw error;
      return errorResponse;
    }
  }

  /**
   * Lookup multiple vehicles
   * @param {array} vrms - Array of VRMs
   * @returns {Promise<array>} Results for each VRM
   */
  async lookupMultiple(vrms) {
    return Promise.all(vrms.map(vrm => this.lookupVehicle(vrm)));
  }

  /**
   * Format vehicle details for display
   * @param {object} vehicle - Vehicle data from API
   * @returns {string} Human-readable vehicle description
   */
  static formatVehicleDescription(vehicle) {
    if (!vehicle) return 'Unknown vehicle';
    
    const parts = [
      vehicle.make,
      vehicle.model,
      vehicle.yearOfManufacture ? `(${vehicle.yearOfManufacture})` : null,
      vehicle.fuelType ? `${vehicle.fuelType}` : null
    ].filter(Boolean);

    return parts.join(' ');
  }

  /**
   * Get vehicle details in a human-readable format
   * @param {string} vrm - Vehicle registration mark
   * @returns {Promise<object>} Formatted vehicle info
   */
  async getVehicleInfo(vrm) {
    const result = await this.lookupVehicle(vrm);

    if (!result.success) {
      return { error: result.error };
    }

    const vehicle = result.vehicle || {};
    return {
      vrm: result.vrm,
      description: DVLAVehicleLookup.formatVehicleDescription(vehicle),
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.yearOfManufacture,
      fuelType: vehicle.fuelType,
      colour: vehicle.colour,
      engineCapacity: vehicle.engineCapacity,
      taxStatus: vehicle.taxStatus,
      motStatus: vehicle.motStatus,
      registrationDate: vehicle.firstRegistrationDate
    };
  }

  /**
   * Get stats about cache usage
   * @returns {object}
   */
  getCacheStats() {
    let validCount = 0;
    let expiredCount = 0;

    this.cache.forEach((entry) => {
      const age = Date.now() - entry.timestamp;
      if (age < this.cacheTimeout) {
        validCount++;
      } else {
        expiredCount++;
      }
    });

    return {
      totalCached: this.cache.size,
      validEntries: validCount,
      expiredEntries: expiredCount,
      cacheSize: this.cache.size
    };
  }
}

// Export for use in browsers and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DVLAVehicleLookup;
}
