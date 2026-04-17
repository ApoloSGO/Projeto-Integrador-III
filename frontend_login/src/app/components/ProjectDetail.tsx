import { useState } from 'react';
import { useParams } from 'react-router';
import { GitBranch, Plus, Search } from 'lucide-react';

import { useApp, type VersionStatus } from '../context/AppContext';
import { NewVersionDialog } from './NewVersionDialog';
import { ProjectErrors } from './ProjectErrors';
import { VersionCard } from './VersionCard';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function ProjectDetail() {
  const { projectId } = useParams();
  const { projects, isLoading } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<VersionStatus | 'Todos'>('Todos');
  const [isNewVersionDialogOpen, setIsNewVersionDialogOpen] = useState(false);

  const project = projects.find((item) => item.id === projectId);

  if (isLoading) {
    return <div className="p-8 text-gray-500">Carregando projeto...</div>;
  }

  if (!project) {
    return <div className="p-8">Projeto não encontrado</div>;
  }

  const filteredVersions = project.versions
    .filter((version) => {
      const matchesSearch =
        version.versionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        version.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'Todos' || version.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((first, second) => second.releaseDate.getTime() - first.releaseDate.getTime());

  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto max-w-7xl p-8">
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-8">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <h1 className="mb-2 text-3xl font-semibold text-gray-900">{project.name}</h1>
              <p className="mb-4 text-gray-600">{project.description}</p>
              {project.repositoryUrl && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <GitBranch className="h-4 w-4" />
                  <span>{project.repositoryUrl}</span>
                </div>
              )}
            </div>
            <Button variant="outline" className="flex-shrink-0">
              <GitBranch className="mr-2 h-4 w-4" />
              Sincronizar Git
            </Button>
          </div>
        </div>

        <ProjectErrors projectId={project.id} />

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex flex-wrap items-center gap-4">
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

            <div className="relative min-w-64 flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Filtrar por versão..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-10"
              />
            </div>

            <Button
              onClick={() => setIsNewVersionDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Versão
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredVersions.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
              <p className="text-gray-500">Nenhuma versão encontrada</p>
            </div>
          ) : (
            filteredVersions.map((version) => <VersionCard key={version.id} version={version} />)
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
