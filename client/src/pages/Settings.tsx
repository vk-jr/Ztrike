import { useState, useEffect } from "react";
import { Link, useLocation, Route, Switch } from "wouter";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Palette, 
  Accessibility, 
  Globe, 
  User,
  Lock,
  ChevronRight,
  Sun,
  Moon
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { applyTheme, getCurrentTheme } from "@/lib/themeService";

export default function Settings() {
  const [location, setLocation] = useLocation();
  const [currentTheme, setCurrentTheme] = useState(getCurrentTheme());
  
  useEffect(() => {
    setCurrentTheme(getCurrentTheme());
  }, []);
  
  const handleThemeChange = (themeId: string) => {
    applyTheme(themeId);
    setCurrentTheme(themeId);
  };
  
  return (
    <div className="pt-20 px-4 md:px-8 pb-16 mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Sidebar */}
        <div className="col-span-1 bg-white rounded-lg shadow-md p-4">
          <nav className="space-y-1">
            <Link 
              href="/settings" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location === '/settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <SettingsIcon className="h-5 w-5 mr-3" />
              General
            </Link>
            <Link 
              href="/settings/appearance" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location === '/settings/appearance' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Palette className="h-5 w-5 mr-3" />
              Appearance
            </Link>
            <Link 
              href="/settings/profile" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location === '/settings/profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <User className="h-5 w-5 mr-3" />
              Profile
            </Link>
            <Link 
              href="/settings/privacy" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location === '/settings/privacy' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Lock className="h-5 w-5 mr-3" />
              Privacy
            </Link>
            <Link 
              href="/settings/notifications" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location === '/settings/notifications' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Bell className="h-5 w-5 mr-3" />
              Notifications
            </Link>
            <Link 
              href="/settings/accessibility" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location === '/settings/accessibility' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Accessibility className="h-5 w-5 mr-3" />
              Accessibility
            </Link>
            <Link 
              href="/settings/language" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location === '/settings/language' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Globe className="h-5 w-5 mr-3" />
              Language
            </Link>
          </nav>
        </div>
        
        {/* Settings Content */}
        <div className="col-span-1 md:col-span-3 bg-white rounded-lg shadow-md p-6">
          <Switch>
            <Route path="/settings/appearance">
              <AppearanceSettings currentTheme={currentTheme} onThemeChange={handleThemeChange} />
            </Route>
            <Route path="/settings">
              <GeneralSettings />
            </Route>
            <Route>
              <div className="text-center py-8">
                <h2 className="text-xl font-medium text-gray-600 mb-2">Page Not Available</h2>
                <p className="text-gray-500 mb-4">This settings page is under development</p>
                <Button variant="outline" onClick={() => setLocation('/settings')}>
                  Return to Settings
                </Button>
              </div>
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
}

function GeneralSettings() {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">General Settings</h2>
          
      <div className="space-y-6">
        <div className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium">Account Information</h3>
              <p className="text-sm text-gray-500">Update your account details</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium">Password</h3>
              <p className="text-sm text-gray-500">Change your password</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium">Email Preferences</h3>
              <p className="text-sm text-gray-500">Manage email notifications</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium">Connected Accounts</h3>
              <p className="text-sm text-gray-500">Connect with third-party services</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-red-500">Delete Account</h3>
              <p className="text-sm text-gray-500">Permanently delete your account</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    </>
  );
}

function AppearanceSettings({ currentTheme, onThemeChange }: { currentTheme: string, onThemeChange: (theme: string) => void }) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>
      <p className="text-gray-500 mb-6">Customize the look and feel of the application</p>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-3">Theme</h3>
          <p className="text-sm text-gray-500 mb-4">Select a theme for the application</p>
          
          <RadioGroup value={currentTheme} onValueChange={onThemeChange} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <RadioGroupItem value="light" id="light" className="peer sr-only" />
              <Label
                htmlFor="light"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500 cursor-pointer"
              >
                <Sun className="mb-3 h-6 w-6 text-blue-500" />
                <div className="font-medium">Light</div>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem value="ash" id="ash" className="peer sr-only" />
              <Label
                htmlFor="ash"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500 cursor-pointer"
              >
                <Moon className="mb-3 h-6 w-6 text-gray-400" />
                <div className="font-medium">Ash</div>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
              <Label
                htmlFor="dark"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500 cursor-pointer"
              >
                <Moon className="mb-3 h-6 w-6 text-gray-700" />
                <div className="font-medium">Dark</div>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem value="onyx" id="onyx" className="peer sr-only" />
              <Label
                htmlFor="onyx"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500 cursor-pointer"
              >
                <Moon className="mb-3 h-6 w-6 text-gray-900" />
                <div className="font-medium">Onyx</div>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-3">Theme Preview</h3>
          <p className="text-sm text-gray-500 mb-4">Preview how the selected theme will look</p>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Feed</CardTitle>
                <CardDescription>Post content preview</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">This is how your posts will appear to others</p>
                <div className="h-20 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-gray-500">Post content preview</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>User profile preview</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">This is how your profile will appear</p>
                <div className="h-20 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-gray-500">Profile preview</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}