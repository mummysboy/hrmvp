// Department Employee Directory
import { getUser, getPeopleByDept, getPeople, getPerson, getDirectReports, getSupervisorChain, loadDirectoryFilters, saveDirectoryFilters } from '../state.js';
import { buildTable } from '../ui/table.js';
import { chip } from '../ui/chip.js';
import { openDrawer, closeDrawer, drawerTabs } from '../ui/drawer.js';
import { exportCSV } from '../utils/csv.js';

export const title = 'Staff Directory';

const DEFAULT_FILTERS = () => {
  return {
    search: '',
    employmentType: 'All',
    status: 'All',
    dept: 'All',
    sort: 'name-asc',
    page: 1,
    pageSize: 25
  };
};

let state = loadDirectoryFilters() || DEFAULT_FILTERS();
let viewMode = window.innerWidth <= 900 ? 'mobile' : 'desktop';
let liveRegionEl = null;
let containerRef = null;

const EMPLOYMENT_TYPES = ['All','Faculty','Staff','Student','Postdoc','Temp'];
const STATUSES = ['All','Active','On Leave','Terminated'];

export function render(container) {
  containerRef = container;
  const all = state.dept && state.dept !== 'All' ? getPeopleByDept(state.dept) : getPeople();
  const filtered = applyFilters(all, state);

  container.innerHTML = `
    <div class="page-header">
      <h1>${title}</h1>
    </div>

    <div class="card" role="region" aria-label="Directory filters">
      <div class="dir-toolbar">
        <div style="flex:1; min-width:200px;">
          <label class="form-label" for="dir-search">Search</label>
          <input id="dir-search" type="search" class="form-control" placeholder="Name, title, email, tags..." value="${escapeHtml(state.search)}" />
        </div>
        <div>
          <label class="form-label" for="dir-type">Employment Type</label>
          <select id="dir-type" class="form-control">${EMPLOYMENT_TYPES.map(t=>`<option ${sel(state.employmentType,t)}>${t}</option>`).join('')}</select>
        </div>
        <div>
          <label class="form-label" for="dir-status">Status</label>
          <select id="dir-status" class="form-control">${STATUSES.map(s=>`<option ${sel(state.status,s)}>${s}</option>`).join('')}</select>
        </div>
        <div>
          <label class="form-label" for="dir-dept">Department</label>
          <select id="dir-dept" class="form-control">${deptOptions()}</select>
        </div>
      </div>
      <div class="aria-live" aria-live="polite" aria-atomic="true"></div>
    </div>

    <div class="card">
      <div class="desktop-table"></div>
      <div class="mobile-cards"></div>
    </div>
  `;

  liveRegionEl = container.querySelector('[aria-live="polite"]');

  // Render list views
  renderResults(filtered, container);
  announce(`${filtered.total} people shown`);

  // Wire filters
  const debounced = debounce((v) => updateFilters({ search: v, page: 1 }), 200);
  container.querySelector('#dir-search').addEventListener('input', (e) => debounced(e.target.value));
  container.querySelector('#dir-type').addEventListener('change', (e) => updateFilters({ employmentType: e.target.value, page: 1 }));
  container.querySelector('#dir-status').addEventListener('change', (e) => updateFilters({ status: e.target.value, page: 1 }));
  container.querySelector('#dir-dept').addEventListener('change', (e) => updateFilters({ dept: e.target.value, page: 1 }));
  const sortEl = container.querySelector('#dir-sort');
  if (sortEl) {
    sortEl.addEventListener('change', (e) => updateFilters({ sort: e.target.value }));
  }
  const clearBtn = container.querySelector('#dir-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => { state = DEFAULT_FILTERS(); persistFilters(); render(container); });
  }
  const exportBtn = container.querySelector('#dir-export');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => doExport());
  }

  // Resize handling
  window.addEventListener('resize', onResize);

  // Deep link personId
  const q = getQueryParams();
  if (q.personId) {
    openPersonDrawer(q.personId);
  }
}

