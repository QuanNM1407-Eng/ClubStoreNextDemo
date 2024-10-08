/**
 * @file
 * Contains local storage service.
 */

/**
 * Set data to local storage.
 * @param {string} key.
 * @param {object} value.
 */
const setStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

/**
 * Get data from local storage.
 * @param {string} key.
 * @return {any}
 */
const getStorageItem = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

/**
 * Remove data from local storage.
 * @param {string} key.
 */
const removeStorageItem = (key) => {
  localStorage.removeItem(key);
};

export { setStorageItem, getStorageItem, removeStorageItem };
