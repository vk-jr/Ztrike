"use client";

import { Search, Home, Users, Trophy, Users as TeamsIcon, User, MessageSquare, Bell, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useEffect, useState } from "react";
import { getUnreadMessagesCount, searchUsers } from "@/lib/db";
import { useNotificationCount } from "@/hooks/useNotificationCount";
import { SearchResults } from "@/components/SearchResults";
import type { UserProfile } from "@/types/database";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
      window.location.href = "/sign-in";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const [unreadMessages, setUnreadMessages] = useState(0);
  const unreadNotifications = useNotificationCount();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim()) {
        const results = await searchUsers(searchQuery.trim());
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowResults(true);
  };

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user) {
        const count = await getUnreadMessagesCount(user.uid);
        setUnreadMessages(count);
      }
    };
    fetchUnreadCount();

    // Refresh count every minute
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    ...(user ? [
      { name: "Network", href: "/network", icon: Users },
      { name: "Leagues", href: "/leagues", icon: Trophy },
      { name: "Teams", href: "/teams", icon: TeamsIcon },
      { name: "My Profile", href: "/profile", icon: User },
      { name: "Messages", href: "/messages", icon: MessageSquare, badge: unreadMessages > 0 ? String(unreadMessages) : undefined },
      { name: "Alerts", href: "/alerts", icon: Bell, badge: unreadNotifications > 0 ? String(unreadNotifications) : undefined },
    ] : [])
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8">
                <img src="/images/logo.png" alt="Ztrike Logo" className="w-full h-full" />
              </div>
              <span className="text-xl font-bold text-gray-900">ZTRIKE</span>
            </Link>
          </div>

          {/* Search Bar */}
          {user && (
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search athletes, teams, leagues..."
                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowResults(true)}
                />
                {showResults && searchResults.length > 0 && (
                  <div className="fixed inset-0 z-40" onClick={() => setShowResults(false)}>
                    <div className="absolute z-50 left-1/2 transform -translate-x-1/2" style={{ top: '4rem', width: '32rem' }}>
                      <SearchResults 
                        results={searchResults} 
                        onResultClick={() => {
                          setShowResults(false);
                          setSearchQuery('');
                        }} 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`relative flex flex-col items-center px-3 py-2 text-xs font-medium ${
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-5 w-5 mb-1" />
                    <span>{item.name}</span>
                    {item.badge && (
                      <Badge
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-500 text-white border-white border-2"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || ''} alt={user.displayName || "User"} />
                      <AvatarFallback>
                        {(user.displayName || user.email || "?")[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user.displayName && (
                        <p className="font-medium">{user.displayName}</p>
                      )}
                      {user.email && (
                        <p className="text-sm text-gray-600">{user.email}</p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/sign-up">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
