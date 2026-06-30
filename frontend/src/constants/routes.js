// Route path definitions for the PRP application

export const ROUTES = {
  // Auth
  SPLASH:          '/',
  LOGIN:           '/ingia',
  FORGOT_PASSWORD: '/sahau-nywila',
  RESET_PASSWORD:  '/weka-nywila-mpya',

  // Dashboard
  DASHBOARD:       '/dashibodi',

  // Modules (foundation - will be extended)
  WAUMINI:         '/waumini',
  SAKRAMENTI:      '/sakramenti',
  VYETI:           '/vyeti',
  VITABU:          '/vitabu-vya-kanisa',
  RIPOTI:          '/ripoti',
  ARIFA:           '/arifa',
  MIPANGILIO:      '/mipangilio',
  WASIFU:          '/wasifu',
};

export const NAV_ITEMS = [
  {
    label:  'Dashibodi',
    path:   ROUTES.DASHBOARD,
    icon:   'LayoutDashboard',
    section: null,
  },
  {
    label:   'Waumini',
    path:    ROUTES.WAUMINI,
    icon:    'Users',
    section: 'Usimamizi',
  },
  {
    label:   'Sakramenti',
    path:    ROUTES.SAKRAMENTI,
    icon:    'Droplets',
    section: 'Usimamizi',
  },
  {
    label:   'Vyeti',
    path:    ROUTES.VYETI,
    icon:    'FileText',
    section: 'Hati',
  },
  {
    label:   'Vitabu vya Kanisa',
    path:    ROUTES.VITABU,
    icon:    'BookOpen',
    section: 'Hati',
  },
  {
    label:   'Ripoti',
    path:    ROUTES.RIPOTI,
    icon:    'BarChart2',
    section: 'Takwimu',
  },
  {
    label:   'Arifa',
    path:    ROUTES.ARIFA,
    icon:    'Bell',
    section: 'Mengine',
  },
  {
    label:   'Mipangilio',
    path:    ROUTES.MIPANGILIO,
    icon:    'Settings',
    section: 'Mengine',
  },
];

export const USER_MENU_ITEMS = [
  { label: 'Wasifu Wangu',  icon: 'User',     path: ROUTES.WASIFU },
  { label: 'Mipangilio',    icon: 'Settings', path: ROUTES.MIPANGILIO },
  { divider: true },
  { label: 'Ondoka',        icon: 'LogOut',   action: 'logout', danger: true },
];