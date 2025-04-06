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
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'image' ? 'image/*' : 'video/*';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setMediaUrl(reader.result as string);
          setMediaType(type);
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  const clearMedia = () => {
    setMediaUrl("");
    setMediaType("");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 card-blue">
      <div className="flex items-center">
        <img 
          className="h-10 w-10 rounded-full object-cover border border-blue-100" 
          src={userAvatar}
          alt="User profile"
        />
        <div className="ml-3 flex-1">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button 
                className="w-full text-left px-4 py-2 bg-blue-50 rounded-full text-blue-500 text-sm hover:bg-blue-100 transition-colors border border-blue-100 shadow-sm"
              >
                Share your training or match highlights...
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white border border-blue-100 shadow-lg">
              <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-t-lg border-b border-blue-100">
                <DialogTitle className="text-blue-600 font-semibold">Create Post</DialogTitle>
              </DialogHeader>
              
              <div className="p-4">
                <Textarea
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[100px] resize-none p-4 rounded-lg border border-blue-200 focus:border-blue-400 focus:ring focus:ring-blue-100 transition-all"
                />
                
                {mediaUrl && (
                  <div className="relative mt-4 rounded-lg overflow-hidden border border-blue-100 shadow-sm">
                    {mediaType === "image" ? (
                      <img src={mediaUrl} alt="Post preview" className="w-full h-auto max-h-[300px] object-cover" />
                    ) : (
                      <div className="w-full h-[200px] bg-blue-50 flex items-center justify-center">
                        <Video className="h-12 w-12 text-blue-400" />
                      </div>
                    )}
                    <button 
                      onClick={clearMedia}
                      className="absolute top-2 right-2 bg-blue-600/90 text-white p-1.5 rounded-full hover:bg-blue-700/90 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                <div className="flex mt-6 justify-between items-center">
                  <div className="flex space-x-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleAddMedia("image")}
                      className="flex items-center bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors px-4"
                    >
                      <Image className="h-4 w-4 mr-2" /> Photo
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleAddMedia("video")}
                      className="flex items-center bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors px-4"
                    >
                      <Video className="h-4 w-4 mr-2" /> Video
                    </Button>
                  </div>
                  <Button 
                    onClick={handleCreatePost} 
                    disabled={createPostMutation.isPending || !content.trim()}
                    className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 px-6 py-2 rounded-lg transition-colors"
                  >
                    {createPostMutation.isPending ? "Posting..." : "Post"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="flex mt-3 pt-2 border-t border-blue-100">
        <button 
          onClick={() => {
            setIsDialogOpen(true);
            setTimeout(() => handleAddMedia("image"), 100);
          }}
          className="flex-1 flex items-center justify-center text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors py-2 rounded-md hover-blue"
        >
          <Image className="h-5 w-5 mr-1" />
          <span className="text-sm font-medium">Photo</span>
        </button>
        <button 
          onClick={() => {
            setIsDialogOpen(true);
            setTimeout(() => handleAddMedia("video"), 100);
          }}
          className="flex-1 flex items-center justify-center text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors py-2 rounded-md hover-blue"
        >
          <Video className="h-5 w-5 mr-1" />
          <span className="text-sm font-medium">Video</span>
        </button>
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="flex-1 flex items-center justify-center text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors py-2 rounded-md hover-blue"
        >
          <Calendar className="h-5 w-5 mr-1" />
          <span className="text-sm font-medium">Event</span>
        </button>
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="flex-1 flex items-center justify-center text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors py-2 rounded-md hover-blue"
        >
          <FileText className="h-5 w-5 mr-1" />
          <span className="text-sm font-medium">Article</span>
        </button>
      </div>
    </div>
  );
}
