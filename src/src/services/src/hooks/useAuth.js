// src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Hook customizado para acessar o contexto de autenticação.
 * Retorna o estado do usuário (user, session, isLoading, isAuthenticated, profiles)
 * e as funções de autenticação (signIn, signUp, signOut, resetPassword).
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
