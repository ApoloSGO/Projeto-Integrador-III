import { useState } from "react";
import { Link, useLocation } from "react-router";
import { AlertTriangle, Layers3, Plus } from "lucide-react";

import { NewProjectDialog } from "./NewProjectDialog";
import { Button } from "./ui/button";

export function Header() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const location = useLocation();
  const isProjectsRoute =
    location.pathname === "/dashboard" || location.pathname.startsWith("/dashboard/project/");
  const isErrorsRoute = location.pathname === "/dashboard/errors";

  return (
    <>
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-600 p-2.5">
              <Layers3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">VersionTrack</h1>
              <p className="text-xs uppercase tracking-wide text-blue-600">
                Gestao de Ciclo de Vida de Software
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Projeto
          </Button>
        </div>

        <nav className="-mb-px flex gap-1 border-b border-gray-200">
          <Link
            to="/dashboard"
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              isProjectsRoute
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900"
            }`}
          >
            Projetos
          </Link>
          <Link
            to="/dashboard/errors"
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              isErrorsRoute
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900"
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            Analise de Erros
          </Link>
        </nav>
      </header>
      <NewProjectDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}
