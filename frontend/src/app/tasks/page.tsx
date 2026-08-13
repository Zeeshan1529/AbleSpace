'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import DashboardLayout from '@/components/DashboardLayout';
import CreateTaskModal from '@/components/CreateTaskModal';
import TaskDetailDrawer from '@/components/TaskDetailDrawer';
import {
  List,
  Kanban,
  Search,
  Plus,
  Filter,
  Eye,
  Calendar,
  User,
  CheckSquare,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  FolderOpen
} from 'lucide-react';

interface SubtaskType {
  id: string;
  isCompleted: boolean;
}

interface TaskType {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  projectId: string | null;
  assigneeId: string | null;
  project: { name: string } | null;
  assignee: { name: string; avatarUrl: string | null } | null;
  subtasks: SubtaskType[];
  comments: any[];
}

interface ProjectType {
  id: string;
  name: string;
}

export default function TasksPage() {
  const { apiBaseUrl } = useApp();
  
  // Tasks & metadata state
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals / Drawer state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  
  // View options
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    Backlog: false,
    Todo: false,
    Doing: false,
    Completed: false,
  });

  // Column / Field Visibility Toggles
  const [showPriority, setShowPriority] = useState(true);
  const [showAssignee, setShowAssignee] = useState(true);
  const [showDueDate, setShowDueDate] = useState(true);
  const [showSubtasks, setShowSubtasks] = useState(true);
  const [isFieldMenuOpen, setIsFieldMenuOpen] = useState(false);

  // Fetch Tasks
  const fetchTasks = async () => {
    try {
      let url = `${apiBaseUrl}/tasks?`;
      if (selectedProjectId) {
        url += `projectId=${selectedProjectId}&`;
      }
      if (searchQuery) {
        url += `search=${encodeURIComponent(searchQuery)}&`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Projects list (for filter dropdown)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/projects`);
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();
  }, [apiBaseUrl]);

  // Refetch when filters or query updates
  useEffect(() => {
    fetchTasks();
  }, [selectedProjectId, searchQuery, apiBaseUrl]);

  const handleTaskClick = (taskId: string) => {
    setActiveTaskId(taskId);
    setIsDrawerOpen(true);
  };

  const handleUpdateStatus = async (taskId: string, newStatus: string, e: React.MouseEvent | React.ChangeEvent) => {
    e.stopPropagation(); // Avoid opening drawer
    const val = 'target' in e ? (e.target as HTMLSelectElement).value : newStatus;
    
    try {
      const res = await fetch(`${apiBaseUrl}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: val }),
      });
      if (res.ok) {
        fetchTasks();
      }
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  // Local priority filter
  const filteredTasks = tasks.filter((task) => {
    if (selectedPriority && task.priority !== selectedPriority) return false;
    return true;
  });

  // Group tasks by status
  const statuses = ['Backlog', 'Todo', 'Doing', 'Completed'];
  
  const tasksByStatus = statuses.reduce<Record<string, TaskType[]>>((acc, status) => {
    acc[status] = filteredTasks.filter((t) => t.status === status);
    return acc;
  }, {});

  const toggleSection = (status: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  // Helpers
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'High':
        return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'Medium':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Low':
        return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
      default:
        return 'text-slate-400 bg-slate-400/5 border-slate-400/10';
    }
  };

  const getSubtasksProgress = (subtasks: SubtaskType[]) => {
    if (subtasks.length === 0) return null;
    const completed = subtasks.filter((s) => s.isCompleted).length;
    return `${completed}/${subtasks.length}`;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-theme-text tracking-tight">
              Task Dashboard
            </h1>
            <p className="text-sm font-semibold text-theme-text-secondary mt-1">
              Create, organize, and monitor tasks in list or boards view.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="h-11 flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary-hover px-5 font-bold rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-[0.98] self-start sm:self-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Create Task</span>
          </button>
        </div>

        {/* Toolbar & Filters */}
        <div className="flex flex-col gap-4 p-4 bg-theme-card border border-theme-border rounded-2xl transition-colors duration-300">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-theme-text-secondary/60">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-theme-bg border border-theme-border focus:border-primary/50 text-theme-text placeholder:text-theme-text-secondary/40 font-medium rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Filter selectors */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Project Filter */}
              <div className="relative">
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="h-10 px-3 pr-8 bg-theme-bg border border-theme-border text-theme-text text-xs font-bold rounded-xl focus:outline-none cursor-pointer"
                >
                  <option value="">All Projects</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div className="relative">
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="h-10 px-3 pr-8 bg-theme-bg border border-theme-border text-theme-text text-xs font-bold rounded-xl focus:outline-none cursor-pointer"
                >
                  <option value="">All Priorities</option>
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                  <option value="None">None</option>
                </select>
              </div>

              {/* Field Visibility Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsFieldMenuOpen(!isFieldMenuOpen)}
                  className="h-10 px-3 flex items-center justify-center gap-1.5 border border-theme-border bg-theme-bg hover:bg-theme-bg text-theme-text rounded-xl text-xs font-bold transition-all"
                >
                  <Eye className="w-4 h-4 text-theme-text-secondary" />
                  <span>Fields</span>
                </button>
                {isFieldMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-theme-card border border-theme-border p-3.5 rounded-2xl shadow-xl z-30 space-y-2.5 animate-fade-in">
                    <span className="block text-[10px] font-bold text-theme-text-secondary/70 uppercase tracking-widest mb-1">
                      Toggle Fields
                    </span>
                    <label className="flex items-center gap-2.5 text-xs font-bold text-theme-text cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showPriority}
                        onChange={(e) => setShowPriority(e.target.checked)}
                        className="rounded text-primary focus:ring-primary/20"
                      />
                      <span>Priority</span>
                    </label>
                    <label className="flex items-center gap-2.5 text-xs font-bold text-theme-text cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showAssignee}
                        onChange={(e) => setShowAssignee(e.target.checked)}
                        className="rounded text-primary focus:ring-primary/20"
                      />
                      <span>Assignee</span>
                    </label>
                    <label className="flex items-center gap-2.5 text-xs font-bold text-theme-text cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showDueDate}
                        onChange={(e) => setShowDueDate(e.target.checked)}
                        className="rounded text-primary focus:ring-primary/20"
                      />
                      <span>Due Date</span>
                    </label>
                    <label className="flex items-center gap-2.5 text-xs font-bold text-theme-text cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showSubtasks}
                        onChange={(e) => setShowSubtasks(e.target.checked)}
                        className="rounded text-primary focus:ring-primary/20"
                      />
                      <span>Subtasks</span>
                    </label>
                  </div>
                )}
              </div>

              {/* View Switcher Toggle */}
              <div className="flex border border-theme-border rounded-xl overflow-hidden p-0.5 bg-theme-bg">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-theme-card text-primary shadow-sm'
                      : 'text-theme-text-secondary hover:text-theme-text'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('board')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'board'
                      ? 'bg-theme-card text-primary shadow-sm'
                      : 'text-theme-text-secondary hover:text-theme-text'
                  }`}
                  title="Kanban Board View"
                >
                  <Kanban className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Task Board / Grid Container */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-72 bg-theme-card border border-theme-border rounded-3xl">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="mt-3 text-sm font-semibold text-theme-text-secondary">Fetching your tasks...</span>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-12 bg-theme-card border border-theme-border rounded-3xl h-72">
            <div className="w-12 h-12 rounded-2xl bg-theme-bg border border-theme-border flex items-center justify-center mb-4 text-theme-text-secondary">
              <FolderOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-theme-text mb-1 font-semibold">No Tasks Active</h3>
            <p className="text-sm font-semibold text-theme-text-secondary max-w-sm">
              We couldn't find any tasks. Try creating a new task, clearing your search, or adjusting filters.
            </p>
          </div>
        ) : viewMode === 'list' ? (
          /* ================= LIST VIEW ================= */
          <div className="space-y-4">
            {statuses.map((status) => {
              const statusTasks = tasksByStatus[status] || [];
              const isCollapsed = collapsedSections[status];
              return (
                <div
                  key={status}
                  className="bg-theme-card border border-theme-border rounded-3xl overflow-hidden shadow-sm transition-colors duration-300"
                >
                  {/* Status header toggle */}
                  <button
                    onClick={() => toggleSection(status)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-theme-bg/25 border-b border-theme-border/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-theme-text">
                        {status === 'Todo' ? 'To Do' : status}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-theme-bg border border-theme-border text-xs font-bold text-theme-text-secondary">
                        {statusTasks.length}
                      </span>
                    </div>
                    {isCollapsed ? (
                      <ChevronDown className="w-4 h-4 text-theme-text-secondary" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-theme-text-secondary" />
                    )}
                  </button>

                  {/* List Content */}
                  {!isCollapsed && (
                    <div className="divide-y divide-theme-border/40 overflow-x-auto">
                      {statusTasks.length === 0 ? (
                        <div className="px-6 py-8 text-center text-xs font-semibold text-theme-text-secondary/60">
                          No tasks in this stage.
                        </div>
                      ) : (
                        <table className="w-full text-left border-collapse min-w-[700px]">
                          <thead>
                            <tr className="bg-theme-bg/15 text-[10px] font-bold uppercase tracking-widest text-theme-text-secondary/80 border-b border-theme-border/30">
                              <th className="px-6 py-3 font-bold">Task Title</th>
                              {showPriority && <th className="px-4 py-3 font-bold">Priority</th>}
                              {showAssignee && <th className="px-4 py-3 font-bold">Assignee</th>}
                              {showDueDate && <th className="px-4 py-3 font-bold">Due Date</th>}
                              {showSubtasks && <th className="px-4 py-3 font-bold">Subtasks</th>}
                              <th className="px-6 py-3 font-bold text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-theme-border/30">
                            {statusTasks.map((task) => (
                              <tr
                                key={task.id}
                                onClick={() => handleTaskClick(task.id)}
                                className="hover:bg-theme-bg/10 cursor-pointer transition-colors group"
                              >
                                {/* Title */}
                                <td className="px-6 py-3.5">
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-sm font-bold text-theme-text line-clamp-1 group-hover:text-primary transition-colors">
                                      {task.title}
                                    </span>
                                    {task.project && (
                                      <span className="text-[10px] font-bold text-theme-text-secondary/75 uppercase tracking-wider">
                                        {task.project.name}
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* Priority Badge */}
                                {showPriority && (
                                  <td className="px-4 py-3.5">
                                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                                      {task.priority}
                                    </span>
                                  </td>
                                )}

                                {/* Assignee */}
                                {showAssignee && (
                                  <td className="px-4 py-3.5">
                                    {task.assignee ? (
                                      <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-theme-bg border border-theme-border overflow-hidden flex items-center justify-center text-[10px] font-extrabold text-primary flex-shrink-0">
                                          {task.assignee.avatarUrl ? (
                                            <img src={task.assignee.avatarUrl} alt={task.assignee.name} className="w-full h-full object-cover" />
                                          ) : (
                                            task.assignee.name.charAt(0).toUpperCase()
                                          )}
                                        </div>
                                        <span className="text-xs font-semibold text-theme-text-secondary truncate max-w-[120px]">
                                          {task.assignee.name}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-xs font-semibold text-theme-text-secondary/50">-</span>
                                    )}
                                  </td>
                                )}

                                {/* Due Date */}
                                {showDueDate && (
                                  <td className="px-4 py-3.5 text-xs font-semibold text-theme-text-secondary/80">
                                    {formatDate(task.dueDate)}
                                  </td>
                                )}

                                {/* Subtasks Progress */}
                                {showSubtasks && (
                                  <td className="px-4 py-3.5 text-xs font-semibold text-theme-text-secondary">
                                    {getSubtasksProgress(task.subtasks) || '-'}
                                  </td>
                                )}

                                {/* Move Status Action Menu */}
                                <td className="px-6 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                                  <select
                                    value={task.status}
                                    onChange={(e) => handleUpdateStatus(task.id, '', e)}
                                    className="h-8 px-2 bg-theme-bg border border-theme-border text-theme-text text-[10px] font-bold rounded-lg cursor-pointer focus:outline-none"
                                  >
                                    <option value="Backlog">Backlog</option>
                                    <option value="Todo">To Do</option>
                                    <option value="Doing">Doing</option>
                                    <option value="Completed">Completed</option>
                                  </select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* ================= BOARD VIEW ================= */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {statuses.map((status) => {
              const statusTasks = tasksByStatus[status] || [];
              return (
                <div
                  key={status}
                  className="bg-theme-card border border-theme-border rounded-3xl p-4 space-y-4 shadow-sm min-h-[450px] transition-colors duration-300"
                >
                  {/* Status header */}
                  <div className="flex items-center justify-between pb-2 border-b border-theme-border/60">
                    <span className="text-sm font-bold text-theme-text">
                      {status === 'Todo' ? 'To Do' : status}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-theme-bg border border-theme-border text-xs font-bold text-theme-text-secondary">
                      {statusTasks.length}
                    </span>
                  </div>

                  {/* Cards stack */}
                  <div className="space-y-3">
                    {statusTasks.length === 0 ? (
                      <div className="text-center py-12 text-xs font-semibold text-theme-text-secondary/50 border-2 border-dashed border-theme-border/40 rounded-2xl">
                        Drop tasks here
                      </div>
                    ) : (
                      statusTasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => handleTaskClick(task.id)}
                          className="group bg-theme-bg border border-theme-border hover:border-primary/30 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3 hover:translate-y-[-1px]"
                        >
                          <div className="space-y-1">
                            {task.project && (
                              <span className="text-[9px] font-bold text-theme-text-secondary/70 uppercase tracking-widest block">
                                {task.project.name}
                              </span>
                            )}
                            <h4 className="text-sm font-bold text-theme-text line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                              {task.title}
                            </h4>
                          </div>

                          {/* Middle properties display */}
                          <div className="flex flex-wrap items-center gap-2">
                            {showPriority && (
                              <span className={`text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            )}

                            {showSubtasks && getSubtasksProgress(task.subtasks) && (
                              <span className="text-[10px] font-semibold text-theme-text-secondary flex items-center gap-1">
                                <CheckSquare className="w-3 h-3 text-theme-text-secondary/70" />
                                <span>{getSubtasksProgress(task.subtasks)}</span>
                              </span>
                            )}
                          </div>

                          {/* Footer Details */}
                          <div className="flex items-center justify-between pt-3 border-t border-theme-border/40 text-[10px] font-semibold text-theme-text-secondary">
                            
                            {/* Assignee Avatar */}
                            {showAssignee && (
                              <div className="flex items-center gap-1.5">
                                {task.assignee ? (
                                  <>
                                    <div className="w-5.5 h-5.5 rounded-md bg-theme-card border border-theme-border overflow-hidden flex items-center justify-center text-[9px] font-extrabold text-primary">
                                      {task.assignee.avatarUrl ? (
                                        <img src={task.assignee.avatarUrl} alt={task.assignee.name} className="w-full h-full object-cover" />
                                      ) : (
                                        task.assignee.name.charAt(0).toUpperCase()
                                      )}
                                    </div>
                                    <span className="truncate max-w-[70px]" title={task.assignee.name}>
                                      {task.assignee.name.split(' ')[0]}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-theme-text-secondary/50">Unassigned</span>
                                )}
                              </div>
                            )}

                            {/* Due Date Indicator */}
                            {showDueDate && task.dueDate && (
                              <span className="flex items-center gap-1 text-theme-text-secondary/80">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(task.dueDate)}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Creation Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTaskCreated={fetchTasks}
      />

      {/* Detail Slideout Drawer */}
      <TaskDetailDrawer
        taskId={activeTaskId}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setActiveTaskId(null);
        }}
        onTaskUpdated={fetchTasks}
      />

    </DashboardLayout>
  );
}
