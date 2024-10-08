/**
 * @file
 * Contains CurrentUser info action.
 */

import { CURRENT_USER } from "../constants/api.constant";
import { getStorageItem } from "../services/localStorage.service";

/**
 * Save current user info action.
 * @param {object} data.
 */
export const saveCurrentUserInfo = (data) => {
  setStorageItem(CURRENT_USER, data);
};

/**
 * Get current user info action.
 */
export const getCurrentUserInfo = () => {
  return getStorageItem(CURRENT_USER) || "";
};

/**
 * Remove current user info action.
 */
export const removeCurrentUserInfo = () => {
  removeStorageItem(CURRENT_USER);
};
