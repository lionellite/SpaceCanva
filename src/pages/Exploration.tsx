import { useState } from 'react';
import { Search, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CelestialObject {
  name: string;
  type: string;
  distance: string;
  status: string;
  description: string;
}

const mockObjects: CelestialObject[] = [
  {
    name: 'Kepler-186f',
    type: 'Exoplanet',
    distance: '500 light-years',
    status: 'Confirmed',
    description: 'First Earth-size planet found in the habitable zone of another star',
  },
  {
    name: 'Proxima Centauri b',
    type: 'Exoplanet',
    distance: '4.24 light-years',
    status: 'Confirmed',
    description: 'Closest known exoplanet to the Solar System',
  },
];

export default function Exploration() {
  const [selectedObject, setSelectedObject] = useState<CelestialObject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="relative min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h1 className="font-display text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
            Exploration
          </h1>
          <p className="text-muted-foreground font-tech text-lg">
            Navigate through the cosmos and discover celestial objects
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 3D Viewer Placeholder */}
          <div className="lg:col-span-2">
            <Card className="glass-strong h-[600px] flex items-center justify-center relative overflow-hidden border-primary/30">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent animate-glow-pulse" />
              
              <div className="relative z-10 text-center p-12">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary animate-rotate-slow glow-primary" />
                <h3 className="font-display text-2xl font-bold mb-4">3D Universe Viewer</h3>
                <p className="text-muted-foreground mb-6">
                  Interactive 3D visualization coming soon
                </p>
                <Badge variant="outline" className="border-primary text-primary">
                  Three.js Integration Placeholder
                </Badge>
              </div>

              {/* Floating elements */}
              <div className="absolute top-20 left-20 w-4 h-4 rounded-full bg-primary/50 animate-float" />
              <div className="absolute bottom-32 right-32 w-6 h-6 rounded-full bg-secondary/50 animate-float" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 right-20 w-3 h-3 rounded-full bg-cyan-400/50 animate-float" style={{ animationDelay: '2s' }} />
            </Card>
          </div>

          {/* Info Panel */}
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search celestial objects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-strong border-primary/30"
              />
            </div>

            {/* Object List */}
            <Card className="glass-strong p-4 max-h-[540px] overflow-y-auto border-primary/30">
              <h3 className="font-tech font-semibold mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                Nearby Objects
              </h3>
              
              <div className="space-y-3">
                {mockObjects.map((obj) => (
                  <button
                    key={obj.name}
                    onClick={() => setSelectedObject(obj)}
                    className="w-full text-left p-4 rounded-lg glass hover:bg-primary/10 transition-all border border-border/50 hover:border-primary/50 group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-tech font-semibold group-hover:text-primary transition-colors">
                        {obj.name}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {obj.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {obj.distance} • {obj.status}
                    </p>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Detail Modal */}
        {selectedObject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm">
            <Card className="glass-strong max-w-2xl w-full p-8 border-primary/50 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4"
                onClick={() => setSelectedObject(null)}
              >
                <X className="w-4 h-4" />
              </Button>

              <div className="mb-6">
                <Badge variant="outline" className="mb-4">{selectedObject.type}</Badge>
                <h2 className="font-display text-3xl font-bold mb-2">{selectedObject.name}</h2>
                <p className="text-muted-foreground font-tech">
                  Distance: {selectedObject.distance} • Status: {selectedObject.status}
                </p>
              </div>

              <p className="text-foreground leading-relaxed mb-6">
                {selectedObject.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Type</p>
                  <p className="font-tech font-semibold">{selectedObject.type}</p>
                </div>
                <div className="glass p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <p className="font-tech font-semibold">{selectedObject.status}</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
