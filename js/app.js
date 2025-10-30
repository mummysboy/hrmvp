/**
 * Harvard HR Portal
 * 
 * A single-page application for managing HR requests, approvals, and personnel information.
 * 
 * Architecture:
 * - Hash-based routing (e.g., #/dashboard, #/requests)
 * - State management via localStorage
 * - No build step required - plain ES modules
 * 
 * Routes:
 * - /dashboard - Main dashboard with KPIs and recent activity
 * - /requests/new-position - New position request form (2-step)
 * - /requests/change - Change to existing employee form
 * - /requests/leave - Sabbatical/Leave request form
 * - /requests/offboard - Termination/Offboarding form
 * - /requests - All requests list with filters
 * - /approvals/pending - Pending approvals for review
 * - /approvals/completed - Completed approvals history
 * - /people/directory - Searchable people directory
 * - /people/orgchart - Organization chart visualization
 * - /budget/positions - Position control overview
 * - /budget/grants - Grant-funded roles
 * - /reports/summary - Summary KPIs and charts
 * - /reports/exports - CSV export functionality
 * - /settings/notifications - Email notification preferences
 * - /settings/delegation - Delegate/proxy management
 * 
 * Modules:
 * - state.js - localStorage state management
 * - router.js - Hash-based routing
 * - ui/sidebar.js - Collapsible sidebar navigation
 * - ui/toast.js - Toast notifications
 * - ui/modal.js - Accessible modal dialogs
 * - pages/*.js - Individual page components
 */

import { init } from './router.js';
import { renderSidebar } from './ui/sidebar.js';

// Import all pages
import * as dashboardPage from './pages/dashboard.js';
import * as requestsNewPage from './pages/requests.new.js';
import * as requestsChangePage from './pages/requests.change.js';
import * as requestsLeavePage from './pages/requests.leave.js';
import * as requestsOffboardPage from './pages/requests.offboard.js';
import * as requestsListPage from './pages/requests.list.js';
import * as approvalsPendingPage from './pages/approvals.pending.js';
import * as approvalsCompletedPage from './pages/approvals.completed.js';
import * as peopleDirectoryPage from './pages/people.directory.js';
import * as peopleOrgchartPage from './pages/people.orgchart.js';
import * as budgetPositionsPage from './pages/budget.positions.js';
import * as budgetGrantsPage from './pages/budget.grants.js';
import * as reportsSummaryPage from './pages/reports.summary.js';
import * as reportsExportsPage from './pages/reports.exports.js';
import * as settingsNotificationsPage from './pages/settings.notifications.js';
import * as settingsDelegationPage from './pages/settings.delegation.js';

// Define routes
const routes = {
  '/dashboard': () => dashboardPage,
  '/requests/new-position': () => requestsNewPage,
  '/requests/change': () => requestsChangePage,
  '/requests/leave': () => requestsLeavePage,
  '/requests/offboard': () => requestsOffboardPage,
  '/requests': () => requestsListPage,
  '/approvals/pending': () => approvalsPendingPage,
  '/approvals/completed': () => approvalsCompletedPage,
  '/people/directory': () => peopleDirectoryPage,
  '/people/orgchart': () => peopleOrgchartPage,
  '/budget/positions': () => budgetPositionsPage,
  '/budget/grants': () => budgetGrantsPage,
  '/reports/summary': () => reportsSummaryPage,
  '/reports/exports': () => reportsExportsPage,
  '/settings/notifications': () => settingsNotificationsPage,
  '/settings/delegation': () => settingsDelegationPage,
  '*': () => dashboardPage // 404 fallback
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  const url = new URL(window.location.href);
  const searchParams = url.searchParams;
  const hash = window.location.hash || '';
  const isEmbed = searchParams.get('embed') === 'true' || /[?#&]embed=true/.test(hash);

  if (isEmbed) {
    document.body.classList.add('embed');
    // Remove early pre-embed class once SPA styles are applied
    try { document.documentElement.classList.remove('pre-embed'); } catch (_) {}
  } else {
    // Render sidebar only in full app mode
    renderSidebar();
  }

  // Initialize router
  init(routes);
});


