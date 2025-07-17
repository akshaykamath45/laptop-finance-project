if (!localStorage.getItem("currentUser")) {
  window.location.href = "login.html";
}
// --- All Applications Page Logic ---
function renderAllApplications() {
  const container = document.getElementById('allapps-container')
  const allApps = JSON.parse(localStorage.getItem('allApplications') || '[]')
  if (!allApps.length) {
    container.innerHTML = '<div class="allapps-empty">No applications found.</div>'
    return
  }
  container.innerHTML = `
    <div class="allapps-header">
      <h2><i class="fas fa-folder-open"></i> All Loan Applications</h2>
    </div>
    <div class="allapps-list">
      ${allApps.map(app => `
        <div class="allapps-card">
          <div class="allapps-row"><strong>Application ID:</strong> ${app.applicationId}</div>
          <div class="allapps-row"><strong>Laptop:</strong> ${app.laptop.brand} ${app.laptop.model}</div>
          <div class="allapps-row"><strong>Status:</strong> <span class="allapps-status-badge ${app.approvalStatus?.toLowerCase()}">${app.approvalStatus}</span></div>
          <div class="allapps-row"><strong>Loan Amount:</strong> ₹${app.loanSummary.loanAmount?.toLocaleString('en-IN')}</div>
          <div class="allapps-row"><strong>EMI/Month:</strong> ₹${app.loanSummary.monthlyEMI?.toLocaleString('en-IN', {maximumFractionDigits:0})}</div>
          <div class="allapps-row"><strong>Application Date:</strong> ${app.applicationDate ? new Date(app.applicationDate).toLocaleDateString('en-IN') : '-'}</div>
          <div class="allapps-row allapps-actions"><button class="btn btn-primary btn-view-details" data-id="${app.applicationId}">View Details</button></div>
        </div>
      `).join('')}
    </div>
    <div class="allapps-actions">
      <button class="btn btn-secondary" onclick="window.location.href='index.html'">Back to Home</button>
    </div>
  `
  document.querySelectorAll('.btn-view-details').forEach(btn => {
    btn.onclick = function() {
      const appId = this.getAttribute('data-id')
      const app = allApps.find(a => a.applicationId === appId)
      localStorage.setItem('selectedApplication', JSON.stringify(app))
      window.location.href = `application-detail.html?id=${appId}`
    }
  })
}

document.addEventListener('DOMContentLoaded', renderAllApplications) 