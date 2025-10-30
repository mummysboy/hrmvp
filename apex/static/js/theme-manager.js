/**
 * Theme Manager
 * Handles loading, switching, and persisting theme preferences
 * Usage: ThemeManager.setTheme('theme-modern-minimal')
 */

const ThemeManager = (() => {
  const THEME_KEY = 'hrm-theme-preference';
  const STORAGE_TYPE = 'localStorage'; // Can switch to sessionStorage

  // Available themes
  const themes = {
    'theme-default': 'Default (Lavender)',
    'theme-modern-minimal': 'Modern Minimal (Corporate)',
    'theme-warm-earth': 'Warm Earth (Friendly)',
    'theme-ocean-breeze': 'Ocean Breeze (Calm)',
    'theme-forest-green': 'Forest Green (Natural)',
    'theme-vibrant-tech': 'Vibrant Tech (Bold)',
    'theme-professional-navy': 'Professional Navy (Executive)',
    'theme-sunset-coral': 'Sunset Coral (Inviting)',
  };

  /**
   * Initialize theme manager - load saved theme on page load
   */
  function init() {
    const savedTheme = getSavedTheme();
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }

  /**
   * Set theme by name
   * @param {string} themeName - Theme class name (e.g., 'theme-modern-minimal')
   */
  function setTheme(themeName) {
    if (!themes.hasOwnProperty(themeName)) {
      console.warn(`Theme "${themeName}" not found. Available themes:`, Object.keys(themes));
      return false;
    }

    const html = document.documentElement;

    // Remove all theme classes
    Object.keys(themes).forEach(theme => {
      html.classList.remove(theme);
    });

    // Add new theme class
    if (themeName !== 'theme-default') {
      html.classList.add(themeName);
    }

    // Persist preference
    saveTheme(themeName);

    // Dispatch custom event for observers
    window.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { theme: themeName, label: themes[themeName] }
    }));

    return true;
  }

  /**
   * Get current theme
   */
  function getCurrentTheme() {
    const html = document.documentElement;
    for (const theme of Object.keys(themes)) {
      if (html.classList.contains(theme)) {
        return theme;
      }
    }
    return 'theme-default';
  }

  /**
   * Get saved theme from storage
   */
  function getSavedTheme() {
    if (typeof window !== 'undefined' && window[STORAGE_TYPE]) {
      return window[STORAGE_TYPE].getItem(THEME_KEY);
    }
    return null;
  }

  /**
   * Save theme to storage
   */
  function saveTheme(themeName) {
    if (typeof window !== 'undefined' && window[STORAGE_TYPE]) {
      window[STORAGE_TYPE].setItem(THEME_KEY, themeName);
    }
  }

  /**
   * Get all available themes
   */
  function getAvailableThemes() {
    return { ...themes };
  }

  /**
   * Reset to default theme
   */
  function reset() {
    setTheme('theme-default');
  }

  /**
   * Toggle between themes (cycles through available themes)
   */
  function toggleNext() {
    const currentTheme = getCurrentTheme();
    const themeKeys = Object.keys(themes);
    const currentIndex = themeKeys.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setTheme(themeKeys[nextIndex]);
  }

  // Public API
  return {
    init,
    setTheme,
    getCurrentTheme,
    getSavedTheme,
    getAvailableThemes,
    reset,
    toggleNext,
    themes, // For reference
  };
})();

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ThemeManager.init);
} else {
  ThemeManager.init();
}



