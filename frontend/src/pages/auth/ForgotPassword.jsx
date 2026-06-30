// frontend/src/pages/auth/ForgotPasswordPage.jsx

import { useState } from 'react';
import { Link }     from 'react-router-dom';
import { useForm }  from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z }        from 'zod';
import { motion }   from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast        from 'react-hot-toast';

import { authService } from '../../services/api';
import { ROUTES }      from '../../constants/routes';
import { APP_ABBR }    from '../../constants/app';

const schema = z.object({
  email: z.string().email('Barua pepe si sahihi'),
});

export default function ForgotPasswordPage() {
  const [sent, setSent]         = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(data) {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data);
      setSent(true);
    } catch (err) {
      toast.error(err?.message || 'Hitilafu. Jaribu tena baadaye.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-page" style={{ justifyContent: 'center', alignItems: 'center', background: 'var(--color-bg)' }}>
      <motion.div
        style={{
          width: '100%', maxWidth: 440,
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
            <img src="/PRP_logo.png" alt={APP_ABBR} style={{ filter: 'hue-rotate(0deg)', opacity: 0.85 }} />
          </div>
        </div>

        {!sent ? (
          <>
            <div className="auth-form-header" style={{ textAlign: 'center' }}>
              <h2 className="auth-form-title">Sahau Nywila?</h2>
              <p className="auth-form-subtitle">
                Ingiza barua pepe yako na tutakutumia maelekezo ya kurejesha nywila yako.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ marginTop: 'var(--space-6)' }}>
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
                    placeholder="barua@parokia.go.tz"
                    autoComplete="email"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <span className="form-error">{errors.email.message}</span>
                )}
              </div>

              <button
                type="submit"
                className={`btn btn-primary w-full btn-lg ${isLoading ? 'btn-loading' : ''}`}
                disabled={isLoading}
              >
                {!isLoading && 'Tuma Maelekezo'}
              </button>
            </form>
          </>
        ) : (
          <motion.div
            style={{ textAlign: 'center' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1   }}
          >
            <CheckCircle2
              size={56}
              strokeWidth={1.5}
              style={{ color: 'var(--color-success)', margin: '0 auto var(--space-4)' }}
            />
            <h2 className="auth-form-title">Barua Imetumwa!</h2>
            <p className="auth-form-subtitle" style={{ marginTop: 'var(--space-2)', lineHeight: 1.7 }}>
              Tumekutumia maelekezo ya kurejesha password yako kwenye{' '}
              <strong>{getValues('email')}</strong>. Angalia kikasha chako cha barua pepe.
            </p>
          </motion.div>
        )}

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
          <Link
            to={ROUTES.LOGIN}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-sm)', color: 'var(--color-primary)' }}
          >
            <ArrowLeft size={16} /> Rudi kwenye ukurasa wa kuingia
          </Link>
        </div>
      </motion.div>
    </div>
  );
}