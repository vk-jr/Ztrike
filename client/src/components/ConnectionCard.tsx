import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { UserPlus, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface ConnectionCardProps {
  connection: any;
  currentUserId: number;
}

export default function ConnectionCard({ connection, currentUserId }: ConnectionCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const connectMutation = useMutation({
    mutationFn: () => {
      return apiRequest("POST", "/api/connections", {
        followerId: currentUserId,
        followingId: connection.id,
        status: "pending"
      });
    },
    onSuccess: () => {
      toast({
        title: "Connection request sent",
        description: `You've sent a connection request to ${connection.fullName}`,
      });
      queryClient.invalidateQueries({ queryKey: [`/api/connections/suggestions?userId=${currentUserId}`] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send connection request. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const dismissMutation = useMutation({
    mutationFn: () => {
      // This would typically call an API to dismiss the suggestion
      // For now, we'll just simulate success
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/connections/suggestions?userId=${currentUserId}`] });
    },
  });

  if (!connection) {
    return (
      <div className="p-3 border-b border-neutral-200">
        <div className="animate-pulse">
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
      </div>
    );
  }

  return (
    <div className="p-3 border-b border-neutral-200 hover:bg-neutral-50 transition-colors">
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
        <button 
          className={`flex-1 py-1.5 bg-primary text-white rounded text-xs font-medium hover:bg-primary/90 transition-colors flex items-center justify-center ${connectMutation.isPending ? 'opacity-70' : ''}`}
          onClick={() => connectMutation.mutate()}
          disabled={connectMutation.isPending}
        >
          <UserPlus className="h-3 w-3 mr-1" /> 
          {connectMutation.isPending ? 'Connecting...' : 'Connect'}
        </button>
        <button 
          className="w-8 h-8 flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 text-neutral-400 rounded transition-colors"
          onClick={() => dismissMutation.mutate()}
          disabled={dismissMutation.isPending}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
