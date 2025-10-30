// State management module
import { seed } from '../data/mock.js';

// Use a single namespaced key; bump version to refresh seed when updated
const STORAGE_KEY = 'hr.app.state.v2';
const LEGACY_KEYS = ['hrPortalState'];

export function loadState() {
  // Preferred current key
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse state:', e);
      return seed;
    }
  }

  // Migrate from any legacy keys, if present
  for (const key of LEGACY_KEYS) {
    const legacy = localStorage.getItem(key);
    if (legacy) {
      try {
        const parsed = JSON.parse(legacy);
        saveState(parsed);
        return parsed;
      } catch (e) {
        console.warn('Failed to migrate legacy state key', key, e);
      }
    }
  }

  // First load - initialize with seed
  saveState(seed);
  return seed;
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

export function get(path, defaultValue = null) {
  const state = loadState();
  const parts = path.split('.');
  let current = state;
  
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return defaultValue;
    }
    current = current[part];
  }
  
  return current !== undefined ? current : defaultValue;
}

export function set(path, value) {
  const state = loadState();
  const parts = path.split('.');
  const lastKey = parts.pop();
  let current = state;
  
  for (const part of parts) {
    if (!(part in current) || typeof current[part] !== 'object') {
      current[part] = {};
    }
    current = current[part];
  }
  
  current[lastKey] = value;
  saveState(state);
}

export function push(path, item) {
  const arr = get(path, []);
  arr.push(item);
  set(path, arr);
}

export function updateItem(path, predicate, updates) {
  const state = loadState();
  const arr = get(path, []);
  const index = arr.findIndex(predicate);
  
  if (index !== -1) {
    arr[index] = { ...arr[index], ...updates };
    set(path, arr);
  }
}

export function removeItem(path, predicate) {
  const arr = get(path, []);
  const filtered = arr.filter((item, index) => !predicate(item, index));
  set(path, filtered);
}

// Get user from state
export function getUser() {
  return get('user');
}

// Get requests (optionally filtered by type/status)
export function getRequests(filters = {}) {
  let requests = get('requests', []);
  
  if (filters.type) {
    requests = requests.filter(r => r.type === filters.type);
  }
  if (filters.status) {
    requests = requests.filter(r => r.status === filters.status);
  }
  if (filters.dept) {
    requests = requests.filter(r => r.dept === filters.dept);
  }
  
  return requests;
}

// Get approvals for current user
export function getApprovals(filters = {}) {
  let approvals = get('approvals', []);
  const user = getUser();
  
  if (filters.status) {
    approvals = approvals.filter(a => a.status === filters.status);
  }
  
  return approvals;
}
/**
 * People helpers
 */
export function getPeople() {
  return get('people', []);
}

export function getPerson(id) {
  if (!id) return undefined;
  return getPeople().find(p => p.id === id);
}

export function getPeopleByDept(dept) {
  const people = getPeople();
  if (!dept || dept === 'All') return people;
  return people.filter(p => p.dept === dept);
}

export function getDirectReports(id) {
  if (!id) return [];
  return getPeople().filter(p => p.supervisorId === id);
}

export function getSupervisorChain(id) {
  const chain = [];
  let current = getPerson(id);
  const seen = new Set();
  while (current && current.supervisorId && !seen.has(current.supervisorId)) {
    seen.add(current.id);
    const sup = getPerson(current.supervisorId);
    if (sup) {
      chain.unshift(sup);
      current = sup;
    } else {
      break;
    }
  }
  return chain;
}

export function upsertPerson(person) {
  const people = getPeople();
  const idx = people.findIndex(p => p.id === person.id);
  if (idx >= 0) {
    people[idx] = { ...people[idx], ...person };
  } else {
    people.push(person);
  }
  set('people', people);
}

export function removePerson(id) {
  set('people', getPeople().filter(p => p.id !== id));
}

// Directory filter persistence helpers
const FILTERS_KEY = 'directory.filters.v2';
export function loadDirectoryFilters() {
  try {
    const raw = localStorage.getItem(FILTERS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}
export function saveDirectoryFilters(filters) {
  try {
    localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
  } catch (_) {
    // no-op
  }
}
