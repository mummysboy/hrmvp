// Toast notification system
export function showToast(message, type = 'info', duration = 4000) {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');
  
  const icon = getToastIcon(type);
  toast.innerHTML = `
    <span aria-hidden="true">${icon}</span>
    <span>${message}</span>
  `;
  
  document.body.appendChild(toast);
  
  // Auto dismiss
  setTimeout(() => {
    toast.style.animation = 'slideIn var(--transition) reverse';
    setTimeout(() => toast.remove(), 200);
  }, duration);
  
  // Dismiss on click
  toast.addEventListener('click', () => {
    toast.style.animation = 'slideIn var(--transition) reverse';
    setTimeout(() => toast.remove(), 200);
  });
}

function getToastIcon(type) {
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  };
  return icons[type] || icons.info;
}


