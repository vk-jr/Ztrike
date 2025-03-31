import { useState } from "react";
import { Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal, Heart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface PostProps {
  post: any;
  currentUserId: number;
}

export default function Post({ post, currentUserId }: PostProps) {
  const [isLiked, setIsLiked] = useState(post.likedByUser);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  
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
      setLikeCount(prev => prev + 1);
      queryClient.invalidateQueries({ queryKey: [`/api/feed?userId=${currentUserId}`] });
    }
  });

  const handleLike = () => {
    if (!isLiked) {
      likeMutation.mutate();
    }
  };

  if (!post || !post.user) {
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
          <Link href={`/profile/${post.user.id}`}>
            <img 
              className="h-12 w-12 rounded-full object-cover cursor-pointer" 
              src={post.user.avatar} 
              alt={post.user.fullName}
            />
          </Link>
          <div className="ml-3">
            <Link href={`/profile/${post.user.id}`}>
              <h4 className="font-medium cursor-pointer">{post.user.fullName}</h4>
            </Link>
            <div className="flex items-center text-sm text-neutral-400">
              <span>{post.user.sport ? `${post.user.sport} Player` : 'Athlete'}</span>
              <span className="mx-1">•</span>
              <span>{formatPostDate(post.createdAt)}</span>
            </div>
          </div>
          <button className="ml-auto text-neutral-400 hover:text-neutral-500">
            <MoreHorizontal className="h-5 w-5" />
          </button>
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
        <button className="flex-1 flex items-center justify-center text-neutral-400 hover:text-primary transition-colors py-1 text-sm font-medium">
          <MessageSquare className="h-5 w-5 mr-1" />
          <span>Comment</span>
        </button>
        <button className="flex-1 flex items-center justify-center text-neutral-400 hover:text-primary transition-colors py-1 text-sm font-medium">
          <Share2 className="h-5 w-5 mr-1" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}
