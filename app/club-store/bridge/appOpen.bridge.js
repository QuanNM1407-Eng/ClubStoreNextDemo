import { APP_OPEN } from '../constants/api.constant';

/**
 * Set value to app_open
 */
export const setAppOpen = () => {
  sessionStorage.setItem(APP_OPEN, 1);
};

/**
 * Get app_open value
 */
export const getAppOpen = () => {
  return sessionStorage.getItem(APP_OPEN) || '';
};
