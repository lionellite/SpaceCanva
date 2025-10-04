import { Link, useLocation } from 'react-router-dom';
import { Rocket, Globe, FlaskConical, Microscope, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: Rocket },
    { path: '/exploration', label: 'Exploration', icon: Globe },
    { path: '/laboratory', label: 'Laboratory', icon: FlaskConical },
    { path: '/workspace', label: 'Expert Workspace', icon: Microscope },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-primary transition-all group-hover:scale-110">
              <Rocket className="w-6 h-6 text-background" />
            </div>
            <span className="font-display text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SpaceCanva
            </span>
          </Link>

          <div className="flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-tech transition-all ${
                    active
                      ? 'bg-primary/20 text-primary glow-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{link.label}</span>
                </Link>
              );
            })}

            <Button
              asChild
              variant="outline"
              className="border-primary/50 text-primary hover:bg-primary/20 hover:border-primary"
            >
              <Link to="/auth" className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                <span className="hidden md:inline">Sign In</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
