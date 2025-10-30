// Requests Calendar page
import { getRequests, updateItem, getEvents, upsertEvent, removeEvent } from '../state.js';
import { navigate } from '../router.js';
import { showModal, closeAllModals } from '../ui/modal.js';

export const title = 'My Calendar';

let view = 'month'; // 'month' | 'week'
let activeDate = new Date();
let filters = { type: 'All', status: 'All' };
let containerRef = null;

export function render(container) {
  containerRef = container;
  const { events, types, statuses } = buildEvents();
  const header = calendarHeader();
  const controls = filterControls(types, statuses);
  const body = view === 'month' ? monthView(events) : weekView(events);
  const upcoming = upcomingEventsMarkup(events);

  container.innerHTML = `
    <div class="page-header">
      <h1>${title}</h1>
    </div>

    <div class="card">
      <div class="card-header">
        <h2 class="card-title" style="margin:0;">Upcoming</h2>
      </div>
      <div class="card-body">
        ${upcoming}
      </div>
    </div>

    <div class="card">
      <div class="cal-toolbar">
        ${header}
        ${controls}
      </div>
      <div class="cal-legend">${legend()}</div>
      <div class="cal-body">${body}</div>
    </div>
  `;

  wireToolbar();
  wireCells();
  wireUpcoming();
}

export function cleanup() {}

// Rendering helpers
function upcomingEventsMarkup(eventsMap){
  const todayKey = dateKey(new Date());
  const list = Object.keys(eventsMap)
    .filter(k => k >= todayKey)
    .flatMap(k => (eventsMap[k]||[]).map(ev => ({...ev, date:k})))
    .filter(passFilters)
    .sort((a,b)=> a.date.localeCompare(b.date))
    .slice(0,5);
  if (!list.length) return '<div class="text-muted">No upcoming items</div>';
  return `<div class="upcoming-rail">${list.map(ev=>`
    <div class="card up-card up-card-square">
      <div class="up-square-top">
        <span class="dot dot-${ev.cat}"></span>
        <div class="up-date">${new Date(ev.date).toLocaleDateString()}</div>
      </div>
      <div class="up-square-title">${escapeHtml(ev.title)}</div>
      <div class="up-square-sub">${escapeHtml(humanCat(ev.cat))}${ev.dept?` • ${escapeHtml(ev.dept)}`:''}</div>
      <div class="up-square-action"><button class="btn btn-sm btn-secondary" data-edit-id="${ev.requestId}">Open</button></div>
    </div>`).join('')}</div>`;
}
function calendarHeader() {
  const m = activeDate.toLocaleString(undefined, { month: 'long' });
  const y = activeDate.getFullYear();
  return `
    <div class="cal-left">
      <button class="btn btn-secondary" data-cal-act="prev">Prev</button>
      <button class="btn btn-secondary" data-cal-act="today">Today</button>
      <button class="btn btn-secondary" data-cal-act="next">Next</button>
      <span class="cal-current">${m} ${y}</span>
    </div>
    <div class="cal-right"></div>
  `;
}

function filterControls(types, statuses) {
  return `
    <div class="cal-filters">
      <select class="form-control" data-cal-filter="type">
        <option ${sel('All', filters.type)}>All Types</option>
        ${types.map(t => `<option ${sel(t, filters.type)}>${t}</option>`).join('')}
      </select>
      <select class="form-control" data-cal-filter="status">
        <option ${sel('All', filters.status)}>All Statuses</option>
        ${statuses.map(s => `<option ${sel(s, filters.status)}>${s}</option>`).join('')}
      </select>
    </div>
  `;
}

function monthView(allEvents) {
  const start = startOfMonthGrid(activeDate);
  const days = Array.from({ length: 42 }).map((_, i) => addDays(start, i));
  const weekdayHdr = weekdayHeader();
  return `
    <div class="cal-weekdays">${weekdayHdr}</div>
    <div class="cal-grid cal-grid-month">
      ${days.map(d => dayCell(d, allEvents)).join('')}
    </div>
  `;
}

