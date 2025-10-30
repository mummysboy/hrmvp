// Sidebar navigation component
import { navigate } from '../router.js';

const menuConfig = [
  {
    id: 'home',
    label: 'Home',
    route: '/dashboard',
    icon: '🏠'
  },
  {
    id: 'requests-parent',
    label: 'My Requests',
    type: 'group',
    items: [
      { id: 'requests-new', label: 'New Position', route: '/requests/new-position', icon: '➕' },
      { id: 'requests-change', label: 'Change to Existing Employee', route: '/requests/change', icon: '📝' },
      { id: 'requests-leave', label: 'Sabbatical / Leave', route: '/requests/leave', icon: '🏖️' },
      { id: 'requests-offboard', label: 'Termination / Offboarding', route: '/requests/offboard', icon: '👋' },
      { id: 'requests-all', label: 'All Requests', route: '/requests', icon: '📋' },
      { id: 'requests-calendar', label: 'Calendar', route: '/requests/calendar', icon: '📅' }
    ]
  },
  {
    id: 'approvals-parent',
    label: 'Approvals',
    type: 'group',
    items: [
      { id: 'approvals-pending', label: 'Pending', route: '/approvals/pending', icon: '⏳' },
      { id: 'approvals-completed', label: 'Completed', route: '/approvals/completed', icon: '✅' }
    ]
  },
  {
    id: 'people-parent',
    label: 'People & Structure',
    type: 'group',
    items: [
      { id: 'people-directory', label: 'Directory', route: '/people/directory', icon: '👥' },
      { id: 'people-orgchart', label: 'Org Chart', route: '/people/orgchart', icon: '🌳' }
    ]
  },
  {
    id: 'budget-parent',
    label: 'Budget & Positions',
    type: 'group',
    items: [
      { id: 'budget-positions', label: 'Position Control', route: '/budget/positions', icon: '💼' },
      { id: 'budget-grants', label: 'Grant-Funded Roles', route: '/budget/grants', icon: '💰' }
    ]
  },
  {
    id: 'reports-parent',
    label: 'Reports',
    type: 'group',
    items: [
      { id: 'reports-summary', label: 'Summary', route: '/reports/summary', icon: '📊' },
      { id: 'reports-exports', label: 'Exports', route: '/reports/exports', icon: '📥' }
    ]
  },
  {
    id: 'settings-parent',
    label: 'Settings',
    type: 'group',
    items: [
      { id: 'settings-notifications', label: 'Notifications', route: '/settings/notifications', icon: '🔔' },
      { id: 'settings-delegation', label: 'Delegation / Proxy', route: '/settings/delegation', icon: '🔐' }
    ]
  }
];

let expandedMenus = new Set();

export function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  
  sidebar.innerHTML = menuConfig.map(item => {
    if (item.type === 'group') {
      return renderGroup(item);
    } else {
      return renderItem(item);
    }
  }).join('');
  
  attachEventListeners();
  
  // Restore expanded state
  expandedMenus.forEach(id => {
    const btn = sidebar.querySelector(`[data-menu-id="${id}"]`);
    const submenu = sidebar.querySelector(`[data-submenu-id="${id}"]`);
    if (btn && submenu) {
      btn.setAttribute('aria-expanded', 'true');
      submenu.classList.add('expanded');
    }
  });
}

function renderGroup(group) {
  return `
    <div class="sidebar-group">
      <div class="sidebar-item-parent">${group.label}</div>
      ${group.items.map((item, idx) => 
        idx === 0 ? `
          <button class="sidebar-item sidebar-item-toggle" 
                  data-menu-id="${group.id}"
                  data-route="${item.route}"
                  aria-expanded="false"
                  aria-controls="submenu-${group.id}">
            <span class="sidebar-item-icon">${item.icon}</span>
            <span>${item.label}</span>
          </button>
        ` : ''
      ).join('')}
      <div 
        class="sidebar-submenu" 
        id="submenu-${group.id}"
        data-submenu-id="${group.id}"
        role="region"
      >
        ${group.items.map((item, idx) => 
          idx > 0 ? `<div class="sidebar-item sidebar-submenu-item" data-route="${item.route}">
            <span class="sidebar-item-icon">${item.icon}</span>
            <span>${item.label}</span>
          </div>` : ''
        ).join('')}
      </div>
    </div>
  `;
}

function renderItem(item) {
  return `
    <button class="sidebar-item" data-route="${item.route}">
      <span class="sidebar-item-icon">${item.icon}</span>
      <span>${item.label}</span>
    </button>
  `;
}

function attachEventListeners() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  
  // Toggle buttons for groups
  sidebar.querySelectorAll('.sidebar-item-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const route = btn.getAttribute('data-route');
      if (route) {
        // If it has a route, navigate to it and avoid toggling to prevent flicker
        navigate(route);
        return;
      }
      // Also toggle the submenu
      toggleSubmenu(btn);
    });
    
    // Keyboard navigation
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
  
  // Click handlers for items (excluding toggles)
  sidebar.querySelectorAll('.sidebar-item[data-route]').forEach(item => {
    if (!item.classList.contains('sidebar-item-toggle')) {
      item.addEventListener('click', () => {
        const route = item.getAttribute('data-route');
        navigate(route);
      });
    }
  });
  
  // Arrow key navigation
  sidebar.addEventListener('keydown', handleKeyboardNavigation);
}

function toggleSubmenu(btn) {
  const sidebar = document.getElementById('sidebar');
  const menuId = btn.getAttribute('data-menu-id');
  const submenu = sidebar.querySelector(`[data-submenu-id="${menuId}"]`);
  const isExpanded = btn.getAttribute('aria-expanded') === 'true';
  
  btn.setAttribute('aria-expanded', !isExpanded);
  submenu.classList.toggle('expanded');
  
  if (!isExpanded) {
    expandedMenus.add(menuId);
  } else {
    expandedMenus.delete(menuId);
  }
}

function handleKeyboardNavigation(e) {
  const sidebar = document.getElementById('sidebar');
  const items = Array.from(sidebar.querySelectorAll('.sidebar-item'));
  const currentIndex = items.indexOf(document.activeElement);
  
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    const nextIndex = Math.min(currentIndex + 1, items.length - 1);
    items[nextIndex].focus();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    const prevIndex = Math.max(currentIndex - 1, 0);
    items[prevIndex].focus();
  }
}

export function updateActiveRoute(route) {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  
  // Remove all active states
  sidebar.querySelectorAll('.sidebar-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Find matching route and make it active
  const allRoutes = findAllRoutes();
  const matched = allRoutes.find(item => item.route === route);
  
  if (matched && matched.element) {
    matched.element.classList.add('active');
    
    // Expand parent if it's in a submenu
    const submenu = matched.element.closest('.sidebar-submenu');
    if (submenu && !submenu.classList.contains('expanded')) {
      const menuId = submenu.getAttribute('data-submenu-id');
      const btn = sidebar.querySelector(`[data-menu-id="${menuId}"]`);
      if (btn) {
        btn.setAttribute('aria-expanded', 'true');
        submenu.classList.add('expanded');
      }
    }
  }
}

function findAllRoutes() {
  const sidebar = document.getElementById('sidebar');
  const items = sidebar.querySelectorAll('.sidebar-item[data-route]');
  return Array.from(items).map(item => ({
    route: item.getAttribute('data-route'),
    element: item
  }));
}

