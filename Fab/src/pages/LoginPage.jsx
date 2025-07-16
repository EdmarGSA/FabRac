import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    await supabase.auth.signInWithPassword({ email, password });
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('email')} required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('password')} required />
      <button type="submit">{t('login')}</button>
    </form>
  );
};

export default LoginPage;