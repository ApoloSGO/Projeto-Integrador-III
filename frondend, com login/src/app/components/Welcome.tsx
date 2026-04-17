import { Package } from 'lucide-react';

export function Welcome() {
  return (
    <div className="h-full flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 inline-flex mb-6">
          <Package className="w-16 h-16 text-blue-400" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Bem-vindo ao VersionTrack
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Selecione um projeto na barra lateral para gerenciar suas versões e feedbacks.
        </p>
      </div>
    </div>
  );
}
