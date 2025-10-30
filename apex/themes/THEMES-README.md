# 🎨 Theme System Documentation

## Overview

Your HR System comes with **6 pre-built themes** that you can easily switch between. Each theme overrides the CSS variables defined in `design-system.css` to provide a completely different look and feel.

---

## 📋 Available Themes

### 1. **Default** (Lavender)
- **File:** Base `design-system.css`
- **Description:** The original design with lavender and sky blue accents
- **Best for:** Modern HR applications
- **Class:** `theme-default` (or no class)

### 2. **Modern Minimal** 
- **File:** `theme-modern-minimal.css`
- **Colors:** Slate/Indigo with subtle accents
- **Vibe:** Clean, corporate, professional
- **Best for:** Enterprise HR systems, formal environments
- **Class:** `theme-modern-minimal`
- **Color Palette:**
  - Primary: Indigo (#6366F1)
  - Secondary: Light Indigo (#818CF8)
  - Success: Emerald (#10B981)

### 3. **Warm Earth**
- **File:** `theme-warm-earth.css`
- **Colors:** Warm oranges, browns, natural greens
- **Vibe:** Friendly, approachable, welcoming
- **Best for:** HR systems that want a human touch
- **Class:** `theme-warm-earth`
- **Color Palette:**
  - Primary: Warm Amber (#D97706)
  - Secondary: Gold (#F59E0B)
  - Success: Lime Green (#84CC16)

### 4. **Ocean Breeze**
- **File:** `theme-ocean-breeze.css`
- **Colors:** Ocean blues, teals, calm tones
- **Vibe:** Professional, calming, trustworthy
- **Best for:** Healthcare HR, educational institutions
- **Class:** `theme-ocean-breeze`
- **Color Palette:**
  - Primary: Ocean Blue (#0369A1)
  - Secondary: Cyan (#06B6D4)
  - Success: Teal (#059669)

### 5. **Forest Green**
- **File:** `theme-forest-green.css`
- **Colors:** Deep greens, natural earth tones
- **Vibe:** Nature-inspired, growth-focused, sustainable
- **Best for:** Organizations focused on sustainability, wellness
- **Class:** `theme-forest-green`
- **Color Palette:**
  - Primary: Deep Forest Green (#047857)
  - Secondary: Emerald (#10B981)
  - Success: Green (#059669)

### 6. **Vibrant Tech**
- **File:** `theme-vibrant-tech.css`
- **Colors:** Neon magenta, cyan, green on dark background
- **Vibe:** Bold, energetic, modern tech company
- **Best for:** Tech startups, innovation-focused organizations
- **Class:** `theme-vibrant-tech`
- **Color Palette:**
  - Primary: Neon Magenta (#D946EF)
  - Secondary: Neon Cyan (#06B6D4)
  - Success: Neon Green (#22C55E)

### 7. **Professional Navy**
- **File:** `theme-professional-navy.css`
- **Colors:** Navy blue with gold accents
- **Vibe:** Executive, formal, prestigious
- **Best for:** C-suite dashboards, formal institutions
- **Class:** `theme-professional-navy`
- **Color Palette:**
  - Primary: Navy (#1E3A8A)
  - Secondary: Gold (#FBBF24)
  - Success: Dark Green (#065F46)

### 8. **Sunset Coral**
- **File:** `theme-sunset-coral.css`
- **Colors:** Coral pinks, warm oranges, sunset gradients
- **Vibe:** Warm, inviting, contemporary
- **Best for:** Creative organizations, modern HR tech
- **Class:** `theme-sunset-coral`
- **Color Palette:**
  - Primary: Warm Orange (#F97316)
  - Secondary: Coral Pink (#FB7185)
  - Success: Deep Orange (#EA580C)

---

## 🚀 How to Use Themes

### **Method 1: Using the Theme Manager (Recommended)**

#### In JavaScript (APEX Dynamic Actions):

```javascript
// Set a specific theme
ThemeManager.setTheme('theme-ocean-breeze');

// Get current theme
const current = ThemeManager.getCurrentTheme();

// Get all available themes
const allThemes = ThemeManager.getAvailableThemes();

// Reset to default
ThemeManager.reset();

// Cycle to next theme
ThemeManager.toggleNext();
```

#### Listen for Theme Changes:

```javascript
window.addEventListener('themeChanged', (event) => {
  console.log('New theme:', event.detail.theme);
  console.log('Theme label:', event.detail.label);
});
```

### **Method 2: Manual CSS Class (Simple)**

Add the theme class directly to the `<html>` element:

```html
<!-- Default theme -->
<html>

<!-- Modern Minimal theme -->
<html class="theme-modern-minimal">

<!-- Ocean Breeze theme -->
<html class="theme-ocean-breeze">

<!-- Warm Earth theme -->
<html class="theme-warm-earth">
```

### **Method 3: HTML Attribute (APEX)**

In APEX Page Designer, set the HTML class in the page properties:

```
Page > Appearance > Page Template Options > Add Classes
```

Then enter: `theme-modern-minimal` (or any other theme class)

---

## 📱 Creating a Theme Selector UI

### **Example HTML Component:**

```html
<div class="theme-selector">
  <label for="theme-select">Select Theme:</label>
  <select id="theme-select">
    <option value="theme-default">Default (Lavender)</option>
    <option value="theme-modern-minimal">Modern Minimal</option>
    <option value="theme-warm-earth">Warm Earth</option>
    <option value="theme-ocean-breeze">Ocean Breeze</option>
    <option value="theme-forest-green">Forest Green</option>
    <option value="theme-vibrant-tech">Vibrant Tech</option>
    <option value="theme-professional-navy">Professional Navy</option>
    <option value="theme-sunset-coral">Sunset Coral</option>
  </select>
</div>

<script>
  const selectElement = document.getElementById('theme-select');
  
  // Load saved theme
  selectElement.value = ThemeManager.getCurrentTheme();
  
  // Handle changes
  selectElement.addEventListener('change', (e) => {
    ThemeManager.setTheme(e.target.value);
  });
</script>
```

### **Example with Dynamic Buttons:**

```html
<div class="theme-buttons">
  <button onclick="ThemeManager.setTheme('theme-default')">Default</button>
  <button onclick="ThemeManager.setTheme('theme-modern-minimal')">Minimal</button>
  <button onclick="ThemeManager.setTheme('theme-ocean-breeze')">Ocean</button>
  <button onclick="ThemeManager.setTheme('theme-forest-green')">Forest</button>
  <button onclick="ThemeManager.setTheme('theme-vibrant-tech')">Tech</button>
  <button onclick="ThemeManager.toggleNext()">Next Theme →</button>
</div>
```

---

## ⚙️ Installation & Setup

### **Step 1: Include the Files**

In your APEX page template or page, link all necessary files:

```html
<!-- Base design system -->
<link rel="stylesheet" href="#APP_IMAGES#design-system.css">

<!-- All theme files (or only the ones you want to use) -->
<link rel="stylesheet" href="#APP_IMAGES#theme-modern-minimal.css">
<link rel="stylesheet" href="#APP_IMAGES#theme-warm-earth.css">
<link rel="stylesheet" href="#APP_IMAGES#theme-ocean-breeze.css">
<link rel="stylesheet" href="#APP_IMAGES#theme-forest-green.css">
<link rel="stylesheet" href="#APP_IMAGES#theme-vibrant-tech.css">
<link rel="stylesheet" href="#APP_IMAGES#theme-professional-navy.css">
<link rel="stylesheet" href="#APP_IMAGES#theme-sunset-coral.css">

<!-- Theme Manager -->
<script src="#APP_IMAGES#theme-manager.js"></script>
```

### **Step 2: Upload to APEX**

1. Go to **Shared Components** → **Static Application Files**
2. Upload all files from `/apex/themes/` and `/apex/static/css/`
3. File naming should match the CSS class names

### **Step 3: Use in Your Pages**

#### Option A: Programmatically (in APEX Dynamic Action)
```javascript
ThemeManager.setTheme('theme-ocean-breeze');
```

#### Option B: In Page Template
```html
<html class="theme-ocean-breeze">
```

#### Option C: Create a Settings Page
Let users pick their preferred theme, then store it in `localStorage`

---

## 🎨 Creating Your Own Custom Theme

### **Step 1: Create a New CSS File**

Create a file like `theme-custom.css`:

```css
/**
 * Custom Company Theme
 * Use: Add class="theme-custom" to <html> element
 */

:root.theme-custom {
  /* Override the design tokens */
  --color-accent-primary: #YOUR_COLOR;
  --color-accent-secondary: #YOUR_COLOR;
  /* ... etc ... */
}

@media (prefers-color-scheme: dark) {
  :root.theme-custom {
    /* Dark mode overrides */
  }
}
```

### **Step 2: Reference the Colors**

Pick colors from a palette like:
- [Tailwind Colors](https://tailwindcss.com/docs/customizing-colors)
- [Coolors.co](https://coolors.co)
- [Color Hunt](https://colorhunt.co)

### **Step 3: Test It**

1. Upload the CSS file to APEX
2. Test with: `ThemeManager.setTheme('theme-custom')`
3. Check both light and dark modes

### **Step 4: Add to Theme Manager**

Update `theme-manager.js` to include your theme in the `themes` object:

```javascript
const themes = {
  // ... existing themes ...
  'theme-custom': 'My Custom Theme',
};
```

---

## 🔄 Theme Persistence

### **How It Works**

1. When a user selects a theme, it's saved to `localStorage`
2. On page load, `ThemeManager.init()` restores the saved theme
3. Theme preference persists across sessions (until cleared)

### **Clear Theme Preference**

```javascript
localStorage.removeItem('hrm-theme-preference');
ThemeManager.reset(); // Resets to default
```

### **Switch Storage Method**

Change `STORAGE_TYPE` in `theme-manager.js`:
```javascript
const STORAGE_TYPE = 'sessionStorage'; // Session-only storage
```

---

## 🌙 Dark Mode Support

All themes include dark mode variants that automatically activate when:
- User's OS is set to dark mode, OR
- CSS `prefers-color-scheme: dark` media query is active

No special setup needed - it works automatically!

To override dark mode behavior:
```html
<!-- Force light mode -->
<html style="color-scheme: light">

<!-- Force dark mode -->
<html style="color-scheme: dark">
```

---

## 📊 Theme Variables Reference

All themes override these CSS variables:

```css
/* Colors */
--color-accent-primary
--color-accent-secondary
--color-accent-tertiary
--color-success
--color-warning
--color-danger
--color-info
--color-bg-primary
--color-bg-secondary
--color-bg-tertiary
--color-text-primary
--color-text-secondary
--color-text-tertiary
--color-border
--color-border-light
--color-border-dark
```

All other tokens (spacing, typography, shadows, etc.) remain unchanged from the base design system.

---

## ✅ Quick Checklist

- [ ] Upload all theme CSS files to APEX Static Files
- [ ] Include `theme-manager.js` in your page
- [ ] Test theme switching in your application
- [ ] Create theme selector UI (dropdown or buttons)
- [ ] Save user theme preference
- [ ] Test dark mode on each theme
- [ ] Customize themes for your brand (optional)

---

## 🎯 Tips & Best Practices

1. **Start with a theme close to your brand** - Pick the most similar one and customize
2. **Test accessibility** - Ensure good contrast ratios on light AND dark modes
3. **Be consistent** - Use the same theme across your entire application
4. **Respect user choice** - Persist and restore theme preference
5. **Provide theme switcher** - Let users choose their preferred theme
6. **Test on mobile** - Themes should work responsively
7. **Consider your audience** - Pick a theme that fits your organization's culture

---

## 📞 Support

For issues or customizations:
1. Check that all CSS files are uploaded to APEX
2. Verify class names match exactly (case-sensitive)
3. Clear browser cache and localStorage if themes don't update
4. Test in Firefox/Chrome/Safari to ensure cross-browser compatibility

---

**Last Updated:** January 2025  
**Version:** 1.0



