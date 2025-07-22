// --- My Applications Page Logic ---
if (!localStorage.getItem("currentUser")) {
  window.location.href = "login.html";
}
async function renderMyApplications() {
  const container = document.getElementById('myapps-container');
  // Get current user from localStorage (assume email is unique)
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser || !currentUser.email) {
    container.innerHTML = '<div class="myapps-empty">No user session found.</div>';
    return;
  }
  // Fetch customerId from backend using email (assume you have an endpoint or mapping)
  let customerId = null;
  try {
    // Try to get customerId from backend (assuming /customer-db/getByEmail/{email})
    const res = await fetch(`http://localhost:9090/customer-db/getByEmail/${encodeURIComponent(currentUser.email)}`);
    const data = await res.json();
    customerId = data.t?.customerId;
  } catch (e) {}
  if (!customerId) {
    container.innerHTML = '<div class="myapps-empty">No customer record found for this user.</div>';
    return;
  }
  // Fetch all applications for this customer
  let allApps = [];
  try {
    const res = await fetch(`http://localhost:9090/loan-db/customer/${customerId}`);
    allApps = await res.json();
  } catch (e) {
    allApps = [];
  }
  if (!allApps.length) {
    container.innerHTML = '<div class="myapps-empty">No loan applications found.</div>';
    return;
  }
  container.innerHTML = `
    <div class="myapps-header">
      <h2><i class="fas fa-list"></i> My Loan Applications</h2>
    </div>
    <div class="myapps-list">
      ${allApps.map(app => `
        <div class="myapps-app-card">
          <div class="myapps-app-title">Loan ID: ${app.loanId}</div>
          <div class="myapps-app-info">
            <span><strong>Status:</strong> <span class="myapps-status-badge ${app.approvalStatus?.toLowerCase()}">${app.approvalStatus}</span></span>
            <span><strong>Loan Amount:</strong> ₹${app.loanAmount?.toLocaleString('en-IN')}</span>
            <span><strong>Tenure:</strong> ${app.tenureMonths} months</span>
            <span><strong>Interest Rate:</strong> ${app.interestRate}%</span>
            <span><strong>EMI per Month:</strong> ₹${app.emiAmount?.toLocaleString('en-IN', {maximumFractionDigits:0})}</span>
            <span><strong>Loan Active:</strong> ${app.loanActive === 'YES' ? '<span style="color:#38d39f;font-weight:600;">YES</span>' : '<span style="color:#f87171;font-weight:600;">NO</span>'}</span>
            <span><strong>Application Date:</strong> ${app.applicationDate ? new Date(app.applicationDate).toLocaleDateString('en-IN') : '-'}</span>
          </div>
          <div class="myapps-actions"><button class="btn btn-primary btn-view-details" data-id="${app.loanId}">View Details</button></div>
        </div>
      `).join('')}
    </div>
    <div class="myapps-actions">
      <button class="btn btn-secondary" onclick="window.location.href='index.html'">Back to Home</button>
      <button class="btn btn-primary" id="viewAllAppsBtn">View All Applications</button>
    </div>
  `;
  document.querySelectorAll('.btn-view-details').forEach(btn => {
    btn.onclick = function() {
      const appId = this.getAttribute('data-id');
      localStorage.setItem('selectedApplicationId', appId);
      window.location.href = `application-detail.html?id=${appId}`;
    }
  });
  document.getElementById('viewAllAppsBtn').onclick = function() {
    window.location.href = 'all-applications.html';
  };
}
document.addEventListener('DOMContentLoaded', renderMyApplications); 