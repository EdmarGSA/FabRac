// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next'; // Para traduções

/**
 * Componente para proteger rotas.
 * Redireciona para o login se o usuário não estiver autenticado.
 * Redireciona para o dashboard se não tiver o perfil necessário.
 * @param {object} props
 * @param {Array<string>} props.allowedProfiles - Array de perfis que têm permissão para acessar esta rota.
 */
const ProtectedRoute = ({ allowedProfiles }) => {
  const { isAuthenticated, isLoading, hasProfile } = useAuth();
  const { t } = useTranslation();

  if (isLoading) {
    // Pode renderizar um spinner de carregamento aqui enquanto a autenticação está sendo verificada
    return <div>{t('common.loading_auth')}</div>;
  }

  if (!isAuthenticated) {
    // Se não estiver autenticado, redireciona para a página de login
    return <Navigate to="/" replace />;
  }

  // Verifica se o usuário tem o perfil necessário, incluindo o admin que tem acesso a tudo
  if (!hasProfile(allowedProfiles)) {
    // Se não tiver o perfil necessário, redireciona para o dashboard ou uma página de "acesso negado"
    console.warn(`Acesso negado: Usuário não tem o perfil necessário para acessar esta rota. Perfis permitidos: ${allowedProfiles.join(', ')}`);
    // Poderíamos ter uma página dedicada a "Acesso Negado"
    return <Navigate to="/dashboard" replace />;
  }

  // Se estiver autenticado e tiver o perfil, renderiza os componentes filhos da rota
  return <Outlet />;
};

export default ProtectedRoute;
