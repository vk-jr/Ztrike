import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Bell, Check, ChevronRight, Trophy, Users } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

import TeamLeaderboard from "@/components/TeamLeaderboard";

export default function Teams() {
  const { toast } = useToast();
  const [selectionTab, setSelectionTab] = useState<'active' | 'history'>('active');
  
  // Fetch user's subscribed teams
  const { data: subscribedTeams, isLoading: teamsLoading } = useQuery({
    queryKey: ['/api/teams/subscribed'],
    queryFn: async () => {
      // Temporary mock data until API endpoint is created
      return [
        {
          id: 1,
          name: "Chicago Bulls",
          sport: "Basketball",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/67/Chicago_Bulls_logo.svg/1200px-Chicago_Bulls_logo.svg.png",
          league: "NBA",
          joined: "2023-11-15"
        },
        {
          id: 2,
          name: "Dallas Cowboys",
          sport: "American Football",
          logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Dallas_Cowboys.svg/1200px-Dallas_Cowboys.svg.png",
          league: "NFL",
          joined: "2024-01-10"
        }
      ];
    }
  });
  
  // Fetch team selection processes
  const { data: selectionProcesses, isLoading: processesLoading } = useQuery({
    queryKey: ['/api/teams/selections'],
    queryFn: async () => {
      // Temporary mock data until API endpoint is created
      return [
        {
          id: 1,
          teamId: 3,
          teamName: "Los Angeles Lakers",
          teamLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Los_Angeles_Lakers_logo.svg/1200px-Los_Angeles_Lakers_logo.svg.png",
          sport: "Basketball",
          league: "NBA",
          status: "In Progress",
          startDate: "2025-03-15",
          endDate: "2025-04-15",
          stage: "Physical Assessment",
          nextStage: "Skills Evaluation",
          nextStageDate: "2025-03-31"
        },
        {
          id: 2,
          teamId: 4,
          teamName: "New England Patriots",
          teamLogo: "https://upload.wikimedia.org/wikipedia/en/b/b9/New_England_Patriots_logo.svg",
          sport: "American Football",
          league: "NFL",
          status: "Applied",
          startDate: "2025-04-01",
          endDate: "2025-05-15",
          stage: "Application Review",
          nextStage: "Physical Assessment",
          nextStageDate: "2025-04-10"
        },
        {
          id: 3,
          teamId: 5,
          teamName: "Manchester United",
          teamLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png",
          sport: "Soccer",
          league: "Premier League",
          status: "Completed",
          startDate: "2024-11-01",
          endDate: "2024-12-15",
          stage: "Final Decision",
          result: "Rejected",
          feedback: "Thank you for your participation. Unfortunately, we cannot offer you a position at this time."
        }
      ];
    }
  });

  // Filter selection processes based on tab
  const filteredSelections = selectionProcesses?.filter(process => 
    (selectionTab === 'active' && process.status !== 'Completed') || 
    (selectionTab === 'history' && process.status === 'Completed')
  ) || [];

  // Handle joining a team selection process
  const handleJoinSelection = (teamName: string) => {
    toast({
      title: "Application Submitted",
      description: `You've successfully applied to join ${teamName}. We'll notify you of updates.`,
      duration: 5000,
    });
  };

  return (
    <div className="container mx-auto px-4 pt-20 pb-20 md:pb-16 max-w-7xl">
      {/* Team Leaderboard Section */}
      <div className="mb-16">
        <TeamLeaderboard />
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column - My Teams */}
        <div className="w-full lg:w-2/3">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md p-5 mb-6">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <Trophy className="h-6 w-6 mr-3 text-yellow-300" />
              My Teams
            </h1>
            <p className="text-blue-100 mt-1">Teams you've joined and are actively participating in</p>
          </div>
          
          {teamsLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : subscribedTeams?.length === 0 ? (
            <Card className="border-none shadow-md">
              <CardContent className="p-8 text-center">
                <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2 text-gray-700">No Teams Yet</h3>
                <p className="text-gray-500 mb-4 max-w-md mx-auto">You haven't joined any teams yet. Browse selection processes to apply for team positions.</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => document.getElementById('selection-processes')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Find Teams
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {subscribedTeams?.map(team => (
                <Card key={team.id} className="overflow-hidden hover:shadow-lg transition-shadow border-none">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 flex items-center">
                    <div className="bg-white p-2 rounded-lg mr-4">
                      <img 
                        src={team.logo} 
                        alt={team.name} 
                        className="h-12 w-12 object-contain"
                      />
                    </div>
                    <div className="text-white">
                      <h3 className="font-bold text-xl">{team.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-blue-100">
                        <span>{team.sport}</span>
                        <span>•</span>
                        <span>{team.league}</span>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-4 bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Joined on</p>
                        <p className="font-medium text-gray-800">{new Date(team.joined).toLocaleDateString()}</p>
                      </div>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white" 
                        size="sm" 
                        asChild
                      >
                        <Link href={`/teams/${team.id}`}>
                          View Details
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {/* Selection Processes Section */}
          <div id="selection-processes" className="mt-12">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md p-5 mb-6 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Users className="h-6 w-6 mr-3 text-yellow-300" />
                  Selection Processes
                </h2>
                <p className="text-blue-100 mt-1">Track your applications and selection progress</p>
              </div>
              <div className="flex space-x-2 bg-white/10 p-1 rounded-lg">
                <Button 
                  className={`${selectionTab === 'active' ? 'bg-white text-blue-700' : 'bg-transparent text-white hover:bg-white/20'}`}
                  size="sm"
                  onClick={() => setSelectionTab('active')}
                >
                  Active
                </Button>
                <Button 
                  className={`${selectionTab === 'history' ? 'bg-white text-blue-700' : 'bg-transparent text-white hover:bg-white/20'}`}
                  size="sm"
                  onClick={() => setSelectionTab('history')}
                >
                  History
                </Button>
              </div>
            </div>
            
            {processesLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredSelections.length === 0 ? (
              <Card className="border-none shadow-md">
                <CardContent className="p-8 text-center">
                  <Bell className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2 text-gray-700">
                    {selectionTab === 'active' ? 'No Active Selection Processes' : 'No Selection History'}
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {selectionTab === 'active' 
                      ? "You don't have any ongoing team selection processes. Apply to teams to get started."
                      : "You haven't participated in any team selections yet."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredSelections.map(process => (
                  <Card key={process.id} className="overflow-hidden hover:shadow-lg transition-shadow border-none">
                    <div className="flex items-center p-5 border-b border-gray-100">
                      <div className="bg-gray-50 p-2 rounded-lg mr-4">
                        <img 
                          src={process.teamLogo} 
                          alt={process.teamName} 
                          className="h-14 w-14 object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-lg text-gray-800">{process.teamName}</h3>
                          <Badge 
                            className={
                              process.status === 'In Progress' ? "bg-blue-600 hover:bg-blue-700" : 
                              process.status === 'Applied' ? "bg-gray-100 text-gray-800 hover:bg-gray-200" :
                              process.result === 'Accepted' ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                            }
                          >
                            {process.status === 'Completed' ? process.result : process.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <span>{process.sport}</span>
                          <span>•</span>
                          <span>{process.league}</span>
                        </div>
                      </div>
                      {process.status !== 'Completed' && (
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700 text-white hidden sm:flex" 
                          size="sm" 
                          asChild
                        >
                          <Link href={`/teams/selection/${process.id}`}>
                            View Details
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                    
                    <CardContent className="p-5 bg-white">
                      {process.status === 'Completed' ? (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Process period:</span> {new Date(process.startDate).toLocaleDateString()} - {new Date(process.endDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600 mb-3">
                            <span className="font-medium">Final stage:</span> {process.stage}
                          </p>
                          {process.feedback && (
                            <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-sm">
                              <p className="font-medium mb-1 text-blue-800">Feedback:</p>
                              <p className="text-blue-700">{process.feedback}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium text-gray-700">
                              Current Stage: <span className="text-blue-700">{process.stage}</span>
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(process.startDate).toLocaleDateString()} - {new Date(process.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          
                          {process.nextStage && (
                            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                              <div className="flex items-start">
                                <AlertCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-blue-800">Next: {process.nextStage}</p>
                                  <p className="text-xs text-blue-600">
                                    Scheduled for {new Date(process.nextStageDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-4 flex justify-end">
                            <Button 
                              className="bg-blue-600 hover:bg-blue-700 text-white sm:hidden" 
                              size="sm" 
                              asChild
                            >
                              <Link href={`/teams/selection/${process.id}`}>
                                View Details
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Right column - Available Teams */}
        <div className="w-full lg:w-1/3">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-200" />
                Available Teams
              </CardTitle>
              <CardDescription className="text-blue-100">Teams currently accepting applications</CardDescription>
            </CardHeader>
            <CardContent className="bg-white p-4">
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-100 hover:shadow-md transition-all">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/en/thumb/2/25/New_York_Knicks_logo.svg/1200px-New_York_Knicks_logo.svg.png" 
                    alt="New York Knicks" 
                    className="h-12 w-12 object-contain mr-3"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">New York Knicks</h4>
                    <p className="text-sm text-gray-500">NBA • Point Guard</p>
                  </div>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                    onClick={() => handleJoinSelection('New York Knicks')}
                  >
                    Apply
                  </Button>
                </div>
                
                <div className="flex items-center p-3 bg-neutral-50 rounded-lg">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Denver_Broncos_logo.svg/1200px-Denver_Broncos_logo.svg.png" 
                    alt="Denver Broncos" 
                    className="h-12 w-12 object-contain mr-3"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">Denver Broncos</h4>
                    <p className="text-sm text-neutral-500">NFL • Quarterback</p>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => handleJoinSelection('Denver Broncos')}
                  >
                    Apply
                  </Button>
                </div>
                
                <div className="flex items-center p-3 bg-neutral-50 rounded-lg">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/1200px-Manchester_City_FC_badge.svg.png" 
                    alt="Manchester City" 
                    className="h-12 w-12 object-contain mr-3"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">Manchester City</h4>
                    <p className="text-sm text-neutral-500">Premier League • Forward</p>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => handleJoinSelection('Manchester City')}
                  >
                    Apply
                  </Button>
                </div>
                
                <Separator />
                
                <div className="py-2">
                  <h4 className="font-medium mb-2">Upcoming Tryouts</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Boston Celtics</p>
                        <p className="text-xs text-neutral-500">Apr 15, 2025 • Boston</p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7">
                        <Bell className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">FC Barcelona</p>
                        <p className="text-xs text-neutral-500">May 2, 2025 • Barcelona</p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7">
                        <Bell className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">San Francisco 49ers</p>
                        <p className="text-xs text-neutral-500">May 20, 2025 • San Francisco</p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7">
                        <Bell className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <Button variant="link" size="sm" className="mt-4 px-0">
                    View all upcoming tryouts
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                
                <Separator />
                
                <div className="py-2">
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <p className="text-sm text-neutral-500">Based on your profile and performance</p>
                  
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center">
                      <img 
                        src="https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Washington_Wizards_logo.svg/1200px-Washington_Wizards_logo.svg.png" 
                        alt="Washington Wizards" 
                        className="h-8 w-8 object-contain mr-2"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Washington Wizards</p>
                        <div className="flex items-center">
                          <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-sm">
                            98% match
                          </span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="h-7">
                        View
                      </Button>
                    </div>
                    
                    <div className="flex items-center">
                      <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Arsenal_FC.svg/1200px-Arsenal_FC.svg.png" 
                        alt="Arsenal FC" 
                        className="h-8 w-8 object-contain mr-2"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Arsenal FC</p>
                        <div className="flex items-center">
                          <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-sm">
                            95% match
                          </span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="h-7">
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}