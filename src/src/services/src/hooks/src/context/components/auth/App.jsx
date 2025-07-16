// src/App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Importa o provedor de autenticação
import AppRoutes from './routes'; // Importa as rotas
import './App.css'; // Estilos globais para a aplicação
import './assets/styles/global.css'; // Estilos adicionais globais

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* AuthProvider envolve toda a aplicação para fornecer o contexto de autenticação */}
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