function weekView(allEvents) {
  const start = startOfWeek(activeDate);
  const days = Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  const weekdayHdr = weekdayHeader();
  return `
    <div class="cal-weekdays">${weekdayHdr}</div>
    <div class="cal-grid cal-grid-week">
      ${days.map(d => dayCell(d, allEvents)).join('')}
    </div>
  `;
}

function weekdayHeader() {
  const base = startOfWeek(new Date());
  return Array.from({ length: 7 }).map((_, i) => {
    const d = addDays(base, i);
    return `<div class="cal-weekday">${d.toLocaleDateString(undefined, { weekday: 'short' })}</div>`;
  }).join('');
}

function dayCell(d, allEvents) {
  const key = dateKey(d);
  const events = (allEvents[key] || []).filter(passFilters);
  const isToday = sameDay(d, new Date());
  const isOtherMonth = d.getMonth() !== activeDate.getMonth();
  return `
    <div class="cal-cell ${isOtherMonth ? 'muted' : ''}" data-date="${key}">
      <div class="cal-cell-header">
        <span class="cal-date ${isToday ? 'today' : ''}" data-create="${key}" title="Create event on ${key}">${d.getDate()}</span>
        ${events.length ? `<span class="cal-count">${events.length}</span>` : ''}
      </div>
      <div class="cal-dots">${events.slice(0,5).map(ev => `<span class="dot dot-${ev.cat}" title="${escapeHtml(ev.title)}"></span>`).join('')}</div>
    </div>
  `;
}

function legend() {
  const items = [
    { cat:'interview', label:'Interview' },
    { cat:'newhire', label:'New Hire Start' },
    { cat:'onboard', label:'Onboarding' },
    { cat:'review', label:'Review Meeting' },
    { cat:'other', label:'Other' }
  ];
  return items.map(i => `<span class="legend-item"><span class="dot dot-${i.cat}"></span>${i.label}</span>`).join('');
}

function wireToolbar() {
  const root = containerRef;
  root.querySelectorAll('[data-cal-act]').forEach(btn => {
    btn.addEventListener('click', () => {
      const act = btn.getAttribute('data-cal-act');
      if (act === 'prev') activeDate = view === 'month' ? addMonths(activeDate, -1) : addDays(activeDate, -7);
      if (act === 'next') activeDate = view === 'month' ? addMonths(activeDate, 1) : addDays(activeDate, 7);
      if (act === 'today') activeDate = new Date();
      render(containerRef);
    });
  });
  // View toggle removed per requirements (default month view)
  root.querySelectorAll('[data-cal-filter]').forEach(sel => {
    sel.addEventListener('change', () => {
      const k = sel.getAttribute('data-cal-filter');
      filters = { ...filters, [k]: sel.value };
      render(containerRef);
    });
  });
}

function wireCells() {
  containerRef.querySelectorAll('.cal-cell').forEach(cell => {
    cell.addEventListener('click', () => openEventEditor(null, parseDate(cell.getAttribute('data-date'))));
    cell.addEventListener('keydown', (e) => { if (e.key==='Enter' || e.key===' ') { e.preventDefault(); openEventEditor(null, parseDate(cell.getAttribute('data-date'))); } });
  });
  // Clicking the count badge opens the day drawer to review items
  containerRef.querySelectorAll('.cal-count').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', (e) => { e.stopPropagation(); const date = el.closest('.cal-cell').getAttribute('data-date'); openDayDrawer(date); });
  });
  containerRef.querySelectorAll('.cal-date[data-create]').forEach(el => {
    el.setAttribute('role','button');
    el.setAttribute('tabindex','0');
    el.addEventListener('click', (e) => { e.stopPropagation(); const date = el.getAttribute('data-create'); openEventEditor(null, parseDate(date)); });
    el.addEventListener('keydown', (e) => { if (e.key==='Enter' || e.key===' ') { e.preventDefault(); e.stopPropagation(); const date = el.getAttribute('data-create'); openEventEditor(null, parseDate(date)); } });
  });
}

