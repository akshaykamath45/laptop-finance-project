// Admin-only access check
if (!localStorage.getItem("currentUser")) {
  window.location.href = "login.html";
} else {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser.email !== 'admin@demo.com') {
    window.location.href = "index.html";
  }
}

// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
  initializeDashboard();
  loadAllLoansData();
  loadCustomersData();
  setupSidebarNavigation();
});

function initializeDashboard() {
  const hash = window.location.hash || '#all-loans';
  showSection(hash.substring(1));
}

function setupSidebarNavigation() {
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      sidebarLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      const section = this.getAttribute('data-section');
      showSection(section);
      window.location.hash = '#' + section;
    });
  });
}

function showSection(sectionId) {
  const sections = document.querySelectorAll('.dashboard-section');
  sections.forEach(section => section.classList.remove('active'));
  const targetSection = document.getElementById(sectionId);
  if (targetSection) targetSection.classList.add('active');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  sidebarLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-section') === sectionId) {
      link.classList.add('active');
    }
  });
}

function loadAllLoansData() {
  fetch("http://localhost:9090/loan-db/getAll")
    .then(res => res.json())
    .then(applications => {
      const approved = applications.filter(app => app.approvalStatus === 'Approved').length;
      const rejected = applications.filter(app => app.approvalStatus === 'Rejected').length;
      const pending = applications.filter(app => app.approvalStatus === 'Pending').length;
      const totalValue = applications.reduce((sum, app) => sum + (app.loanAmount || 0), 0);
      document.getElementById('approved-count').textContent = approved;
      document.getElementById('pending-count').textContent = pending;
      document.getElementById('rejected-count').textContent = rejected;
      document.getElementById('total-value').textContent = `₹${totalValue.toLocaleString()}`;
      loadRecentApplications(applications);
    })
    .catch(err => console.error("Error fetching loans:", err));
}

function loadRecentApplications(applications) {
  const container = document.getElementById('recent-applications');
  if (applications.length === 0) {
    container.innerHTML = '<p class="no-data">No applications found</p>';
    return;
  }

  let tableHTML = `
    <table class="dashboard-table-content">
      <thead>
        <tr>
          <th>Loan ID</th>
          <th>Customer ID</th>
          <th>Laptop ID</th>
          <th>Loan Amount</th>
          <th>Status</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;

  applications.forEach(app => {
    const statusClass = app.approvalStatus?.toLowerCase() || 'pending';
    const appDate = new Date(app.applicationDate).toLocaleDateString('en-IN');
    tableHTML += `
      <tr>
        <td>${app.loanId}</td>
        <td>${app.customerId}</td>
        <td>${app.laptopId}</td>
        <td>₹${(app.loanAmount || 0).toLocaleString()}</td>
        <td><span class="status-badge ${statusClass}">${app.approvalStatus || 'Pending'}</span></td>
        <td>${appDate}</td>
        <td>
          <button class="btn btn-small" onclick="viewLoanApplication('${app.loanId}')">View</button>
        </td>
      </tr>
    `;
  });

  tableHTML += '</tbody></table>';
  container.innerHTML = tableHTML;
}

function viewLoanApplication(loanId) {
  localStorage.setItem("selectedLoanId", loanId);
  window.location.href = "view-loan-application.html";
}

function loadCustomersData() {
  fetch("http://localhost:9090/customer-db/getAll")
    .then(res => res.json())
    .then(users => {
      fetch("http://localhost:9090/loan-db/getAll")
        .then(res => res.json())
        .then(applications => {
          const uniqueCustomerIds = [...new Set(applications.map(app => app.customerId))];
          const activeCustomers = uniqueCustomerIds.length;
          const premiumCustomers = applications.filter(app => (app.loanAmount || 0) > 100000).length;
          document.getElementById('total-customers').textContent = users.length;
          document.getElementById('active-customers').textContent = activeCustomers;
          document.getElementById('premium-customers').textContent = premiumCustomers;
          loadCustomerList(users, applications);
        });
    })
    .catch(err => console.error("Error fetching customers:", err));
}

function loadCustomerList(users, applications) {
  const container = document.getElementById('customer-list');
  if (users.length === 0) {
    container.innerHTML = '<p class="no-data">No customers found</p>';
    return;
  }

  let tableHTML = `
    <table class="dashboard-table-content">
      <thead>
        <tr>
          <th>Email</th>
          <th>Applications</th>
          <th>Total Borrowed</th>
          <th>Status</th>
          <th>Last Activity</th>
        </tr>
      </thead>
      <tbody>
  `;

  users.forEach(user => {
    const userApplications = applications.filter(app => app.customerId && user.customerId && app.customerId === user.customerId);
    const totalBorrowed = userApplications.reduce((sum, app) => sum + (app.loanAmount || 0), 0);
    const lastActivity = userApplications.length > 0 ? new Date(Math.max(...userApplications.map(app => new Date(app.applicationDate).getTime()))).toLocaleDateString('en-IN') : 'Never';

    tableHTML += `
      <tr>
        <td>${user.email}</td>
        <td>${userApplications.length}</td>
        <td>₹${totalBorrowed.toLocaleString()}</td>
        <td>${userApplications.length > 0 ? 'Active' : 'Inactive'}</td>
        <td>${lastActivity}</td>
      </tr>
    `;
  });

  tableHTML += '</tbody></table>';
  container.innerHTML = tableHTML;
}

window.addEventListener('hashchange', function() {
  const hash = window.location.hash || '#all-loans';
  showSection(hash.substring(1));
});
