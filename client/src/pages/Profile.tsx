import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Post from "@/components/Feed/Post";
import { 
  UserPlus, 
  MessageSquare, 
  MoreHorizontal, 
  MapPin, 
  Briefcase, 
  CalendarDays, 
  Trophy, 
  Users,
  Activity 
} from "lucide-react";

export default function Profile() {
  const { id } = useParams();
  const userId = parseInt(id);
  // Current user ID - would come from authentication in a real app
  const currentUserId = 1;
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        {/* Cover photo */}
        <div className="h-48 bg-gradient-to-r from-primary to-green-500 relative"></div>
        
        {/* Profile info */}
        <div className="px-4 sm:px-6 lg:px-8 pb-6">
          <div className="flex flex-col md:flex-row md:items-end -mt-16 md:-mt-20">
            <img 
              src={user.avatar} 
              alt={user.fullName} 
              className="h-32 w-32 rounded-full border-4 border-white object-cover"
            />
            
            <div className="mt-4 md:mt-0 md:ml-6 flex-1">
              <h1 className="text-2xl font-bold">{user.fullName}</h1>
              <p className="text-neutral-500">{user.sport} • {user.position} • {user.team}</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-3">
              {!isOwnProfile && (
                <>
                  <Button className="flex items-center">
                    <UserPlus className="mr-2 h-4 w-4" /> Connect
                  </Button>
                  <Button variant="outline" size="icon">
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                </>
              )}
              {isOwnProfile && (
                <Button variant="outline">Edit Profile</Button>
              )}
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Stats bar */}
          <div className="flex mt-6 pt-4 border-t border-neutral-200">
            <div className="mr-6">
              <div className="font-semibold">856</div>
              <div className="text-sm text-neutral-500">Connections</div>
            </div>
            <div className="mr-6">
              <div className="font-semibold">{posts?.length || 0}</div>
              <div className="text-sm text-neutral-500">Posts</div>
            </div>
            <div>
              <div className="font-semibold">12</div>
              <div className="text-sm text-neutral-500">Leagues</div>
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
                  <span>Athlete at {user.team || "Not specified"}</span>
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
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Trophy className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">League Champion</h4>
                  <p className="text-xs text-neutral-500">NBA Finals 2022</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                  <Trophy className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">MVP Award</h4>
                  <p className="text-xs text-neutral-500">All-Star Game 2021</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Activity className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Most Improved Player</h4>
                  <p className="text-xs text-neutral-500">2020 Season</p>
                </div>
              </div>
              
              {isOwnProfile && (
                <Button variant="outline" className="w-full mt-2">
                  Add Achievement
                </Button>
              )}
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
