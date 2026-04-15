import { useState } from 'react';
import { useApp, type FeedbackType } from '../context/AppContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  versionId: string;
}

export function FeedbackDialog({ open, onOpenChange, versionId }: FeedbackDialogProps) {
  const { addFeedback } = useApp();
  const [formData, setFormData] = useState({
    type: 'Erro' as FeedbackType,
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFeedback({
      versionId,
      type: formData.type,
      description: formData.description,
      status: 'Aberto',
    });
    onOpenChange(false);
    setFormData({
      type: 'Erro',
      description: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrar Feedback</DialogTitle>
          <DialogDescription>
            Registre um erro ou sugestão de melhoria para esta versão.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Feedback *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as FeedbackType })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Erro">Erro / Bug</SelectItem>
                  <SelectItem value="Sugestão">Sugestão de Melhoria</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o erro ou sugestão..."
                required
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Registrar Feedback
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
