import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Trophy, 
  Map, 
  Users, 
  Star, 
  Search,
  ChevronRight,
  Award,
  BarChart2,
  Dribbble,
  Activity,
  Circle,
  Filter,
  Tablet
} from "lucide-react";

// Define team types
interface TeamMember {
  id: number;
  name: string;
  position: string;
  avatar: string;
  stats: {
    points?: number;
    rebounds?: number;
    assists?: number;
    goals?: number;
    saves?: number;
    tackles?: number;
    homeRuns?: number;
    rbis?: number;
    batting?: number;
    touchdowns?: number;
    interceptions?: number;
    yards?: number;
    [key: string]: number | undefined;
  };
}

interface Team {
  id: number;
  name: string;
  logo: string;
  sport: string;
  location: string;
  rank: number;
  wins: number;
  losses: number;
  winPercentage: number;
  members: TeamMember[];
}

const SportIcons: Record<string, JSX.Element> = {
  'Basketball': <Dribbble className="h-5 w-5 text-orange-500" />,
  'Football': <Tablet className="h-5 w-5 text-blue-800" />,
  'Soccer': <Circle className="h-5 w-5 text-black" />,
  'Baseball': <Circle className="h-5 w-5 text-red-500" />,
  'Hockey': <Activity className="h-5 w-5 text-blue-500" />,
  'All': <Trophy className="h-5 w-5 text-amber-500" />
};

// Sample sport-specific colors and gradients
const sportColors: Record<string, {bg: string, border: string, text: string, gradient: string}> = {
  'Basketball': {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    gradient: 'from-orange-500 to-red-500'
  },
  'Football': {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    gradient: 'from-blue-500 to-indigo-600'
  },
  'Soccer': {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    gradient: 'from-green-500 to-emerald-600'
  },
  'Baseball': {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    gradient: 'from-red-500 to-yellow-500'
  },
  'Hockey': {
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-700',
    gradient: 'from-cyan-500 to-blue-600'
  }
};

