import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Trophy, Users, MapPin, Clock, Award, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TeamDetail() {
  // Get the team ID from URL params
  const params = useParams<{ id: string }>();
  const teamId = parseInt(params.id);

  // Fetch team data
  const { data: team, isLoading } = useQuery({
    queryKey: [`/api/teams/${teamId}`],
    queryFn: async () => {
      // Mock data for demonstration
      return {
        id: teamId,
        name: teamId === 1 ? "Chicago Bulls" : "Dallas Cowboys",
        sport: teamId === 1 ? "Basketball" : "American Football",
        logo: teamId === 1 
          ? "https://upload.wikimedia.org/wikipedia/en/thumb/6/67/Chicago_Bulls_logo.svg/1200px-Chicago_Bulls_logo.svg.png" 
          : "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Dallas_Cowboys.svg/1200px-Dallas_Cowboys.svg.png",
        league: teamId === 1 ? "NBA" : "NFL",
        location: teamId === 1 ? "Chicago, IL" : "Dallas, TX",
        founded: teamId === 1 ? "1966" : "1960",
        championships: teamId === 1 ? 6 : 5,
        coach: teamId === 1 ? "Billy Donovan" : "Mike McCarthy",
        stadium: teamId === 1 ? "United Center" : "AT&T Stadium",
        description: teamId === 1 
          ? "The Chicago Bulls are an American professional basketball team based in Chicago. The Bulls compete in the National Basketball Association as a member of the league's Eastern Conference Central Division." 
          : "The Dallas Cowboys are a professional American football team based in the Dallas–Fort Worth metroplex. The Cowboys compete in the National Football League as a member club of the league's National Football Conference East division.",
        roster: Array(12).fill(0).map((_, i) => ({
          id: i + 1,
          name: `Player ${i + 1}`,
          position: teamId === 1 
            ? ["PG", "SG", "SF", "PF", "C"][Math.floor(Math.random() * 5)] 
            : ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "CB", "S"][Math.floor(Math.random() * 9)],
          number: Math.floor(Math.random() * 99) + 1,
          avatar: null
        })),
        schedule: Array(5).fill(0).map((_, i) => ({
          id: i + 1,
          opponent: `Opponent ${i + 1}`,
          date: new Date(Date.now() + (i + 1) * 86400000 * 7).toISOString(),
          location: Math.random() > 0.5 ? "Home" : "Away",
          time: "19:30"
        })),
        achievements: [
          { year: teamId === 1 ? "1991" : "1972", title: "Championship" },
          { year: teamId === 1 ? "1992" : "1978", title: "Championship" },
          { year: teamId === 1 ? "1993" : "1993", title: "Championship" },
          { year: teamId === 1 ? "1996" : "1994", title: "Championship" },
          { year: teamId === 1 ? "1997" : "1996", title: "Championship" },
          { year: teamId === 1 ? "1998" : "", title: "Championship" },
        ].filter(a => a.title && a.year)
      };
    },
    enabled: !isNaN(teamId)
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-20 pb-16 max-w-7xl">
        <div className="animate-pulse h-8 w-40 bg-neutral-200 rounded mb-4"></div>
        <div className="animate-pulse h-64 bg-neutral-200 rounded-lg mb-8"></div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="container mx-auto px-4 pt-20 pb-16 max-w-7xl">
        <div className="flex justify-start mb-8">
          <Button variant="outline" asChild>
            <Link href="/teams">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Teams
            </Link>
          </Button>
        </div>
        
        <Card className="py-12">
          <CardContent className="text-center">
            <Users className="h-16 w-16 mx-auto text-neutral-300 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Team Not Found</h2>
            <p className="text-neutral-500 max-w-md mx-auto mb-6">
              We couldn't find the team you're looking for. It may have been removed or doesn't exist.
            </p>
            <Button asChild>
              <Link href="/teams">View Available Teams</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-20 pb-16 max-w-7xl">
      <div className="flex justify-start mb-8">
        <Button variant="outline" asChild>
          <Link href="/teams">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Teams
          </Link>
        </Button>
      </div>
      
      {/* Team Overview */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-6 lg:p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-white rounded-lg p-2 shadow-sm">
              <img 
                src={team.logo} 
                alt={team.name} 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{team.name}</h1>
                <Badge className="md:self-start">{team.league}</Badge>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-neutral-600 mb-4">
                <div className="flex items-center">
                  <Trophy className="h-4 w-4 mr-1 text-amber-500" />
                  <span>{team.championships} Championships</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-primary" />
                  <span>{team.location}</span>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-1 text-neutral-500" />
                  <span>Founded in {team.founded}</span>
                </div>
              </div>
              <p className="text-neutral-600 max-w-3xl">{team.description}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h3 className="text-sm font-medium text-neutral-500 mb-1">Sport</h3>
            <p className="font-medium">{team.sport}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-neutral-500 mb-1">Head Coach</h3>
            <p className="font-medium">{team.coach}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-neutral-500 mb-1">Home Venue</h3>
            <p className="font-medium">{team.stadium}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-neutral-500 mb-1">Team Size</h3>
            <p className="font-medium">{team.roster.length} Players</p>
          </div>
        </div>
      </div>
      
      {/* Tabs for Team Details */}
      <Tabs defaultValue="roster" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="roster">
            <Users className="h-4 w-4 mr-2" /> Roster
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <Clock className="h-4 w-4 mr-2" /> Schedule
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Award className="h-4 w-4 mr-2" /> Achievements
          </TabsTrigger>
        </TabsList>
        
        {/* Roster Tab */}
        <TabsContent value="roster">
          <Card>
            <CardHeader>
              <CardTitle>Team Roster</CardTitle>
              <CardDescription>Current players on the team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {team.roster.map(player => (
                  <div 
                    key={player.id} 
                    className="flex items-center p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                  >
                    <Avatar className="h-12 w-12 mr-3">
                      <AvatarImage src={player.avatar || undefined} alt={player.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {player.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{player.name}</h4>
                        <span className="text-sm text-neutral-400">#{player.number}</span>
                      </div>
                      <p className="text-sm text-neutral-500">{player.position}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Schedule Tab */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Games</CardTitle>
              <CardDescription>Next five games on the schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {team.schedule.map(game => (
                  <div 
                    key={game.id} 
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-neutral-50 rounded-lg"
                  >
                    <div className="mb-2 md:mb-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{game.location === "Home" ? team.name : game.opponent}</h4>
                        <span className="text-sm text-neutral-400">vs</span>
                        <h4 className="font-medium">{game.location === "Home" ? game.opponent : team.name}</h4>
                      </div>
                      <p className="text-sm text-neutral-500">{game.location === "Home" ? team.stadium : "Away Game"}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{new Date(game.date).toLocaleDateString()}</p>
                        <p className="text-sm text-neutral-500">{game.time}</p>
                      </div>
                      <Badge variant={game.location === "Home" ? "default" : "outline"}>
                        {game.location}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Achievements Tab */}
        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Team Achievements</CardTitle>
              <CardDescription>Championships and major awards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-lg mb-4 flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-amber-500" /> Championships
                  </h3>
                  <div className="relative ml-4 pl-6 border-l border-neutral-200">
                    {team.achievements.map((achievement, index) => (
                      <div key={index} className="mb-6 relative">
                        <div className="absolute -left-10 w-4 h-4 rounded-full bg-primary"></div>
                        <div className="bg-neutral-50 p-4 rounded-lg">
                          <h4 className="font-medium">{achievement.year} {achievement.title}</h4>
                          <p className="text-sm text-neutral-500 mt-1">
                            {team.name} won the {team.league} Championship in {achievement.year}
                          </p>
                        </div>
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