// New Position Request page
import { getUser, push, set } from '../state.js';
import { navigate } from '../router.js';
import { showToast } from '../ui/toast.js';

export const title = 'New Position Request';

let currentStep = 1;
let formData = {};

export function render(container) {
  const user = getUser();
  
  if (currentStep === 1) {
    renderForm(container);
  } else {
    renderReview(container);
  }
}

function renderForm(container) {
  container.innerHTML = `
    <div class="page-header">
      <h1>New Position Request</h1>
      <p class="text-muted">Step 1 of 2: Complete the form</p>
    </div>
    
    <div class="card" style="max-width: 1100px;">
      <form id="position-form">
        <div class="form-group">
          <label class="form-label" for="employee-name">Employee Name *</label>
          <input 
            type="text" 
            id="employee-name" 
            name="employeeName"
            class="form-control" 
            required
            value="${formData.employeeName || ''}"
            placeholder="Enter employee name"
          />
        </div>
        
        <div class="grid grid-2">
          <div class="form-group">
            <label class="form-label" for="hours">Hours per Week *</label>
            <input 
              type="number" 
              id="hours" 
              name="hours" 
              class="form-control" 
              required
              min="1"
              max="40"
              value="${formData.hours || ''}"
              placeholder="e.g., 40"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label" for="salary">Salary *</label>
            <input 
              type="number" 
              id="salary" 
              name="salary" 
              class="form-control" 
              required
              min="0"
              step="0.01"
              value="${formData.salary || ''}"
              placeholder="e.g., 75000"
            />
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label" for="department">Department *</label>
          <input 
            type="text" 
            id="department" 
            name="department" 
            class="form-control" 
            required
            value="${formData.department || user.department}"
            placeholder="Enter department"
          />
        </div>
        
        <div class="grid grid-2">
          <div class="form-group">
            <label class="form-label" for="start-date">Start Date *</label>
            <input 
              type="date" 
              id="start-date" 
              name="startDate" 
              class="form-control" 
              required
              value="${formData.startDate || ''}"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label" for="end-date">End Date (Optional)</label>
            <input 
              type="date" 
              id="end-date" 
              name="endDate" 
              class="form-control"
              value="${formData.endDate || ''}"
            />
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label" for="reports-to">Reports To *</label>
          <input 
            type="text" 
            id="reports-to" 
            name="reportsTo" 
            class="form-control" 
            required
            value="${formData.reportsTo || ''}"
            placeholder="Enter supervisor name"
          />
        </div>
        
        <div class="grid grid-2">
          <div class="form-group">
            <label class="form-label" for="funding-type">Funding Type *</label>
            <select id="funding-type" name="fundingType" class="form-control" required>
              <option value="">Select funding type</option>
              <option value="base" ${formData.fundingType === 'base' ? 'selected' : ''}>Base</option>
              <option value="grant" ${formData.fundingType === 'grant' ? 'selected' : ''}>Grant</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="job-code">Job Code *</label>
            <input 
              type="text" 
              id="job-code" 
              name="jobCode" 
              class="form-control" 
              required
              value="${formData.jobCode || ''}"
              placeholder="e.g., PR123"
            />
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label" for="flsa">FLSA Status *</label>
          <select id="flsa" name="flsa" class="form-control" required>
            <option value="">Select FLSA status</option>
            <option value="exempt" ${formData.flsa === 'exempt' ? 'selected' : ''}>Exempt</option>
            <option value="non-exempt" ${formData.flsa === 'non-exempt' ? 'selected' : ''}>Non-Exempt</option>
          </select>
        </div>
        
        <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem;">
          <a href="#/dashboard" class="btn btn-secondary">Cancel</a>
          <button type="submit" class="btn btn-primary">Continue to Review</button>
        </div>
      </form>
    </div>
  `;
  
  const form = document.getElementById('position-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formDataObj = new FormData(form);
    formData = Object.fromEntries(formDataObj);
    
    // Validate
    if (!validateForm(formData)) {
      return;
    }
    
    currentStep = 2;
    render(container);
  });
}

