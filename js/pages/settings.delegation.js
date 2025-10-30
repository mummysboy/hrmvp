// Settings Delegation page
import { get, set } from '../state.js';
import { showToast } from '../ui/toast.js';

export const title = 'Delegation Settings';

export function render(container) {
  const settings = get('settings', {});
  const delegates = settings.delegates || [];
  
  container.innerHTML = `
    <div class="page-header">
      <h1>Delegation / Proxy Settings</h1>
    </div>
    
    <div class="card" style="max-width: 1000px;">
      <h3 style="margin-bottom: 1.5rem;">Authorized Delegates</h3>
      
      ${delegates.length === 0 ? `
        <p class="text-muted">No delegates added yet.</p>
      ` : `
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${delegates.map((delegate, index) => `
              <tr>
                <td>${delegate.name}</td>
                <td>${delegate.email}</td>
                <td>
                  <button class="btn btn-sm btn-secondary remove-delegate-btn" data-index="${index}">Remove</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
      
      <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--border);">
        <h4 style="margin-bottom: 1rem;">Add New Delegate</h4>
        
        <div class="form-group">
          <label class="form-label" for="delegate-name">Name *</label>
          <input type="text" id="delegate-name" class="form-control" placeholder="Enter delegate name" />
        </div>
        
        <div class="form-group">
          <label class="form-label" for="delegate-email">Email *</label>
          <input type="email" id="delegate-email" class="form-control" placeholder="Enter delegate email" />
        </div>
        
        <button class="btn btn-primary" id="add-delegate-btn">Add Delegate</button>
      </div>
    </div>
  `;
  
  // Add delegate
  document.getElementById('add-delegate-btn').addEventListener('click', () => {
    const name = document.getElementById('delegate-name').value.trim();
    const email = document.getElementById('delegate-email').value.trim();
    
    if (!name || !email) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    
    const newDelegates = [...delegates, { name, email }];
    set('settings', {
      ...settings,
      delegates: newDelegates
    });
    
    showToast('Delegate added successfully', 'success');
    
    // Clear inputs and re-render
    document.getElementById('delegate-name').value = '';
    document.getElementById('delegate-email').value = '';
    render(container);
  });
  
  // Remove delegate
  document.querySelectorAll('.remove-delegate-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.getAttribute('data-index'));
      const newDelegates = delegates.filter((_, i) => i !== index);
      set('settings', {
        ...settings,
        delegates: newDelegates
      });
      
      showToast('Delegate removed successfully', 'success');
      render(container);
    });
  });
}

export function cleanup() {}


