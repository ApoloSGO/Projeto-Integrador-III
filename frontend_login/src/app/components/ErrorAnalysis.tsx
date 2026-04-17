import { useState } from 'react';
import { Link } from 'react-router';
import { Clock, ExternalLink, FolderOpen, Search } from 'lucide-react';

import { useApp } from '../context/AppContext';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export function ErrorAnalysis() {
  const { projects, feedbacks, isLoading } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');

  const versionLabels = new Map(
    projects.flatMap((project) =>
      project.versions.map((version) => [version.id, version.versionNumber] as const),
    ),
  );

  const errorFeedbacks = feedbacks
    .filter((feedback) => feedback.type === 'Erro')
    .filter((feedback) => {
      const matchesSearch = feedback.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || feedback.status === statusFilter;
      const matchesProject = projectFilter === 'all' || feedback.projectId === projectFilter;

      return matchesSearch && matchesStatus && matchesProject;
    })
    .sort((first, second) => second.updatedAt.getTime() - first.updatedAt.getTime());

  const groupedErrors = projects
    .map((project) => ({
      project,
      feedbacks: errorFeedbacks.filter((feedback) => feedback.projectId === project.id),
    }))
    .filter((group) => group.feedbacks.length > 0);

  const openCount = errorFeedbacks.filter((feedback) => feedback.status === 'Aberto').length;
  const progressCount = errorFeedbacks.filter(
    (feedback) => feedback.status === 'Em Andamento',
  ).length;
  const resolvedCount = errorFeedbacks.filter(
    (feedback) => feedback.status === 'Resolvido',
  ).length;

  if (isLoading) {
    return <div className="p-8 text-gray-500">Carregando análise de erros...</div>;
  }

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="mx-auto max-w-7xl p-8">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-semibold text-gray-900">Análise de Erros</h1>
          <p className="text-gray-600">
            Acompanhe os feedbacks de bug reportados em cada projeto.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="border border-gray-200 bg-white p-6">
            <p className="mb-1 text-sm text-gray-600">Total de relatos</p>
            <p className="text-2xl font-semibold text-gray-900">{errorFeedbacks.length}</p>
          </Card>
          <Card className="border border-gray-200 bg-white p-6">
            <p className="mb-1 text-sm text-gray-600">Abertos</p>
            <p className="text-2xl font-semibold text-red-600">{openCount}</p>
          </Card>
          <Card className="border border-gray-200 bg-white p-6">
            <p className="mb-1 text-sm text-gray-600">Em andamento</p>
            <p className="text-2xl font-semibold text-orange-600">{progressCount}</p>
          </Card>
          <Card className="border border-gray-200 bg-white p-6">
            <p className="mb-1 text-sm text-gray-600">Resolvidos</p>
            <p className="text-2xl font-semibold text-green-600">{resolvedCount}</p>
          </Card>
        </div>

        <Card className="mb-6 border border-gray-200 bg-white p-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por descrição do erro..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-full md:w-60">
                <SelectValue placeholder="Projeto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os projetos</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-56">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="Aberto">Aberto</SelectItem>
                <SelectItem value="Em Andamento">Em andamento</SelectItem>
                <SelectItem value="Resolvido">Resolvido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <div className="space-y-6">
          {groupedErrors.length === 0 ? (
            <Card className="border border-gray-200 bg-white p-12 text-center text-gray-500">
              Nenhum feedback de erro encontrado com os filtros atuais.
            </Card>
          ) : (
            groupedErrors.map(({ project, feedbacks: projectFeedbacks }) => (
              <div key={project.id}>
                <div className="rounded-t-xl border border-b-0 border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <FolderOpen className="h-5 w-5 text-blue-600" />
                      <div>
                        <h2 className="font-semibold text-gray-900">{project.name}</h2>
                        <p className="text-sm text-gray-600">{project.description}</p>
                      </div>
                    </div>
                    <Link to={`/dashboard/project/${project.id}`}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Ver projeto
                      </Button>
                    </Link>
                  </div>
                </div>

                {projectFeedbacks.map((feedback, index) => (
                  <Card
                    key={feedback.id}
                    className={`border border-gray-200 bg-white p-6 ${
                      index === projectFeedbacks.length - 1
                        ? 'rounded-b-xl'
                        : 'rounded-b-none border-b-0'
                    }`}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <Badge variant="destructive">Erro</Badge>
                          <Badge variant="outline">{feedback.status}</Badge>
                          {versionLabels.get(feedback.versionId) && (
                            <Badge variant="outline">v{versionLabels.get(feedback.versionId)}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">{feedback.description}</p>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{feedback.updatedAt.toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
