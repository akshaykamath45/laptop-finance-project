// --- My Applications Page Logic ---
if (!localStorage.getItem("currentUser")) {
  window.location.href = "login.html";
}
function renderMyApplications() {
  const container = document.getElementById('myapps-container')
  const app = JSON.parse(localStorage.getItem('loanApplication') || '{}')
  if (!app.applicationId) {
    container.innerHTML = '<div class="myapps-empty">No loan applications found.</div>'
    return
  }
  // Application summary card
  container.innerHTML = `
    <div class="myapps-header">
      <h2><i class="fas fa-list"></i> My Loan Applications</h2>
    </div>
    <div class="myapps-section myapps-app-card">
      <div class="myapps-app-title">${app.laptop.brand} ${app.laptop.model}</div>
      <div class="myapps-app-info">
        <span><strong>Application ID:</strong> ${app.applicationId}</span>
        <span><strong>Status:</strong> <span class="myapps-status-badge ${app.approvalStatus?.toLowerCase()}">${app.approvalStatus}</span></span>
        <span><strong>Loan Amount:</strong> ₹${app.loanSummary.loanAmount?.toLocaleString('en-IN')}</span>
        <span><strong>Tenure:</strong> ${app.loanSummary.tenureMonths} months</span>
        <span><strong>Interest Rate:</strong> ${app.loanSummary.interestRate}%</span>
        <span><strong>EMI per Month:</strong> ₹${app.loanSummary.monthlyEMI?.toLocaleString('en-IN', {maximumFractionDigits:0})}</span>
        <span><strong>Loan Active:</strong> ${app.loanActive === 'YES' ? '<span style="color:#38d39f;font-weight:600;">YES</span>' : '<span style="color:#f87171;font-weight:600;">NO</span>'}</span>
      </div>
    </div>
    <div class="myapps-section myapps-emi-table-section">
      <h3>EMI Schedule</h3>
      <table class="emi-table">
        <thead><tr><th>EMI No</th><th>Due Date</th><th>Paid Date</th><th>EMI Amount</th><th>Status</th><th>Penalty</th><th>Action</th></tr></thead>
        <tbody id="emi-table-body"></tbody>
      </table>
    </div>
    <div class="myapps-actions">
      <button class="btn btn-secondary" onclick="window.location.href='index.html'">Back to Home</button>
      <button class="btn btn-primary" id="viewAllAppsBtn">View All Applications</button>
    </div>
  `
  // Render EMI table rows
  const emiTableBody = document.getElementById('emi-table-body')
  const emiSchedule = app.emiSchedule || []
  let firstUnpaidIdx = emiSchedule.findIndex(e => !e.emiStatus || e.emiStatus === 'Pending')
  if (firstUnpaidIdx === -1) firstUnpaidIdx = null
  emiTableBody.innerHTML = emiSchedule.map((emi, idx) => {
    // Penalty logic: overdue if due date < today and not paid
    let penalty = ''
    let penaltyAmount = ''
    let isOverdue = false
    if ((!emi.emiStatus || emi.emiStatus === 'Pending') && new Date(emi.dueDate) < new Date()) {
      isOverdue = true
      penalty = 'YES'
      penaltyAmount = 100.00
    }
    const isFirstUnpaid = idx === firstUnpaidIdx
    return `<tr class="${isFirstUnpaid ? 'emi-unpaid-row' : ''}">
      <td>${emi.emiNumber}</td>
      <td>${emi.dueDate}</td>
      <td>${emi.emiPaidDate || '-'}</td>
      <td>₹${emi.emiAmount?.toLocaleString('en-IN', {maximumFractionDigits:0})}</td>
      <td>${emi.emiStatus === 'Paid' ? '<span class="emi-paid">Paid</span>' : '<span class="emi-pending">Pending</span>'}</td>
      <td>${penalty === 'YES' ? `<span class="emi-penalty">₹${penaltyAmount}</span>` : '-'}</td>
      <td>${isFirstUnpaid && emi.emiStatus !== 'Paid' ? `<button class="btn btn-primary btn-pay-emi" data-emi="${emi.emiNumber}">Pay EMI</button>` : ''}</td>
    </tr>`
  }).join('')
  // Pay EMI button handler
  document.querySelectorAll('.btn-pay-emi').forEach(btn => {
    btn.onclick = function() {
      const emiNumber = this.getAttribute('data-emi')
      localStorage.setItem('currentEmiToPay', JSON.stringify({ appId: app.applicationId, emiNumber: Number(emiNumber) }))
      window.location.href = 'emi-payment.html'
    }
  })
  document.getElementById('viewAllAppsBtn').onclick = function() {
    window.location.href = 'all-applications.html'
  }
}

document.addEventListener('DOMContentLoaded', renderMyApplications) 