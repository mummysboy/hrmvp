// Reports Summary page
import { get } from '../state.js';

export const title = 'Reports Summary';

export function render(container) {
  const requests = get('requests', []);
  
  // KPIs
  const totalRequests = requests.length;
  const approvedRequests = requests.filter(r => r.status === 'Approved').length;
  const pendingRequests = requests.filter(r => r.status === 'Pending Review').length;
  const rejectedRequests = requests.filter(r => r.status === 'Rejected').length;
  
  // Monthly breakdown (last 6 months)
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    months.push(date);
  }
  
  container.innerHTML = `
    <div class="page-header">
      <h1>Reports Summary</h1>
    </div>
    
    <div class="grid grid-4">
      <div class="card kpi-card">
        <div class="kpi-label">Total Requests</div>
        <div class="kpi-value">${totalRequests}</div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-label">Approved</div>
        <div class="kpi-value">${approvedRequests}</div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-label">Pending</div>
        <div class="kpi-value">${pendingRequests}</div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-label">Rejected</div>
        <div class="kpi-value">${rejectedRequests}</div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Request Status Distribution</h2>
      </div>
      <div style="padding: 2rem;">
        <svg width="100%" height="200" viewBox="0 0 400 200">
          ${renderBarChart(totalRequests, approvedRequests, pendingRequests, rejectedRequests)}
        </svg>
      </div>
    </div>
  `;
}

function renderBarChart(total, approved, pending, rejected) {
  const width = 400;
  const height = 200;
  const padding = 40;
  const chartHeight = height - padding * 2;
  const maxValue = Math.max(total, 1);
  
  const barWidth = 60;
  const spacing = 40;
  const startX = padding;
  
  const approvedHeight = (approved / maxValue) * chartHeight;
  const pendingHeight = (pending / maxValue) * chartHeight;
  const rejectedHeight = (rejected / maxValue) * chartHeight;
  
  return `
    <rect x="${startX}" y="${height - padding - approvedHeight}" 
          width="${barWidth}" height="${approvedHeight}" 
          fill="var(--chip-approved)" rx="4"/>
    <text x="${startX + barWidth / 2}" y="${height - 10}" 
          text-anchor="middle" font-size="12" fill="var(--text)">Approved</text>
    <text x="${startX + barWidth / 2}" y="${height - padding - approvedHeight - 5}" 
          text-anchor="middle" font-size="12" fill="var(--text)">${approved}</text>
    
    <rect x="${startX + barWidth + spacing}" y="${height - padding - pendingHeight}" 
          width="${barWidth}" height="${pendingHeight}" 
          fill="var(--chip-pending)" rx="4"/>
    <text x="${startX + barWidth + spacing + barWidth / 2}" y="${height - 10}" 
          text-anchor="middle" font-size="12" fill="var(--text)">Pending</text>
    <text x="${startX + barWidth + spacing + barWidth / 2}" y="${height - padding - pendingHeight - 5}" 
          text-anchor="middle" font-size="12" fill="var(--text)">${pending}</text>
    
    <rect x="${startX + (barWidth + spacing) * 2}" y="${height - padding - rejectedHeight}" 
          width="${barWidth}" height="${rejectedHeight}" 
          fill="var(--chip-rejected)" rx="4"/>
    <text x="${startX + (barWidth + spacing) * 2 + barWidth / 2}" y="${height - 10}" 
          text-anchor="middle" font-size="12" fill="var(--text)">Rejected</text>
    <text x="${startX + (barWidth + spacing) * 2 + barWidth / 2}" y="${height - padding - rejectedHeight - 5}" 
          text-anchor="middle" font-size="12" fill="var(--text)">${rejected}</text>
  `;
}

export function cleanup() {}


