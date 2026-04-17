import { useState, createContext, useContext, ReactNode } from 'react';

export type VersionStatus = 'Alpha' | 'Beta' | 'Estável';
export type FeedbackType = 'Erro' | 'Sugestão';
export type FeedbackStatus = 'Aberto' | 'Em Andamento' | 'Resolvido';

export interface Feedback {
  id: string;
  versionId: string;
  type: FeedbackType;
  description: string;
  status: FeedbackStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Version {
  id: string;
  projectId: string;
  versionNumber: string;
  description: string;
  status: VersionStatus;
  releaseDate: Date;
  isReleased: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  repositoryUrl?: string;
  versions: Version[];
}

interface AppContextType {
  projects: Project[];
  feedbacks: Feedback[];
  addProject: (project: Omit<Project, 'id' | 'versions'>) => void;
  addVersion: (version: Omit<Version, 'id'>) => void;
  updateVersionStatus: (versionId: string, status: VersionStatus) => void;
  addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFeedbackStatus: (feedbackId: string, status: FeedbackStatus) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Sistema de Gestão ERP',
      description: 'Software de gestão empresarial para pequenas empresas.',
      repositoryUrl: 'github.com/owner/repo-erp',
      versions: [
        {
          id: 'v1',
          projectId: '1',
          versionNumber: '1.3.0',
          description: 'Adicionado gerenciamento de inventário e relatórios.',
          status: 'Beta',
          releaseDate: new Date('2026-02-15'),
          isReleased: true,
        },
        {
          id: 'v2',
          projectId: '1',
          versionNumber: '1.2.5',
          description: 'Correções de bugs e melhorias de desempenho.',
          status: 'Estável',
          releaseDate: new Date('2026-01-10'),
          isReleased: true,
        },
        {
          id: 'v3',
          projectId: '1',
          versionNumber: '1.4.0',
          description: 'Nova interface de dashboard com gráficos interativos.',
          status: 'Alpha',
          releaseDate: new Date('2026-03-20'),
          isReleased: false,
        },
      ],
    },
  ]);

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      id: 'f1',
      versionId: 'v1',
      type: 'Erro',
      description: 'Erro ao gerar relatório de estoque quando há acentuação nos nomes.',
      status: 'Em Andamento',
      createdAt: new Date('2026-02-20'),
      updatedAt: new Date('2026-02-22'),
    },
    {
      id: 'f2',
      versionId: 'v1',
      type: 'Sugestão',
      description: 'Adicionar opção de exportar relatórios em PDF.',
      status: 'Aberto',
      createdAt: new Date('2026-02-21'),
      updatedAt: new Date('2026-02-21'),
    },
  ]);

  const addProject = (project: Omit<Project, 'id' | 'versions'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      versions: [],
    };
    setProjects([...projects, newProject]);
  };

  const addVersion = (version: Omit<Version, 'id'>) => {
    const newVersion: Version = {
      ...version,
      id: `v${Date.now()}`,
    };

    setProjects(projects.map(project => 
      project.id === version.projectId
        ? { ...project, versions: [...project.versions, newVersion] }
        : project
    ));
  };

  const updateVersionStatus = (versionId: string, status: VersionStatus) => {
    setProjects(projects.map(project => ({
      ...project,
      versions: project.versions.map(version =>
        version.id === versionId ? { ...version, status } : version
      ),
    })));
  };

  const addFeedback = (feedback: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newFeedback: Feedback = {
      ...feedback,
      id: `f${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setFeedbacks([...feedbacks, newFeedback]);
  };

  const updateFeedbackStatus = (feedbackId: string, status: FeedbackStatus) => {
    setFeedbacks(feedbacks.map(feedback =>
      feedback.id === feedbackId
        ? { ...feedback, status, updatedAt: new Date() }
        : feedback
    ));
  };

  return (
    <AppContext.Provider
      value={{
        projects,
        feedbacks,
        addProject,
        addVersion,
        updateVersionStatus,
        addFeedback,
        updateFeedbackStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}