# Design Tokens Reference

**College HR System — Complete Design System Token Documentation**

All design tokens are defined as CSS custom properties in `/apex/static/css/design-system.css`.

---

## 📖 Table of Contents

1. [Typography](#typography)
2. [Color Palette](#color-palette)
3. [Spacing Scale](#spacing-scale)
4. [Border Radius](#border-radius)
5. [Shadows](#shadows)
6. [Transitions & Animations](#transitions--animations)
7. [Z-Index Scale](#z-index-scale)
8. [Component Classes](#component-classes)

---

## Typography

### Font Families

```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-secondary: 'Nunito Sans', sans-serif;
--font-accent: 'Manrope', sans-serif;
```

- **Primary (Inter):** Body text, paragraphs, descriptions
- **Secondary (Nunito Sans):** Alternate body font for variety
- **Accent (Manrope):** Buttons, labels, accents

### Font Sizes

```css
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 1.875rem;  /* 30px */
--font-size-4xl: 2.25rem;   /* 36px */
```

#### Usage Guide

| Token | HTML Element | Usage |
|-------|--------------|-------|
| `--font-size-4xl` | `<h1>` | Page titles |
| `--font-size-3xl` | `<h2>` | Section headings |
| `--font-size-2xl` | `<h3>` | Subsection headings |
| `--font-size-xl` | `<h4>`, `<h5>` | Card titles, form sections |
| `--font-size-lg` | `<h6>` | Minor headings |
| `--font-size-base` | `<p>`, `<body>` | Body text, default |
| `--font-size-sm` | `<small>`, labels | Helper text, captions |
| `--font-size-xs` | badges, tags | Small labels, metadata |

### Font Weights

```css
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Line Heights

```css
--line-height-tight: 1.2;      /* Headings */
--line-height-normal: 1.5;     /* Body text */
--line-height-relaxed: 1.75;   /* Accessibility-focused blocks */
```

---

## Color Palette

### Light Mode (Default)

#### Background Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-primary` | `#FAFAFA` | Main page background |
| `--color-bg-secondary` | `#F5F5F5` | Cards, containers |
| `--color-bg-tertiary` | `#EFEFEF` | Hover states, disabled backgrounds |

#### Text Colors

| Token | Value | Contrast | Usage |
|-------|-------|----------|-------|
| `--color-text-primary` | `#1E1E1E` | 18.5:1 | Headlines, main text |
| `--color-text-secondary` | `#5A5A5A` | 8.1:1 | Descriptions, metadata |
| `--color-text-tertiary` | `#888888` | 5.2:1 | Helper text, hints |

#### Accent Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-accent-primary` | `#E9B0FF` | Buttons, primary links, highlights |
| `--color-accent-secondary` | `#A3D6FF` | Focus states, secondary actions |
| `--color-accent-tertiary` | `#FFD8A8` | Tertiary actions, badges |

#### Status Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-success` | `#6DD58C` | Approved, confirmed, active |
| `--color-warning` | `#FFD480` | Pending, caution, attention needed |
| `--color-danger` | `#FF7A7A` | Rejected, error, critical |
| `--color-info` | `#80D4FF` | Information, notifications |

#### Border Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-border` | `#E0E0E0` | Standard borders, dividers |
| `--color-border-light` | `#EDEDED` | Subtle dividers, light borders |
| `--color-border-dark` | `#CCCCCC` | Emphasized borders, focus states |

### Dark Mode

Automatically applied when `prefers-color-scheme: dark` is set.

```css
@media (prefers-color-scheme: dark) {
  --color-bg-primary: #1A1A1A;
  --color-bg-secondary: #242424;
  --color-bg-tertiary: #2E2E2E;
  
  --color-text-primary: #EAEAEA;
  --color-text-secondary: #B3B3B3;
  --color-text-tertiary: #808080;
  
  --color-border: #3A3A3A;
  --color-border-light: #303030;
  --color-border-dark: #454545;
  
  /* Accents remain vibrant for contrast */
  --color-accent-primary: #E9B0FF;
  --color-accent-secondary: #A3D6FF;
}
```

#### How to Use

```html
<!-- HTML automatically supports light/dark mode -->
<div class="card">This card changes color based on system preference</div>
```

```css
/* CSS automatically applies correct colors */
.card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
}
```

---

## Spacing Scale

Based on 4px increments (0.25rem base unit).

```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 2.5rem;   /* 40px */
--spacing-3xl: 3rem;     /* 48px */
--spacing-4xl: 4rem;     /* 64px */
```

### Usage Guide

| Token | Usage |
|-------|-------|
| `--spacing-xs` | Micro spacing: gaps between icon + text |
| `--spacing-sm` | Small gaps: between form inputs, badge padding |
| `--spacing-md` | Default: padding in cards, margin between sections |
| `--spacing-lg` | Medium: padding in modals, section margins |
| `--spacing-xl` | Large: outer padding on page containers |
| `--spacing-2xl` | Extra large: top-level section spacing |
| `--spacing-3xl` | Jumbo: between major page regions |
| `--spacing-4xl` | Maximum: between page sections |

### Utility Classes

```html
<!-- Margin utilities -->
<div class="mt-md">Top margin 16px</div>
<div class="mb-md">Bottom margin 16px</div>

<!-- Padding utilities -->
<div class="px-lg">Left + right padding 24px</div>
<div class="py-lg">Top + bottom padding 24px</div>

<!-- Gap for flexbox -->
<div class="flex gap-md">Flex items with 16px gap</div>
```

---

## Border Radius

```css
--radius-sm: 0.375rem;   /* 6px */
--radius-md: 0.75rem;    /* 12px */
--radius-lg: 1rem;       /* 16px */
--radius-xl: 1.5rem;     /* 24px */
--radius-2xl: 2rem;      /* 32px */
--radius-full: 9999px;   /* Pill shape */
```

### Usage Guide

| Token | Usage |
|-------|-------|
| `--radius-sm` | Input fields, badges, small elements |
| `--radius-md` | Tables, small modals, buttons |
| `--radius-lg` | Cards, default containers |
| `--radius-xl` | Large modals, expanded regions |
| `--radius-2xl` | Extra-large components |
| `--radius-full` | Buttons, avatars, badges (pill-shaped) |

```css
/* Example: Card with large radius */
.card {
  border-radius: var(--radius-lg);
}

/* Example: Pill button */
.btn {
  border-radius: var(--radius-full);
}
```

---

## Shadows

### Shadow Elevation Scale

```css
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
--shadow-xl: 0 12px 32px rgba(0, 0, 0, 0.16);
```

### Usage Guide

| Token | Elevation | Usage |
|-------|-----------|-------|
| `--shadow-xs` | 1 | Subtle: table rows, minimal elevation |
| `--shadow-sm` | 2 | Default: cards, buttons |
| `--shadow-md` | 3 | Hover: card hover, raised states |
| `--shadow-lg` | 4 | Modals, dropdowns, overlays |
| `--shadow-xl` | 5 | Floating modals, top-level overlays |

```css
/* Example: Card with default shadow, enhanced on hover */
.card {
  box-shadow: var(--shadow-sm);
}
.card:hover {
  box-shadow: var(--shadow-md);
}

/* Example: Modal with high elevation */
.modal {
  box-shadow: var(--shadow-xl);
}
```

---

## Transitions & Animations

### Transition Speeds

```css
--transition-fast: 150ms ease-in-out;
--transition-base: 250ms ease-in-out;
--transition-slow: 350ms ease-in-out;
```

### Usage Guide

| Token | Use Case |
|-------|----------|
| `--transition-fast` | Quick feedback: button hover, icon changes |
| `--transition-base` | Default: modal open, color changes |
| `--transition-slow` | Extended: progress bars, multi-step animations |

```css
/* Example: Button hover animation */
.btn {
  transition: all var(--transition-fast);
}
.btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Example: Modal appearance */
.modal {
  animation: slideUp var(--transition-base) ease-out;
}
```

### Built-in Animations

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

---

## Z-Index Scale

```css
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal: 1040;
--z-popover: 1050;
--z-tooltip: 1070;
```

### Usage Guide

| Token | Value | Usage |
|-------|-------|-------|
| `--z-dropdown` | 1000 | Dropdowns, select menus |
| `--z-sticky` | 1020 | Sticky headers, fixed nav |
| `--z-fixed` | 1030 | Fixed positioning, toolbars |
| `--z-modal` | 1040 | Modal backdrops |
| `--z-popover` | 1050 | Popovers, tooltips |
| `--z-tooltip` | 1070 | Floating tooltips, notifications |

```css
/* Example: Modal with proper layering */
.modal-backdrop {
  z-index: var(--z-modal);
}
.toast {
  z-index: var(--z-tooltip);
}
```

---

## Component Classes

### Button Classes

```css
.btn /* Base button styles */
.btn-primary /* Gradient lavender-to-blue */
.btn-secondary /* Neutral background */
.btn-success /* Green background */
.btn-danger /* Red background */
.btn-ghost /* Transparent with border */
.btn-sm /* Small size */
.btn-lg /* Large size */
.btn-block /* Full width */
```

### Card Classes

```css
.card /* Base card */
.card-elevated /* Enhanced shadow */
.card-header /* Title section with bottom border */
.card-body /* Content area */
.card-footer /* Action buttons section */
.card-title /* Card heading */
.card-subtitle /* Secondary heading */
```

### Form Classes

```css
.form-group /* Wrapper for input + label */
.label-required /* Adds red asterisk */
.form-error /* Error message styling */
.form-help /* Helper text styling */
```

### Modal Classes

```css
.modal-backdrop /* Semi-transparent overlay */
.modal /* Modal container */
.modal-header /* Header with title + close */
.modal-body /* Content area */
.modal-footer /* Action buttons */
.modal-title /* Modal heading */
.modal-close /* Close button */
```

### Utility Classes

```css
.text-center /* Text align center */
.text-right /* Text align right */
.text-muted /* Muted text color */
.text-accent /* Primary accent color */
.text-success /* Success color */
.text-danger /* Danger color */
.font-semibold /* Semibold weight */
.font-bold /* Bold weight */
.flex /* Display flex */
.flex-center /* Flex centered */
.flex-between /* Flex space-between */
.gap-md /* Gap for flex items */
```

### Grid Classes

```css
.grid /* Base grid */
.grid-1 /* 1 column */
.grid-2 /* Auto 2 columns (responsive) */
.grid-3 /* Auto 3 columns (responsive) */
.grid-4 /* Auto 4 columns (responsive) */
```

---

## 🎯 Best Practices

### Do's ✅

- Use CSS custom properties for all colors, spacing, and sizing
- Reference tokens in CSS — never hard-code values
- Test components in both light and dark mode
- Maintain consistent spacing using the spacing scale
- Use semantic color meanings (success = green, danger = red)

### Don'ts ❌

- Hard-code hex colors directly in CSS
- Mix spacing scales (e.g., combining 12px with 16px)
- Create component-specific colors — use the palette
- Use inline styles in HTML
- Ignore dark mode support

### Example: Correct Usage

```css
/* ✅ CORRECT: Uses design tokens */
.card {
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
```

```css
/* ❌ INCORRECT: Hard-coded values */
.card {
  background-color: #F5F5F5;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
```

---

## 📖 Import in APEX

To use the design system in an APEX page:

1. Add CSS file to **Shared Components** → **Static Application Files**
2. Link in page template or region:
   ```html
   <link rel="stylesheet" href="#APP_IMAGES#design-system.css">
   ```

3. Reference in custom CSS:
   ```css
   .my-component {
     background: var(--color-bg-secondary);
     padding: var(--spacing-lg);
   }
   ```

---

**Last Updated:** January 2025  
**Version:** 1.0
