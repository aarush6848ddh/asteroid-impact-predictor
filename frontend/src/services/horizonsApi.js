/**
 * NASA Horizons API Service
 * Advanced orbital mechanics and ephemeris data
 * Now uses backend API for better error handling and caching
 */

import { asteroidAPI } from './api';

/**
 * Get real-time position and velocity data for an asteroid
 * @param {string} asteroidId - Asteroid designation or SPK-ID
 * @param {string} startTime - Start time (YYYY-MM-DD format)
 * @param {string} endTime - End time (YYYY-MM-DD format)
 * @param {string} stepSize - Step size (e.g., '1d', '1h', '30m')
 * @returns {Promise<Array>} Position and velocity data
 */
export async function getAsteroidEphemeris(asteroidId, startTime, endTime, stepSize = '1d') {
  try {
    const data = await asteroidAPI.getAsteroidEphemeris(asteroidId, startTime, endTime, stepSize);
    return data.ephemeris_data.ephemeris || [];
  } catch (error) {
    console.error('Error fetching ephemeris data:', error);
    throw error;
  }
}

/**
 * Get orbital elements for an asteroid
 * @param {string} asteroidId - Asteroid designation or SPK-ID
 * @param {string} epoch - Epoch time (YYYY-MM-DD format)
 * @returns {Promise<Object>} Orbital elements
 */
export async function getAsteroidOrbitalElements(asteroidId, epoch = null) {
  try {
    const data = await asteroidAPI.getAsteroidOrbitalElements(asteroidId);
    return data.orbital_elements || {};
  } catch (error) {
    console.error('Error fetching orbital elements:', error);
    throw error;
  }
}

/**
 * Get close approach data for an asteroid
 * @param {string} asteroidId - Asteroid designation or SPK-ID
 * @param {string} startTime - Start time (YYYY-MM-DD format)
 * @param {string} endTime - End time (YYYY-MM-DD format)
 * @returns {Promise<Array>} Close approach data
 */
export async function getCloseApproaches(asteroidId, startTime, endTime) {
  try {
    const data = await asteroidAPI.getAsteroidCloseApproaches(asteroidId, startTime, endTime);
    return data.close_approaches || [];
  } catch (error) {
    console.error('Error fetching close approaches:', error);
    throw error;
  }
}

/**
 * Get observer ephemeris (RA/Dec, distance, etc.) for an asteroid
 * @param {string} asteroidId - Asteroid designation or SPK-ID
 * @param {string} startTime - Start time (YYYY-MM-DD format)
 * @param {string} endTime - End time (YYYY-MM-DD format)
 * @param {string} observer - Observer location (e.g., '500@399' for Earth)
 * @returns {Promise<Array>} Observer ephemeris data
 */
export async function getObserverEphemeris(asteroidId, startTime, endTime, observer = '500@399') {
  try {
    // For now, use the same ephemeris data and transform it
    const ephemerisData = await getAsteroidEphemeris(asteroidId, startTime, endTime);
    
    // Transform to observer format (simplified)
    return ephemerisData.map(point => ({
      time: point.time,
      ra: 0, // Would need proper calculation
      dec: 0, // Would need proper calculation
      distance: Math.sqrt(point.x**2 + point.y**2 + point.z**2),
      magnitude: 0, // Would need proper calculation
      elongation: 0 // Would need proper calculation
    }));
  } catch (error) {
    console.error('Error fetching observer ephemeris:', error);
    throw error;
  }
}

/**
 * Search for asteroids by designation or name
 * @param {string} searchTerm - Search term (designation, name, etc.)
 * @returns {Promise<Array>} List of matching asteroids
 */
export async function searchAsteroids(searchTerm) {
  try {
    // This would need to be implemented in the backend
    // For now, return empty array
    return [];
  } catch (error) {
    console.error('Error searching asteroids:', error);
    throw error;
  }
}

/**
 * Calculate orbital period from semi-major axis (Kepler's third law)
 * @param {number} semiMajorAxis - Semi-major axis in AU
 * @returns {number} Period in days
 */
export function calculateOrbitalPeriod(semiMajorAxis) {
  return 365.25 * Math.pow(semiMajorAxis, 1.5);
}

/**
 * Calculate velocity from orbital elements
 * @param {Object} elements - Orbital elements
 * @param {number} time - Time in days from epoch
 * @returns {Object} Velocity vector
 */
export function calculateVelocity(elements, time) {
  // This would implement velocity calculation from orbital elements
  // Using Kepler's equation and orbital mechanics
  const n = 2 * Math.PI / calculateOrbitalPeriod(elements.semi_major_axis);
  const M = elements.mean_anomaly + n * time;
  
  // Solve Kepler's equation for eccentric anomaly
  const E = solveKeplersEquation(M, elements.eccentricity);
  
  // Calculate velocity components
  const a = elements.semi_major_axis;
  const e = elements.eccentricity;
  const i = elements.inclination * Math.PI / 180;
  const omega = elements.longitude_of_ascending_node * Math.PI / 180;
  const w = elements.argument_of_perihelion * Math.PI / 180;
  
  // Simplified velocity calculation
  const v = Math.sqrt(2 / Math.sqrt(a) - 1 / a); // Circular velocity approximation
  
  return {
    vx: v * Math.cos(E),
    vy: v * Math.sin(E),
    vz: 0
  };
}

/**
 * Solve Kepler's equation using Newton-Raphson method
 * @param {number} M - Mean anomaly
 * @param {number} e - Eccentricity
 * @returns {number} Eccentric anomaly
 */
function solveKeplersEquation(M, e) {
  let E = M;
  const tolerance = 1e-8;
  let delta = 1;
  
  while (Math.abs(delta) > tolerance) {
    delta = (M - (E - e * Math.sin(E))) / (1 - e * Math.cos(E));
    E += delta;
  }
  
  return E;
}

/**
 * Get enhanced analysis for an asteroid
 * @param {string} asteroidId - Asteroid ID
 * @returns {Promise<Object>} Enhanced analysis data
 */
export async function getEnhancedAnalysis(asteroidId) {
  try {
    const data = await asteroidAPI.getEnhancedAnalysis(asteroidId);
    return data;
  } catch (error) {
    console.error('Error fetching enhanced analysis:', error);
    throw error;
  }
}

/**
 * Train enhanced ML model
 * @returns {Promise<Object>} Training results
 */
export async function trainEnhancedModel() {
  try {
    const data = await asteroidAPI.trainEnhancedModel();
    return data;
  } catch (error) {
    console.error('Error training enhanced model:', error);
    throw error;
  }
}