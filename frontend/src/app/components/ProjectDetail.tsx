import { useParams } from 'react-router';
import { useApp } from '../context/AppContext';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Search, GitBranch } from 'lucide-react';
import { NewVersionDialog } from './NewVersionDialog';
import { VersionCard } from './VersionCard';
import { ProjectErrors } from './ProjectErrors';
import type { VersionStatus } from '../context/AppContext';

export function ProjectDetail() {
  const { projectId } = useParams();
  const { projects, isLoading } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<VersionStatus | 'Todos'>('Todos');
  const [isNewVersionDialogOpen, setIsNewVersionDialogOpen] = useState(false);

  const project = projects.find(p => p.id === projectId);

  if (isLoading) {
    return <div className="p-8 text-gray-500">Carregando projeto...</div>;
  }

  if (!project) {
    return <div className="p-8">Projeto não encontrado</div>;
  }

  const filteredVersions = project.versions
    .filter(version => {
      const matchesSearch = version.versionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           version.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'Todos' || version.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => b.releaseDate.getTime() - a.releaseDate.getTime());

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-7xl mx-auto p-8">
        {/* Project Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                {project.name}
              </h1>
              <p className="text-gray-600 mb-4">{project.description}</p>
              {project.repositoryUrl && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <GitBranch className="w-4 h-4" />
                  <span>{project.repositoryUrl}</span>
                </div>
              )}
            </div>
            <Button variant="outline" className="flex-shrink-0">
              <GitBranch className="w-4 h-4 mr-2" />
              Sincronizar Git
            </Button>
          </div>
        </div>

        {/* Critical Errors Section */}
        <ProjectErrors projectId={project.id} />

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant={filterStatus === 'Todos' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('Todos')}
                className={filterStatus === 'Todos' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Todos
              </Button>
              <Button
                variant={filterStatus === 'Alpha' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('Alpha')}
                className={filterStatus === 'Alpha' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Alpha
              </Button>
              <Button
                variant={filterStatus === 'Beta' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('Beta')}
                className={filterStatus === 'Beta' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Beta
              </Button>
              <Button
                variant={filterStatus === 'Estável' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('Estável')}
                className={filterStatus === 'Estável' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Estável
              </Button>
            </div>

            {/* Search */}
            <div className="flex-1 min-w-64 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Filtrar por versão..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* New Version Button */}
            <Button 
              onClick={() => setIsNewVersionDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Versão
            </Button>
          </div>
        </div>

        {/* Versions List */}
        <div className="space-y-4">
          {filteredVersions.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-gray-500">Nenhuma versão encontrada</p>
            </div>
          ) : (
            filteredVersions.map((version) => (
              <VersionCard key={version.id} version={version} />
            ))
          )}
        </div>
      </div>

      <NewVersionDialog
        open={isNewVersionDialogOpen}
        onOpenChange={setIsNewVersionDialogOpen}
        projectId={project.id}
      />
    </div>
  );
}
