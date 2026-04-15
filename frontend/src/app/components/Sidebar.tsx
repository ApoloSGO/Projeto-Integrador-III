import { useApp } from '../context/AppContext';
import { Link, useParams } from 'react-router';
import { ChevronRight, FolderOpen } from 'lucide-react';

export function Sidebar() {
  const { projects } = useApp();
  const { projectId } = useParams();

  return (
    <aside className="w-96 bg-white border-r border-gray-200 overflow-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
          <FolderOpen className="w-4 h-4" />
          <span className="uppercase tracking-wide">Projetos Ativos</span>
        </div>
        
        <div className="space-y-2">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/project/${project.id}`}
              className={`block p-4 rounded-lg border transition-all ${
                projectId === project.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className={`font-medium mb-1 ${
                    projectId === project.id ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-600">{project.description}</p>
                  <div className="mt-3 inline-flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {project.versions.length} {project.versions.length === 1 ? 'VERSÃO' : 'VERSÕES'}
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 flex-shrink-0 ${
                  projectId === project.id ? 'text-blue-600' : 'text-gray-400'
                }`} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
