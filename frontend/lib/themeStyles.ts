/**
 * Centralized Theme Styles Configuration
 * 
 * This file contains all theme-dependent styling configurations to ensure
 * consistency across the application and make theme changes less brittle.
 * 
 * Structure: styles[component][wallpaperState][themeMode]
 */

export interface ThemeStyleConfig {
  card: {
    withWallpaper: {
      light: string;
      dark: string;
    };
    withoutWallpaper: {
      light: string;
      dark: string;
    };
  };
  panel: {
    withWallpaper: {
      light: string;
      dark: string;
    };
    withoutWallpaper: {
      light: string;
      dark: string;
    };
  };
  input: {
    withWallpaper: {
      light: string;
      dark: string;
    };
    withoutWallpaper: {
      light: string;
      dark: string;
    };
  };
  button: {
    base: {
      withWallpaper: {
        light: string;
        dark: string;
      };
      withoutWallpaper: {
        light: string;
        dark: string;
      };
    };
    active: {
      withWallpaper: {
        light: string;
        dark: string;
      };
      withoutWallpaper: {
        light: string;
        dark: string;
      };
    };
  };
  text: {
    primary: {
      light: string;
      dark: string;
    };
    secondary: {
      light: string;
      dark: string;
    };
  };
}

/**
 * Main theme styles configuration
 * 
 * Design Philosophy:
 * - Light mode: Use subtle zinc borders with shadows for definition
 * - Dark mode WITHOUT wallpaper: No borders, only shadows (Synapse-style)
 * - Dark mode WITH wallpaper: Ultra-subtle white borders (10% opacity) for glassmorphism
 */
export const themeStyles: ThemeStyleConfig = {
  card: {
    withWallpaper: {
      light: "bg-white/90 backdrop-blur-sm border border-zinc-200 hover:border-zinc-300 hover:shadow-md rounded-lg transition-all group cursor-pointer",
      dark: "bg-white/10 backdrop-blur-lg border border-white/10 hover:border-white/20 hover:bg-white/15 rounded-lg transition-all group cursor-pointer shadow-lg"
    },
    withoutWallpaper: {
      light: "bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-md rounded-lg transition-all group cursor-pointer",
      dark: "bg-zinc-900/80 shadow-sm hover:shadow-md hover:bg-zinc-900/90 rounded-xl transition-all group cursor-pointer"
    }
  },
  
  panel: {
    withWallpaper: {
      light: "bg-white border border-zinc-200/50 rounded-xl p-4 shadow-xl",
      dark: "bg-zinc-900/95 backdrop-blur-xl border-2 border-white/30 rounded-xl p-4 shadow-2xl"
    },
    withoutWallpaper: {
      light: "bg-zinc-50 border border-zinc-300/40 rounded-xl p-4",
      dark: "bg-zinc-900/70 border border-zinc-950/80 rounded-xl p-4"
    }
  },
  
  input: {
    withWallpaper: {
      light: "bg-white border border-zinc-300 rounded-3xl shadow-lg hover:shadow-xl transition-shadow",
      dark: "bg-zinc-800/95 backdrop-blur-sm border border-zinc-700 rounded-3xl shadow-lg hover:shadow-xl transition-shadow text-white"
    },
    withoutWallpaper: {
      light: "bg-white border border-zinc-300 rounded-3xl shadow-sm hover:shadow-md transition-shadow",
      dark: "bg-zinc-900/50 border border-zinc-700 rounded-3xl focus:border-zinc-600 focus:bg-zinc-900/70 text-white"
    }
  },
  
  button: {
    base: {
      withWallpaper: {
        light: "bg-white border border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900 shadow-lg",
        dark: "bg-zinc-800/90 backdrop-blur-md shadow-xl border-2 border-white/30 hover:border-white/50 hover:bg-zinc-700/90 text-white font-semibold"
      },
      withoutWallpaper: {
        light: "border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900",
        dark: "border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
      }
    },
    active: {
      withWallpaper: {
        light: "bg-blue-600 border-blue-600 text-white font-semibold shadow-lg",
        dark: "bg-blue-500/40 border-2 border-blue-400 text-white font-bold shadow-xl backdrop-blur-md"
      },
      withoutWallpaper: {
        light: "border-blue-500 bg-blue-50 text-blue-700 font-semibold",
        dark: "border-zinc-600 bg-zinc-800 text-white"
      }
    }
  },
  
  text: {
    primary: {
      light: "text-zinc-900",
      dark: "text-white"
    },
    secondary: {
      light: "text-zinc-700",
      dark: "text-zinc-400"
    }
  }
};

/**
 * Helper function to get theme-aware styles
 * 
 * @param component - The component type (card, panel, input, button)
 * @param hasWallpaper - Whether a wallpaper is active
 * @param isLight - Whether light theme is active
 * @param variant - Optional variant (e.g., 'base' or 'active' for buttons)
 * @returns The appropriate CSS classes for the current theme state
 */
export function getThemeStyle(
  component: keyof ThemeStyleConfig,
  hasWallpaper: boolean,
  isLight: boolean,
  variant?: string
): string {
  const componentStyles = themeStyles[component];
  
  // Handle text styles first (no wallpaper or variant dependency)
  if (component === 'text' && variant) {
    const textConfig = componentStyles as ThemeStyleConfig['text'];
    if (variant === 'primary') {
      return isLight ? textConfig.primary.light : textConfig.primary.dark;
    }
    if (variant === 'secondary') {
      return isLight ? textConfig.secondary.light : textConfig.secondary.dark;
    }
  }
  
  // Handle nested variants (like button.base or button.active)
  if (variant && typeof componentStyles === 'object' && variant in componentStyles) {
    const variantStyles = (componentStyles as any)[variant];
    const wallpaperState = hasWallpaper ? 'withWallpaper' : 'withoutWallpaper';
    const themeMode = isLight ? 'light' : 'dark';
    return variantStyles[wallpaperState][themeMode];
  }
  
  // Handle simple components (card, panel, input)
  if ('withWallpaper' in componentStyles) {
    const wallpaperState = hasWallpaper ? 'withWallpaper' : 'withoutWallpaper';
    const themeMode = isLight ? 'light' : 'dark';
    return componentStyles[wallpaperState][themeMode];
  }
  
  return '';
}

