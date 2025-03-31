import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LiveMatches() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const { data: liveMatches, isLoading } = useQuery({
    queryKey: ['/api/matches/live'],
  });

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollAmount = 300;
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);
    
    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    setScrollPosition(newPosition);
  };

  // Update scroll position when scrolling manually
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      setScrollPosition(container.scrollLeft);
    };
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-primary to-green-500 text-white rounded-lg shadow-sm p-4 mb-4 relative overflow-hidden">
        <div className="animate-pulse">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-white/20 rounded-full p-2">
              <Skeleton className="h-8 w-8 bg-white/50 rounded-full" />
            </div>
            <div className="ml-3 flex-1">
              <Skeleton className="h-5 w-48 bg-white/50 rounded" />
              <Skeleton className="h-4 w-64 bg-white/50 rounded mt-1" />
            </div>
            <div className="flex-shrink-0">
              <Skeleton className="h-8 w-16 bg-white/50 rounded-full" />
            </div>
          </div>
          
          <div className="mt-4 flex space-x-3 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 min-w-[250px]">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-12 bg-white/50 rounded" />
                  <Skeleton className="h-4 w-20 bg-white/50 rounded" />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center">
                    <Skeleton className="h-10 w-10 bg-white/50 rounded-full" />
                    <Skeleton className="ml-2 h-4 w-16 bg-white/50 rounded" />
                  </div>
                  <div className="text-center">
                    <Skeleton className="h-5 w-20 bg-white/50 rounded" />
                    <Skeleton className="h-3 w-12 bg-white/50 rounded mt-1 mx-auto" />
                  </div>
                  <div className="flex items-center">
                    <Skeleton className="mr-2 h-4 w-16 bg-white/50 rounded" />
                    <Skeleton className="h-10 w-10 bg-white/50 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-8 w-full bg-white/50 rounded mt-3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!liveMatches || liveMatches.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-primary to-green-500 text-white rounded-lg shadow-sm p-4 mb-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 h-full w-1/3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="opacity-10 h-full">
          <path fill="currentColor" d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"></path>
          <path fill="currentColor" d="M12,6a1,1,0,0,0-1,1v5a1,1,0,0,0,.5.87l4,2.5a1,1,0,0,0,1.37-.37,1,1,0,0,0-.37-1.37L13,11.2V7A1,1,0,0,0,12,6Z"></path>
        </svg>
      </div>
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-white/20 rounded-full p-2">
          <Clock className="h-6 w-6" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="font-semibold text-lg">Live Matches Right Now</h3>
          <p className="text-white/80 text-sm mt-1">Watch your favorite teams compete in real-time</p>
        </div>
        <div className="flex-shrink-0">
          <Link
            href="/leagues"
            className="px-4 py-1 bg-white text-primary rounded-full text-sm font-medium hover:bg-white/90 transition-colors inline-block"
          >
            View All Matches
          </Link>
        </div>
      </div>
      
      <div className="relative mt-4">
        {/* Scroll buttons */}
        {scrollPosition > 0 && (
          <button 
            onClick={() => scroll('left')} 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-primary/80 hover:bg-primary text-white rounded-full p-1 shadow-md"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        
        {scrollContainerRef.current && 
          scrollPosition < scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth && (
          <button 
            onClick={() => scroll('right')} 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-primary/80 hover:bg-primary text-white rounded-full p-1 shadow-md"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
        
        {/* Matches scroll container */}
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto pb-2 flex space-x-3 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {liveMatches.map((match: any) => (
            <div key={match.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 min-w-[250px]">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium bg-red-500/80 text-white px-2 py-0.5 rounded">LIVE</span>
                <span className="text-xs text-white/80">
                  {match.leagueId === 1 ? 'NBA Finals' : match.leagueId === 3 ? 'Premier League' : 'UFC'}
                </span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center">
                  <img 
                    src={match.team1Logo || 'https://via.placeholder.com/40'} 
                    alt={match.team1}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="ml-2 font-semibold">{match.team1}</span>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">
                    {typeof match.score1 === 'number' && typeof match.score2 === 'number' 
                      ? `${match.score1} - ${match.score2}` 
                      : 'vs'
                    }
                  </div>
                  <div className="text-xs text-white/80">
                    {match.leagueId === 1 ? 'Q3 5:42' : match.leagueId === 3 ? '65\'' : 'Round 2'}
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 font-semibold">{match.team2}</span>
                  <img 
                    src={match.team2Logo || 'https://via.placeholder.com/40'} 
                    alt={match.team2}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
              </div>
              <button className="w-full mt-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm font-medium">
                Watch Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
