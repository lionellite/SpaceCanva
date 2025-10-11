import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth, useUser, SignInButton } from '@clerk/clerk-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, BarChart3, TrendingUp, Database, Plus, Key, History, Loader2, FileUp, Play, CheckCircle, XCircle, Clock, Download, FileText, AlertCircle, X, Copy } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import WorkspaceSelector from '@/components/WorkspaceSelector';
import { toast } from 'sonner';

const mockAccuracyData = [
  { name: 'Epoch 1', accuracy: 65 },
  { name: 'Epoch 2', accuracy: 72 },
  { name: 'Epoch 3', accuracy: 78 },
  { name: 'Epoch 4', accuracy: 83 },
  { name: 'Epoch 5', accuracy: 87 },
  { name: 'Epoch 6', accuracy: 89 },
];

const mockClassificationData = [
  { name: 'Main Sequence', count: 145 },
  { name: 'Red Giant', count: 89 },
  { name: 'White Dwarf', count: 67 },
  { name: 'Neutron Star', count: 23 },
  { name: 'Black Hole', count: 12 },
];

interface Workspace {
  id: number;
  workspace_key: string;
  name: string;
  description: string;
  created_at: string;
  is_active: number;
}

interface Analysis {
  id: number;
  analysis_type: string;
  input_data: string;
  output_data: string;
  created_at: string;
}

interface Dataset {
  id: number;
  name: string;
  file_size: number;
  num_samples: number;
  uploaded_at: string;
}

interface TrainingSession {
  id: number;
  model_name: string;
  dataset_size: number;
  status: string;
  metrics: string;
  epochs_completed: number;
  created_at: string;
  completed_at: string | null;
}

