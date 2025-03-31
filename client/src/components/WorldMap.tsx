import { useState, useRef, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

// Updated to a more reliable source
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface League {
  id: number;
  name: string;
  sport: string;
  logo: string;
  location?: {
    lat: number;
    lng: number;
    country: string;
  };
}

interface WorldMapProps {
  leagues: League[];
  selectedSport: string | null;
  onSelectLeague: (leagueId: number) => void;
}

export default function WorldMap({ leagues, selectedSport, onSelectLeague }: WorldMapProps) {
  const [filteredLeagues, setFilteredLeagues] = useState<League[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Filter leagues based on selected sport
  useEffect(() => {
    if (!selectedSport) {
      setFilteredLeagues([]);
      return;
    }
    
    const filtered = leagues.filter(league => 
      league.sport.toLowerCase() === selectedSport.toLowerCase() && 
      league.location // Only include leagues with location data
    );
    setFilteredLeagues(filtered);
  }, [leagues, selectedSport]);

  // Update map dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (mapRef.current) {
        setDimensions({
          width: mapRef.current.clientWidth,
          height: window.innerHeight * 0.5, // Set height to 50% of viewport height
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Mock locations for different sports leagues
  const sportLocations = {
    'Basketball': [
      { name: 'NBA', coords: [-95.7129, 37.0902], country: 'USA' },
      { name: 'EuroLeague', coords: [10.4515, 51.1657], country: 'Europe' },
      { name: 'CBA', coords: [116.4074, 39.9042], country: 'China' },
      { name: 'NBL', coords: [133.7751, -25.2744], country: 'Australia' },
      { name: 'Liga ACB', coords: [-3.7038, 40.4168], country: 'Spain' },
    ],
    'Football': [
      { name: 'Premier League', coords: [-1.1743, 52.3555], country: 'England' },
      { name: 'La Liga', coords: [-3.7038, 40.4168], country: 'Spain' },
      { name: 'Bundesliga', coords: [10.4515, 51.1657], country: 'Germany' },
      { name: 'Serie A', coords: [12.5674, 41.8719], country: 'Italy' },
      { name: 'Ligue 1', coords: [2.3522, 48.8566], country: 'France' },
    ],
    'Baseball': [
      { name: 'MLB', coords: [-95.7129, 37.0902], country: 'USA' },
      { name: 'NPB', coords: [138.2529, 36.2048], country: 'Japan' },
      { name: 'KBO', coords: [127.7669, 35.9078], country: 'South Korea' },
    ],
    'Hockey': [
      { name: 'NHL', coords: [-95.7129, 37.0902], country: 'USA/Canada' },
      { name: 'KHL', coords: [37.6173, 55.7558], country: 'Russia' },
      { name: 'SHL', coords: [18.0649, 59.3293], country: 'Sweden' },
    ]
  };

  // Assign mock locations to leagues based on sport
  const getLeaguesWithLocations = () => {
    // If we don't have a selected sport, don't show any markers
    if (!selectedSport || !sportLocations[selectedSport as keyof typeof sportLocations]) {
      return [];
    }

    // Map the locations to markers
    return sportLocations[selectedSport as keyof typeof sportLocations].map((location, index) => ({
      id: index + 1, // Create a mock ID
      name: location.name,
      sport: selectedSport,
      logo: `https://via.placeholder.com/100?text=${location.name}`,
      location: {
        lat: location.coords[1],
        lng: location.coords[0],
        country: location.country
      }
    }));
  };

  const leaguesWithLocations = getLeaguesWithLocations();

  if (!selectedSport) {
    return (
      <Card className="mt-6 bg-neutral-50 border-dashed">
        <CardContent className="p-6 text-center">
          <p className="text-neutral-400">Select a sport to view leagues on the world map</p>
        </CardContent>
      </Card>
    );
  }

  // Get sport-specific marker color
  const getSportColor = (sport: string) => {
    const colorMap: Record<string, string> = {
      'Basketball': '#FF5533',
      'Football': '#3369FF',
      'Baseball': '#33C4FF',
      'Hockey': '#9333FF',
      'Tennis': '#33FF57',
      'Golf': '#FFD333',
    };
    
    return colorMap[sport] || '#FF5533';
  };
  
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  
  const handleMoveEnd = (position: any) => {
    setPosition(position);
  };
  
  return (
    <Card className="mt-6 overflow-hidden">
      <CardContent className="p-0" ref={mapRef}>
        <div className="relative" style={{ height: `${dimensions.height}px` }}>
          <ComposableMap 
            projection="geoMercator" 
            style={{ width: '100%', height: '100%' }}
          >
            <ZoomableGroup
              zoom={position.zoom}
              center={position.coordinates as [number, number]}
              onMoveEnd={handleMoveEnd}
              minZoom={1}
              maxZoom={5}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#EAEAEC"
                      stroke="#D6D6DA"
                      style={{
                        default: { outline: 'none' },
                        hover: { fill: '#F5F5F5', outline: 'none' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  ))
                }
              </Geographies>
              
              {leaguesWithLocations.map((league) => (
                <Marker 
                  key={league.id} 
                  coordinates={[league.location!.lng, league.location!.lat]}
                  onClick={() => onSelectLeague(league.id)}
                >
                  <motion.circle
                    r={8}
                    fill={getSportColor(league.sport)}
                    stroke="#FFFFFF"
                    strokeWidth={2}
                    cursor="pointer"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: league.id * 0.1 }}
                    whileHover={{ scale: 1.2 }}
                  />
                  <motion.text
                    textAnchor="middle"
                    y={-15}
                    style={{ 
                      fontFamily: "system-ui",
                      fontSize: "14px",
                      fontWeight: "bold",
                      fill: "#333",
                      pointerEvents: "none",
                      textShadow: "1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white"
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: league.id * 0.1 + 0.2 }}
                  >
                    {league.name}
                  </motion.text>
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>
          
          <div className="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-md flex gap-2">
            <button 
              onClick={() => setPosition(prev => ({...prev, zoom: Math.min(prev.zoom + 0.5, 5)}))}
              className="text-lg w-8 h-8 flex items-center justify-center bg-neutral-100 rounded hover:bg-neutral-200"
            >
              +
            </button>
            <button 
              onClick={() => setPosition(prev => ({...prev, zoom: Math.max(prev.zoom - 0.5, 1)}))}
              className="text-lg w-8 h-8 flex items-center justify-center bg-neutral-100 rounded hover:bg-neutral-200"
            >
              -
            </button>
            <button 
              onClick={() => setPosition({ coordinates: [0, 0], zoom: 1 })}
              className="text-sm px-2 flex items-center justify-center bg-neutral-100 rounded hover:bg-neutral-200"
            >
              Reset
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}