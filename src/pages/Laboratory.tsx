import { useState } from 'react';
import { Send, Upload, Cpu, MessageSquare, Zap, Database, TrendingUp } from 'lucide-react';
import { kimiService } from '@/services/ai/kimiService';
import { useUser } from '@clerk/clerk-react';
import { Card } from '@/components/ui/card';
import { Slider } from '@radix-ui/react-slider';
import { Label } from '@radix-ui/react-label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface TextMessage {
  type: 'text';
  content: string;
}

interface TemperatureGaugeProps {
  currentTemp: number;
  minTemp: number;
  maxTemp: number;
  label: string;
}

interface UIComponentMessage {
  type: 'component';
  component: string;
  props: TemperatureGaugeProps | Record<string, unknown>;
}

interface CustomComponentMessage {
  type: 'custom';
  title: string;
  htmlContent: string;
}

interface ExoplanetFormMessage {
  type: 'exoplanet-form';
  description: string;
}

interface ChartMessage {
  type: 'chart';
  chartType: 'line' | 'bar' | 'scatter' | 'pie';
  data: Array<{ x: number; y: number; label: string; color?: string }>;
  title: string;
}

interface DataTableMessage {
  type: 'table';
  data: Array<Array<string | number>>;
  columns: string[];
  title: string;
}

interface AnalysisMessage {
  type: 'analysis';
  summary: string;
  insights: string[];
  recommendations: string[];
}

type MessageContent = TextMessage | UIComponentMessage | CustomComponentMessage | ExoplanetFormMessage | ChartMessage | DataTableMessage | AnalysisMessage;

interface Message {
  role: 'user' | 'assistant';
  content: MessageContent;
  timestamp: Date;
}

