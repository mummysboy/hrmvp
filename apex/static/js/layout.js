/**
 * Apex Layout Manager
 * Handles sidebar toggle, user menu, and layout interactions
 */

const ApexLayout = {
  /**
   * Initialize layout components
   */
  init() {
    // Setup hamburger menu toggle
    const hamburger = document.querySelector('.apex-hamburger');
    if (hamburger) {
      hamburger.addEventListener('click', () => this.toggleSidebar());
    }

    // Setup user menu (for future dropdown)
    const userMenu = document.querySelector('.apex-user-menu');
    if (userMenu) {
      userMenu.addEventListener('click', () => this.handleUserMenuClick());
    }

    // Close sidebar when clicking outside on mobile
    if (window.innerWidth <= 768) {
      document.addEventListener('click', (e) => {
        const sidebar = document.querySelector('.apex-sidebar');
        const hamburger = document.querySelector('.apex-hamburger');
        if (sidebar && hamburger && !sidebar.classList.contains('collapsed')) {
          if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
            this.toggleSidebar();
          }
        }
      });
    }

    // Handle window resize
    window.addEventListener('resize', () => this.handleResize());

    // Load saved sidebar state
    this.loadSidebarState();

    // Sidebar link events (bind once)
    const requestsLink = document.querySelector('.apex-sidebar-link[data-page="requests"]');
    if (requestsLink && !requestsLink.hasAttribute('data-bound')) {
      requestsLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (typeof loadInPlace === 'function') {
          loadInPlace('requests-list.html');
        } else {
          window.location.href = 'requests-list.html';
        }
      });
      requestsLink.setAttribute('data-bound', 'true');
    }
    const directoryLink = document.querySelector('.apex-sidebar-link[data-page="directory"]');
    if (directoryLink && !directoryLink.hasAttribute('data-bound')) {
      directoryLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (typeof loadInPlace === 'function') {
          loadInPlace('../../index.html#/people/directory');
          setTimeout(() => {
            const iframe = document.querySelector('.apex-content iframe');
            if (!iframe || !iframe.contentWindow) {
              window.location.href = '../../index.html?embed=true#/people/directory';
            }
          }, 1200);
        } else {
          window.location.href = '../../index.html?embed=true#/people/directory';
        }
        if (typeof ApexLayout !== 'undefined') {
          ApexLayout.setActiveItem('directory');
        }
      });
      directoryLink.setAttribute('data-bound', 'true');
    }
  },

  /**
   * Toggle sidebar visibility
   */
  toggleSidebar() {
    const sidebar = document.querySelector('.apex-sidebar');
    const content = document.querySelector('.apex-content');
    if (sidebar && content) {
      const wasCollapsed = sidebar.classList.contains('collapsed');
      
      if (!wasCollapsed) {
        // Collapsing sidebar - shift left with transform only
        sidebar.classList.add('collapsed');
        content.classList.add('content-centered');
        this.saveSidebarState(true);
      } else {
        // Opening sidebar - restore smoothly
        sidebar.classList.remove('collapsed');
        content.classList.remove('content-centered');
        this.saveSidebarState(false);
      }
    }
  },

  /**
   * Handle user menu click (placeholder for dropdown)
   */
  handleUserMenuClick() {
    // TODO: Implement user dropdown menu
    console.log('User menu clicked');
  },

  /**
   * Handle window resize
   */
  handleResize() {
    const sidebar = document.querySelector('.apex-sidebar');
    const content = document.querySelector('.apex-content');
    if (sidebar) {
      if (window.innerWidth > 768) {
        // On desktop, restore from saved state or show by default
        const collapsed = localStorage.getItem('apex-sidebar-collapsed') === 'true';
        if (collapsed) {
          sidebar.classList.add('collapsed');
          if (content) content.classList.add('content-centered');
        } else {
          sidebar.classList.remove('collapsed');
          if (content) content.classList.remove('content-centered');
        }
      } else {
        // On mobile, keep collapsed
        sidebar.classList.add('collapsed');
        if (content) content.classList.add('content-centered');
      }
    }
  },

  /**
   * Save sidebar state to localStorage
   */
  saveSidebarState(collapsed) {
    try {
      localStorage.setItem('apex-sidebar-collapsed', collapsed ? 'true' : 'false');
    } catch (e) {
      console.warn('Could not save sidebar state:', e);
    }
  },

  /**
   * Load sidebar state from localStorage
   */
  loadSidebarState() {
    try {
      const sidebar = document.querySelector('.apex-sidebar');
      const content = document.querySelector('.apex-content');
      if (sidebar && content) {
        let isCollapsed = false;
        // On mobile, start collapsed; on desktop, use saved state or default to expanded
        if (window.innerWidth <= 768) {
          sidebar.classList.add('collapsed');
          isCollapsed = true;
        } else {
          isCollapsed = localStorage.getItem('apex-sidebar-collapsed') === 'true';
          if (isCollapsed) {
            sidebar.classList.add('collapsed');
          } else {
            sidebar.classList.remove('collapsed');
          }
        }
        
        // Update content centered state
        if (isCollapsed && window.innerWidth > 768) {
          content.classList.add('content-centered');
        } else if (!isCollapsed) {
          content.classList.remove('content-centered');
        }
      }
    } catch (e) {
      console.warn('Could not load sidebar state:', e);
    }
  },

  /**
   * Set active sidebar item
   */
  setActiveItem(pageName) {
    const sidebarLinks = document.querySelectorAll('.apex-sidebar-link');
    sidebarLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-page') === pageName || 
          link.href && link.href.includes(pageName)) {
        link.classList.add('active');
      }
    });
  }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ApexLayout.init());
} else {
  ApexLayout.init();
}

// Expose globally
window.ApexLayout = ApexLayout;

