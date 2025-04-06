import { useState, useEffect } from 'react';
import { Check, Monitor, Moon, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { applyTheme, getCurrentTheme } from '@/lib/themeService';

const themes = [
  {
    id: 'futuristic',
    name: 'Futuristic',
    icon: <Sun className="h-5 w-5 text-blue-500" />,
  },
  {
    id: 'light',
    name: 'Light',
    icon: <Sun className="h-5 w-5" />,
  },
  {
    id: 'ash',
    name: 'Ash',
    icon: <Moon className="h-5 w-5 opacity-60" />,
  },
  {
    id: 'dark',
    name: 'Dark',
    icon: <Moon className="h-5 w-5" />,
  },
  {
    id: 'onyx',
    name: 'Onyx',
    icon: <Moon className="h-5 w-5" />,
  },
];

export default function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState(getCurrentTheme());
  
  useEffect(() => {
    // Initialize theme when component mounts
    setCurrentTheme(getCurrentTheme());
  }, []);
  
  const handleThemeChange = (themeId: string) => {
    applyTheme(themeId);
    setCurrentTheme(themeId);
  };
  
  // Find current theme object
  const theme = themes.find(t => t.id === currentTheme) || themes[0];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          {theme.icon}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {theme.icon}
              <span>{theme.name}</span>
            </div>
            {currentTheme === theme.id && (
              <Check className="h-4 w-4 ml-2" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}