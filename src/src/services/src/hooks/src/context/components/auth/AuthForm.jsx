// src/components/auth/AuthForm.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'; // Para traduções
import { useAuth } from '../../hooks/useAuth'; // O hook de autenticação
import { useNavigate } from 'react-router-dom'; // Para redirecionar

function AuthForm({ type }) {
  const { t } = useTranslation();
  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      if (type === 'login') {
        await signIn(email, password);
        setMessage(t('auth.login_success'));
        navigate('/dashboard'); // Redireciona para o dashboard após o login
      } else if (type === 'register') {
        await signUp(email, password);
        setMessage(t('auth.register_success_email_sent'));
        // Não redireciona imediatamente, espera a confirmação do email
      } else if (type === 'reset-password') {
        await resetPassword(email);
        setMessage(t('auth.reset_password_email_sent'));
      }
    } catch (err) {
      console.error('Erro de autenticação:', err.message);
      setError(t('auth.error_prefix') + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>{type === 'login' ? t('login') : type === 'register' ? t('auth.register') : t('auth.reset_password')}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">{t('auth.email')}</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label={t('auth.email')}
          />
        </div>
        {(type === 'login' || type === 'register') && (
          <div className="form-group">
            <label htmlFor="password">{t('auth.password')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={type !== 'reset-password'}
              aria-label={t('auth.password')}
            />
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? t('auth.loading') : type === 'login' ? t('login') : type === 'register' ? t('auth.register') : t('auth.send_reset_link')}
        </button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {type === 'login' && (
        <p className="auth-links">
          {t('auth.no_account_yet')} <a onClick={() => navigate('/register')}>{t('auth.register_now')}</a>
          <br />
          <a onClick={() => navigate('/reset-password')}>{t('auth.forgot_password')}</a>
        </p>
      )}
      {type === 'register' && (
        <p className="auth-links">
          {t('auth.already_have_account')} <a onClick={() => navigate('/')}>{t('login')}</a>
        </p>
      )}
      {type === 'reset-password' && (
        <p className="auth-links">
          <a onClick={() => navigate('/')}>{t('login')}</a>
        </p>
      )}
    </div>
  );
}

export default AuthForm;