function renderResults(filtered, container) {
  viewMode = window.innerWidth <= 900 ? 'mobile' : 'desktop';
  const desktop = container.querySelector('.desktop-table');
  const mobile = container.querySelector('.mobile-cards');

  if (viewMode === 'desktop') {
    const columns = [
      { key:'photo', header:'', width:'48px', render: p => avatarPlaceholder(p) },
      { key:'name', header:'Name', sort:'name', render: p => `<div class="name">${escapeHtml(p.name)}</div><div class="text-small text-muted">${escapeHtml(p.title||'')}</div>` },
      { key:'employmentType', header:'Type', render: p => `<div class="text-center">${chip(p.employmentType, 'type')}</div>` },
      { key:'status', header:'Status', render: p => `<div class="text-center">${chip(p.status, 'status')}</div>` },
      { key:'supervisor', header:'Supervisor', render: p => escapeHtml(supervisorName(p)) },
      { key:'email', header:'Email', render: p => `<a href="mailto:${p.email}">${escapeHtml(p.email)}</a>` },
      { key:'startDate', header:'Start Date', sort:'startDate', render: p => formatDate(p.startDate) }
    ];
    buildTable({
      container: desktop,
      columns,
      rows: filtered.pageItems,
      page: state.page,
      pageSize: state.pageSize,
      total: filtered.total,
      sortKey: sortKeyFromState(state.sort),
      sortDir: sortDirFromState(state.sort),
      onSort: (key) => {
        const currentKey = sortKeyFromState(state.sort);
        const dir = currentKey === key && sortDirFromState(state.sort) === 'asc' ? 'desc' : 'asc';
        updateFilters({ sort: `${key}-${dir}` });
      },
      onPageChange: (page, size) => updateFilters({ page, pageSize: size }),
      onRowActivate: (id) => openPersonDrawer(id)
    });
  } else {
    mobile.innerHTML = filtered.pageItems.map(p => mobileCard(p)).join('');
    mobile.querySelectorAll('[data-card-id]').forEach(card => {
      card.addEventListener('click', () => openPersonDrawer(card.getAttribute('data-card-id')));
      card.addEventListener('keydown', (e) => { if (e.key==='Enter' || e.key===' ') { e.preventDefault(); openPersonDrawer(card.getAttribute('data-card-id')); } });
    });
    // Simple pager for mobile
    const pager = document.createElement('div');
    pager.className = 'pagination';
    pager.innerHTML = `
      <button class="btn btn-secondary" ${state.page===1?'disabled':''} data-act="prev">Prev</button>
      <span class="text-muted">Page ${state.page} of ${Math.max(1, Math.ceil(filtered.total/state.pageSize))}</span>
      <button class="btn btn-secondary" ${state.page>=Math.ceil(filtered.total/state.pageSize)?'disabled':''} data-act="next">Next</button>
      <select class="form-control" style="width:auto;">${[10,25,50].map(s=>`<option value="${s}" ${s===state.pageSize?'selected':''}>${s}</option>`).join('')}</select>
    `;
    mobile.appendChild(pager);
    pager.querySelector('[data-act="prev"]').addEventListener('click', ()=> updateFilters({ page: state.page-1 }));
    pager.querySelector('[data-act="next"]').addEventListener('click', ()=> updateFilters({ page: state.page+1 }));
    pager.querySelector('select').addEventListener('change', (e)=> updateFilters({ page:1, pageSize: parseInt(e.target.value,10) }));
  }
}

function applyFilters(all, st) {
  let list = all.slice();
  if (st.employmentType && st.employmentType !== 'All') list = list.filter(p => p.employmentType === st.employmentType);
  if (st.status && st.status !== 'All') list = list.filter(p => p.status === st.status);
  if (st.search) {
    const term = normalize(st.search);
    list = list.filter(p => [p.name, p.title, p.email, (p.tags||[]).join(' ')].some(v => normalize(v||'').includes(term)));
  }
  list.sort(sorter(st.sort));
  const total = list.length;
  const start = (st.page - 1) * st.pageSize;
  const pageItems = list.slice(start, start + st.pageSize);
  return { total, pageItems };
}

