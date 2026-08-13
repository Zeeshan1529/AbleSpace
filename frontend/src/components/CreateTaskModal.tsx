'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Calendar, User, Folder, AlertCircle } from 'lucide-react';

interface ProjectType {
  id: string;
  name: string;
}

interface UserType {
  id: string;
  name: string;
}

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

export default function CreateTaskModal({ isOpen, onClose, onTaskCreated }: CreateTaskModalProps) {
  const { apiBaseUrl, user } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Todo');
  const [priority, setPriority] = useState('None');
  const [projectId, setProjectId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');

  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Reset fields
    setTitle('');
    setDescription('');
    setStatus('Todo');
    setPriority('None');
    setProjectId('');
    setAssigneeId('');
    setDueDate('');
    setError(null);

    // Fetch dependencies
    const fetchDependencies = async () => {
      try {
        const [projectsRes, usersRes] = await Promise.all([
          fetch(`${apiBaseUrl}/projects`),
          fetch(`${apiBaseUrl}/users`),
        ]);

        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          setProjects(projectsData);
        }
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData);
        }
      } catch (err) {
        console.error('Error fetching task form dependencies:', err);
      }
    };

    fetchDependencies();
  }, [isOpen, apiBaseUrl]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${apiBaseUrl}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          status,
          priority,
          projectId: projectId || undefined,
          assigneeId: assigneeId || undefined,
          reporterId: user?.id,
          dueDate: dueDate || undefined,
        }),
      });

      if (res.ok) {
        onTaskCreated();
        onClose();
      } else {
        const errData = await res.json();
        setError(errData.message || 'Failed to create task');
      }
    } catch (err) {
      setError('Failed to connect to backend server');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-theme-card border border-theme-border rounded-3xl w-full max-w-lg shadow-2xl p-6 overflow-hidden animate-fade-in z-10 transition-colors duration-300">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-theme-text">Create Task</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-theme-bg text-theme-text-secondary hover:text-theme-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-theme-text-secondary mb-2 ml-1">
              Task Title
            </label>
            <input
              type="text"
              placeholder="e.g. Implement signup validations"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              className="w-full h-11 px-4 bg-theme-bg border border-theme-border focus:border-primary/50 text-theme-text placeholder:text-theme-text-secondary/40 font-medium rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-theme-text-secondary mb-2 ml-1">
              Description
            </label>
            <textarea
              placeholder="Describe what needs to be done..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              rows={3}
              className="w-full p-4 bg-theme-bg border border-theme-border focus:border-primary/50 text-theme-text placeholder:text-theme-text-secondary/40 font-medium rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all resize-none text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-theme-text-secondary mb-2 ml-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={isSubmitting}
                className="w-full h-11 px-3 bg-theme-bg border border-theme-border focus:border-primary/50 text-theme-text font-medium rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
              >
                <option value="Backlog">Backlog</option>
                <option value="Todo">To Do</option>
                <option value="Doing">Doing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-theme-text-secondary mb-2 ml-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                disabled={isSubmitting}
                className="w-full h-11 px-3 bg-theme-bg border border-theme-border focus:border-primary/50 text-theme-text font-medium rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
              >
                <option value="None">None</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Project */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-theme-text-secondary mb-2 ml-1">
                Project Workspace
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-theme-text-secondary/55">
                  <Folder className="w-4 h-4" />
                </div>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full h-11 pl-10 pr-3 bg-theme-bg border border-theme-border focus:border-primary/50 text-theme-text font-medium rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                >
                  <option value="">Select Project (Optional)</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-theme-text-secondary mb-2 ml-1">
                Assignee
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-theme-text-secondary/55">
                  <User className="w-4 h-4" />
                </div>
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full h-11 pl-10 pr-3 bg-theme-bg border border-theme-border focus:border-primary/50 text-theme-text font-medium rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                >
                  <option value="">Assign To (Optional)</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-theme-text-secondary mb-2 ml-1">
              Due Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-theme-text-secondary/55">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isSubmitting}
                className="w-full h-11 pl-10 pr-4 bg-theme-bg border border-theme-border focus:border-primary/50 text-theme-text font-medium rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all text-sm"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-theme-border mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 h-11 text-sm font-bold border border-theme-border hover:bg-theme-bg text-theme-text rounded-xl transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 h-11 text-sm font-bold bg-primary text-white hover:bg-primary-hover rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