function wireUpcoming() {
  if (!containerRef) return;
  containerRef.querySelectorAll('[data-edit-id]').forEach(btn => {
    btn.addEventListener('click', () => openEditor(btn.getAttribute('data-edit-id')));
  });
  containerRef.querySelectorAll('[data-open]').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.getAttribute('data-open')));
  });
}

function openDayDrawer(key) {
  const { events } = buildEvents();
  const list = (events[key] || []).filter(passFilters);
  if (!list.length) return;
  const drawer = document.createElement('div');
  drawer.className = 'drawer';
  drawer.innerHTML = `
    <div class="drawer-header">
      <h2>${new Date(key).toLocaleDateString()}</h2>
      <button class="drawer-close" aria-label="Close">&times;</button>
    </div>
    <div class="drawer-body">
      ${list.map(ev => `
        <div class="card" style="margin:0 0 1rem 0;">
          <div class="card-header">
            <div>
              <div class="card-title">${escapeHtml(ev.title)}</div>
              <div class="text-small text-muted">${escapeHtml(ev.type)} • ${escapeHtml(ev.status)}</div>
            </div>
            <span class="chip chip-${statusChip(ev.status)}">${escapeHtml(ev.status)}</span>
          </div>
          <div class="card-body">
            <div class="text-small text-muted">${escapeHtml(humanCat(ev.cat))} • ${escapeHtml(ev.dept)}${ev.requester?` • ${escapeHtml(ev.requester)}`:''}</div>
            <div class="mt-1">
              <button class="btn btn-secondary" data-open="${ev.route}">Open</button>
              <button class="btn btn-primary" data-edit-id="${ev.requestId}" style="margin-left:.5rem;">Edit</button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  document.body.appendChild(drawer);
  drawer.querySelector('.drawer-close').addEventListener('click', () => drawer.remove());
  drawer.querySelectorAll('[data-open]').forEach(btn => btn.addEventListener('click', () => { navigate(btn.getAttribute('data-open')); drawer.remove(); }));
  drawer.querySelectorAll('[data-edit-id]').forEach(btn => btn.addEventListener('click', () => { openEditor(btn.getAttribute('data-edit-id')); drawer.remove(); }));
}

// Data
function buildEvents() {
  const reqs = getRequests();
  const userEvents = getEvents();
  const map = {};
  const types = Array.from(new Set(reqs.map(r => r.type))).sort();
  const statuses = Array.from(new Set(reqs.map(r => r.status))).sort();

  // User events
  userEvents.forEach(ev => {
    const key = dateKey(new Date(ev.date));
    push(map, key, {
      key,
      title: ev.title,
      type: 'Event',
      status: ev.allDay ? 'All-day' : `${ev.start||''}${ev.end?`–${ev.end}`:''}`,
      requester: '',
      dept: ev.location || '',
      route: '#',
      eventId: ev.id,
      cat: ev.category || 'other'
    });
  });

  reqs.forEach(r => {
    // Planning/Review meeting around submission
    const d1 = dateKey(new Date(r.submitted));
    push(map, d1, {
      key: d1,
      title: `${r.title} – Review`,
      type: r.type,
      status: r.status,
      requester: r.requester,
      dept: r.dept,
      route: routeFor(r),
      requestId: r.id,
      cat: 'review'
    });
    // effective start date if present
    if (r.details && r.details.startDate) {
      const d2 = dateKey(new Date(r.details.startDate));
      push(map, d2, {
        key: d2,
        title: `${r.title} – Start Date`,
        type: r.type,
        status: r.status,
        requester: r.requester,
        dept: r.dept,
        route: routeFor(r),
        requestId: r.id,
        cat: /sabbatical/i.test(r.type) ? 'other' : 'newhire'
      });
      // Onboarding session the following week
      const onboardDate = dateKey(addDays(new Date(r.details.startDate), 3));
      push(map, onboardDate, {
        key: onboardDate,
        title: `${r.title} – Onboarding Session`,
        type: r.type,
        status: r.status,
        requester: r.requester,
        dept: r.dept,
        route: routeFor(r),
        requestId: r.id,
        cat: 'onboard'
      });
    }
    // For new position requests without start date, add a tentative interview a week after submission
    if (/new position/i.test(r.type) && !((r.details||{}).startDate)) {
      const intDate = dateKey(addDays(new Date(r.submitted), 7));
      push(map, intDate, {
        key: intDate,
        title: `${r.title} – Interview`,
        type: r.type,
        status: r.status,
        requester: r.requester,
        dept: r.dept,
        route: routeFor(r),
        requestId: r.id,
        cat: 'interview'
      });
    }
  });

  return { events: map, types, statuses };
}

