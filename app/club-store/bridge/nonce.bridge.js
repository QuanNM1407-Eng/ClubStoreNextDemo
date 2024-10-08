/**
 * @file
 * Contains Nonce action.
 */

import { NONCE } from "../constants/api.constant";

// import CookieStore from "store/storages/cookieStorage";

/**
 * Save Nonce action.
 * @param token {string}
 */
export const saveNonce = (token) => {
  CookieStore.write(NONCE, token);
};

/**
 * Get Nonce action.
 */
export const getNonce = () => {
  return CookieStore.read(NONCE) || "";
};

/**
 * Remove Nonce action.
 */
export const removeNonce = () => {
  CookieStore.remove(NONCE);
};
