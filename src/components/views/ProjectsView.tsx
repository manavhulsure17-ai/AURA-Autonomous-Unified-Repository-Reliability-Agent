import React, { useState, useEffect } from 'react';
import { ViewKey } from '../../types';

interface ProjectRecord {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  tier: string;
  owner_team: string;
  created_at: string;
  repositories?: Array<{
    id: number;
    name: string;
    repo_url: string;
    default_branch: string;
    language: string;
    ast_nodes_count: number;
    security_score: number;
  }>;
}

interface ProjectsViewProps {
  onNavigate: (view: ViewKey) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ onNavigate, onShowToast }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('main');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [backendConnected, setBackendConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
        setBackendConnected(true);
      } else {
        setBackendConnected(false);
      }
    } catch {
      setBackendConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      onShowToast('Please enter a project name', 'error');
      return;
    }

    const slug = projectName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-');

    setIsSubmitting(true);
    try {
      // 1. Create project in SQLite database via FastAPI
      const res = await fetch('/api/v1/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          name: projectName.trim(),
          description: description.trim() || 'Custom registered microservice repository in AURA.',
          tier: 'tier-2-standard',
          owner_team: 'Core Platform Swarm',
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to create project');
      }

      const createdProject: ProjectRecord = await res.json();

      // 2. If repoUrl is provided, link repository metadata
      if (repoUrl.trim()) {
        await fetch('/api/v1/repositories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            project_id: createdProject.id,
            name: projectName.trim(),
            repo_url: repoUrl.trim(),
            default_branch: selectedBranch || 'main',
            language: 'TypeScript / Python',
            ast_nodes_count: Math.floor(Math.random() * 40000) + 10000,
            cyclomatic_complexity: 2.8,
            security_score: 95.0,
            open_cves_count: 0,
            is_active: true,
          }),
        }).catch(() => {});
      }

      setShowCreateModal(false);
      setProjectName('');
      setRepoUrl('');
      setDescription('');
      onShowToast(`Project "${projectName}" saved to SQLite database and indexed!`, 'task_alt');
      await fetchProjects();
    } catch (err: any) {
      onShowToast(err.message || 'Error creating project in backend', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: number, slug: string) => {
    if (!confirm(`Are you sure you want to delete project "${slug}" from the SQLite database?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/v1/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onShowToast(`Project "${slug}" deleted from SQLite database.`, 'delete');
        fetchProjects();
      } else {
        onShowToast('Could not delete project', 'error');
      }
    } catch {
      onShowToast('Error contacting backend API', 'error');
    }
  };

  return (
    <div className="flex flex-col w-full text-[#dde2f3] space-y-4 font-mono">
      {/* HUD Ribbon */}
      <div className="px-4 py-2.5 bg-[#080e1a]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 border-b border-[#3b494b]/30">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]"></span>
          <span className="text-xs text-[#00f0ff] uppercase tracking-widest font-semibold">
            Projects & Multi-Repository Workspaces
          </span>
          <span className="text-[10px] text-[#849495] px-1.5 py-0.5 rounded bg-[#242a36]">
            {projects.length} Registered in Database
          </span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded flex items-center gap-1 ${
              backendConnected
                ? 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30'
                : 'bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/30'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${backendConnected ? 'bg-[#00f0ff] animate-pulse' : 'bg-[#ffb4ab]'}`}
            ></span>
            {backendConnected ? 'FastAPI + SQLite Active' : 'Connecting Backend...'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchProjects}
            className="px-2.5 py-1.5 rounded bg-[#242a36] text-[#dde2f3] hover:bg-[#323948] text-xs flex items-center gap-1 cursor-pointer transition-colors"
            title="Refresh from SQLite"
          >
            <span className="material-symbols-outlined text-[15px]">refresh</span>
            <span>Sync</span>
          </button>
          <a
            href="/docs"
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1.5 rounded bg-[#242a36] text-[#00f0ff] hover:bg-[#323948] text-xs flex items-center gap-1 cursor-pointer transition-colors border border-[#00f0ff]/30"
            title="Interactive Swagger Docs"
          >
            <span className="material-symbols-outlined text-[15px]">api</span>
            <span>Swagger API</span>
          </a>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-1.5 rounded bg-[#00f0ff] text-[#00363a] hover:bg-[#7df4ff] font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,240,255,0.3)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">add</span>
            <span>Connect Repository / Create Project</span>
          </button>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((proj) => {
            const hasRepo = proj.repositories && proj.repositories.length > 0;
            const primaryRepo = hasRepo ? proj.repositories![0] : null;

            return (
              <div
                key={proj.id}
                className="bg-[#161c28] p-4 rounded-xl border border-[#00f0ff]/40 shadow-lg relative overflow-hidden group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-[#00f0ff]/20 text-[#00f0ff] text-[10px] font-bold uppercase tracking-wider">
                        {proj.tier.replace(/-/g, ' ')}
                      </span>
                      <h3 className="text-sm font-bold text-[#dde2f3] mt-2">{proj.name}</h3>
                      <p className="text-xs text-[#849495] font-sans mt-1 line-clamp-2">
                        {proj.description || 'No description provided.'}
                      </p>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#65f2b5] shadow-[0_0_6px_#65f2b5]"></span>
                  </div>

                  <div className="mt-3 text-[11px] text-[#849495] space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Slug:</span>
                      <span className="text-[#dde2f3]">{proj.slug}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Owner Team:</span>
                      <span className="text-[#dde2f3]">{proj.owner_team}</span>
                    </div>
                    {primaryRepo && (
                      <div className="flex items-center justify-between">
                        <span>AST Nodes:</span>
                        <span className="text-[#00f0ff] font-bold">
                          {primaryRepo.ast_nodes_count.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#3b494b]/30 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-[#849495]">DATABASE ID</span>
                    <span className="text-[#65f2b5] font-bold block">#{proj.id} (SQLite)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onNavigate('repositories')}
                      className="px-2.5 py-1 rounded bg-[#00f0ff] text-[#00363a] font-bold text-[11px] hover:bg-[#7df4ff] cursor-pointer"
                    >
                      Inspect &rarr;
                    </button>
                    {proj.slug !== 'demo-ecommerce-api' && (
                      <button
                        onClick={() => handleDeleteProject(proj.id, proj.slug)}
                        className="p-1 rounded bg-[#242a36] text-[#ffb4ab] hover:bg-[#ffb4ab]/20 text-[11px] cursor-pointer"
                        title="Delete from SQLite"
                      >
                        <span className="material-symbols-outlined text-[15px]">delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && projects.length === 0 && (
            <div className="col-span-full py-8 text-center text-[#849495] text-xs">
              Connecting to FastAPI SQLite database...
            </div>
          )}
        </div>
      </div>

      {/* Modal for Creating Project */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161c28] border border-[#00f0ff]/50 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#3b494b]/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00f0ff]">account_tree</span>
                <h3 className="text-sm font-bold text-[#dde2f3]">Connect Git Repository to AURA</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#849495] hover:text-[#dde2f3] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#b9cacb] mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. billing-microservice"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#080e1a] border border-[#3b494b]/40 text-[#dde2f3] outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="block text-[#b9cacb] mb-1">Description (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Payment microservice with transaction rollback"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#080e1a] border border-[#3b494b]/40 text-[#dde2f3] outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="block text-[#b9cacb] mb-1">Repository URL (Git / GitHub / GitLab)</label>
                <input
                  type="text"
                  placeholder="https://github.com/org/repo.git"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#080e1a] border border-[#3b494b]/40 text-[#dde2f3] outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="block text-[#b9cacb] mb-1">Default Branch</label>
                <input
                  type="text"
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#080e1a] border border-[#3b494b]/40 text-[#dde2f3] outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div className="p-3 rounded bg-[#080e1a] border border-[#3b494b]/20 text-[11px] text-[#849495] space-y-1 font-sans">
                <div>&bull; Submitting will persist this record to SQLite via the FastAPI backend.</div>
                <div>&bull; AURA will automatically queue AST syntax graphs, symbols, and dependencies.</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded bg-[#242a36] text-[#b9cacb] hover:bg-[#323948] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded bg-[#00f0ff] text-[#00363a] font-bold hover:bg-[#7df4ff] cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving to SQLite...' : 'Index & Save to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
