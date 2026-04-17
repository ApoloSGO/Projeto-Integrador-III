import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { dataApi, normalizeRepositoryUrl } from "../../services/api";

export type VersionStatus = "Alpha" | "Beta" | "Estável";
export type FeedbackType = "Erro" | "Sugestão";
export type FeedbackStatus = "Aberto" | "Em Andamento" | "Resolvido";

export interface Feedback {
  id: string;
  projectId: string;
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
  isLoading: boolean;
  error: string | null;
  addProject: (project: Omit<Project, "id" | "versions">) => Promise<void>;
  addVersion: (version: Omit<Version, "id">) => Promise<void>;
  updateVersionStatus: (versionId: string, status: VersionStatus) => Promise<void>;
  addFeedback: (feedback: Omit<Feedback, "id" | "createdAt" | "updatedAt" | "projectId">) => Promise<void>;
  updateFeedbackStatus: (feedbackId: string, status: FeedbackStatus) => Promise<void>;
  refreshData: () => Promise<void>;
}

interface ApiProject {
  id: number;
  name: string;
  description: string;
  repository_url: string;
  versions: ApiVersion[];
}

interface ApiVersion {
  id: number;
  project: number;
  tag: string;
  title: string;
  summary: string;
  status: "planned" | "in_progress" | "released" | "archived";
  release_date: string | null;
  created_at: string;
}

interface ApiFeedback {
  id: number;
  project: number;
  related_version: number | null;
  feedback_type: "bug" | "suggestion" | "praise";
  message: string;
  status: "new" | "triaged" | "planned" | "resolved" | "dismissed";
  created_at: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function mapVersionStatus(status: ApiVersion["status"]): VersionStatus {
  switch (status) {
    case "in_progress":
      return "Beta";
    case "released":
    case "archived":
      return "Estável";
    case "planned":
    default:
      return "Alpha";
  }
}

function mapFeedbackType(type: ApiFeedback["feedback_type"]): FeedbackType {
  return type === "bug" ? "Erro" : "Sugestão";
}

function mapFeedbackStatus(status: ApiFeedback["status"]): FeedbackStatus {
  switch (status) {
    case "triaged":
    case "planned":
      return "Em Andamento";
    case "resolved":
    case "dismissed":
      return "Resolvido";
    case "new":
    default:
      return "Aberto";
  }
}

function toApiVersionStatus(status: VersionStatus): ApiVersion["status"] {
  switch (status) {
    case "Beta":
      return "in_progress";
    case "Estável":
      return "released";
    case "Alpha":
    default:
      return "planned";
  }
}

function toApiFeedbackType(type: FeedbackType): ApiFeedback["feedback_type"] {
  return type === "Erro" ? "bug" : "suggestion";
}

function toApiFeedbackStatus(status: FeedbackStatus): ApiFeedback["status"] {
  switch (status) {
    case "Em Andamento":
      return "triaged";
    case "Resolvido":
      return "resolved";
    case "Aberto":
    default:
      return "new";
  }
}

function toDateInputValue(date: Date) {
  return date.toISOString().split("T")[0];
}

function mapVersion(apiVersion: ApiVersion): Version {
  const releaseDateSource = apiVersion.release_date || apiVersion.created_at;
  const releaseDate = new Date(releaseDateSource);

  return {
    id: String(apiVersion.id),
    projectId: String(apiVersion.project),
    versionNumber: apiVersion.tag,
    description: apiVersion.summary || apiVersion.title,
    status: mapVersionStatus(apiVersion.status),
    releaseDate,
    isReleased: Boolean(apiVersion.release_date) || apiVersion.status === "released",
  };
}

function mapProject(apiProject: ApiProject): Project {
  const versions = (apiProject.versions || [])
    .map(mapVersion)
    .sort((first, second) => second.releaseDate.getTime() - first.releaseDate.getTime());

  return {
    id: String(apiProject.id),
    name: apiProject.name,
    description: apiProject.description,
    repositoryUrl: apiProject.repository_url,
    versions,
  };
}

function mapFeedback(apiFeedback: ApiFeedback): Feedback {
  const createdAt = new Date(apiFeedback.created_at);

  return {
    id: String(apiFeedback.id),
    projectId: String(apiFeedback.project),
    versionId: String(apiFeedback.related_version || ""),
    type: mapFeedbackType(apiFeedback.feedback_type),
    description: apiFeedback.message,
    status: mapFeedbackStatus(apiFeedback.status),
    createdAt,
    updatedAt: createdAt,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [projectsResponse, feedbacksResponse] = await Promise.all([
        dataApi.getProjects(),
        dataApi.getFeedbacks(),
      ]);

      setProjects((projectsResponse as ApiProject[]).map(mapProject));
      setFeedbacks((feedbacksResponse as ApiFeedback[]).map(mapFeedback));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel carregar os dados.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refreshData();
  }, []);

