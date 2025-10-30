// Settings Notifications page
import { get, set } from '../state.js';
import { showToast } from '../ui/toast.js';

export const title = 'Notification Settings';

export function render(container) {
  const settings = get('settings', {});
  
  container.innerHTML = `
    <div class="page-header">
      <h1>Notification Settings</h1>
    </div>
    
    <div class="card" style="max-width: 1000px;">
      <h3 style="margin-bottom: 1.5rem;">Email Notifications</h3>
      
      <div class="form-group">
        <label class="form-label">
          <input 
            type="checkbox" 
            id="email-notifications" 
            ${settings.notifications ? 'checked' : ''}
            style="margin-right: 0.5rem;"
          />
          Enable email notifications
        </label>
      </div>
      
      <div class="form-group">
        <label class="form-label" for="frequency">Notification Frequency</label>
        <select id="frequency" class="form-control">
          <option value="immediate" ${settings.frequency === 'immediate' ? 'selected' : ''}>Immediate</option>
          <option value="daily" ${settings.frequency === 'daily' ? 'selected' : ''}>Daily Digest</option>
          <option value="weekly" ${settings.frequency === 'weekly' ? 'selected' : ''}>Weekly Summary</option>
        </select>
      </div>
      
      <div style="margin-top: 2rem;">
        <button class="btn btn-primary" id="save-notifications-btn">Save Settings</button>
      </div>
    </div>
  `;
  
  document.getElementById('save-notifications-btn').addEventListener('click', () => {
    const notifications = document.getElementById('email-notifications').checked;
    const frequency = document.getElementById('frequency').value;
    
    set('settings', {
      ...settings,
      notifications,
      frequency
    });
    
    showToast('Notification settings saved successfully', 'success');
  });
}

export function cleanup() {}


