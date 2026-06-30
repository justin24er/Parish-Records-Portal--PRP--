// frontend/src/pages/auth/LoginPage.jsx

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth }   from '../../contexts/AuthContext';
import { ROUTES }    from '../../constants/routes';
import { APP_ABBR, APP_NAME, PARISH_NAME, PARISH_DIOCESE } from '../../constants/app';

// ── Validation schema ──────────────────────────────────────────
const schema = z.object({
  email:      z.string().email('Barua pepe si sahihi'),
  password:   z.string().min(6, 'Nywila lazima iwe herufi 6 au zaidi'),
  rememberMe: z.boolean().optional(),
});

// ── Features list shown on left panel ─────────────────────────
const FEATURES = [
  'Usimamizi wa waumini wa parokia',
  'Rekodi za sakramenti (ubatizo, kipaimara, ndoa)',
  'Uchapishaji wa vyeti rasmi',
  'Vitabu vya kanisa vya kidijitali',
  'Ripoti na takwimu za parokia',
];

export default function LoginPage() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from?.pathname || ROUTES.DASHBOARD;

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { rememberMe: false } });

  async function onSubmit(data) {
    setIsLoading(true);
    const tid = toast.loading('Inaingia...');
    try {
      await login(data);
      toast.dismiss(tid);
      toast.success('Karibu! Umeingia kwa mafanikio.');
      navigate(from, { replace: true });
    } catch (err) {
      toast.dismiss(tid);
      toast.error(err?.message || 'Barua pepe au nywila si sahihi.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-page">
      {/* ── Left branding panel ── */}
      <div className="auth-panel-left">
        <motion.div
          className="auth-brand"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.6 }}
        >
          <div className="auth-logo-wrap">
            <img src="/PRP_logo.png" alt={`${APP_ABBR} Logo`} />
          </div>
          <h1 className="auth-app-name">{APP_NAME}</h1>
          <p className="auth-tagline">
            Mfumo wa kisasa wa kusimamia rekodi za parokia — salama, rahisi na wa kuamini.
          </p>
        </motion.div>

        <motion.div
          className="auth-features"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {FEATURES.map((f) => (
            <div className="auth-feature" key={f}>
              <span className="auth-feature-dot" />
              {f}
            </div>
          ))}
        </motion.div>

        <motion.p
          style={{ color: 'rgba(255,255,255,0.3)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-10)', zIndex: 1 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {PARISH_DIOCESE}
        </motion.p>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-panel-right">
        <motion.div
          className="auth-form-container"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0  }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="auth-form-header">
            <h2 className="auth-form-title">Ingia (Sign In)</h2>
            <p className="auth-form-subtitle">
              Ingiza taarifa zako ili kuendelea na mfumo.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Barua Pepe <span className="label-helper">(Email)</span>
                <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  id="email"
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="mfano@parokia.go.tz"
                  autoComplete="email"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <span className="form-error">{errors.email.message}</span>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Nywila <span className="label-helper">(Password)</span>
                <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control has-icon-right ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPassword(p => !p)}
                  aria-label={showPassword ? 'Ficha nywila' : 'Onyesha nywila'}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <span className="form-error">{errors.password.message}</span>
              )}
            </div>

            {/* Remember me + Forgot password */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
              <label className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  {...register('rememberMe')}
                />
                <span className="form-check-label">Nikumbuke</span>
              </label>
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 'var(--weight-medium)' }}
              >
                Umesahau nywila?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`btn btn-primary w-full btn-lg ${isLoading ? 'btn-loading' : ''}`}
              disabled={isLoading}
            >
              {!isLoading && 'Ingia'}
            </button>
          </form>

          {/* Demo credentials notice */}
          <div style={{
            marginTop: 'var(--space-6)',
            padding: 'var(--space-4)',
            background: 'var(--color-primary-pale)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(26,107,74,0.15)',
          }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 'var(--weight-medium)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              <CheckCircle2 size={14} /> Taarifa za majaribio (Demo credentials):
            </p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 4 }}>
              admin@parokia.go.tz / password123
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
