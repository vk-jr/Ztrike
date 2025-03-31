import { useQuery } from "@tanstack/react-query";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import CreatePost from "@/components/Feed/CreatePost";
import LiveMatches from "@/components/Feed/LiveMatches";
import Post from "@/components/Feed/Post";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Feed() {
  // Mock user ID - in a real app, this would come from authentication
  const userId = 1;

  const { data: user } = useQuery({
    queryKey: [`/api/users/${userId}`],
  });

  const { data: feedPosts, isLoading: isLoadingPosts, fetchNextPage, hasNextPage, isFetchingNextPage } = useQuery({
    queryKey: [`/api/feed?userId=${userId}`],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Sidebar */}
        <LeftSidebar />
        
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Create Post */}
          {user && (
            <CreatePost userId={userId} userAvatar={user.avatar} />
          )}
          
          {/* Live Matches Alert */}
          <LiveMatches />
          
          {/* Feed Posts */}
          {isLoadingPosts ? (
            Array(3).fill(0).map((_, index) => (
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
          ) : feedPosts && feedPosts.length > 0 ? (
            <>
              {feedPosts.map((post: any) => (
                <Post key={post.id} post={post} currentUserId={userId} />
              ))}
              
              <div className="text-center py-4">
                <Button 
                  variant="outline"
                  className="px-6 py-2"
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                >
                  {isFetchingNextPage 
                    ? 'Loading more...' 
                    : hasNextPage 
                      ? 'Load More Posts' 
                      : 'No more posts'}
                </Button>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h3 className="text-lg font-medium text-neutral-600">No posts in your feed yet</h3>
              <p className="text-neutral-400 mt-2">Connect with more athletes or create your first post to get started!</p>
            </div>
          )}
        </div>
        
        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
}
