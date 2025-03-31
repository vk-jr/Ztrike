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
    <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-2xl shadow-lg p-5 mb-6 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 h-full w-full opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" fill="white" />
          <circle cx="300" cy="300" r="120" fill="white" />
        </svg>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 relative z-10">
        <div className="flex items-center mb-3 sm:mb-0">
          <div className="flex-shrink-0 bg-white/30 rounded-full p-2.5 mr-4 backdrop-blur-sm">
            <Clock className="h-7 w-7" />
          </div>
          <div>
            <h3 className="font-bold text-xl tracking-tight">Live Matches Right Now</h3>
            <p className="text-white/90 mt-1">Watch your favorite teams compete in real-time</p>
          </div>
        </div>
        <Link
          href="/leagues"
          className="px-5 py-2 bg-white text-blue-600 hover:text-blue-700 rounded-full font-semibold hover:bg-white/90 transition-colors shadow-sm inline-flex items-center group"
        >
          View All Matches
          <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
      
      <div className="relative z-10">
        {/* Scroll buttons */}
        {scrollPosition > 0 && (
          <button 
            onClick={() => scroll('left')} 
            className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white hover:bg-gray-100 text-blue-600 rounded-full p-2 shadow-md"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        
        {scrollContainerRef.current && 
          scrollPosition < scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth && (
          <button 
            onClick={() => scroll('right')} 
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white hover:bg-gray-100 text-blue-600 rounded-full p-2 shadow-md"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
        
        {/* Matches scroll container */}
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto pb-2 flex space-x-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {liveMatches.map((match: any) => (
            <div 
              key={match.id} 
              className="bg-white/15 backdrop-blur-sm rounded-xl p-4 min-w-[280px] border border-white/20 hover:bg-white/20 transition-colors flex flex-col"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold bg-red-500 text-white px-2.5 py-1 rounded-full tracking-wide">LIVE</span>
                <span className="text-xs font-medium text-white/90 bg-white/10 px-2.5 py-1 rounded-full">
                  {match.leagueId === 1 ? 'NBA Finals' : match.leagueId === 3 ? 'Premier League' : 'UFC'}
                </span>
              </div>
              
              <div className="flex items-center justify-between bg-black/10 rounded-lg p-3 mb-3">
                <div className="flex flex-col items-center w-[38%]">
                  <img 
                    src={match.team1Logo || 'https://via.placeholder.com/40'} 
                    alt={match.team1}
                    className="w-12 h-12 rounded-full object-cover bg-white/20 p-1 mb-2"
                  />
                  <span className="font-bold text-center">{match.team1}</span>
                </div>
                
                <div className="text-center w-[24%]">
                  <div className="font-bold text-2xl mb-1">
                    {typeof match.score1 === 'number' && typeof match.score2 === 'number' 
                      ? `${match.score1} - ${match.score2}` 
                      : 'vs'
                    }
                  </div>
                  <div className="text-xs text-white/80 bg-black/20 rounded-full px-2 py-0.5 inline-block">
                    {match.leagueId === 1 ? 'Q3 5:42' : match.leagueId === 3 ? '65\'' : 'Round 2'}
                  </div>
                </div>
                
                <div className="flex flex-col items-center w-[38%]">
                  <img 
                    src={match.team2Logo || 'https://via.placeholder.com/40'} 
                    alt={match.team2}
                    className="w-12 h-12 rounded-full object-cover bg-white/20 p-1 mb-2"
                  />
                  <span className="font-bold text-center">{match.team2}</span>
                </div>
              </div>
              
              <button className="w-full py-2.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-bold transition-colors mt-auto flex items-center justify-center group">
                Watch Now
                <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
