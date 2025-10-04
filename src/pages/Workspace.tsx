import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Upload, BarChart3, TrendingUp, Database } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

export default function Workspace() {
  return (
    <div className="relative min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h1 className="font-display text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Expert Workspace
          </h1>
          <p className="text-muted-foreground font-tech text-lg">
            Test, refine and enrich AI models with comprehensive analysis
          </p>
        </div>

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
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="glass-strong p-6 text-center border-cyan-400/30">
            <Upload className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
            <h3 className="font-tech font-semibold mb-2">Load New Dataset</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Import CSV or JSON stellar data
            </p>
            <Button 
              variant="outline" 
              className="w-full border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/20"
            >
              Choose File
            </Button>
          </Card>

          <Card className="glass-strong p-6 text-center border-cyan-400/30">
            <Database className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
            <h3 className="font-tech font-semibold mb-2">Explore Predictions</h3>
            <p className="text-sm text-muted-foreground mb-4">
              View detailed model outputs
            </p>
            <Button 
              variant="outline" 
              className="w-full border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/20"
            >
              View Results
            </Button>
          </Card>

          <Card className="glass-strong p-6 text-center border-cyan-400/30">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
            <h3 className="font-tech font-semibold mb-2">Test Edge Cases</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Challenge the model with ambiguous data
            </p>
            <Button 
              variant="outline" 
              className="w-full border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/20"
            >
              Run Tests
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