function routeFor(r) {
  if (r.type === 'New Position') return '/requests/new-position';
  if (r.type.includes('Change')) return '/requests/change';
  if (r.type === 'Sabbatical') return '/requests/leave';
  return '/requests';
}

// Utils
function passFilters(ev) {
  const typeOk = (filters.type === 'All') || ev.type === filters.type;
  const statusOk = (filters.status === 'All') || ev.status === filters.status;
  return typeOk && statusOk;
}

function openEditor(requestId) {
  const req = getRequests().find(r => String(r.id) === String(requestId));
  if (!req) return;
  const content = `
    <form id="edit-form" class="form-grid">
      <div>
        <label class="form-label">Title</label>
        <input type="text" class="form-control" name="title" value="${escapeHtml(req.title||'')}" />
      </div>
      <div>
        <label class="form-label">Status</label>
        <select name="status" class="form-control">
          ${['Draft','Pending Review','Approved','Rejected','Needs Revision'].map(s=>`<option ${req.status===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="form-label">Type</label>
        <select name="type" class="form-control">
          ${['New Position','Change','Sabbatical','Promotion'].map(t=>`<option ${req.type===t?'selected':''}>${t}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="form-label">Department</label>
        <input type="text" class="form-control" name="dept" value="${escapeHtml(req.dept||'')}" />
      </div>
      <div>
        <label class="form-label">Start Date</label>
        <input type="date" class="form-control" name="startDate" value="${escapeHtml((req.details&&req.details.startDate)||'')}" />
      </div>
      <div class="mt-2" style="text-align:right;">
        <button type="button" class="btn btn-secondary" data-action="cancel">Cancel</button>
        <button type="submit" class="btn btn-primary" style="margin-left:.5rem;">Save</button>
      </div>
    </form>
  `;
  const cleanup = showModal({ title: 'Edit Request', content });
  const modalEl = document.querySelector('.modal-overlay:last-child .modal');
  const form = modalEl.querySelector('#edit-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const updates = {
      title: fd.get('title'),
      status: fd.get('status'),
      type: fd.get('type'),
      dept: fd.get('dept')
    };
    const startDate = fd.get('startDate');
    if (startDate) {
      const details = { ...(req.details||{}), startDate };
      updates.details = details;
    }
    updateItem('requests', r => String(r.id) === String(requestId), updates);
    cleanup();
    // Re-render to reflect changes
    if (containerRef) render(containerRef);
  });
  modalEl.querySelector('[data-action="cancel"]').addEventListener('click', () => { cleanup(); });
}

function openEventEditor(eventId, defaultDate) {
  const ev = eventId ? getEvents().find(e => String(e.id)===String(eventId)) : { date: dateKey(defaultDate||new Date()), allDay: true, category: 'meeting' };
  const content = `
    <form id="event-form" class="form-grid">
      <div>
        <label class="form-label">Title</label>
        <input type="text" class="form-control" name="title" value="${escapeHtml(ev.title||'')}" required />
      </div>
      <div class="grid grid-2">
        <div>
          <label class="form-label">Date</label>
          <input type="date" class="form-control" name="date" value="${escapeHtml(ev.date||'')}" required />
        </div>
        <div>
          <label class="form-label">All Day</label>
          <select name="allDay" class="form-control"><option ${ev.allDay?'selected':''} value="true">Yes</option><option ${!ev.allDay?'selected':''} value="false">No</option></select>
        </div>
      </div>
      <div class="grid grid-2">
        <div>
          <label class="form-label">Start</label>
          <input type="time" class="form-control" name="start" value="${escapeHtml(ev.start||'')}" />
        </div>
        <div>
          <label class="form-label">End</label>
          <input type="time" class="form-control" name="end" value="${escapeHtml(ev.end||'')}" />
        </div>
      </div>
      <div>
        <label class="form-label">Category</label>
        <select name="category" class="form-control">
          ${['meeting','interview','newhire','onboard','review','other'].map(c=>`<option ${ev.category===c?'selected':''} value="${c}">${humanCat(c)}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="form-label">Location</label>
        <input type="text" class="form-control" name="location" value="${escapeHtml(ev.location||'')}" />
      </div>
      <div>
        <label class="form-label">Notes</label>
        <textarea class="form-control" name="notes">${escapeHtml(ev.notes||'')}</textarea>
      </div>
      <div class="mt-2" style="display:flex;justify-content:space-between;align-items:center;">
        ${eventId ? `<button type="button" class="btn btn-ghost" data-action="delete">Delete</button>` : '<span></span>'}
        <div>
          <button type="button" class="btn btn-secondary" data-action="cancel">Cancel</button>
          <button type="submit" class="btn btn-primary" style="margin-left:.5rem;">Save</button>
        </div>
      </div>
    </form>
  `;
  const cleanup = showModal({ title: eventId ? 'Edit Event' : 'Create Event', content });
  const modalEl = document.querySelector('.modal-overlay:last-child .modal');
  const form = modalEl.querySelector('#event-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    const payload = {
      id: eventId,
      title: data.title,
      date: data.date,
      allDay: data.allDay === 'true',
      start: data.start || undefined,
      end: data.end || undefined,
      category: data.category,
      location: data.location,
      notes: data.notes
    };
    upsertEvent(payload);
    cleanup();
    if (containerRef) render(containerRef);
  });
  modalEl.querySelector('[data-action="cancel"]').addEventListener('click', () => { cleanup(); });
  const delBtn = modalEl.querySelector('[data-action="delete"]');
  if (delBtn) delBtn.addEventListener('click', () => { removeEvent(eventId); cleanup(); if (containerRef) render(containerRef); });
}
function push(map, key, val) { map[key] = map[key] || []; map[key].push(val); }
function dateKey(d) { const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); const day=String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${day}`; }
function parseDate(s){ const [y,m,d]=String(s||'').split('-').map(n=>parseInt(n,10)); return new Date(y, (m||1)-1, d||1); }
function startOfWeek(d) { const x=new Date(d); const day=x.getDay(); const diff=(day+6)%7; x.setDate(x.getDate()-diff); x.setHours(0,0,0,0); return x; }
function startOfMonthGrid(d) { const first=new Date(d.getFullYear(), d.getMonth(), 1); return addDays(startOfWeek(first), 0); }
function addDays(d, n) { const x=new Date(d); x.setDate(x.getDate()+n); return x; }
function addMonths(d, n) { const x=new Date(d); x.setMonth(x.getMonth()+n); return x; }
function sameDay(a,b){ return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }
function sel(a,b){ return a===b ? 'selected' : ''; }
function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c])); }
function humanCat(c){ return ({interview:'Interview', newhire:'New Hire Start', onboard:'Onboarding', review:'Review Meeting', other:'Other'})[c] || 'Other'; }
function statusChip(s){
  const map = { 'Approved':'approved', 'Rejected':'rejected', 'Draft':'draft', 'Needs Revision':'pending', 'Pending Review':'pending' };
  return map[s] || 'pending';
}

