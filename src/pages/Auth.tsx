import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export default function Auth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Placeholder authentication
    if (email && password) {
      toast.success('Authentication successful!');
      navigate('/');
    } else {
      toast.error('Please fill in all fields');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6">
      {/* Animated background elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '1s' }} />

      <Card className="glass-strong w-full max-w-md p-8 border-primary/50 relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-primary">
            <Rocket className="w-8 h-8 text-background" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">
            Enter the Cosmos
          </h1>
          <p className="text-muted-foreground font-tech">
            Sign in to access SpaceCanva
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-tech">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="astronaut@space.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-strong border-primary/30"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="font-tech">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-strong border-primary/30"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-cyan-400 hover:opacity-90 glow-primary font-tech text-lg py-6"
          >
            Launch Mission
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button className="text-primary hover:underline font-tech">
              Request Access
            </button>
          </p>
        </div>

        {/* Note */}
        <div className="mt-6 p-4 glass rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            🔐 Authentication integration placeholder - Supabase/Clerk coming soon
          </p>
        </div>
      </Card>
    </div>
  );
}