export default function Workspace() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState('');
  const [showWorkspaceSelector, setShowWorkspaceSelector] = useState(false);
  
  // Training states
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<number | null>(null);
  const [trainingEpochs, setTrainingEpochs] = useState(50);
  const [showTrainingSection, setShowTrainingSection] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Enhanced upload states
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  
  // Polling states
  const [isPolling, setIsPolling] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Export states
  const [exportingData, setExportingData] = useState(false);

  // Load user's workspaces on mount
  useEffect(() => {
    if (isSignedIn) {
      loadWorkspaces();
    }
  }, [isSignedIn]);

  // Show workspace selector if no current workspace
  useEffect(() => {
    if (isSignedIn && workspaces.length === 0 && !currentWorkspace) {
      setShowWorkspaceSelector(true);
    }
  }, [isSignedIn, workspaces.length, currentWorkspace]);

  // Load analyses and training data when workspace changes
  useEffect(() => {
    if (currentWorkspace) {
      loadAnalyses();
      loadDatasets();
      loadTrainingSessions();
    }
  }, [currentWorkspace]);

  const loadWorkspaces = async () => {
    try {
      const response = await fetch('https://spacecanvabackend.onrender.com/api/workspace/list', {
        headers: {
          'X-Clerk-User-Id': user?.id || ''
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setWorkspaces(data.workspaces);
        
        // Auto-select first workspace if available and no current workspace
        if (data.workspaces.length > 0 && !currentWorkspace) {
          setCurrentWorkspace(data.workspaces[0]);
          setShowWorkspaceSelector(false);
        }
      }
    } catch (error) {
      console.error('Failed to load workspaces:', error);
    }
  };

  const handleWorkspaceSelected = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
    setShowWorkspaceSelector(false);
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

  const loadAnalyses = async () => {
    if (!currentWorkspace) return;

    try {
      const response = await fetch(
        `https://spacecanvabackend.onrender.com/api/workspace/history?workspace_key=${currentWorkspace.workspace_key}&limit=50`,
        {
          headers: {
            'X-Clerk-User-Id': user?.id || ''
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setAnalyses(data.analyses);
      }
    } catch (error) {
      console.error('Failed to load analyses:', error);
    }
  };

  const createWorkspace = async () => {
    if (!newWorkspaceName.trim()) return;

    setLoading(true);
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
        await loadWorkspaces();
        setCurrentWorkspace(data.workspace);
        setShowCreateForm(false);
        setNewWorkspaceName('');
        setNewWorkspaceDesc('');
      }
    } catch (error) {
      console.error('Failed to create workspace:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDatasets = async () => {
    if (!currentWorkspace) return;

    try {
      const response = await fetch(
        `https://spacecanvabackend.onrender.com/api/training/datasets?workspace_key=${currentWorkspace.workspace_key}`,
        {
          headers: {
            'X-Clerk-User-Id': user?.id || ''
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDatasets(data.datasets);
      }
    } catch (error) {
      console.error('Failed to load datasets:', error);
    }
  };

  const loadTrainingSessions = async () => {
    if (!currentWorkspace) return;

    try {
      const response = await fetch(
        `https://spacecanvabackend.onrender.com/api/training/sessions?workspace_key=${currentWorkspace.workspace_key}`,
        {
          headers: {
            'X-Clerk-User-Id': user?.id || ''
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTrainingSessions(data.sessions);
      }
    } catch (error) {
      console.error('Failed to load training sessions:', error);
    }
  };

  // Enhanced file upload with drag & drop
  const handleFileUpload = async (file: File) => {
    if (!file || !currentWorkspace) return;

    setUploadingFile(true);
    setUploadProgress(0);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('workspace_key', currentWorkspace.workspace_key);
      formData.append('name', file.name);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('https://spacecanvabackend.onrender.com/api/training/upload-dataset', {
        method: 'POST',
        headers: {
          'X-Clerk-User-Id': user?.id || ''
        },
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        const result = await response.json();
        setUploadSuccess(`Dataset "${file.name}" uploaded successfully!`);
        await loadDatasets();
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        // Clear success message after 3 seconds
        setTimeout(() => setUploadSuccess(null), 3000);
      } else {
        const errorData = await response.json();
        setUploadError(errorData.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Failed to upload dataset:', error);
      setUploadError('Network error during upload');
    } finally {
      setUploadingFile(false);
      setUploadProgress(0);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Drag & drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        handleFileUpload(file);
      } else {
        setUploadError('Please upload a CSV file');
      }
    }
  }, [currentWorkspace]);

  // Polling for training sessions
  const startPolling = useCallback(() => {
    if (pollingInterval) return;
    
    setIsPolling(true);
    const interval = setInterval(async () => {
      if (currentWorkspace) {
        await loadTrainingSessions();
      }
    }, 3000); // Poll every 3 seconds
    
    setPollingInterval(interval);
  }, [currentWorkspace, pollingInterval]);

  const stopPolling = useCallback(() => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
      setIsPolling(false);
    }
  }, [pollingInterval]);

  // Auto-start polling when training sessions exist
  useEffect(() => {
    const hasActiveTraining = trainingSessions.some(session => 
      session.status === 'training' || session.status === 'pending'
    );
    
    if (hasActiveTraining && !isPolling) {
      startPolling();
    } else if (!hasActiveTraining && isPolling) {
      stopPolling();
    }
  }, [trainingSessions, isPolling, startPolling, stopPolling]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  const startTraining = async () => {
    if (!selectedDataset || !currentWorkspace) return;

    setLoading(true);
    try {
      const response = await fetch('https://spacecanvabackend.onrender.com/api/training/start', {
        method: 'POST',
        headers: {
          'X-Clerk-User-Id': user?.id || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          workspace_key: currentWorkspace.workspace_key,
          dataset_id: selectedDataset,
          epochs: trainingEpochs
        })
      });

      if (response.ok) {
        await loadTrainingSessions();
        setSelectedDataset(null);
        // Start polling for this training session
        startPolling();
      }
    } catch (error) {
      console.error('Failed to start training:', error);
    } finally {
      setLoading(false);
    }
  };

  // Export functions
  const exportAnalysesToCSV = async () => {
    if (!currentWorkspace || analyses.length === 0) return;

    setExportingData(true);
    try {
      const csvData = analyses.map(analysis => {
        const inputData = JSON.parse(analysis.input_data);
        const outputData = JSON.parse(analysis.output_data);
        
        return {
          id: analysis.id,
          analysis_type: analysis.analysis_type,
          created_at: analysis.created_at,
          period: inputData.period,
          duration: inputData.duration,
          depth: inputData.depth,
          impact: inputData.impact,
          snr: inputData.snr,
          steff: inputData.steff,
          srad: inputData.srad,
          slogg: inputData.slogg,
          tmag: inputData.tmag,
          predicted_label: outputData.prediction?.label,
          confidence: outputData.prediction?.confidence,
          is_exoplanet: outputData.prediction?.is_exoplanet
        };
      });

      // Convert to CSV
      const headers = Object.keys(csvData[0]);
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => headers.map(header => row[header]).join(','))
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `spacecanva_analyses_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
    } finally {
      setExportingData(false);
    }
  };

  const exportTrainingSessionsToCSV = async () => {
    if (!currentWorkspace || trainingSessions.length === 0) return;

    setExportingData(true);
    try {
      const csvData = trainingSessions.map(session => {
        const metrics = session.metrics ? JSON.parse(session.metrics) : {};
        
        return {
          id: session.id,
          model_name: session.model_name,
          dataset_size: session.dataset_size,
          status: session.status,
          epochs_completed: session.epochs_completed,
          accuracy: metrics.accuracy ? (metrics.accuracy * 100).toFixed(2) : 'N/A',
          val_accuracy: metrics.val_accuracy ? (metrics.val_accuracy * 100).toFixed(2) : 'N/A',
          loss: metrics.loss ? metrics.loss.toFixed(4) : 'N/A',
          created_at: session.created_at,
          completed_at: session.completed_at
        };
      });

      // Convert to CSV
      const headers = Object.keys(csvData[0]);
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => headers.map(header => row[header]).join(','))
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `spacecanva_training_sessions_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export training data:', error);
    } finally {
      setExportingData(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="relative min-h-screen pt-24 pb-12 flex items-center justify-center">
        <Card className="glass-strong p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to access your Expert Workspace.
          </p>
          <SignInButton mode="modal">
            <Button className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90">
              Sign In with Clerk
            </Button>
          </SignInButton>
        </Card>
      </div>
    );
  }

  // Show workspace selector if no current workspace
  if (showWorkspaceSelector || !currentWorkspace) {
    return <WorkspaceSelector onWorkspaceSelected={handleWorkspaceSelected} />;
  }

  return (
    <div className="relative min-h-screen pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Expert Workspace
            </h1>
            <p className="text-muted-foreground font-tech text-base sm:text-lg">
              Welcome back, {user?.firstName || 'Expert'}! Manage your exoplanet analysis workspaces.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button 
              variant="outline"
              onClick={() => setShowWorkspaceSelector(true)}
              className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/20 text-sm"
              size="sm"
            >
              <Key className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Switch Workspace
            </Button>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90 text-sm"
              size="sm"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              New Workspace
            </Button>
          </div>
        </div>

        {/* Create Workspace Form */}
        {showCreateForm && (
          <Card className="glass-strong p-6 mb-8 border-cyan-400/30">
            <h3 className="text-xl font-bold mb-4">Create New Workspace</h3>
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
                  disabled={loading || !newWorkspaceName.trim()}
                  className="bg-gradient-to-r from-cyan-400 to-blue-500"
                >
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
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

        {/* Workspace Selector */}
        {workspaces.length > 0 && (
          <div className="mb-8">
            <Label className="mb-2 block">Select Workspace</Label>
            <div className="flex gap-3 flex-wrap">
              {workspaces.map((ws) => (
                <Button
                  key={ws.id}
                  variant={currentWorkspace?.id === ws.id ? "default" : "outline"}
                  onClick={() => setCurrentWorkspace(ws)}
                  className={currentWorkspace?.id === ws.id ? "bg-gradient-to-r from-cyan-400 to-blue-500" : ""}
                >
                  {ws.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Current Workspace Info */}
        {currentWorkspace && (
          <Card className="glass-strong p-6 mb-8 border-cyan-400/30">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">{currentWorkspace.name}</h2>
                {currentWorkspace.description && (
                  <p className="text-muted-foreground mb-4">{currentWorkspace.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    <code className="bg-muted px-2 py-1 rounded text-xs">
                      {currentWorkspace.workspace_key.substring(0, 16)}...
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyWorkspaceKey(currentWorkspace.workspace_key)}
                      className="h-6 w-6 p-0 hover:bg-cyan-400/20"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4" />
                    {analyses.length} analyses
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="text-cyan-400 border-cyan-400/50">
                Active
              </Badge>
            </div>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-strong p-6 border-cyan-400/30">
            <div className="flex items-center justify-between mb-2">
              <Database className="w-5 h-5 text-cyan-400" />
              <Badge variant="outline" className="text-cyan-400 border-cyan-400/50">
                Active
              </Badge>
            </div>
            <p className="text-3xl font-display font-bold mb-1">2,847</p>
            <p className="text-sm text-muted-foreground">Dataset Entries</p>
          </Card>

          <Card className="glass-strong p-6 border-cyan-400/30">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <Badge variant="outline" className="text-cyan-400 border-cyan-400/50">
                +12%
              </Badge>
            </div>
            <p className="text-3xl font-display font-bold mb-1">89%</p>
            <p className="text-sm text-muted-foreground">Model Accuracy</p>
          </Card>

          <Card className="glass-strong p-6 border-cyan-400/30">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <Badge variant="outline" className="text-cyan-400 border-cyan-400/50">
                Live
              </Badge>
            </div>
            <p className="text-3xl font-display font-bold mb-1">336</p>
            <p className="text-sm text-muted-foreground">Predictions Made</p>
          </Card>

          <Card className="glass-strong p-6 border-cyan-400/30">
            <div className="flex items-center justify-between mb-2">
              <Upload className="w-5 h-5 text-cyan-400" />
              <Badge variant="outline" className="text-cyan-400 border-cyan-400/50">
                Ready
              </Badge>
            </div>
            <p className="text-3xl font-display font-bold mb-1">5</p>
            <p className="text-sm text-muted-foreground">Datasets Loaded</p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Accuracy Chart */}
          <Card className="glass-strong p-6 border-cyan-400/30">
            <h3 className="font-tech font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Model Accuracy Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockAccuracyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Classification Chart */}
          <Card className="glass-strong p-6 border-cyan-400/30">
            <h3 className="font-tech font-semibold mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Classification Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockClassificationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--secondary))" 
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="glass-strong p-4 sm:p-6 text-center border-cyan-400/30">
            <Upload className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-cyan-400" />
            <h3 className="font-tech font-semibold mb-2 text-sm sm:text-base">Load New Dataset</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              Import CSV or JSON stellar data
            </p>
            <Button 
              variant="outline" 
              className="w-full border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/20 text-xs sm:text-sm"
              size="sm"
            >
              Choose File
            </Button>
          </Card>

          <Card className="glass-strong p-4 sm:p-6 text-center border-cyan-400/30">
            <Database className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-cyan-400" />
            <h3 className="font-tech font-semibold mb-2 text-sm sm:text-base">Explore Predictions</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              View detailed model outputs
            </p>
            <Button 
              variant="outline" 
              className="w-full border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/20 text-xs sm:text-sm"
              size="sm"
            >
              View Results
            </Button>
          </Card>

          <Card className="glass-strong p-4 sm:p-6 text-center border-cyan-400/30 sm:col-span-2 lg:col-span-1">
            <TrendingUp className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-cyan-400" />
            <h3 className="font-tech font-semibold mb-2 text-sm sm:text-base">Test Edge Cases</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              Challenge the model with ambiguous data
            </p>
            <Button 
              variant="outline" 
              className="w-full border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/20 text-xs sm:text-sm"
              size="sm"
            >
              Run Tests
            </Button>
          </Card>
        </div>

        {/* Model Training Section */}
        {currentWorkspace && (
          <Card className="glass-strong p-6 mb-8 border-cyan-400/30">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                Model Training
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTrainingSection(!showTrainingSection)}
              >
                {showTrainingSection ? 'Hide' : 'Show'}
              </Button>
            </div>

            {showTrainingSection && (
              <div className="space-y-6">
                {/* Enhanced Upload Dataset */}
                <div>
                  <h4 className="font-semibold mb-3">Upload Training Dataset</h4>
                  
                  {/* Drag & Drop Zone */}
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive
                        ? 'border-cyan-400 bg-cyan-400/10'
                        : 'border-cyan-400/30 hover:border-cyan-400/50'
                    } ${uploadingFile ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    
                    {uploadingFile ? (
                      <div className="space-y-4">
                        <Loader2 className="w-12 h-12 mx-auto text-cyan-400 animate-spin" />
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Uploading dataset...</p>
                          <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                          <p className="text-xs text-muted-foreground">{uploadProgress}% complete</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="w-12 h-12 mx-auto text-cyan-400" />
                        <div>
                          <p className="text-lg font-medium mb-2">
                            Drop your CSV file here or click to browse
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Supported format: CSV files only
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Upload Status Messages */}
                  {uploadError && (
                    <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-500">{uploadError}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUploadError(null)}
                        className="ml-auto h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}

                  {uploadSuccess && (
                    <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-500">{uploadSuccess}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUploadSuccess(null)}
                        className="ml-auto h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}

                  {/* CSV Format Info */}
                  <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border/30">
                    <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Required CSV Format
                    </h5>
                    <p className="text-xs text-muted-foreground mb-2">
                      Your CSV file must contain these columns (in any order):
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">period:</span>
                        <span className="font-mono">float (days)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">duration:</span>
                        <span className="font-mono">float (hours)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">depth:</span>
                        <span className="font-mono">float (ppm)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">impact:</span>
                        <span className="font-mono">float (0-1)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">snr:</span>
                        <span className="font-mono">float</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">steff:</span>
                        <span className="font-mono">float (K)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">srad:</span>
                        <span className="font-mono">float (R☉)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">slogg:</span>
                        <span className="font-mono">float (dex)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">tmag:</span>
                        <span className="font-mono">float (mag)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">label:</span>
                        <span className="font-mono">int (0,1,2)</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Labels:</strong> 0=CANDIDATE, 1=CONFIRMED, 2=FALSE POSITIVE
                    </p>
                  </div>
                </div>

                {/* Datasets List */}
                {datasets.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Available Datasets ({datasets.length})</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {datasets.map((dataset) => (
                        <div
                          key={dataset.id}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                            selectedDataset === dataset.id
                              ? 'border-cyan-400 bg-cyan-400/10'
                              : 'border-border/30 hover:border-cyan-400/50'
                          }`}
                          onClick={() => setSelectedDataset(dataset.id)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{dataset.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(dataset.uploaded_at).toLocaleDateString()}
                              </p>
                            </div>
                            {selectedDataset === dataset.id && (
                              <CheckCircle className="w-5 h-5 text-cyan-400" />
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{dataset.num_samples} samples</span>
                            <span>{(dataset.file_size / 1024).toFixed(1)} KB</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Training Configuration */}
                {selectedDataset && (
                  <div className="p-4 rounded-lg bg-background/50 border border-cyan-400/30">
                    <h4 className="font-semibold mb-3">Training Configuration</h4>
                    <div className="space-y-3">
                      <div>
                        <Label>Number of Epochs</Label>
                        <Input
                          type="number"
                          value={trainingEpochs}
                          onChange={(e) => setTrainingEpochs(parseInt(e.target.value))}
                          min={1}
                          max={200}
                          className="mt-1 w-32"
                        />
                      </div>
                      <Button
                        onClick={startTraining}
                        disabled={loading}
                        className="bg-gradient-to-r from-cyan-400 to-blue-500"
                      >
                        {loading ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Starting...</>
                        ) : (
                          <><Play className="w-4 h-4 mr-2" /> Start Training</>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Training Sessions */}
                {trainingSessions.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">Training Sessions ({trainingSessions.length})</h4>
                      <div className="flex items-center gap-2">
                        {isPolling && (
                          <Badge variant="outline" className="text-cyan-400 border-cyan-400/50">
                            <Clock className="w-3 h-3 mr-1 animate-pulse" />
                            Live Updates
                          </Badge>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={exportTrainingSessionsToCSV}
                          disabled={exportingData}
                          className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/20"
                        >
                          {exportingData ? (
                            <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Exporting...</>
                          ) : (
                            <><Download className="w-3 h-3 mr-1" /> Export CSV</>
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {trainingSessions.map((session) => {
                        const metrics = session.metrics ? JSON.parse(session.metrics) : {};
                        const isActive = session.status === 'training' || session.status === 'pending';
                        
                        return (
                          <div
                            key={session.id}
                            className={`p-4 rounded-lg border transition-colors ${
                              isActive
                                ? 'bg-cyan-400/5 border-cyan-400/30'
                                : 'bg-background/50 border-border/30'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-medium text-sm">{session.model_name}</p>
                                  {isActive && (
                                    <div className="flex gap-1">
                                      <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                                      <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                                      <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
                                    </div>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(session.created_at).toLocaleString()}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  session.status === 'completed'
                                    ? 'text-green-400 border-green-400/50'
                                    : session.status === 'training'
                                    ? 'text-yellow-400 border-yellow-400/50'
                                    : session.status === 'failed'
                                    ? 'text-red-400 border-red-400/50'
                                    : 'text-gray-400 border-gray-400/50'
                                }
                              >
                                {session.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                                {session.status === 'training' && <Clock className="w-3 h-3 mr-1" />}
                                {session.status === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
                                {session.status}
                              </Badge>
                            </div>
                            
                            {/* Progress Bar for Active Training */}
                            {isActive && (
                              <div className="mb-3">
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                  <span>Training Progress</span>
                                  <span>{session.epochs_completed} / {trainingEpochs} epochs</span>
                                </div>
                                <Progress 
                                  value={(session.epochs_completed / trainingEpochs) * 100} 
                                  className="h-2"
                                />
                              </div>
                            )}
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                              <div>
                                <span className="text-muted-foreground">Dataset:</span>
                                <span className="ml-1 font-medium">{session.dataset_size} samples</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Epochs:</span>
                                <span className="ml-1 font-medium">{session.epochs_completed}</span>
                              </div>
                              {metrics.accuracy && (
                                <div>
                                  <span className="text-muted-foreground">Accuracy:</span>
                                  <span className="ml-1 font-medium">{(metrics.accuracy * 100).toFixed(1)}%</span>
                                </div>
                              )}
                              {metrics.val_accuracy && (
                                <div>
                                  <span className="text-muted-foreground">Val Acc:</span>
                                  <span className="ml-1 font-medium">{(metrics.val_accuracy * 100).toFixed(1)}%</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Additional Metrics for Completed Training */}
                            {session.status === 'completed' && metrics && (
                              <div className="mt-3 pt-3 border-t border-border/20">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                                  {metrics.loss && (
                                    <div>
                                      <span className="text-muted-foreground">Loss:</span>
                                      <span className="ml-1 font-medium">{metrics.loss.toFixed(4)}</span>
                                    </div>
                                  )}
                                  {metrics.val_loss && (
                                    <div>
                                      <span className="text-muted-foreground">Val Loss:</span>
                                      <span className="ml-1 font-medium">{metrics.val_loss.toFixed(4)}</span>
                                    </div>
                                  )}
                                  {session.completed_at && (
                                    <div>
                                      <span className="text-muted-foreground">Duration:</span>
                                      <span className="ml-1 font-medium">
                                        {Math.round((new Date(session.completed_at).getTime() - new Date(session.created_at).getTime()) / 60000)}m
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Analysis History */}
        {currentWorkspace && analyses.length > 0 && (
          <Card className="glass-strong p-6 border-cyan-400/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <History className="w-5 h-5 text-cyan-400" />
                Analysis History
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={exportAnalysesToCSV}
                disabled={exportingData}
                className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/20"
              >
                {exportingData ? (
                  <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Exporting...</>
                ) : (
                  <><Download className="w-3 h-3 mr-1" /> Export CSV</>
                )}
              </Button>
            </div>
            <div className="space-y-3">
              {analyses.map((analysis) => {
                const inputData = JSON.parse(analysis.input_data);
                const outputData = JSON.parse(analysis.output_data);
                
                return (
                  <div 
                    key={analysis.id}
                    className="p-4 rounded-lg bg-background/50 border border-border/30 hover:border-cyan-400/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {analysis.analysis_type}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {new Date(analysis.created_at).toLocaleString()}
                        </p>
                      </div>
                      <Badge 
                        variant="outline"
                        className={
                          outputData.prediction?.label === 'CONFIRMED' 
                            ? 'text-green-400 border-green-400/50'
                            : outputData.prediction?.label === 'CANDIDATE'
                            ? 'text-yellow-400 border-yellow-400/50'
                            : 'text-red-400 border-red-400/50'
                        }
                      >
                        {outputData.prediction?.label || 'N/A'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Period:</span>
                        <span className="ml-2 font-medium">{inputData.period} days</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Depth:</span>
                        <span className="ml-2 font-medium">{inputData.depth} ppm</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">SNR:</span>
                        <span className="ml-2 font-medium">{inputData.snr}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Confidence:</span>
                        <span className="ml-2 font-medium">
                          {(outputData.prediction?.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        
      </div>
    </div>
  );
}
