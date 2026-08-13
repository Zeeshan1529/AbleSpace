'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Calendar, User, AlertCircle } from 'lucide-react';

interface UserType {
  id: string;
  name: string;
  avatarUrl: string | null;
}

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: () => void;
}

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated }: CreateProjectModalProps) {
  const { apiBaseUrl } = useApp();
  const [name, setName] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [leadId, setLeadId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [users, setUsers] = useState<UserType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Reset state when modal opens
    setName('');
    setPriority('Medium');
    setLeadId('');
    setDueDate('');
    setError(null);

    // Fetch users for the Lead dropdown
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/users`);
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (err) {
        console.error('Error fetching users for project modal:', err);
      }
    };

    fetchUsers();
  }, [isOpen, apiBaseUrl]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${apiBaseUrl}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          priority,
          leadId: leadId || undefined,
          dueDate: dueDate || undefined,
        }),
      });

      if (res.ok) {
        onProjectCreated();
        onClose();
      } else {
        const errData = await res.json();
        setError(errData.message || 'Failed to create project');
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

      {/* Modal Content */}
      <div className="relative bg-theme-card border border-theme-border rounded-3xl w-full max-w-md shadow-2xl p-6 overflow-hidden animate-fade-in z-10 transition-colors duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-theme-text">Create Project</h3>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-theme-text-secondary mb-2 ml-1">
              Project Name
            </label>
            <input
              type="text"
              placeholder="e.g. Dashboard Redesign"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className="w-full h-11 px-4 bg-theme-bg border border-theme-border focus:border-primary/50 text-theme-text placeholder:text-theme-text-secondary/40 font-medium rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
              required
            />
          </div>

          {/* Priority Select */}
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
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Project Lead */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-theme-text-secondary mb-2 ml-1">
              Project Lead
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-theme-text-secondary/55">
                <User className="w-4 h-4" />
              </div>
              <select
                value={leadId}
                onChange={(e) => setLeadId(e.target.value)}
                disabled={isSubmitting}
                className="w-full h-11 pl-10 pr-3 bg-theme-bg border border-theme-border focus:border-primary/50 text-theme-text font-medium rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
              >
                <option value="">Select a Project Lead (Optional)</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
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
                className="w-full h-11 pl-10 pr-4 bg-theme-bg border border-theme-border focus:border-primary/50 text-theme-text font-medium rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
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
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
