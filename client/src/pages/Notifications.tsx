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

export default function Notifications() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const userId = 1; // Mock user ID - in a real app, this would come from authentication

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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center">
            <Bell className="h-6 w-6 mr-2 text-primary" /> Notifications
          </CardTitle>
          <CardDescription className="text-neutral-400">
            Stay updated with match alerts, connection requests, and more
          </CardDescription>
          <div className="flex justify-between items-center mt-4">
            <Tabs 
              defaultValue="all" 
              value={filter} 
              onValueChange={(value) => setFilter(value as 'all' | 'unread')}
              className="w-full"
            >
              <TabsList className="grid w-[200px] grid-cols-2">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="sm" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" /> Settings
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoadingLiveMatches ? (
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="p-4 border-b border-neutral-200">
                <div className="flex">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="ml-3 flex-1">
                    <Skeleton className="h-5 w-3/5" />
                    <Skeleton className="h-4 w-4/5 mt-1" />
                    <Skeleton className="h-3 w-20 mt-2" />
                  </div>
                </div>
              </div>
            ))
          ) : sortedNotifications.length > 0 ? (
            <div>
              {sortedNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 border-b border-neutral-200 ${!notification.read ? 'bg-blue-50' : 'hover:bg-neutral-50'} transition-colors`}
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {notification.type === 'match' || notification.type === 'reminder' ? (
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {getIconForNotificationType(notification.type)}
                        </div>
                      ) : (
                        <img 
                          src={(notification as any).user?.avatar || 'https://via.placeholder.com/40'} 
                          alt="User" 
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between">
                        <p className={`${!notification.read ? 'font-semibold' : 'font-medium'}`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="flex-shrink-0 ml-2 w-2 h-2 bg-primary rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-500 mt-0.5">{notification.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-neutral-400">{formatNotificationTime(notification.time)}</span>
                        {notification.type === 'match' && (
                          <Button size="sm" variant="secondary" className="text-xs">
                            Watch Now
                          </Button>
                        )}
                        {notification.type === 'message' && (
                          <Link href="/messages">
                            <Button size="sm" variant="secondary" className="text-xs">
                              Reply
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="p-4 text-center">
                <Button variant="outline" className="text-neutral-500">
                  Mark All as Read <CheckCircle2 className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="bg-neutral-100 p-6 rounded-full mx-auto w-20 h-20 flex items-center justify-center">
                <Activity className="h-10 w-10 text-neutral-400" />
              </div>
              <h3 className="mt-4 font-medium text-lg">No notifications</h3>
              <p className="text-neutral-400 text-sm mt-1 max-w-md mx-auto">
                {filter === 'unread' 
                  ? "You don't have any unread notifications" 
                  : "Follow leagues and connect with athletes to get notifications"}
              </p>
              {filter === 'unread' && (
                <Button 
                  variant="outline" 
                  className="mt-4"
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
