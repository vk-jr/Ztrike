import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "wouter";
import { AuthContext } from "@/App";
import { 
  Home, 
  Users, 
  Trophy, 
  MessageSquare, 
  Bell, 
  Search,
  ChevronDown,
  Volleyball,
  UsersRound,
  Settings,
  LogOut,
  User,
  HelpCircle,
  Moon,
  Sun,
  Palette
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeSelector from "@/components/ui/ThemeSelector";
import { applyTheme, getCurrentTheme } from "@/lib/themeService";

export default function Header() {
  const [location, setLocation] = useLocation();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(getCurrentTheme());
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    setCurrentTheme(getCurrentTheme());
  }, []);

  const isActive = (path: string) => location === path;

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="text-blue-600 font-bold text-xl flex items-center">
              <Volleyball className="mr-2 h-6 w-6" />
              <span>SportConnect</span>
            </Link>
          </div>
          
          {/* Search */}
          <div className="hidden md:block flex-1 max-w-md mx-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="Search athletes, teams, leagues..." 
                type="search"
              />
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            {/* Home */}
            <Link 
              href="/" 
              className={`flex flex-col items-center justify-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/') ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-blue-600 transition-colors'}`}
            >
              <Home className="h-5 w-5" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            
            {/* Network */}
            <Link 
              href="/network" 
              className={`flex flex-col items-center justify-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/network') ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-blue-600 transition-colors'}`}
            >
              <Users className="h-5 w-5" />
              <span className="text-xs mt-1">Network</span>
            </Link>
            
            {/* Leagues */}
            <Link 
              href="/leagues" 
              className={`flex flex-col items-center justify-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/leagues') ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-blue-600 transition-colors'}`}
            >
              <Trophy className="h-5 w-5" />
              <span className="text-xs mt-1">Leagues</span>
            </Link>
            
            {/* Teams */}
            <Link 
              href="/teams" 
              className={`flex flex-col items-center justify-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/teams') ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-blue-600 transition-colors'}`}
            >
              <UsersRound className="h-5 w-5" />
              <span className="text-xs mt-1">Teams</span>
            </Link>
            
            {/* Messaging */}
            <Link 
              href="/messages" 
              className={`flex flex-col items-center justify-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/messages') ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-blue-600 transition-colors'} relative`}
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs mt-1">Messages</span>
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
            </Link>
            
            {/* Notifications */}
            <Link 
              href="/notifications" 
              className={`flex flex-col items-center justify-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/notifications') ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-blue-600 transition-colors'} relative`}
            >
              <Bell className="h-5 w-5" />
              <span className="text-xs mt-1">Alerts</span>
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">5</span>
            </Link>
          </nav>
          
          {/* Profile and Theme */}
          <div className="flex items-center">
            {/* Theme Selector */}
            <div className="hidden sm:block mr-2">
              <ThemeSelector />
            </div>
            
            {/* Mobile search button */}
            <button 
              className="md:hidden px-2 py-1 text-gray-500 hover:text-blue-600"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </button>
            
            <div className="flex items-center border-l pl-3 ml-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center text-sm focus:outline-none hover:opacity-80 transition-opacity">
                    <img 
                      className="h-8 w-8 rounded-full object-cover border-2 border-blue-200" 
                      src={user?.avatar || "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=100&h=100"} 
                      alt="User profile"
                    />
                    <span className="hidden lg:block ml-2 font-medium text-gray-700">
                      {user?.fullName ? user.fullName.split(' ')[0] : 'User'}
                    </span>
                    <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.fullName || 'User'}</p>
                      <p className="w-[200px] truncate text-sm text-gray-500">
                        @{user?.username || 'user'}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${user?.id || 1}`} className="cursor-pointer flex w-full items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer flex w-full items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings/appearance" className="cursor-pointer flex w-full items-center">
                      <Palette className="mr-2 h-4 w-4" />
                      <span>Theme</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/help" className="cursor-pointer flex w-full items-center">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Help & Support</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <button 
                      className="cursor-pointer flex w-full items-center text-red-500"
                      onClick={() => {
                        logout();
                        setLocation('/login');
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Search (conditionally rendered) */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 py-2 bg-white border-t border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input 
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Search athletes, teams, leagues..." 
              type="search"
            />
          </div>
        </div>
      )}
      
      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 bg-white fixed bottom-0 left-0 right-0 z-50 shadow-md">
        <div className="flex justify-around">
          <Link 
            href="/" 
            className={`flex flex-col items-center justify-center py-2 flex-1 ${isActive('/') ? 'text-blue-600' : 'text-gray-500'}`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link 
            href="/network" 
            className={`flex flex-col items-center justify-center py-2 flex-1 ${isActive('/network') ? 'text-blue-600' : 'text-gray-500'}`}
          >
            <Users className="h-5 w-5" />
            <span className="text-xs mt-1">Network</span>
          </Link>
          
          <Link 
            href="/leagues" 
            className={`flex flex-col items-center justify-center py-2 flex-1 ${isActive('/leagues') ? 'text-blue-600' : 'text-gray-500'}`}
          >
            <Trophy className="h-5 w-5" />
            <span className="text-xs mt-1">Leagues</span>
          </Link>
          
          <Link
            href="/teams"
            className={`flex flex-col items-center justify-center py-2 flex-1 ${isActive('/teams') ? 'text-blue-600' : 'text-gray-500'}`}
          >
            <UsersRound className="h-5 w-5" />
            <span className="text-xs mt-1">Teams</span>
          </Link>
          
          <Link 
            href="/messages" 
            className={`flex flex-col items-center justify-center py-2 flex-1 ${isActive('/messages') ? 'text-blue-600' : 'text-gray-500'} relative`}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs mt-1">Messages</span>
            <span className="absolute top-1 right-6 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
          </Link>
          
          <Link 
            href="/notifications" 
            className={`flex flex-col items-center justify-center py-2 flex-1 ${isActive('/notifications') ? 'text-blue-600' : 'text-gray-500'} relative`}
          >
            <Bell className="h-5 w-5" />
            <span className="text-xs mt-1">Alerts</span>
            <span className="absolute top-1 right-6 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">5</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
