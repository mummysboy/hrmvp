// Accessible right-side drawer with focus trap

let lastFocused = null;
let currentDrawer = null;

export function openDrawer({ title = '', content = '', width = 480, labelledById } = {}) {
  closeDrawer();
  lastFocused = document.activeElement;

  const overlay = document.createElement('div');
  overlay.className = 'drawer-overlay';
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.background = 'rgba(0,0,0,0.3)';
  overlay.style.zIndex = '1400';
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeDrawer();
  });

  const drawer = document.createElement('div');
  drawer.className = 'drawer';
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.style.width = `${width}px`;

  const headerId = labelledById || `drawer-title-${Date.now()}`;
  drawer.setAttribute('aria-labelledby', headerId);

  drawer.innerHTML = `
    <div class="drawer-header">
      <h2 id="${headerId}">${title}</h2>
      <button class="drawer-close" aria-label="Close">&times;</button>
    </div>
    <div class="drawer-body">${content}</div>
  `;

  overlay.appendChild(drawer);
  document.body.appendChild(overlay);
  currentDrawer = overlay;

  // Close handlers
  drawer.querySelector('.drawer-close').addEventListener('click', () => closeDrawer());
  window.addEventListener('keydown', escToClose, { once: true });

  // Focus trap
  trapFocus(drawer);
}

export function closeDrawer() {
  if (currentDrawer) {
    currentDrawer.remove();
    currentDrawer = null;
  }
  if (lastFocused && typeof lastFocused.focus === 'function') {
    lastFocused.focus();
  }
}

function escToClose(e) {
  if (e.key === 'Escape') {
    closeDrawer();
  }
}

function trapFocus(container) {
  const focusable = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  first.focus();

  container.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

export function drawerTabs(tabs = []) {
  // tabs: [{ id, label, content }] -> returns HTML string
  const tabId = `tabs-${Date.now()}`;
  const headers = tabs.map((t, i) => `
    <button role="tab" aria-selected="${i === 0 ? 'true' : 'false'}" aria-controls="${tabId}-panel-${t.id}" id="${tabId}-tab-${t.id}" tabindex="${i === 0 ? '0' : '-1'}" class="drawer-tab">${t.label}</button>
  `).join('');
  const panels = tabs.map((t, i) => `
    <div role="tabpanel" id="${tabId}-panel-${t.id}" aria-labelledby="${tabId}-tab-${t.id}" class="drawer-tabpanel" ${i === 0 ? '' : 'hidden'}>
      ${typeof t.content === 'function' ? t.content() : t.content}
    </div>
  `).join('');
  const html = `
    <div role="tablist" aria-label="Profile sections" class="drawer-tabs">${headers}</div>
    ${panels}
  `;
  // Attach behavior after insertion
  queueMicrotask(() => {
    const container = document.querySelector('.drawer .drawer-body');
    if (!container) return;
    const tabButtons = Array.from(container.querySelectorAll(`#${CSS.escape(tabId)} .drawer-tab, .drawer-tabs .drawer-tab`));
    const panelsEls = tabs.map(t => container.querySelector(`#${tabId}-panel-${t.id}`));
    const onKey = (e) => {
      const current = tabButtons.findIndex(b => b.getAttribute('aria-selected') === 'true');
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const next = e.key === 'ArrowRight' ? (current + 1) % tabButtons.length : (current - 1 + tabButtons.length) % tabButtons.length;
        activate(next);
      }
    };
    const activate = (index) => {
      tabButtons.forEach((btn, i) => {
        const selected = i === index;
        btn.setAttribute('aria-selected', selected ? 'true' : 'false');
        btn.setAttribute('tabindex', selected ? '0' : '-1');
        panelsEls[i]?.toggleAttribute('hidden', !selected);
      });
      tabButtons[index].focus();
    };
    tabButtons.forEach((btn, i) => {
      btn.addEventListener('click', () => activate(i));
      btn.addEventListener('keydown', onKey);
    });
  });
  return html;
}


