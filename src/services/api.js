/**
 * api.js — PropValue AI Frontend API Service
 *
 * STATUS: Step 1 scaffold. Functions are defined but not yet called.
 * They are connected to the UI in Step 5.
 *
 * RULE: This is the ONLY file that imports axios or makes HTTP calls.
 * Never call axios directly from a page or component.
 *
 * The proxy in vite.config.js forwards /api/* → http://localhost:4000
 * so VITE_API_URL is only needed for production builds.
 */

import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || ''

/**
 * Submit property form + photos for price prediction.
 *
 * @param {FormData} formData  — must include all form fields + photo files
 * @returns {Promise<{ id, price, price_range, condition_score, ... }>}
 *
 * See DOCUMENTATION.md Section 6 for full request/response shape.
 */
export const predictPrice = (formData) =>
  axios.post(`${BASE}/api/predict`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

/**
 * Fetch a saved prediction result by ID.
 * Used by ResultPage to load report data on mount.
 *
 * @param {string} id  — UUID returned by predictPrice
 * @returns {Promise<{ id, price, price_range, condition_score, adjustments, ... }>}
 */
export const getResult = (id) =>
  axios.get(`${BASE}/api/result/${id}`)
