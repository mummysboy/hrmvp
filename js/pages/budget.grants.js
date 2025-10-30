// Grant-Funded Roles page
import { get } from '../state.js';

export const title = 'Grant-Funded Roles';

export function render(container) {
  const requests = get('requests', []);
  const grantRequests = requests.filter(r => 
    r.type === 'New Position' && r.details && r.details.fundingType === 'grant'
  );
  
  container.innerHTML = `
    <div class="page-header">
      <h1>Grant-Funded Roles</h1>
    </div>
    
    ${grantRequests.length === 0 ? `
      <div class="card">
        <div class="text-center" style="padding: 3rem;">
          <p class="text-muted">No grant-funded positions at this time.</p>
        </div>
      </div>
    ` : `
      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${grantRequests.map(request => `
              <tr>
                <td>${request.title}</td>
                <td>${request.dept}</td>
                <td>${request.details?.salary ? '$' + parseFloat(request.details.salary).toLocaleString() : 'N/A'}</td>
                <td>
                  <span class="chip chip-${getStatusClass(request.status)}">${request.status}</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `}
  `;
}

function getStatusClass(status) {
  const map = {
    'Pending Review': 'pending',
    'Approved': 'approved',
    'Rejected': 'rejected',
    'Draft': 'draft'
  };
  return map[status] || 'pending';
}

export function cleanup() {}


