// frontend/src/pages/auth/ResetPasswordPage.jsx

import { useState }      from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm }       from 'react-hook-form';
import { zodResolver }   from '@hookform/resolvers/zod';
import { z }             from 'zod';
import { motion }        from 'framer-motion';
import { Eye, EyeOff, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast             from 'react-hot-toast';

import { authService }   from '../../services/api';
import { ROUTES }        from '../../constants/routes';
import { APP_ABBR }      from '../../constants/app';

const schema = z.object({
  password: z
    .string()
    .min(8, 'Nywila lazima iwe herufi 8 au zaidi')
    .regex(/[A-Z]/, 'Lazima iwe na herufi kubwa angalau moja')
    .regex(/[0-9]/, 'Lazima iwe na nambari angalau moja'),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, {
  message: 'Nywila hazifanani',
  path: ['confirm'],
});

export default function ResetPasswordPage() {
  const [searchParams]         = useSearchParams();
  const token                  = searchParams.get('token') || '';
  const navigate               = useNavigate();
  const [done,      setDone]   = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPwd,   setShowPwd] = useState(false);
  const [showCfm,   setShowCfm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(data) {
    setIsLoading(true);
    try {
      await authService.resetPassword({ token, password: data.password });
      setDone(true);
    } catch (err) {
      toast.error(err?.message || 'Kiungo hakiko sahihi au kimeisha muda wake.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-page" style={{ justifyContent: 'center', alignItems: 'center', background: 'var(--color-bg)' }}>
      <motion.div
        style={{
          width: '100%', maxWidth: 460,
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          padding: 'var(--space-10) var(--space-8)',
        }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ duration: 0.4 }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{
            width: 64, height: 64,
            background: 'var(--color-primary-pale)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 'var(--space-3)',
          }}>
            <img src="/PRP_logo.png" alt={APP_ABBR} style={{ opacity: 0.85 }} />
          </div>
        </div>

        {!done ? (
          <>
            <div className="auth-form-header" style={{ textAlign: 'center' }}>
              <h2 className="auth-form-title">Weka Nywila Mpya</h2>
              <p className="auth-form-subtitle">Chagua nywila mpya imara kwa akaunti yako.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ marginTop: 'var(--space-6)' }}>
              {/* New password */}
              <div className="form-group">
                <label className="form-label" htmlFor="password">
                  Nywila Mpya <span className="label-helper">(New Password)</span>
                  <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    id="password"
                    type={showPwd ? 'text' : 'password'}
                    className={`form-control has-icon-right ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="••••••••"
                    {...register('password')}
                  />
                  <button type="button" className="input-icon-right"
                    onClick={() => setShowPwd(p => !p)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <span className="form-error">{errors.password.message}</span>}
              </div>

              {/* Confirm password */}
              <div className="form-group">
                <label className="form-label" htmlFor="confirm">
                  Thibitisha Nywila <span className="label-helper">(Confirm Password)</span>
                  <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    id="confirm"
                    type={showCfm ? 'text' : 'password'}
                    className={`form-control has-icon-right ${errors.confirm ? 'is-invalid' : ''}`}
                    placeholder="••••••••"
                    {...register('confirm')}
                  />
                  <button type="button" className="input-icon-right"
                    onClick={() => setShowCfm(p => !p)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    {showCfm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirm && <span className="form-error">{errors.confirm.message}</span>}
              </div>

              {/* Password requirements hint */}
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-5)', lineHeight: 1.7 }}>
                Nywila lazima iwe na herufi 8+, herufi kubwa moja, na nambari moja.
              </div>

              <button
                type="submit"
                className={`btn btn-primary w-full btn-lg ${isLoading ? 'btn-loading' : ''}`}
                disabled={isLoading}
              >
                {!isLoading && 'Weka Nywila Mpya'}
              </button>
            </form>
          </>
        ) : (
          <motion.div
            style={{ textAlign: 'center' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <CheckCircle2
              size={56}
              strokeWidth={1.5}
              style={{ color: 'var(--color-success)', margin: '0 auto var(--space-4)' }}
            />
            <h2 className="auth-form-title">Nywila Imebadilishwa!</h2>
            <p className="auth-form-subtitle" style={{ marginTop: 'var(--space-2)', lineHeight: 1.7 }}>
              Nywila yako mpya imewekwa kwa mafanikio. Unaweza sasa kuingia kwenye mfumo.
            </p>
            <button
              className="btn btn-primary btn-lg"
              style={{ marginTop: 'var(--space-6)', width: '100%' }}
              onClick={() => navigate(ROUTES.LOGIN)}
            >
              Nenda Kwenye Kuingia
            </button>
          </motion.div>
        )}

        {!done && (
          <div style={{ textAlign: 'center', marginTop: 'var(--space-5)' }}>
            <Link
              to={ROUTES.LOGIN}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-sm)', color: 'var(--color-primary)' }}
            >
              <ArrowLeft size={16} /> Rudi kwenye kuingia
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