// Lightweight styles scoped to this page
// We inline minimal CSS selectors that piggyback on the existing design system classes
const style = document.createElement('style');
style.textContent = `
.cal-toolbar{display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap}
.cal-left{display:flex;align-items:center;gap:.5rem}
.cal-right{display:flex;align-items:center;gap:.5rem}
.cal-current{margin-left:.5rem;font-weight:600}
.cal-filters{display:flex;gap:.5rem;align-items:center}
.cal-legend{display:flex;gap:1rem;flex-wrap:wrap;padding:.5rem 0;color:var(--color-text-secondary)}
.legend-item{display:flex;align-items:center;gap:.4rem;font-size:.9rem}
.dot{display:inline-block;width:8px;height:8px;border-radius:50%}
.dot-interview{background:#2563eb}
.dot-newhire{background:#16a34a}
.dot-onboard{background:#0ea5e9}
.dot-review{background:#a855f7}
.dot-other{background:#64748b}
.cal-weekdays{display:grid;grid-template-columns:repeat(7,1fr);gap:.5rem;margin:.25rem 0 .5rem 0}
.cal-weekday{font-size:.85rem;color:#666;text-align:center}
.cal-grid{display:grid;gap:.5rem}
.cal-grid-month{grid-template-columns:repeat(7,1fr)}
.cal-grid-week{grid-template-columns:repeat(7,1fr)}
.cal-cell{border:1px solid #e5e5e5;border-radius:8px;padding:.5rem;min-height:90px;cursor:pointer;outline:none}
.cal-cell:hover{background:#f8f9fb}
.cal-cell:focus{box-shadow:0 0 0 3px rgba(37,99,235,.35)}
.cal-cell.muted{background:#fafafa;color:#999}
.cal-cell-header{display:flex;justify-content:space-between;align-items:center}
.cal-date{font-weight:600}
.cal-date.today{background:#111;color:#fff;border-radius:12px;padding:.1rem .45rem}
.cal-date[data-create]{cursor:pointer;border-radius:12px;padding:.1rem .45rem}
.cal-date[data-create]:hover{background:#f0f2f5}
.cal-count{background:#f1f5f9;border-radius:10px;padding:.1rem .4rem;font-size:.75rem;color:#475569}
.cal-dots{display:flex;gap:4px;margin-top:.35rem;flex-wrap:wrap}
.upcoming-list{display:flex;flex-direction:column;gap:.5rem}
.up-item{display:flex;align-items:center;gap:.5rem}
.up-item .dot{width:10px;height:10px}
.up-body{flex:1}
.up-title{font-weight:600}
.upcoming-rail{display:flex;gap:.75rem;overflow-x:auto;padding-bottom:.25rem;scroll-snap-type:x mandatory}
.upcoming-rail{mask-image: linear-gradient(to right, black 85%, transparent);}
.upcoming-rail::-webkit-scrollbar{height:8px}
.up-card{padding:.75rem;border-radius:12px;scroll-snap-align:start;flex:0 0 calc((100% - 3 * .75rem)/4)}
@media (max-width: 900px){.up-card{flex:0 0 calc((100% - 3 * .5rem)/2)}}
.up-card-square{display:flex;flex-direction:column;justify-content:space-between;min-height:140px}
.up-card:hover{box-shadow:0 8px 16px rgba(0,0,0,.06); transform: translateY(-1px); transition: box-shadow .2s ease, transform .2s ease}
.up-card{transition: box-shadow .2s ease, transform .2s ease}
.up-square-top{display:flex;justify-content:space-between;align-items:center}
.up-square-top .dot{width:10px;height:10px}
.up-square-title{font-weight:600;margin:.35rem 0;line-height:1.25}
.up-square-sub{color:#666;font-size:.85rem}
.up-square-action{display:flex;justify-content:flex-end;margin-top:.5rem}
`;
document.head.appendChild(style);


