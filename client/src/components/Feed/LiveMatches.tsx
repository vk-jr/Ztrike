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

  // Make sure we have an array of live matches
  const matchesArray = Array.isArray(liveMatches) ? liveMatches : [];
  
  if (matchesArray.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl shadow-md mb-5 relative overflow-hidden">
      {/* Top section with title and link */}
      <div className="flex items-center justify-between p-3 relative z-10">
        <div className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          <h3 className="font-bold text-base">Live Matches Right Now</h3>
        </div>
        <Link
          href="/leagues"
          className="text-xs font-medium text-white/90 hover:text-white flex items-center"
        >
          View All Matches
          <ChevronRight className="ml-0.5 h-3 w-3" />
        </Link>
      </div>
      
      {/* Matches cards */}
      <div className="px-3 pb-3 flex space-x-3 overflow-x-auto scrollbar-hide"
        ref={scrollContainerRef}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {matchesArray.slice(0, 2).map((match: any) => (
          <div 
            key={match.id} 
            className="bg-white/15 backdrop-blur-sm rounded-lg p-3 flex-1 min-w-[160px] flex flex-col"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">LIVE</span>
              <span className="text-[10px] font-medium bg-white/10 px-2 py-0.5 rounded-full">
                {match.leagueId === 1 ? 'NBA' : match.leagueId === 3 ? 'Premier League' : 'UFC'}
              </span>
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col items-center w-[40%]">
                <img 
                  src={match.team1Logo || 'https://via.placeholder.com/32'} 
                  alt={match.team1}
                  className="w-8 h-8 rounded-full object-cover mb-1"
                />
                <span className="text-xs font-medium text-center">{match.team1}</span>
              </div>
              
              <div className="text-center">
                <div className="font-bold text-xl">
                  {typeof match.score1 === 'number' && typeof match.score2 === 'number' 
                    ? `${match.score1} - ${match.score2}` 
                    : 'vs'
                  }
                </div>
                <div className="text-[10px] bg-black/20 rounded-full px-1.5 py-0.5 inline-block">
                  {match.leagueId === 1 ? 'Round 2' : 'Round 2'}
                </div>
              </div>
              
              <div className="flex flex-col items-center w-[40%]">
                <img 
                  src={match.team2Logo || 'https://via.placeholder.com/32'} 
                  alt={match.team2}
                  className="w-8 h-8 rounded-full object-cover mb-1"
                />
                <span className="text-xs font-medium text-center">{match.team2}</span>
              </div>
            </div>
            
            <button className="w-full py-1.5 mt-auto bg-white/20 hover:bg-white/30 rounded text-xs font-medium transition-colors flex items-center justify-center">
              Watch Now
              <ChevronRight className="ml-0.5 h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
