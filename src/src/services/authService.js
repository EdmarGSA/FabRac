// src/services/authService.js
import { supabase } from '../supabaseClient';

export const authService = {
  /**
   * Registra um novo usuário com email e senha.
   * O Supabase enviará um email de confirmação.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<object>} Objeto de usuário ou erro.
   */
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Faz login de um usuário com email e senha.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<object>} Objeto de sessão ou erro.
   */
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Faz logout do usuário atual.
   * @returns {Promise<object>} Objeto vazio em caso de sucesso ou erro.
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return {};
  },

  /**
   * Envia um email para redefinir a senha do usuário.
   * @param {string} email
   * @returns {Promise<object>} Objeto vazio em caso de sucesso ou erro.
   */
  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`, // Você precisará criar esta rota
    });
    if (error) throw error;
    return {};
  },

  /**
   * Obtém a sessão do usuário atual.
   * @returns {Promise<object>} Objeto de sessão ou nulo.
   */
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  /**
   * Obtém os detalhes do usuário atual.
   * @returns {Promise<object>} Objeto de usuário ou nulo.
   */
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  /**
   * Atualiza o perfil do usuário (ex: nome, perfis).
   * Note: Para atualizar 'profiles', o RLS precisará permitir isso e talvez apenas para admins.
   * @param {string} userId
   * @param {object} updates
   * @returns {Promise<object>} Dados do usuário atualizados ou erro.
   */
  async updateUserProfile(userId, updates) {
    const { data, error } = await supabase.from('users').update(updates).eq('id', userId);
    if (error) throw error;
    return data;
  },

  /**
   * Obtém os perfis de um usuário específico da tabela 'users'.
   * @param {string} userId
   * @returns {Promise<Array<string>>} Array de strings com os perfis ou erro.
   */
  async getUserProfiles(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('profiles')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data?.profiles || [];
  },

  /**
   * Insere um novo registro na tabela 'users' após o signUp, para armazenar perfis.
   * Chamado internamente pelo hook de autenticação.
   * @param {string} userId
   * @param {string} email
   * @param {Array<string>} initialProfiles (para o primeiro usuário, 'admin')
   */
  async createUserEntry(userId, email, initialProfiles = []) {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          id: userId,
          email: email,
          profiles: initialProfiles,
          created_at: new Date().toISOString()
        }
      ]);
    if (error) throw error;
    return data;
  },
};
