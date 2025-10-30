// Simple table builder with sorting, pagination, and keyboard row navigation

export function buildTable({ container, columns, rows, page, pageSize, total, sortKey = null, sortDir = 'asc', onSort, onPageChange, onRowActivate }) {
  const existingTable = container.querySelector('table.table');
  const existingPager = container.querySelector('.pagination');
  const tableId = existingPager?.querySelector('select')?.id || `tbl-${Date.now()}`;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);

  // If structure exists, update only tbody and pagination to avoid flicker
  if (existingTable && existingPager && existingTable.tHead) {
    // Update header sort state
    const headerRow = existingTable.tHead.rows[0];
    if (headerRow) {
      Array.from(headerRow.cells).forEach((th, idx) => {
        const col = columns[idx];
        if (!col) return;
        if (col.sort) {
          th.setAttribute('tabindex', '0');
          th.setAttribute('data-sort', col.sort);
          const ariaSort = sortKey === col.sort ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none';
          th.setAttribute('aria-sort', ariaSort);
        } else {
          th.removeAttribute('tabindex');
          th.removeAttribute('data-sort');
          th.removeAttribute('aria-sort');
        }
      });
    }

    // Update body rows
    const tbody = existingTable.tBodies[0];
    if (tbody) {
      tbody.innerHTML = rows.map((row, idx) => rowHtml(row, idx, columns)).join('');
    }

    // Update pagination controls
    const prevBtn = existingPager.querySelector('[data-page="prev"]');
    const nextBtn = existingPager.querySelector('[data-page="next"]');
    const summary = existingPager.querySelector('span.text-muted');
    const sizeSel = existingPager.querySelector('select');
    if (prevBtn) prevBtn.disabled = page === 1;
    if (nextBtn) nextBtn.disabled = page === totalPages;
    if (summary) summary.textContent = `${start}-${end} of ${total}`;
    if (sizeSel) sizeSel.value = String(pageSize);

    // Rebind events for new rows only
    bindEvents({ container, onSort, onPageChange, onRowActivate, page, pageSize, tableId });
    return;
  }

  // Initial full render
  container.innerHTML = `
    <div class="table-responsive">
      <table class="table" role="grid" aria-rowcount="${rows.length}">
        <thead>
          <tr>
            ${columns.map(col => headerCell(col, sortKey, sortDir)).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map((row, idx) => rowHtml(row, idx, columns)).join('')}
        </tbody>
      </table>
    </div>
    <div class="pagination" role="navigation" aria-label="Pagination">
      <button class="btn btn-secondary" data-page="prev" aria-label="Previous page" ${page === 1 ? 'disabled' : ''}>&lt;</button>
      <span class="text-muted">${start}-${end} of ${total}</span>
      <button class="btn btn-secondary" data-page="next" aria-label="Next page" ${page === totalPages ? 'disabled' : ''}>&gt;</button>
      <label class="text-muted" for="${tableId}-size" style="margin-left: auto;">Rows</label>
      <select id="${tableId}-size" class="form-control" style="width: auto;">
        ${[10,25,50].map(s => `<option value="${s}" ${s===pageSize?'selected':''}>${s}</option>`).join('')}
      </select>
    </div>
  `;

  bindEvents({ container, onSort, onPageChange, onRowActivate, page, pageSize, tableId });
}

function headerCell(col, sortKey, sortDir) {
  const ariaSort = col.sort ? (sortKey === col.sort ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none') : undefined;
  return `<th ${col.width ? `style="width:${col.width}"` : ''} role="columnheader" ${col.sort ? 'tabindex="0"' : ''} ${col.sort ? `data-sort="${col.sort}"` : ''} ${ariaSort ? `aria-sort="${ariaSort}"` : ''}>${col.header || ''}</th>`;
}

function rowHtml(row, idx, columns) {
  return `<tr role="row" tabindex="0" class="clickable-row" data-row-id="${row.id}">
    ${columns.map(col => `<td role="gridcell">${col.render ? col.render(row) : (row[col.key] ?? '')}</td>`).join('')}
  </tr>`;
}

function bindEvents({ container, onSort, onPageChange, onRowActivate, page, pageSize, tableId }) {
  // Sorting
  container.querySelectorAll('th[role="columnheader"]').forEach(th => {
    const key = th.getAttribute('data-sort');
    if (!key) return;
    th.onclick = () => onSort && onSort(key);
    th.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSort && onSort(key);
      }
    };
  });

  // Pagination
  const prev = container.querySelector('[data-page="prev"]');
  const next = container.querySelector('[data-page="next"]');
  if (prev) prev.onclick = () => onPageChange && onPageChange(page - 1, pageSize);
  if (next) next.onclick = () => onPageChange && onPageChange(page + 1, pageSize);
  const sizeEl = container.querySelector(`#${tableId}-size`);
  if (sizeEl) sizeEl.onchange = (e) => {
    onPageChange && onPageChange(1, parseInt(e.target.value, 10));
  };

  // Row activation and keyboard focus
  const bodyRows = Array.from(container.querySelectorAll('tbody tr'));
  bodyRows.forEach(rowEl => {
    rowEl.onclick = () => onRowActivate && onRowActivate(rowEl.getAttribute('data-row-id'));
    rowEl.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onRowActivate && onRowActivate(rowEl.getAttribute('data-row-id'));
      }
    };
  });
  const tbody = container.querySelector('tbody');
  if (tbody) {
    tbody.onkeydown = (e) => {
      const currentIndex = bodyRows.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = Math.min(bodyRows.length - 1, currentIndex + 1);
        (bodyRows[nextIndex] || bodyRows[0]).focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = Math.max(0, currentIndex - 1);
        (bodyRows[prevIndex] || bodyRows[0]).focus();
      }
    };
  }
}


