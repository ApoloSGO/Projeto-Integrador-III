import { useState } from 'react';
import { useApp, type Version } from '../context/AppContext';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Clock, CheckCircle2, MessageSquare, ArrowUpCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PromoteVersionDialog } from './PromoteVersionDialog';
import { FeedbackDialog } from './FeedbackDialog';

interface VersionCardProps {
  version: Version;
}

export function VersionCard({ version }: VersionCardProps) {
  const { feedbacks } = useApp();
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);

  const versionFeedbacks = feedbacks.filter(f => f.versionId === version.id);
  const openFeedbacksCount = versionFeedbacks.filter(f => f.status !== 'Resolvido').length;

  const statusColors = {
    Alpha: 'bg-purple-100 text-purple-700 border-purple-200',
    Beta: 'bg-orange-100 text-orange-700 border-orange-200',
    Estável: 'bg-green-100 text-green-700 border-green-200',
  };

  const canPromote = version.status === 'Alpha' || version.status === 'Beta';

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-2xl font-semibold text-gray-900">
                {version.versionNumber}
              </h3>
              <Badge className={`uppercase text-xs font-medium border ${statusColors[version.status]}`}>
                {version.status}
              </Badge>
              {canPromote && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPromoteDialogOpen(true)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <ArrowUpCircle className="w-4 h-4 mr-1.5" />
                  Promover para {version.status === 'Alpha' ? 'Beta' : 'Estável'}
                </Button>
              )}
            </div>
            
            <p className="text-gray-700 mb-4">{version.description}</p>
            
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Lançada em {format(version.releaseDate, "dd/MM/yyyy", { locale: ptBR })}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <CheckCircle2 className="w-4 h-4" />
                <span>{version.isReleased ? 'Lançado' : 'Não lançado'}</span>
              </div>
              {openFeedbacksCount > 0 && (
                <div className="flex items-center gap-2 text-orange-600">
                  <MessageSquare className="w-4 h-4" />
                  <span>{openFeedbacksCount} feedback{openFeedbacksCount !== 1 ? 's' : ''} pendente{openFeedbacksCount !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>

          <Button 
            variant="outline"
            onClick={() => setIsFeedbackDialogOpen(true)}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Registrar Feedback
          </Button>
        </div>

        {/* Feedbacks List */}
        {versionFeedbacks.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Feedbacks ({versionFeedbacks.length})</h4>
            <div className="space-y-2">
              {versionFeedbacks.slice(0, 3).map((feedback) => (
                <div key={feedback.id} className="bg-gray-50 rounded-lg p-3 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={feedback.type === 'Erro' ? 'destructive' : 'default'} className="text-xs">
                          {feedback.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {feedback.status}
                        </Badge>
                      </div>
                      <p className="text-gray-700">{feedback.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <PromoteVersionDialog
        open={isPromoteDialogOpen}
        onOpenChange={setIsPromoteDialogOpen}
        version={version}
      />

      <FeedbackDialog
        open={isFeedbackDialogOpen}
        onOpenChange={setIsFeedbackDialogOpen}
        versionId={version.id}
      />
    </>
  );
}
