import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Home, 
  Users, 
  Trophy, 
  MessageSquare, 
  Bell, 
  Search,
  ChevronDown,
  Volleyball 
} from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="text-primary font-bold text-xl flex items-center">
              <Volleyball className="mr-2 h-6 w-6" />
              <span>SportConnect</span>
            </Link>
          </div>
          
          {/* Search */}
          <div className="hidden md:block flex-1 max-w-md mx-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-neutral-300" />
              </div>
              <input 
                className="block w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-full bg-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
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
              className={`flex flex-col items-center justify-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/') ? 'text-primary border-b-2 border-primary' : 'text-neutral-400 hover:text-primary transition-colors'}`}
            >
              <Home className="h-5 w-5" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            
            {/* Network */}
            <Link 
              href="/network" 
              className={`flex flex-col items-center justify-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/network') ? 'text-primary border-b-2 border-primary' : 'text-neutral-400 hover:text-primary transition-colors'}`}
            >
              <Users className="h-5 w-5" />
              <span className="text-xs mt-1">Network</span>
            </Link>
            
            {/* Leagues */}
            <Link 
              href="/leagues" 
              className={`flex flex-col items-center justify-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/leagues') ? 'text-primary border-b-2 border-primary' : 'text-neutral-400 hover:text-primary transition-colors'}`}
            >
              <Trophy className="h-5 w-5" />
              <span className="text-xs mt-1">Leagues</span>
            </Link>
            
            {/* Messaging */}
            <Link 
              href="/messages" 
              className={`flex flex-col items-center justify-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/messages') ? 'text-primary border-b-2 border-primary' : 'text-neutral-400 hover:text-primary transition-colors'} relative`}
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs mt-1">Messages</span>
              <span className="absolute top-1 right-1 w-4 h-4 bg-status-error rounded-full text-white text-xs flex items-center justify-center">3</span>
            </Link>
            
            {/* Notifications */}
            <Link 
              href="/notifications" 
              className={`flex flex-col items-center justify-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/notifications') ? 'text-primary border-b-2 border-primary' : 'text-neutral-400 hover:text-primary transition-colors'} relative`}
            >
              <Bell className="h-5 w-5" />
              <span className="text-xs mt-1">Alerts</span>
              <span className="absolute top-1 right-1 w-4 h-4 bg-status-error rounded-full text-white text-xs flex items-center justify-center">5</span>
            </Link>
          </nav>
          
          {/* Profile */}
          <div className="flex items-center">
            {/* Mobile search button */}
            <button 
              className="md:hidden px-2 py-1 text-neutral-400 hover:text-primary"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </button>
            
            <div className="flex items-center border-l pl-3 ml-3">
              {/* Change button to Link and point to Profile page with ID=1 */}
              <Link 
                href="/profile/1" 
                className="flex items-center text-sm focus:outline-none hover:opacity-80 transition-opacity"
              >
                <img 
                  className="h-8 w-8 rounded-full object-cover border-2 border-primary/30" 
                  src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=100&h=100" 
                  alt="User profile"
                />
                <span className="hidden lg:block ml-2 font-medium text-neutral-700">Michael J.</span>
                <ChevronDown className="ml-1 h-4 w-4 text-neutral-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Search (conditionally rendered) */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 py-2 bg-white border-t border-neutral-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-neutral-300" />
            </div>
            <input 
              className="block w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-full bg-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
              placeholder="Search athletes, teams, leagues..." 
              type="search"
            />
          </div>
        </div>
      )}
      
      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-neutral-200 bg-white fixed bottom-0 left-0 right-0 z-50">
        <div className="flex justify-around">
          <Link 
            href="/" 
            className={`flex flex-col items-center justify-center py-2 flex-1 ${isActive('/') ? 'text-primary' : 'text-neutral-400'}`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link 
            href="/network" 
            className={`flex flex-col items-center justify-center py-2 flex-1 ${isActive('/network') ? 'text-primary' : 'text-neutral-400'}`}
          >
            <Users className="h-5 w-5" />
            <span className="text-xs mt-1">Network</span>
          </Link>
          
          <Link 
            href="/leagues" 
            className={`flex flex-col items-center justify-center py-2 flex-1 ${isActive('/leagues') ? 'text-primary' : 'text-neutral-400'}`}
          >
            <Trophy className="h-5 w-5" />
            <span className="text-xs mt-1">Leagues</span>
          </Link>
          
          <Link 
            href="/messages" 
            className={`flex flex-col items-center justify-center py-2 flex-1 ${isActive('/messages') ? 'text-primary' : 'text-neutral-400'} relative`}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs mt-1">Messages</span>
            <span className="absolute top-1 right-6 w-4 h-4 bg-status-error rounded-full text-white text-xs flex items-center justify-center">3</span>
          </Link>
          
          <Link 
            href="/notifications" 
            className={`flex flex-col items-center justify-center py-2 flex-1 ${isActive('/notifications') ? 'text-primary' : 'text-neutral-400'} relative`}
          >
            <Bell className="h-5 w-5" />
            <span className="text-xs mt-1">Alerts</span>
            <span className="absolute top-1 right-6 w-4 h-4 bg-status-error rounded-full text-white text-xs flex items-center justify-center">5</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
