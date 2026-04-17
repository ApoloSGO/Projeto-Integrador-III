import { Link } from 'react-router';
import { AlertCircle, ChevronRight, Clock, MessageSquare } from 'lucide-react';

import { useApp } from '../context/AppContext';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface ProjectErrorsProps {
  projectId: string;
}

export function ProjectErrors({ projectId }: ProjectErrorsProps) {
  const { projects, feedbacks } = useApp();

  const project = projects.find((item) => item.id === projectId);
  const versionLabels = new Map(project?.versions.map((version) => [version.id, version.versionNumber]) || []);

  const openErrors = feedbacks
    .filter(
      (feedback) =>
        feedback.projectId === projectId &&
        feedback.type === 'Erro' &&
        feedback.status !== 'Resolvido',
    )
    .sort((first, second) => second.updatedAt.getTime() - first.updatedAt.getTime());

  if (openErrors.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 border border-red-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-red-100 p-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Erros em aberto</h2>
            <p className="text-sm text-gray-600">
              {openErrors.length} {openErrors.length === 1 ? 'feedback de erro pendente' : 'feedbacks de erro pendentes'}
            </p>
          </div>
        </div>
        <Link to="/dashboard/errors">
          <Button variant="outline" size="sm">
            Ver análise completa
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {openErrors.slice(0, 3).map((feedback) => (
          <div
            key={feedback.id}
            className="rounded-lg border border-red-100 bg-red-50 p-4"
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="destructive">Erro</Badge>
              <Badge variant="outline">{feedback.status}</Badge>
              {versionLabels.get(feedback.versionId) && (
                <Badge variant="outline">v{versionLabels.get(feedback.versionId)}</Badge>
              )}
            </div>
            <p className="mb-3 text-sm text-gray-700">{feedback.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Reportado no fluxo de feedback</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{feedback.updatedAt.toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
