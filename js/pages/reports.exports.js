// Reports Exports page
import { get } from '../state.js';

export const title = 'Export Reports';

export function render(container) {
  container.innerHTML = `
    <div class="page-header">
      <h1>Export Reports</h1>
      <p class="text-muted">Download data in CSV format</p>
    </div>
    
    <div class="card" style="max-width: 1000px;">
      <h3 style="margin-bottom: 1rem;">Export Options</h3>
      
      <div class="form-group">
        <button class="btn btn-primary" id="export-requests-btn">Export All Requests</button>
      </div>
      
      <p class="text-muted text-small">This will download a CSV file containing all request data.</p>
    </div>
  `;
  
  document.getElementById('export-requests-btn').addEventListener('click', () => {
    const requests = get('requests', []);
    const csv = convertToCSV(requests);
    downloadCSV(csv, 'hr-requests-export.csv');
  });
}

function convertToCSV(data) {
  if (data.length === 0) return '';
  
  const headers = ['ID', 'Type', 'Title', 'Department', 'Requester', 'Submitted', 'Status'];
  const rows = data.map(item => [
    item.id,
    item.type,
    `"${item.title}"`,
    item.dept,
    item.requester,
    item.submitted,
    item.status
  ]);
  
  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  return csvContent;
}

function downloadCSV(content, filename) {
  const blob = new Blob([content], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export function cleanup() {}


