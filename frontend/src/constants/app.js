// frontend/src/constants/app.js

export const APP_NAME    = 'Parish Records Portal';
export const APP_ABBR    = 'PRP';
export const APP_VERSION = '1.0.0';

// NOTE: PARISH_NAME/PARISH_DIOCESE below are just local fallbacks shown
// before a parish profile is loaded from the backend. This system is built
// for ANY parish/diocese to use — each installation configures its own
// parish name via the Mipangilio (Settings) page or backend `parishes` table,
// it is not tied to a single diocese.
export const PARISH_NAME    = 'Parokia Yako';
export const PARISH_TAGLINE = 'Mfumo wa Kidijitali kwa Parokia Yoyote';

export const SPLASH_DURATION_MS = 2800;

export const STORAGE_KEYS = {
  TOKEN:       'prp_token',
  USER:        'prp_user',
  REMEMBER_ME: 'prp_remember',
  SIDEBAR:     'prp_sidebar_collapsed',
};

export const SACRAMENT_TYPES = {
  UBATIZO:    'ubatizo',
  KIPAIMARA:  'kipaimara',
  EKARISTI:   'ekaristi',
  NDOA:       'ndoa',
  UPADRE:     'upadre',
  MAZISHI:    'mazishi',
};

export const SACRAMENT_LABELS = {
  [SACRAMENT_TYPES.UBATIZO]:   'Ubatizo (Baptism)',
  [SACRAMENT_TYPES.KIPAIMARA]: 'Kipaimara (Confirmation)',
  [SACRAMENT_TYPES.EKARISTI]:  'Ekaristi ya Kwanza (First Communion)',
  [SACRAMENT_TYPES.NDOA]:      'Ndoa (Marriage)',
  [SACRAMENT_TYPES.UPADRE]:    'Upadre (Holy Orders)',
  [SACRAMENT_TYPES.MAZISHI]:   'Mazishi (Funeral)',
};

export const USER_ROLES = {
  ADMIN:     'admin',
  SECRETARY: 'secretary',
  VIEWER:    'viewer',
};

export const GENDER_OPTIONS = [
  { value: 'me',  label: 'Me (Male)'   },
  { value: 'ke',  label: 'Ke (Female)' },
];

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
export const DEFAULT_PAGE_SIZE  = 25;

export const DATE_FORMAT    = 'DD/MM/YYYY';
export const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm';