function sorter(sort) {
  const [key, dir] = sort.split('-');
  const dirMul = dir === 'desc' ? -1 : 1;
  if (key === 'name') return (a,b) => a.name.localeCompare(b.name) * dirMul;
  if (key === 'title') return (a,b) => (a.title||'').localeCompare(b.title||'') * dirMul;
  if (key === 'seniority') return (a,b) => (new Date(a.startDate||'2100-01-01') - new Date(b.startDate||'2100-01-01')) * dirMul;
  if (key === 'status') return (a,b) => (a.status||'').localeCompare(b.status||'') * dirMul;
  if (key === 'startDate') return (a,b) => (new Date(a.startDate||'2100-01-01') - new Date(b.startDate||'2100-01-01')) * dirMul;
  return (a,b) => a.name.localeCompare(b.name) * dirMul;
}

function onResize() {
  const newMode = window.innerWidth <= 900 ? 'mobile' : 'desktop';
  if (newMode !== viewMode && containerRef) {
    render(containerRef);
  }
}

function updateFilters(updates) {
  state = { ...state, ...updates };
  persistFilters();
  // Incremental update to prevent flicker: only re-render the results section
  if (containerRef) {
    const all = state.dept && state.dept !== 'All' ? getPeopleByDept(state.dept) : getPeople();
    const filtered = applyFilters(all, state);
    renderResults(filtered, containerRef);
    announce(`${filtered.total} people shown`);
  }
}

function persistFilters() { saveDirectoryFilters(state); }

function kpiChip(label, value) {
  return `<span class="kpi-chip" aria-label="${label}: ${value}"><strong>${value}</strong> ${label}</span>`;
}

function avatarPlaceholder(person, size) {
  const cls = size === 'xl' ? 'avatar avatar-xl' : (size === 'lg' ? 'avatar avatar-lg' : 'avatar');
  const initials = (person.name||'').split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase();
  return `<div class="${cls}" aria-hidden="true">${initials}</div>`;
}

function avatarImage(person, size) {
  const cls = size === 'xl' ? 'avatar avatar-xl' : (size === 'lg' ? 'avatar avatar-lg' : 'avatar');
  const alt = `Photo of ${escapeHtml(person.name)}`;
  const src = person.photoUrl || `https://i.pravatar.cc/160?u=${encodeURIComponent(person.email||person.id||person.name||'user')}`;
  return `<img src="${src}" alt="${alt}" class="${cls}">`;
}

function supervisorName(p) {
  const sup = getPerson(p.supervisorId);
  return sup?.name || '—';
}

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month:'short', day:'2-digit', year:'numeric' });
}

function mobileCard(p) {
  return `
    <div class="directory-card" role="button" tabindex="0" data-card-id="${p.id}">
      <div class="directory-card-header">
        ${avatarPlaceholder(p)}
        <div>
          <div style="font-weight:600;">${escapeHtml(p.name)}</div>
          <div class="text-small text-muted">${escapeHtml(p.title||'')}</div>
        </div>
      </div>
      <div class="mt-2">
        ${chip(p.employmentType, 'type')} ${chip(p.status, 'status')}
      </div>
      <div class="mt-2 text-small">
        <div><strong>Supervisor:</strong> ${escapeHtml(supervisorName(p))}</div>
        <div><strong>Email:</strong> <a href="mailto:${p.email}">${escapeHtml(p.email)}</a></div>
        <div><strong>Start:</strong> ${formatDate(p.startDate)}</div>
      </div>
    </div>
  `;
}

function doExport() {
  const all = state.dept && state.dept !== 'All' ? getPeopleByDept(state.dept) : getPeople();
  const filtered = applyFilters(all, { ...state, page:1, pageSize: 100000 });
  exportCSV(
    filtered.pageItems.map(p => ({
      id: p.id,
      name: p.name,
      title: p.title,
      employmentType: p.employmentType,
      status: p.status,
      supervisor: supervisorName(p),
      email: p.email,
      dept: p.dept,
      startDate: p.startDate || ''
    })),
    'people-directory.csv'
  );
}

function getQueryParams() {
  const hash = window.location.hash || '';
  const qIndex = hash.indexOf('?');
  const query = qIndex >= 0 ? hash.slice(qIndex+1) : '';
  return Object.fromEntries(new URLSearchParams(query));
}

