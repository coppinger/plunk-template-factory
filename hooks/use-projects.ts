"use client";

import { useState, useCallback, useEffect } from "react";
import type { ProjectListItem, PersistedData } from "@/lib/persistence";
import { isValidPersistedData } from "@/lib/persistence";
import type { User } from "@supabase/supabase-js";
import {
  emailTemplates,
  defaultGlobalTemplate,
  seedCustomTemplateTypes,
  seedCustomVariables,
  seedCustomEmailTemplates,
} from "@/lib/mock-data";
import { DEFAULT_STYLE } from "@/lib/types";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

function buildDefaultProjectData(): PersistedData {
  const allInitialTemplates = [...emailTemplates, ...seedCustomEmailTemplates];
  return {
    version: 1,
    lastModified: new Date().toISOString(),
    templates: allInitialTemplates.map((t) => ({
      ...t,
      variants: t.variants.map((v) => ({ ...v })),
    })),
    globalTemplate: { ...defaultGlobalTemplate },
    templateStyle: { ...DEFAULT_STYLE },
    customTemplateTypes: [...seedCustomTemplateTypes],
    customVariables: [...seedCustomVariables],
    activeVariantIds: Object.fromEntries(
      allInitialTemplates.map((t) => [t.type, t.variants[0]?.id ?? "default"])
    ),
  };
}

export function useProjects(authState: AuthState) {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load project list on mount (after auth is ready)
  useEffect(() => {
    if (authState.loading || !authState.isAuthenticated) return;

    fetch("/api/projects")
      .then((res) => res.json())
      .then((result) => {
        const list: ProjectListItem[] = result.projects ?? [];
        setProjects(list);
        // Auto-select the first (most recently updated) project
        if (list.length > 0) {
          setActiveProjectId(list[0].id);
        }
      })
      .catch((err) => console.error("Failed to load projects:", err))
      .finally(() => setIsLoading(false));
  }, [authState.loading, authState.isAuthenticated]);

  const createProject = useCallback(
    async (name: string): Promise<string | null> => {
      const defaultData = buildDefaultProjectData();
      try {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, data: defaultData }),
        });
        const result = await res.json();
        if (result.project) {
          const item: ProjectListItem = {
            id: result.project.id,
            name: result.project.name,
            updatedAt: result.project.updatedAt,
          };
          setProjects((prev) => [item, ...prev]);
          setActiveProjectId(item.id);
          return item.id;
        }
        return null;
      } catch (err) {
        console.error("Failed to create project:", err);
        return null;
      }
    },
    []
  );

  const deleteProject = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
        const result = await res.json();
        if (result.ok) {
          setProjects((prev) => {
            const next = prev.filter((p) => p.id !== id);
            // If we deleted the active project, switch to first remaining
            if (activeProjectId === id) {
              setActiveProjectId(next.length > 0 ? next[0].id : null);
            }
            return next;
          });
          return true;
        }
        return false;
      } catch (err) {
        console.error("Failed to delete project:", err);
        return false;
      }
    },
    [activeProjectId]
  );

  const renameProject = useCallback(
    async (id: string, name: string): Promise<boolean> => {
      try {
        const res = await fetch(`/api/projects/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
        const result = await res.json();
        if (result.ok) {
          setProjects((prev) =>
            prev.map((p) => (p.id === id ? { ...p, name } : p))
          );
          return true;
        }
        return false;
      } catch (err) {
        console.error("Failed to rename project:", err);
        return false;
      }
    },
    []
  );

  const duplicateProject = useCallback(
    async (id: string, newName: string): Promise<string | null> => {
      try {
        // Load the source project's data
        const loadRes = await fetch(`/api/projects/${id}`);
        const loadResult = await loadRes.json();
        if (!loadResult.project?.data || !isValidPersistedData(loadResult.project.data)) {
          return null;
        }

        // Create new project with cloned data
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName, data: loadResult.project.data }),
        });
        const result = await res.json();
        if (result.project) {
          const item: ProjectListItem = {
            id: result.project.id,
            name: result.project.name,
            updatedAt: result.project.updatedAt,
          };
          setProjects((prev) => [item, ...prev]);
          setActiveProjectId(item.id);
          return item.id;
        }
        return null;
      } catch (err) {
        console.error("Failed to duplicate project:", err);
        return null;
      }
    },
    []
  );

  const switchProject = useCallback((id: string) => {
    setActiveProjectId(id);
  }, []);

  return {
    projects,
    activeProjectId,
    isLoading,
    createProject,
    deleteProject,
    renameProject,
    duplicateProject,
    switchProject,
  };
}
