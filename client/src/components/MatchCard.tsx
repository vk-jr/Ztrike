import { useState } from "react";
import { Bell, Calendar } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface MatchCardProps {
  match: any;
  userId: number;
}

export default function MatchCard({ match, userId }: MatchCardProps) {
  const [isReminded, setIsReminded] = useState(false);
  const [isAddedToCalendar, setIsAddedToCalendar] = useState(false);
  
  const { toast } = useToast();
  
  const remindMutation = useMutation({
    mutationFn: () => {
      // In a real app, this would create a notification subscription for the match
      return apiRequest("POST", "/api/subscriptions", {
        userId,
        leagueId: match.leagueId
      });
    },
    onSuccess: () => {
      setIsReminded(true);
      toast({
        title: "Reminder set",
        description: `You'll be notified before the ${match.team1} vs ${match.team2} match`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to set reminder. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const addToCalendarMutation = useMutation({
    mutationFn: () => {
      // In a real app, this would add the match to the user's calendar or create a calendar event
      return Promise.resolve();
    },
    onSuccess: () => {
      setIsAddedToCalendar(true);
      toast({
        title: "Added to calendar",
        description: `${match.team1} vs ${match.team2} has been added to your calendar`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add to calendar. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!match) {
    return (
      <div className="p-3 border-b border-neutral-200">
        <div className="animate-pulse">
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
      </div>
    );
  }

  const formatMatchTime = (date: string) => {
    const matchDate = new Date(date);
    return matchDate.toLocaleDateString(undefined, { weekday: 'short' }) + ", " +
           matchDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-3 border-b border-neutral-200 hover:bg-neutral-50 transition-colors">
      <div className="flex justify-between items-center text-xs text-neutral-400">
        <span>
          {match.leagueId === 1 ? 'NBA • Western Conference' : 
           match.leagueId === 3 ? 'Premier League' : 'UFC • Heavyweight'}
        </span>
        <span>{formatMatchTime(match.startTime)}</span>
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
        <button 
          className={`flex-1 py-1 ${isReminded ? 'bg-primary/30 text-primary' : 'bg-primary/10 hover:bg-primary/20 text-primary'} rounded text-xs font-medium transition-colors flex items-center justify-center`}
          onClick={() => remindMutation.mutate()}
          disabled={remindMutation.isPending || isReminded}
        >
          <Bell className="inline-block mr-1 h-3 w-3" /> 
          {isReminded ? 'Reminded' : remindMutation.isPending ? 'Setting...' : 'Remind Me'}
        </button>
        <button 
          className={`flex-1 py-1 ${isAddedToCalendar ? 'bg-neutral-200 text-neutral-500' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-400'} rounded text-xs font-medium transition-colors flex items-center justify-center`}
          onClick={() => addToCalendarMutation.mutate()}
          disabled={addToCalendarMutation.isPending || isAddedToCalendar}
        >
          <Calendar className="inline-block mr-1 h-3 w-3" /> 
          {isAddedToCalendar ? 'Added' : addToCalendarMutation.isPending ? 'Adding...' : 'Add to Calendar'}
        </button>
      </div>
    </div>
  );
}
