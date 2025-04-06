import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Bell, Calendar, UserPlus, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useContext } from "react";
import { AuthContext } from "@/App";

export default function RightSidebar() {
  // Get user ID from AuthContext instead of hardcoded value
  const { user: currentUser } = useContext(AuthContext);
  const userId = currentUser?.id || 0;

  const { data: upcomingMatches, isLoading: isLoadingMatches } = useQuery({
    queryKey: ['/api/matches/upcoming'],
  });

  const { data: suggestedConnections, isLoading: isLoadingConnections } = useQuery({
    queryKey: [`/api/connections/suggestions?userId=${userId}`],
  });

  return (
    <div className="hidden md:block w-64 lg:w-80 flex-shrink-0 transition-all duration-300">
      <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-sky-100 rounded-xl shadow-xl p-4 sticky top-20 border border-blue-200/50 backdrop-blur-sm hover:shadow-2xl hover:border-blue-300/50 transition-all duration-300">
        <div className="sticky top-24 space-y-6">
          {/* Upcoming Matches */}
        <div className="bg-white/95 rounded-lg shadow-lg overflow-hidden backdrop-blur-sm border border-blue-100/50 hover:shadow-xl transition-all duration-300 hover:bg-white">
          <div className="p-4 border-b border-neutral-200/75">
            <h3 className="font-semibold">Upcoming Matches</h3>
          </div>
          
          {isLoadingMatches ? (
            <>
              {[1, 2, 3].map((item) => (
                <div key={item} className="p-3 border-b border-neutral-200">
                  <div className="flex justify-between items-center text-xs">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <Skeleton className="ml-2 h-4 w-16" />
                    </div>
                    <Skeleton className="h-4 w-5" />
                    <div className="flex items-center">
                      <Skeleton className="mr-2 h-4 w-16" />
                      <Skeleton className="w-8 h-8 rounded-full" />
                    </div>
                  </div>
                  
                  <div className="mt-2 flex items-center space-x-2">
                    <Skeleton className="h-7 w-full rounded" />
                    <Skeleton className="h-7 w-full rounded" />
                  </div>
                </div>
              ))}
            </>
          ) : upcomingMatches && upcomingMatches.length > 0 ? (
            <>
              {upcomingMatches.slice(0, 3).map((match) => (
                <div key={match.id} className="p-3 border-b border-neutral-200 hover:bg-neutral-50 transition-colors">
                  <div className="flex justify-between items-center text-xs text-neutral-400">
                    <span>{match.leagueId === 1 ? 'NBA • Western Conference' : 'Premier League'}</span>
                    <span>{new Date(match.startTime).toLocaleDateString()} {new Date(match.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <img 
                        src={match.team1Logo || 'https://via.placeholder.com/40'} 
                        alt={match.team1} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="ml-2 text-sm font-medium">{match.team1}</span>
                    </div>
                    <span className="text-xs font-semibold text-neutral-400">VS</span>
                    <div className="flex items-center">
                      <span className="mr-2 text-sm font-medium">{match.team2}</span>
                      <img 
                        src={match.team2Logo || 'https://via.placeholder.com/40'} 
                        alt={match.team2} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-2 flex items-center space-x-2">
                    <button className="flex-1 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded text-xs font-medium transition-colors">
                      <Bell className="inline-block mr-1 h-3 w-3" /> Remind Me
                    </button>
                    <button className="flex-1 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-400 rounded text-xs font-medium transition-colors">
                      <Calendar className="inline-block mr-1 h-3 w-3" /> Add to Calendar
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="p-3 text-center text-neutral-400 text-sm">
              No upcoming matches
            </div>
          )}
          
          <div className="p-3 bg-neutral-50/80 text-center hover:bg-neutral-100/80 transition-colors">
            <Link href="/leagues" className="text-primary text-sm font-medium">View All Matches</Link>
          </div>
        </div>
        
        {/* People You May Know */}
        <div className="bg-white/95 rounded-lg shadow-lg overflow-hidden backdrop-blur-sm border border-blue-100/50 hover:shadow-xl transition-all duration-300 hover:bg-white">
          <div className="p-4 border-b border-neutral-200/75">
            <h3 className="font-semibold">People You May Know</h3>
          </div>
          
          {isLoadingConnections ? (
            <>
              {[1, 2, 3].map((item) => (
                <div key={item} className="p-3 border-b border-neutral-200">
                  <div className="flex items-start">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="ml-3 flex-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-40 mt-1" />
                      <Skeleton className="h-3 w-32 mt-1" />
                    </div>
                  </div>
                  
                  <div className="mt-2 flex items-center space-x-2">
                    <Skeleton className="h-8 flex-1 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </div>
              ))}
            </>
          ) : suggestedConnections && suggestedConnections.length > 0 ? (
            <>
              {suggestedConnections.slice(0, 3).map((connection) => (
                <div key={connection.id} className="p-3 border-b border-neutral-200 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-start">
                    <img 
                      className="h-10 w-10 rounded-full object-cover" 
                      src={connection.avatar || 'https://via.placeholder.com/40'} 
                      alt={connection.fullName}
                    />
                    <div className="ml-3 flex-1">
                      <h4 className="font-medium text-sm">{connection.fullName}</h4>
                      <p className="text-xs text-neutral-400">{connection.sport} • {connection.team}</p>
                      <p className="text-xs text-neutral-400 mt-1">7 mutual connections</p>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex items-center space-x-2">
                    <button className="flex-1 py-1.5 bg-primary text-white rounded text-xs font-medium hover:bg-primary/90 transition-colors">
                      <UserPlus className="inline-block mr-1 h-3 w-3" /> Connect
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 text-neutral-400 rounded transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="p-3 text-center text-neutral-400 text-sm">
              No connection suggestions
            </div>
          )}
          
          <div className="p-3 bg-neutral-50/80 text-center hover:bg-neutral-100/80 transition-colors">
            <Link href="/network" className="text-primary text-sm font-medium">View All Suggestions</Link>
          </div>
        </div>
        
        {/* Trending Topics */}
        <div className="bg-white/95 rounded-lg shadow-lg overflow-hidden backdrop-blur-sm border border-blue-100/50 hover:shadow-xl transition-all duration-300 hover:bg-white">
          <div className="p-4 border-b border-neutral-200/75">
            <h3 className="font-semibold">Trending in Sports</h3>
          </div>
          
          <div className="divide-y divide-neutral-200/75">
            <div className="px-4 py-3 hover:bg-neutral-50/80 transition-colors">
              <Link href="#" className="block text-sm font-medium hover:text-primary transition-colors">#NBADraft2023</Link>
              <p className="text-xs text-neutral-400 mt-1">52.3K posts</p>
            </div>
            
            <div className="px-4 py-3 hover:bg-neutral-50/80 transition-colors">
              <Link href="#" className="block text-sm font-medium hover:text-primary transition-colors">#OlympicQualifiers</Link>
              <p className="text-xs text-neutral-400 mt-1">38.7K posts</p>
            </div>
            
            <div className="px-4 py-3 hover:bg-neutral-50/80 transition-colors">
              <Link href="#" className="block text-sm font-medium hover:text-primary transition-colors">#F1GrandPrix</Link>
              <p className="text-xs text-neutral-400 mt-1">24.2K posts</p>
            </div>
            
            <div className="px-4 py-3 hover:bg-neutral-50/80 transition-colors">
              <Link href="#" className="block text-sm font-medium hover:text-primary transition-colors">#WimbledonFinals</Link>
              <p className="text-xs text-neutral-400 mt-1">19.8K posts</p>
            </div>
            
            <div className="px-4 py-3 hover:bg-neutral-50/80 transition-colors">
              <Link href="#" className="block text-sm font-medium hover:text-primary transition-colors">#WorldCupQualifiers</Link>
              <p className="text-xs text-neutral-400 mt-1">15.4K posts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
