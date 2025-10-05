import { Link, useLocation } from 'react-router-dom';
import { Home, Globe, FlaskConical, Microscope, LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SignInButton, SignOutButton, useAuth, useUser } from '@clerk/clerk-react';
import logo from '@/assets/logo.png';

export const Navigation = () => {
  const location = useLocation();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/exploration', label: 'Exploration', icon: Globe },
    { path: '/laboratory', label: 'Laboratory', icon: FlaskConical },
    { path: '/workspace', label: 'Expert Workspace', icon: Microscope },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-20 h-20 rounded-lg flex items-center justify-center glow-primary transition-all group-hover:scale-110">
              <img src={logo} alt="SpaceCanva Logo" className="w-40 h-20" />
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

            {isSignedIn ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 border border-primary/30">
                  <User className="w-4 h-4 text-primary" />
                  <span className="hidden md:inline text-sm font-medium text-primary">
                    {user?.firstName || user?.username || 'User'}
                  </span>
                </div>
                <SignOutButton>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500/50 text-red-500 hover:bg-red-500/20 hover:border-red-500"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden md:inline ml-2">Sign Out</span>
                  </Button>
                </SignOutButton>
              </div>
            ) : (
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  className="border-primary/50 text-primary hover:bg-primary/20 hover:border-primary"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden md:inline ml-2">Sign In</span>
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
