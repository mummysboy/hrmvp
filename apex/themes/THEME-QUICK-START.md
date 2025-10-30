# 🚀 Theme System Quick Start

## TL;DR - Get Themes Working in 5 Minutes

### **Step 1: Upload Files to APEX**
- Go to: **Shared Components** → **Static Application Files**
- Upload all `.css` files from `apex/themes/`
- Upload `theme-manager.js` from `apex/static/js/`

### **Step 2: Add to Your APEX Page**
In your page template or page HTML header:

```html
<!-- Base styles -->
<link rel="stylesheet" href="#APP_IMAGES#design-system.css">

<!-- All themes (you only need the ones you want) -->
<link rel="stylesheet" href="#APP_IMAGES#theme-modern-minimal.css">
<link rel="stylesheet" href="#APP_IMAGES#theme-warm-earth.css">
<link rel="stylesheet" href="#APP_IMAGES#theme-ocean-breeze.css">
<link rel="stylesheet" href="#APP_IMAGES#theme-forest-green.css">
<link rel="stylesheet" href="#APP_IMAGES#theme-vibrant-tech.css">
<link rel="stylesheet" href="#APP_IMAGES#theme-professional-navy.css">
<link rel="stylesheet" href="#APP_IMAGES#theme-sunset-coral.css">

<!-- Theme manager (required) -->
<script src="#APP_IMAGES#theme-manager.js"></script>
```

### **Step 3: Create a Theme Selector**
Add this HTML region to your page:

```html
<div style="padding: 1rem; background: var(--color-bg-secondary); border-radius: var(--radius-lg); margin-bottom: 2rem;">
  <label for="theme-select" style="font-weight: 600; margin-right: 1rem;">Change Theme:</label>
  <select id="theme-select" style="padding: 0.5rem; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
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
  
  // Load and set initial value
  selectElement.value = ThemeManager.getCurrentTheme();
  
  // Handle theme changes
  selectElement.addEventListener('change', (e) => {
    ThemeManager.setTheme(e.target.value);
  });
</script>
```

### **Step 4: Test It!**
Open your APEX app and try selecting different themes from the dropdown. Theme preference will automatically save!

---

## 🎨 All Available Themes

| Theme | Class | Vibe | Best For |
|-------|-------|------|----------|
| **Default** | `theme-default` | Modern, colorful | Default choice |
| **Modern Minimal** | `theme-modern-minimal` | Clean, corporate | Enterprise |
| **Warm Earth** | `theme-warm-earth` | Friendly, approachable | Human-focused |
| **Ocean Breeze** | `theme-ocean-breeze` | Calm, professional | Healthcare, Education |
| **Forest Green** | `theme-forest-green` | Natural, growth | Sustainability, Wellness |
| **Vibrant Tech** | `theme-vibrant-tech` | Bold, energetic | Tech companies |
| **Professional Navy** | `theme-professional-navy` | Executive, formal | C-suite, Government |
| **Sunset Coral** | `theme-sunset-coral` | Warm, inviting | Creative, Modern |

---

## 💡 Common Use Cases

### **Use Case 1: Let Users Choose Their Theme**
```javascript
// User selects theme from dropdown
ThemeManager.setTheme('theme-ocean-breeze');

// Theme is automatically saved to localStorage
// When they return, their choice is remembered!
```

### **Use Case 2: Set a Specific Theme for Your Organization**
```javascript
// In page template or global JavaScript
// Force all users to use Modern Minimal
ThemeManager.setTheme('theme-modern-minimal');
```

### **Use Case 3: Admin Can Set Default Theme**
```sql
-- Store user's theme preference in database
UPDATE t_users 
SET preferred_theme = 'theme-professional-navy' 
WHERE user_id = :current_user;
```

```javascript
// Load on page load
const userTheme = /* Get from database */;
ThemeManager.setTheme(userTheme);
```

### **Use Case 4: Dynamic Theme Based on Department**
```javascript
// Set theme based on user department
const departments = {
  'HR': 'theme-warm-earth',
  'Finance': 'theme-professional-navy',
  'IT': 'theme-vibrant-tech',
  'Operations': 'theme-ocean-breeze'
};

const dept = /* Get user's department */;
ThemeManager.setTheme(departments[dept]);
```

---

## 📋 File Checklist

You should have these 8 files in `/apex/themes/`:

- ✅ `theme-modern-minimal.css`
- ✅ `theme-warm-earth.css`
- ✅ `theme-ocean-breeze.css`
- ✅ `theme-forest-green.css`
- ✅ `theme-vibrant-tech.css`
- ✅ `theme-professional-navy.css`
- ✅ `theme-sunset-coral.css`
- ✅ `THEMES-README.md` (documentation)

And in `/apex/static/js/`:
- ✅ `theme-manager.js`

---

## 🔧 API Reference

### **ThemeManager.setTheme(themeName)**
Switch to a specific theme and save preference.
```javascript
ThemeManager.setTheme('theme-ocean-breeze');
```

### **ThemeManager.getCurrentTheme()**
Get the currently active theme.
```javascript
const current = ThemeManager.getCurrentTheme();
console.log(current); // 'theme-ocean-breeze'
```

### **ThemeManager.getAvailableThemes()**
Get all available themes as an object.
```javascript
const themes = ThemeManager.getAvailableThemes();
// Returns: { 'theme-default': 'Default (Lavender)', ... }
```

### **ThemeManager.reset()**
Reset to default theme.
```javascript
ThemeManager.reset();
```

### **ThemeManager.toggleNext()**
Cycle to the next theme (useful for demo mode).
```javascript
ThemeManager.toggleNext();
```

### **Listen for Theme Changes**
React to theme changes in your code.
```javascript
window.addEventListener('themeChanged', (event) => {
  console.log('Theme changed to:', event.detail.theme);
  console.log('Label:', event.detail.label);
  // Do something when theme changes
});
```

---

## 🌙 Dark Mode

All themes automatically support dark mode. It activates when:
- User's OS is set to dark mode
- Browser's `prefers-color-scheme: dark` is active

No setup needed - it just works!

To test:
1. Open DevTools → 3 dots → More tools → Rendering
2. Toggle "Emulate CSS media feature prefers-color-scheme"

---

## ❌ Troubleshooting

**Theme selector doesn't work:**
- ✅ Make sure all CSS files are uploaded to APEX Static Files
- ✅ Check file names match exactly (case-sensitive)
- ✅ Verify `theme-manager.js` is included in your page

**Theme doesn't persist:**
- ✅ Check browser console for errors (F12)
- ✅ Make sure localStorage is enabled
- ✅ Try a different browser

**Themes look off:**
- ✅ Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- ✅ Clear browser cache
- ✅ Clear localStorage: `localStorage.clear()`

**Theme CSS not loading:**
- ✅ Check that all `.css` files are in Static Application Files
- ✅ Verify the href path in your HTML matches the file names
- ✅ Use browser DevTools to verify CSS is loading

---

## 🎯 Next Steps

1. ✅ Upload theme files to APEX
2. ✅ Create theme selector UI on your dashboard
3. ✅ Test all themes to make sure they work
4. ✅ Customize themes for your brand (optional)
5. ✅ Educate users on how to switch themes

Done! Your users can now enjoy beautiful, customizable themes! 🎨

---

Need help? See `THEMES-README.md` for detailed documentation.



