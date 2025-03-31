import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Image, Video, Calendar, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CreatePostProps {
  userId: number;
  userAvatar: string;
}

export default function CreatePost({ userId, userAvatar }: CreatePostProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video" | "">("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const createPostMutation = useMutation({
    mutationFn: (postData: { userId: number; content: string; mediaUrl?: string; mediaType?: string }) => {
      return apiRequest("POST", "/api/posts", postData);
    },
    onSuccess: () => {
      setContent("");
      setMediaUrl("");
      setMediaType("");
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: [`/api/feed?userId=${userId}`] });
      toast({
        title: "Success!",
        description: "Your post has been published.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating post:", error);
    },
  });

  const handleCreatePost = () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Post content cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    const postData = {
      userId,
      content,
      ...(mediaUrl && mediaType ? { mediaUrl, mediaType } : {})
    };

    createPostMutation.mutate(postData);
  };

  const handleAddMedia = (type: "image" | "video") => {
    // In a real implementation, this would open a file picker or media gallery
    // For this demo, we'll use sample URLs
    if (type === "image") {
      setMediaUrl("https://images.unsplash.com/photo-1595435742656-4e610d56d8e1?auto=format&fit=crop&q=80&w=1200&h=675");
      setMediaType("image");
    } else if (type === "video") {
      setMediaUrl("https://images.unsplash.com/photo-1518113883665-a043e23f2a15?auto=format&fit=crop&q=80&w=1200&h=675");
      setMediaType("video");
    }
  };

  const clearMedia = () => {
    setMediaUrl("");
    setMediaType("");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-center">
        <img 
          className="h-10 w-10 rounded-full object-cover" 
          src={userAvatar}
          alt="User profile"
        />
        <div className="ml-3 flex-1">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button 
                className="w-full text-left px-4 py-2 bg-neutral-100 rounded-full text-neutral-400 text-sm hover:bg-neutral-200 transition-colors"
              >
                Share your training or match highlights...
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Post</DialogTitle>
              </DialogHeader>
              
              <div className="mt-4">
                <Textarea
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[100px] resize-none p-3"
                />
                
                {mediaUrl && (
                  <div className="relative mt-3 rounded-md overflow-hidden">
                    {mediaType === "image" ? (
                      <img src={mediaUrl} alt="Post preview" className="w-full h-auto max-h-[300px] object-cover" />
                    ) : (
                      <div className="w-full h-[200px] bg-neutral-800 flex items-center justify-center">
                        <Video className="h-12 w-12 text-neutral-300" />
                      </div>
                    )}
                    <button 
                      onClick={clearMedia}
                      className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                <div className="flex mt-4 justify-between">
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleAddMedia("image")}
                      className="flex items-center"
                    >
                      <Image className="h-4 w-4 mr-1" /> Photo
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleAddMedia("video")}
                      className="flex items-center"
                    >
                      <Video className="h-4 w-4 mr-1" /> Video
                    </Button>
                  </div>
                  <Button 
                    onClick={handleCreatePost} 
                    disabled={createPostMutation.isPending || !content.trim()}
                  >
                    {createPostMutation.isPending ? "Posting..." : "Post"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="flex mt-3 pt-2 border-t border-neutral-200">
        <button 
          onClick={() => {
            setIsDialogOpen(true);
            setTimeout(() => handleAddMedia("image"), 100);
          }}
          className="flex-1 flex items-center justify-center text-neutral-400 hover:text-primary transition-colors py-1"
        >
          <Image className="h-5 w-5 mr-1" />
          <span className="text-sm">Photo</span>
        </button>
        <button 
          onClick={() => {
            setIsDialogOpen(true);
            setTimeout(() => handleAddMedia("video"), 100);
          }}
          className="flex-1 flex items-center justify-center text-neutral-400 hover:text-primary transition-colors py-1"
        >
          <Video className="h-5 w-5 mr-1" />
          <span className="text-sm">Video</span>
        </button>
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="flex-1 flex items-center justify-center text-neutral-400 hover:text-primary transition-colors py-1"
        >
          <Calendar className="h-5 w-5 mr-1" />
          <span className="text-sm">Event</span>
        </button>
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="flex-1 flex items-center justify-center text-neutral-400 hover:text-primary transition-colors py-1"
        >
          <FileText className="h-5 w-5 mr-1" />
          <span className="text-sm">Article</span>
        </button>
      </div>
    </div>
  );
}
