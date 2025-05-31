"use client";

import { Edit, Share2, Calendar, Trophy, Users, Eye, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  getUserProfile, 
  getUserTeams, 
  getUserLeagues, 
  getSuggestedUsers,
  createConnection 
} from "@/lib/db";
import type { UserProfile, Team, League } from "@/types/database";
import PostCreate from "@/components/posts/PostCreate";
import PostDisplay from "@/components/posts/PostDisplay";
import type { LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  value: number;
  Icon: LucideIcon;
}

function PeopleYouMayKnow({ userId }: { userId: string }) {
  const [suggestedUsers, setSuggestedUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connecting, setConnecting] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const loadSuggestedUsers = async () => {
      try {
        const users = await getSuggestedUsers(userId);
        setSuggestedUsers(users);
      } catch (error) {
        console.error('Error loading suggested users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSuggestedUsers();
  }, [userId]);

  const handleConnect = async (targetUserId: string) => {
    setConnecting(prev => ({ ...prev, [targetUserId]: true }));
    try {
      await createConnection(userId, targetUserId);
      // Remove the user from suggestions after successful connection
      setSuggestedUsers(prev => prev.filter(user => user.id !== targetUserId));
    } catch (error) {
      console.error('Error creating connection:', error);
    } finally {
      setConnecting(prev => ({ ...prev, [targetUserId]: false }));
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>People You May Know</CardTitle>
        </CardHeader>
        <CardContent>Loading...</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          People You May Know
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestedUsers.map((suggestedUser) => (
            <div key={suggestedUser.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={suggestedUser.photoURL || ''} />
                  <AvatarFallback>
                    {suggestedUser.displayName?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{suggestedUser.displayName}</p>
                  <p className="text-sm text-gray-500">{suggestedUser.email}</p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => handleConnect(suggestedUser.id)}
                disabled={connecting[suggestedUser.id]}
              >
                <UserPlus className="h-4 w-4" />
                {connecting[suggestedUser.id] ? 'Connecting...' : 'Connect'}
              </Button>
            </div>
          ))}
          {suggestedUsers.length === 0 && (
            <p className="text-center text-gray-500">No suggestions available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        // Reset states first
        setUserProfile(null);
        setTeams([]);
        setLeagues([]);
        
        const [profile, userTeams, userLeagues] = await Promise.all([
          getUserProfile(user.uid),
          getUserTeams(user.uid),
          getUserLeagues(user.uid)
        ]);
        
        if (profile) setUserProfile(profile);
        setTeams(userTeams);
        setLeagues(userLeagues);
      }
    };
    fetchUserData();
  }, [user?.uid]); // Depend on user.uid instead of user object

  if (!user) {
    router.push("/sign-in");
    return null;
  }

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await logout();
      window.location.href = "/sign-in";
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats: StatItem[] = [
    {
      label: "Connections",
      value: userProfile?.connections?.length || 0,
      Icon: Users
    },
    {
      label: "Teams",
      value: teams.length,
      Icon: Users
    },
    {
      label: "Leagues",
      value: leagues.length,
      Icon: Trophy
    },
    {
      label: "Post Views",
      value: userProfile?.postViews || 0,
      Icon: Eye
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Sports Theme */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 pb-32 pt-12">
        <div className="absolute inset-0 bg-blue-900/20"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-8 text-center">
            <Avatar className="h-32 w-32 mx-auto ring-4 ring-white bg-white">
              <AvatarImage src={userProfile?.photoURL || user?.photoURL || ''} />
              <AvatarFallback className="text-4xl">
                {(userProfile?.firstName?.[0] || userProfile?.displayName?.[0] || user?.displayName?.[0] || 'U').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="mt-4">              <h2 className="text-3xl font-bold text-white">
                {(userProfile?.firstName || (user?.displayName?.split(' ')[0])) + ' ' + 
                 (userProfile?.lastName || (user?.displayName?.split(' ').slice(1).join(' ')))}
              </h2>
              <p className="mt-2 text-lg text-blue-100">{userProfile?.email || user?.email}</p>
              <p className="mt-2 text-blue-100">
                {userProfile?.bio || "No bio added yet"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.label}
                  </CardTitle>
                  <stat.Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="space-y-4">
            <PostCreate />
            <PostDisplay userId={user.uid} />
          </div>
        </div>
        
        <div className="space-y-6">
          <PeopleYouMayKnow userId={user.uid} />
        </div>
      </div>
    </div>
  );
}
