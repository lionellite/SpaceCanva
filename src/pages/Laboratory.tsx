import { useState } from 'react';
import { Send, Upload, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Laboratory() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Welcome to the SpaceCanva Laboratory. I can help you analyze stellar data, exoplanets, and cosmic phenomena. What would you like to explore?',
    },
  ]);
  const [input, setInput] = useState('');
  const [temperature, setTemperature] = useState([0.7]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsAnalyzing(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I\'m analyzing your query using the NASA Exoplanet dataset. This is a placeholder response - the actual AI integration will provide detailed stellar analysis.',
        },
      ]);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="relative min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h1 className="font-display text-5xl font-bold mb-4 bg-gradient-to-r from-secondary to-purple-400 bg-clip-text text-transparent">
            Laboratory
          </h1>
          <p className="text-muted-foreground font-tech text-lg">
            AI-powered stellar analysis and cosmic intelligence
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Hyperparameters Sidebar */}
          <Card className="glass-strong p-6 border-secondary/30 h-fit">
            <h3 className="font-tech font-semibold mb-6 flex items-center gap-2 text-secondary">
              <Cpu className="w-5 h-5" />
              Hyperparameters
            </h3>

            <div className="space-y-6">
              {/* Temperature Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-tech">Temperature</Label>
                  <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                    {temperature[0].toFixed(2)}
                  </span>
                </div>
                <Slider
                  value={temperature}
                  onValueChange={setTemperature}
                  min={0}
                  max={1}
                  step={0.01}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Controls randomness in AI responses
                </p>
              </div>

              {/* Placeholder for future parameters */}
              <div className="pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground italic">
                  More parameters coming soon...
                </p>
              </div>
            </div>

            {/* CSV Import */}
            <div className="mt-8 pt-6 border-t border-border/50">
              <Button
                variant="outline"
                className="w-full border-secondary/50 text-secondary hover:bg-secondary/20"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import CSV Data
              </Button>
            </div>
          </Card>

          {/* Chat Interface */}
          <div className="lg:col-span-3 flex flex-col">
            <Card className="glass-strong flex-1 flex flex-col border-secondary/30">
              {/* Messages */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[600px]">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-primary to-cyan-400 text-background'
                          : 'glass-strong border border-border/50'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}

                {/* Analyzing Animation */}
                {isAnalyzing && (
                  <div className="flex justify-start">
                    <div className="glass-strong border border-border/50 p-4 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" style={{ animationDelay: '0.2s' }} />
                          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" style={{ animationDelay: '0.4s' }} />
                        </div>
                        <span className="text-sm text-muted-foreground font-tech">
                          Analyzing cosmic data...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-6 border-t border-border/50">
                <div className="flex gap-3">
                  <Input
                    placeholder="Ask about stars, exoplanets, or stellar phenomena..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    className="glass-strong border-secondary/30 flex-1"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isAnalyzing}
                    className="bg-gradient-to-r from-secondary to-purple-400 hover:opacity-90 glow-secondary"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
