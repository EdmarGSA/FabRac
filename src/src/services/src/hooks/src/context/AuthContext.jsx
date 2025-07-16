// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { authService } from '../services/authService'; // Importa o serviço de autenticação

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profiles, setProfiles] = useState([]); // Armazena os perfis do usuário logado

  const fetchUserAndProfiles = useCallback(async (sessionData) => {
    if (sessionData && sessionData.user) {
      setUser(sessionData.user);
      setSession(sessionData);
      try {
        const userProfiles = await authService.getUserProfiles(sessionData.user.id);
        setProfiles(userProfiles);
      } catch (profileError) {
        console.error('Erro ao buscar perfis do usuário:', profileError.message);
        setProfiles([]); // Garante que perfis seja um array vazio em caso de erro
      }
    } else {
      setUser(null);
      setSession(null);
      setProfiles([]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Escuta mudanças no estado de autenticação do Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        // console.log('Auth State Changed:', _event, newSession);
        await fetchUserAndProfiles(newSession);

        // Se o evento for SIGN_UP, e não houver um registro na tabela 'users', cria um.
        // Isso é crucial para o primeiro admin e para usuários subsequentes.
        if (_event === 'SIGNED_IN' && newSession && newSession.user) {
          try {
            const { data: existingUserEntry, error } = await supabase
              .from('users')
              .select('id')
              .eq('id', newSession.user.id)
              .single();

            if (error && error.code === 'PGRST116') { // Código para "não encontrado"
              // Se não encontrou, insere na tabela 'users'.
              // Para o PRIMEIRO usuário, atribui o perfil 'admin'.
              // Para os demais, atribui um perfil padrão vazio para o admin depois atribuir.
              const { data: countData, error: countError } = await supabase
                .from('users')
                .select('id', { count: 'exact' });

              if (countError) throw countError;

              const isFirstUser = countData.count === 0;
              const initialProfiles = isFirstUser ? ['admin'] : ['pending']; // 'pending' para admin atribuir

              await authService.createUserEntry(newSession.user.id, newSession.user.email, initialProfiles);
              // Após criar a entrada, recarrega os perfis para que o AuthContext reflita a mudança
              await fetchUserAndProfiles(newSession);
            } else if (error) {
              throw error;
            }
          } catch (dbError) {
            console.error('Erro ao verificar/criar entrada de usuário na tabela "users":', dbError.message);
          }
        }
      }
    );

    // No carregamento inicial, tenta obter a sessão
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      fetchUserAndProfiles(initialSession);
    });

    return () => {
      authListener.unsubscribe();
    };
  }, [fetchUserAndProfiles]); // Adiciona fetchUserAndProfiles como dependência do useEffect

  const isAuthenticated = !!user && !!session;

  const value = {
    user,
    session,
    profiles,
    isLoading,
    isAuthenticated,
    // Expõe as funções do authService
    signUp: authService.signUp,
    signIn: authService.signIn,
    signOut: authService.signOut,
    resetPassword: authService.resetPassword,
    // Adiciona uma função para verificar perfil
    hasProfile: (requiredProfiles) => {
      if (!profiles || profiles.length === 0) return false;
      if (profiles.includes('admin')) return true; // Admin sempre tem acesso total
      return requiredProfiles.some(profile => profiles.includes(profile));
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
