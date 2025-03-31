import { Link, useLocation } from "wouter";
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Palette, 
  Accessibility, 
  Globe, 
  MessagesSquare,
  User,
  Lock,
  ChevronRight
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  const [location] = useLocation();
  
  return (
    <div className="pt-20 px-4 md:px-8 pb-16 mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Sidebar */}
        <div className="col-span-1 bg-card text-card-foreground rounded-lg shadow-sm p-4">
          <nav className="space-y-1">
            <Link 
              href="/settings" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${location === '/settings' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
            >
              <SettingsIcon className="h-5 w-5 mr-3" />
              General
            </Link>
            <Link 
              href="/settings/profile" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${location === '/settings/profile' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
            >
              <User className="h-5 w-5 mr-3" />
              Profile
            </Link>
            <Link 
              href="/settings/privacy" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${location === '/settings/privacy' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
            >
              <Lock className="h-5 w-5 mr-3" />
              Privacy
            </Link>
            <Link 
              href="/settings/notifications" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${location === '/settings/notifications' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
            >
              <Bell className="h-5 w-5 mr-3" />
              Notifications
            </Link>
            <Link 
              href="/settings/accessibility" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${location === '/settings/accessibility' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
            >
              <Accessibility className="h-5 w-5 mr-3" />
              Accessibility
            </Link>
            <Link 
              href="/settings/language" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${location === '/settings/language' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
            >
              <Globe className="h-5 w-5 mr-3" />
              Language
            </Link>
          </nav>
        </div>
        
        {/* Settings Content */}
        <div className="col-span-1 md:col-span-3 bg-card text-card-foreground rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">General Settings</h2>
              
          <div className="space-y-6">
            <div className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium">Account Information</h3>
                  <p className="text-sm text-muted-foreground">Update your account details</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            <div className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium">Password</h3>
                  <p className="text-sm text-muted-foreground">Change your password</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            <div className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium">Email Preferences</h3>
                  <p className="text-sm text-muted-foreground">Manage email notifications</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            <div className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium">Connected Accounts</h3>
                  <p className="text-sm text-muted-foreground">Connect with third-party services</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-red-500">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">Permanently delete your account</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}