// Pending Approvals page
import { getUser, getRequests, getApprovals, updateItem, push, get, set } from '../state.js';
import { navigate } from '../router.js';
import { showToast } from '../ui/toast.js';
import { showModal, showConfirmModal, closeAllModals } from '../ui/modal.js';
import { openDrawer, closeDrawer } from '../ui/drawer.js';

export const title = 'Pending Approvals';

export function render(container) {
  const user = getUser();
  const approvals = getApprovals({ status: 'Pending' });
  const requests = getRequests();
  
  container.innerHTML = `
    <div class="page-header">
      <h1>Pending Approvals</h1>
      <p class="text-muted">You have ${approvals.length} item(s) pending your review</p>
    </div>
    
    ${approvals.length === 0 ? `
      <div class="card">
        <div class="text-center" style="padding: 3rem;">
          <p class="text-muted">No pending approvals at this time.</p>
        </div>
      </div>
    ` : `
      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>Request</th>
              <th>Department</th>
              <th>Requester</th>
              <th>Due Date</th>
              <th>Actions</th>
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
                  <td>${request.requester}</td>
                  <td>${approval.due || 'N/A'}</td>
                  <td>
                    <button class="btn btn-sm btn-primary view-details-btn" data-request-id="${request.id}" data-approval-id="${approval.id}">Review</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `}
  `;
  
  // Attach event listeners
  document.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const requestId = btn.getAttribute('data-request-id');
      const approvalId = btn.getAttribute('data-approval-id');
      showApprovalDetails(requestId, approvalId);
    });
  });
}

function showApprovalDetails(requestId, approvalId) {
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
        <div><strong>Status:</strong> <span class="chip chip-pending">${request.status}</span></div>
        <div><strong>Department:</strong> ${request.dept}</div>
        <div><strong>Requester:</strong> ${request.requester}</div>
        <div><strong>Submitted:</strong> ${new Date(request.submitted).toLocaleDateString()}</div>
        <div><strong>Due:</strong> ${approval.due || 'N/A'}</div>
      </div>
      ${request.details ? `
        <div style=\"margin-top: 1.5rem;\">
          <h4>Details</h4>
          ${Object.entries(request.details).map(([key, value]) => `
            <div><strong>${formatKey(key)}:</strong> ${value}</div>
          `).join('')}
        </div>
      ` : ''}
    </div>
    <div class=\"card\" style=\"margin: 0 0 1.5rem 0;\">
      <h3 style=\"margin-bottom: 1rem;\">Decision</h3>
      <div class=\"flex gap-2\" style=\"flex-wrap: wrap;\"> 
        <button class=\"btn btn-success\" id=\"approve-btn\">Approve</button>
        <button class=\"btn btn-danger\" id=\"reject-btn\">Reject</button>
        <button class=\"btn btn-secondary\" id=\"request-changes-btn\">Request Changes</button>
      </div>
    </div>
  `;
  openDrawer({ title: 'Review Request', content, width: 560 });
  
  document.getElementById('approve-btn').addEventListener('click', () => {
    handleApprovalAction('Approved', requestId, approvalId);
  });
  
  document.getElementById('reject-btn').addEventListener('click', () => {
    handleApprovalAction('Rejected', requestId, approvalId);
  });
  
  document.getElementById('request-changes-btn').addEventListener('click', () => {
    handleApprovalAction('Needs Revision', requestId, approvalId);
  });
}

function handleApprovalAction(status, requestId, approvalId) {
  const titleText = `${status === 'Approved' ? 'Approve' : status === 'Rejected' ? 'Reject' : 'Request Changes for'} Request`;
  
  showModal({
    title: titleText,
    content: `
      <div class="form-group">
        <label class="form-label">Add a note (optional)</label>
        <textarea id="approval-note" class="form-control" rows="3" placeholder="Enter any comments or notes..."></textarea>
      </div>
      <div class="flex gap-2 mt-3" style="justify-content: flex-end;">
        <button class="btn btn-secondary" data-action="cancel">Cancel</button>
        <button class="btn ${status === 'Approved' ? 'btn-success' : status === 'Rejected' ? 'btn-danger' : 'btn-primary'}" data-action="confirm">Confirm</button>
      </div>
    `,
    onConfirm: () => {
      const note = document.getElementById('approval-note')?.value || '';
      
      // Update request status
      updateItem('requests', r => r.id === requestId, { status });
      
      // Move approval to completed
      const approvals = get('approvals', []);
      const approval = approvals.find(a => a.id === approvalId);
      if (approval) {
        approval.status = 'Completed';
        approval.completedDate = new Date().toISOString().split('T')[0];
        approval.note = note;
        
        // Remove from pending, add to completed
        const filtered = approvals.filter(a => a.id !== approvalId);
        filtered.push(approval);
        set('approvals', filtered);
      }
      
      showToast(`Request ${status.toLowerCase()} successfully`, 'success');
      
      // Close drawers (overlay + content) and modals (fade)
      try { closeDrawer(); } catch (_) {}
      document.querySelectorAll('.drawer-overlay').forEach(o => o.remove());
      closeAllModals();
      
      // Re-render current route to reflect updates while staying on page
      const currentRoute = window.location.hash.slice(1) || '/approvals/pending';
      setTimeout(() => navigate(currentRoute, false), 300);
    },
    onCancel: () => {}
  });
  
  // Attach handlers after a short delay to ensure DOM is ready
  setTimeout(() => {
    const confirmBtn = document.querySelector('.modal [data-action="confirm"]');
    const cancelBtn = document.querySelector('.modal [data-action="cancel"]');
    
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        const note = document.getElementById('approval-note')?.value || '';
        const approvals = get('approvals', []);
        const approval = approvals.find(a => a.id === approvalId);
        
        if (approval) {
          approval.status = 'Completed';
          approval.completedDate = new Date().toISOString().split('T')[0];
          approval.note = note;
          
          const filtered = approvals.filter(a => a.id !== approvalId);
          filtered.push(approval);
          set('approvals', filtered);
        }
        
        updateItem('requests', r => r.id === requestId, { status });
        showToast(`Request ${status.toLowerCase()} successfully`, 'success');
        
        try { closeDrawer(); } catch (_) {}
        document.querySelectorAll('.drawer-overlay').forEach(o => o.remove());
        closeAllModals();
        const currentRoute = window.location.hash.slice(1) || '/approvals/pending';
        setTimeout(() => navigate(currentRoute, false), 300);
      });
    }
    
    if (cancelBtn) {
      const closeModal = () => { closeAllModals(); };
      cancelBtn.addEventListener('click', closeModal);
    }
  }, 100);
}

function formatKey(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

export function cleanup() {}

