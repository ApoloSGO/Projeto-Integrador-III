import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router';
import { api } from '../services/api';
import { MainLayout } from '../app/components/MainLayout';

export function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o usuário está autenticado
    if (!api.isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  // Se não está autenticado, não renderiza nada (vai redirecionar)
  if (!api.isAuthenticated()) {
    return null;
  }

  // Renderiza o layout principal da aplicação
  return <MainLayout />;
}
