import { useQuery } from "@tanstack/react-query";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import CreatePost from "@/components/Feed/CreatePost";
import LiveMatches from "@/components/Feed/LiveMatches";
import Post from "@/components/Feed/Post";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useContext } from "react";
import { AuthContext } from "@/App";

export default function Feed() {
  // Get user ID from AuthContext instead of hardcoded value
  const { user: currentUser } = useContext(AuthContext);
  const userId = currentUser?.id || 0;

  const { data: user } = useQuery({
    queryKey: [`/api/users/${userId}`],
  });

  const { data: feedPosts, isLoading: isLoadingPosts } = useQuery({
    queryKey: [`/api/feed?userId=${userId}`],
  });
  
  // Added placeholder functions for pagination functionality
  const fetchNextPage = () => console.log("Fetching next page...");
  const hasNextPage = false; 
  const isFetchingNextPage = false;
  
  // Create a temporary avatar for the user if it doesn't exist
  const userAvatar = user?.avatar || "https://via.placeholder.com/40";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 md:pb-8 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50">
      <div className="flex flex-col md:flex-row gap-6 relative">
        {/* Left Sidebar */}
        <div className="md:w-64 lg:w-72 transition-all duration-300">
          <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-sky-100 rounded-xl shadow-xl p-4 sticky top-20 border border-blue-200/50 backdrop-blur-sm hover:shadow-2xl hover:border-blue-300/50 transition-all duration-300">
            <LeftSidebar />
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Create Post */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg mb-4 p-4 border border-blue-100/50 hover:shadow-xl transition-all duration-300 hover:bg-white hover:border-blue-200/50">
            <CreatePost userId={userId} userAvatar={userAvatar} />
          </div>
          
          {/* Live Matches Alert */}
          <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl shadow-lg mb-4 p-4 border border-blue-100/50 hover:shadow-xl transition-all duration-300 hover:from-blue-500/15 hover:to-indigo-500/15">
            <LiveMatches />
          </div>
          
          {/* Feed Posts */}
          {isLoadingPosts ? (
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg mb-4 overflow-hidden p-4 border border-blue-100/50">
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
          ) : feedPosts && Array.isArray(feedPosts) && feedPosts.length > 0 ? (
            <>
              {feedPosts.map((post: any) => (
                <div key={post.id || Math.random()} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg mb-4 border border-blue-100/50 hover:shadow-xl transition-shadow duration-300">
                  <Post post={post} currentUserId={userId} />
                </div>
              ))}
              
              <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-sky-100 rounded-xl shadow-lg p-4 text-center border border-blue-200/50">
                <Button 
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
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
            <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-sky-100 rounded-xl shadow-lg p-8 text-center border border-blue-200/50">
              <h3 className="text-lg font-medium text-gray-700">No posts in your feed yet</h3>
              <p className="text-gray-600 mt-2">Connect with more athletes or create your first post to get started!</p>
            </div>
          )}
        </div>
        
        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
}
