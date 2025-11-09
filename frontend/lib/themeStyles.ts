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
      translucent: string;
    };
    withoutWallpaper: {
      light: string;
      dark: string;
      translucent: string;
    };
  };
  panel: {
    withWallpaper: {
      light: string;
      dark: string;
      translucent: string;
    };
    withoutWallpaper: {
      light: string;
      dark: string;
      translucent: string;
    };
  };
  input: {
    withWallpaper: {
      light: string;
      dark: string;
      translucent: string;
    };
    withoutWallpaper: {
      light: string;
      dark: string;
      translucent: string;
    };
  };
  button: {
    base: {
      withWallpaper: {
        light: string;
        dark: string;
        translucent: string;
      };
      withoutWallpaper: {
        light: string;
        dark: string;
        translucent: string;
      };
    };
    active: {
      withWallpaper: {
        light: string;
        dark: string;
        translucent: string;
      };
      withoutWallpaper: {
        light: string;
        dark: string;
        translucent: string;
      };
    };
  };
  text: {
    primary: {
      light: string;
      dark: string;
      translucent: string;
    };
    secondary: {
      light: string;
      dark: string;
      translucent: string;
    };
  };
  // Home page specific styles for better isolation
  homeActionButton: {
    withWallpaper: {
      light: string;
      dark: string;
      translucent: string;
    };
    withoutWallpaper: {
      light: string;
      dark: string;
      translucent: string;
    };
  };
  homeChatTile: {
    withWallpaper: {
      light: string;
      dark: string;
      translucent: string;
    };
    withoutWallpaper: {
      light: string;
      dark: string;
      translucent: string;
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
      dark: "bg-white/10 backdrop-blur-lg border border-white/10 hover:border-white/20 hover:bg-white/15 rounded-lg transition-all group cursor-pointer shadow-lg",
      translucent: "bg-white/10 backdrop-blur-lg border border-white/10 hover:border-white/20 hover:bg-white/15 rounded-lg transition-all group cursor-pointer shadow-lg"
    },
    withoutWallpaper: {
      light: "bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-md rounded-lg transition-all group cursor-pointer",
      dark: "bg-zinc-900/80 shadow-sm hover:shadow-md hover:bg-zinc-900/90 rounded-xl transition-all group cursor-pointer",
      translucent: "bg-white/[0.15] backdrop-blur-2xl border border-white/20 hover:border-white/30 hover:bg-white/[0.20] rounded-2xl transition-all group cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.18)]"
    }
  },
  
  panel: {
    withWallpaper: {
      light: "bg-white border border-zinc-200/50 rounded-xl p-4 shadow-xl",
      dark: "bg-zinc-900/95 backdrop-blur-xl border-2 border-white/30 rounded-xl p-4 shadow-2xl",
      translucent: "bg-zinc-900/95 backdrop-blur-xl border-2 border-white/30 rounded-xl p-4 shadow-2xl"
    },
    withoutWallpaper: {
      light: "bg-zinc-50 border border-zinc-300/40 rounded-xl p-4",
      dark: "bg-zinc-900/70 border border-zinc-950/80 rounded-xl p-4",
      translucent: "bg-zinc-900/70 backdrop-blur-xl border border-zinc-950/80 rounded-xl p-4"
    }
  },
  
  input: {
    withWallpaper: {
      light: "bg-white border border-zinc-300 rounded-3xl shadow-lg hover:shadow-xl transition-shadow",
      dark: "bg-zinc-800/95 backdrop-blur-sm border border-zinc-700 rounded-3xl shadow-lg hover:shadow-xl transition-shadow text-white",
      translucent: "bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow text-white"
    },
    withoutWallpaper: {
      light: "bg-white border border-zinc-300 rounded-3xl shadow-sm hover:shadow-md transition-shadow",
      dark: "bg-zinc-900/50 border border-zinc-700 rounded-3xl focus:border-zinc-600 focus:bg-zinc-900/70 text-white",
      translucent: "bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl focus:border-white/25 focus:bg-white/15 text-white shadow-xl"
    }
  },
  
  button: {
    base: {
      withWallpaper: {
        light: "bg-white border border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900 shadow-lg",
        dark: "bg-zinc-800/90 backdrop-blur-md shadow-xl border-2 border-white/30 hover:border-white/50 hover:bg-zinc-700/90 text-white font-semibold",
        translucent: "bg-white/10 backdrop-blur-xl border border-white/20 hover:border-white/25 hover:bg-white/15 text-white shadow-xl"
      },
      withoutWallpaper: {
        light: "border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900",
        dark: "border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800 hover:text-white",
        translucent: "border-white/20 backdrop-blur-xl text-white hover:border-white/25 hover:bg-white/10"
      }
    },
    active: {
      withWallpaper: {
        light: "bg-blue-600 border-blue-600 text-white font-semibold shadow-lg",
        dark: "bg-blue-500/40 border-2 border-blue-400 text-white font-bold shadow-xl backdrop-blur-md",
        translucent: "bg-blue-500/30 backdrop-blur-xl border border-blue-400/40 text-white font-bold shadow-2xl"
      },
      withoutWallpaper: {
        light: "border-blue-500 bg-blue-50 text-blue-700 font-semibold",
        dark: "border-zinc-600 bg-zinc-800 text-white",
        translucent: "border-blue-400/40 bg-blue-500/20 backdrop-blur-xl text-white shadow-xl"
      }
    }
  },
  
  text: {
    primary: {
      light: "text-zinc-900",
      dark: "text-white",
      translucent: "text-white"
    },
    secondary: {
      light: "text-zinc-700",
      dark: "text-zinc-400",
      translucent: "text-zinc-400"
    }
  },
  
  // Home page specific styles - isolated for better maintainability
  homeActionButton: {
    withWallpaper: {
      light: "bg-white/95 backdrop-blur-sm border border-zinc-300 hover:border-zinc-400 text-zinc-900 hover:bg-white shadow-lg hover:shadow-xl font-medium",
      dark: "bg-white/10 backdrop-blur-xl border border-white/20 hover:border-white/30 text-white hover:bg-white/15 shadow-xl hover:shadow-2xl font-medium",
      translucent: "bg-white/[0.15] backdrop-blur-2xl border border-white/20 hover:border-white/30 text-white hover:bg-white/[0.20] shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.18)] font-medium"
    },
    withoutWallpaper: {
      light: "bg-white border border-zinc-300 hover:border-zinc-400 text-zinc-900 hover:bg-zinc-50 shadow-sm hover:shadow-md font-medium",
      dark: "bg-zinc-900 border border-zinc-700 hover:border-zinc-600 text-white hover:bg-zinc-800 shadow-sm hover:shadow-md font-medium",
      translucent: "bg-white/[0.15] backdrop-blur-2xl border border-white/20 hover:border-white/30 text-white hover:bg-white/[0.20] shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.18)] font-medium"
    }
  },
  
  homeChatTile: {
    withWallpaper: {
      light: "bg-white/90 backdrop-blur-sm border border-zinc-200 hover:border-zinc-300 hover:shadow-md rounded-lg transition-all group cursor-pointer",
      dark: "bg-white/10 backdrop-blur-lg border border-white/10 hover:border-white/20 hover:bg-white/15 rounded-lg transition-all group cursor-pointer shadow-lg",
      translucent: "bg-white/10 backdrop-blur-lg border border-white/10 hover:border-white/20 hover:bg-white/15 rounded-lg transition-all group cursor-pointer shadow-lg"
    },
    withoutWallpaper: {
      light: "bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-md rounded-lg transition-all group cursor-pointer",
      dark: "bg-zinc-900/80 shadow-sm hover:shadow-md hover:bg-zinc-900/90 rounded-xl transition-all group cursor-pointer",
      translucent: "bg-white/[0.15] backdrop-blur-2xl border border-white/20 hover:border-white/30 hover:bg-white/[0.20] rounded-2xl transition-all group cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.18)]"
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
 * @param isTranslucent - Whether translucent theme is active
 * @returns The appropriate CSS classes for the current theme state
 */
export function getThemeStyle(
  component: keyof ThemeStyleConfig,
  hasWallpaper: boolean,
  isLight: boolean,
  variant?: string,
  isTranslucent?: boolean
): string {
  const componentStyles = themeStyles[component];
  
  // Handle text styles first (no wallpaper dependency)
  if (component === 'text' && variant) {
    const textConfig = componentStyles as ThemeStyleConfig['text'];
    if (variant === 'primary') {
      if (isTranslucent) return textConfig.primary.translucent;
      return isLight ? textConfig.primary.light : textConfig.primary.dark;
    }
    if (variant === 'secondary') {
      if (isTranslucent) return textConfig.secondary.translucent;
      return isLight ? textConfig.secondary.light : textConfig.secondary.dark;
    }
  }
  
  // Handle nested variants (like button.base or button.active)
  if (variant && typeof componentStyles === 'object' && variant in componentStyles) {
    const variantStyles = (componentStyles as any)[variant];
    const wallpaperState = hasWallpaper ? 'withWallpaper' : 'withoutWallpaper';
    const themeMode = isTranslucent ? 'translucent' : (isLight ? 'light' : 'dark');
    return variantStyles[wallpaperState][themeMode];
  }
  
  // Handle simple components (card, panel, input)
  if ('withWallpaper' in componentStyles) {
    const wallpaperState = hasWallpaper ? 'withWallpaper' : 'withoutWallpaper';
    const themeMode = isTranslucent ? 'translucent' : (isLight ? 'light' : 'dark');
    return componentStyles[wallpaperState][themeMode];
  }
  
  return '';
}

