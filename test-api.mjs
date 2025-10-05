// Test script pour vérifier l'API NASA
import { nasaExoplanetService } from './src/services/nasaApi.ts';

async function testAPI() {
  try {
    console.log('Testing NASA Exoplanet API...');
    const exoplanets = await nasaExoplanetService.fetchConfirmedExoplanets();
    console.log(`✅ API fonctionne! Nombre d'exoplanètes confirmées: ${exoplanets.length}`);

    if (exoplanets.length > 0) {
      console.log('Premier exoplanète:', exoplanets[0]);
    }
  } catch (error) {
    console.error('❌ Erreur API:', error);
  }
}

testAPI();
