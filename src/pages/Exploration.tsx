import { useState, useEffect } from 'react';
import { Search, Info, X, Filter, Globe, Eye, Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Exoplanet } from '@/types/exoplanet';
import { nasaExoplanetService } from '@/services/nasaApi';

export default function Exploration() {
  const [selectedPlanet, setSelectedPlanet] = useState<Exoplanet | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [exoplanets, setExoplanets] = useState<Exoplanet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // NASA Eyes iframe URL
  const base = 'https://eyes.nasa.gov/apps/exo/';
  const params = new URLSearchParams({
    embed: 'true',
    logo: 'false',
    menu: 'false',
    featured: 'false',
    locked: 'false'
  });

  const src = selectedPlanet
    ? `${base}#/planet/${selectedPlanet.pl_name.toLowerCase().replace(/\s+/g, '')}?${params.toString()}`
    : `${base}#/planet/earth?${params.toString()}`;


  return (
    <div className="relative min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h1 className="font-display text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
            Exploration
          </h1>
          <p className="text-muted-foreground font-tech text-lg">
            Navigate through the cosmos and discover celestial objects with NASA's Eyes
          </p>
        </div>
        <div className="grid lg:grid-cols-1 gap-6">
          {/* NASA's Eyes Universe Viewer */}
          <div className="lg:col-span-2">
            <Card className="bg-black/20 backdrop-blur-sm h-[600px] overflow-hidden border-primary/30 rounded-lg relative">
              <iframe
                src={src}
                className="w-full h-full border-0"
                title="NASA's Eyes - Universe Exploration"
                allow="fullscreen"
                frameBorder="0"
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
