import { useState } from 'react';
import { Search, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Exploration() {

  const planet = 'earth'

  const base = 'https://eyes.nasa.gov/apps/exo/';
  const params = new URLSearchParams({
    embed: 'true',
    logo: 'false',
    menu: 'false',
    featured: 'false',
    locked: 'false'
  });

  const src = `${base}#/planet/${planet}?${params.toString()}`;

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

        <div className="grid lg:grid-cols-1 gap-6">
          {/* NASA's Eyes Universe Viewer */}
          <div className="lg:col-span-2">
            <Card className="glass-strong h-[600px] overflow-hidden border-primary/30">
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