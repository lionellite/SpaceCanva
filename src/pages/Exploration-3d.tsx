import { useState } from 'react';
import { Search, Info, X, Filter, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Universe3D from '@/components/Universe3D';
import { Exoplanet } from '@/types/exoplanet';

export default function Exploration() {
  const [selectedPlanet, setSelectedPlanet] = useState<Exoplanet | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [maxDistance, setMaxDistance] = useState([1000]);
  const [temperatureColor, setTemperatureColor] = useState(true);
  const [orbitLines, setOrbitLines] = useState(true);

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

        {/* Controls */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search exoplanets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50 backdrop-blur-sm border-primary/30"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="bg-background/50 backdrop-blur-sm border-primary/30"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="mb-6 p-6 bg-background/50 backdrop-blur-sm border-primary/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label className="text-sm font-medium mb-2 block">Max Distance (parsecs)</Label>
                <Slider
                  value={maxDistance}
                  onValueChange={setMaxDistance}
                  max={5000}
                  min={100}
                  step={100}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground mt-1">{maxDistance[0]} parsecs</div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="temperature-color"
                  checked={temperatureColor}
                  onCheckedChange={setTemperatureColor}
                />
                <Label htmlFor="temperature-color">Temperature-based colors</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="orbit-lines"
                  checked={orbitLines}
                  onCheckedChange={setOrbitLines}
                />
                <Label htmlFor="orbit-lines">Show orbit lines</Label>
              </div>
            </div>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Universe 3D Viewer */}
          <div className="lg:col-span-2">
            <Card className="bg-black/20 backdrop-blur-sm h-[600px] overflow-hidden border-primary/30 rounded-lg relative">
              <Universe3D
                searchTerm={searchTerm}
                selectedPlanet={selectedPlanet}
                onPlanetSelect={setSelectedPlanet}
                maxDistance={maxDistance[0]}
                temperatureColor={temperatureColor}
                orbitLines={orbitLines}
              />
            </Card>
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-background/50 backdrop-blur-sm border-primary/30 rounded-lg">
              <div className="p-6">
                <h3 className="font-display text-xl font-bold mb-4 flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-primary" />
                  Exoplanet Details
                </h3>
                {selectedPlanet ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-lg">{selectedPlanet.pl_name}</h4>
                      <p className="text-sm text-muted-foreground">Host: {selectedPlanet.hostname}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Distance:</span>
                        <p className="font-medium">{selectedPlanet.st_dist?.toFixed(2)} parsecs</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Radius:</span>
                        <p className="font-medium">{selectedPlanet.pl_rade?.toFixed(2)} Earth radii</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Mass:</span>
                        <p className="font-medium">{selectedPlanet.pl_masse?.toFixed(2)} Earth masses</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Temperature:</span>
                        <p className="font-medium">{selectedPlanet.pl_eqt?.toFixed(0)} K</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{selectedPlanet.pl_discmethod}</Badge>
                      <Badge variant={selectedPlanet.pl_status === 'Confirmed' ? 'default' : 'outline'}>
                        {selectedPlanet.pl_status}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPlanet(null)}
                      className="w-full"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Close
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select an exoplanet to view details</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
