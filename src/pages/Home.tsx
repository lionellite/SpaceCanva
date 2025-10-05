import { Link } from 'react-router-dom';
import { Globe, FlaskConical, Microscope, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import spaceBg from '@/assets/space-bg.jpg';

const portals = [
  {
    title: 'Exploration',
    description: 'Navigate through the cosmos with interactive 3D visualization of stars, planets, and exoplanets',
    icon: Globe,
    path: '/exploration',
    gradient: 'from-primary to-cyan-400',
  },
  {
    title: 'Laboratory',
    description: 'Analyze stellar data with AI-powered chatbot and advanced hyperparameters control',
    icon: FlaskConical,
    path: '/laboratory',
    gradient: 'from-secondary to-purple-400',
  },
  {
    title: 'Expert Workspace',
    description: 'Test, refine and enrich AI models with comprehensive visualization tools',
    icon: Microscope,
    path: '/workspace',
    gradient: 'from-cyan-400 to-blue-500',
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${spaceBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-in">
          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-shimmer">
            SpaceCanva
          </h1>
          <p className="font-tech text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Explore the universe with AI-powered analysis and immersive 3D visualization
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary to-cyan-400 hover:opacity-90 glow-primary font-tech text-lg"
            >
              <Link to="/exploration">
                Start Exploring
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary/50 text-primary hover:bg-primary/20 font-tech text-lg"
            >
              <Link to="/laboratory">Launch Laboratory</Link>
            </Button>
          </div>
        </div>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {portals.map((portal, index) => {
            const Icon = portal.icon;
            
            return (
              <Link
                key={portal.path}
                to={portal.path}
                className="group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <Card className="glass-strong h-full p-8 hover:scale-105 transition-all duration-300 border-border/50 hover:border-primary/50 relative overflow-hidden">
                  {/* Holographic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${portal.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform glow-primary`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {portal.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {portal.description}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-primary font-tech">
                      Enter Portal
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="mt-32 text-center">
          <h2 className="font-display text-4xl font-bold mb-6">
            Powered by Advanced Technology
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
            <div className="glass p-6 rounded-xl">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="font-tech text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-sm text-muted-foreground">Advanced machine learning for stellar classification</p>
            </div>
            <div className="glass p-6 rounded-xl">
              <div className="text-4xl mb-4">🌌</div>
              <h3 className="font-tech text-xl font-semibold mb-2">3D Visualization</h3>
              <p className="text-sm text-muted-foreground">Immersive interactive universe exploration</p>
            </div>
            <div className="glass p-6 rounded-xl">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="font-tech text-xl font-semibold mb-2">NASA Data</h3>
              <p className="text-sm text-muted-foreground">Real exoplanet dataset from NASA archives</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
