/**
 * @file
 * Contains bridges index.
 */

import {
  saveSessionToken,
  getSessionToken,
  removeSessionToken,
  getRefreshToken,
  saveRefreshToken,
  removeRefreshToken,
} from './sessionToken.bridge';
import {
  saveCurrentUserInfo,
  getCurrentUserInfo,
  removeCurrentUserInfo,
} from './currentUser.bridge';
import { getAnalyticsId } from './analyticsId.bridge';
import { getNonce, saveNonce, removeNonce } from './nonce.bridge';

export default {
  saveSessionToken,
  getSessionToken,
  getRefreshToken,
  saveRefreshToken,
  removeRefreshToken,
  removeSessionToken,

  saveCurrentUserInfo,
  getCurrentUserInfo,
  removeCurrentUserInfo,

  getAnalyticsId,

  getNonce,
  saveNonce,
  removeNonce,
};
