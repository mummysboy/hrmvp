// Dashboard page
import { get, getUser, getRequests, getApprovals } from '../state.js';
import { showToast } from '../ui/toast.js';

export const title = 'Dashboard';

// Show request details in a drawer
function showRequestDetails(requestId) {
  const requests = getRequests();
  const request = requests.find(r => r.id === requestId);
  
  if (!request) return;
  
  const drawer = document.createElement('div');
  drawer.className = 'drawer';
  drawer.innerHTML = `
    <div class="drawer-header">
      <h2>Request Details</h2>
      <button class="drawer-close" aria-label="Close">&times;</button>
    </div>
    <div class="drawer-body">
      <div class="card" style="margin: 0 0 1.5rem 0;">
        <h3 style="margin-bottom: 1rem;">${request.title}</h3>
        <div class="grid grid-2">
          <div><strong>Type:</strong> ${request.type}</div>
          <div><strong>Status:</strong> <span class="chip chip-${getStatusClass(request.status)}">${request.status}</span></div>
          <div><strong>Department:</strong> ${request.dept}</div>
          <div><strong>Requester:</strong> ${request.requester}</div>
          <div><strong>Submitted:</strong> ${new Date(request.submitted).toLocaleDateString()}</div>
        </div>
      </div>
      
      <div class="card" style="margin: 0;">
        <h3 style="margin-bottom: 1rem;">Activity Timeline</h3>
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-time">${new Date(request.submitted).toLocaleString()}</div>
            <div>Request submitted by ${request.requester}</div>
          </div>
          ${request.status === 'Approved' ? `
            <div class="timeline-item">
              <div class="timeline-time">Recently</div>
              <div>Request approved</div>
            </div>
          ` : ''}
          ${request.status === 'Rejected' ? `
            <div class="timeline-item">
              <div class="timeline-time">Recently</div>
              <div>Request rejected</div>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(drawer);
  
  drawer.querySelector('.drawer-close').addEventListener('click', () => drawer.remove());
}

