interface Theme {
  primary: string;
  variant: 'professional' | 'tint' | 'vibrant';
  appearance: 'light' | 'dark' | 'system';
  radius: number;
}

// Theme configuration
const themes: Record<string, Theme> = {
  light: {
    primary: 'hsl(217, 89%, 61%)',
    variant: 'professional',
    appearance: 'light',
    radius: 0.5
  },
  ash: {
    primary: 'hsl(217, 89%, 61%)',
    variant: 'professional',
    appearance: 'light',
    radius: 0.5
  },
  dark: {
    primary: 'hsl(217, 89%, 61%)',
    variant: 'professional',
    appearance: 'dark',
    radius: 0.5
  },
  onyx: {
    primary: 'hsl(217, 89%, 61%)',
    variant: 'professional',
    appearance: 'dark',
    radius: 0.5
  }
};

// CSS variables for each theme
const themeVariables: Record<string, Record<string, string>> = {
  light: {
    '--background': '#ffffff',
    '--foreground': '#1a1a1a',
    '--card': '#ffffff',
    '--card-foreground': '#1a1a1a',
    '--popover': '#ffffff',
    '--popover-foreground': '#1a1a1a',
    '--primary': 'hsl(217, 89%, 61%)',
    '--primary-foreground': '#ffffff',
    '--secondary': '#f5f7fb',
    '--secondary-foreground': '#1a1a1a',
    '--muted': '#f5f5f5',
    '--muted-foreground': '#737373',
    '--accent': '#f5f7fb',
    '--accent-foreground': '#1a1a1a',
    '--destructive': '#ef4444',
    '--destructive-foreground': '#ffffff',
    '--border': '#e5e5e5',
    '--input': '#e5e5e5',
    '--ring': 'hsl(217, 89%, 61%)',
  },
  ash: {
    '--background': '#f5f5f5',
    '--foreground': '#262626',
    '--card': '#ffffff',
    '--card-foreground': '#262626',
    '--popover': '#ffffff',
    '--popover-foreground': '#262626',
    '--primary': 'hsl(217, 89%, 61%)',
    '--primary-foreground': '#ffffff',
    '--secondary': '#f0f0f0',
    '--secondary-foreground': '#262626',
    '--muted': '#e0e0e0',
    '--muted-foreground': '#737373',
    '--accent': '#f0f0f0',
    '--accent-foreground': '#262626',
    '--destructive': '#ef4444',
    '--destructive-foreground': '#ffffff',
    '--border': '#d4d4d4',
    '--input': '#d4d4d4',
    '--ring': 'hsl(217, 89%, 61%)',
  },
  dark: {
    '--background': '#1a1a1a',
    '--foreground': '#ffffff',
    '--card': '#262626',
    '--card-foreground': '#ffffff',
    '--popover': '#262626',
    '--popover-foreground': '#ffffff',
    '--primary': 'hsl(217, 89%, 61%)',
    '--primary-foreground': '#ffffff',
    '--secondary': '#323232',
    '--secondary-foreground': '#ffffff',
    '--muted': '#323232',
    '--muted-foreground': '#a3a3a3',
    '--accent': '#323232',
    '--accent-foreground': '#ffffff',
    '--destructive': '#ef4444',
    '--destructive-foreground': '#ffffff',
    '--border': '#404040',
    '--input': '#404040',
    '--ring': 'hsl(217, 89%, 61%)',
  },
  onyx: {
    '--background': '#0f0f0f',
    '--foreground': '#e0e0e0',
    '--card': '#1a1a1a',
    '--card-foreground': '#e0e0e0',
    '--popover': '#1a1a1a',
    '--popover-foreground': '#e0e0e0',
    '--primary': 'hsl(217, 89%, 61%)',
    '--primary-foreground': '#ffffff',
    '--secondary': '#262626',
    '--secondary-foreground': '#e0e0e0',
    '--muted': '#262626',
    '--muted-foreground': '#a3a3a3',
    '--accent': '#262626',
    '--accent-foreground': '#e0e0e0',
    '--destructive': '#ef4444',
    '--destructive-foreground': '#ffffff',
    '--border': '#333333',
    '--input': '#333333',
    '--ring': 'hsl(217, 89%, 61%)',
  }
};

// Get current theme
export function getCurrentTheme(): string {
  const storedTheme = localStorage.getItem('theme');
  return storedTheme || 'light';
}

// Apply a theme by name
export function applyTheme(themeName: string, primaryColor?: string) {
  if (!themes[themeName]) {
    console.error(`Theme "${themeName}" not found`);
    return;
  }
  
  // Get the theme configuration
  const theme = { ...themes[themeName] };
  
  // Override primary color if provided
  if (primaryColor) {
    theme.primary = primaryColor;
  }
  
  // Apply CSS variables for the theme
  const variables = themeVariables[themeName];
  
  if (primaryColor) {
    // Update primary color in variables
    variables['--primary'] = primaryColor;
    variables['--ring'] = primaryColor;
  }
  
  // Apply variables to document root
  Object.keys(variables).forEach(variable => {
    document.documentElement.style.setProperty(variable, variables[variable]);
  });
  
  // Save theme preference
  localStorage.setItem('theme', themeName);
  localStorage.setItem('primaryColor', theme.primary);
  
  // Apply data attributes for dark mode
  if (theme.appearance === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Return the applied theme
  return theme;
}

// Initialize theme from saved preference or default
export function initializeTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  const savedPrimaryColor = localStorage.getItem('primaryColor');
  
  applyTheme(savedTheme, savedPrimaryColor || undefined);
}

// Change primary color
export function changePrimaryColor(color: string) {
  const currentTheme = getCurrentTheme();
  applyTheme(currentTheme, color);
}