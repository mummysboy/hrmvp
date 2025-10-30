/**
 * College HR System - UI Utilities
 * Shared JavaScript utilities for common interactions
 */

const UIKit = {
  /**
   * Toast notification system
   */
  toast: {
    create(message, type = 'info', duration = 4000) {
      const toastId = `toast-${Date.now()}`;
      const toastEl = document.createElement('div');
      toastEl.id = toastId;
      toastEl.className = `toast toast-${type}`;
      toastEl.innerHTML = `
        <span>${message}</span>
        <button class="toast-close" aria-label="Close notification">&times;</button>
      `;

      document.body.appendChild(toastEl);

      const closeBtn = toastEl.querySelector('.toast-close');
      closeBtn.addEventListener('click', () => UIKit.toast.dismiss(toastId));

      if (duration > 0) {
        setTimeout(() => UIKit.toast.dismiss(toastId), duration);
      }

      return toastId;
    },

    success(message, duration = 4000) {
      return this.create(message, 'success', duration);
    },

    error(message, duration = 4000) {
      return this.create(message, 'error', duration);
    },

    info(message, duration = 4000) {
      return this.create(message, 'info', duration);
    },

    warning(message, duration = 4000) {
      return this.create(message, 'warning', duration);
    },

    dismiss(toastId) {
      const toastEl = document.getElementById(toastId);
      if (toastEl) {
        toastEl.style.opacity = '0';
        toastEl.style.transform = 'translateX(120%)';
        setTimeout(() => toastEl.remove(), 300);
      }
    },
  },

  /**
   * Modal management
   */
  modal: {
    create(title, content, options = {}) {
      const modalId = `modal-${Date.now()}`;
      const backdrop = document.createElement('div');
      backdrop.id = `${modalId}-backdrop`;
      backdrop.className = 'modal-backdrop';
      if (options.backdropClass) {
        backdrop.className += ` ${options.backdropClass}`;
      }

      const modal = document.createElement('div');
      modal.className = 'modal';
      if (options.className) {
        modal.className += ` ${options.className}`;
      }

      let modalHTML = `
        <div class="modal-header">
          <h2 class="modal-title">${title}</h2>
          <button class="modal-close" aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
      `;

      if (options.footer) {
        modalHTML += `<div class="modal-footer">${options.footer}</div>`;
      }

      modal.innerHTML = modalHTML;
      backdrop.appendChild(modal);
      document.body.appendChild(backdrop);

      // Setup close handlers
      const closeBtn = modal.querySelector('.modal-close');
      closeBtn.addEventListener('click', () => UIKit.modal.close(modalId));
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) UIKit.modal.close(modalId);
      });

      // Trigger active state for animation
      requestAnimationFrame(() => backdrop.classList.add('active'));

      return modalId;
    },

    close(modalId) {
      const backdrop = document.getElementById(`${modalId}-backdrop`);
      if (backdrop) {
        backdrop.classList.remove('active');
        setTimeout(() => backdrop.remove(), 300);
      }
    },

    closeAll() {
      document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
        backdrop.remove();
      });
    },
  },

  /**
   * Form validation helpers
   */
  form: {
    validate(formEl) {
      let isValid = true;
      const errors = {};

      formEl.querySelectorAll('[required]').forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          errors[field.name] = `${field.getAttribute('aria-label') || field.name} is required`;
          this.showError(field, errors[field.name]);
        } else {
          this.clearError(field);
        }
      });

      return { isValid, errors };
    },

    showError(field, message) {
      field.classList.add('is-invalid');
      const errorEl = field.parentElement.querySelector('.form-error');
      if (errorEl) {
        errorEl.textContent = message;
      } else {
        const newError = document.createElement('div');
        newError.className = 'form-error';
        newError.textContent = message;
        field.parentElement.appendChild(newError);
      }
    },

    clearError(field) {
      field.classList.remove('is-invalid');
      const errorEl = field.parentElement.querySelector('.form-error');
      if (errorEl) {
        errorEl.remove();
      }
    },
  },

  /**
   * Animation utilities
   */
  animate: {
    fadeIn(el, duration = 300) {
      el.style.opacity = '0';
      el.style.transition = `opacity ${duration}ms ease-in-out`;
      requestAnimationFrame(() => {
        el.style.opacity = '1';
      });
    },

    slideUp(el, duration = 300) {
      el.style.transform = 'translateY(20px)';
      el.style.opacity = '0';
      el.style.transition = `all ${duration}ms ease-out`;
      requestAnimationFrame(() => {
        el.style.transform = 'translateY(0)';
        el.style.opacity = '1';
      });
    },

    pulse(el, times = 3, interval = 200) {
      let count = 0;
      const toggle = () => {
        el.style.opacity = count % 2 === 0 ? '0.5' : '1';
        count++;
        if (count < times * 2) {
          setTimeout(toggle, interval);
        }
      };
      toggle();
    },
  },

  /**
   * Loading state management
   */
  loading: {
    show(el) {
      el.classList.add('is-loading');
      el.disabled = true;
      const originalText = el.textContent;
      el.innerHTML = '<span class="spinner"></span> Loading...';
      el.dataset.originalText = originalText;
    },

    hide(el) {
      el.classList.remove('is-loading');
      el.disabled = false;
      el.textContent = el.dataset.originalText || 'Submit';
    },
  },

  /**
   * Utility helpers
   */
  utils: {
    debounce(fn, delay = 300) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
      };
    },

    throttle(fn, limit = 1000) {
      let inThrottle;
      return function (...args) {
        if (!inThrottle) {
          fn.apply(this, args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    },

    copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        UIKit.toast.success('Copied to clipboard!', 2000);
      });
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },

    formatTime(date) {
      return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    },
  },
};

// Expose globally
window.UIKit = UIKit;
