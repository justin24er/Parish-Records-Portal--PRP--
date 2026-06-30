// frontend/src/pages/dashboard/DashboardPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate }         from 'react-router-dom';
import { motion }              from 'framer-motion';
import {
  Users, Droplets, FileText, BookOpen,
  TrendingUp, UserPlus, Printer, BarChart2,
  Bell, Clock, CheckCircle2, AlertCircle,
} from 'lucide-react';

import { useAuth }             from '../../contexts/AuthContext';
import { dashboardService }    from '../../services/api';
import { getGreeting, formatDateTime } from '../../utils/helpers';
import { ROUTES }              from '../../constants/routes';
import { PARISH_NAME }         from '../../constants/app';
import { SkeletonStatCard }    from '../../components/ui/SkeletonLoader';

// ── Animation helpers ──────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 18 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.4, delay, ease: 'easeOut' },
});

// ── Stat card ─────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, colorClass, trend, delay }) {
  return (
    <motion.div className="stat-card" {...fadeUp(delay)}>
      <div className={`stat-card-icon ${colorClass}`}>
        <Icon size={22} strokeWidth={1.75} />
      </div>
      <div className="stat-card-content">
        <div className="stat-card-label">{label}</div>
        <div className="stat-card-value">{value ?? '—'}</div>
        {trend && (
          <div className={`stat-card-trend ${trend.dir}`}>
            <TrendingUp size={11} />
            {trend.text}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Quick action button ────────────────────────────────────────
function QuickAction({ icon: Icon, label, color, path, onClick }) {
  return (
    <button className="quick-action-btn" onClick={onClick} type="button">
      <div className="quick-action-icon" style={{ background: color + '1a' }}>
        <Icon size={20} strokeWidth={1.75} style={{ color }} />
      </div>
      <span className="quick-action-label">{label}</span>
    </button>
  );
}

// ── Recent activity item ───────────────────────────────────────
function ActivityItem({ icon: Icon, iconBg, iconColor, title, time }) {
  return (
    <div className="activity-item">
      <div className="activity-icon" style={{ background: iconBg }}>
        <Icon size={16} strokeWidth={1.75} style={{ color: iconColor }} />
      </div>
      <div className="activity-content">
        <div className="activity-title">{title}</div>
        <div className="activity-time">{time}</div>
      </div>
    </div>
  );
}

// ── MOCK data (will be replaced by real API calls) ─────────────
const MOCK_STATS = [
  { label: 'Waumini Wote (Total Parishioners)',  value: 1_284, icon: Users,    colorClass: 'green', trend: { dir: 'up',   text: '+12 mwezi huu' } },
  { label: 'Ubatizo (Baptisms this year)',        value:    47, icon: Droplets, colorClass: 'blue',  trend: { dir: 'up',   text: '+5 mwezi huu'  } },
  { label: 'Vyeti Vilivyotolewa (Certs Issued)', value:   312, icon: FileText, colorClass: 'gold',  trend: { dir: 'up',   text: '+23 mwezi huu' } },
  { label: 'Ndoa (Marriages this year)',          value:    18, icon: BookOpen, colorClass: 'red',   trend: { dir: 'down', text: '-2 mwezi huu'  } },
];

const MOCK_ACTIVITIES = [
  { icon: UserPlus,    iconBg: 'var(--color-primary-pale)', iconColor: 'var(--color-primary)', title: 'Mwanachama mpya ameandikishwa: Maria Joseph Mwanga',        time: 'Leo, 09:14' },
  { icon: FileText,   iconBg: 'var(--color-accent-pale)',   iconColor: 'var(--color-accent)',   title: 'Cheti cha ubatizo kimetolewa: Peter Emmanuel Kileo',       time: 'Leo, 08:52' },
  { icon: CheckCircle2,iconBg:'var(--color-success-pale)',  iconColor: 'var(--color-success)',  title: 'Kipaimara kimerekodiwa: Grace Amina Salim',                 time: 'Jana, 15:30' },
  { icon: Printer,    iconBg: 'var(--color-info-pale)',     iconColor: 'var(--color-info)',     title: 'Ripoti ya mwezi imeandaliwa na Katibu',                     time: 'Jana, 11:05' },
  { icon: AlertCircle,iconBg: 'var(--color-warning-pale)', iconColor: 'var(--color-warning)',  title: 'Kumbukumbu: Ndoa ya Juma & Fatuma — Jumamosi ijayo',        time: '2 siku zilizopita' },
];

// ── Main page ──────────────────────────────────────────────────
export default function DashboardPage() {
  const { user }     = useAuth();
  const navigate     = useNavigate();
  const greeting     = getGreeting();

  const [stats,       setStats]       = useState(null);
  const [activities,  setActivities]  = useState(null);
  const [statsLoading,  setStatsLoading]  = useState(true);

  useEffect(() => {
    // Try real API, fall back to mock data gracefully
    (async () => {
      try {
        const [sRes, aRes] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getActivities(),
        ]);
        setStats(sRes.data.stats ?? MOCK_STATS);
        setActivities(aRes.data.activities ?? MOCK_ACTIVITIES);
      } catch {
        // Backend not yet connected — use mock data
        setStats(MOCK_STATS);
        setActivities(MOCK_ACTIVITIES);
      } finally {
        setStatsLoading(false);
      }
    })();
  }, []);

  const displayName = user?.jina || user?.name || 'Katibu';

  return (
    <div>
      {/* ── Welcome banner ── */}
      <motion.div className="welcome-banner" {...fadeUp(0)}>
        <div>
          <div className="welcome-greeting">{greeting}</div>
          <div className="welcome-name">{displayName} 👋</div>
          <p className="welcome-desc">
            {PARISH_NAME} — Karibu kwenye mfumo wa usimamizi wa parokia. Leo ni siku nzuri ya kufanya kazi!
          </p>
        </div>
        <img
          src="/PRP_logo.png"
          alt=""
          className="welcome-banner-logo"
          aria-hidden="true"
        />
      </motion.div>

      {/* ── Stat cards ── */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
        {statsLoading
          ? [0,1,2,3].map(i => <SkeletonStatCard key={i} />)
          : (stats ?? MOCK_STATS).map((s, i) => (
              <StatCard key={s.label} {...s} delay={i * 0.07} />
            ))
        }
      </div>

      {/* ── Main dashboard grid ── */}
      <div className="dashboard-grid">

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

          {/* Quick Actions */}
          <motion.div className="card" {...fadeUp(0.2)}>
            <div className="card-header">
              <h3 className="card-title">Vitendo vya Haraka <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', fontWeight: 400 }}>(Quick Actions)</span></h3>
            </div>
            <div className="quick-actions" style={{ margin: 0 }}>
              <QuickAction
                icon={UserPlus}   label="Ongeza Mwanachama"
                color="var(--color-primary)"
                onClick={() => navigate(ROUTES.WAUMINI)}
              />
              <QuickAction
                icon={Droplets}   label="Rekodi Sakramenti"
                color="var(--color-info)"
                onClick={() => navigate(ROUTES.SAKRAMENTI)}
              />
              <QuickAction
                icon={FileText}   label="Toa Cheti"
                color="var(--color-accent)"
                onClick={() => navigate(ROUTES.VYETI)}
              />
              <QuickAction
                icon={BookOpen}   label="Vitabu vya Kanisa"
                color="var(--color-success)"
                onClick={() => navigate(ROUTES.VITABU)}
              />
              <QuickAction
                icon={BarChart2}  label="Angalia Ripoti"
                color="var(--color-danger)"
                onClick={() => navigate(ROUTES.RIPOTI)}
              />
              <QuickAction
                icon={Bell}       label="Tuma Arifa"
                color="var(--color-warning)"
                onClick={() => navigate(ROUTES.ARIFA)}
              />
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div className="card" {...fadeUp(0.28)}>
            <div className="card-header">
              <h3 className="card-title">
                <Clock size={16} style={{ color: 'var(--color-primary)' }} />
                Shughuli za Hivi Karibuni <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', fontWeight: 400 }}>(Recent Activity)</span>
              </h3>
            </div>
            <div className="activity-list">
              {(activities ?? MOCK_ACTIVITIES).map((a, i) => (
                <ActivityItem key={i} {...a} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

          {/* Parish info summary */}
          <motion.div className="card" {...fadeUp(0.22)}>
            <div className="card-header">
              <h3 className="card-title">Taarifa za Parokia <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', fontWeight: 400 }}>(Parish Info)</span></h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                { label: 'Jina la Parokia',     value: PARISH_NAME },
                { label: 'Mtumiaji wa Sasa',     value: displayName },
                { label: 'Wasifu',               value: user?.role === 'admin' ? 'Msimamizi' : 'Katibu wa Parokia' },
                { label: 'Toleo la Mfumo',       value: 'PRP v1.0.0' },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                  paddingBottom: 'var(--space-3)',
                  borderBottom: '1px solid var(--color-border)',
                  gap: 'var(--space-3)',
                }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', flexShrink: 0 }}>{label}</span>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-primary)', textAlign: 'right' }}>{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming reminders placeholder */}
          <motion.div className="card" {...fadeUp(0.3)}>
            <div className="card-header">
              <h3 className="card-title">
                <Bell size={16} style={{ color: 'var(--color-accent)' }} />
                Vikumbusho <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', fontWeight: 400 }}>(Reminders)</span>
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                { text: 'Ndoa: Juma & Fatuma — Jumamosi',    type: 'warning' },
                { text: 'Ripoti ya mwezi — mwisho Ijumaa',   type: 'danger'  },
                { text: 'Kipaimara cha vijana — Jumapili',   type: 'info'    },
              ].map(({ text, type }, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                  padding: 'var(--space-3)',
                  background: `var(--color-${type}-pale)`,
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)',
                  color: `var(--color-${type})`,
                }}>
                  <AlertCircle size={14} strokeWidth={2} style={{ flexShrink: 0 }} />
                  {text}
                </div>
              ))}
            </div>
          </motion.div>

          {/* System status card */}
          <motion.div className="card" {...fadeUp(0.35)}>
            <div className="card-header">
              <h3 className="card-title">Hali ya Mfumo <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', fontWeight: 400 }}>(System Status)</span></h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {[
                { label: 'Seva (Server)',       ok: true  },
                { label: 'Hifadhidata (DB)',    ok: true  },
                { label: 'Hifadhi ya Faili',    ok: true  },
                { label: 'Barua Pepe (Email)',  ok: false },
              ].map(({ label, ok }) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: 'var(--space-2) 0',
                  borderBottom: '1px solid var(--color-border)',
                  fontSize: 'var(--text-sm)',
                }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)',
                    color: ok ? 'var(--color-success)' : 'var(--color-warning)',
                  }}>
                    <span style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: ok ? 'var(--color-success)' : 'var(--color-warning)',
                      display: 'inline-block',
                    }} />
                    {ok ? 'Inafanya kazi' : 'Haijasanidiwa'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
