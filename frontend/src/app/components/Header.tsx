import { Layers3, Plus, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { NewProjectDialog } from "./NewProjectDialog";
import { Link, useLocation } from "react-router";

export function Header() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const location = useLocation();

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
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Projeto
          </Button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex gap-1 border-b border-gray-200 -mb-px">
          <Link
            to="/"
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              location.pathname === "/"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            Projetos
          </Link>
          <Link
            to="/errors"
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              location.pathname === "/errors"
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