'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Calendar, User, Folder, Trash2, Plus, MessageSquare, CheckCircle2, Circle, AlertCircle, Loader2 } from 'lucide-react';

interface SubtaskType {
  id: string;
  title: string;
  isCompleted: boolean;
  priority: string;
  dueDate: string | null;
}

interface CommentType {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

interface ProjectType {
  id: string;
  name: string;
}

interface UserType {
  id: string;
  name: string;
  avatarUrl: string | null;
}

interface TaskDetailType {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  projectId: string | null;
  assigneeId: string | null;
  reporterId: string | null;
  project: ProjectType | null;
  assignee: UserType | null;
  reporter: UserType | null;
  subtasks: SubtaskType[];
  comments: CommentType[];
}

interface TaskDetailDrawerProps {
  taskId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdated: () => void;
}

export default function TaskDetailDrawer({ taskId, isOpen, onClose, onTaskUpdated }: TaskDetailDrawerProps) {
  const { apiBaseUrl, user } = useApp();
  const [task, setTask] = useState<TaskDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Field States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Dropdown options
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);

  // Subtask Input
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  
  // Comment Input
  const [commentContent, setCommentContent] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);

  // Fetch Task Details
  const fetchTaskDetails = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/tasks/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTask(data);
        // Sync inputs
        setTitle(data.title);
        setDescription(data.description || '');
        setStatus(data.status);
        setPriority(data.priority);
        setProjectId(data.projectId || '');
        setAssigneeId(data.assigneeId || '');
        setDueDate(data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : '');
      } else {
        setError('Failed to fetch task details.');
      }
    } catch (err) {
      setError('Connection to backend failed.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen || !taskId) return;
    setError(null);
    fetchTaskDetails(taskId);

    // Fetch lists
    const fetchMetadata = async () => {
      try {
        const [projRes, userRes] = await Promise.all([
          fetch(`${apiBaseUrl}/projects`),
          fetch(`${apiBaseUrl}/users`),
        ]);
        if (projRes.ok) setProjects(await projRes.json());
        if (userRes.ok) setUsers(await userRes.json());
      } catch (err) {
        console.error(err);
      }
    };
    fetchMetadata();
  }, [isOpen, taskId, apiBaseUrl]);

  if (!isOpen) return null;

  // Real-time Save Edits
  const handleUpdateField = async (fieldName: string, value: any) => {
    if (!taskId) return;
    try {
      const res = await fetch(`${apiBaseUrl}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [fieldName]: value === '' ? null : value,
        }),
      });

      if (res.ok) {
        onTaskUpdated();
        // Refresh details local state
        const updatedTask = await res.json();
        setTask(updatedTask);
      }
    } catch (err) {
      console.error('Failed to update field:', err);
    }
  };

  // Delete Task
  const handleDeleteTask = async () => {
    if (!taskId || !confirm('Are you sure you want to delete this task?')) return;
    try {
      const res = await fetch(`${apiBaseUrl}/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        onTaskUpdated();
        onClose();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Subtask
  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim() || !taskId) return;

    try {
      const res = await fetch(`${apiBaseUrl}/tasks/${taskId}/subtasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newSubtaskTitle.trim() }),
      });
      if (res.ok) {
        setNewSubtaskTitle('');
        // Refresh local details
        fetchTaskDetails(taskId);
        onTaskUpdated();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Subtask Checked
  const handleToggleSubtask = async (subtaskId: string, isCompleted: boolean) => {
    if (!taskId) return;
    try {
      const res = await fetch(`${apiBaseUrl}/tasks/${taskId}/subtasks/${subtaskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: !isCompleted }),
      });
      if (res.ok) {
        fetchTaskDetails(taskId);
        onTaskUpdated();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Subtask
  const handleDeleteSubtask = async (subtaskId: string) => {
    if (!taskId) return;
    try {
      const res = await fetch(`${apiBaseUrl}/tasks/${taskId}/subtasks/${subtaskId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchTaskDetails(taskId);
        onTaskUpdated();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Post Comment
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || !taskId || !user) return;
    setIsPostingComment(true);

    try {
      const res = await fetch(`${apiBaseUrl}/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: commentContent.trim(),
          userId: user.id,
        }),
      });
      if (res.ok) {
        setCommentContent('');
        fetchTaskDetails(taskId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPostingComment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Card Panel */}
      <div className="relative bg-theme-card border-l border-theme-border w-full max-w-lg md:max-w-xl h-full shadow-2xl flex flex-col justify-between animate-fade-in z-10 transition-colors duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-theme-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-theme-text-secondary/70">
              Task Details
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-theme-bg text-theme-text-secondary hover:text-theme-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading / Error States */}
        {isLoading ? (
          <div className="flex-grow flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="mt-3 text-sm font-semibold text-theme-text-secondary">Loading details...</span>
          </div>
        ) : error ? (
          <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="w-8 h-8 text-rose-500 mb-2" />
            <span className="text-sm font-semibold text-rose-500">{error}</span>
          </div>
        ) : !task ? (
          <div className="flex-grow flex items-center justify-center text-theme-text-secondary">
            No Task Selected.
          </div>
        ) : (
          /* Main Scrollable Body */
          <div className="flex-grow overflow-y-auto px-6 py-4 space-y-6">
            
            {/* Title Input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => handleUpdateField('title', title)}
              placeholder="Task Title"
              className="w-full text-xl font-extrabold bg-transparent text-theme-text border-b border-transparent hover:border-theme-border focus:border-primary/50 py-1 focus:outline-none transition-colors"
            />

            {/* Description Textarea */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-theme-text-secondary mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => handleUpdateField('description', description)}
                placeholder="Add a detailed description..."
                rows={4}
                className="w-full p-4 bg-theme-bg border border-theme-border hover:border-theme-border focus:border-primary/50 text-theme-text placeholder:text-theme-text-secondary/40 font-medium rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all resize-none"
              />
            </div>

            {/* Metadata Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-theme-bg/50 border border-theme-border/60 rounded-2xl">
              
              {/* Status Select */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-theme-text-secondary/70 mb-1 ml-0.5">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    handleUpdateField('status', e.target.value);
                  }}
                  className="w-full h-10 px-2.5 bg-theme-card border border-theme-border focus:border-primary/50 text-theme-text font-bold rounded-lg text-xs focus:outline-none transition-all cursor-pointer"
                >
                  <option value="Backlog">Backlog</option>
                  <option value="Todo">To Do</option>
                  <option value="Doing">Doing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Priority Select */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-theme-text-secondary/70 mb-1 ml-0.5">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => {
                    setPriority(e.target.value);
                    handleUpdateField('priority', e.target.value);
                  }}
                  className="w-full h-10 px-2.5 bg-theme-card border border-theme-border focus:border-primary/50 text-theme-text font-bold rounded-lg text-xs focus:outline-none transition-all cursor-pointer"
                >
                  <option value="None">None</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              {/* Project Select */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-theme-text-secondary/70 mb-1 ml-0.5">
                  Project Workspace
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-theme-text-secondary/50">
                    <Folder className="w-3.5 h-3.5" />
                  </div>
                  <select
                    value={projectId}
                    onChange={(e) => {
                      setProjectId(e.target.value);
                      handleUpdateField('projectId', e.target.value);
                    }}
                    className="w-full h-10 pl-8 pr-2 bg-theme-card border border-theme-border focus:border-primary/50 text-theme-text font-semibold rounded-lg text-xs focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="">No Project</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Assignee Select */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-theme-text-secondary/70 mb-1 ml-0.5">
                  Assignee
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-theme-text-secondary/50">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <select
                    value={assigneeId}
                    onChange={(e) => {
                      setAssigneeId(e.target.value);
                      handleUpdateField('assigneeId', e.target.value);
                    }}
                    className="w-full h-10 pl-8 pr-2 bg-theme-card border border-theme-border focus:border-primary/50 text-theme-text font-semibold rounded-lg text-xs focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="">Unassigned</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Due Date */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-theme-text-secondary/70 mb-1 ml-0.5">
                  Due Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-theme-text-secondary/50">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => {
                      setDueDate(e.target.value);
                      handleUpdateField('dueDate', e.target.value);
                    }}
                    className="w-full h-10 pl-8 pr-2 bg-theme-card border border-theme-border focus:border-primary/50 text-theme-text font-semibold rounded-lg text-xs focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Subtasks Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text-secondary">
                Subtasks ({task.subtasks.filter(s => s.isCompleted).length}/{task.subtasks.length})
              </h4>
              
              {/* List of subtasks */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {task.subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center justify-between gap-3 p-3 bg-theme-bg border border-theme-border/60 hover:border-theme-border rounded-xl transition-all"
                  >
                    <button
                      onClick={() => handleToggleSubtask(subtask.id, subtask.isCompleted)}
                      className="flex items-center gap-2.5 text-left text-sm font-semibold text-theme-text"
                    >
                      {subtask.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-theme-text-secondary/60 flex-shrink-0" />
                      )}
                      <span className={`line-clamp-1 ${subtask.isCompleted ? 'line-through text-theme-text-secondary/50' : ''}`}>
                        {subtask.title}
                      </span>
                    </button>

                    <button
                      onClick={() => handleDeleteSubtask(subtask.id)}
                      className="p-1 text-theme-text-secondary/65 hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-colors"
                      title="Delete Subtask"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Subtask Input Form */}
              <form onSubmit={handleAddSubtask} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a subtask..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  className="flex-grow h-10 px-3 bg-theme-bg border border-theme-border focus:border-primary/50 text-theme-text placeholder:text-theme-text-secondary/40 font-medium rounded-xl text-xs focus:outline-none transition-all"
                />
                <button
                  type="submit"
                  className="w-10 h-10 bg-primary hover:bg-primary-hover text-white rounded-xl shadow-md flex items-center justify-center flex-shrink-0 transition-colors"
                  title="Add Subtask"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Comments Feed Section */}
            <div className="space-y-4 pt-4 border-t border-theme-border">
              <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text-secondary flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                <span>Comments ({task.comments.length})</span>
              </h4>

              {/* Comment Input */}
              <form onSubmit={handlePostComment} className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-primary/10 overflow-hidden flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-grow relative">
                  <textarea
                    placeholder="Write a comment..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    disabled={isPostingComment}
                    rows={2}
                    className="w-full p-3 pr-10 bg-theme-bg border border-theme-border focus:border-primary/50 text-theme-text placeholder:text-theme-text-secondary/40 font-medium rounded-xl text-xs focus:outline-none transition-all resize-none"
                  />
                  <button
                    type="submit"
                    disabled={isPostingComment || !commentContent.trim()}
                    className="absolute right-2.5 bottom-3 text-primary hover:text-primary-hover disabled:opacity-40 transition-colors font-bold text-xs"
                  >
                    Post
                  </button>
                </div>
              </form>

              {/* Feed of comments */}
              <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                {task.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex gap-3 p-3 bg-theme-bg/60 border border-theme-border/40 rounded-xl"
                  >
                    {/* User Avatar */}
                    <div className="w-7 h-7 rounded-lg bg-theme-bg border border-theme-border overflow-hidden flex items-center justify-center text-[10px] font-extrabold text-primary flex-shrink-0">
                      {comment.user.avatarUrl ? (
                        <img src={comment.user.avatarUrl} alt={comment.user.name} className="w-full h-full object-cover" />
                      ) : (
                        comment.user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    {/* Content */}
                    <div className="flex-grow space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-theme-text-secondary">
                        <span>{comment.user.name}</span>
                        <span>
                          {new Date(comment.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-theme-text leading-relaxed whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-theme-border flex-shrink-0 flex items-center justify-between bg-theme-bg/25">
          <span className="text-[10px] font-semibold text-theme-text-secondary/70">
            Created by: {task?.reporter?.name || 'Unknown'}
          </span>
          <button
            onClick={handleDeleteTask}
            className="h-10 px-4 flex items-center justify-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold rounded-xl text-xs transition-colors"
            title="Delete this task completely"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Task</span>
          </button>
        </div>

      </div>
    </div>
  );
}
