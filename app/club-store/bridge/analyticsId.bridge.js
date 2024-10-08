/**
 * @file
 * Contains Analytics ID setting to localstorage
 */

import Constants from "../constants/api.constant";
import Services from "../services/localStorage.service";

/**
 * Get analyticsId action.
 */
export const getAnalyticsId = () => {
  return Services?.getStorageItem(Constants.ANALYTICS_ID) || "";
};
