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
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const approvedThisMonth = requests.filter(r => {
      if (r.status !== 'APPROVED') return false;
      const d = new Date(r.updatedAt || r.createdAt);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;

    return {
      pending: requests.filter(r => r.status === 'PENDING_REVIEW').length,
      approved: requests.filter(r => r.status === 'APPROVED').length,
      approvedThisMonth,
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

  // ========== PEOPLE ==========

  /**
   * Get all people
   */
  getPeople(filters = {}) {
    const data = this.getData();
    let people = data.people || [];

    // Apply filters
    if (filters.department) {
      people = people.filter(p => p.dept === filters.department);
    }
    if (filters.employmentType) {
      people = people.filter(p => p.employmentType === filters.employmentType);
    }
    if (filters.status) {
      people = people.filter(p => p.status === filters.status);
    }

    return people;
  },

  /**
   * Get single person by ID
   */
  getPerson(id) {
    const data = this.getData();
    return data.people.find(p => p.id === id);
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
    const monthsAgo = (n) => new Date(now.getFullYear(), now.getMonth() - n, 15, 12, 0, 0);

    return {
      people: [
        { id:"p1",  name:"Prof. Elena Ruiz", title:"Department Chair", email:"elena@dept.edu", phone:"617-495-0001", dept:"Physics", employmentType:"Faculty", status:"Active", startDate:"2014-08-15", location:"Jefferson 410" },
        { id:"p2",  name:"Alex Chen", title:"Lab Manager", email:"alex@dept.edu", phone:"617-495-0002", dept:"Physics", employmentType:"Staff", status:"Active", startDate:"2018-01-10", supervisorId:"p1", tags:["lab-safety"], location:"Jefferson 120" },
        { id:"p3",  name:"Maya Singh", title:"Research Assistant", email:"maya@dept.edu", phone:"617-495-0003", dept:"Physics", employmentType:"Student", status:"Active", startDate:"2024-09-01", supervisorId:"p2", tags:["grant-funded"], location:"Jefferson 125" },
        { id:"p4",  name:"Dr. Samuel Park", title:"Senior Research Scientist", email:"samuel@dept.edu", dept:"Physics", employmentType:"Faculty", status:"On Leave", startDate:"2012-09-01", supervisorId:"p1", tags:["time-off"], location:"Jefferson 305" },
        { id:"p5",  name:"Jamie Rivera", title:"Department Administrator", email:"jamie@dept.edu", dept:"Physics", employmentType:"Staff", status:"Active", startDate:"2016-03-20", supervisorId:"p1", location:"Jefferson 200" },
        { id:"p6",  name:"Priya Patel", title:"Grants Coordinator", email:"priya@dept.edu", dept:"Physics", employmentType:"Staff", status:"Active", startDate:"2019-07-12", supervisorId:"p5", tags:["grant-funded"], location:"Jefferson 205" },
        { id:"p7",  name:"Chris Johnson", title:"IT Support Specialist", email:"chrisj@dept.edu", dept:"Physics", employmentType:"Staff", status:"Active", startDate:"2020-10-01", supervisorId:"p5", tags:["union"], location:"Jefferson 015" },
        { id:"p8",  name:"Dr. Lila Ahmed", title:"Assistant Professor", email:"lila@dept.edu", dept:"Physics", employmentType:"Faculty", status:"Active", startDate:"2021-07-01", supervisorId:"p1", location:"Jefferson 360" },
        { id:"p9",  name:"Taylor Brooks", title:"Postdoctoral Fellow", email:"taylor@dept.edu", dept:"Physics", employmentType:"Postdoc", status:"Active", startDate:"2023-09-01", supervisorId:"p8", location:"Jefferson 362" },
        { id:"p10", name:"Jordan Lee", title:"Research Technician", email:"jordan@dept.edu", dept:"Physics", employmentType:"Staff", status:"Active", startDate:"2022-02-15", supervisorId:"p2", location:"Jefferson 130" },
        { id:"p11", name:"Riley Kim", title:"Administrative Assistant", email:"riley@dept.edu", dept:"Physics", employmentType:"Temp", status:"Active", startDate:"2025-01-10", endDate:"2025-12-20", supervisorId:"p5", location:"Jefferson 201" },
        { id:"p12", name:"Morgan White", title:"Finance Analyst", email:"morgan@dept.edu", dept:"Physics", employmentType:"Staff", status:"Active", startDate:"2017-05-22", supervisorId:"p5", tags:["grant-funded"], location:"Jefferson 210" },
        { id:"p13", name:"Ava Thompson", title:"Graduate Student Researcher", email:"ava@dept.edu", dept:"Physics", employmentType:"Student", status:"Active", startDate:"2023-09-01", supervisorId:"p8", location:"Jefferson 365" },
        { id:"p14", name:"Noah Martinez", title:"Undergraduate Assistant", email:"noah@dept.edu", dept:"Physics", employmentType:"Student", status:"Active", startDate:"2025-02-01", supervisorId:"p2", location:"Jefferson 126" },
        { id:"p15", name:"Emma Wilson", title:"Communications Specialist", email:"emma@dept.edu", dept:"Physics", employmentType:"Staff", status:"On Leave", startDate:"2019-11-05", supervisorId:"p5", location:"Jefferson 220" },
        { id:"p16", name:"Dr. Marco De Luca", title:"Visiting Scholar", email:"marco@dept.edu", dept:"Physics", employmentType:"Temp", status:"Active", startDate:"2025-03-01", endDate:"2025-09-01", supervisorId:"p1", location:"Jefferson 375" },
        { id:"p17", name:"Olivia Garcia", title:"HR Coordinator", email:"olivia@dept.edu", dept:"Physics", employmentType:"Staff", status:"Active", startDate:"2020-06-18", supervisorId:"p5", location:"Jefferson 206" },
        { id:"p18", name:"William Brown", title:"Systems Administrator", email:"william@dept.edu", dept:"Physics", employmentType:"Staff", status:"Terminated", startDate:"2015-04-01", endDate:"2024-12-31", supervisorId:"p5" },
        { id:"p19", name:"Dr. Hannah Ito", title:"Associate Professor", email:"hannah@dept.edu", dept:"Physics", employmentType:"Faculty", status:"Active", startDate:"2016-07-01", supervisorId:"p1", location:"Jefferson 340" },
        { id:"p20", name:"Ben Carter", title:"Lab Technician", email:"ben@dept.edu", dept:"Chemistry", employmentType:"Staff", status:"Active", startDate:"2021-04-01", supervisorId:"p21", location:"Mallinckrodt 110" },
        { id:"p21", name:"Prof. Laura Nguyen", title:"Department Chair", email:"laura@chem.edu", dept:"Chemistry", employmentType:"Faculty", status:"Active", startDate:"2013-08-15", location:"Mallinckrodt 400" },
        { id:"p22", name:"Sophia Adams", title:"Lab Manager", email:"sophia@chem.edu", dept:"Chemistry", employmentType:"Staff", status:"Active", startDate:"2019-01-15", supervisorId:"p21", location:"Mallinckrodt 120" },
        { id:"p23", name:"Ethan Ross", title:"Postdoctoral Fellow", email:"ethan@chem.edu", dept:"Chemistry", employmentType:"Postdoc", status:"Active", startDate:"2024-09-01", supervisorId:"p21" },
        { id:"p24", name:"Dr. Nina Kaur", title:"Assistant Professor", email:"nina@chem.edu", dept:"Chemistry", employmentType:"Faculty", status:"Active", startDate:"2022-07-01", supervisorId:"p21", location:"Mallinckrodt 320" },
        { id:"p25", name:"Leo Turner", title:"Research Assistant", email:"leo@chem.edu", dept:"Chemistry", employmentType:"Student", status:"Active", startDate:"2024-09-01", supervisorId:"p22", location:"Mallinckrodt 125" },
        { id:"p26", name:"Amelia Diaz", title:"Administrative Coordinator", email:"amelia@chem.edu", dept:"Chemistry", employmentType:"Staff", status:"Active", startDate:"2018-10-01", supervisorId:"p21", location:"Mallinckrodt 210" },
        { id:"p27", name:"Owen Patel", title:"Instrument Specialist", email:"owen@chem.edu", dept:"Chemistry", employmentType:"Staff", status:"Active", startDate:"2020-05-12", supervisorId:"p22", location:"Mallinckrodt 140" },
        { id:"p28", name:"Prof. Karen Li", title:"Department Chair", email:"karen@bio.edu", dept:"Biology", employmentType:"Faculty", status:"Active", startDate:"2011-09-01", location:"BioLabs 300" },
        { id:"p29", name:"Diego Alvarez", title:"Lab Manager", email:"diego@bio.edu", dept:"Biology", employmentType:"Staff", status:"Active", startDate:"2017-02-20", supervisorId:"p28", location:"BioLabs 120" },
        { id:"p30", name:"Chloe Bennett", title:"Research Scientist", email:"chloe@bio.edu", dept:"Biology", employmentType:"Faculty", status:"Active", startDate:"2019-08-01", supervisorId:"p28", location:"BioLabs 240" },
        { id:"p31", name:"Rahul Mehta", title:"Postdoctoral Fellow", email:"rahul@bio.edu", dept:"Biology", employmentType:"Postdoc", status:"Active", startDate:"2023-07-01", supervisorId:"p30" },
        { id:"p32", name:"Mina Okafor", title:"Research Assistant", email:"mina@bio.edu", dept:"Biology", employmentType:"Student", status:"Active", startDate:"2024-09-01", supervisorId:"p29" },
        { id:"p33", name:"Grace Yoon", title:"Grants Manager", email:"grace@bio.edu", dept:"Biology", employmentType:"Staff", status:"Active", startDate:"2016-04-15", supervisorId:"p28", tags:["grant-funded"], location:"BioLabs 210" },
        { id:"p34", name:"Tom Becker", title:"Animal Facility Coordinator", email:"tom@bio.edu", dept:"Biology", employmentType:"Staff", status:"Active", startDate:"2015-11-01", supervisorId:"p29" },
        { id:"p35", name:"Patricia Gomez", title:"HR Director", email:"pgomez@fas.university.edu", dept:"Administration", employmentType:"Staff", status:"Active", startDate:"2010-01-10", location:"Smith Center 700" },
        { id:"p36", name:"Ian Wright", title:"Recruiter", email:"ian@fas.university.edu", dept:"Administration", employmentType:"Staff", status:"Active", startDate:"2021-06-01", supervisorId:"p35" },
        { id:"p37", name:"Sofia Rahman", title:"Compensation Analyst", email:"sofia@fas.university.edu", dept:"Administration", employmentType:"Staff", status:"Active", startDate:"2018-03-22", supervisorId:"p35" },
        { id:"p38", name:"Zoe Park", title:"HRIS Specialist", email:"zoe@fas.university.edu", dept:"Administration", employmentType:"Staff", status:"Active", startDate:"2022-09-15", supervisorId:"p35" },
        { id:"p39", name:"Louis Chen", title:"Benefits Coordinator", email:"louis@fas.university.edu", dept:"Administration", employmentType:"Staff", status:"Active", startDate:"2017-12-01", supervisorId:"p35" },
        { id:"p40", name:"Aiden Murphy", title:"Intern", email:"aiden@fas.university.edu", dept:"Administration", employmentType:"Student", status:"Active", startDate:"2025-06-01", supervisorId:"p36" }
      ],
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
        // Previous months - approved examples for trend/analytics
        {
          id: '6',
          title: 'Time Off Request — Dr. Alvarez',
          type: 'TIME_OFF',
          description: 'Six-month time off for research abroad.',
          department: 'Linguistics',
          status: 'APPROVED',
          createdAt: monthsAgo(2).toISOString(),
          updatedAt: monthsAgo(2).toISOString(),
          createdBy: 'Dept Chair',
          requestedBy: 'Dept Chair',
          approvalSteps: [
            { id: '1', action: 'APPROVED', approvedBy: 'HR Department', approvedAt: monthsAgo(2).toISOString() },
            { id: '2', action: 'APPROVED', approvedBy: 'Finance', approvedAt: monthsAgo(2).toISOString() },
          ],
          documents: [],
        },
        {
          id: '7',
          title: 'Research Assistant Backfill',
          type: 'NEW_POSITION',
          description: 'Backfill RA position for Biology lab.',
          department: 'Biology',
          status: 'APPROVED',
          createdAt: monthsAgo(3).toISOString(),
          updatedAt: monthsAgo(3).toISOString(),
          createdBy: 'Lab Admin',
          requestedBy: 'Lab Admin',
          approvalSteps: [
            { id: '1', action: 'APPROVED', approvedBy: 'HR Department', approvedAt: monthsAgo(3).toISOString() },
            { id: '2', action: 'APPROVED', approvedBy: 'Finance', approvedAt: monthsAgo(3).toISOString() },
          ],
          documents: [],
        },
        {
          id: '8',
          title: 'Administrative Coordinator Promotion',
          type: 'PROMOTION',
          description: 'Promotion to Senior Coordinator.',
          department: 'Administration',
          status: 'APPROVED',
          createdAt: monthsAgo(1).toISOString(),
          updatedAt: monthsAgo(1).toISOString(),
          createdBy: 'Operations',
          requestedBy: 'Operations',
          approvalSteps: [
            { id: '1', action: 'APPROVED', approvedBy: 'HR Department', approvedAt: monthsAgo(1).toISOString() },
            { id: '2', action: 'APPROVED', approvedBy: 'Finance', approvedAt: monthsAgo(1).toISOString() },
          ],
          documents: [],
        },
        {
          id: '3',
          title: 'Time Off Request',
          type: 'TIME_OFF',
          description: 'One-year time off leave for research and publication.',
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
