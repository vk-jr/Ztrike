import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Calendar, Bell, BellOff, Users, Timer, BarChart3 } from 'lucide-react';
import MatchCard from './MatchCard';
import { toast } from '@/hooks/use-toast';

interface LeagueDetailsProps {
  leagueId: number;
  userId: number;
}

export default function LeagueDetails({ leagueId, userId }: LeagueDetailsProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

  // Fetch league information
  const { data: league, isLoading: isLoadingLeague } = useQuery({
    queryKey: [`/api/leagues/${leagueId}`],
    enabled: !!leagueId,
  });

  // Fetch league matches
  const { data: matches, isLoading: isLoadingMatches } = useQuery({
    queryKey: [`/api/leagues/${leagueId}/matches`],
    enabled: !!leagueId,
  });

  // Fetch user subscriptions to check if user is subscribed to this league
  const { data: subscriptions, isLoading: isLoadingSubscriptions } = useQuery({
    queryKey: ['/api/leagues/subscribed'],
    enabled: !!userId,
  });

  // Check if user is subscribed to this league
  useEffect(() => {
    if (subscriptions && leagueId) {
      const isUserSubscribed = subscriptions.some((sub: any) => sub.id === leagueId);
      setIsSubscribed(isUserSubscribed);
      // For demo purposes, let's assume notifications are enabled if subscribed
      setIsNotificationsEnabled(isUserSubscribed); 
    }
  }, [subscriptions, leagueId]);

  // Function to handle subscription toggle
  const handleSubscribe = () => {
    // In a real app, this would call an API to subscribe/unsubscribe
    setIsSubscribed(!isSubscribed);
    
    if (!isSubscribed) {
      toast({
        title: "Subscribed to league",
        description: `You'll now receive updates about ${league?.name}`,
      });
      setIsNotificationsEnabled(true);
    } else {
      toast({
        title: "Unsubscribed from league",
        description: `You'll no longer receive updates about ${league?.name}`,
      });
      setIsNotificationsEnabled(false);
    }
  };

  // Function to handle notifications toggle
  const handleNotifications = () => {
    // In a real app, this would call an API to enable/disable notifications
    setIsNotificationsEnabled(!isNotificationsEnabled);
    
    if (!isNotificationsEnabled) {
      toast({
        title: "Notifications enabled",
        description: `You'll receive notifications about ${league?.name}`,
      });
    } else {
      toast({
        title: "Notifications disabled",
        description: `You'll no longer receive notifications about ${league?.name}`,
      });
    }
  };

  // Mock standings data for display
  const standingsData = [
    { position: 1, team: 'Team A', played: 20, won: 15, drawn: 3, lost: 2, points: 48 },
    { position: 2, team: 'Team B', played: 20, won: 14, drawn: 2, lost: 4, points: 44 },
    { position: 3, team: 'Team C', played: 20, won: 12, drawn: 4, lost: 4, points: 40 },
    { position: 4, team: 'Team D', played: 20, won: 11, drawn: 5, lost: 4, points: 38 },
    { position: 5, team: 'Team E', played: 20, won: 10, drawn: 5, lost: 5, points: 35 },
    { position: 6, team: 'Team F', played: 20, won: 9, drawn: 6, lost: 5, points: 33 },
    { position: 7, team: 'Team G', played: 20, won: 8, drawn: 6, lost: 6, points: 30 },
    { position: 8, team: 'Team H', played: 20, won: 7, drawn: 7, lost: 6, points: 28 },
  ];

  // Mock stats data
  const statsData = [
    { name: 'Player 1', team: 'Team A', stat: 28.4, type: 'ppg' },
    { name: 'Player 2', team: 'Team C', stat: 26.8, type: 'ppg' },
    { name: 'Player 3', team: 'Team B', stat: 25.3, type: 'ppg' },
    { name: 'Player 4', team: 'Team F', stat: 11.2, type: 'rpg' },
    { name: 'Player 5', team: 'Team D', stat: 10.9, type: 'rpg' },
    { name: 'Player 6', team: 'Team A', stat: 9.8, type: 'rpg' },
    { name: 'Player 7', team: 'Team G', stat: 9.6, type: 'apg' },
    { name: 'Player 8', team: 'Team B', stat: 8.9, type: 'apg' },
  ];

  if (isLoadingLeague) {
    return (
      <Card>
        <CardHeader>
          <div className="animate-pulse h-7 bg-neutral-200 rounded-md w-1/3 mb-2"></div>
          <div className="animate-pulse h-5 bg-neutral-200 rounded-md w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-40 bg-neutral-200 rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

  if (!league) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Trophy className="h-12 w-12 mx-auto text-neutral-300" />
          <h3 className="mt-4 font-medium">League not found</h3>
          <p className="text-neutral-400 text-sm mt-1">
            The league you're looking for doesn't exist or has been removed
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-0">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className="flex items-center">
              <div className="w-14 h-14 rounded-lg overflow-hidden mr-4">
                <img 
                  src={league.logo} 
                  alt={league.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <CardTitle className="text-2xl">{league.name}</CardTitle>
                <CardDescription className="text-base">{league.sport}</CardDescription>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={handleSubscribe}
                variant={isSubscribed ? "outline" : "default"}
              >
                {isSubscribed ? (
                  <>Unsubscribe</>
                ) : (
                  <><Users className="h-4 w-4 mr-2" /> Subscribe</>
                )}
              </Button>
              <Button 
                onClick={handleNotifications}
                variant="outline"
                className={isNotificationsEnabled ? "bg-primary/10 text-primary" : ""}
              >
                {isNotificationsEnabled ? (
                  <><BellOff className="h-4 w-4 mr-2" /> Disable Notifications</>
                ) : (
                  <><Bell className="h-4 w-4 mr-2" /> Enable Notifications</>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="my-4 text-neutral-600">
            {league.description || 
              `Follow ${league.name} to get live updates, match notifications, and access to exclusive content. 
              Stay up to date with your favorite teams and players throughout the season.`
            }
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="matches" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="matches" className="flex-1">
            <Calendar className="h-4 w-4 mr-2" /> Matches
          </TabsTrigger>
          <TabsTrigger value="standings" className="flex-1">
            <Trophy className="h-4 w-4 mr-2" /> Standings
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex-1">
            <BarChart3 className="h-4 w-4 mr-2" /> Stats
          </TabsTrigger>
        </TabsList>
        
        {/* Matches Tab */}
        <TabsContent value="matches">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" /> Schedule
              </CardTitle>
              <CardDescription>
                Upcoming and recent matches
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingMatches ? (
                Array(3).fill(0).map((_, index) => (
                  <div key={index} className="animate-pulse p-4 border-b last:border-0">
                    <div className="flex justify-between">
                      <div className="h-6 bg-neutral-200 rounded w-1/3"></div>
                      <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
                    </div>
                    <div className="mt-2 h-12 bg-neutral-200 rounded"></div>
                  </div>
                ))
              ) : matches && matches.length > 0 ? (
                matches.map((match: any) => (
                  <MatchCard key={match.id} match={match} userId={userId} />
                ))
              ) : (
                <div className="py-6 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-neutral-300" />
                  <h3 className="mt-2 font-medium">No matches scheduled</h3>
                  <p className="text-sm text-neutral-400 mt-1">
                    Check back later for match updates
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Standings Tab */}
        <TabsContent value="standings">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-primary" /> League Table
              </CardTitle>
              <CardDescription>
                Current standings in the league
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200 text-left">
                      <th className="p-3 text-xs font-medium text-neutral-500">POS</th>
                      <th className="p-3 text-xs font-medium text-neutral-500">TEAM</th>
                      <th className="p-3 text-xs font-medium text-neutral-500 text-center">P</th>
                      <th className="p-3 text-xs font-medium text-neutral-500 text-center">W</th>
                      <th className="p-3 text-xs font-medium text-neutral-500 text-center">D</th>
                      <th className="p-3 text-xs font-medium text-neutral-500 text-center">L</th>
                      <th className="p-3 text-xs font-medium text-neutral-500 text-center">PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standingsData.map((team) => (
                      <tr key={team.position} className="border-b border-neutral-200 hover:bg-neutral-50">
                        <td className={`p-3 text-sm ${team.position <= 4 ? 'font-medium text-primary' : ''}`}>
                          {team.position}
                        </td>
                        <td className="p-3 text-sm font-medium">{team.team}</td>
                        <td className="p-3 text-sm text-center">{team.played}</td>
                        <td className="p-3 text-sm text-center">{team.won}</td>
                        <td className="p-3 text-sm text-center">{team.drawn}</td>
                        <td className="p-3 text-sm text-center">{team.lost}</td>
                        <td className="p-3 text-sm font-medium text-center">{team.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Stats Tab */}
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" /> League Leaders
              </CardTitle>
              <CardDescription>
                Top performing players in the league
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3 flex items-center">
                    <Timer className="h-4 w-4 mr-2 text-amber-500" /> Points Per Game
                  </h3>
                  <div className="space-y-2">
                    {statsData.filter(s => s.type === 'ppg').map((player, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-md hover:bg-neutral-50">
                        <div className="flex items-center">
                          <div className="w-8 h-8 flex items-center justify-center bg-neutral-100 rounded-full mr-3">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{player.name}</p>
                            <p className="text-xs text-neutral-400">{player.team}</p>
                          </div>
                        </div>
                        <div className="font-bold">{player.stat}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3 flex items-center">
                    <Timer className="h-4 w-4 mr-2 text-blue-500" /> Rebounds Per Game
                  </h3>
                  <div className="space-y-2">
                    {statsData.filter(s => s.type === 'rpg').map((player, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-md hover:bg-neutral-50">
                        <div className="flex items-center">
                          <div className="w-8 h-8 flex items-center justify-center bg-neutral-100 rounded-full mr-3">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{player.name}</p>
                            <p className="text-xs text-neutral-400">{player.team}</p>
                          </div>
                        </div>
                        <div className="font-bold">{player.stat}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3 flex items-center">
                    <Timer className="h-4 w-4 mr-2 text-green-500" /> Assists Per Game
                  </h3>
                  <div className="space-y-2">
                    {statsData.filter(s => s.type === 'apg').map((player, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-md hover:bg-neutral-50">
                        <div className="flex items-center">
                          <div className="w-8 h-8 flex items-center justify-center bg-neutral-100 rounded-full mr-3">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{player.name}</p>
                            <p className="text-xs text-neutral-400">{player.team}</p>
                          </div>
                        </div>
                        <div className="font-bold">{player.stat}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}