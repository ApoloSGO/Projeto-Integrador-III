import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Link } from 'react-router';
import {
  AlertTriangle,
  AlertCircle,
  Clock,
  User,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

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

// Mock data - deve ser compartilhado com ErrorAnalysis em produção
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
  }
];

interface ProjectErrorsProps {
  projectId: string;
}

export function ProjectErrors({ projectId }: ProjectErrorsProps) {
  const criticalErrors = mockErrors.filter(
    error => error.projectId === projectId && error.severity === 'critical'
  );

  if (criticalErrors.length === 0) {
    return null;
  }

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

  return (
    <Card className="bg-white border border-red-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Erros Críticos</h2>
            <p className="text-sm text-gray-600">
              {criticalErrors.length} {criticalErrors.length === 1 ? 'erro crítico encontrado' : 'erros críticos encontrados'}
            </p>
          </div>
        </div>
        <Link to="/dashboard/errors">
          <Button variant="outline" size="sm">
            Ver Todos os Erros
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {criticalErrors.map((error) => (
          <div
            key={error.id}
            className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {error.errorType}
                  </h3>
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    Crítica
                  </Badge>
                  <Badge className={getStatusColor(error.status)}>
                    {getStatusLabel(error.status)}
                  </Badge>
                  {error.versionAffected && (
                    <Badge variant="outline" className="text-gray-600 text-xs">
                      v{error.versionAffected}
                    </Badge>
                  )}
                </div>

                <p className="text-gray-700 text-sm mb-2">
                  {error.message}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{error.count} ocorrências</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{error.affectedUsers} usuários</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatRelativeTime(error.lastOccurrence)}</span>
                  </div>
                </div>
              </div>

              {/* Assigned To */}
              {error.assignedTo && (
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Responsável</p>
                    <p className="text-xs font-medium text-gray-900">
                      {error.assignedTo.name}
                    </p>
                  </div>
                  <Avatar className={`${error.assignedTo.color} w-8 h-8`}>
                    <AvatarFallback className="text-white text-xs">
                      {error.assignedTo.initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}