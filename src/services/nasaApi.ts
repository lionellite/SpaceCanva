import { Exoplanet, ExoplanetResponse } from '@/types/exoplanet';

const PROXY_API_BASE = '/api/exoplanetarchive';

export class NasaExoplanetService {
  private static instance: NasaExoplanetService;
  private cache: Map<string, Exoplanet[]> = new Map();
  private readonly CACHE_DURATION = 1000 * 60 * 60; // 1 hour

  static getInstance(): NasaExoplanetService {
    if (!NasaExoplanetService.instance) {
      NasaExoplanetService.instance = new NasaExoplanetService();
    }
    return NasaExoplanetService.instance;
  }

  async fetchExoplanets(table: string = 'ps', format: string = 'json'): Promise<Exoplanet[]> {
    const cacheKey = `${table}_${format}`;

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Use proxy API instead of direct NASA API call
      const response = await fetch(`${PROXY_API_BASE}/exoplanets?table=${table}&format=${format}`);

      if (!response.ok) {
        throw new Error(`Proxy API error: ${response.status} ${response.statusText}`);
      }

      let data: { data?: unknown[]; metadata?: unknown[] };
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error(`Failed to parse JSON response: ${parseError}`);
      }

      // Handle TAP API response format
      if (!data || !data.data || !Array.isArray(data.data)) {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid response structure from proxy API');
      }

      // Convert TAP format to our expected format
      let exoplanets: Exoplanet[];
      if (data.data && Array.isArray(data.data)) {
        // TAP API returns data in 'data' field
        exoplanets = data.data.map((row: unknown[]) => {
          const exoplanet: Partial<Exoplanet> = {};
          // Map the row data to our field names
          if (data.metadata && Array.isArray(data.metadata)) {
            data.metadata.forEach((meta: { name: string }, index: number) => {
              const fieldName = meta.name;
              const value = row[index];
              if (value !== null && value !== '') {
                (exoplanet as Record<string, unknown>)[fieldName] = value;
              }
            });
          }
          return exoplanet as Exoplanet;
        });
      } else {
        throw new Error('Unexpected proxy API response format');
      }

      // Cache the results
      this.cache.set(cacheKey, exoplanets);

      return exoplanets;
    } catch (error) {
      console.error('Error fetching exoplanet data:', error);
      throw error;
    }
  }

  async fetchConfirmedExoplanets(): Promise<Exoplanet[]> {
    const allPlanets = await this.fetchExoplanets();
    return allPlanets.filter(planet => planet.pl_status === 'Confirmed');
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const nasaExoplanetService = NasaExoplanetService.getInstance();
