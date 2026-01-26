/**
 * DVLA Open Data API Wrapper
 * Safely communicate with DVLA API from backend
 * Frontend should never expose the API key
 */

const fetch = require('node-fetch');

class DVLAClient {
  constructor(apiKey, baseUrl = 'https://api.dvlaonlineservices.dvla.gov.uk/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  /**
   * Lookup vehicle information by VRM (Vehicle Registration Mark)
   * @param {string} vrm - Vehicle registration number (e.g., "AB12CDE")
   * @returns {Promise<object>} Vehicle details
   */
  async lookupVehicleByVRM(vrm) {
    if (!vrm || typeof vrm !== 'string') {
      throw new Error('VRM must be a valid string');
    }

    // Clean VRM: remove spaces and convert to uppercase
    const cleanVRM = vrm.trim().toUpperCase().replace(/\s/g, '');

    if (!/^[A-Z0-9]{2,7}$/.test(cleanVRM)) {
      throw new Error('Invalid VRM format. Must be 2-7 alphanumeric characters.');
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/vehicles/vrm/${cleanVRM}`,
        {
          method: 'GET',
          headers: {
            'x-api-key': this.apiKey,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          return { error: 'Vehicle not found', status: 404 };
        }
        if (response.status === 401 || response.status === 403) {
          throw new Error('API authentication failed - check your DVLA API key');
        }
        throw new Error(`DVLA API returned status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('DVLA API Error:', error);
      throw error;
    }
  }

  /**
   * Batch lookup multiple VRMs
   * @param {array} vrms - Array of vehicle registration numbers
   * @returns {Promise<array>} Array of vehicle details
   */
  async lookupMultipleVehicles(vrms) {
    if (!Array.isArray(vrms)) {
      throw new Error('VRMs must be an array');
    }

    const results = [];
    for (const vrm of vrms) {
      try {
        const result = await this.lookupVehicleByVRM(vrm);
        results.push({ vrm, ...result });
      } catch (error) {
        results.push({ vrm, error: error.message });
      }
    }
    return results;
  }

  /**
   * Get vehicle technical details
   * @param {string} vrm - Vehicle registration number
   * @returns {Promise<object>} Technical specifications
   */
  async getVehicleTechnicals(vrm) {
    const vehicleData = await this.lookupVehicleByVRM(vrm);
    
    if (vehicleData.error) {
      return vehicleData;
    }

    // Extract relevant technical data
    return {
      vrm: vehicleData.registrationNumber,
      make: vehicleData.make,
      model: vehicleData.model,
      fuelType: vehicleData.fuelType,
      engineCapacity: vehicleData.engineCapacity,
      power: vehicleData.power,
      transmission: vehicleData.transmission,
      colour: vehicleData.colour,
      firstRegistrationDate: vehicleData.firstRegistrationDate,
      yearOfManufacture: vehicleData.yearOfManufacture,
      taxStatus: vehicleData.taxStatus,
      motStatus: vehicleData.motStatus
    };
  }

  /**
   * Validate if a VRM exists and is valid
   * @param {string} vrm - Vehicle registration number
   * @returns {Promise<boolean>}
   */
  async isValidVRM(vrm) {
    try {
      const result = await this.lookupVehicleByVRM(vrm);
      return !result.error;
    } catch (error) {
      return false;
    }
  }
}

module.exports = DVLAClient;
