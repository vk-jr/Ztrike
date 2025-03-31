import { useState, useEffect } from "react";
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
  ChevronRight,
  Check
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { applyTheme, getCurrentTheme, changePrimaryColor } from "@/lib/themeService";

export default function Settings() {
  const [location, setLocation] = useLocation();
  const tabFromUrl = location.includes("appearance") ? "appearance" : "general";
  
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
              href="/settings/appearance" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${location === '/settings/appearance' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
            >
              <Palette className="h-5 w-5 mr-3" />
              Appearance
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
          <Tabs defaultValue={tabFromUrl} onValueChange={(value) => {
            if (value === "appearance") {
              setLocation("/settings/appearance");
            } else {
              setLocation("/settings");
            }
          }}>
            <TabsList className="mb-6">
              <TabsTrigger value="general">General Settings</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
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
            </TabsContent>
            
            <TabsContent value="appearance">
              <AppearanceSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  const [activeTheme, setActiveTheme] = useState<string>(getCurrentTheme());
  const [activePrimaryColor, setActivePrimaryColor] = useState<string>(localStorage.getItem('primaryColor') || 'hsl(217, 89%, 61%)');
  
  // Define available themes
  const themes = [
    { name: 'Light Theme', value: 'light', primary: activePrimaryColor, bgColor: '#ffffff', textColor: '#1a1a1a' },
    { name: 'Ash Theme', value: 'ash', primary: activePrimaryColor, bgColor: '#f5f5f5', textColor: '#333333' },
    { name: 'Dark Theme', value: 'dark', primary: activePrimaryColor, bgColor: '#1a1a1a', textColor: '#ffffff' },
    { name: 'Onyx Theme', value: 'onyx', primary: activePrimaryColor, bgColor: '#0f0f0f', textColor: '#e0e0e0' }
  ];

  // Available accent colors
  const accentColors = [
    { color: 'hsl(217, 89%, 61%)', name: 'Blue (Default)' },
    { color: 'hsl(262, 83%, 58%)', name: 'Purple' },
    { color: 'hsl(346, 84%, 61%)', name: 'Pink' },
    { color: 'hsl(4, 90%, 58%)', name: 'Red' },
    { color: 'hsl(24, 94%, 50%)', name: 'Orange' },
    { color: 'hsl(142, 71%, 45%)', name: 'Green' }
  ];
  
  // Handle theme change
  const changeTheme = (themeName: string) => {
    applyTheme(themeName, activePrimaryColor);
    setActiveTheme(themeName);
  };
  
  // Handle accent color change
  const handleColorChange = (color: string) => {
    changePrimaryColor(color);
    setActivePrimaryColor(color);
  };
  
  // Initialize theme on first load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedPrimaryColor = localStorage.getItem('primaryColor') || 'hsl(217, 89%, 61%)';
    
    setActiveTheme(savedTheme);
    setActivePrimaryColor(savedPrimaryColor);
  }, []);
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Appearance</h2>
      <p className="text-sm text-muted-foreground mb-6">Customize how SportConnect looks for you</p>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-base font-medium mb-3">Theme</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {themes.map((theme) => (
              <ThemeCard 
                key={theme.value}
                name={theme.name}
                value={theme.value}
                bgColor={theme.bgColor}
                textColor={theme.textColor}
                primary={theme.primary}
                isActive={activeTheme === theme.value}
                onClick={() => changeTheme(theme.value)}
              />
            ))}
          </div>
        </div>
        
        <div className="border-t pt-6">
          <h3 className="text-base font-medium mb-3">Accent Color</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {accentColors.map((colorOption) => (
              <ColorSwatch 
                key={colorOption.color}
                color={colorOption.color}
                name={colorOption.name}
                isActive={activePrimaryColor === colorOption.color}
                onClick={() => handleColorChange(colorOption.color)}
              />
            ))}
          </div>
        </div>
        
        <div className="border-t pt-6">
          <h3 className="text-base font-medium mb-3">Interface Density</h3>
          <div className="flex space-x-4">
            <button className="px-4 py-2 border rounded-md bg-primary/10 border-primary text-primary">Comfortable</button>
            <button className="px-4 py-2 border rounded-md text-muted-foreground hover:bg-muted">Compact</button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Adjust the density of content to show more or less on screen</p>
        </div>
        
        <div className="border-t pt-6">
          <h3 className="text-base font-medium mb-3">Font Size</h3>
          <div className="flex space-x-4">
            <button className="px-4 py-2 border rounded-md text-muted-foreground hover:bg-muted">Small</button>
            <button className="px-4 py-2 border rounded-md bg-primary/10 border-primary text-primary">Medium</button>
            <button className="px-4 py-2 border rounded-md text-muted-foreground hover:bg-muted">Large</button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ThemeCardProps {
  name: string;
  value: string;
  bgColor: string;
  textColor: string;
  primary: string;
  isActive: boolean;
  onClick: () => void;
}

function ThemeCard({ name, value, bgColor, textColor, primary, isActive, onClick }: ThemeCardProps) {
  return (
    <button 
      onClick={onClick}
      className={`group flex flex-col items-center border rounded-lg p-4 hover:border-primary transition-colors ${isActive ? 'border-primary ring-1 ring-primary' : 'border-muted'}`}
    >
      <div 
        className="w-full h-20 rounded-md mb-2 flex flex-col overflow-hidden border"
        style={{ backgroundColor: bgColor }}
      >
        <div className="h-6 w-full" style={{ backgroundColor: primary }}></div>
        <div className="flex-1 p-2">
          <div className="w-full h-2 rounded-full mb-1 opacity-60" style={{ backgroundColor: textColor }}></div>
          <div className="w-2/3 h-2 rounded-full opacity-60" style={{ backgroundColor: textColor }}></div>
        </div>
      </div>
      <div className="flex items-center">
        <span className="text-sm font-medium">{name}</span>
        {isActive && <Check className="h-4 w-4 ml-1 text-primary" />}
      </div>
    </button>
  );
}

interface ColorSwatchProps {
  color: string;
  name: string;
  isActive: boolean;
  onClick: () => void;
}

function ColorSwatch({ color, name, isActive, onClick }: ColorSwatchProps) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center group"
    >
      <div className="relative">
        <div 
          className={`w-10 h-10 rounded-full mb-1 border ${isActive ? 'ring-2 ring-offset-2' : 'group-hover:ring-1 group-hover:ring-offset-1'}`}
          style={{ backgroundColor: color }}
        />
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Check className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
      <span className="text-xs">{name}</span>
    </button>
  );
}