export default function Laboratory() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: {
        type: 'text',
        content: 'Welcome to the SpaceCanva Laboratory. I can help you analyze stellar data, exoplanets, and cosmic phenomena. What would you like to explore?'
      },
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [temperature, setTemperature] = useState([0.7]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [exoplanetData, setExoplanetData] = useState({
    mission: '',
    period: '',
    duration: '',
    depth: '',
    impact: '',
    snr: '',
    steff: '',
    srad: '',
    slogg: '',
    tmag: ''
  });

  const handleAnalyzeExoplanet = async () => {
    setIsAnalyzing(true);
    
    try {
      // Send data to backend
      const response = await fetch('https://spacecanvabackend.onrender.com/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Clerk-User-Id': user?.id || '',
        },
        body: JSON.stringify({
          mission: exoplanetData.mission || undefined,
          period: parseFloat(exoplanetData.period),
          duration: parseFloat(exoplanetData.duration),
          depth: parseFloat(exoplanetData.depth),
          impact: parseFloat(exoplanetData.impact),
          snr: parseFloat(exoplanetData.snr),
          steff: parseFloat(exoplanetData.steff),
          srad: parseFloat(exoplanetData.srad),
          slogg: parseFloat(exoplanetData.slogg),
          tmag: parseFloat(exoplanetData.tmag)
        })
      });

      if (!response.ok) {
        throw new Error('Backend error');
      }

      const result = await response.json();
      
      // Send result to AI for enriched response
      const aiPrompt = `J'ai analysé un candidat exoplanète avec les résultats suivants:

Classification: ${result.prediction.classification}
Label: ${result.prediction.label}
Confiance: ${(result.prediction.confidence * 100).toFixed(1)}%

Probabilités par classe:
- CANDIDATE: ${(result.prediction.label_probabilities.CANDIDATE * 100).toFixed(1)}%
- CONFIRMED: ${(result.prediction.label_probabilities.CONFIRMED * 100).toFixed(1)}%
- FALSE POSITIVE: ${(result.prediction.label_probabilities.FALSE_POSITIVE * 100).toFixed(1)}%

Prédictions du modèle:
- Période prédite: ${result.model_predictions.predicted_period.toFixed(2)} jours (entrée: ${result.model_predictions.input_period} jours)
- Profondeur prédite: ${result.model_predictions.predicted_depth_ppm.toFixed(0)} ppm (entrée: ${result.model_predictions.input_depth_ppm} ppm)
- Erreur période: ${result.model_predictions.period_error.toFixed(2)} jours
- Erreur profondeur: ${result.model_predictions.depth_error_ppm.toFixed(0)} ppm

Données du candidat:
- Période orbitale: ${result.metadata.period} jours
- Durée du transit: ${result.metadata.duration} heures
- Profondeur: ${result.metadata.depth} ppm
- SNR: ${result.metadata.snr}
- Température stellaire: ${result.metadata.steff} K
- Rayon stellaire: ${result.metadata.srad} R☉
${result.metadata.estimated_planet_radius ? `- Rayon planétaire estimé: ${result.metadata.estimated_planet_radius.toFixed(2)} R⊕` : ''}

Analyse:
- Qualité du transit: ${result.analysis.transit_quality}
- Type de transit: ${result.analysis.transit_type}
- Type d'étoile: ${result.analysis.star_type}
- Cohérence du modèle: ${result.analysis.model_consistency}

Peux-tu créer une réponse détaillée avec des visualisations (tableau des probabilités, tableau des prédictions vs entrées, jauge de confiance, et un composant personnalisé pour le résultat avec émoji approprié) ?`;

      const aiResult = await kimiService.chatAboutSpace(aiPrompt);
      
      // Add AI response with visualizations
      if (aiResult.text && aiResult.text.length > 10) {
        const textMessage: Message = {
          role: 'assistant',
          content: {
            type: 'text',
            content: aiResult.text
          },
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, textMessage]);
      }

      // Add visualizations
      if (aiResult.visualizations && aiResult.visualizations.length > 0) {
        for (const viz of aiResult.visualizations) {
          let vizMessage: MessageContent;

          if (viz.type === 'chart') {
            vizMessage = {
              type: 'chart',
              chartType: 'scatter',
              title: viz.data.title || 'AI Generated Visualization',
              data: viz.data.points || []
            };
          } else if (viz.type === 'table') {
            vizMessage = {
              type: 'table',
              title: viz.data.title || 'AI Generated Data',
              columns: viz.data.columns || [],
              data: viz.data.rows || []
            };
          } else if (viz.type === 'gauge') {
            vizMessage = {
              type: 'component',
              component: 'TemperatureGauge',
              props: {
                currentTemp: viz.data.value || 0,
                minTemp: viz.data.min || 0,
                maxTemp: viz.data.max || 100,
                label: viz.data.label || 'Value'
              }
            };
          } else if (viz.type === 'custom' && viz.data.customComponent) {
            vizMessage = {
              type: 'custom',
              title: viz.data.title || '',
              htmlContent: viz.data.customComponent
            };
          } else {
            continue;
          }

          await new Promise(resolve => setTimeout(resolve, 300));
          setMessages((prev) => [...prev, {
            role: 'assistant',
            content: vizMessage,
            timestamp: new Date(),
          }]);
        }
      }
      
    } catch (error) {
      console.error('Error analyzing exoplanet:', error);
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: {
          type: 'text',
          content: `Erreur lors de l'analyse: ${error}. Assurez-vous que le backend est démarré (cd backend && python app.py)`
        },
        timestamp: new Date(),
      }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper function to render a single visualization
  const renderVisualization = (message: Message, isInGroup: boolean = false) => {
    const containerClass = isInGroup ? "" : "max-w-[80%]";
    
    return (
      <div className={`${containerClass} p-4 rounded-2xl glass-strong border border-border/50`}>
        {message.content.type === 'chart' && (
          <div>
            <h3 className="font-tech font-semibold mb-4 text-secondary">{message.content.title}</h3>
            <div className="bg-gradient-to-br from-background/50 to-background/20 rounded-lg border border-border/30 p-6">
              <div className="space-y-3">
                {message.content.data.length > 0 ? (
                  message.content.data.map((point, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 rounded bg-background/30">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: point.color || '#3498db' }}
                      />
                      <span className="text-sm font-medium flex-1">{point.label || `Point ${idx + 1}`}</span>
                      <span className="text-xs text-muted-foreground">
                        ({typeof point.x === 'number' ? point.x.toFixed(2) : parseFloat(point.x).toFixed(2)}, {typeof point.y === 'number' ? point.y.toFixed(2) : parseFloat(point.y).toFixed(2)})
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {message.content.chartType} Chart - No data
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {message.content.type === 'table' && (
          <div>
            <h3 className="font-tech font-semibold mb-4 text-secondary">{message.content.title}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    {message.content.columns.map((col, i) => (
                      <th key={i} className="text-left py-2 px-3 font-medium text-muted-foreground">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {message.content.data.map((row, i) => (
                    <tr key={i} className="border-b border-border/20">
                      {row.map((cell, j) => (
                        <td key={j} className="py-2 px-3">{String(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {message.content.type === 'component' && message.content.component === 'TemperatureGauge' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4 text-secondary" />
              <span className="text-sm font-tech text-secondary">Interactive Component</span>
            </div>
            {(() => {
              const props = message.content.props as TemperatureGaugeProps;
              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{props.label}</span>
                    <Badge variant="outline">{props.currentTemp.toLocaleString()} K</Badge>
                  </div>
                  <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-green-500 to-red-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${((props.currentTemp - props.minTemp) / (props.maxTemp - props.minTemp)) * 100}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{props.minTemp.toLocaleString()} K</span>
                    <span>{props.maxTemp.toLocaleString()} K</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
        {message.content.type === 'custom' && (
          <div>
            {message.content.title && (
              <h3 className="font-tech font-semibold mb-4 text-secondary">{message.content.title}</h3>
            )}
            <div 
              dangerouslySetInnerHTML={{ __html: message.content.htmlContent }}
              className="custom-ai-component"
            />
          </div>
        )}
      </div>
    );
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: {
        type: 'text',
        content: input
      },
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsAnalyzing(true);

    try {
      // Check if user is asking about exoplanet verification
      const exoplanetKeywords = ['vérifier', 'verify', 'check', 'exoplanète', 'exoplanet', 'candidat', 'candidate', 'transit', 'données', 'détecter', 'detect', 'faux positif', 'false positive'];
      const isExoplanetVerification = exoplanetKeywords.some(keyword => 
        userInput.toLowerCase().includes(keyword)
      ) && (userInput.toLowerCase().includes('comment') || userInput.toLowerCase().includes('how'));

      if (isExoplanetVerification) {
        // Show exoplanet verification form
        const formMessage: Message = {
          role: 'assistant',
          content: {
            type: 'exoplanet-form',
            description: `Pour vérifier si un candidat est une exoplanète, j'ai besoin des données suivantes issues des observations de transit. Ces paramètres permettent d'analyser la courbe de lumière et de distinguer une vraie exoplanète d'un faux positif (binaire éclipsante, bruit instrumental, etc.).`
          },
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, formMessage]);
        setIsAnalyzing(false);
        return;
      }

      // Call Kimi API for intelligent response with visualizations
      const aiResult = await kimiService.chatAboutSpace(userInput);

      // First, add the text response (only if there's meaningful text)
      if (aiResult.text && aiResult.text.length > 10) {
        const textMessage: Message = {
          role: 'assistant',
          content: {
            type: 'text',
            content: aiResult.text
          },
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, textMessage]);
      }

      // Then, add each visualization as a separate message
      if (aiResult.visualizations && aiResult.visualizations.length > 0) {
        for (const viz of aiResult.visualizations) {
          let vizMessage: MessageContent;

          if (viz.type === 'chart') {
            vizMessage = {
              type: 'chart',
              chartType: 'scatter',
              title: viz.data.title || 'AI Generated Visualization',
              data: viz.data.points || []
            };
          } else if (viz.type === 'table') {
            vizMessage = {
              type: 'table',
              title: viz.data.title || 'AI Generated Data',
              columns: viz.data.columns || [],
              data: viz.data.rows || []
            };
          } else if (viz.type === 'gauge') {
            vizMessage = {
              type: 'component',
              component: 'TemperatureGauge',
              props: {
                currentTemp: viz.data.value || 0,
                minTemp: viz.data.min || 0,
                maxTemp: viz.data.max || 100,
                label: viz.data.label || 'Value'
              }
            };
          } else if (viz.type === 'custom' && viz.data.customComponent) {
            vizMessage = {
              type: 'custom',
              title: viz.data.title || '',
              htmlContent: viz.data.customComponent
            };
          } else {
            continue; // Skip unknown types
          }

          // Add visualization message with slight delay for better UX
          await new Promise(resolve => setTimeout(resolve, 300));
          setMessages((prev) => [...prev, {
            role: 'assistant',
            content: vizMessage,
            timestamp: new Date(),
          }]);
        }
      }
    } catch (error) {
      console.error('Error with Kimi API:', error);
      // Fallback to local response
      const fallbackResponse = generateFallbackResponse(userInput);
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date(),
      }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper functions for generating sample data based on keywords
  const generateSampleChartData = (keywords: string[]) => {
    if (keywords.includes('stellar')) {
      return [
        { x: 3.8, y: 4.2, label: 'O-type', color: '#9b59b6' },
        { x: 3.9, y: 4.0, label: 'B-type', color: '#3498db' },
        { x: 4.0, y: 3.8, label: 'A-type', color: '#2ecc71' },
        { x: 4.2, y: 3.5, label: 'F-type', color: '#f1c40f' },
        { x: 4.4, y: 3.2, label: 'G-type (Sun)', color: '#e67e22' },
        { x: 4.6, y: 2.8, label: 'K-type', color: '#e74c3c' },
        { x: 4.8, y: 2.5, label: 'M-type', color: '#95a5a6' }
      ];
    }

    // Default scatter data
    return [
      { x: 1, y: 2, label: 'Point A' },
      { x: 2, y: 3, label: 'Point B' },
      { x: 3, y: 1, label: 'Point C' },
      { x: 4, y: 4, label: 'Point D' }
    ];
  };

  const generateSampleTableData = (keywords: string[]) => {
    if (keywords.includes('distance')) {
      return [
        ['Proxima Centauri', '1.30', 'parsecs'],
        ['α Centauri A', '1.32', 'parsecs'],
        ['Barnard\'s Star', '1.83', 'parsecs'],
        ['Sirius', '2.64', 'parsecs'],
        ['Vega', '7.68', 'parsecs']
      ];
    }

    if (keywords.includes('temperature')) {
      return [
        ['Sun', '5778', 'Kelvin'],
        ['Sirius', '9940', 'Kelvin'],
        ['Vega', '9602', 'Kelvin'],
        ['Betelgeuse', '3500', 'Kelvin'],
        ['Proxima Centauri', '3042', 'Kelvin']
      ];
    }

    // Default table
    return [
      ['Property 1', 'Value 1', 'Unit 1'],
      ['Property 2', 'Value 2', 'Unit 2'],
      ['Property 3', 'Value 3', 'Unit 3']
    ];
  };

  const generateSampleComponentProps = (componentType: string, keywords: string[]) => {
    if (componentType === 'TemperatureGauge') {
      return {
        currentTemp: 5778,
        minTemp: 2000,
        maxTemp: 30000,
        label: 'Stellar Effective Temperature'
      };
    }

    // Default props
    return {
      value: 42,
      label: 'Sample Component'
    };
  };

  const generateSampleInsights = (keywords: string[]) => {
    if (keywords.includes('exoplanet')) {
      return [
        'TRAPPIST-1 system contains 7 Earth-sized planets',
        'Proxima Centauri b is the closest exoplanet at 4.2 light-years',
        'Kepler-452 b orbits in the habitable zone of a Sun-like star'
      ];
    }

    if (keywords.includes('stellar')) {
      return [
        'Main sequence stars fuse hydrogen in their cores',
        'Stellar classification follows the Hertzsprung-Russell diagram',
        'Mass determines stellar lifetime and evolutionary path'
      ];
    }

    return [
      'Astrophysics combines physics, chemistry, and mathematics',
      'Observations across the electromagnetic spectrum reveal cosmic secrets',
      'Space missions like JWST expand our understanding of the universe'
    ];
  };

  const generateSampleRecommendations = (keywords: string[]) => {
    if (keywords.includes('exoplanet')) {
      return [
        'Focus on M-dwarf systems for atmospheric characterization',
        'Prioritize rocky planets in habitable zones',
        'Consider JWST follow-up observations for TRAPPIST-1 planets'
      ];
    }

    if (keywords.includes('stellar')) {
      return [
        'Study stellar spectra for composition analysis',
        'Monitor variable stars for pulsation patterns',
        'Use interferometry for precise stellar measurements'
      ];
    }

    return [
      'Continue exploring cosmic phenomena',
      'Consider multi-wavelength observations',
      'Collaborate with international space agencies'
    ];
  };

  const generateFallbackResponse = (userInput: string): MessageContent => {
    return {
      type: 'text',
      content: `I understand you're asking about "${userInput}". This is a fascinating topic in astrophysics! While I'm connecting to Kimi for the most up-to-date information, I can tell you that this involves complex astronomical concepts that require sophisticated analysis. Would you like me to show you some visual representations or sample data related to this topic?`
    };
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
                {messages.map((message, index) => {
                  // Check if this is a visualization and if the next message is also a visualization
                  const isVisualization = message.role === 'assistant' && 
                    (message.content.type === 'chart' || message.content.type === 'table' || message.content.type === 'component' || message.content.type === 'custom');
                  
                  const nextMessage = messages[index + 1];
                  const nextIsVisualization = nextMessage && nextMessage.role === 'assistant' &&
                    (nextMessage.content.type === 'chart' || nextMessage.content.type === 'table' || nextMessage.content.type === 'component' || nextMessage.content.type === 'custom');
                  
                  const prevMessage = messages[index - 1];
                  const prevIsVisualization = prevMessage && prevMessage.role === 'assistant' &&
                    (prevMessage.content.type === 'chart' || prevMessage.content.type === 'table' || prevMessage.content.type === 'component' || prevMessage.content.type === 'custom');
                  
                  // Skip if this is a visualization and the previous was also a visualization (will be grouped)
                  if (isVisualization && prevIsVisualization) {
                    return null;
                  }
                  
                  // If this is a visualization, collect all consecutive visualizations
                  const visualizationsGroup: Message[] = [];
                  if (isVisualization) {
                    let i = index;
                    while (i < messages.length && messages[i].role === 'assistant' &&
                      (messages[i].content.type === 'chart' || messages[i].content.type === 'table' || messages[i].content.type === 'component' || messages[i].content.type === 'custom')) {
                      visualizationsGroup.push(messages[i]);
                      i++;
                    }
                  }
                  
                  // If we have a group of visualizations, render them in a grid
                  if (visualizationsGroup.length > 0) {
                    const gridCols = visualizationsGroup.length === 1 ? 'grid-cols-1' :
                                    visualizationsGroup.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                                    'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
                    
                    return (
                      <div key={index} className="flex justify-start w-full">
                        <div className={`grid ${gridCols} gap-4 w-full max-w-[95%]`}>
                          {visualizationsGroup.map((vizMsg, vizIdx) => (
                            <div key={`${index}-${vizIdx}`}>
                              {renderVisualization(vizMsg, true)}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                  <div key={index}>
                    {message.role === 'user' ? (
                      <div className="flex justify-end">
                        <div className="max-w-[80%] p-4 rounded-2xl bg-gradient-to-br from-primary to-cyan-400 text-background">
                          <p className="text-sm leading-relaxed">
                            {message.content.type === 'text' ? message.content.content : 'Message utilisateur'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-start">
                        {message.content.type === 'text' ? (
                          <div className="max-w-[80%] p-4 rounded-2xl glass-strong border border-border/50">
                            <p className="text-sm leading-relaxed">{message.content.content}</p>
                          </div>
                        ) : message.content.type === 'exoplanet-form' ? (
                          <div className="max-w-[95%] p-6 rounded-2xl glass-strong border border-secondary/30">
                            <div className="flex items-center gap-2 mb-4">
                              <Database className="w-5 h-5 text-secondary" />
                              <h3 className="font-tech font-semibold text-secondary">Vérification d'Exoplanète</h3>
                            </div>
                            <p className="text-sm mb-6 text-muted-foreground">{message.content.description}</p>
                            
                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                              <div className="space-y-3">
                                <div>
                                  <Label className="text-xs font-tech text-muted-foreground">Mission (facultatif)</Label>
                                  <Input 
                                    placeholder="kepler, k2, ou tess" 
                                    className="mt-1 glass-strong"
                                    value={exoplanetData.mission}
                                    onChange={(e) => setExoplanetData({...exoplanetData, mission: e.target.value})}
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">Utile pour les splits ou l'analyse par domaine</p>
                                </div>
                                <div>
                                  <Label className="text-xs font-tech text-muted-foreground">Période orbitale (jours)</Label>
                                  <Input 
                                    type="number" 
                                    placeholder="ex: 3.52" 
                                    className="mt-1 glass-strong"
                                    value={exoplanetData.period}
                                    onChange={(e) => setExoplanetData({...exoplanetData, period: e.target.value})}
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">Détermine le ré-alignement des transits</p>
                                </div>
                                <div>
                                  <Label className="text-xs font-tech text-muted-foreground">Durée du transit (heures)</Label>
                                  <Input 
                                    type="number" 
                                    placeholder="ex: 2.5" 
                                    className="mt-1 glass-strong"
                                    value={exoplanetData.duration}
                                    onChange={(e) => setExoplanetData({...exoplanetData, duration: e.target.value})}
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">Aide à distinguer planète vs binaire</p>
                                </div>
                                <div>
                                  <Label className="text-xs font-tech text-muted-foreground">Profondeur (ppm)</Label>
                                  <Input 
                                    type="number" 
                                    placeholder="ex: 1000" 
                                    className="mt-1 glass-strong"
                                    value={exoplanetData.depth}
                                    onChange={(e) => setExoplanetData({...exoplanetData, depth: e.target.value})}
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">≈ (Rₚ/R⋆)²</p>
                                </div>
                                <div>
                                  <Label className="text-xs font-tech text-muted-foreground">Paramètre d'impact</Label>
                                  <Input 
                                    type="number" 
                                    placeholder="ex: 0.5" 
                                    className="mt-1 glass-strong"
                                    value={exoplanetData.impact}
                                    onChange={(e) => setExoplanetData({...exoplanetData, impact: e.target.value})}
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">0 = transit central, &gt; 1 = grasing/faux positif</p>
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <div>
                                  <Label className="text-xs font-tech text-muted-foreground">SNR (rapport signal/bruit)</Label>
                                  <Input 
                                    type="number" 
                                    placeholder="ex: 15.2" 
                                    className="mt-1 glass-strong"
                                    value={exoplanetData.snr}
                                    onChange={(e) => setExoplanetData({...exoplanetData, snr: e.target.value})}
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">Indicateur de qualité du dip</p>
                                </div>
                                <div>
                                  <Label className="text-xs font-tech text-muted-foreground">Température stellaire (K)</Label>
                                  <Input 
                                    type="number" 
                                    placeholder="ex: 5778" 
                                    className="mt-1 glass-strong"
                                    value={exoplanetData.steff}
                                    onChange={(e) => setExoplanetData({...exoplanetData, steff: e.target.value})}
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">Influence profondeur & forme du transit</p>
                                </div>
                                <div>
                                  <Label className="text-xs font-tech text-muted-foreground">Rayon stellaire (R☉)</Label>
                                  <Input 
                                    type="number" 
                                    placeholder="ex: 1.0" 
                                    className="mt-1 glass-strong"
                                    value={exoplanetData.srad}
                                    onChange={(e) => setExoplanetData({...exoplanetData, srad: e.target.value})}
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">Utilisé pour estimer Rₚ</p>
                                </div>
                                <div>
                                  <Label className="text-xs font-tech text-muted-foreground">Log g stellaire (dex)</Label>
                                  <Input 
                                    type="number" 
                                    placeholder="ex: 4.5" 
                                    className="mt-1 glass-strong"
                                    value={exoplanetData.slogg}
                                    onChange={(e) => setExoplanetData({...exoplanetData, slogg: e.target.value})}
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">Classifier l'étoile (naine vs géante)</p>
                                </div>
                                <div>
                                  <Label className="text-xs font-tech text-muted-foreground">Magnitude T (mag)</Label>
                                  <Input 
                                    type="number" 
                                    placeholder="ex: 12.5" 
                                    className="mt-1 glass-strong"
                                    value={exoplanetData.tmag}
                                    onChange={(e) => setExoplanetData({...exoplanetData, tmag: e.target.value})}
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">Bruit instrumental ∝ 10^(-0.2 tmag)</p>
                                </div>
                              </div>
                            </div>
                            
                            <Button 
                              className="w-full bg-gradient-to-r from-secondary to-purple-400 hover:opacity-90"
                              onClick={handleAnalyzeExoplanet}
                              disabled={isAnalyzing || !exoplanetData.period || !exoplanetData.duration}
                            >
                              <Zap className="w-4 h-4 mr-2" />
                              {isAnalyzing ? 'Analyse en cours...' : 'Analyser le candidat'}
                            </Button>
                          </div>
                        ) : message.content.type === 'analysis' ? (
                          <div className="max-w-[80%] p-4 rounded-2xl glass-strong border border-border/50">
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 mb-3">
                                <Database className="w-4 h-4 text-secondary" />
                                <span className="text-sm font-tech text-secondary">AI Analysis</span>
                              </div>
                              <p className="text-sm mb-4">{message.content.summary}</p>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    Key Insights
                                  </h4>
                                  <ul className="space-y-1">
                                    {message.content.insights.map((insight, i) => (
                                      <li key={i} className="text-xs text-muted-foreground">• {insight}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2 flex items-center gap-2">
                                    <Zap className="w-4 h-4" />
                                    Recommendations
                                  </h4>
                                  <ul className="space-y-1">
                                    {message.content.recommendations.map((rec, i) => (
                                      <li key={i} className="text-xs text-muted-foreground">• {rec}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          renderVisualization(message, false)
                        )}
                      </div>
                    )}
                  </div>
                  );
                })}

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
