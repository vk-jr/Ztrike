import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { 
  Trophy, 
  Map, 
  Users, 
  Star, 
  Search,
  ChevronRight,
  ChevronDown
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

export default function TeamLeaderboard() {
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamModalOpen, setTeamModalOpen] = useState<boolean>(false);
  
  // Mock fetch teams data with location filter
  const { data: teams = [], isLoading } = useQuery({
    queryKey: ['/api/teams/leaderboard', selectedLocation],
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
          id: 3,
          name: "New England Patriots",
          logo: "https://upload.wikimedia.org/wikipedia/en/b/b9/New_England_Patriots_logo.svg",
          sport: "Football",
          location: "Boston, MA",
          rank: 3,
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
          id: 4,
          name: "Real Madrid",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png",
          sport: "Soccer",
          location: "Madrid, Spain",
          rank: 4,
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
          id: 5,
          name: "New York Yankees",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/2/25/NewYorkYankees_PrimaryLogo.svg/1200px-NewYorkYankees_PrimaryLogo.svg.png",
          sport: "Baseball",
          location: "New York, NY",
          rank: 5,
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
        }
      ];
      
      // Filter by location if needed
      if (selectedLocation && selectedLocation !== 'all') {
        return mockTeams.filter(team => 
          team.location.toLowerCase().includes(selectedLocation.toLowerCase())
        );
      }
      
      return mockTeams;
    }
  });
  
  // Unique locations for filter dropdown
  const locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'chicago', label: 'Chicago, IL' },
    { value: 'los angeles', label: 'Los Angeles, CA' },
    { value: 'boston', label: 'Boston, MA' },
    { value: 'new york', label: 'New York, NY' },
    { value: 'madrid', label: 'Madrid, Spain' }
  ];
  
  // Filter teams by search query
  const filteredTeams = teams?.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.sport.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle team selection
  const handleTeamClick = (team: Team) => {
    setSelectedTeam(team);
    setTeamModalOpen(true);
  };
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <Trophy className="h-6 w-6 mr-2 text-amber-500" />
          Team Leaderboard
        </h2>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <Input
              placeholder="Search teams..."
              className="pl-9 max-w-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select
            value={selectedLocation}
            onValueChange={setSelectedLocation}
          >
            <SelectTrigger className="w-44 flex items-center">
              <Map className="h-4 w-4 mr-2 text-neutral-500" />
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map(location => (
                <SelectItem key={location.value} value={location.value}>
                  {location.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        {isLoading ? (
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        ) : filteredTeams.length === 0 ? (
          <CardContent className="p-6 text-center">
            <Trophy className="h-12 w-12 mx-auto text-neutral-300 mb-3" />
            <h3 className="text-lg font-medium mb-2">No Teams Found</h3>
            <p className="text-neutral-500">
              {searchQuery 
                ? "No teams match your search criteria. Try adjusting your filters."
                : "There are no teams in this location. Try selecting a different region."}
            </p>
          </CardContent>
        ) : (
          <>
            <div className="overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Rank</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Team</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500 hidden sm:table-cell">Sport</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500 hidden md:table-cell">Location</th>
                    <th className="py-3 px-4 text-center text-sm font-medium text-neutral-500">W-L</th>
                    <th className="py-3 px-4 text-center text-sm font-medium text-neutral-500 hidden sm:table-cell">Win %</th>
                    <th className="py-3 px-4 text-center text-sm font-medium text-neutral-500"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeams.slice(0, 100).map((team, index) => (
                    <tr 
                      key={team.id} 
                      className="border-t hover:bg-neutral-50 cursor-pointer transition-colors"
                      onClick={() => handleTeamClick(team)}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-neutral-100 font-semibold text-sm">
                          {team.rank}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <img 
                            src={team.logo} 
                            alt={team.name} 
                            className="h-8 w-8 mr-3 object-contain"
                          />
                          <span className="font-medium">{team.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden sm:table-cell">{team.sport}</td>
                      <td className="py-4 px-4 hidden md:table-cell">{team.location}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-green-600 font-medium">{team.wins}</span>
                        <span className="mx-1">-</span>
                        <span className="text-red-600 font-medium">{team.losses}</span>
                      </td>
                      <td className="py-4 px-4 text-center hidden sm:table-cell">
                        {(team.winPercentage * 100).toFixed(1)}%
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
      
      {/* Team Detail Modal */}
      <Dialog open={teamModalOpen} onOpenChange={setTeamModalOpen}>
        <DialogContent className="max-w-4xl">
          {selectedTeam && (
            <>
              <DialogHeader>
                <div className="flex items-center mb-2">
                  <img 
                    src={selectedTeam.logo} 
                    alt={selectedTeam.name} 
                    className="h-12 w-12 mr-3 object-contain"
                  />
                  <div>
                    <DialogTitle className="text-2xl">{selectedTeam.name}</DialogTitle>
                    <DialogDescription>
                      <span className="text-neutral-500">
                        {selectedTeam.sport} • {selectedTeam.location}
                      </span>
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="flex flex-wrap gap-4 mb-4">
                <Badge variant="secondary" className="flex items-center">
                  <Trophy className="h-4 w-4 mr-1 text-amber-500" />
                  Rank: #{selectedTeam.rank}
                </Badge>
                <Badge variant="secondary" className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-green-500" />
                  {selectedTeam.wins} Wins
                </Badge>
                <Badge variant="secondary" className="flex items-center">
                  Win Rate: {(selectedTeam.winPercentage * 100).toFixed(1)}%
                </Badge>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Team Members
                </h3>
                
                <div className="overflow-hidden rounded-lg border">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-neutral-50">
                        <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Name</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Position</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Stats</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTeam.members.map(member => (
                        <tr key={member.id} className="border-t">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <img 
                                src={member.avatar} 
                                alt={member.name} 
                                className="h-10 w-10 rounded-full mr-3 object-cover"
                              />
                              <span className="font-medium">{member.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-neutral-600">{member.position}</td>
                          <td className="py-4 px-4">
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(member.stats).map(([key, value]) => (
                                <Badge key={key} variant="outline" className="capitalize">
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}