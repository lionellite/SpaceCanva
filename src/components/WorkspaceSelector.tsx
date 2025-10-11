import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Key, Users, Database, Loader2, CheckCircle, XCircle, AlertCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface Workspace {
  id: number;
  workspace_key: string;
  name: string;
  description: string;
  created_at: string;
  is_active: number;
}

interface WorkspaceSelectorProps {
  onWorkspaceSelected: (workspace: Workspace) => void;
}

export default function WorkspaceSelector({ onWorkspaceSelected }: WorkspaceSelectorProps) {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);

  // Load user's workspaces on mount
  useEffect(() => {
    if (isSignedIn) {
      loadWorkspaces();
    }
  }, [isSignedIn]);

  const loadWorkspaces = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://spacecanvabackend.onrender.com/api/workspace/list', {
        headers: {
          'X-Clerk-User-Id': user?.id || ''
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setWorkspaces(data.workspaces);
      }
    } catch (error) {
      console.error('Failed to load workspaces:', error);
      toast.error('Failed to load workspaces');
    } finally {
      setLoading(false);
    }
  };

  const createWorkspace = async () => {
    if (!newWorkspaceName.trim()) {
      toast.error('Please enter a workspace name');
      return;
    }

    setCreateLoading(true);
    try {
      const response = await fetch('https://spacecanvabackend.onrender.com/api/workspace/create', {
        method: 'POST',
        headers: {
          'X-Clerk-User-Id': user?.id || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newWorkspaceName,
          description: newWorkspaceDesc
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        toast.success('Workspace created successfully!');
        await loadWorkspaces();
        onWorkspaceSelected(data.workspace);
        setShowCreateForm(false);
        setNewWorkspaceName('');
        setNewWorkspaceDesc('');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to create workspace');
      }
    } catch (error) {
      console.error('Failed to create workspace:', error);
      toast.error('Failed to create workspace');
    } finally {
      setCreateLoading(false);
    }
  };

  const joinWorkspace = async () => {
    if (!joinCode.trim()) return;

    setJoinLoading(true);
    try {
      const response = await fetch('https://spacecanvabackend.onrender.com/api/workspace/join', {
        method: 'POST',
        headers: {
          'X-Clerk-User-Id': user?.id || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          workspace_key: joinCode.trim()
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        toast.success('Successfully joined workspace!');
        await loadWorkspaces();
        onWorkspaceSelected(data.workspace);
        setShowJoinForm(false);
        setJoinCode('');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Invalid workspace code');
      }
    } catch (error) {
      console.error('Failed to join workspace:', error);
      toast.error('Failed to join workspace');
    } finally {
      setJoinLoading(false);
    }
  };

  const selectExistingWorkspace = (workspace: Workspace) => {
    onWorkspaceSelected(workspace);
  };

  const copyWorkspaceKey = async (workspaceKey: string) => {
    try {
      await navigator.clipboard.writeText(workspaceKey);
      toast.success('Workspace key copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy workspace key:', error);
      toast.error('Failed to copy workspace key');
    }
  };

  if (!isSignedIn) {
    return (
      <div className="relative min-h-screen pt-24 pb-12 flex items-center justify-center">
        <Card className="glass-strong p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to access your workspaces.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Choose Your Workspace
          </h1>
          <p className="text-muted-foreground font-tech text-lg">
            Welcome back, {user?.firstName || 'Expert'}! Select or create a workspace to continue.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Workspace
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowJoinForm(true)}
            className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/20"
          >
            <Key className="w-4 h-4 mr-2" />
            Join with Code
          </Button>
        </div>

        {/* Create Workspace Form */}
        {showCreateForm && (
          <Card className="glass-strong p-6 mb-8 border-cyan-400/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Create New Workspace</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateForm(false)}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Workspace Name</Label>
                <Input
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  placeholder="My Exoplanet Research"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Description (Optional)</Label>
                <Input
                  value={newWorkspaceDesc}
                  onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                  placeholder="Analyzing Kepler candidates..."
                  className="mt-1"
                />
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={createWorkspace}
                  disabled={createLoading}
                  className="bg-gradient-to-r from-cyan-400 to-blue-500"
                >
                  {createLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                  Create Workspace
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Join Workspace Form */}
        {showJoinForm && (
          <Card className="glass-strong p-6 mb-8 border-cyan-400/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Join Workspace</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowJoinForm(false)}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Workspace Code</Label>
                <Input
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="Enter workspace access code"
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Ask the workspace owner for the access code
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={joinWorkspace}
                  disabled={joinLoading || !joinCode.trim()}
                  className="bg-gradient-to-r from-cyan-400 to-blue-500"
                >
                  {joinLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Key className="w-4 h-4 mr-2" />}
                  Join Workspace
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowJoinForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Existing Workspaces */}
        {workspaces.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              Your Workspaces ({workspaces.length})
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {workspaces.map((workspace) => (
                <Card
                  key={workspace.id}
                  className="glass-strong p-6 border-cyan-400/30 hover:border-cyan-400/50 transition-colors cursor-pointer"
                  onClick={() => selectExistingWorkspace(workspace)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">{workspace.name}</h4>
                      {workspace.description && (
                        <p className="text-sm text-muted-foreground mb-2">{workspace.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Created {new Date(workspace.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-cyan-400 border-cyan-400/50">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Key className="w-3 h-3" />
                      <code className="bg-muted px-2 py-1 rounded text-xs">
                        {workspace.workspace_key.substring(0, 16)}...
                      </code>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyWorkspaceKey(workspace.workspace_key);
                      }}
                      className="h-6 w-6 p-0 hover:bg-cyan-400/20"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {workspaces.length === 0 && !showCreateForm && !showJoinForm && (
          <Card className="glass-strong p-12 text-center border-cyan-400/30">
            <Database className="w-16 h-16 mx-auto mb-4 text-cyan-400 opacity-50" />
            <h3 className="text-2xl font-bold mb-2">No Workspaces Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first workspace or join an existing one to start analyzing exoplanets
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-cyan-400 to-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Workspace
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowJoinForm(true)}
                className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/20"
              >
                <Key className="w-4 h-4 mr-2" />
                Join with Code
              </Button>
            </div>
          </Card>
        )}

        {/* Help Section */}
        <Card className="glass-strong p-6 border-cyan-400/30">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-cyan-400" />
            How Workspaces Work
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground mb-2">Creating a Workspace</h4>
              <p>Create a new workspace to start your own exoplanet analysis project. You'll get a unique access code to share with collaborators.</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Joining a Workspace</h4>
              <p>Use the access code provided by a workspace owner to join their project and collaborate on exoplanet analysis.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