function openPersonDrawer(id) {
  const p = getPerson(id);
  if (!p) return;
  const overview = () => `
    <div class="grid grid-2">
      <div><strong>Title:</strong> ${escapeHtml(p.title||'')}</div>
      <div><strong>Department:</strong> ${escapeHtml(p.dept||'')}</div>
      <div><strong>Status:</strong> ${chip(p.status,'status')}</div>
      <div><strong>Start Date:</strong> ${formatDate(p.startDate)}</div>
      ${p.endDate ? `<div><strong>End Date:</strong> ${formatDate(p.endDate)}</div>` : ''}
      <div><strong>Location:</strong> ${escapeHtml(p.location||'—')}</div>
      <div><strong>Tags:</strong> ${(p.tags||[]).map(t=>`<span class="chip chip--muted" style="margin-right:4px;">${escapeHtml(t)}</span>`).join('') || '—'}</div>
    </div>
  `;
  const reporting = () => {
    const chain = getSupervisorChain(p.id);
    const reports = getDirectReports(p.id);
    return `
      <nav aria-label="Reporting line" class="text-small">
        ${chain.map(c => `<span>${escapeHtml(c.name)}</span> &rsaquo; `).join('')}${escapeHtml(p.name)}
      </nav>
      <div class="mt-2">
        <strong>Direct Reports (${reports.length})</strong>
        <div class="mt-1">${reports.map(r => `<div class="mt-1"><span style="font-weight:600;">${escapeHtml(r.name)}</span> – ${escapeHtml(r.title||'')} <span class="text-small text-muted">${escapeHtml(r.email)}</span></div>`).join('') || '<span class="text-muted">None</span>'}</div>
      </div>
    `;
  };
  const contact = () => `
    <div class="grid grid-2">
      <div><strong>Email:</strong> <a href="mailto:${p.email}">${escapeHtml(p.email)}</a></div>
      <div><strong>Phone:</strong> ${p.phone ? `<a href="tel:${p.phone}">${escapeHtml(p.phone)}</a>` : '—'}</div>
    </div>
  `;
  const actions = () => `
    <div class="grid grid-2">
      <a class="btn btn-secondary" href="#/requests/change?personId=${p.id}">Request Change</a>
      <a class="btn btn-secondary" href="#/requests/leave?personId=${p.id}">Leave of Absence</a>
      <a class="btn btn-secondary" href="#/requests/offboard?personId=${p.id}">Offboard</a>
    </div>
  `;
  const header = `
    <div class="profile-header">
      ${avatarImage(p, 'xl')}
      <div class="profile-meta">
        <div class="name">${escapeHtml(p.name)}</div>
        <div class="role-line">${escapeHtml(p.title||'')} • ${escapeHtml(p.dept||'')}</div>
        <div class="chips">${chip(p.employmentType, 'type')} ${chip(p.status, 'status')}</div>
      </div>
    </div>
  `;
  openDrawer({
    title: 'Profile',
    content: header + drawerTabs([
      { id:'overview', label:'Overview', content: overview },
      { id:'reporting', label:'Reporting Line', content: reporting },
      { id:'contact', label:'Contact', content: contact },
      { id:'actions', label:'Actions', content: actions }
    ]),
    width: 520
  });
}

export function cleanup() {
  closeDrawer();
  window.removeEventListener('resize', onResize);
}

// Helpers
function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
function normalize(s) { return String(s||'').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase(); }
function escapeHtml(s) { return String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c])); }
function deptOptions() {
  const depts = Array.from(new Set(getPeople().map(p => p.dept))).sort();
  return ['All', ...depts].map(d => `<option value="${d}" ${sel(state.dept,d)}>${d === 'All' ? 'All Depts' : d}</option>`).join('');
}
function sel(a,b){ return a===b ? 'selected' : ''; }
function sortKeyFromState(s){ return s.split('-')[0]; }
function sortDirFromState(s){ return s.split('-')[1] || 'asc'; }
function announce(msg){ if(liveRegionEl){ liveRegionEl.textContent = msg; } }


