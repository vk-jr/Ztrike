import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { 
  Bell, 
  Trophy, 
  UserPlus, 
  MessageSquare,
  Heart,
  Activity,
  Calendar,
  Settings,
  CheckCircle2
} from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "@/App";

export default function Notifications() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  // Get user ID from AuthContext instead of hardcoded value
  const { user: currentUser } = useContext(AuthContext);
  const userId = currentUser?.id || 0;

  const { data: liveMatches, isLoading: isLoadingLiveMatches } = useQuery({
    queryKey: ['/api/matches/live'],
  });

  // Fake notification data until we set up a real notifications endpoint
  const matchNotifications = liveMatches?.map((match: any) => ({
    id: `match-${match.id}`,
    type: 'match',
    title: `${match.team1} vs ${match.team2} is live now!`,
    description: `Watch the ${match.leagueId === 1 ? 'NBA' : match.leagueId === 3 ? 'Premier League' : 'UFC'} match live.`,
    time: new Date().toISOString(),
    read: false,
    match: match
  })) || [];

  const sampleNotifications = [
    {
      id: '1',
      type: 'connection',
      title: 'Serena Williams accepted your connection request',
      description: 'You are now connected with Serena Williams',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      read: false,
      user: {
        id: 2,
        fullName: 'Serena Williams',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
      }
    },
    {
      id: '2',
      type: 'like',
      title: 'Lebron James liked your post',
      description: 'Your post "Training day! Working on my jump shot..." received a like',
      time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      read: true,
      user: {
        id: 3,
        fullName: 'Lebron James',
        avatar: 'https://images.unsplash.com/photo-1543637005-4d639a4e16de?auto=format&fit=crop&q=80&w=100&h=100'
      },
      post: {
        id: 1,
        content: 'Training day! Working on my jump shot...'
      }
    },
    {
      id: '3',
      type: 'message',
      title: 'New message from Lebron James',
      description: 'Hey Michael, are you joining the charity event next week?',
      time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      read: false,
      user: {
        id: 3,
        fullName: 'Lebron James',
        avatar: 'https://images.unsplash.com/photo-1543637005-4d639a4e16de?auto=format&fit=crop&q=80&w=100&h=100'
      }
    },
    {
      id: '4',
      type: 'reminder',
      title: 'Warriors vs Bulls game starting soon',
      description: 'The NBA game you set a reminder for starts in 1 hour',
      time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      read: true,
      match: {
        id: 3,
        team1: 'Warriors',
        team2: 'Bulls',
        leagueId: 1
      }
    }
  ];

  const allNotifications = [...matchNotifications, ...sampleNotifications];
  
  const filteredNotifications = filter === 'all' 
    ? allNotifications
    : allNotifications.filter(n => !n.read);

  const sortedNotifications = filteredNotifications.sort((a, b) => 
    new Date(b.time).getTime() - new Date(a.time).getTime()
  );

  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  const getIconForNotificationType = (type: string) => {
    switch (type) {
      case 'match':
        return <Trophy className="h-5 w-5 text-primary" />;
      case 'connection':
        return <UserPlus className="h-5 w-5 text-green-500" />;
      case 'like':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'reminder':
        return <Calendar className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-neutral-400" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Card className="shadow-md border border-neutral-100 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-neutral-100">
          <CardTitle className="text-2xl font-bold flex items-center text-primary">
            <Bell className="h-6 w-6 mr-2 text-primary" /> Notifications
          </CardTitle>
          <CardDescription className="text-neutral-600">
            Stay updated with match alerts, connection requests, and more
          </CardDescription>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mt-4">
            <Tabs 
              defaultValue="all" 
              value={filter} 
              onValueChange={(value) => setFilter(value as 'all' | 'unread')}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid w-full sm:w-[200px] grid-cols-2 bg-neutral-100/80">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">All</TabsTrigger>
                <TabsTrigger value="unread" className="data-[state=active]:bg-primary data-[state=active]:text-white">Unread</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="sm" className="flex items-center border-neutral-200">
              <Settings className="h-4 w-4 mr-2" /> Notification Settings
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoadingLiveMatches ? (
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="p-4 border-b border-neutral-200">
                <div className="flex">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="ml-4 flex-1">
                    <Skeleton className="h-5 w-3/5" />
                    <Skeleton className="h-4 w-4/5 mt-1" />
                    <Skeleton className="h-3 w-20 mt-2" />
                  </div>
                </div>
              </div>
            ))
          ) : sortedNotifications.length > 0 ? (
            <div>
              {sortedNotifications.map((notification) => {
                // Determine background color based on notification type
                let bgColor = !notification.read ? 'bg-blue-50' : 'hover:bg-neutral-50';
                let borderColor = 'border-neutral-200';
                let iconBgColor = 'bg-primary/10';
                
                // Customize styling based on notification type
                switch(notification.type) {
                  case 'match':
                    bgColor = !notification.read ? 'bg-red-50' : 'hover:bg-red-50/30';
                    borderColor = !notification.read ? 'border-red-100' : 'border-neutral-200';
                    iconBgColor = 'bg-red-100';
                    break;
                  case 'connection':
                    bgColor = !notification.read ? 'bg-green-50' : 'hover:bg-green-50/30';
                    borderColor = !notification.read ? 'border-green-100' : 'border-neutral-200';
                    break;
                  case 'like':
                    bgColor = !notification.read ? 'bg-pink-50' : 'hover:bg-pink-50/30';
                    borderColor = !notification.read ? 'border-pink-100' : 'border-neutral-200';
                    break;
                  case 'message':
                    bgColor = !notification.read ? 'bg-blue-50' : 'hover:bg-blue-50/30';
                    borderColor = !notification.read ? 'border-blue-100' : 'border-neutral-200';
                    break;
                  case 'reminder':
                    bgColor = !notification.read ? 'bg-orange-50' : 'hover:bg-orange-50/30';
                    borderColor = !notification.read ? 'border-orange-100' : 'border-neutral-200';
                    iconBgColor = 'bg-orange-100';
                    break;
                }
                
                return (
                  <div 
                    key={notification.id}
                    className={`p-4 border-b ${borderColor} ${bgColor} transition-colors`}
                  >
                    <div className="flex">
                      <div className="flex-shrink-0">
                        {notification.type === 'match' || notification.type === 'reminder' ? (
                          <div className={`h-12 w-12 rounded-full ${iconBgColor} flex items-center justify-center shadow-sm border border-white`}>
                            {getIconForNotificationType(notification.type)}
                          </div>
                        ) : (
                          <div className="relative">
                            <img 
                              src={(notification as any).user?.avatar || 'https://via.placeholder.com/40'} 
                              alt="User" 
                              className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                            {notification.type === 'connection' && (
                              <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1 shadow-sm border border-white">
                                <UserPlus className="h-3 w-3" />
                              </div>
                            )}
                            {notification.type === 'like' && (
                              <div className="absolute -bottom-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-sm border border-white">
                                <Heart className="h-3 w-3" />
                              </div>
                            )}
                            {notification.type === 'message' && (
                              <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1 shadow-sm border border-white">
                                <MessageSquare className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <p className={`${!notification.read ? 'font-semibold' : 'font-medium'} text-neutral-800`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="flex-shrink-0 ml-2 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{notification.description}</p>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-xs font-medium px-2 py-1 bg-neutral-100 rounded-full text-neutral-500">
                            {formatNotificationTime(notification.time)}
                          </span>
                          {notification.type === 'match' && (
                            <Button size="sm" variant="acrylic" className="text-xs">
                              Watch Now
                            </Button>
                          )}
                          {notification.type === 'message' && (
                            <Link href="/messages">
                              <Button size="sm" variant="acrylic" className="text-xs">
                                Reply
                              </Button>
                            </Link>
                          )}
                          {notification.type === 'connection' && (
                            <Button size="sm" variant="outline" className="text-xs border-green-200 text-green-600 bg-green-50">
                              View Profile
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <div className="p-6 text-center border-t border-neutral-200 bg-neutral-50">
                <Button variant="outline" className="text-primary bg-white border-primary/20 shadow-sm">
                  Mark All as Read <CheckCircle2 className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="bg-primary/10 p-6 rounded-full mx-auto w-24 h-24 flex items-center justify-center shadow-inner border border-primary/20">
                <Activity className="h-12 w-12 text-primary/60" />
              </div>
              <h3 className="mt-6 font-semibold text-xl text-neutral-800">No notifications</h3>
              <p className="text-neutral-600 text-sm mt-2 max-w-md mx-auto px-4">
                {filter === 'unread' 
                  ? "You don't have any unread notifications" 
                  : "Follow leagues and connect with athletes to get notifications"}
              </p>
              {filter === 'unread' && (
                <Button 
                  variant="outline" 
                  className="mt-6 border-primary/20 text-primary bg-primary/5 shadow-sm"
                  onClick={() => setFilter('all')}
                >
                  View All Notifications
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
