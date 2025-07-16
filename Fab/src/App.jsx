import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import './App.css';

function App() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener?.subscription.unsubscribe();
  }, []);

  return (
    <div className="App">
      <Header />
      {user ? <Dashboard user={user} /> : <LoginPage />}
    </div>
  );
}

export default App;