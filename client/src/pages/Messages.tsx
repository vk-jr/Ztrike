import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Send, 
  MessageSquare, 
  MoreHorizontal, 
  Phone, 
  Video,
  ChevronRight,
  User,
  Check,
  Clock
} from "lucide-react";

export default function Messages() {
  const [searchQuery, setSearchQuery] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [activeContactId, setActiveContactId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Mock user ID - in a real app, this would come from authentication
  const userId = 1;

  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: [`/api/messages?userId=${userId}`],
  });

  const { data: conversation, isLoading: isLoadingConversation } = useQuery({
    queryKey: activeContactId ? [`/api/messages/conversation?userId1=${userId}&userId2=${activeContactId}`] : null,
    enabled: !!activeContactId,
  });

  // Get unique contacts from messages
  const contacts = messages 
    ? Array.from(new Set(
        messages.map((msg: any) => 
          msg.senderId === userId ? msg.receiverId : msg.senderId
        )
      )).map(contactId => {
        const msg = messages.find((m: any) => 
          m.senderId === contactId || m.receiverId === contactId
        );
        return msg.senderId === contactId ? msg.sender : msg.receiver;
      })
    : [];

  const filteredContacts = contacts.filter((contact: any) => 
    contact?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeContact = contacts.find((contact: any) => contact.id === activeContactId);

  const sendMessageMutation = useMutation({
    mutationFn: (messageData: { senderId: number; receiverId: number; content: string }) => {
      return apiRequest("POST", "/api/messages", messageData);
    },
    onSuccess: () => {
      setMessageContent("");
      queryClient.invalidateQueries({ queryKey: [`/api/messages?userId=${userId}`] });
      queryClient.invalidateQueries({ 
        queryKey: [`/api/messages/conversation?userId1=${userId}&userId2=${activeContactId}`] 
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!messageContent.trim() || !activeContactId) return;

    sendMessageMutation.mutate({
      senderId: userId,
      receiverId: activeContactId,
      content: messageContent,
    });
  };

  const getLastMessage = (contactId: number) => {
    if (!messages) return null;
    
    const contactMessages = messages.filter((msg: any) => 
      (msg.senderId === contactId && msg.receiverId === userId) || 
      (msg.senderId === userId && msg.receiverId === contactId)
    );
    
    if (contactMessages.length === 0) return null;
    
    // Sort by date and get the most recent
    return contactMessages.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  };

  const getMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {/* Contacts List */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-primary" /> Messages
                </div>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                <Input
                  placeholder="Search messages..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto">
              {isLoadingMessages ? (
                Array(5).fill(0).map((_, index) => (
                  <div key={index} className="p-3 border-b border-neutral-200 last:border-0">
                    <div className="flex items-center">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="ml-3 flex-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-40 mt-1" />
                      </div>
                      <Skeleton className="h-4 w-8" />
                    </div>
                  </div>
                ))
              ) : filteredContacts && filteredContacts.length > 0 ? (
                filteredContacts.map((contact: any) => {
                  const lastMessage = getLastMessage(contact.id);
                  const isUnread = lastMessage && lastMessage.senderId !== userId && !lastMessage.read;
                  
                  return (
                    <div 
                      key={contact.id} 
                      className={`p-3 border-b border-neutral-200 last:border-0 hover:bg-neutral-50 cursor-pointer ${activeContactId === contact.id ? 'bg-neutral-50' : ''} ${isUnread ? 'bg-blue-50 hover:bg-blue-50' : ''}`}
                      onClick={() => setActiveContactId(contact.id)}
                    >
                      <div className="flex items-center">
                        <div className="relative">
                          <img 
                            src={contact.avatar} 
                            alt={contact.fullName} 
                            className="h-12 w-12 rounded-full object-cover"
                          />
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h4 className={`font-medium truncate ${isUnread ? 'font-semibold' : ''}`}>{contact.fullName}</h4>
                            <span className="text-xs text-neutral-400 whitespace-nowrap ml-2">
                              {lastMessage && getMessageTime(lastMessage.createdAt)}
                            </span>
                          </div>
                          <p className={`text-sm truncate ${isUnread ? 'text-neutral-700 font-medium' : 'text-neutral-400'}`}>
                            {lastMessage?.content || "No messages yet"}
                          </p>
                        </div>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-primary ml-2"></span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-6 text-center h-full flex flex-col justify-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-neutral-300" />
                  <h3 className="mt-2 font-medium">No messages</h3>
                  <p className="text-sm text-neutral-400 mt-1 px-4">
                    {searchQuery ? `No conversations matching "${searchQuery}"` : "Start connecting with other athletes to message them"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Conversation */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            {activeContactId && activeContact ? (
              <>
                {/* Chat Header */}
                <CardHeader className="py-3 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img 
                        src={activeContact.avatar} 
                        alt={activeContact.fullName} 
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="ml-3 flex-1">
                        <h4 className="font-medium">{activeContact.fullName}</h4>
                        <p className="text-xs text-green-500">Online</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {isLoadingConversation ? (
                    Array(4).fill(0).map((_, index) => (
                      <div key={index} className={`flex ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] ${index % 2 === 0 ? 'bg-primary text-white' : 'bg-neutral-100'} rounded-lg px-4 py-2`}>
                          <Skeleton className={`h-4 w-40 ${index % 2 === 0 ? 'bg-white/20' : 'bg-neutral-200'}`} />
                          <Skeleton className={`h-4 w-24 mt-1 ${index % 2 === 0 ? 'bg-white/20' : 'bg-neutral-200'}`} />
                        </div>
                      </div>
                    ))
                  ) : conversation && conversation.length > 0 ? (
                    <>
                      {conversation.map((message: any, index: number) => {
                        const isMyMessage = message.senderId === userId;
                        const showDate = index === 0 || 
                          getMessageDate(message.createdAt) !== getMessageDate(conversation[index - 1].createdAt);
                        
                        return (
                          <div key={message.id}>
                            {showDate && (
                              <div className="text-center my-4">
                                <span className="px-4 py-1 bg-neutral-100 rounded-full text-neutral-500 text-xs">
                                  {getMessageDate(message.createdAt)}
                                </span>
                              </div>
                            )}
                            <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                              {!isMyMessage && (
                                <img 
                                  src={activeContact.avatar} 
                                  alt={activeContact.fullName} 
                                  className="h-8 w-8 rounded-full object-cover mr-2 self-end"
                                />
                              )}
                              <div 
                                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                  isMyMessage 
                                    ? 'bg-primary text-white rounded-tr-none' 
                                    : 'bg-neutral-100 rounded-tl-none'
                                }`}
                              >
                                <p>{message.content}</p>
                                <div className={`text-xs mt-1 flex items-center ${isMyMessage ? 'text-white/70 justify-end' : 'text-neutral-400'}`}>
                                  {getMessageTime(message.createdAt)}
                                  {isMyMessage && (
                                    <Check className="h-3 w-3 ml-1" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <MessageSquare className="h-12 w-12 text-neutral-300" />
                      <h3 className="mt-2 font-medium">No messages yet</h3>
                      <p className="text-sm text-neutral-400 mt-1 max-w-xs">
                        Start the conversation with {activeContact.fullName}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Message Input */}
                <div className="p-3 border-t">
                  <div className="flex space-x-2">
                    <Textarea
                      placeholder={`Message ${activeContact.fullName}...`}
                      className="min-h-[60px] resize-none"
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      className="h-auto"
                      onClick={handleSendMessage}
                      disabled={!messageContent.trim() || sendMessageMutation.isPending}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="bg-neutral-100 p-6 rounded-full">
                  <MessageSquare className="h-12 w-12 text-neutral-400" />
                </div>
                <h2 className="text-xl font-semibold mt-4">Your Messages</h2>
                <p className="text-neutral-400 mt-2 max-w-md">
                  Select a conversation from the list or start a new conversation by connecting with athletes
                </p>
                <Button className="mt-4" onClick={() => window.location.href = '/network'}>
                  Find Connections <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
