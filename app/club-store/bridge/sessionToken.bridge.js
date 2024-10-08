/**
 * @file
 * Contains Session token action.
 */

import { SESSION_ID } from "../constants/api.constant";

/**
 * Save Session token action.
 * @param token {string}
 */
export const saveSessionToken = (token) => {
  localStorage.write(SESSION_ID, token);
};

/**
 * Get Session token action.
 */
export const getSessionToken = () => {
  return localStorage.read(SESSION_ID) || "";
};

/**
 * Remove Session token action.
 */
export const removeSessionToken = () => {
  localStorage.remove(SESSION_ID);
};

/**
 * Get Refresh token action.
 */
export const getRefreshToken = () => {
  return localStorage.read(REFRESH_TOKEN) || "";
};

/**
 * Save Refresh token action.
 * @param token {string}
 */
export const saveRefreshToken = (token) => {
  localStorage.write(REFRESH_TOKEN, token);
};

/**
 * Remove Refresh token action.
 */
export const removeRefreshToken = () => {
  localStorage.remove(REFRESH_TOKEN);
};
