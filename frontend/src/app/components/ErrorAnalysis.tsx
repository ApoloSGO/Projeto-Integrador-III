import { useState } from 'react';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Link } from 'react-router';
import { useApp } from '../context/AppContext';
import {
  AlertTriangle,
  TrendingUp,
  Clock,
  User,
  Search,
  Filter,
  ChevronDown,
  AlertCircle,
  ExternalLink,
  FolderOpen
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface ErrorData {
  id: string;
  projectId: string;
  errorType: string;
  message: string;
  count: number;
  lastOccurrence: Date;
  severity: 'critical' | 'high' | 'medium' | 'low';
  assignedTo: {
    name: string;
    initials: string;
    color: string;
  } | null;
  status: 'open' | 'investigating' | 'resolved';
  affectedUsers: number;
  versionAffected?: string;
}

// Dados mockados para demonstração
const mockErrors: ErrorData[] = [
  {
    id: '1',
    projectId: '1',
    errorType: 'NullPointerException',
    message: 'Tentativa de acessar propriedade de objeto nulo no método processPayment',
    count: 847,
    lastOccurrence: new Date('2026-04-06T14:30:00'),
    severity: 'critical',
    assignedTo: {
      name: 'João Silva',
      initials: 'JS',
      color: 'bg-blue-500'
    },
    status: 'investigating',
    affectedUsers: 234,
    versionAffected: '1.3.0'
  },
  {
    id: '2',
    projectId: '1',
    errorType: 'DatabaseConnectionTimeout',
    message: 'Timeout ao conectar com banco de dados principal após 30s',
    count: 523,
    lastOccurrence: new Date('2026-04-06T13:15:00'),
    severity: 'critical',
    assignedTo: {
      name: 'Maria Santos',
      initials: 'MS',
      color: 'bg-purple-500'
    },
    status: 'investigating',
    affectedUsers: 189,
    versionAffected: '1.2.5'
  },
  {
    id: '3',
    projectId: '1',
    errorType: 'ValidationError',
    message: 'Campo email inválido no formulário de cadastro',
    count: 412,
    lastOccurrence: new Date('2026-04-06T15:45:00'),
    severity: 'high',
    assignedTo: {
      name: 'Pedro Costa',
      initials: 'PC',
      color: 'bg-green-500'
    },
    status: 'open',
    affectedUsers: 156,
    versionAffected: '1.3.0'
  },
  {
    id: '4',
    projectId: '1',
    errorType: 'OutOfMemoryError',
    message: 'Heap space esgotado durante processamento de relatórios grandes',
    count: 89,
    lastOccurrence: new Date('2026-04-06T12:00:00'),
    severity: 'high',
    assignedTo: {
      name: 'Ana Oliveira',
      initials: 'AO',
      color: 'bg-orange-500'
    },
    status: 'investigating',
    affectedUsers: 45,
    versionAffected: '1.4.0'
  },
  {
    id: '5',
    projectId: '1',
    errorType: 'APIRateLimitExceeded',
    message: 'Limite de requisições da API de pagamentos excedido',
    count: 234,
    lastOccurrence: new Date('2026-04-06T11:30:00'),
    severity: 'medium',
    assignedTo: null,
    status: 'open',
    affectedUsers: 67,
    versionAffected: '1.3.0'
  },
  {
    id: '6',
    projectId: '1',
    errorType: 'FileNotFoundException',
    message: 'Arquivo de configuração não encontrado no path especificado',
    count: 156,
    lastOccurrence: new Date('2026-04-06T10:15:00'),
    severity: 'medium',
    assignedTo: {
      name: 'Carlos Lima',
      initials: 'CL',
      color: 'bg-pink-500'
    },
    status: 'resolved',
    affectedUsers: 23,
    versionAffected: '1.2.5'
  },
  {
    id: '7',
    projectId: '1',
    errorType: 'ConcurrentModificationException',
    message: 'Modificação concorrente detectada no processamento de pedidos',
    count: 78,
    lastOccurrence: new Date('2026-04-06T09:45:00'),
    severity: 'low',
    assignedTo: null,
    status: 'open',
    affectedUsers: 12,
    versionAffected: '1.4.0'
  }
];

export function ErrorAnalysis() {
  const { projects } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');

  const filteredErrors = mockErrors.filter(error => {
    const matchesSearch = error.errorType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         error.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || error.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || error.status === statusFilter;
    const matchesProject = projectFilter === 'all' || error.projectId === projectFilter;

    return matchesSearch && matchesSeverity && matchesStatus && matchesProject;
  });

  // Group errors by project
  const errorsByProject = projects.map(project => {
    const projectErrors = filteredErrors.filter(error => error.projectId === project.id);
    const criticalCount = projectErrors.filter(e => e.severity === 'critical').length;
    const totalCount = projectErrors.reduce((sum, error) => sum + error.count, 0);

    return {
      project,
      errors: projectErrors,
      criticalCount,
      totalCount
    };
  }).filter(item => item.errors.length > 0);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-gray-100 text-gray-800';
      case 'investigating':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'Aberto';
      case 'investigating':
        return 'Investigando';
      case 'resolved':
        return 'Resolvido';
      default:
        return status;
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min atrás`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d atrás`;
  };

  const totalErrors = filteredErrors.reduce((sum, error) => sum + error.count, 0);
  const criticalErrors = filteredErrors.filter(e => e.severity === 'critical').length;
  const assignedErrors = filteredErrors.filter(e => e.assignedTo !== null).length;

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Análise de Erros
          </h1>
          <p className="text-gray-600">
            Monitore e gerencie os erros mais frequentes do sistema
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-6 bg-white border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de Erros</p>
                <p className="text-2xl font-semibold text-gray-900">{totalErrors}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Críticos</p>
                <p className="text-2xl font-semibold text-red-600">{criticalErrors}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Em Tratamento</p>
                <p className="text-2xl font-semibold text-gray-900">{assignedErrors}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <User className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Taxa de Crescimento</p>
                <p className="text-2xl font-semibold text-orange-600">+12%</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6 bg-white border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por tipo de erro ou mensagem..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Project Filter */}
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-full md:w-56">
                <SelectValue placeholder="Projeto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Projetos</SelectItem>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Severity Filter */}
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Severidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Severidades</SelectItem>
                <SelectItem value="critical">Crítica</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Status</SelectItem>
                <SelectItem value="open">Aberto</SelectItem>
                <SelectItem value="investigating">Investigando</SelectItem>
                <SelectItem value="resolved">Resolvido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Errors List Grouped by Project */}
        <div className="space-y-6">
          {errorsByProject.length === 0 ? (
            <Card className="p-12 text-center bg-white border border-gray-200">
              <p className="text-gray-500">Nenhum erro encontrado</p>
            </Card>
          ) : (
            errorsByProject.map(({ project, errors, criticalCount, totalCount }) => (
              <div key={project.id}>
                {/* Project Header */}
                <div className="bg-white rounded-t-xl border border-gray-200 border-b-0 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FolderOpen className="w-5 h-5 text-blue-600" />
                      <div>
                        <h2 className="font-semibold text-gray-900">{project.name}</h2>
                        <p className="text-sm text-gray-600">{project.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total de Ocorrências</p>
                        <p className="font-semibold text-gray-900">{totalCount}</p>
                      </div>
                      {criticalCount > 0 && (
                        <Badge className="bg-red-100 text-red-800 border-red-200">
                          {criticalCount} {criticalCount === 1 ? 'Crítico' : 'Críticos'}
                        </Badge>
                      )}
                      <Link to={`/project/${project.id}`}>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Ver Projeto
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Errors for this project */}
                <div className="space-y-0">
                  {errors.map((error, index) => (
                    <Card
                      key={error.id}
                      className={`p-6 bg-white border border-gray-200 hover:shadow-md transition-shadow ${
                        index === 0 ? 'rounded-t-none' : ''
                      } ${
                        index === errors.length - 1 ? 'rounded-b-xl' : 'rounded-b-none border-b-0'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* Error Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {error.errorType}
                            </h3>
                            <Badge className={getSeverityColor(error.severity)}>
                              {error.severity === 'critical' ? 'Crítica' :
                               error.severity === 'high' ? 'Alta' :
                               error.severity === 'medium' ? 'Média' : 'Baixa'}
                            </Badge>
                            <Badge className={getStatusColor(error.status)}>
                              {getStatusLabel(error.status)}
                            </Badge>
                            {error.versionAffected && (
                              <Badge variant="outline" className="text-gray-600">
                                v{error.versionAffected}
                              </Badge>
                            )}
                          </div>

                          <p className="text-gray-600 mb-3 text-sm">
                            {error.message}
                          </p>

                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4" />
                              <span>{error.count} ocorrências</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>{error.affectedUsers} usuários afetados</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>Última: {formatRelativeTime(error.lastOccurrence)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Assigned To */}
                        <div className="flex flex-col items-end gap-3">
                          {error.assignedTo ? (
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Responsável</p>
                                <p className="text-sm font-medium text-gray-900">
                                  {error.assignedTo.name}
                                </p>
                              </div>
                              <Avatar className={error.assignedTo.color}>
                                <AvatarFallback className="text-white">
                                  {error.assignedTo.initials}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          ) : (
                            <Button variant="outline" size="sm">
                              <User className="w-4 h-4 mr-2" />
                              Atribuir
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
