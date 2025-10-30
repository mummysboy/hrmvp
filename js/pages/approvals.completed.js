// Completed Approvals page
import { getApprovals, getRequests } from '../state.js';
import { openDrawer, setDrawerContent } from '../ui/drawer.js';

export const title = 'Completed Approvals';

export function render(container) {
  const approvals = getApprovals({ status: 'Completed' });
  const requests = getRequests();
  
  container.innerHTML = `
    <div class="page-header">
      <h1>Completed Approvals</h1>
      <p class="text-muted">${approvals.length} completed approval(s)</p>
    </div>
    
    ${approvals.length === 0 ? `
      <div class="card">
        <div class="text-center" style="padding: 3rem;">
          <p class="text-muted">No completed approvals yet.</p>
        </div>
      </div>
    ` : `
      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>Request</th>
              <th>Department</th>
              <th>Status</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            ${approvals.map(approval => {
              const request = requests.find(r => r.id === approval.requestId);
              if (!request) return '';
              
              return `
                <tr class="completed-row" data-request-id="${request.id}" data-approval-id="${approval.id}" style="cursor: pointer;">
                  <td>${request.title}</td>
                  <td>${request.dept}</td>
                  <td><span class="chip chip-${getStatusClass(request.status)}">${request.status}</span></td>
                  <td>${approval.completedDate ? new Date(approval.completedDate).toLocaleDateString() : 'N/A'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `}
  `;

  // Attach click handlers to open details drawer
  container.querySelectorAll('.completed-row').forEach(row => {
    row.addEventListener('click', () => {
      const requestId = row.getAttribute('data-request-id');
      const approvalId = row.getAttribute('data-approval-id');
      showCompletedDetails(requestId, approvalId);
    });
  });
}

function getStatusClass(status) {
  const map = {
    'Approved': 'approved',
    'Rejected': 'rejected',
    'Needs Revision': 'pending'
  };
  return map[status] || 'pending';
}

export function cleanup() {}


// Read-only details drawer for completed approvals
function showCompletedDetails(requestId, approvalId) {
  const requests = getRequests();
  const approvals = getApprovals();
  const request = requests.find(r => r.id === requestId);
  const approval = approvals.find(a => a.id === approvalId);
  if (!request || !approval) return;
  
  const content = `
    <div class="card" style="margin: 0 0 1.5rem 0;">
      <h3 style="margin-bottom: 1rem;">${request.title}</h3>
      <div class="grid grid-2">
        <div><strong>Type:</strong> ${request.type}</div>
        <div><strong>Status:</strong> <span class="chip chip-${getStatusClass(request.status)}">${request.status}</span></div>
        <div><strong>Department:</strong> ${request.dept}</div>
        <div><strong>Completed:</strong> ${approval.completedDate ? new Date(approval.completedDate).toLocaleDateString() : 'N/A'}</div>
      </div>
      ${request.description ? `<p style=\"margin-top: 1rem; color: var(--color-text-secondary);\">${request.description}</p>` : ''}
    </div>

    ${request.details ? `
    <div class=\"card\" style=\"margin: 0 0 1.5rem 0;\">
      <h3 style=\"margin-bottom: 1rem;\">Details</h3>
      ${Object.entries(request.details).map(([k,v]) => `<div><strong>${formatKey(k)}:</strong> ${Array.isArray(v) ? v.join(', ') : v}</div>`).join('')}
    </div>` : ''}
  `;
  // If a drawer is already open, just swap content; else open a new one with no shaded backdrop
  const existing = document.querySelector('.drawer');
  if (existing) {
    setDrawerContent({ title: 'Request Details', content });
  } else {
    openDrawer({ title: 'Request Details', content, width: 560, backdrop: false });
  }
}

function formatKey(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
}


