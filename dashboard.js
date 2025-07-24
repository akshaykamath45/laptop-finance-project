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
        <td>
          ${
            app.approvalStatus === 'Pending'
              ? `<div class="form-group" style="margin-bottom:0;">
                    <select class="dashboard-status-dropdown" data-loan-id="${app.loanId}">
                      <option value="Pending" ${app.approvalStatus === 'Pending' ? 'selected' : ''}>Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                 </div>`
              : `<span class="status-badge ${statusClass}">${app.approvalStatus}</span>`
          }
        </td>
        <td>${appDate}</td>
        <td>
          <button class="btn btn-small" onclick="viewLoanApplication('${app.loanId}')">View</button>
        </td>
      </tr>
    `;
  });

  tableHTML += '</tbody></table>';
  container.innerHTML = tableHTML;

  // Add event listeners to status dropdowns
  container.querySelectorAll('.dashboard-status-dropdown').forEach(dropdown => {
    dropdown.addEventListener('change', function() {
      const newStatus = this.value;
      const loanId = this.getAttribute('data-loan-id');
      const app = applications.find(a => a.loanId === loanId);
      if (!app) return;
      if (app.approvalStatus !== 'Pending') return; // extra safety

      // Prepare updated loan object
      const updatedLoan = { ...app, approvalStatus: newStatus };
      if (newStatus === 'Approved') {
        updatedLoan.loanActive = 'Yes';
      } else {
        updatedLoan.loanActive = 'No';
      }
      if (newStatus === 'Rejected') {
        updatedLoan.rejectionReason = prompt('Enter rejection reason:', app.rejectionReason || '');
      }

      fetch('http://localhost:9090/loan-db/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedLoan)
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update status');
        this.disabled = true; // Disable dropdown after change
        loadAllLoansData(); // Refresh dashboard
      })
      .catch(err => {
        alert('Error updating status: ' + err.message);
        this.value = app.approvalStatus; // revert on error
      });
    });
  });
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
          // Calculate premium customers by total borrowed per customer
          const customerBorrowedMap = {};
          applications.forEach(app => {
            if (!app.customerId) return;
            customerBorrowedMap[app.customerId] = (customerBorrowedMap[app.customerId] || 0) + (app.loanAmount || 0);
          });
          const premiumCustomers = Object.values(customerBorrowedMap).filter(total => total > 100000).length;
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



// Fetch data and render charts
function loadAnalyticsCharts() {
  fetch("http://localhost:9090/loan-db/getAll")
    .then(res => res.json())
    .then(data => {
      renderMonthlyApplicationsChart(data);
      renderRevenueTrendsChart(data);
      renderTopLaptopModelsChart(data);
      renderApprovalRateChart(data);
    })
    .catch(err => console.error("Error loading analytics data:", err));
}

function renderMonthlyApplicationsChart(applications) {
  const monthlyCounts = {};
  applications.forEach(app => {
    const date = new Date(app.applicationDate);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyCounts[key] = (monthlyCounts[key] || 0) + 1;
  });
  const labels = Object.keys(monthlyCounts).sort();
  const values = labels.map(l => monthlyCounts[l]);

  const ctx = document.createElement("canvas");
  document.querySelector(".analytics-card:nth-child(1) .chart-placeholder").innerHTML = "";
  document.querySelector(".analytics-card:nth-child(1) .chart-placeholder").appendChild(ctx);
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label: 'Applications', data: values, backgroundColor: '#3b82f6' }]
    }
  });
}

function renderRevenueTrendsChart(applications) {
  const monthlyRevenue = {};
  applications.filter(a => a.approvalStatus === "Approved").forEach(app => {
    const date = new Date(app.confirmationDate);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyRevenue[key] = (monthlyRevenue[key] || 0) + (app.loanAmount || 0);
  });
  const labels = Object.keys(monthlyRevenue).sort();
  const values = labels.map(l => monthlyRevenue[l]);

  const ctx = document.createElement("canvas");
  document.querySelector(".analytics-card:nth-child(2) .chart-placeholder").innerHTML = "";
  document.querySelector(".analytics-card:nth-child(2) .chart-placeholder").appendChild(ctx);
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{ label: 'Revenue (₹)', data: values, borderColor: '#10b981', fill: false }]
    }
  });
}

function renderTopLaptopModelsChart(applications) {
  const modelCounts = {};
  applications.forEach(app => {
    modelCounts[app.laptopId] = (modelCounts[app.laptopId] || 0) + 1;
  });
  const labels = Object.keys(modelCounts);
  const values = labels.map(l => modelCounts[l]);

  const ctx = document.createElement("canvas");
  document.querySelector(".analytics-card:nth-child(3) .chart-placeholder").innerHTML = "";
  document.querySelector(".analytics-card:nth-child(3) .chart-placeholder").appendChild(ctx);
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ label: 'Applications per Laptop', data: values, backgroundColor: ['#f59e0b', '#6366f1', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'] }]
    }
  });
}

function renderApprovalRateChart(applications) {
  const approved = applications.filter(a => a.approvalStatus === 'Approved').length;
  const rejected = applications.filter(a => a.approvalStatus === 'Rejected').length;
  const pending = applications.filter(a => a.approvalStatus === 'Pending').length;

  const ctx = document.createElement("canvas");
  document.querySelector(".analytics-card:nth-child(4) .chart-placeholder").innerHTML = "";
  document.querySelector(".analytics-card:nth-child(4) .chart-placeholder").appendChild(ctx);
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Approved', 'Rejected', 'Pending'],
      datasets: [{ data: [approved, rejected, pending], backgroundColor: ['#10b981', '#ef4444', '#fbbf24'] }]
    }
  });
}

// Call inside DOMContentLoaded
loadAnalyticsCharts();
