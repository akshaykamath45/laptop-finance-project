if (!localStorage.getItem("currentUser")) {
  window.location.href = "login.html";
}
// --- Application Status Page Logic ---
function simulateApproval(app) {
  // Simulate approval logic
  if (app.employer && app.employer.monthlyIncome >= app.loanSummary.loanAmount) {
    app.approvalStatus = 'Approved'
    app.loanActive = 'YES'
    app.rejectionReason = null
  } else if (app.employer && app.employer.monthlyIncome >= app.loanSummary.loanAmount * 0.7) {
    // Borderline: randomize Pending/Approved
    app.approvalStatus = Math.random() > 0.5 ? 'Approved' : 'Pending'
    app.loanActive = app.approvalStatus === 'Approved' ? 'YES' : 'NO'
    app.rejectionReason = null
  } else {
    app.approvalStatus = 'Rejected'
    app.loanActive = 'NO'
    app.rejectionReason = 'Insufficient income for requested loan.'
  }
  return app
}

function getNextEmiDue(emiSchedule) {
  if (!emiSchedule || !emiSchedule.length) return '-'
  const unpaid = emiSchedule.find(e => !e.paid)
  return unpaid ? unpaid.dueDate : emiSchedule[emiSchedule.length - 1].dueDate
}

function renderStatus() {
  const container = document.getElementById('status-container')
  let app = JSON.parse(localStorage.getItem('loanApplication') || '{}')
  if (!app.applicationId) {
    container.innerHTML = '<div class="status-empty">No application found.</div>'
    return
  }
  // Simulate approval if not present
  if (!app.approvalStatus) {
    app = simulateApproval(app)
    localStorage.setItem('loanApplication', JSON.stringify(app))
    // Also update in loanApplications list
    const apps = JSON.parse(localStorage.getItem('loanApplications') || '[]')
    const idx = apps.findIndex(a => a.applicationId === app.applicationId)
    if (idx !== -1) { apps[idx] = app; localStorage.setItem('loanApplications', JSON.stringify(apps)) }
  }
  // Status badge
  let badgeColor = '#facc15', badgeText = 'Pending', icon = 'fa-hourglass-half'
  if (app.approvalStatus === 'Approved') { badgeColor = '#38d39f'; badgeText = 'Approved'; icon = 'fa-check-circle' }
  if (app.approvalStatus === 'Rejected') { badgeColor = '#f87171'; badgeText = 'Rejected'; icon = 'fa-times-circle' }
  // Next EMI due
  const nextEmiDue = getNextEmiDue(app.emiSchedule)
  container.innerHTML = `
    <div class="status-header">
      <h2><i class="fas fa-clipboard-list"></i> Your Loan Application Status</h2>
      <p class="status-note">Track the current status of your loan request</p>
    </div>
    <div class="status-section status-card">
      <div class="status-row"><strong>Application ID:</strong> ${app.applicationId}</div>
      <div class="status-row"><strong>Status:</strong> <span class="status-badge" style="background:${badgeColor};color:#fff;"><i class="fas ${icon}"></i> ${badgeText}</span></div>
      <div class="status-row"><strong>Loan Active:</strong> ${app.loanActive === 'YES' ? '<span style="color:#38d39f;font-weight:600;">YES</span>' : '<span style="color:#f87171;font-weight:600;">NO</span>'}</div>
      ${app.approvalStatus === 'Rejected' ? `<div class="status-row"><strong>Reason:</strong> <span style="color:#f87171;">${app.rejectionReason}</span></div>` : ''}
    </div>
    <div class="status-section status-customer">
      <h3>Customer Info</h3>
      <div class="status-info"><strong>Name:</strong> ${app.customer.name}</div>
      <div class="status-info"><strong>Email:</strong> ${app.customer.email}</div>
      <div class="status-info"><strong>Phone:</strong> ${app.customer.phone}</div>
      <div class="status-info"><strong>PAN:</strong> ${app.customer.pan}</div>
      <div class="status-info"><strong>Aadhaar:</strong> ${app.customer.aadhar}</div>
    </div>
    <div class="status-section status-laptop">
      <h3>Laptop Info</h3>
      <div class="status-info"><strong>Brand:</strong> ${app.laptop.brand}</div>
      <div class="status-info"><strong>Model:</strong> ${app.laptop.model}</div>
      <div class="status-info"><strong>Price:</strong> ₹${app.laptop.price?.toLocaleString('en-IN')}</div>
    </div>
    <div class="status-section status-emi">
      <h3>EMI Snapshot</h3>
      <div class="status-info"><strong>EMI Amount:</strong> ₹${app.loanSummary.monthlyEMI?.toLocaleString('en-IN', {maximumFractionDigits:0})}</div>
      <div class="status-info"><strong>Tenure:</strong> ${app.loanSummary.tenureMonths} months</div>
      <div class="status-info"><strong>Next EMI Due:</strong> ${nextEmiDue}</div>
    </div>
    <div class="status-actions">
      <button class="btn btn-primary" onclick="window.location.href='my-applications.html'">View EMI Schedule</button>
      <button class="btn btn-secondary" onclick="window.location.href='index.html'">Back to Home</button>
    </div>
  `
}

document.addEventListener('DOMContentLoaded', renderStatus) 