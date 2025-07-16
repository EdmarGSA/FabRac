// src/routes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import UpdatePassword from './pages/UpdatePassword'; // Nova rota para atualização de senha

import Dashboard from './pages/Dashboard';
import ProductionOrders from './pages/ProductionOrders';
import FeedFormulas from './pages/FeedFormulas';
import Payments from './pages/Payments';
import Receivables from './pages/Receivables';
import InventoryAlerts from './pages/InventoryAlerts';
import Perfil from './pages/Perfil'; // Página de perfil do usuário
import ListaUsuarios from './pages/Usuarios/ListaUsuarios'; // Gerenciamento de usuários (apenas admin)
import FormUsuario from './pages/Usuarios/FormUsuario'; // Formulário para criar/editar usuário (apenas admin)
import ListaPedidos from './pages/Pedidos/ListaPedidos'; // Módulo de vendas
import FormPedido from './pages/Pedidos/FormPedido'; // Formulário de pedido de venda
// Importe os outros componentes de página conforme sua estrutura:
// Producao/ListaOrdem.jsx, Producao/FormOrdem.jsx, etc.
// Por enquanto, vamos usar os placeholders que você já tinha, ajustando os nomes das páginas.

import ProtectedRoute from './components/ProtectedRoute'; // O componente de proteção de rota
import Layout from './components/common/Layout'; // Um layout base com Header e Sidebar

function AppRoutes() {
  return (
    <Routes>
      {/* Rotas Públicas (acessíveis sem autenticação) */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} /> {/* Rota para o link de reset de senha */}

      {/* Rotas Protegidas - Todas elas usarão o componente Layout para ter Header/Sidebar */}
      <Route element={<Layout />}>
        {/* Rotas que exigem apenas autenticação */}
        <Route element={<ProtectedRoute allowedProfiles={['admin', 'producao', 'financeiro', 'vendas', 'pending']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>

        {/* Rotas para o ADMIN */}
        <Route element={<ProtectedRoute allowedProfiles={['admin']} />}>
          <Route path="/usuarios" element={<ListaUsuarios />} />
          <Route path="/usuarios/novo" element={<FormUsuario />} />
          <Route path="/usuarios/editar/:id" element={<FormUsuario />} />
        </Route>

        {/* Rotas para PRODUÇÃO e ADMIN */}
        <Route element={<ProtectedRoute allowedProfiles={['admin', 'producao']} />}>
          <Route path="/ordens-producao" element={<ProductionOrders />} />
          <Route path="/formulas" element={<FeedFormulas />} />
          <Route path="/estoque-alertas" element={<InventoryAlerts />} />
          {/* Adicione as rotas de formulário para estas telas aqui */}
          {/* <Route path="/ordens-producao/novo" element={<FormOrdem />} /> */}
          {/* <Route path="/ordens-producao/editar/:id" element={<FormOrdem />} /> */}
        </Route>

        {/* Rotas para FINANCEIRO e ADMIN */}
        <Route element={<ProtectedRoute allowedProfiles={['admin', 'financeiro']} />}>
          <Route path="/contas-a-pagar" element={<Payments />} />
          <Route path="/contas-a-receber" element={<Receivables />} />
          {/* <Route path="/relatorios-financeiros" element={<RelatoriosFinanceiros />} /> */}
        </Route>

        {/* Rotas para VENDAS e ADMIN */}
        <Route element={<ProtectedRoute allowedProfiles={['admin', 'vendas']} />}>
          <Route path="/pedidos" element={<ListaPedidos />} />
          <Route path="/pedidos/novo" element={<FormPedido />} />
          <Route path="/pedidos/editar/:id" element={<FormPedido />} />
        </Route>

      </Route>
      {/* Catch-all para rotas não encontradas (opcional) */}
      <Route path="*" element={<div>404 - Página Não Encontrada</div>} />
    </Routes>
  );
}

export default AppRoutes;
