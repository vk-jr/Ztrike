import { useState, useRef } from "react";
import { Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal, Heart, X, Flag, Bookmark, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostProps {
  post: any;
  currentUserId: number;
}

export default function Post({ post, currentUserId }: PostProps) {
  const [isLiked, setIsLiked] = useState(post?.likedByUser || false);
  const [likeCount, setLikeCount] = useState(post?.likeCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [isPostSaved, setIsPostSaved] = useState(false);
  
  const queryClient = useQueryClient();
  
  const likeMutation = useMutation({
    mutationFn: () => {
      return apiRequest("POST", "/api/likes", { 
        userId: currentUserId, 
        postId: post.id 
      });
    },
    onSuccess: () => {
      setIsLiked(true);
      setLikeCount((prev: number) => prev + 1);
      queryClient.invalidateQueries({ queryKey: [`/api/feed?userId=${currentUserId}`] });
    }
  });

  const handleLike = () => {
    if (!isLiked) {
      likeMutation.mutate();
    }
  };
  
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      // In a real app, we would submit the comment to the server
      setComment("");
      // For now, we'll just show a simulated success
      alert("Comment submitted! This would be saved to the database in a real app.");
    }
  };
  
  const toggleSavePost = () => {
    setIsPostSaved(!isPostSaved);
    // In a real app, we would save the post to the user's saved posts
  };

  // Show loading skeleton if post is not available
  if (!post) {
    return (
      <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden p-4">
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
    );
  }

  const formatPostDate = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      return "recently";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
      {/* Post Header */}
      <div className="p-4 pb-2">
        <div className="flex items-center">
          <Link href={`/profile/${post.userId}`}>
            <img 
              className="h-12 w-12 rounded-full object-cover cursor-pointer" 
              src="https://via.placeholder.com/100"
              alt={`User ${post.userId}`}
            />
          </Link>
          <div className="ml-3">
            <Link href={`/profile/${post.userId}`}>
              <h4 className="font-medium cursor-pointer">{post.authorName || `User ${post.userId}`}</h4>
            </Link>
            <div className="flex items-center text-sm text-neutral-400">
              <span>Athlete</span>
              <span className="mx-1">•</span>
              <span>{formatPostDate(post.createdAt)}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-auto text-neutral-400 hover:text-neutral-500">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={toggleSavePost} className="cursor-pointer">
                <Bookmark className="h-4 w-4 mr-2" />
                {isPostSaved ? "Unsave post" : "Save post"}
              </DropdownMenuItem>
              {post.userId === currentUserId && (
                <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete post
                </DropdownMenuItem>
              )}
              {post.userId !== currentUserId && (
                <DropdownMenuItem className="cursor-pointer text-amber-500 focus:text-amber-500">
                  <Flag className="h-4 w-4 mr-2" />
                  Report post
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="mt-3">
          <p className="text-neutral-600 text-sm">
            {post.content}
            {post.content.includes('#') && (
              post.content.split(' ').map((word: string, i: number) => 
                word.startsWith('#') ? (
                  <Link key={i} href={`/hashtag/${word.substring(1)}`} className="text-primary">
                    {` ${word} `}
                  </Link>
                ) : null
              )
            )}
          </p>
        </div>
      </div>
      
      {/* Post Media */}
      {post.mediaUrl && (
        post.mediaType === 'video' ? (
          <div className="aspect-video bg-neutral-100 relative">
            <video 
              controls
              className="w-full h-full object-cover"
              poster={post.mediaUrl}
            >
              <source src="#" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : post.mediaType === 'image' ? (
          <div className="aspect-video bg-neutral-100 relative">
            <img 
              src={post.mediaUrl} 
              alt="Post media" 
              className="w-full h-full object-cover"
            />
          </div>
        ) : null
      )}
      
      {/* Post Stats */}
      <div className="px-4 py-2 flex items-center text-sm text-neutral-400 border-b border-neutral-200">
        <div className="flex items-center">
          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-white">
            <ThumbsUp className="h-3 w-3" />
          </span>
          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white -ml-1">
            <Heart className="h-3 w-3" />
          </span>
          <span className="ml-1">{likeCount}</span>
        </div>
        <div className="ml-auto">
          <span>{post.commentCount || 0} comments</span>
          <span className="mx-1">•</span>
          <span>{post.shareCount || 0} shares</span>
        </div>
      </div>
      
      {/* Post Actions */}
      <div className="px-4 py-2 flex">
        <button 
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center py-1 text-sm font-medium ${isLiked ? 'text-primary' : 'text-neutral-400 hover:text-primary'} transition-colors`}
          disabled={likeMutation.isPending || isLiked}
        >
          <ThumbsUp className="h-5 w-5 mr-1" />
          <span>Like</span>
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className={`flex-1 flex items-center justify-center py-1 text-sm font-medium ${showComments ? 'text-primary' : 'text-neutral-400 hover:text-primary'} transition-colors`}
        >
          <MessageSquare className="h-5 w-5 mr-1" />
          <span>Comment</span>
        </button>
        <button className="flex-1 flex items-center justify-center text-neutral-400 hover:text-primary transition-colors py-1 text-sm font-medium">
          <Share2 className="h-5 w-5 mr-1" />
          <span>Share</span>
        </button>
      </div>
      
      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-neutral-100 p-4">
          {/* Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex items-start mb-4">
            <img 
              src={post.currentUserAvatar || "https://via.placeholder.com/40"} 
              alt="Your avatar" 
              className="w-8 h-8 rounded-full mr-2 flex-shrink-0 object-cover" 
            />
            <div className="flex-1 bg-neutral-50 rounded-2xl overflow-hidden flex items-center">
              <input
                type="text"
                placeholder="Write a comment..."
                className="flex-1 py-2 px-3 bg-transparent text-sm focus:outline-none"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={!comment.trim()}
                className="bg-primary text-white rounded-full p-1 mr-2 disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </form>
          
          {/* Comments List */}
          {post.comments && Array.isArray(post.comments) && post.comments.length > 0 ? (
            <div className="space-y-3">
              {post.comments.map((comment: any) => (
                <div key={comment.id} className="flex items-start">
                  <img 
                    src="https://via.placeholder.com/40"
                    alt="Commenter" 
                    className="w-8 h-8 rounded-full mr-2 flex-shrink-0 object-cover" 
                  />
                  <div>
                    <div className="bg-neutral-50 inline-block py-2 px-3 rounded-2xl text-sm">
                      <a href={`/profile/${comment.userId}`} className="font-medium text-neutral-900 mr-1">
                        Athlete
                      </a>
                      {comment.content}
                    </div>
                    <div className="flex items-center space-x-3 mt-1 text-xs text-neutral-500 pl-3">
                      <button className="hover:text-neutral-900">Like</button>
                      <button className="hover:text-neutral-900">Reply</button>
                      <span>{formatPostDate(comment.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-neutral-400 text-sm py-2">
              No comments yet. Be the first to comment!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
