interface KimiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface KimiResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class KimiService {
  private static instance: KimiService;
  private apiKey: string;
  private baseURL = 'https://api.moonshot.cn/v1';

  constructor() {
    // Note: In production, this should come from environment variables
    this.apiKey = import.meta.env.VITE_KIMI_API_KEY || 'your-kimi-api-key-here';
  }

  static getInstance(): KimiService {
    if (!KimiService.instance) {
      KimiService.instance = new KimiService();
    }
    return KimiService.instance;
  }

  async chat(messages: KimiMessage[], model: string = 'moonshot-v1-8k'): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 1000,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Kimi API error: ${response.status} ${response.statusText}`);
      }

      const data: KimiResponse = await response.json();

      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      } else {
        throw new Error('No response from Kimi API');
      }
    } catch (error) {
      console.error('Error calling Kimi API:', error);
      throw error;
    }
  }

  // Specialized method for space/astrophysics questions with structured output
  async chatAboutSpace(userMessage: string): Promise<{
    text: string;
    visualizations?: Array<{
      type: 'chart' | 'table' | 'gauge' | 'custom';
      data: {
        title?: string;
        points?: Array<{ x: number; y: number; label: string; color?: string }>;
        columns?: string[];
        rows?: Array<Array<string | number>>;
        value?: number;
        min?: number;
        max?: number;
        label?: string;
        unit?: string;
        customComponent?: string; // JSX code for custom component
      };
    }>;
  }> {
    const systemPrompt = `You are an expert astrophysicist and space scientist with deep knowledge of:
- Exoplanets and planetary science
- Stellar classification and evolution
- Cosmology and the universe
- Space missions and discoveries
- Astronomical observations and data

You should provide scientifically accurate, engaging responses about space and astronomy topics.

CRITICAL INSTRUCTION: You can include MULTIPLE data visualizations in your response. Use as many as needed to fully explain the topic.

For visualizations, use this EXACT JSON format at the END of your response.
You can include multiple visualizations by using multiple ---VISUALIZATION--- blocks:

For CHARTS (stellar classification, HR diagrams, etc.):
---VISUALIZATION---
{
  "type": "chart",
  "data": {
    "title": "Chart Title",
    "points": [
      {"x": 3.8, "y": 4.2, "label": "O-type stars", "color": "#9b59b6"},
      {"x": 4.0, "y": 3.8, "label": "A-type stars", "color": "#3498db"}
    ]
  }
}
---END---

For TABLES (lists, comparisons):
---VISUALIZATION---
{
  "type": "table",
  "data": {
    "title": "Table Title",
    "columns": ["Name", "Distance", "Type"],
    "rows": [
      ["Proxima Centauri", "4.24", "M5.5V"],
      ["Alpha Centauri", "4.37", "G2V"]
    ]
  }
}
---END---

For GAUGES (single values like temperature):
---VISUALIZATION---
{
  "type": "gauge",
  "data": {
    "value": 5778,
    "min": 2000,
    "max": 30000,
    "label": "Solar Temperature",
    "unit": "K"
  }
}
---END---

For CUSTOM COMPONENTS (use TailwindCSS classes, NO external dependencies):
IMPORTANT: Put the HTML on a SINGLE LINE without line breaks!
---VISUALIZATION---
{
  "type": "custom",
  "data": {
    "title": "Component Title",
    "customComponent": "<div class='space-y-4'><div class='flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30'><div class='text-2xl'>🌍</div><div><div class='font-semibold text-sm'>Earth</div><div class='text-xs text-muted-foreground'>Radius: 6371 km</div></div></div></div>"
  }
}
---END---

CRITICAL: 
- Use 'class' NOT 'className' in HTML
- Put ALL HTML on ONE SINGLE LINE
- NO line breaks in the customComponent string
- Use emojis (🌍🪐⭐🌙☄️🛸) and TailwindCSS gradients for visual appeal

You can create CUSTOM visualizations for:
- Planet/moon cards with icons and stats
- Comparison cards side-by-side
- Timeline visualizations
- Badge collections (mission status, etc.)
- Progress bars for multiple values
- Icon grids for classifications

EXAMPLE for a moon like Io (with MULTIPLE visualizations):
When asked about Io, you can include BOTH a table AND a gauge:

---VISUALIZATION---
{
  "type": "table",
  "data": {
    "title": "Io - Key Properties",
    "columns": ["Property", "Value", "Unit"],
    "rows": [
      ["Diameter", "3643", "km"],
      ["Mass", "8.93×10²²", "kg"],
      ["Orbital Period", "1.77", "Earth days"],
      ["Active Volcanoes", "400+", "count"]
    ]
  }
}
---END---

---VISUALIZATION---
{
  "type": "gauge",
  "data": {
    "value": 130,
    "min": 0,
    "max": 300,
    "label": "Io Surface Temperature",
    "unit": "K"
  }
}
---END---

ALWAYS provide real scientific data in your visualizations. Use MULTIPLE visualizations when it helps explain the topic better. Keep the main text response informative and accessible.`;

    const messages: KimiMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];

    const response = await this.chat(messages, 'moonshot-v1-8k');
    
    // Parse the response to extract ALL visualization data
    const vizMatches = response.matchAll(/---VISUALIZATION---([\s\S]*?)---END---/g);
    const visualizations: Array<{
      type: 'chart' | 'table' | 'gauge' | 'custom';
      data: {
        title?: string;
        points?: Array<{ x: number; y: number; label: string; color?: string }>;
        columns?: string[];
        rows?: Array<Array<string | number>>;
        value?: number;
        min?: number;
        max?: number;
        label?: string;
        unit?: string;
        customComponent?: string;
      };
    }> = [];
    
    let textContent = response;
    
    for (const match of vizMatches) {
      try {
        const vizData = JSON.parse(match[1].trim());
        visualizations.push(vizData);
        // Remove this visualization block from text (including any surrounding whitespace)
        textContent = textContent.replace(match[0], '');
      } catch (e) {
        console.error('Failed to parse visualization data:', e);
        console.error('Problematic JSON:', match[1]);
      }
    }
    
    // Clean up the text content - remove extra whitespace and empty lines
    textContent = textContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n')
      .trim();
    
    if (visualizations.length > 0) {
      return {
        text: textContent,
        visualizations
      };
    }
    
    return { text: textContent };
  }

  // Method to analyze and suggest UI components based on the response
  analyzeResponseForUI(response: string): {
    shouldShowChart: boolean;
    shouldShowTable: boolean;
    shouldShowComponent: boolean;
    suggestedComponent?: string;
    chartType?: 'line' | 'bar' | 'scatter' | 'pie';
    keywords: string[];
  } {
    const lowerResponse = response.toLowerCase();
    const keywords = [];

    // Check for chart indicators
    const chartKeywords = ['graph', 'chart', 'plot', 'diagram', 'visualization', 'data points', 'trend'];
    const shouldShowChart = chartKeywords.some(keyword => lowerResponse.includes(keyword));

    // Check for table indicators
    const tableKeywords = ['table', 'list', 'data', 'comparison', 'compare', 'statistics'];
    const shouldShowTable = tableKeywords.some(keyword => lowerResponse.includes(keyword));

    // Check for component indicators
    let suggestedComponent: string | undefined;
    const componentKeywords = [];

    if (lowerResponse.includes('temperature') || lowerResponse.includes('temp')) {
      suggestedComponent = 'TemperatureGauge';
      componentKeywords.push('temperature');
    }

    if (lowerResponse.includes('distance') || lowerResponse.includes('parsec') || lowerResponse.includes('light year')) {
      componentKeywords.push('distance');
    }

    if (lowerResponse.includes('star') || lowerResponse.includes('stellar')) {
      componentKeywords.push('stellar');
    }

    return {
      shouldShowChart,
      shouldShowTable,
      shouldShowComponent: !!suggestedComponent,
      suggestedComponent,
      chartType: shouldShowChart ? 'scatter' : undefined,
      keywords: componentKeywords
    };
  }
}

export const kimiService = KimiService.getInstance();
