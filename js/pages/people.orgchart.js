// Org Chart page
import { get } from '../state.js';

export const title = 'Organization Chart';

export function render(container) {
  const people = get('people', []);
  const org = get('org', {});
  
  container.innerHTML = `
    <div class="page-header">
      <h1>Organization Chart</h1>
    </div>
    
    <div class="card">
      <div class="org-chart">
        ${renderOrgTree(org.root, people)}
      </div>
    </div>
  `;
}

function renderOrgTree(node, people, level = 0) {
  const person = people.find(p => p.id === node.id);
  if (!person) return '';
  
  let html = `
    <div class="org-node" style="margin-left: ${level * 100}px;">
      <div class="org-node-name">${person.name}</div>
      <div class="org-node-title">${person.title}</div>
    </div>
  `;
  
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      html += renderOrgTree(child, people, level + 1);
    });
  }
  
  return html;
}

export function cleanup() {}