function renderReview(container) {
  container.innerHTML = `
    <div class="page-header">
      <h1>Review Your Request</h1>
      <p class="text-muted">Step 2 of 2: Review and submit</p>
    </div>
    
    <div class="card" style="max-width: 1100px;">
      <h3 style="margin-bottom: 1.5rem;">Position Details</h3>
      
      <div class="form-group">
        <label class="form-label">Employee Name</label>
        <div class="form-control" style="background: var(--bg);">${formData.employeeName}</div>
      </div>
      
      <div class="grid grid-2">
        <div class="form-group">
          <label class="form-label">Hours per Week</label>
          <div class="form-control" style="background: var(--bg);">${formData.hours}</div>
        </div>
        <div class="form-group">
          <label class="form-label">Salary</label>
          <div class="form-control" style="background: var(--bg);">$${parseFloat(formData.salary).toLocaleString()}</div>
        </div>
      </div>
      
      <div class="form-group">
        <label class="form-label">Department</label>
        <div class="form-control" style="background: var(--bg);">${formData.department}</div>
      </div>
      
      <div class="grid grid-2">
        <div class="form-group">
          <label class="form-label">Start Date</label>
          <div class="form-control" style="background: var(--bg);">${formData.startDate}</div>
        </div>
        <div class="form-group">
          <label class="form-label">End Date</label>
          <div class="form-control" style="background: var(--bg);">${formData.endDate || 'N/A'}</div>
        </div>
      </div>
      
      <div class="form-group">
        <label class="form-label">Reports To</label>
        <div class="form-control" style="background: var(--bg);">${formData.reportsTo}</div>
      </div>
      
      <div class="grid grid-2">
        <div class="form-group">
          <label class="form-label">Funding Type</label>
          <div class="form-control" style="background: var(--bg);">${formData.fundingType.charAt(0).toUpperCase() + formData.fundingType.slice(1)}</div>
        </div>
        <div class="form-group">
          <label class="form-label">Job Code</label>
          <div class="form-control" style="background: var(--bg);">${formData.jobCode}</div>
        </div>
      </div>
      
      <div class="form-group">
        <label class="form-label">FLSA Status</label>
        <div class="form-control" style="background: var(--bg);">${formData.flsa.charAt(0).toUpperCase() + formData.flsa.slice(1)}</div>
      </div>
      
      <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem;">
        <button id="edit-btn" class="btn btn-secondary">Edit</button>
        <button id="submit-btn" class="btn btn-primary">Confirm & Submit</button>
      </div>
    </div>
  `;
  
  document.getElementById('edit-btn').addEventListener('click', () => {
    currentStep = 1;
    render(container);
  });
  
  document.getElementById('submit-btn').addEventListener('click', () => {
    submitRequest();
  });
}

function validateForm(data) {
  const required = ['employeeName', 'hours', 'salary', 'department', 'startDate', 'reportsTo', 'fundingType', 'jobCode', 'flsa'];
  
  for (const field of required) {
    if (!data[field] || data[field].trim() === '') {
      showToast(`Please fill in the ${field} field`, 'error');
      return false;
    }
  }
  
  return true;
}

function submitRequest() {
  const user = getUser();
  const now = new Date().toISOString().split('T')[0];
  
  const request = {
    id: `r${Date.now()}`,
    type: 'New Position',
    title: `New Position: ${formData.employeeName}`,
    dept: formData.department,
    requester: user.name,
    submitted: now,
    status: 'Pending Review',
    details: formData
  };
  
  push('requests', request);
  
  // Set flash message
  set('app.flash', 'New position request submitted successfully.');
  
  // Reset form state
  currentStep = 1;
  formData = {};
  
  // Navigate to dashboard
  navigate('/dashboard');
}

export function cleanup() {
  currentStep = 1;
  formData = {};
}


