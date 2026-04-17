import { useState } from 'react';
import { useApp, type VersionStatus } from '../context/AppContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';

interface NewVersionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

export function NewVersionDialog({ open, onOpenChange, projectId }: NewVersionDialogProps) {
  const { addVersion } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    versionNumber: '',
    description: '',
    status: 'Alpha' as VersionStatus,
    isReleased: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await addVersion({
        projectId,
        versionNumber: formData.versionNumber,
        description: formData.description,
        status: formData.status,
        releaseDate: new Date(),
        isReleased: formData.isReleased,
      });
      onOpenChange(false);
      setFormData({
        versionNumber: '',
        description: '',
        status: 'Alpha',
        isReleased: false,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Não foi possível criar a versão.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova Versão</DialogTitle>
          <DialogDescription>
            Adicione uma nova versão ao projeto.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="versionNumber">Número da Versão *</Label>
              <Input
                id="versionNumber"
                value={formData.versionNumber}
                onChange={(e) => setFormData({ ...formData, versionNumber: e.target.value })}
                placeholder="Ex: 1.3.0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição das Mudanças *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o que mudou nesta versão..."
                required
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status da Versão *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as VersionStatus })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alpha">Alpha (Desenvolvimento)</SelectItem>
                  <SelectItem value="Beta">Beta (Testes)</SelectItem>
                  <SelectItem value="Estável">Estável (Produção)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isReleased">Versão Lançada</Label>
                <p className="text-sm text-gray-500">
                  Marque se a versão já foi disponibilizada
                </p>
              </div>
              <Switch
                id="isReleased"
                checked={formData.isReleased}
                onCheckedChange={(checked) => setFormData({ ...formData, isReleased: checked })}
              />
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
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
              {isSubmitting ? 'Criando...' : 'Criar Versão'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
