// Modal system
export function showModal({ title, content, onConfirm, onCancel }) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'modal-title');
  
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2 id="modal-title" class="modal-title">${title}</h2>
        <button class="modal-close" aria-label="Close">×</button>
      </div>
      <div class="modal-body">
        ${content}
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  
  const modal = overlay.querySelector('.modal');
  const closeBtn = overlay.querySelector('.modal-close');
  
  const cleanup = () => {
    overlay.style.animation = 'fadeIn var(--transition) reverse';
    setTimeout(() => {
      overlay.remove();
      document.body.style.overflow = '';
    }, 200);
  };
  
  closeBtn.addEventListener('click', cleanup);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) cleanup();
  });
  
  // ESC key
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      cleanup();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
  
  // Focus trap
  const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const firstFocusable = focusable[0];
  const lastFocusable = focusable[focusable.length - 1];
  
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  });
  
  if (firstFocusable) firstFocusable.focus();
  
  // Return cleanup function for manual closing
  return cleanup;
}

export function showConfirmModal({ title, message, onConfirm, onCancel }) {
  const content = `
    <p>${message}</p>
    <div class="flex gap-2 mt-3" style="justify-content: flex-end;">
      <button class="btn btn-secondary" data-action="cancel">Cancel</button>
      <button class="btn btn-primary" data-action="confirm">Confirm</button>
    </div>
  `;
  
  return showModal({
    title,
    content,
    onConfirm,
    onCancel
  });
}

// Fade out and remove all open modals (with overlay)
export function closeAllModals() {
  const overlays = Array.from(document.querySelectorAll('.modal-overlay'));
  overlays.forEach((overlay) => {
    overlay.style.animation = 'fadeIn var(--transition) reverse';
  });
  if (overlays.length > 0) {
    setTimeout(() => overlays.forEach(o => o.remove()), 200);
    document.body.style.overflow = '';
  }
}

// Helper to attach modal handlers
export function attachModalHandlers(modal, onConfirm, onCancel) {
  const confirmBtn = modal.querySelector('[data-action="confirm"]');
  const cancelBtn = modal.querySelector('[data-action="cancel"]');
  
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (onConfirm) onConfirm();
      // Modal will be cleaned up by showModal
    });
  }
  
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      if (onCancel) onCancel();
      // Modal will be cleaned up by showModal
    });
  }
}


