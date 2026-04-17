import { useState } from 'react';
import { useApp, type Version, type VersionStatus } from '../context/AppContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { ArrowUpCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface PromoteVersionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  version: Version;
}

export function PromoteVersionDialog({ open, onOpenChange, version }: PromoteVersionDialogProps) {
  const { updateVersionStatus, feedbacks } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getNextStatus = (): VersionStatus => {
    if (version.status === 'Alpha') return 'Beta';
    if (version.status === 'Beta') return 'Estável';
    return 'Estável';
  };

  const nextStatus = getNextStatus();
  
  const versionFeedbacks = feedbacks.filter(f => f.versionId === version.id);
  const openFeedbacks = versionFeedbacks.filter(f => f.status !== 'Resolvido');
  const hasOpenFeedbacks = openFeedbacks.length > 0;

  const handlePromote = () => {
    setIsSubmitting(true);
    setErrorMessage('');
    updateVersionStatus(version.id, nextStatus)
      .then(() => onOpenChange(false))
      .catch((error) =>
        setErrorMessage(
          error instanceof Error ? error.message : 'Não foi possível promover a versão.',
        ),
      )
      .finally(() => setIsSubmitting(false));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowUpCircle className="w-5 h-5 text-blue-600" />
            Promover Versão
          </DialogTitle>
          <DialogDescription>
            Você está prestes a promover a versão <strong>{version.versionNumber}</strong> de{' '}
            <strong>{version.status}</strong> para <strong>{nextStatus}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {hasOpenFeedbacks && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Esta versão possui <strong>{openFeedbacks.length}</strong> feedback{openFeedbacks.length !== 1 ? 's' : ''} pendente{openFeedbacks.length !== 1 ? 's' : ''}. 
                Recomendamos resolver todos os feedbacks antes de promover para {nextStatus}.
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">O que significa {nextStatus}?</h4>
            {nextStatus === 'Beta' && (
              <p className="text-sm text-blue-700">
                A versão será liberada para um grupo pequeno de usuários/clientes testarem antes do lançamento oficial.
              </p>
            )}
            {nextStatus === 'Estável' && (
              <p className="text-sm text-blue-700">
                A versão será considerada validada e segura, liberada para todos os usuários em produção.
              </p>
            )}
          </div>
          {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handlePromote}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            <ArrowUpCircle className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Promovendo...' : `Promover para ${nextStatus}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
