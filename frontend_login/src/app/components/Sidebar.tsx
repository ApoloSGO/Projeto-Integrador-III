import { Link, useParams } from 'react-router';
import { ChevronRight, FolderOpen } from 'lucide-react';

import { useApp } from '../context/AppContext';

export function Sidebar() {
  const { projects, isLoading } = useApp();
  const { projectId } = useParams();

  return (
    <aside className="w-96 overflow-auto border-r border-gray-200 bg-white">
      <div className="p-6">
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
          <FolderOpen className="h-4 w-4" />
          <span className="uppercase tracking-wide">Projetos Ativos</span>
        </div>

        <div className="space-y-2">
          {isLoading && (
            <div className="rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500">
              Carregando projetos...
            </div>
          )}
          {!isLoading && projects.length === 0 && (
            <div className="rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500">
              Nenhum projeto cadastrado ainda.
            </div>
          )}
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/dashboard/project/${project.id}`}
              className={`block rounded-lg border p-4 transition-all ${
                projectId === project.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3
                    className={`mb-1 font-medium ${
                      projectId === project.id ? 'text-blue-600' : 'text-gray-900'
                    }`}
                  >
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-600">{project.description}</p>
                  <div className="mt-3 inline-flex items-center rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">
                    {project.versions.length} {project.versions.length === 1 ? 'VERSAO' : 'VERSOES'}
                  </div>
                </div>
                <ChevronRight
                  className={`h-5 w-5 flex-shrink-0 ${
                    projectId === project.id ? 'text-blue-600' : 'text-gray-400'
                  }`}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
