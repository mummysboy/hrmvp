/**
 * College HR System - Session Storage Manager
 * Manages application state using sessionStorage
 * Later, this will be replaced with real backend API calls
 */

const SessionStore = {
  // Configuration
  config: {
    storageKey: 'hr-app-data',
    debugMode: true,
  },

  /**
   * Initialize sample data (call on app startup)
   */
  init() {
    // Always regenerate sample data with fresh timestamps
    sessionStorage.setItem(this.config.storageKey, JSON.stringify(this._getSampleData()));
    this._log('SessionStore initialized with sample data');
  },

  /**
   * Get all data
   */
  getData() {
    const data = sessionStorage.getItem(this.config.storageKey);
    return data ? JSON.parse(data) : this._getSampleData();
  },

  /**
   * Save all data
   */
  saveData(data) {
    sessionStorage.setItem(this.config.storageKey, JSON.stringify(data));
    this._log('Data saved to session');
  },

  // ========== REQUESTS ==========

  /**
   * Get all requests
   */
  getRequests(filters = {}) {
    const data = this.getData();
    let requests = [...data.requests];

    // Apply filters
    if (filters.status) {
      requests = requests.filter(r => r.status === filters.status);
    }
    if (filters.type) {
      requests = requests.filter(r => r.type === filters.type);
    }
    if (filters.department) {
      requests = requests.filter(r => r.department === filters.department);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      requests = requests.filter(r => 
        r.title.toLowerCase().includes(q) || 
        r.description.toLowerCase().includes(q)
      );
    }

    return requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  /**
   * Get single request by ID
   */
  getRequest(id) {
    const data = this.getData();
    return data.requests.find(r => r.id === id);
  },

  /**
   * Create new request
   */
  createRequest(requestData) {
    const data = this.getData();
    const newRequest = {
      id: Date.now().toString(),
      ...requestData,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user',
      approvalSteps: [],
    };
    data.requests.push(newRequest);
    this.saveData(data);
    this._log('Request created:', newRequest.id);
    return newRequest;
  },

  /**
   * Update request
   */
  updateRequest(id, updates) {
    const data = this.getData();
    const request = data.requests.find(r => r.id === id);
    if (request) {
      Object.assign(request, updates, { updatedAt: new Date().toISOString() });
      this.saveData(data);
      this._log('Request updated:', id);
    }
    return request;
  },

  /**
   * Delete request
   */
  deleteRequest(id) {
    const data = this.getData();
    data.requests = data.requests.filter(r => r.id !== id);
    this.saveData(data);
    this._log('Request deleted:', id);
  },

  /**
   * Submit request for approval
   */
  submitRequest(id) {
    return this.updateRequest(id, {
      status: 'PENDING_REVIEW',
      submittedAt: new Date().toISOString(),
    });
  },

  /**
   * Approve request
   */
  approveRequest(id, approverId, comment = '') {
    const data = this.getData();
    const request = data.requests.find(r => r.id === id);
    
    if (request) {
      const approvalStep = {
        id: Date.now().toString(),
        action: 'APPROVED',
        approvedBy: approverId,
        approvedAt: new Date().toISOString(),
        comment,
      };
      
      if (!request.approvalSteps) {
        request.approvalSteps = [];
      }
      request.approvalSteps.push(approvalStep);
      
      // Check if all approvals are complete (dummy logic)
      const allApproved = request.approvalSteps.length >= 2;
      if (allApproved) {
        request.status = 'APPROVED';
      }
      
      request.updatedAt = new Date().toISOString();
      this.saveData(data);
      this._log('Request approved:', id);
    }
    
    return request;
  },

  /**
   * Reject request
   */
  rejectRequest(id, rejecterId, reason = '') {
    const data = this.getData();
    const request = data.requests.find(r => r.id === id);
    
    if (request) {
      request.status = 'REJECTED';
      request.rejectedBy = rejecterId;
      request.rejectionReason = reason;
      request.rejectedAt = new Date().toISOString();
      request.updatedAt = new Date().toISOString();
      this.saveData(data);
      this._log('Request rejected:', id);
    }
    
    return request;
  },

  // ========== DASHBOARDS / ANALYTICS ==========

  /**
   * Get dashboard stats
   */
  getDashboardStats() {
    const requests = this.getData().requests;
    
    return {
      pending: requests.filter(r => r.status === 'PENDING_REVIEW').length,
      approved: requests.filter(r => r.status === 'APPROVED').length,
      rejected: requests.filter(r => r.status === 'REJECTED').length,
      draft: requests.filter(r => r.status === 'DRAFT').length,
      total: requests.length,
    };
  },

  /**
   * Get user's pending approvals
   */
  getPendingApprovals(userId) {
    const requests = this.getData().requests;
    return requests.filter(r => r.status === 'PENDING_REVIEW');
  },

  /**
   * Get recent activity
   */
  getRecentActivity(limit = 10) {
    const data = this.getData();
    return data.requests
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, limit)
      .map(r => ({
        id: r.id,
        title: r.title,
        type: r.type,
        status: r.status,
        action: this._getLastAction(r),
        timestamp: r.updatedAt,
      }));
  },

  // ========== HELPER METHODS ==========

  /**
   * Get sample data for initialization
   */
  _getSampleData() {
    // Generate dynamic timestamps relative to now
    const now = new Date();
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
    const threeMinutesAgo = new Date(now.getTime() - 3 * 60 * 1000);
    const fourMinutesAgo = new Date(now.getTime() - 4 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

    return {
      requests: [
        {
          id: '1',
          title: 'New Senior Research Scientist Position',
          type: 'NEW_POSITION',
          description: 'Request for a new senior-level research scientist position in the Physics department.',
          department: 'Physics',
          status: 'PENDING_REVIEW',
          createdAt: twoMinutesAgo.toISOString(),
          updatedAt: twoMinutesAgo.toISOString(),
          createdBy: 'Dr. Sarah Johnson',
          requestedBy: 'Dr. Sarah Johnson',
          approvalSteps: [
            { id: '1', action: 'APPROVED', approvedBy: 'John Smith (HR)', approvedAt: twoMinutesAgo.toISOString() },
          ],
          salary: '$120,000 - $150,000',
          startDate: '2025-09-01',
          documents: [],
        },
        {
          id: '2',
          title: 'Faculty Promotion Request',
          type: 'PROMOTION',
          description: 'Promotion of Dr. James Mitchell from Associate Professor to Full Professor.',
          department: 'Engineering',
          status: 'APPROVED',
          createdAt: threeMinutesAgo.toISOString(),
          updatedAt: threeMinutesAgo.toISOString(),
          createdBy: 'Dean Sarah Wilson',
          requestedBy: 'Dean Sarah Wilson',
          approvalSteps: [
            { id: '1', action: 'APPROVED', approvedBy: 'HR Department', approvedAt: threeMinutesAgo.toISOString() },
            { id: '2', action: 'APPROVED', approvedBy: 'Finance', approvedAt: threeMinutesAgo.toISOString() },
          ],
          documents: [],
        },
        {
          id: '3',
          title: 'Sabbatical Leave Request',
          type: 'SABBATICAL',
          description: 'One-year sabbatical leave for research and publication.',
          department: 'History',
          status: 'DRAFT',
          createdAt: fourMinutesAgo.toISOString(),
          updatedAt: fourMinutesAgo.toISOString(),
          createdBy: 'Prof. Emma Davis',
          requestedBy: 'Prof. Emma Davis',
          approvalSteps: [],
          duration: '12 months',
          startDate: '2025-06-01',
          documents: [],
        },
        {
          id: '4',
          title: 'Grant Funding Coordinator Position',
          type: 'NEW_POSITION',
          description: 'New position for grant funding coordination and compliance.',
          department: 'Research Administration',
          status: 'REJECTED',
          createdAt: twoDaysAgo.toISOString(),
          updatedAt: twoDaysAgo.toISOString(),
          createdBy: 'Robert Chen',
          requestedBy: 'Robert Chen',
          approvalSteps: [
            { id: '1', action: 'REJECTED', approvedBy: 'Finance Department', approvedAt: twoDaysAgo.toISOString(), comment: 'Budget constraints for Q1 2025' },
          ],
          rejectionReason: 'Budget constraints',
          documents: [],
        },
        {
          id: '5',
          title: 'Department Chair Position',
          type: 'APPOINTMENT',
          description: 'Appointment of Dr. Lisa Wong as new Department Chair.',
          department: 'Computer Science',
          status: 'PENDING_REVIEW',
          createdAt: threeDaysAgo.toISOString(),
          updatedAt: threeDaysAgo.toISOString(),
          createdBy: 'Provost Office',
          requestedBy: 'Provost Office',
          approvalSteps: [],
          documents: [],
        },
      ],
    };
  },

  /**
   * Get last action for a request
   */
  _getLastAction(request) {
    if (request.status === 'DRAFT') return 'Saved as draft';
    if (request.status === 'PENDING_REVIEW') return 'Submitted for review';
    if (request.status === 'APPROVED') return 'Approved';
    if (request.status === 'REJECTED') return 'Rejected';
    return request.status;
  },

  /**
   * Logging utility
   */
  _log(message, data = null) {
    if (this.config.debugMode) {
      console.log(`[SessionStore] ${message}`, data || '');
    }
  },
};

// Initialize on script load
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => {
    SessionStore.init();
    window.SessionStore = SessionStore;
    console.log('✅ SessionStore initialized on DOMContentLoaded');
  });
} else {
  // Already loaded
  SessionStore.init();
  window.SessionStore = SessionStore;
  console.log('✅ SessionStore initialized immediately');
}

// Also make globally available immediately
window.SessionStore = SessionStore;
