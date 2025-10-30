// Requests List page
import { getUser, getRequests, updateItem } from '../state.js';
import { navigate } from '../router.js';

export const title = 'All Requests';

let currentFilters = {
  type: '',
  status: '',
  search: ''
};
let currentPage = 1;
const itemsPerPage = 10;

export function render(container) {
  const user = getUser();
  let requests = getRequests();
  
  // Apply filters
  if (currentFilters.type) {
    requests = requests.filter(r => r.type === currentFilters.type);
  }
  if (currentFilters.status) {
    requests = requests.filter(r => r.status === currentFilters.status);
  }
  if (currentFilters.search) {
    const search = currentFilters.search.toLowerCase();
    requests = requests.filter(r => 
      r.title.toLowerCase().includes(search) ||
      r.dept.toLowerCase().includes(search) ||
      r.requester.toLowerCase().includes(search)
    );
  }
  
  // Sort by date
  requests = requests.sort((a, b) => new Date(b.submitted) - new Date(a.submitted));
  
  // Pagination
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = requests.slice(startIndex, startIndex + itemsPerPage);
  
  container.innerHTML = `
    <div class="page-header">
      <h1>All Requests</h1>
    </div>
    
    <!-- Filters -->
    <div class="card">
      <div class="filter-bar">
        <input 
          type="search" 
          class="form-control search-input" 
          placeholder="Search by title, department, or requester..."
          value="${currentFilters.search || ''}"
          id="search-input"
        />
        <select id="type-filter" class="form-control" style="min-width: 200px;">
          <option value="">All Types</option>
          <option value="New Position" ${currentFilters.type === 'New Position' ? 'selected' : ''}>New Position</option>
          <option value="Change" ${currentFilters.type === 'Change' ? 'selected' : ''}>Change</option>
          <option value="Sabbatical" ${currentFilters.type === 'Sabbatical' ? 'selected' : ''}>Sabbatical</option>
          <option value="Promotion" ${currentFilters.type === 'Promotion' ? 'selected' : ''}>Promotion</option>
        </select>
        <select id="status-filter" class="form-control" style="min-width: 200px;">
          <option value="">All Statuses</option>
          <option value="Pending Review" ${currentFilters.status === 'Pending Review' ? 'selected' : ''}>Pending Review</option>
          <option value="Approved" ${currentFilters.status === 'Approved' ? 'selected' : ''}>Approved</option>
          <option value="Rejected" ${currentFilters.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
          <option value="Draft" ${currentFilters.status === 'Draft' ? 'selected' : ''}>Draft</option>
          <option value="Needs Revision" ${currentFilters.status === 'Needs Revision' ? 'selected' : ''}>Needs Revision</option>
        </select>
      </div>
    </div>
    
    <!-- Results Table -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Requests (${requests.length} total)</h2>
      </div>
      ${requests.length === 0 ? `
        <div class="text-center" style="padding: 3rem;">
          <p class="text-muted">No requests match your filters.</p>
        </div>
      ` : `
        <table class="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Department</th>
              <th>Requester</th>
              <th>Submitted</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${paginatedRequests.map(request => `
              <tr data-request-id="${request.id}">
                <td>${request.title}</td>
                <td>${request.type}</td>
                <td>${request.dept}</td>
                <td>${request.requester}</td>
                <td>${new Date(request.submitted).toLocaleDateString()}</td>
                <td>
                  <span class="chip chip-${getStatusClass(request.status)}">${request.status}</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <!-- Pagination -->
        ${totalPages > 1 ? `
          <div class="pagination">
            <button class="btn btn-sm btn-secondary" ${currentPage === 1 ? 'disabled' : ''} id="prev-btn">Previous</button>
            <span class="text-muted">Page ${currentPage} of ${totalPages}</span>
            <button class="btn btn-sm btn-secondary" ${currentPage === totalPages ? 'disabled' : ''} id="next-btn">Next</button>
          </div>
        ` : ''}
      `}
    </div>
  `;
  
  // Event listeners
  document.getElementById('search-input').addEventListener('input', (e) => {
    currentFilters.search = e.target.value;
    currentPage = 1;
    render(container);
  });
  
  document.getElementById('type-filter').addEventListener('change', (e) => {
    currentFilters.type = e.target.value;
    currentPage = 1;
    render(container);
  });
  
  document.getElementById('status-filter').addEventListener('change', (e) => {
    currentFilters.status = e.target.value;
    currentPage = 1;
    render(container);
  });
  
  if (document.getElementById('prev-btn')) {
    document.getElementById('prev-btn').addEventListener('click', () => {
      currentPage--;
      render(container);
    });
  }
  
  if (document.getElementById('next-btn')) {
    document.getElementById('next-btn').addEventListener('click', () => {
      currentPage++;
      render(container);
    });
  }
  
  // Row click handlers
  document.querySelectorAll('.table tbody tr').forEach(row => {
    row.addEventListener('click', () => {
      const requestId = row.getAttribute('data-request-id');
      showRequestDetails(requestId);
    });
  });
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
      
      <div class="card" style="margin: 0 0 1.5rem 0;">
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
      
      ${(request.status === 'Needs Revision' || request.status === 'Draft') ? `
        <button class="btn btn-primary" id="edit-request-btn">Edit Request</button>
      ` : ''}
    </div>
  `;
  
  document.body.appendChild(drawer);
  
  // Close handlers
  drawer.querySelector('.drawer-close').addEventListener('click', () => {
    drawer.remove();
  });
  
  if (document.getElementById('edit-request-btn')) {
    document.getElementById('edit-request-btn').addEventListener('click', () => {
      // Navigate to appropriate form based on type
      if (request.type === 'New Position') {
        navigate('/requests/new-position');
      } else if (request.type.includes('Change')) {
        navigate('/requests/change');
      } else if (request.type === 'Sabbatical') {
        navigate('/requests/leave');
      }
      drawer.remove();
    });
  }
}

export function cleanup() {
  // No cleanup needed
}