  const addProject = async (project: Omit<Project, "id" | "versions">) => {
    const createdProject = (await dataApi.createProject({
      name: project.name,
      description: project.description,
      repository_url: normalizeRepositoryUrl(project.repositoryUrl || ""),
    })) as ApiProject;

    setProjects((currentProjects) => [mapProject(createdProject), ...currentProjects]);
    setError(null);
  };

  const addVersion = async (version: Omit<Version, "id">) => {
    const createdVersion = (await dataApi.createVersion({
      project: Number(version.projectId),
      tag: version.versionNumber,
      title: `Versão ${version.versionNumber}`,
      summary: version.description,
      status: toApiVersionStatus(version.status),
      release_date: version.isReleased ? toDateInputValue(version.releaseDate) : null,
    })) as ApiVersion;

    const mappedVersion = mapVersion(createdVersion);

    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === version.projectId
          ? {
              ...project,
              versions: [...project.versions, mappedVersion].sort(
                (first, second) => second.releaseDate.getTime() - first.releaseDate.getTime(),
              ),
            }
          : project,
      ),
    );
    setError(null);
  };

  const updateVersionStatus = async (versionId: string, status: VersionStatus) => {
    const currentVersion = projects
      .flatMap((project) => project.versions)
      .find((version) => version.id === versionId);

    const versionReleaseDate =
      currentVersion?.isReleased || status !== "Alpha"
        ? currentVersion?.releaseDate || new Date()
        : null;

    const updatedVersion = (await dataApi.updateVersion(versionId, {
      status: toApiVersionStatus(status),
      release_date: versionReleaseDate ? toDateInputValue(versionReleaseDate) : null,
    })) as ApiVersion;

    const mappedVersion = mapVersion(updatedVersion);

    setProjects((currentProjects) =>
      currentProjects.map((project) => ({
        ...project,
        versions: project.versions
          .map((version) => (version.id === versionId ? mappedVersion : version))
          .sort((first, second) => second.releaseDate.getTime() - first.releaseDate.getTime()),
      })),
    );
    setError(null);
  };

  const addFeedback = async (
    feedback: Omit<Feedback, "id" | "createdAt" | "updatedAt" | "projectId">,
  ) => {
    const matchingProject = projects.find((project) =>
      project.versions.some((version) => version.id === feedback.versionId),
    );
    const matchingVersion = matchingProject?.versions.find(
      (version) => version.id === feedback.versionId,
    );

    if (!matchingProject || !matchingVersion) {
      throw new Error("Não foi possível identificar o projeto da versão selecionada.");
    }

    const createdFeedback = (await dataApi.createFeedback({
      project: Number(matchingProject.id),
      related_version: Number(feedback.versionId),
      user_name: "Equipe interna",
      feedback_type: toApiFeedbackType(feedback.type),
      title: `${feedback.type} na versão ${matchingVersion.versionNumber}`,
      message: feedback.description,
      status: toApiFeedbackStatus(feedback.status),
    })) as ApiFeedback;

    setFeedbacks((currentFeedbacks) => [mapFeedback(createdFeedback), ...currentFeedbacks]);
    setError(null);
  };

  const updateFeedbackStatus = async (feedbackId: string, status: FeedbackStatus) => {
    const updatedFeedback = (await dataApi.updateFeedback(feedbackId, {
      status: toApiFeedbackStatus(status),
    })) as ApiFeedback;

    const mappedFeedback = mapFeedback(updatedFeedback);

    setFeedbacks((currentFeedbacks) =>
      currentFeedbacks.map((feedback) => (feedback.id === feedbackId ? mappedFeedback : feedback)),
    );
    setError(null);
  };

  return (
    <AppContext.Provider
      value={{
        projects,
        feedbacks,
        isLoading,
        error,
        addProject,
        addVersion,
        updateVersionStatus,
        addFeedback,
        updateFeedbackStatus,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }

  return context;
}
