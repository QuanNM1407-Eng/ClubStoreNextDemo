/**
 * @file
 * Contains Local Development Process ENV & API variables.
 */

export const API_ENDPOINT = `${process.env.REACT_APP_API_ENDPOINT}/v1`;
export const API_ENDPOINT_NEW = `${process.env.REACT_APP_API_ENDPOINT_NEW}`;
export const API_ENDPOINT_SECOND = `${process.env.REACT_APP_API_ENDPOINT}/v2`;
export const API_PAYMENT_ENDPOINT = process.env.REACT_APP_API_PAYMENT_ENDPOINT;

export const API_ENV = process.env.REACT_APP_ENVIRONMENT;

export const FB_APP_ID = process.env.REACT_APP_FB_APP_ID;
export const APP_REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

export const SCOPELY_LOGIN_ENDPOINT = process.env.REACT_APP_SCOPELY_LOGIN_ENDPOINT;
export const SCOPELY_LOGIN_CLIENT_ID = process.env.REACT_APP_SCOPELY_LOGIN_CLIENT_ID;

export const IFRAME_STAGING_URL = process.env.REACT_APP_IFRAME_URL;
export const IFRAME_PROD_URL = process.env.REACT_APP_IFRAME_PROD_URL;

export const PUBNUB_PUBLIC_KEY = process.env.REACT_APP_PUBNUB_PUBLIC_KEY;
export const PUBNUB_SUBSCRIBE_KEY = process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY;

export const WEB_PUBNUB_SUBSCRIBE_KEY = process.env.REACT_APP_WEB_PUBNUB_SUBSCRIBE_KEY;

export const TITAN_API_KEY = process.env.REACT_APP_TITAN_API_KEY;
export const TITAN_EVENT_SOURCE = process.env.REACT_APP_TITAN_EVENT_SOURCE;

export const CLIENT_ID = process.env.REACT_APP_TWITCH_CLIENT_ID;

export const S3_IMAGES_URL = `https://static.wwechampions.com`;
export const S3_USERS_IMAGE = `${S3_IMAGES_URL}/user_images`;
export const S3_FACTION_IMAGE = `${API_ENDPOINT}/images/faction`;
export const S3_PLAYER_IMAGE = `${API_ENDPOINT}/images/user`;

export const SESSION_ID = 'sessionID';
export const REFRESH_TOKEN = 'refreshToken';
export const NONCE = 'nonce';
export const CURRENT_USER = 'current_user';
export const ANALYTICS_ID = 'analyticsId';
export const APP_OPEN = 'app_open';
export const APP_INSTALL = 'app_install';
export const CURRENT_USER_FOLLOW_EVENT = 'following_events';

export const NOT_IN_FACTIONS = 'not in a faction';

export const MAILCHIMP_URL = `https://wwechampions.us3.list-manage.com/subscribe/post?u=a3bd3e264e0857b6ed1249ae4&amp;id=7fa786a0b3`;
export const SCOPELY_PRIVACY_POLICY = `https://scopely.com/privacy/`;
export const SCOPELY_TERMS = `https://scopely.com/tos/`;

export const EVENT_RBE = {
  START: 'start',
  PROGRESS: 'objective_progress',
  SOLO: 'Solo',
  GLOBAL: 'Global',
  SOLO_TYPE: 2,
  GLOBAL_TYPE: 1,
  FIRST_COUNT: 1,
};

export const SHORT_CACHE_TIME = 1000 * 30;
export const LONG_CACHE_TIME = 3600 * 1000;
export const MAX_REFETCH_INTERVAL = 24 * 3600 * 1000;
