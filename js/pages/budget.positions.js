// Position Control page
import { get } from '../state.js';

export const title = 'Position Control';

export function render(container) {
  const requests = get('requests', []);
  
  // Calculate totals
  const totalPositions = requests.filter(r => r.type === 'New Position').length;
  const filledPositions = requests.filter(r => r.type === 'New Position' && r.status === 'Approved').length;
  const openPositions = totalPositions - filledPositions;
  
  // Estimate salary totals
  const approvedRequests = requests.filter(r => r.type === 'New Position' && r.status === 'Approved');
  const estimatedSalary = approvedRequests.reduce((sum, r) => {
    if (r.details && r.details.salary) {
      return sum + parseFloat(r.details.salary);
    }
    return sum;
  }, 0);
  
  container.innerHTML = `
    <div class="page-header">
      <h1>Position Control</h1>
      <p class="text-muted">Overview of positions and salary budgets</p>
    </div>
    
    <div class="grid grid-3">
      <div class="card kpi-card">
        <div class="kpi-label">Total Positions</div>
        <div class="kpi-value">${totalPositions}</div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-label">Filled Positions</div>
        <div class="kpi-value">${filledPositions}</div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-label">Open Positions</div>
        <div class="kpi-value">${openPositions}</div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Salary Budget Estimate</h2>
      </div>
      <div style="padding: 1rem 0;">
        <div style="font-size: 2rem; font-weight: 700; color: var(--brand-crimson); margin-bottom: 1rem;">
          $${estimatedSalary.toLocaleString()}
        </div>
        <p class="text-muted">Based on approved position requests</p>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Position Status Breakdown</h2>
      </div>
      <div style="padding: 2rem;">
        <svg width="100%" height="100" viewBox="0 0 400 100">
          <rect x="0" y="20" width="${(filledPositions / totalPositions) * 100 || 0}%" height="60" 
                fill="var(--chip-approved)" rx="4"/>
          <rect x="${(filledPositions / totalPositions) * 100 || 0}%" y="20" 
                width="${(openPositions / totalPositions) * 100 || 0}%" height="60" 
                fill="var(--chip-pending)" rx="4"/>
        </svg>
        <div class="flex gap-2 mt-2" style="justify-content: center;">
          <div class="flex gap-2">
            <div style="width: 16px; height: 16px; background: var(--chip-approved); border-radius: 4px;"></div>
            <span class="text-small">Filled (${filledPositions})</span>
          </div>
          <div class="flex gap-2">
            <div style="width: 16px; height: 16px; background: var(--chip-pending); border-radius: 4px;"></div>
            <span class="text-small">Open (${openPositions})</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function cleanup() {}


