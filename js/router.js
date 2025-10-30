// Hash-based router
import { updateActiveRoute } from './ui/sidebar.js';

let routes = {};
let currentRoute = null;
let currentPage = null;

export function init(routeConfig) {
  routes = routeConfig;
  
  // Determine initial route: prefer current hash, then saved route, else dashboard
  const currentHash = window.location.hash.slice(1);
  const initialRoute = currentHash || localStorage.getItem('lastRoute') || '/dashboard';
  navigate(initialRoute, false);
  
  // Listen for hash changes
  window.addEventListener('hashchange', handleHashChange);
  
  // Handle back/forward buttons
  window.addEventListener('popstate', handleHashChange);
  // No immediate handleHashChange here; initial route already rendered
}

function handleHashChange() {
  const hash = window.location.hash.slice(1);
  navigate(hash || '/dashboard', false);
}

export function navigate(route, pushState = true) {
  if (route === currentRoute) return;
  
  // Cleanup current page
  if (currentPage && currentPage.cleanup) {
    currentPage.cleanup();
  }
  
  // Find matching route
  let matched = null;
  const routeKeys = Object.keys(routes);
  
  for (const key of routeKeys) {
    if (key === route || route.startsWith(key + '/')) {
      matched = key;
      break;
    }
  }
  
  if (!matched && routes['*']) {
    matched = '*';
  }
  
  if (!matched) {
    console.warn('No route found for:', route);
    navigate('/dashboard', pushState);
    return;
  }
  
  const pageFactory = routes[matched];
  const container = document.getElementById('app');
  
  if (!container) {
    console.error('App container not found');
    return;
  }
  
  // Extract params if needed
  const params = route.includes('/') && matched !== route
    ? route.split('/').slice(1)
    : [];
  
  // Smoothly transition content to avoid flicker during route changes
  const previousTransition = container.style.transition;
  container.style.transition = 'opacity 120ms ease';
  container.style.opacity = '0';

  // Render page
  currentRoute = route;
  currentPage = pageFactory();
  
  container.innerHTML = '';
  currentPage.render(container, params);
  
  // Update document title
  if (currentPage.title) {
    document.title = `${currentPage.title} - Harvard HR Portal`;
  }
  
  // Update active sidebar item
  updateActiveRoute(route);
  
  // Save route
  localStorage.setItem('lastRoute', route);
  
  // Update URL if needed (without hash for clean URLs in this SPA)
  if (pushState && window.location.hash !== `#${route}`) {
    window.history.pushState(null, '', `#${route}`);
  }
  
  // Scroll to top (instant to avoid flicker on heavy pages)
  window.scrollTo({ top: 0, behavior: 'auto' });

  // Reveal the new content after render
  requestAnimationFrame(() => {
    container.style.opacity = '1';
    // Restore any previous transition after the fade-in completes
    setTimeout(() => { container.style.transition = previousTransition; }, 150);
  });
}


