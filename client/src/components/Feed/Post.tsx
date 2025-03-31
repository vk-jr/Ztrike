import React, { useState, useRef } from "react";
import { Link } from "wouter";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
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
  
  // Fetch current user data
  const { data: user } = useQuery({
    queryKey: [`/api/users/${currentUserId}`],
  });
  
  // Fetch comments when comment section is expanded
  const { data: comments = [] } = useQuery({
    queryKey: [`/api/posts/${post.id}/comments`],
    enabled: showComments,
  });
  
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
  
  const commentMutation = useMutation({
    mutationFn: (commentText: string) => {
      return apiRequest("POST", "/api/comments", {
        userId: currentUserId,
        postId: post.id,
        content: commentText
      });
    },
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${post.id}/comments`] });
      queryClient.invalidateQueries({ queryKey: [`/api/feed?userId=${currentUserId}`] });
    }
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      commentMutation.mutate(comment);
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
      <div className="p-4">
        <div className="flex items-center">
          <Link href={`/profile/${post.userId}`}>
            <img 
              className="h-10 w-10 rounded-full object-cover cursor-pointer" 
              src={post.user?.avatar || "https://via.placeholder.com/100"}
              alt={post.user?.fullName || `User ${post.userId}`}
            />
          </Link>
          <div className="ml-3">
            <Link href={`/profile/${post.userId}`}>
              <h4 className="text-base font-medium cursor-pointer">{post.user?.fullName || `User ${post.userId}`}</h4>
            </Link>
            <div className="flex items-center text-sm text-gray-500">
              <span>{post.user?.sport || "Athlete"}</span>
              <span className="mx-1">•</span>
              <span>about {formatPostDate(post.createdAt)}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-auto text-gray-400 hover:text-gray-500">
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
        
        {/* Post Content */}
        <div className="mt-3 text-base">
          <p>
            {post.content.split(' ').map((word: string, i: number) => (
              <span key={i}>
                {word.startsWith('#') ? (
                  <Link href={`/hashtag/${word.substring(1)}`} className="text-blue-500 hover:underline">
                    {word}
                  </Link>
                ) : (
                  word
                )}
                {i < post.content.split(' ').length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>
        </div>
      </div>
      
      {/* Post Media */}
      {post.mediaUrl ? (
        <img 
          src={post.mediaUrl} 
          alt="Post media" 
          className="w-full h-auto object-cover border-t border-b border-gray-100"
        />
      ) : (
        <img 
          src="https://via.placeholder.com/800x400"
          alt="Post media" 
          className="w-full h-auto object-cover border-t border-b border-gray-100"
        />
      )}
      
      {/* Post Stats/Metrics */}
      <div className="px-4 py-2 flex items-center text-sm text-gray-500 border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex -space-x-1">
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-500 text-white border border-white z-10">
              <ThumbsUp className="h-3 w-3" />
            </span>
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white border border-white">
              <Heart className="h-3 w-3" />
            </span>
          </div>
          <span className="ml-1.5">{likeCount}</span>
        </div>
        <div className="ml-auto">
          <span>{post.commentCount || 0} comments</span>
          <span className="mx-1">•</span>
          <span>{post.shareCount || 0} shares</span>
        </div>
      </div>
      
      {/* Post Actions */}
      <div className="flex border-b border-gray-200">
        <button 
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center py-2.5 text-sm font-medium ${isLiked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'} hover:bg-gray-50 transition-colors`}
          disabled={likeMutation.isPending || isLiked}
        >
          <ThumbsUp className="h-5 w-5 mr-1.5" />
          <span>Like</span>
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className={`flex-1 flex items-center justify-center py-2.5 text-sm font-medium ${showComments ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'} hover:bg-gray-50 transition-colors`}
        >
          <MessageSquare className="h-5 w-5 mr-1.5" />
          <span>Comment</span>
        </button>
        <button className="flex-1 flex items-center justify-center py-2.5 text-sm font-medium text-gray-500 hover:text-blue-500 hover:bg-gray-50 transition-colors">
          <Share2 className="h-5 w-5 mr-1.5" />
          <span>Share</span>
        </button>
      </div>
      
      {/* Comments Section */}
      {showComments && (
        <div className="p-4">
          {/* Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex items-start mb-4">
            <img 
              src={user?.avatar || "https://via.placeholder.com/40"}
              alt={user?.fullName || "Your avatar"} 
              className="w-8 h-8 rounded-full mr-2 flex-shrink-0 object-cover" 
            />
            <div className="flex-1 bg-gray-100 rounded-full overflow-hidden flex items-center">
              <input
                type="text"
                placeholder="Write a comment..."
                className="flex-1 py-2 px-4 bg-transparent text-sm focus:outline-none"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={!comment.trim() || commentMutation.isPending}
                className="bg-blue-500 text-white rounded-full p-1 mr-2 disabled:opacity-50"
              >
                {commentMutation.isPending ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                )}
              </button>
            </div>
          </form>
          
          {/* Comments List */}
          {comments && Array.isArray(comments) && comments.length > 0 ? (
            <div className="space-y-3">
              {comments.map((comment: any) => (
                <div key={comment.id || Math.random()} className="flex items-start">
                  <img 
                    src={comment.user?.avatar || "https://via.placeholder.com/40"}
                    alt={comment.user?.fullName || "Commenter"} 
                    className="w-8 h-8 rounded-full mr-2 flex-shrink-0 object-cover" 
                  />
                  <div>
                    <div className="bg-gray-100 inline-block py-2 px-3 rounded-2xl text-sm">
                      <Link href={`/profile/${comment.userId}`} className="font-medium text-gray-900 mr-1">
                        {comment.user?.fullName || "Athlete"}
                      </Link>
                      {comment.content}
                    </div>
                    <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500 pl-3">
                      <button className="hover:text-gray-900">Like</button>
                      <button className="hover:text-gray-900">Reply</button>
                      <span>{formatPostDate(comment.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 text-sm py-2">
              No comments yet. Be the first to comment!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