export default function TeamLeaderboard() {
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedSport, setSelectedSport] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamModalOpen, setTeamModalOpen] = useState<boolean>(false);
  
  // Mock fetch teams data with location filter
  const { data: teams = [], isLoading } = useQuery({
    queryKey: ['/api/teams/leaderboard', selectedLocation, selectedSport],
    queryFn: async () => {
      // In a real app, you would call the API with the location filter
      // For now, we'll return mock data
      
      const mockTeams: Team[] = [
        {
          id: 1,
          name: "Chicago Bulls",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/67/Chicago_Bulls_logo.svg/1200px-Chicago_Bulls_logo.svg.png",
          sport: "Basketball",
          location: "Chicago, IL",
          rank: 1,
          wins: 45,
          losses: 12,
          winPercentage: 0.789,
          members: [
            { 
              id: 101, 
              name: "Michael Jordan", 
              position: "Shooting Guard", 
              avatar: "https://via.placeholder.com/60",
              stats: { points: 28.5, rebounds: 5.8, assists: 4.2 }
            },
            { 
              id: 102, 
              name: "Scottie Pippen", 
              position: "Small Forward", 
              avatar: "https://via.placeholder.com/60",
              stats: { points: 18.7, rebounds: 6.5, assists: 5.1 }
            },
            { 
              id: 103, 
              name: "Dennis Rodman", 
              position: "Power Forward", 
              avatar: "https://via.placeholder.com/60",
              stats: { points: 7.3, rebounds: 15.2, assists: 2.1 }
            }
          ]
        },
        {
          id: 2,
          name: "LA Lakers",
          logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Los_Angeles_Lakers_logo.svg/1200px-Los_Angeles_Lakers_logo.svg.png",
          sport: "Basketball",
          location: "Los Angeles, CA",
          rank: 2,
          wins: 42,
          losses: 15,
          winPercentage: 0.737,
          members: [
            { 
              id: 201, 
              name: "LeBron James", 
              position: "Small Forward", 
              avatar: "https://via.placeholder.com/60",
              stats: { points: 27.4, rebounds: 7.2, assists: 7.8 }
            },
            { 
              id: 202, 
              name: "Anthony Davis", 
              position: "Power Forward", 
              avatar: "https://via.placeholder.com/60",
              stats: { points: 24.8, rebounds: 10.4, assists: 2.9 }
            }
          ]
        },
        {
          id: 6,
          name: "Golden State Warriors",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/01/Golden_State_Warriors_logo.svg/1200px-Golden_State_Warriors_logo.svg.png",
          sport: "Basketball",
          location: "San Francisco, CA",
          rank: 3,
          wins: 39,
          losses: 18,
          winPercentage: 0.684,
          members: [
            { 
              id: 601, 
              name: "Stephen Curry", 
              position: "Point Guard", 
              avatar: "https://via.placeholder.com/60",
              stats: { points: 30.1, rebounds: 5.5, assists: 6.2 }
            }
          ]
        },
        {
          id: 3,
          name: "New England Patriots",
          logo: "https://upload.wikimedia.org/wikipedia/en/b/b9/New_England_Patriots_logo.svg",
          sport: "Football",
          location: "Boston, MA",
          rank: 1,
          wins: 14,
          losses: 3,
          winPercentage: 0.824,
          members: [
            { 
              id: 301, 
              name: "Tom Brady", 
              position: "Quarterback", 
              avatar: "https://via.placeholder.com/60",
              stats: { touchdowns: 35, interceptions: 8, yards: 4200 }
            }
          ]
        },
        {
          id: 7,
          name: "Kansas City Chiefs",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Kansas_City_Chiefs_logo.svg/1200px-Kansas_City_Chiefs_logo.svg.png",
          sport: "Football",
          location: "Kansas City, MO",
          rank: 2,
          wins: 12,
          losses: 5,
          winPercentage: 0.706,
          members: [
            { 
              id: 701, 
              name: "Patrick Mahomes", 
              position: "Quarterback", 
              avatar: "https://via.placeholder.com/60",
              stats: { touchdowns: 38, interceptions: 6, yards: 4500 }
            }
          ]
        },
        {
          id: 4,
          name: "Real Madrid",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png",
          sport: "Soccer",
          location: "Madrid, Spain",
          rank: 1,
          wins: 28,
          losses: 5,
          winPercentage: 0.848,
          members: [
            { 
              id: 401, 
              name: "Cristiano Ronaldo", 
              position: "Forward", 
              avatar: "https://via.placeholder.com/60",
              stats: { goals: 32, assists: 14 }
            },
            { 
              id: 402, 
              name: "Sergio Ramos", 
              position: "Defender", 
              avatar: "https://via.placeholder.com/60",
              stats: { goals: 8, tackles: 105 }
            }
          ]
        },
        {
          id: 8,
          name: "Barcelona FC",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png",
          sport: "Soccer",
          location: "Barcelona, Spain",
          rank: 2,
          wins: 26,
          losses: 7,
          winPercentage: 0.788,
          members: [
            { 
              id: 801, 
              name: "Lionel Messi", 
              position: "Forward", 
              avatar: "https://via.placeholder.com/60",
              stats: { goals: 35, assists: 18 }
            }
          ]
        },
        {
          id: 5,
          name: "New York Yankees",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/2/25/NewYorkYankees_PrimaryLogo.svg/1200px-NewYorkYankees_PrimaryLogo.svg.png",
          sport: "Baseball",
          location: "New York, NY",
          rank: 1,
          wins: 92,
          losses: 70,
          winPercentage: 0.568,
          members: [
            { 
              id: 501, 
              name: "Derek Jeter", 
              position: "Shortstop", 
              avatar: "https://via.placeholder.com/60",
              stats: { batting: 0.310, homeRuns: 20, rbis: 84 }
            }
          ]
        },
        {
          id: 9,
          name: "LA Dodgers",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/69/Los_Angeles_Dodgers_logo.svg/1200px-Los_Angeles_Dodgers_logo.svg.png",
          sport: "Baseball",
          location: "Los Angeles, CA",
          rank: 2,
          wins: 88,
          losses: 74,
          winPercentage: 0.543,
          members: [
            { 
              id: 901, 
              name: "Clayton Kershaw", 
              position: "Pitcher", 
              avatar: "https://via.placeholder.com/60",
              stats: { era: 2.75, strikeouts: 210, wins: 15 }
            }
          ]
        }
      ];
      
      let filteredTeams = [...mockTeams];
      
      // Filter by location if needed
      if (selectedLocation && selectedLocation !== 'all') {
        filteredTeams = filteredTeams.filter(team => 
          team.location.toLowerCase().includes(selectedLocation.toLowerCase())
        );
      }
      
      // Filter by sport if needed
      if (selectedSport && selectedSport !== 'All') {
        filteredTeams = filteredTeams.filter(team => 
          team.sport === selectedSport
        );
      }
      
      // Sort teams by rank within their sport
      return filteredTeams.sort((a, b) => {
        // If same sport, sort by rank
        if (a.sport === b.sport) {
          return a.rank - b.rank;
        }
        // Otherwise, sort alphabetically by sport
        return a.sport.localeCompare(b.sport);
      });
    }
  });
  
  // Get unique sports from the teams
  const sports = ['All', ...Array.from(new Set(teams.map(team => team.sport)))];
  
  // Unique locations for filter dropdown
  const locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'chicago', label: 'Chicago, IL' },
    { value: 'los angeles', label: 'Los Angeles, CA' },
    { value: 'boston', label: 'Boston, MA' },
    { value: 'new york', label: 'New York, NY' },
    { value: 'madrid', label: 'Madrid, Spain' },
    { value: 'barcelona', label: 'Barcelona, Spain' },
    { value: 'kansas city', label: 'Kansas City, MO' },
    { value: 'san francisco', label: 'San Francisco, CA' }
  ];
  
  // Filter teams by search query
  const filteredTeams = teams?.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.sport.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Group teams by sport for sport-specific leaderboards
  const teamsBySport = sports.reduce((acc, sport) => {
    if (sport === 'All') {
      acc[sport] = filteredTeams;
    } else {
      acc[sport] = filteredTeams.filter(team => team.sport === sport);
    }
    return acc;
  }, {} as Record<string, Team[]>);
  
  // Handle team selection
  const handleTeamClick = (team: Team) => {
    setSelectedTeam(team);
    setTeamModalOpen(true);
  };
  
  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg shadow-lg mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <Trophy className="h-40 w-40 -mr-10 -mt-10" />
        </div>
        <h2 className="text-3xl font-bold mb-2 flex items-center">
          <Trophy className="h-8 w-8 mr-3 text-yellow-400" />
          Team Leaderboards
        </h2>
        <p className="mb-6 text-blue-100 max-w-3xl">
          Explore the top-performing teams across different sports. Filter by location and sport to find the information you need.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="w-full sm:w-auto relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white opacity-70" />
            <Input
              placeholder="Search teams..."
              className="pl-9 bg-blue-700 border-blue-500 text-white placeholder:text-blue-200 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <Select
              value={selectedLocation}
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger className="bg-blue-700 border-blue-500 text-white w-full md:w-40">
                <Map className="h-4 w-4 mr-2 text-blue-300" />
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(location => (
                  <SelectItem key={location.value} value={location.value}>
                    {location.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              className="bg-transparent border-blue-400 text-white hover:bg-blue-700"
              onClick={() => {
                setSelectedLocation('all');
                setSelectedSport('All');
                setSearchQuery('');
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
      
      {/* Sport Tabs */}
      <Tabs value={selectedSport} onValueChange={setSelectedSport} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center text-gray-800">
            <Filter className="h-5 w-5 mr-2 text-blue-500" />
            Filter by Sport
          </h3>
          <TabsList className="bg-blue-50">
            {sports.map(sport => (
              <TabsTrigger 
                key={sport} 
                value={sport} 
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
              >
                <span className="flex items-center">
                  {SportIcons[sport] || <Trophy className="h-5 w-5 mr-1 text-amber-500" />}
                  <span className="ml-2">{sport}</span>
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {/* All Sports Tab Content */}
        <TabsContent value="All" className="mt-0">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredTeams.length === 0 ? (
            <Card className="bg-gray-50 border-none">
              <CardContent className="flex flex-col items-center justify-center pt-10 pb-10">
                <Trophy className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-2 text-gray-700">No Teams Found</h3>
                <p className="text-gray-500 max-w-md text-center">
                  {searchQuery 
                    ? "No teams match your search criteria. Try adjusting your filters or search terms."
                    : "There are no teams with the selected filters. Try different location or sport options."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-none shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
                      <th className="py-3 px-4 text-left text-sm font-semibold text-blue-800 border-b">Sport</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-blue-800 border-b">Rank</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-blue-800 border-b">Team</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-blue-800 hidden md:table-cell border-b">Location</th>
                      <th className="py-3 px-4 text-center text-sm font-semibold text-blue-800 border-b">Record</th>
                      <th className="py-3 px-4 text-center text-sm font-semibold text-blue-800 hidden sm:table-cell border-b">Win %</th>
                      <th className="py-3 px-4 text-right text-sm font-semibold text-blue-800 border-b">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeams.map((team) => (
                      <tr 
                        key={team.id} 
                        className="hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100"
                      >
                        <td className="py-4 px-4">
                          <Badge className={`${sportColors[team.sport]?.bg || 'bg-gray-100'} ${sportColors[team.sport]?.text || 'text-gray-700'} border-none`}>
                            {SportIcons[team.sport] && <span className="mr-1">{SportIcons[team.sport]}</span>}
                            {team.sport}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold text-sm">
                            {team.rank}
                          </div>
                        </td>
                        <td className="py-4 px-4" onClick={() => handleTeamClick(team)}>
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-md overflow-hidden flex items-center justify-center bg-gray-50 p-1">
                              <img 
                                src={team.logo} 
                                alt={team.name} 
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            <span className="ml-3 font-semibold text-gray-800">{team.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600 hidden md:table-cell">{team.location}</td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-green-600 font-semibold">{team.wins}</span>
                            <span className="text-gray-400">-</span>
                            <span className="text-red-600 font-semibold">{team.losses}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center hidden sm:table-cell font-medium text-gray-700">
                          {(team.winPercentage * 100).toFixed(1)}%
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            onClick={() => handleTeamClick(team)}
                          >
                            View
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </TabsContent>
        
        {/* Sport-specific tab content */}
        {sports.filter(sport => sport !== 'All').map(sport => (
          <TabsContent key={sport} value={sport} className="mt-0">
            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className={`bg-gradient-to-r ${sportColors[sport]?.gradient || 'from-blue-600 to-blue-800'} text-white p-6`}>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl flex items-center">
                      {SportIcons[sport] && <span className="mr-2">{SportIcons[sport]}</span>}
                      {sport} Leaderboard
                    </CardTitle>
                    <CardDescription className="text-white/80 mt-1">
                      Top teams ranked by performance
                    </CardDescription>
                  </div>
                  <BarChart2 className="h-10 w-10 opacity-70" />
                </div>
              </CardHeader>
              
              {teamsBySport[sport]?.length === 0 ? (
                <CardContent className="p-6 text-center py-12">
                  <Trophy className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium mb-2 text-gray-700">No {sport} Teams Found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    There are no {sport} teams matching your current filters. Try adjusting your location filter or search terms.
                  </p>
                </CardContent>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`${sportColors[sport]?.bg || 'bg-blue-50'}`}>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Rank</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Team</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 hidden md:table-cell border-b">Location</th>
                        <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700 border-b">Record</th>
                        <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700 hidden sm:table-cell border-b">Win %</th>
                        <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700 border-b">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamsBySport[sport]?.map((team) => (
                        <tr 
                          key={team.id} 
                          className="hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100"
                          onClick={() => handleTeamClick(team)}
                        >
                          <td className="py-4 px-4">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${sportColors[sport]?.bg || 'bg-blue-100'} ${sportColors[sport]?.text || 'text-blue-800'} font-bold text-sm`}>
                              {team.rank}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-md overflow-hidden flex items-center justify-center bg-gray-50 p-1">
                                <img 
                                  src={team.logo} 
                                  alt={team.name} 
                                  className="max-h-full max-w-full object-contain"
                                />
                              </div>
                              <span className="ml-3 font-semibold text-gray-800">{team.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-600 hidden md:table-cell">{team.location}</td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-green-600 font-semibold">{team.wins}</span>
                              <span className="text-gray-400">-</span>
                              <span className="text-red-600 font-semibold">{team.losses}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center hidden sm:table-cell font-medium text-gray-700">
                            {(team.winPercentage * 100).toFixed(1)}%
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            >
                              View
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              <CardFooter className={`${sportColors[sport]?.bg || 'bg-blue-50'} py-3 px-6 border-t ${sportColors[sport]?.border || 'border-blue-100'} text-sm`}>
                <div className="flex justify-between items-center w-full">
                  <span className={`${sportColors[sport]?.text || 'text-blue-700'}`}>
                    <Award className="h-4 w-4 inline mr-1" />
                    {teamsBySport[sport]?.length} Teams Ranked
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`${sportColors[sport]?.text || 'text-blue-700'} border-current hover:bg-white/50`}
                  >
                    View Full Rankings
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Team Detail Modal */}
      <Dialog open={teamModalOpen} onOpenChange={setTeamModalOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {selectedTeam && (
            <>
              <div className={`p-6 ${sportColors[selectedTeam.sport]?.gradient ? `bg-gradient-to-r ${sportColors[selectedTeam.sport].gradient}` : 'bg-blue-600'} text-white`}>
                <DialogHeader>
                  <div className="flex items-center">
                    <div className="bg-white rounded-lg p-2 mr-4 flex-shrink-0">
                      <img 
                        src={selectedTeam.logo} 
                        alt={selectedTeam.name} 
                        className="h-16 w-16 object-contain"
                      />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-bold mb-1">{selectedTeam.name}</DialogTitle>
                      <DialogDescription className="text-white/90 text-base flex items-center">
                        {SportIcons[selectedTeam.sport] && (
                          <span className="mr-2 opacity-90">{SportIcons[selectedTeam.sport]}</span>
                        )}
                        {selectedTeam.sport} • {selectedTeam.location}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <Card className="bg-blue-50 border-none shadow-sm">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <Trophy className="h-8 w-8 text-amber-500 mb-2" />
                      <span className="text-sm text-blue-700">Rank</span>
                      <span className="text-3xl font-bold text-blue-900">#{selectedTeam.rank}</span>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 border-none shadow-sm">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <Star className="h-8 w-8 text-green-500 mb-2" />
                      <span className="text-sm text-green-700">Wins</span>
                      <span className="text-3xl font-bold text-green-900">{selectedTeam.wins}</span>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-purple-50 border-none shadow-sm">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <BarChart2 className="h-8 w-8 text-purple-500 mb-2" />
                      <span className="text-sm text-purple-700">Win Rate</span>
                      <span className="text-3xl font-bold text-purple-900">{(selectedTeam.winPercentage * 100).toFixed(1)}%</span>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    Team Roster
                  </h3>
                  
                  <div className="overflow-hidden rounded-lg border shadow-sm">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Player</th>
                          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Position</th>
                          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Stats</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedTeam.members.map(member => (
                          <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <img 
                                  src={member.avatar} 
                                  alt={member.name} 
                                  className="h-10 w-10 rounded-full mr-3 object-cover border border-gray-200"
                                />
                                <span className="font-medium text-gray-800">{member.name}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-gray-600">{member.position}</td>
                            <td className="py-4 px-4">
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(member.stats).map(([key, value]) => (
                                  <Badge 
                                    key={key} 
                                    variant="outline" 
                                    className={`capitalize ${sportColors[selectedTeam.sport]?.text || 'text-blue-700'} border-current`}
                                  >
                                    {key}: {typeof value === 'number' && value % 1 === 0 ? value : value?.toFixed(1)}
                                  </Badge>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="px-6 py-4 bg-gray-50 border-t">
                <Button
                  variant="outline"
                  onClick={() => setTeamModalOpen(false)}
                >
                  Close
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Full Team Profile
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}