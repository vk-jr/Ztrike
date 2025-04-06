interface Theme {
  primary: string;
  variant: 'professional' | 'tint' | 'vibrant';
  appearance: 'light' | 'dark' | 'system';
  radius: number;
}

// Theme configuration
const themes: Record<string, Theme> = {
  light: {
    primary: 'hsl(217, 91%, 60%)',
    variant: 'professional',
    appearance: 'light',
    radius: 0.5
  },
  ash: {
    primary: 'hsl(217, 91%, 60%)',
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
    primary: 'hsl(217, 91%, 60%)',
    variant: 'professional',
    appearance: 'dark',
    radius: 0.5
  },
  futuristic: {
    primary: 'hsl(210, 100%, 50%)',
    variant: 'vibrant',
    appearance: 'light',
    radius: 1.0
  }
};

// CSS variables for each theme
const themeVariables: Record<string, Record<string, string>> = {
  light: {
    '--background': '#ffffff',
    '--foreground': '#1e3a8a',
    '--card': '#ffffff',
    '--card-foreground': '#1e3a8a',
    '--popover': '#ffffff',
    '--popover-foreground': '#1e3a8a',
    '--primary': 'hsl(217, 91%, 60%)',
    '--primary-foreground': '#ffffff',
    '--secondary': '#f0f7ff',
    '--secondary-foreground': '#1e3a8a',
    '--muted': '#f1f5f9',
    '--muted-foreground': '#64748b',
    '--accent': '#dbeafe',
    '--accent-foreground': '#1e40af',
    '--destructive': '#ef4444',
    '--destructive-foreground': '#ffffff',
    '--border': '#e0e7ff',
    '--input': '#e0e7ff',
    '--ring': 'hsl(217, 91%, 60%)',
  },
  ash: {
    '--background': '#f5f5f5',
    '--foreground': '#262626',
    '--card': '#ffffff',
    '--card-foreground': '#262626',
    '--popover': '#ffffff',
    '--popover-foreground': '#262626',
    '--primary': 'hsl(217, 91%, 60%)',
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
    '--ring': 'hsl(217, 91%, 60%)',
  },
  dark: {
    '--background': '#0f172a',
    '--foreground': '#f8fafc',
    '--card': '#1e293b',
    '--card-foreground': '#f8fafc',
    '--popover': '#1e293b',
    '--popover-foreground': '#f8fafc',
    '--primary': 'hsl(217, 91%, 60%)',
    '--primary-foreground': '#ffffff',
    '--secondary': '#1e293b',
    '--secondary-foreground': '#f8fafc',
    '--muted': '#172554',
    '--muted-foreground': '#94a3b8',
    '--accent': '#0c4a6e',
    '--accent-foreground': '#f8fafc',
    '--destructive': '#ef4444',
    '--destructive-foreground': '#ffffff',
    '--border': '#1e40af',
    '--input': '#1e40af',
    '--ring': 'hsl(217, 91%, 60%)',
  },
  onyx: {
    '--background': '#0f0f0f',
    '--foreground': '#e0e0e0',
    '--card': '#1a1a1a',
    '--card-foreground': '#e0e0e0',
    '--popover': '#1a1a1a',
    '--popover-foreground': '#e0e0e0',
    '--primary': 'hsl(217, 91%, 60%)',
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
    '--ring': 'hsl(217, 91%, 60%)',
  },
  futuristic: {
    '--background': '#f0f8ff',
    '--foreground': '#0a1a2f',
    '--card': 'rgba(255, 255, 255, 0.8)',
    '--card-foreground': '#0a1a2f',
    '--popover': 'rgba(255, 255, 255, 0.9)',
    '--popover-foreground': '#0a1a2f',
    '--primary': 'hsl(210, 100%, 50%)',
    '--primary-foreground': '#ffffff',
    '--secondary': 'rgba(240, 248, 255, 0.8)',
    '--secondary-foreground': '#0a1a2f',
    '--muted': 'rgba(230, 240, 255, 0.7)',
    '--muted-foreground': '#4a5568',
    '--accent': 'rgba(210, 230, 255, 0.7)',
    '--accent-foreground': '#0a1a2f',
    '--destructive': '#ef4444',
    '--destructive-foreground': '#ffffff',
    '--border': 'rgba(200, 220, 255, 0.5)',
    '--input': 'rgba(220, 230, 255, 0.5)',
    '--ring': 'hsl(210, 100%, 50%)',
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
  const savedPrimaryColor = localStorage.getItem('primaryColor') || 'hsl(217, 91%, 60%)';
  
  applyTheme(savedTheme, savedPrimaryColor);
}

// Change primary color
export function changePrimaryColor(color: string) {
  const currentTheme = getCurrentTheme();
  applyTheme(currentTheme, color);
}