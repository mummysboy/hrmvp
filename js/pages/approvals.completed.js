// Completed Approvals page
import { getApprovals, getRequests } from '../state.js';

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
                <tr>
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


