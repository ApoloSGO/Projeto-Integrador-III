import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Send } from 'lucide-react';

import { api } from '../services/api';
import { Alert, AlertDescription } from '../app/components/ui/alert';
import { Button } from '../app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../app/components/ui/card';
import { Input } from '../app/components/ui/input';
import { Label } from '../app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../app/components/ui/select';
import { Textarea } from '../app/components/ui/textarea';

export function CreateFeedback() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    projectId: '',
    versionId: '',
    type: 'bug',
    title: '',
    description: '',
  });

  useEffect(() => {
    let isMounted = true;

    api
      .getProjects()
      .then((response) => {
        if (!isMounted) {
          return;
        }

        setProjects(response);
        if (response.length > 0) {
          setFormData((current) => ({ ...current, projectId: String(response[0].id) }));
        }
      })
      .catch((error) => {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error ? error.message : 'Não foi possível carregar os projetos.',
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingProjects(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedProject = projects.find((project) => String(project.id) === formData.projectId);

  const availableVersions = selectedProject?.versions || [];

  const handleProjectChange = (projectId) => {
    setFormData((current) => ({
      ...current,
      projectId,
      versionId: '',
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const currentUser = api.getCurrentUser();

      await api.submitFeedback({
        project: Number(formData.projectId),
        related_version: formData.versionId ? Number(formData.versionId) : null,
        user_name: currentUser?.name || 'Portal VersionTrack',
        feedback_type: formData.type,
        title: formData.title,
        message: formData.description,
        status: 'new',
      });

      setSuccessMessage('Feedback enviado com sucesso.');
      setFormData((current) => ({
        ...current,
        versionId: '',
        title: '',
        description: '',
      }));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Erro ao enviar feedback. Tente novamente.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Feedback</CardTitle>
            <CardDescription>
              Envie sugestões, relatos de bug ou elogios vinculados a um projeto.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              {successMessage && (
                <Alert>
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="project">Projeto</Label>
                <Select
                  value={formData.projectId}
                  onValueChange={handleProjectChange}
                  disabled={isLoadingProjects || projects.length === 0}
                >
                  <SelectTrigger id="project">
                    <SelectValue placeholder="Selecione um projeto" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={String(project.id)}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="version">Versão relacionada</Label>
                <Select
                  value={formData.versionId}
                  onValueChange={(value) => setFormData({ ...formData, versionId: value })}
                  disabled={!selectedProject || availableVersions.length === 0}
                >
                  <SelectTrigger id="version">
                    <SelectValue placeholder="Opcional" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVersions.map((version) => (
                      <SelectItem key={version.id} value={String(version.id)}>
                        {version.tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Feedback</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">Bug / Erro</SelectItem>
                    <SelectItem value="suggestion">Sugestão</SelectItem>
                    <SelectItem value="praise">Elogio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  placeholder="Resumo do feedback"
                  value={formData.title}
                  onChange={(event) =>
                    setFormData({ ...formData, title: event.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva detalhadamente seu feedback..."
                  value={formData.description}
                  onChange={(event) =>
                    setFormData({ ...formData, description: event.target.value })
                  }
                  rows={6}
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.projectId}
                  className="flex-1"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
