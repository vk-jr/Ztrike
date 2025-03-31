import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Dumbbell, 
  Volleyball,
  Timer, 
  Snowflake,
  Activity,
  Shirt
} from 'lucide-react';

interface SportFilterProps {
  selectedSport: string | null;
  onSelectSport: (sport: string | null) => void;
}

// Define sports with their icons and colors
const sports = [
  { name: 'Basketball', icon: Activity, color: 'text-orange-500' },
  { name: 'Football', icon: Shirt, color: 'text-sky-500' },
  { name: 'Baseball', icon: Timer, color: 'text-red-500' },
  { name: 'Hockey', icon: Snowflake, color: 'text-blue-500' },
  { name: 'Soccer', icon: Volleyball, color: 'text-green-500' },
  { name: 'Golf', icon: Dumbbell, color: 'text-amber-500' },
  { name: 'Cycling', icon: Activity, color: 'text-purple-500' },
  { name: 'All', icon: Trophy, color: 'text-primary' },
];

export default function SportFilter({ selectedSport, onSelectSport }: SportFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {sports.map((sport) => {
        const isActive = sport.name === selectedSport || (sport.name === 'All' && !selectedSport);
        const Icon = sport.icon;
        
        return (
          <Button
            key={sport.name}
            variant={isActive ? "default" : "outline"}
            size="sm"
            className={`${isActive ? '' : sport.color} transition-all duration-200`}
            onClick={() => onSelectSport(sport.name === 'All' ? null : sport.name)}
          >
            <Icon className="h-4 w-4 mr-2" />
            {sport.name}
          </Button>
        );
      })}
    </div>
  );
}