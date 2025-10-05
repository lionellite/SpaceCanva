import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import { Suspense, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Exoplanet } from '@/types/exoplanet';
import { nasaExoplanetService } from '@/services/nasaApi';

interface UniverseConfig {
  showMilkyWay: boolean;
  showExoplanets: boolean;
  maxDistance: number; // in parsecs
  planetSizeScale: number;
  temperatureColor: boolean;
  orbitLines: boolean;
  searchTerm?: string;
  selectedPlanet?: Exoplanet | null;
  onPlanetSelect?: (planet: Exoplanet) => void;
}

function Starfield() {
  return <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />;
}

function MilkyWay() {
  const galaxyGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    // Create spiral arms with more detail
    for (let arm = 0; arm < 4; arm++) {
      for (let i = 0; i < 2000; i++) {
        const angle = (i / 2000) * Math.PI * 6 + (arm * Math.PI / 2);
        const radius = (i / 2000) * 100;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * 4;

        positions.push(x, y, z);

        // Color gradient from center to edge (yellow center to blue edge)
        const intensity = 1 - (radius / 100);
        colors.push(intensity * 1.0, intensity * 0.8, intensity * 0.4 + 0.6);
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    return geometry;
  }, []);

  return (
    <points geometry={galaxyGeometry}>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation={true}
      />
    </points>
  );
}

function Exoplanets({ config }: { config: UniverseConfig }) {
  const [exoplanets, setExoplanets] = useState<Exoplanet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExoplanets = async () => {
      try {
        setLoading(true);
        const data = await nasaExoplanetService.fetchConfirmedExoplanets();
        setExoplanets(data.slice(0, 1000)); // Limit for performance
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load exoplanets');
      } finally {
        setLoading(false);
      }
    };

    if (config.showExoplanets) {
      loadExoplanets();
    }
  }, [config.showExoplanets]);

  // Filter exoplanets based on search term
  const filteredExoplanets = exoplanets.filter(planet => {
    if (!config.searchTerm) return true;
    const searchLower = config.searchTerm.toLowerCase();
    return (
      planet.pl_name?.toLowerCase().includes(searchLower) ||
      planet.hostname?.toLowerCase().includes(searchLower) ||
      planet.pl_discmethod?.toLowerCase().includes(searchLower)
    );
  });

  const handlePlanetClick = (planet: Exoplanet) => {
    if (config.onPlanetSelect) {
      config.onPlanetSelect(planet);
    }
  };

  const getPlanetColor = (planet: Exoplanet): string => {
    if (config.temperatureColor && planet.pl_eqt) {
      // Color based on equilibrium temperature
      const temp = planet.pl_eqt;
      if (temp < 273) return '#4a90e2'; // Cold - blue
      if (temp < 373) return '#7ed321'; // Temperate - green
      if (temp < 1000) return '#f5a623'; // Warm - orange
      return '#d0021b'; // Hot - red
    }
    return '#ffffff'; // Default white
  };

  const getPlanetSize = (planet: Exoplanet): number => {
    if (planet.pl_rade) {
      return Math.max(0.1, Math.min(2, planet.pl_rade * config.planetSizeScale));
    }
    return 0.3; // Default size
  };

  const convertToCartesian = (ra: number, dec: number, distance: number): [number, number, number] => {
    // Convert RA/Dec to 3D coordinates
    const raRad = (ra * Math.PI) / 180;
    const decRad = (dec * Math.PI) / 180;
    const dist = Math.min(distance, config.maxDistance) * 0.1; // Scale down for visualization

    const x = dist * Math.cos(decRad) * Math.cos(raRad);
    const y = dist * Math.sin(decRad);
    const z = dist * Math.cos(decRad) * Math.sin(raRad);

    return [x, y, z];
  };

  if (loading) {
    return (
      <Html center>
        <div className="text-white text-sm">Loading exoplanets...</div>
      </Html>
    );
  }

  if (error) {
    return (
      <Html center>
        <div className="text-red-400 text-sm">Error: {error}</div>
      </Html>
    );
  }

  return (
    <>
      {filteredExoplanets
        .filter(planet => planet.ra && planet.dec && planet.st_dist && planet.st_dist <= config.maxDistance)
        .map((planet, index) => {
          const position = convertToCartesian(planet.ra!, planet.dec!, planet.st_dist);
          const color = getPlanetColor(planet);
          const size = getPlanetSize(planet);
          const isSelected = config.selectedPlanet?.pl_name === planet.pl_name;

          return (
            <group key={`${planet.pl_name}-${index}`}>
              <mesh
                position={position}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlanetClick(planet);
                }}
                scale={isSelected ? 1.5 : 1}
              >
                <sphereGeometry args={[size, 8, 8]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={isSelected ? 0.5 : 0.2}
                />
              </mesh>
              {config.orbitLines && planet.pl_orbsmax && (
                <mesh position={position}>
                  <ringGeometry args={[planet.pl_orbsmax * 0.01, planet.pl_orbsmax * 0.01 + 0.01, 32]} />
                  <meshBasicMaterial color={color} transparent opacity={0.3} />
                </mesh>
              )}
            </group>
          );
        })}
    </>
  );
}

export default function Universe3D({
  searchTerm = '',
  selectedPlanet = null,
  onPlanetSelect,
  showMilkyWay = true,
  showExoplanets = true,
  maxDistance = 1000,
  planetSizeScale = 0.3,
  temperatureColor = true,
  orbitLines = true,
}: {
  searchTerm?: string;
  selectedPlanet?: Exoplanet | null;
  onPlanetSelect?: (planet: Exoplanet) => void;
  showMilkyWay?: boolean;
  showExoplanets?: boolean;
  maxDistance?: number;
  planetSizeScale?: number;
  temperatureColor?: boolean;
  orbitLines?: boolean;
}) {
  const config = {
    showMilkyWay,
    showExoplanets,
    maxDistance,
    planetSizeScale,
    temperatureColor,
    orbitLines,
    searchTerm,
    selectedPlanet,
    onPlanetSelect,
  };

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 50], fov: 75 }}
        gl={{ antialias: true }}
        style={{ background: 'radial-gradient(ellipse at center, #0f0f23 0%, #000000 100%)' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.1} />
          <pointLight position={[10, 10, 10]} />
          <Starfield />
          {config.showMilkyWay && <MilkyWay />}
          {config.showExoplanets && <Exoplanets config={config} />}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            zoomSpeed={0.6}
            panSpeed={0.5}
            rotateSpeed={0.4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
