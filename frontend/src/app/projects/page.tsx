'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import DashboardLayout from '@/components/DashboardLayout';
import CreateProjectModal from '@/components/CreateProjectModal';
import { Plus, Folder, Calendar, User, Trash2, Search, ArrowUpRight, Loader2 } from 'lucide-react';

interface ProjectType {
  id: string;
  name: string;
  priority: string;
  dueDate: string | null;
  lead: {
    id: string;
    name: string;
    avatarUrl: string | null;
  } | null;
}

export default function ProjectsPage() {
  const { apiBaseUrl } = useApp();
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/projects`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [apiBaseUrl]);

  const handleDeleteProject = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete project "${name}"? This will delete all associated tasks.`)) return;

    try {
      const res = await fetch(`${apiBaseUrl}/projects/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchProjects();
      } else {
        alert('Failed to delete project');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      case 'Low':
      default:
        return 'bg-slate-500/10 text-slate-500 border border-slate-500/20';
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-theme-text tracking-tight">
              Projects
            </h1>
            <p className="text-sm font-semibold text-theme-text-secondary mt-1">
              Manage your team workspaces and active project timelines.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="h-11 flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary-hover px-5 font-bold rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-[0.98] self-start sm:self-auto"
          >
            <Plus className="w-5 h-5" />
            <span>New Project</span>
          </button>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-theme-card border border-theme-border rounded-2xl transition-colors duration-300">
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-theme-text-secondary/60">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search projects by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-theme-bg border border-theme-border focus:border-primary/50 text-theme-text placeholder:text-theme-text-secondary/40 font-medium rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="text-xs font-bold text-theme-text-secondary uppercase tracking-widest px-1">
            Total Workspaces: {filteredProjects.length}
          </div>
        </div>

        {/* Project Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 bg-theme-card border border-theme-border rounded-3xl">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="mt-3 text-sm font-semibold text-theme-text-secondary">
              Fetching workspaces...
            </span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-12 bg-theme-card border border-theme-border rounded-3xl h-72">
            <div className="w-12 h-12 rounded-2xl bg-theme-bg border border-theme-border flex items-center justify-center mb-4 text-theme-text-secondary">
              <Folder className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-theme-text mb-1">No Projects Found</h3>
            <p className="text-sm font-semibold text-theme-text-secondary max-w-sm">
              {searchQuery ? "We couldn't find matches for your query." : "Get started by creating a new project workspace."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-theme-card border border-theme-border hover:border-primary/30 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-56 hover:translate-y-[-2px]"
              >
                {/* Top Info */}
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-primary-light text-primary flex items-center justify-center transition-colors">
                      <Folder className="w-5 h-5 text-primary" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getPriorityBadgeClass(project.priority)}`}>
                      {project.priority} Priority
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-theme-text mt-4 line-clamp-1 group-hover:text-primary transition-colors duration-200">
                    {project.name}
                  </h3>
                </div>

                {/* Bottom Stats / Metadata */}
                <div className="border-t border-theme-border pt-4 mt-6 flex items-center justify-between text-xs font-semibold text-theme-text-secondary">
                  {/* Lead Info */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-theme-bg border border-theme-border overflow-hidden flex items-center justify-center text-[10px] font-extrabold text-primary">
                      {project.lead?.avatarUrl ? (
                        <img src={project.lead.avatarUrl} alt={project.lead.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <span className="truncate max-w-[100px]" title={project.lead?.name || 'No Lead'}>
                      {project.lead?.name || 'No Lead'}
                    </span>
                  </div>

                  {/* Due Date */}
                  <div className="flex items-center gap-1.5 text-theme-text-secondary/80">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(project.dueDate)}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute right-6 top-6">
                    <button
                      onClick={() => handleDeleteProject(project.id, project.name)}
                      className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl transition-all duration-200"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Creation Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={fetchProjects}
      />
    </DashboardLayout>
  );
}
