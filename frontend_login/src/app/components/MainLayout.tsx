import { Outlet } from 'react-router';

import { useApp, AppProvider } from '../context/AppContext';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

function LayoutContent() {
  const { error } = useApp();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      {error && (
        <div className="border-b border-red-200 bg-red-50 px-6 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function MainLayout() {
  return (
    <AppProvider>
      <LayoutContent />
    </AppProvider>
  );
}
