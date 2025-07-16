// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Variáveis de ambiente VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não estão definidas.");
  // Em um ambiente de produção, você pode querer lançar um erro ou lidar com isso de forma mais robusta.
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Adiciona um listener para o evento de autenticação, útil para depuração e para futuras lógicas
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase Auth Event:', event, 'Session:', session);
});