// Show approval details in a drawer
function showApprovalDetails(requestId, approvalId) {
  const requests = getRequests();
  const approvals = getApprovals();
  const request = requests.find(r => r.id === requestId);
  const approval = approvals.find(a => a.id === approvalId);
  
  if (!request || !approval) return;
  
  const drawer = document.createElement('div');
  drawer.className = 'drawer';
  drawer.innerHTML = `
    <div class="drawer-header">
      <h2>Review Request</h2>
      <button class="drawer-close" aria-label="Close">&times;</button>
    </div>
    <div class="drawer-body">
      <div class="card" style="margin: 0 0 1.5rem 0;">
        <h3 style="margin-bottom: 1rem;">${request.title}</h3>
        <div class="grid grid-2">
          <div><strong>Type:</strong> ${request.type}</div>
          <div><strong>Status:</strong> <span class="chip chip-pending">${request.status}</span></div>
          <div><strong>Department:</strong> ${request.dept}</div>
          <div><strong>Requester:</strong> ${request.requester}</div>
          <div><strong>Submitted:</strong> ${new Date(request.submitted).toLocaleDateString()}</div>
          <div><strong>Due:</strong> ${approval.due || 'N/A'}</div>
        </div>
      </div>
      
      <div class="card" style="margin: 0;">
        <h3 style="margin-bottom: 1rem;">Actions</h3>
        <div class="flex gap-2" style="flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="location.hash='#/approvals/pending'">Review in Approvals</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(drawer);
  
  drawer.querySelector('.drawer-close').addEventListener('click', () => drawer.remove());
}

export function render(container) {
  const user = getUser();
  const requests = getRequests();
  const approvals = getApprovals({ status: 'Pending' });
  const allApprovals = getApprovals();
  
  // Calculate KPIs
  const pendingApprovals = approvals.length;
  const thisMonthRequests = requests.filter(r => {
    const d = new Date(r.submitted);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const inProgress = requests.filter(r => 
    ['Pending Review', 'Needs Revision', 'Draft'].includes(r.status)
  );
  const systemTotal = requests.length;
  
  // Check for flash message
  const flash = get('app.flash');
  if (flash) {
    setTimeout(() => showToast(flash, 'success'), 100);
    // Clear flash after showing
    import('../state.js').then(({ set }) => set('app.flash', null));
  }
  
  container.innerHTML = `
    <div class="page-header">
      <h1>Dashboard</h1>
      <p class="text-muted">Welcome back, ${user.name}</p>
    </div>
    
    <!-- KPI Cards -->
    <div class="grid grid-4">
      <div class="card kpi-card">
        <div class="kpi-label">Pending Approvals</div>
        <div class="kpi-value">${pendingApprovals}</div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-label">This Month Completed</div>
        <div class="kpi-value">${thisMonthRequests.filter(r => r.status === 'Approved').length}</div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-label">In Progress</div>
        <div class="kpi-value">${inProgress.length}</div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-label">System Total</div>
        <div class="kpi-value">${systemTotal}</div>
      </div>
    </div>
    
    <div class="grid grid-2">
      <!-- Quick Actions -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Quick Actions</h2>
        </div>
        <div class="flex gap-2" style="flex-wrap: wrap;">
          <a href="#/requests/new-position" class="btn btn-primary">New Position Request</a>
          <a href="#/requests/leave" class="btn btn-secondary">Request Leave</a>
          <a href="#/requests" class="btn btn-secondary">View All Requests</a>
          ${approvals.length > 0 ? '<a href="#/approvals/pending" class="btn btn-secondary">Review Approvals</a>' : ''}
        </div>
      </div>
      
      <!-- Your Pending Approvals -->
      ${approvals.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Your Pending Approvals</h2>
            <a href="#/approvals/pending" class="text-small text-muted">View All</a>
          </div>
          <div style="max-height: 300px; overflow-y: auto;">
            <table class="table">
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Department</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                ${approvals.slice(0, 5).map(approval => {
                  const request = requests.find(r => r.id === approval.requestId);
                  const onViewClick = `window.showApprovalDetails('${request?.id}', '${approval.id}')`;
                  return `
                    <tr class="clickable-row" data-onclick="${onViewClick}">
                      <td>${request?.title || 'Unknown'}</td>
                      <td>${request?.dept || '-'}</td>
                      <td>${approval.due || '-'}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}
    </div>
    
    <!-- Recent Activity -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Recent Activity</h2>
      </div>
      <div style="max-height: 400px; overflow-y: auto;">
        <table class="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Department</th>
              <th>Submitted</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${requests
              .sort((a, b) => new Date(b.submitted) - new Date(a.submitted))
              .slice(0, 10)
              .map(request => {
                const onViewClick = `window.showRequestDetails('${request.id}')`;
                return `
                  <tr class="clickable-row" data-onclick="${onViewClick}">
                    <td>${request.title}</td>
                    <td>${request.type}</td>
                    <td>${request.dept}</td>
                    <td>${new Date(request.submitted).toLocaleDateString()}</td>
                    <td>
                      <span class="chip chip-${getStatusClass(request.status)}">${request.status}</span>
                    </td>
                  </tr>
                `;
              }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  
  // Attach click handlers
  document.querySelectorAll('.clickable-row').forEach(row => {
    row.addEventListener('click', () => {
      const onclick = row.getAttribute('data-onclick');
      if (onclick) {
        eval(onclick);
      }
    });
  });
  
  // Make functions available globally for eval calls
  window.showRequestDetails = showRequestDetails;
  window.showApprovalDetails = showApprovalDetails;
}

function getStatusClass(status) {
  const map = {
    'Pending Review': 'pending',
    'Approved': 'approved',
    'Rejected': 'rejected',
    'Draft': 'draft',
    'Needs Revision': 'pending'
  };
  return map[status] || 'pending';
}

export function cleanup() {
  // Clean up global functions
  delete window.showRequestDetails;
  delete window.showApprovalDetails;
}

