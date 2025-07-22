if (!localStorage.getItem("currentUser")) {
  window.location.href = "login.html";
}
// --- All Applications Page Logic ---
async function renderAllApplications() {
  const container = document.getElementById('allapps-container');
  // Get customerId from localStorage
  const customerId = localStorage.getItem('customerId');
  if (!customerId) {
    container.innerHTML = '<div class="allapps-empty">No customer ID found. Please log in again or reapply."</div>';
    return;
  }
  let allApps = [];
  try {
    const res = await fetch(`http://localhost:9090/loan-db/customer/${customerId}`);
    allApps = await res.json();
  } catch (e) {
    allApps = [];
  }
  if (!allApps.length) {
    container.innerHTML = '<div class="allapps-empty">No applications found.</div>';
    return;
  }
  container.innerHTML = `
    <div class="allapps-header">
      <h2><i class="fas fa-folder-open"></i> My Loan Applications</h2>
    </div>
    <div class="allapps-list">
      ${allApps.map(app => `
        <div class="allapps-card">
          <div class="allapps-row"><strong>Application ID:</strong> ${app.loanId}</div>
          <div class="allapps-row"><strong>Laptop ID:</strong> ${app.laptopId}</div>
          <div class="allapps-row"><strong>Status:</strong> <span class="allapps-status-badge ${app.approvalStatus?.toLowerCase()}">${app.approvalStatus}</span></div>
          <div class="allapps-row"><strong>Loan Amount:</strong> ₹${app.loanAmount?.toLocaleString('en-IN')}</div>
          <div class="allapps-row"><strong>EMI/Month:</strong> ₹${app.emiAmount?.toLocaleString('en-IN', {maximumFractionDigits:0})}</div>
          <div class="allapps-row"><strong>Application Date:</strong> ${app.applicationDate ? new Date(app.applicationDate).toLocaleDateString('en-IN') : '-'}</div>
          <div class="allapps-row allapps-actions"><button class="btn btn-primary btn-view-details" data-id="${app.loanId}">View Details</button></div>
        </div>
      `).join('')}
    </div>
    <div class="allapps-actions">
      <button class="btn btn-secondary" onclick="window.location.href='index.html'">Back to Home</button>
    </div>
  `;
  document.querySelectorAll('.btn-view-details').forEach(btn => {
    btn.onclick = function() {
      const appId = this.getAttribute('data-id');
      localStorage.setItem('selectedApplicationId', appId);
      window.location.href = `application-detail.html?id=${appId}`;
    }
  });
}
document.addEventListener('DOMContentLoaded', renderAllApplications); 