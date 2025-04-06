import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Trophy, UserPlus, Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useContext } from "react";
import { AuthContext } from "@/App";

export default function LeftSidebar() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const userId = user?.id;

  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: [`/api/users/${userId}`],
    enabled: isAuthenticated && !!userId,
  });

  const { data: subscribedLeagues, isLoading: isLoadingLeagues } = useQuery({
    queryKey: [`/api/leagues/subscribed?userId=${userId}`],
  });

  return (
    <div className="hidden lg:block w-64 flex-shrink-0 transition-all duration-300">
      <div className="sticky top-24 space-y-4">
        {/* Profile Card */}
        <div className="bg-white/95 rounded-lg shadow-lg overflow-hidden backdrop-blur-sm border border-blue-100/50 hover:shadow-xl transition-all duration-300 hover:bg-white">
          <div className="h-20 bg-gradient-to-r from-primary to-green-500"></div>
          <div className="px-4 pb-4 text-center">
            {isAuthenticated ? (
              isLoadingUser ? (
                <>
                  <Skeleton className="h-16 w-16 rounded-full mx-auto -mt-8 border-4 border-white" />
                  <Skeleton className="h-5 w-3/4 mx-auto mt-3" />
                  <Skeleton className="h-4 w-5/6 mx-auto mt-2" />
                  <div className="border-t border-b border-neutral-200 flex my-3 py-2">
                    <div className="flex-1 text-center">
                      <Skeleton className="h-5 w-10 mx-auto" />
                      <Skeleton className="h-3 w-16 mx-auto mt-1" />
                    </div>
                    <div className="flex-1 text-center border-l border-neutral-200">
                      <Skeleton className="h-5 w-10 mx-auto" />
                      <Skeleton className="h-3 w-16 mx-auto mt-1" />
                    </div>
                  </div>
                </>
              ) : userData ? (
                <>
                  <img 
                    className="h-16 w-16 rounded-full mx-auto -mt-8 border-4 border-white object-cover" 
                    src={user?.avatar || userData.avatar} 
                    alt={user?.fullName || userData.fullName}
                  />
                  <h3 className="font-semibold text-lg mt-2">{user?.fullName || userData.fullName}</h3>
                  <p className="text-sm text-neutral-400 mt-1">
                    {userData.sport} | {userData.position} | {userData.team}
                  </p>
                  
                  <div className="border-t border-b border-neutral-200 flex my-3 py-2 text-sm">
                    <div className="flex-1 text-center">
                      <div className="font-semibold">856</div>
                      <div className="text-neutral-400 text-xs">Connections</div>
                    </div>
                    <div className="flex-1 text-center border-l border-neutral-200">
                      <div className="font-semibold">125</div>
                      <div className="text-neutral-400 text-xs">Post Views</div>
                    </div>
                  </div>
                  
                  <Link href={`/profile/${userId}`} className="block text-primary text-sm">
                    View your profile
                  </Link>
                </>
              ) : (
                <p className="text-neutral-400 text-sm py-4">Failed to load profile</p>
              )
            ) : (
              <div className="text-center py-4">
                <p className="text-neutral-400 text-sm mb-2">Please log in to view your profile</p>
                <Link href="/login" className="text-primary text-sm hover:underline">Login</Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white/95 rounded-lg shadow-lg overflow-hidden backdrop-blur-sm border border-blue-100/50 hover:shadow-xl transition-all duration-300 hover:bg-white">
          <div className="p-4">
            <h3 className="font-semibold mb-3">Recent Activity</h3>
            
            <div className="flex items-start py-2">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Trophy className="h-4 w-4" />
              </div>
              <div className="ml-3">
                <p className="text-sm"><span className="font-medium">NBA Finals</span> has started. Lakers vs. Celtics is live now.</p>
                <p className="text-xs text-neutral-400 mt-1">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start py-2">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                <UserPlus className="h-4 w-4" />
              </div>
              <div className="ml-3">
                <p className="text-sm"><span className="font-medium">Serena Williams</span> accepted your connection request.</p>
                <p className="text-xs text-neutral-400 mt-1">Yesterday</p>
              </div>
            </div>
            
            <div className="flex items-start py-2">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500">
                <Heart className="h-4 w-4" />
              </div>
              <div className="ml-3">
                <p className="text-sm"><span className="font-medium">25 people</span> liked your post about training techniques.</p>
                <p className="text-xs text-neutral-400 mt-1">2 days ago</p>
              </div>
            </div>
            
            <Link href="#" className="block text-primary text-sm text-center mt-2">View all activity</Link>
          </div>
        </div>
        
        {/* Subscribed Leagues */}
        <div className="bg-white/95 rounded-lg shadow-lg overflow-hidden backdrop-blur-sm border border-blue-100/50 hover:shadow-xl transition-all duration-300 hover:bg-white">
          <div className="p-4">
            <h3 className="font-semibold mb-3">Your Leagues</h3>
            
            {isLoadingLeagues ? (
              <>
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center py-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="ml-3 flex-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16 mt-1" />
                    </div>
                    <Skeleton className="w-12 h-5 rounded-full" />
                  </div>
                ))}
              </>
            ) : subscribedLeagues && subscribedLeagues.length > 0 ? (
              <>
                {subscribedLeagues.map((league) => (
                  <div key={league.id} className="flex items-center py-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
                      <img 
                        src={league.logo} 
                        alt={league.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium">{league.name}</p>
                      <p className="text-xs text-neutral-400">{league.sport}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-flex px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-medium">
                        Live
                      </span>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-neutral-400 text-sm py-2">No subscribed leagues</p>
            )}
            
            <Link href="/leagues" className="block text-primary text-sm text-center mt-2">
              Explore more leagues
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
