// frontend/src/services/mockAuth.js
// ─────────────────────────────────────────────────────────────
// Temporary mock auth layer.
// Intercepts login/logout/getMe so the app works fully in the
// browser before the Next.js backend is connected.
//
// HOW IT WORKS
//   • login()  — validates credentials in-memory, stores a fake
//                session token in localStorage, returns a user object.
//   • getMe()  — reads that token back and returns the same user.
//   • logout() — clears the token.
//
// TO SWITCH TO THE REAL BACKEND
//   In services/api.js set MOCK_MODE = false  (one line change).
// ─────────────────────────────────────────────────────────────

const SESSION_KEY = 'prp_mock_session';

// ── Demo accounts ────────────────────────────────────────────
const DEMO_USERS = [
  {
    id:       '1',
    email:    'admin@parokia.go.tz',
    password: 'password123',
    jina:     'Msimamizi Mkuu',
    name:     'Msimamizi Mkuu',
    role:     'admin',
    avatar:   null,
  },
  {
    id:       '2',
    email:    'katibu@parokia.go.tz',
    password: 'password123',
    jina:     'Maria Katibu',
    name:     'Maria Katibu',
    role:     'secretary',
    avatar:   null,
  },
];

// ── Helper: strip password before returning ──────────────────
function safeUser(u) {
  const { password, ...rest } = u;
  return rest;
}

// ── Simulate async network delay ────────────────────────────
const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

// ── Mock service object ──────────────────────────────────────
export const mockAuthService = {
  async login({ email, password }) {
    await delay(600);
    const user = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) {
      const err = new Error('Barua pepe au nywila si sahihi.');
      err.status = 401;
      throw err;
    }
    const session = { userId: user.id, token: `mock-token-${Date.now()}` };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { data: { user: safeUser(user) } };
  },

  async logout() {
    await delay(200);
    localStorage.removeItem(SESSION_KEY);
    return { data: { ok: true } };
  },

  async getMe() {
    await delay(300);
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) {
      const err = new Error('Hakuna kikao. Tafadhali ingia tena.');
      err.status = 401;
      throw err;
    }
    const { userId } = JSON.parse(raw);
    const user = DEMO_USERS.find(u => u.id === userId);
    if (!user) {
      const err = new Error('Mtumiaji hakupatikana.');
      err.status = 401;
      throw err;
    }
    return { data: { user: safeUser(user) } };
  },

  async forgotPassword({ email }) {
    await delay(700);
    // Always succeeds in mock mode (don't reveal whether email exists)
    return { data: { ok: true, email } };
  },

  async resetPassword({ token, password }) {
    await delay(500);
    if (!token) {
      const err = new Error('Kiungo si sahihi.');
      err.status = 400;
      throw err;
    }
    return { data: { ok: true } };
  },
};

export const mockDashboardService = {
  async getStats() {
    await delay(400);
    return {
      data: {
        stats: [
          { label: 'Waumini Wote (Total Parishioners)',  value: 1284, icon: 'Users',    colorClass: 'green', trend: { dir: 'up',   text: '+12 mwezi huu' } },
          { label: 'Ubatizo (Baptisms this year)',        value: 47,   icon: 'Droplets', colorClass: 'blue',  trend: { dir: 'up',   text: '+5 mwezi huu'  } },
          { label: 'Vyeti Vilivyotolewa (Certs Issued)', value: 312,  icon: 'FileText', colorClass: 'gold',  trend: { dir: 'up',   text: '+23 mwezi huu' } },
          { label: 'Ndoa (Marriages this year)',          value: 18,   icon: 'BookOpen', colorClass: 'red',   trend: { dir: 'down', text: '-2 mwezi huu'  } },
        ],
      },
    };
  },

  async getActivities() {
    await delay(450);
    return {
      data: {
        activities: [
          { icon: 'UserPlus',     iconBg: 'var(--color-primary-pale)', iconColor: 'var(--color-primary)', title: 'Mwanachama mpya ameandikishwa: Maria Joseph Mwanga',  time: 'Leo, 09:14' },
          { icon: 'FileText',    iconBg: 'var(--color-accent-pale)',   iconColor: 'var(--color-accent)',   title: 'Cheti cha ubatizo kimetolewa: Peter Emmanuel Kileo', time: 'Leo, 08:52' },
          { icon: 'CheckCircle2',iconBg: 'var(--color-success-pale)',  iconColor: 'var(--color-success)',  title: 'Kipaimara kimerekodiwa: Grace Amina Salim',           time: 'Jana, 15:30' },
          { icon: 'Printer',     iconBg: 'var(--color-info-pale)',     iconColor: 'var(--color-info)',     title: 'Ripoti ya mwezi imeandaliwa na Katibu',               time: 'Jana, 11:05' },
          { icon: 'AlertCircle', iconBg: 'var(--color-warning-pale)', iconColor: 'var(--color-warning)',  title: 'Kumbukumbu: Ndoa ya Juma & Fatuma — Jumamosi ijayo',  time: '2 siku zilizopita' },
        ],
      },
    };
  },
};
