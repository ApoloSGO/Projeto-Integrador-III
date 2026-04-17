import { Layers3, Plus, AlertTriangle, LogOut, User } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { NewProjectDialog } from "./NewProjectDialog";
import { Link, useLocation, useNavigate } from "react-router";
import { api } from "../../services/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Header() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = api.getCurrentUser();

  const handleLogout = () => {
    api.logout();
    navigate('/login');
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 rounded-lg p-2.5">
              <Layers3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                VersionTrack
              </h1>
              <p className="text-xs text-blue-600 uppercase tracking-wide">
                Gestão de Ciclo de Vida de Software
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Projeto
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {currentUser?.name || 'Usuário'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex gap-1 border-b border-gray-200 -mb-px">
          <Link
            to="/dashboard"
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              location.pathname === "/dashboard"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            Projetos
          </Link>
          <Link
            to="/dashboard/errors"
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              location.pathname === "/dashboard/errors"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Análise de Erros
          </Link>
        </nav>
      </header>
      <NewProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}