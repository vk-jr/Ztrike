import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Search, Trophy, Calendar, Clock, Bell, BellOff, Globe, Filter } from "lucide-react";
import MatchCard from "@/components/MatchCard";
import SportFilter from "@/components/SportFilter";
import WorldMap from "@/components/WorldMap";
import LeagueDetails from "@/components/LeagueDetails";
import { toast } from "@/hooks/use-toast";

export default function Leagues() {
  const [activeLeagueId, setActiveLeagueId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [subscribedLeagues, setSubscribedLeagues] = useState<number[]>([]);
  const [leagueNotifications, setLeagueNotifications] = useState<number[]>([]);
  const [showMap, setShowMap] = useState(false);
  const userId = 1; // Mock user ID - in real app, would come from authentication

  // Main leagues data query
  const { data: leagues, isLoading: isLoadingLeagues } = useQuery({
    queryKey: ['/api/leagues'],
  });

  // Subscribed leagues query
  const { data: subscriptionsData } = useQuery({
    queryKey: ['/api/leagues/subscribed'],
  });

  // Live matches query
  const { data: liveMatches, isLoading: isLoadingLiveMatches } = useQuery({
    queryKey: ['/api/matches/live'],
  });

  // Upcoming matches query
  const { data: upcomingMatches, isLoading: isLoadingUpcomingMatches } = useQuery({
    queryKey: ['/api/matches/upcoming'],
  });

  // League-specific matches query
  const { data: leagueMatches, isLoading: isLoadingLeagueMatches } = useQuery({
    queryKey: activeLeagueId ? [`/api/leagues/${activeLeagueId}/matches`] : ['no-league-matches'],
    enabled: !!activeLeagueId,
  });

  // Update subscribed leagues from API data
  useEffect(() => {
    if (subscriptionsData) {
      const subIds = subscriptionsData.map((sub: any) => sub.id);
      setSubscribedLeagues(subIds);
      setLeagueNotifications(subIds); // Assume notifications are enabled for all subscribed leagues
    }
  }, [subscriptionsData]);

  // Filter leagues based on search query and selected sport
  const filteredLeagues = leagues 
    ? leagues.filter((league: any) => {
        const matchesSearch = 
          league.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          league.sport.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesSport = selectedSport 
          ? league.sport.toLowerCase() === selectedSport.toLowerCase()
          : true;
        
        return matchesSearch && matchesSport;
      })
    : [];

  // Toggle league subscription
  const toggleSubscription = (league: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent click event
    
    const isSubscribed = subscribedLeagues.includes(league.id);
    
    if (isSubscribed) {
      setSubscribedLeagues(subscribedLeagues.filter(id => id !== league.id));
      setLeagueNotifications(leagueNotifications.filter(id => id !== league.id));
      toast({
        title: "Unsubscribed",
        description: `You have unsubscribed from ${league.name}`,
      });
    } else {
      setSubscribedLeagues([...subscribedLeagues, league.id]);
      setLeagueNotifications([...leagueNotifications, league.id]);
      toast({
        title: "Subscribed",
        description: `You are now subscribed to ${league.name}`,
      });
    }
  };

  // Toggle notifications for a league
  const toggleNotifications = (league: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent click event
    
    const notificationsEnabled = leagueNotifications.includes(league.id);
    
    if (notificationsEnabled) {
      setLeagueNotifications(leagueNotifications.filter(id => id !== league.id));
      toast({
        title: "Notifications disabled",
        description: `You will no longer receive notifications for ${league.name}`,
      });
    } else {
      // Ensure user is subscribed first
      if (!subscribedLeagues.includes(league.id)) {
        setSubscribedLeagues([...subscribedLeagues, league.id]);
      }
      setLeagueNotifications([...leagueNotifications, league.id]);
      toast({
        title: "Notifications enabled",
        description: `You will now receive notifications for ${league.name}`,
      });
    }
  };

  // Handle sport selection with map toggle
  const handleSportSelect = (sport: string | null) => {
    setSelectedSport(sport);
    setShowMap(!!sport); // Show map when a sport is selected, hide for "All"
  };

  // Handle league selection from map
  const handleMapLeagueSelect = (leagueId: number) => {
    console.log("Selected league from map:", leagueId);
    setActiveLeagueId(leagueId);
    setShowMap(false); // Hide map when a league is selected
    
    // Add a small delay to ensure the league details component is rendered
    setTimeout(() => {
      const detailsElement = document.getElementById('league-details');
      if (detailsElement) {
        detailsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Leagues & Live Scores</CardTitle>
              <CardDescription className="text-neutral-400">
                Follow your favorite leagues and never miss a match
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
              <Input
                placeholder="Search leagues or sports..."
                className="pl-10 w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
      </div>

      {/* Sport Filter */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium flex items-center">
          <Filter className="h-5 w-5 mr-2 text-neutral-400" /> Filter by Sport
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowMap(!showMap)} 
          className={selectedSport ? '' : 'opacity-50 cursor-not-allowed'}
          disabled={!selectedSport}
        >
          <Globe className="h-4 w-4 mr-2" />
          {showMap ? 'Hide Map' : 'Show Map'}
        </Button>
      </div>
      
      <SportFilter 
        selectedSport={selectedSport} 
        onSelectSport={handleSportSelect} 
      />

      {/* World Map (shown when a sport is selected and map is toggled on) */}
      {showMap && selectedSport && (
        <WorldMap 
          leagues={leagues || []} 
          selectedSport={selectedSport} 
          onSelectLeague={handleMapLeagueSelect} 
        />
      )}

      {/* If a league is active, show its detailed view */}
      {activeLeagueId ? (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActiveLeagueId(null)}
            >
              ← Back to All Leagues
            </Button>
          </div>
          <div id="league-details">
            <LeagueDetails leagueId={activeLeagueId} userId={userId} />
          </div>
        </div>
      ) : (
        /* Main Leagues Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* League List */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-primary" /> Leagues
                </CardTitle>
                <CardDescription>
                  {selectedSport 
                    ? `${selectedSport} leagues from around the world` 
                    : 'Major sports leagues from around the world'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {isLoadingLeagues ? (
                  Array(5).fill(0).map((_, index) => (
                    <div key={index} className="p-3 border-b border-neutral-200 last:border-0">
                      <div className="flex items-center">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="ml-3 flex-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16 mt-1" />
                        </div>
                        <Skeleton className="h-8 w-16 rounded-md" />
                      </div>
                    </div>
                  ))
                ) : filteredLeagues && filteredLeagues.length > 0 ? (
                  filteredLeagues.map((league: any) => {
                    const isSubscribed = subscribedLeagues.includes(league.id);
                    const notificationsEnabled = leagueNotifications.includes(league.id);
                    
                    return (
                      <div 
                        key={league.id} 
                        className={`p-3 border-b border-neutral-200 last:border-0 hover:bg-neutral-50 cursor-pointer transition-colors ${activeLeagueId === league.id ? 'bg-neutral-50' : ''}`}
                        onClick={() => setActiveLeagueId(league.id)}
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-100">
                            <img 
                              src={league.logo} 
                              alt={league.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex items-center">
                              <h4 className="font-medium">{league.name}</h4>
                              {isSubscribed && (
                                <Badge variant="outline" className="ml-2 text-xs bg-primary/10 text-primary border-primary/20">
                                  Subscribed
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-neutral-400">{league.sport}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className={isSubscribed ? "text-xs bg-primary/10 text-primary" : "text-xs"}
                              onClick={(e) => toggleSubscription(league, e)}
                            >
                              {isSubscribed ? 'Unsubscribe' : <><Bell className="h-3 w-3 mr-1" /> Follow</>}
                            </Button>
                            {isSubscribed && (
                              <Button 
                                variant="outline" 
                                size="icon"
                                className={notificationsEnabled ? "text-primary bg-primary/10" : ""}
                                onClick={(e) => toggleNotifications(league, e)}
                              >
                                {notificationsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-6 text-center">
                    <Trophy className="h-12 w-12 mx-auto text-neutral-300" />
                    <h3 className="mt-2 font-medium">No leagues found</h3>
                    <p className="text-sm text-neutral-400 mt-1 px-4">
                      {searchQuery 
                        ? `No results for "${searchQuery}"` 
                        : selectedSport 
                          ? `No ${selectedSport} leagues available` 
                          : "No leagues available"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Matches and Stats */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="live" className="w-full">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="live" className="flex-1">
                  <Clock className="h-4 w-4 mr-2" /> Live Matches
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="flex-1">
                  <Calendar className="h-4 w-4 mr-2" /> Upcoming Matches
                </TabsTrigger>
                <TabsTrigger value="subscribed" className="flex-1">
                  <Bell className="h-4 w-4 mr-2" /> My Leagues
                </TabsTrigger>
              </TabsList>
              
              {/* Live Matches Tab */}
              <TabsContent value="live">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-red-500" /> Live Now
                    </CardTitle>
                    <CardDescription>
                      Matches currently in progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    {isLoadingLiveMatches ? (
                      Array(3).fill(0).map((_, index) => (
                        <div key={index} className="p-0">
                          <MatchCard match={null} userId={userId} />
                        </div>
                      ))
                    ) : liveMatches && liveMatches.length > 0 ? (
                      liveMatches.map((match: any) => (
                        <div key={match.id} className="border-b border-neutral-200 last:border-0">
                          <div className="flex items-center justify-between px-3 py-2 bg-red-50">
                            <div className="flex items-center">
                              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">LIVE</span>
                              <span className="ml-2 text-sm font-medium">{match.leagueId === 1 ? 'NBA' : match.leagueId === 3 ? 'Premier League' : 'UFC'}</span>
                            </div>
                            <div className="text-xs text-neutral-400">
                              {match.leagueId === 1 ? 'Q3 5:42' : match.leagueId === 3 ? '65\'' : 'Round 2'}
                            </div>
                          </div>
                          <div className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <img 
                                  src={match.team1Logo} 
                                  alt={match.team1} 
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <span className="ml-2 font-medium">{match.team1}</span>
                              </div>
                              <div className="text-center">
                                <div className="font-bold text-lg">
                                  {match.score1 !== null && match.score2 !== null 
                                    ? `${match.score1} - ${match.score2}` 
                                    : 'vs'}
                                </div>
                              </div>
                              <div className="flex items-center">
                                <span className="mr-2 font-medium">{match.team2}</span>
                                <img 
                                  src={match.team2Logo} 
                                  alt={match.team2} 
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              </div>
                            </div>
                            <Button className="w-full mt-3" size="sm">
                              Watch Now
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center">
                        <Clock className="h-12 w-12 mx-auto text-neutral-300" />
                        <h3 className="mt-2 font-medium">No live matches</h3>
                        <p className="text-sm text-neutral-400 mt-1">
                          Check back later for live match updates
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Upcoming Matches Tab */}
              <TabsContent value="upcoming">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-primary" /> Upcoming Matches
                    </CardTitle>
                    <CardDescription>
                      Schedule of upcoming matches
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    {isLoadingUpcomingMatches ? (
                      Array(3).fill(0).map((_, index) => (
                        <MatchCard key={index} match={null} userId={userId} />
                      ))
                    ) : upcomingMatches && upcomingMatches.length > 0 ? (
                      upcomingMatches.map((match: any) => (
                        <MatchCard key={match.id} match={match} userId={userId} />
                      ))
                    ) : (
                      <div className="py-6 text-center">
                        <Calendar className="h-12 w-12 mx-auto text-neutral-300" />
                        <h3 className="mt-2 font-medium">No upcoming matches</h3>
                        <p className="text-sm text-neutral-400 mt-1">
                          Check back later for scheduled matches
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Subscribed Leagues Tab */}
              <TabsContent value="subscribed">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Bell className="h-5 w-5 mr-2 text-primary" /> My Subscribed Leagues
                    </CardTitle>
                    <CardDescription>
                      Leagues you follow and receive updates for
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    {isLoadingLeagues ? (
                      Array(3).fill(0).map((_, index) => (
                        <div key={index} className="animate-pulse p-4 border-b last:border-0">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-neutral-200 rounded-full"></div>
                            <div className="ml-3 flex-1">
                              <div className="h-4 bg-neutral-200 rounded w-1/3 mb-2"></div>
                              <div className="h-3 bg-neutral-200 rounded w-1/4"></div>
                            </div>
                            <div className="h-8 bg-neutral-200 rounded w-20"></div>
                          </div>
                        </div>
                      ))
                    ) : leagues && subscribedLeagues.length > 0 ? (
                      leagues
                        .filter((league: any) => subscribedLeagues.includes(league.id))
                        .map((league: any) => {
                          const notificationsEnabled = leagueNotifications.includes(league.id);
                          
                          return (
                            <div 
                              key={league.id} 
                              className="p-3 border-b border-neutral-200 last:border-0 hover:bg-neutral-50 cursor-pointer"
                              onClick={() => setActiveLeagueId(league.id)}
                            >
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                  <img 
                                    src={league.logo} 
                                    alt={league.name} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="ml-3 flex-1">
                                  <h4 className="font-medium">{league.name}</h4>
                                  <div className="flex items-center">
                                    <p className="text-xs text-neutral-400">{league.sport}</p>
                                    {notificationsEnabled && (
                                      <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-600 border-green-200">
                                        <Bell className="h-3 w-3 mr-1" /> Notifications On
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className={notificationsEnabled ? "bg-primary/10 text-primary" : ""}
                                  onClick={(e) => toggleNotifications(league, e)}
                                >
                                  {notificationsEnabled ? <BellOff className="h-4 w-4 mr-1" /> : <Bell className="h-4 w-4 mr-1" />}
                                  {notificationsEnabled ? 'Disable' : 'Enable'}
                                </Button>
                              </div>
                            </div>
                          );
                        })
                    ) : (
                      <div className="py-6 text-center">
                        <Bell className="h-12 w-12 mx-auto text-neutral-300" />
                        <h3 className="mt-2 font-medium">No subscribed leagues</h3>
                        <p className="text-sm text-neutral-400 mt-1">
                          Subscribe to leagues to receive updates and notifications
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}
