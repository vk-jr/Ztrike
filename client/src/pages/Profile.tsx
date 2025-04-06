import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Post from "@/components/Feed/Post";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CreatePost from "@/components/Feed/CreatePost";
import { 
  UserPlus, 
  MessageSquare, 
  MoreHorizontal, 
  MapPin, 
  Briefcase, 
  CalendarDays, 
  Trophy, 
  Users,
  Activity,
  ChartBar,
  Medal,
  LineChart,
  Star,
  TrendingUp,
  Dumbbell,
  Timer,
  Plus,
  Award,
  Clock,
  Target,
  Heart,
  MoveUp,
  BarChart3,
  GanttChart,
  Edit,
  Share2
} from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "@/App";

export default function Profile() {
  const { id } = useParams();
  const userId = parseInt(id);
  // Get current user ID from AuthContext instead of hardcoded value
  const { user: currentUser } = useContext(AuthContext);
  const currentUserId = currentUser?.id || 0;
  const isOwnProfile = userId === currentUserId;

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: [`/api/users/${userId}`],
  });

  const { data: posts, isLoading: isLoadingPosts } = useQuery({
    queryKey: [`/api/posts?userId=${userId}`],
  });

  if (isLoadingUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Cover photo skeleton */}
          <Skeleton className="h-48 w-full" />
          
          {/* Profile info skeleton */}
          <div className="px-4 sm:px-6 lg:px-8 pb-6">
            <div className="flex flex-col md:flex-row md:items-end -mt-16 md:-mt-20">
              <Skeleton className="h-32 w-32 rounded-full border-4 border-white" />
              
              <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-40 mt-2" />
              </div>
              
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold">User not found</h2>
        <p className="text-neutral-500 mt-2">The user profile you're looking for doesn't exist or has been removed.</p>
        <Button className="mt-4" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Profile header with cover image and profile info */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        {/* Cover image with gradient overlay for better text visibility */}
        <div className="h-64 bg-gradient-to-r from-primary/80 to-blue-600/90 rounded-t-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
          <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1504450758481-7338eba7524a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80')] bg-cover bg-center opacity-30"></div>
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        {/* Profile info - redesigned */}
        <div className="relative px-8 py-6">
          {/* Profile picture overlaying the cover */}
          <div className="absolute -top-24 left-10">
            <div className="relative">
              <img 
                src={user.avatar} 
                alt={user.fullName} 
                className="h-36 w-36 rounded-full border-4 border-white object-cover shadow-lg"
              />
              {isOwnProfile && (
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute bottom-2 right-0 bg-white h-8 w-8 rounded-full shadow-md"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="ml-44">
            {/* User Info */}
            <div className="flex flex-wrap justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{user.fullName}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-1 mb-3">
                  {user.sport && (
                    <Badge variant="secondary" className="text-primary bg-primary/10 border-primary/20 font-medium">
                      {user.sport}
                    </Badge>
                  )}
                  <span className="text-sm text-neutral-500">
                    {user.position} {user.team ? `@ ${user.team}` : ''}
                  </span>
                </div>
                <p className="text-sm text-neutral-600 max-w-2xl mb-4">
                  {user.bio || "Professional athlete passionate about sports excellence and personal growth. Committed to pushing boundaries and inspiring the next generation of athletes."}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
                {!isOwnProfile ? (
                  <>
                    <Button className="flex items-center">
                      <UserPlus className="mr-2 h-4 w-4" /> Connect
                    </Button>
                    <Button variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" /> Message
                    </Button>
                  </>
                ) : (
                  <Button>
                    <Edit className="h-4 w-4 mr-2" /> Edit Profile
                  </Button>
                )}
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Stats bar */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-200">
              <div className="text-center bg-neutral-50 rounded-lg p-3 hover:shadow-md transition-shadow">
                <p className="text-2xl font-bold text-primary">856</p>
                <p className="text-xs text-neutral-500 uppercase tracking-wider">Connections</p>
              </div>
              <div className="text-center bg-neutral-50 rounded-lg p-3 hover:shadow-md transition-shadow">
                <p className="text-2xl font-bold text-primary">{posts?.length || 0}</p>
                <p className="text-xs text-neutral-500 uppercase tracking-wider">Posts</p>
              </div>
              <div className="text-center bg-neutral-50 rounded-lg p-3 hover:shadow-md transition-shadow">
                <p className="text-2xl font-bold text-primary">12</p>
                <p className="text-xs text-neutral-500 uppercase tracking-wider">Leagues</p>
              </div>
              <div className="text-center bg-neutral-50 rounded-lg p-3 hover:shadow-md transition-shadow">
                <p className="text-2xl font-bold text-primary">7.2</p>
                <p className="text-xs text-neutral-500 uppercase tracking-wider">Avg. Stats</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div>
          {/* About card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.bio ? (
                <p className="text-neutral-600">{user.bio}</p>
              ) : (
                <p className="text-neutral-400 italic">No bio provided</p>
              )}
              
              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center text-sm">
                  <Briefcase className="h-4 w-4 text-neutral-400 mr-2" />
                  <span>{user.position || "Athlete"} at {user.team || "Not specified"}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 text-neutral-400 mr-2" />
                  <span>New York, USA</span>
                </div>
                <div className="flex items-center text-sm">
                  <CalendarDays className="h-4 w-4 text-neutral-400 mr-2" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Achievements card */}
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Achievements</CardTitle>
              {isOwnProfile && (
                <Button variant="ghost" size="sm">
                  + Add New
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mr-3 shadow-md">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-sm">League Champion</h4>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20" variant="secondary">2023</Badge>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">NBA Finals MVP with record-breaking performance</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mr-3 shadow-md">
                  <Medal className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-sm">MVP Award</h4>
                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200" variant="secondary">2022</Badge>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">All-Star Game MVP with 42 points</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mr-3 shadow-md">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-sm">Most Improved Player</h4>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200" variant="secondary">2021</Badge>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">Increased scoring average by 12.4 points</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center mr-3 shadow-md">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-sm">All-NBA First Team</h4>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200" variant="secondary">2020</Badge>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">Led league in assists and steals</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Performance Stats Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Performance Stats</CardTitle>
              <CardDescription>Current season highlights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <LineChart className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm font-medium">Points Per Game</span>
                  </div>
                  <span className="font-bold text-lg">24.8</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Activity className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm font-medium">Field Goal %</span>
                  </div>
                  <span className="font-bold text-lg">47.3%</span>
                </div>
                <Progress value={63} className="h-2 bg-green-100" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Timer className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-sm font-medium">Minutes Per Game</span>
                  </div>
                  <span className="font-bold text-lg">33.2</span>
                </div>
                <Progress value={88} className="h-2 bg-blue-100" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Dumbbell className="h-4 w-4 text-amber-500 mr-2" />
                    <span className="text-sm font-medium">Rebounds</span>
                  </div>
                  <span className="font-bold text-lg">8.2</span>
                </div>
                <Progress value={55} className="h-2 bg-amber-100" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content column */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="posts" className="flex-1">
                <Activity className="h-4 w-4 mr-2" /> Posts
              </TabsTrigger>
              <TabsTrigger value="media" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" /> Media
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex-1">
                <ChartBar className="h-4 w-4 mr-2" /> Performance
              </TabsTrigger>
              <TabsTrigger value="connections" className="flex-1">
                <Users className="h-4 w-4 mr-2" /> Connections
              </TabsTrigger>
              <TabsTrigger value="leagues" className="flex-1">
                <Trophy className="h-4 w-4 mr-2" /> Leagues
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts">
              {isLoadingPosts ? (
                Array(2).fill(0).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden p-4">
                    <div className="animate-pulse">
                      <div className="flex items-center">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="ml-3 flex-1">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-48 mt-1" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full mt-4" />
                      <Skeleton className="h-4 w-4/5 mt-2" />
                      <Skeleton className="h-60 w-full mt-4 rounded-md" />
                    </div>
                  </div>
                ))
              ) : posts && posts.length > 0 ? (
                posts.map((post: any) => (
                  <Post key={post.id} post={{...post, user}} currentUserId={currentUserId} />
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <Activity className="h-12 w-12 mx-auto text-neutral-300" />
                  <h3 className="mt-4 font-medium">No posts yet</h3>
                  <p className="text-neutral-400 mt-2">
                    {isOwnProfile 
                      ? "Share your training sessions, match highlights, or sports achievements" 
                      : `${user.fullName} hasn't posted anything yet`}
                  </p>
                  {isOwnProfile && (
                    <Button className="mt-4">Create Your First Post</Button>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="media">
              <Card>
                <CardContent className="py-8 text-center">
                  <div className="bg-neutral-100 p-6 rounded-full mx-auto w-20 h-20 flex items-center justify-center">
                    <MessageSquare className="h-10 w-10 text-neutral-400" />
                  </div>
                  <h3 className="mt-4 font-medium text-lg">No Media</h3>
                  <p className="text-neutral-400 text-sm mt-1 max-w-md mx-auto">
                    {isOwnProfile 
                      ? "Upload photos and videos from your games and training sessions" 
                      : `${user.fullName} hasn't uploaded any media yet`}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="performance">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Career Statistics Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Career Statistics</CardTitle>
                    <CardDescription>Overall career performance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Award className="h-4 w-4 text-orange-500 mr-2" />
                          <span className="text-sm font-medium">Games Played</span>
                        </div>
                        <span className="font-semibold">342</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-blue-500 mr-2" />
                          <span className="text-sm font-medium">Average Minutes</span>
                        </div>
                        <span className="font-semibold">31.7 MPG</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Target className="h-4 w-4 text-red-500 mr-2" />
                          <span className="text-sm font-medium">Field Goal %</span>
                        </div>
                        <span className="font-semibold">45.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <BarChart3 className="h-4 w-4 text-purple-500 mr-2" />
                          <span className="text-sm font-medium">Career PPG</span>
                        </div>
                        <span className="font-semibold">21.4</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 text-pink-500 mr-2" />
                          <span className="text-sm font-medium">Free Throw %</span>
                        </div>
                        <span className="font-semibold">86.3%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <MoveUp className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm font-medium">Assists Per Game</span>
                        </div>
                        <span className="font-semibold">7.2</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Recent Games Performance Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Last 5 Games</CardTitle>
                    <CardDescription>Most recent performance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-0">
                    <div className="overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-neutral-50 border-b border-neutral-200">
                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">DATE</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">VS</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-neutral-500">PTS</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-neutral-500">REB</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-neutral-500">AST</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-neutral-200">
                            <td className="px-4 py-3 text-xs text-neutral-700">Apr 12</td>
                            <td className="px-4 py-3 text-xs font-medium">@LAL</td>
                            <td className="px-4 py-3 text-xs text-center font-medium text-primary">32</td>
                            <td className="px-4 py-3 text-xs text-center">8</td>
                            <td className="px-4 py-3 text-xs text-center">10</td>
                          </tr>
                          <tr className="border-b border-neutral-200">
                            <td className="px-4 py-3 text-xs text-neutral-700">Apr 10</td>
                            <td className="px-4 py-3 text-xs font-medium">CHI</td>
                            <td className="px-4 py-3 text-xs text-center font-medium text-primary">28</td>
                            <td className="px-4 py-3 text-xs text-center">5</td>
                            <td className="px-4 py-3 text-xs text-center">7</td>
                          </tr>
                          <tr className="border-b border-neutral-200">
                            <td className="px-4 py-3 text-xs text-neutral-700">Apr 8</td>
                            <td className="px-4 py-3 text-xs font-medium">@BOS</td>
                            <td className="px-4 py-3 text-xs text-center font-medium text-primary">19</td>
                            <td className="px-4 py-3 text-xs text-center">11</td>
                            <td className="px-4 py-3 text-xs text-center">5</td>
                          </tr>
                          <tr className="border-b border-neutral-200">
                            <td className="px-4 py-3 text-xs text-neutral-700">Apr 6</td>
                            <td className="px-4 py-3 text-xs font-medium">PHI</td>
                            <td className="px-4 py-3 text-xs text-center font-medium text-primary">24</td>
                            <td className="px-4 py-3 text-xs text-center">6</td>
                            <td className="px-4 py-3 text-xs text-center">9</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-xs text-neutral-700">Apr 4</td>
                            <td className="px-4 py-3 text-xs font-medium">@MIA</td>
                            <td className="px-4 py-3 text-xs text-center font-medium text-primary">21</td>
                            <td className="px-4 py-3 text-xs text-center">9</td>
                            <td className="px-4 py-3 text-xs text-center">5</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Yearly Performance Chart */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Season Performance</CardTitle>
                    <CardDescription>Year-to-year statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-10">
                      <GanttChart className="h-14 w-14 mx-auto text-neutral-300" />
                      <h3 className="mt-2 font-medium">Interactive charts will be here</h3>
                      <p className="text-neutral-400 text-sm mt-1 max-w-md mx-auto">
                        View detailed performance statistics and trends over time
                      </p>
                      {isOwnProfile && (
                        <Button className="mt-4" variant="outline">Import Stats</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="connections">
              <Card>
                <CardHeader>
                  <CardTitle>Connections</CardTitle>
                  <CardDescription>
                    People in {isOwnProfile ? 'your' : `${user.fullName}'s`} professional network
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-8 text-center">
                    <Users className="h-12 w-12 mx-auto text-neutral-300" />
                    <h3 className="mt-4 font-medium">No connections to display</h3>
                    <p className="text-neutral-400 text-sm mt-1 max-w-md mx-auto">
                      {isOwnProfile 
                        ? "Connect with other athletes to grow your network" 
                        : `${user.fullName} hasn't connected with anyone yet`}
                    </p>
                    {isOwnProfile && (
                      <Button className="mt-4" onClick={() => window.location.href = '/network'}>
                        Find Connections
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="leagues">
              <Card>
                <CardHeader>
                  <CardTitle>Leagues & Teams</CardTitle>
                  <CardDescription>
                    Leagues and teams {isOwnProfile ? 'you' : `${user.fullName}`} follow
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-8 text-center">
                    <Trophy className="h-12 w-12 mx-auto text-neutral-300" />
                    <h3 className="mt-4 font-medium">No leagues followed</h3>
                    <p className="text-neutral-400 text-sm mt-1 max-w-md mx-auto">
                      {isOwnProfile 
                        ? "Follow leagues to get updates about matches and events" 
                        : `${user.fullName} doesn't follow any leagues yet`}
                    </p>
                    {isOwnProfile && (
                      <Button className="mt-4" onClick={() => window.location.href = '/leagues'}>
                        Explore Leagues
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
