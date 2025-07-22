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
  const loanId = localStorage.getItem('latestLoanId')

  if (!loanId) {
    container.innerHTML = '<div class="status-empty">No application found.</div>'
    return
  }

  fetch(`http://localhost:9090/loan-db/get/${loanId}`)
    .then(res => res.json())
    .then(loan => {
      const customerId = loan.customerId
      const laptopId = loan.laptopId

      // Fetch customer details
      fetch(`http://localhost:9090/customer-db/get/${customerId}`)
        .then(res => res.json())
        .then(customerResp => {
          const customer = customerResp.t

          // Fetch laptop details
          fetch(`http://localhost:9090/laptop-db/get/${laptopId}`)
            .then(res => res.json())
            .then(laptop => {
              // Build UI
              const statusBadge = loan.approvalStatus === 'Approved'
                ? `<span class="status-badge" style="background:#38d39f;color:#fff;"><i class="fas fa-check-circle"></i> Approved</span>`
                : loan.approvalStatus === 'Rejected'
                  ? `<span class="status-badge" style="background:#f87171;color:#fff;"><i class="fas fa-times-circle"></i> Rejected</span>`
                  : `<span class="status-badge" style="background:#facc15;color:#fff;"><i class="fas fa-hourglass-half"></i> Pending</span>`

              container.innerHTML = `
                <div class="status-header">
                  <h2><i class="fas fa-clipboard-list"></i> Your Loan Application Status</h2>
                  <p class="status-note">Track the current status of your loan request</p>
                </div>
                <div class="status-section status-card">
                  <div class="status-row"><strong>Application ID:</strong> ${loan.loanId}</div>
                  <div class="status-row"><strong>Status:</strong> ${statusBadge}</div>
                  <div class="status-row"><strong>Loan Active:</strong> ${loan.loanActive === 'Yes' ? 'YES' : 'NO'}</div>
                  ${loan.approvalStatus === 'Rejected' ? `<div class="status-row"><strong>Reason:</strong> ${loan.rejectionReason}</div>` : ''}
                </div>
                <div class="status-section status-customer">
                  <h3>Customer Info</h3>
                  <div class="status-info"><strong>Name:</strong> ${customer.customerName}</div>
                  <div class="status-info"><strong>Email:</strong> ${customer.email}</div>
                  <div class="status-info"><strong>Phone:</strong> ${customer.phone}</div>
                  <div class="status-info"><strong>PAN:</strong> ${customer.panNumber}</div>
                  <div class="status-info"><strong>Aadhaar:</strong> ${customer.aadharNumber}</div>
                </div>
                <div class="status-section status-laptop">
                  <h3>Laptop Info</h3>
                  <div class="status-info"><strong>Brand:</strong> ${laptop.brand}</div>
                  <div class="status-info"><strong>Model:</strong> ${laptop.model}</div>
                  <div class="status-info"><strong>Price:</strong> ₹${laptop.price.toLocaleString('en-IN')}</div>
                </div>
                <div class="status-section status-emi">
                  <h3>EMI Snapshot</h3>
                  <div class="status-info"><strong>EMI Amount:</strong> ₹${loan.emiAmount.toLocaleString('en-IN')}</div>
                  <div class="status-info"><strong>Tenure:</strong> ${loan.tenureMonths} months</div>
                  <div class="status-info"><strong>Next EMI Due:</strong> ${calculateNextEmiDue()}</div>
                </div>
              `
            })
        })
    })
}

function calculateNextEmiDue() {
  const today = new Date()
  today.setMonth(today.getMonth() + 1)
  return today.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}


document.addEventListener('DOMContentLoaded', renderStatus) 