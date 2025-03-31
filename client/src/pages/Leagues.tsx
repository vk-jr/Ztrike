import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import MatchCard from "@/components/MatchCard";
import { Search, Trophy, Calendar, Volleyball, Clock, Bell } from "lucide-react";

export default function Leagues() {
  const [activeLeagueId, setActiveLeagueId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const userId = 1; // Mock user ID - in real app, would come from authentication

  const { data: leagues, isLoading: isLoadingLeagues } = useQuery({
    queryKey: ['/api/leagues'],
  });

  const { data: liveMatches, isLoading: isLoadingLiveMatches } = useQuery({
    queryKey: ['/api/matches/live'],
  });

  const { data: upcomingMatches, isLoading: isLoadingUpcomingMatches } = useQuery({
    queryKey: ['/api/matches/upcoming'],
  });

  const { data: leagueMatches, isLoading: isLoadingLeagueMatches } = useQuery({
    queryKey: activeLeagueId ? [`/api/leagues/${activeLeagueId}/matches`] : null,
    enabled: !!activeLeagueId,
  });

  const filteredLeagues = leagues 
    ? leagues.filter((league: any) => 
        league.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        league.sport.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* League List */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-primary" /> Leagues
              </CardTitle>
              <CardDescription>
                Major sports leagues from around the world
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
                filteredLeagues.map((league: any) => (
                  <div 
                    key={league.id} 
                    className={`p-3 border-b border-neutral-200 last:border-0 hover:bg-neutral-50 cursor-pointer ${activeLeagueId === league.id ? 'bg-neutral-50' : ''}`}
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
                        <p className="text-xs text-neutral-400">{league.sport}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs"
                      >
                        <Bell className="h-3 w-3 mr-1" /> Follow
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center">
                  <Trophy className="h-12 w-12 mx-auto text-neutral-300" />
                  <h3 className="mt-2 font-medium">No leagues found</h3>
                  <p className="text-sm text-neutral-400 mt-1 px-4">
                    {searchQuery ? `No results for "${searchQuery}"` : "No leagues available"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Matches */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="live" className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="live" className="flex-1">
                <Clock className="h-4 w-4 mr-2" /> Live Matches
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="flex-1">
                <Calendar className="h-4 w-4 mr-2" /> Upcoming Matches
              </TabsTrigger>
              {activeLeagueId && (
                <TabsTrigger value="league" className="flex-1">
                  <Trophy className="h-4 w-4 mr-2" /> League Matches
                </TabsTrigger>
              )}
            </TabsList>
            
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
            
            {activeLeagueId && (
              <TabsContent value="league">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      {activeLeagueId === 1 ? (
                        <Trophy className="h-5 w-5 mr-2 text-orange-500" />
                      ) : activeLeagueId === 3 ? (
                        <Volleyball className="h-5 w-5 mr-2 text-green-500" />
                      ) : (
                        <Trophy className="h-5 w-5 mr-2 text-primary" />
                      )}
                      {leagues?.find((l: any) => l.id === activeLeagueId)?.name || "League"} Matches
                    </CardTitle>
                    <CardDescription>
                      All matches for the selected league
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    {isLoadingLeagueMatches ? (
                      Array(3).fill(0).map((_, index) => (
                        <MatchCard key={index} match={null} userId={userId} />
                      ))
                    ) : leagueMatches && leagueMatches.length > 0 ? (
                      leagueMatches.map((match: any) => (
                        <div key={match.id} className={`border-b border-neutral-200 last:border-0 ${match.status === 'live' ? 'bg-red-50' : ''}`}>
                          {match.status === 'live' ? (
                            <div className="flex items-center justify-between px-3 py-2 bg-red-50">
                              <div className="flex items-center">
                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">LIVE</span>
                                <span className="ml-2 text-sm font-medium">{match.leagueId === 1 ? 'NBA' : 'Premier League'}</span>
                              </div>
                              <div className="text-xs text-neutral-400">
                                {match.leagueId === 1 ? 'Q3 5:42' : '65\''}
                              </div>
                            </div>
                          ) : null}
                          <MatchCard match={match} userId={userId} />
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center">
                        <Calendar className="h-12 w-12 mx-auto text-neutral-300" />
                        <h3 className="mt-2 font-medium">No matches found</h3>
                        <p className="text-sm text-neutral-400 mt-1">
                          No scheduled or live matches for this league
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
