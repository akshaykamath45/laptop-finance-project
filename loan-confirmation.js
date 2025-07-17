if (!localStorage.getItem("currentUser")) {
  window.location.href = "login.html";
}
// --- Loan Confirmation Page Logic ---
function getNextApplicationId() {
  const apps = JSON.parse(localStorage.getItem('loanApplications') || '[]')
  return 'APP' + String(apps.length + 1).padStart(3, '0')
}

function renderConfirmation() {
  const container = document.getElementById('confirmation-container')
  const laptop = JSON.parse(localStorage.getItem('selectedLaptop') || '{}')
  const loanSummary = (JSON.parse(localStorage.getItem('eligibilityStatus') || '{}').loanSummary) || {}
  const emiSchedule = (JSON.parse(localStorage.getItem('eligibilityStatus') || '{}').emiSchedule) || []
  const customer = (JSON.parse(localStorage.getItem('loanApplication') || '{}').customer) || {}
  const employer = (JSON.parse(localStorage.getItem('loanApplication') || '{}').employer) || {}
  const location = (JSON.parse(localStorage.getItem('loanApplication') || '{}').location) || {}

  container.innerHTML = `
    <div class="confirmation-header">
      <h2><i class="fas fa-clipboard-check"></i> Confirm Your Loan Application</h2>
      <p class="confirmation-note">Please review the details below before final submission.</p>
    </div>
    <div class="confirmation-section confirmation-laptop">
      <h3>Laptop Details</h3>
      <div class="confirmation-laptop-card">
        <img src="${laptop.imgurl || 'https://via.placeholder.com/120x80?text=Laptop'}" alt="${laptop.brand} ${laptop.model}" class="confirmation-laptop-img">
        <div class="confirmation-laptop-info">
          <div><strong>Brand:</strong> ${laptop.brand}</div>
          <div><strong>Model:</strong> ${laptop.model}</div>
          <div><strong>Price:</strong> ₹${laptop.price?.toLocaleString('en-IN')}</div>
        </div>
      </div>
    </div>
    <div class="confirmation-section confirmation-applicant">
      <h3>Applicant Information</h3>
      <div class="confirmation-applicant-info">
        <div><strong>Name:</strong> ${customer.name}</div>
        <div><strong>DOB:</strong> ${customer.dob}</div>
        <div><strong>Phone:</strong> ${customer.phone}</div>
        <div><strong>Email:</strong> ${customer.email}</div>
        <div><strong>PAN:</strong> ${customer.pan}</div>
        <div><strong>Aadhaar:</strong> ${customer.aadhar}</div>
        <div><strong>City:</strong> ${location.city}</div>
        <div><strong>State:</strong> ${location.state}</div>
        <div><strong>Employer:</strong> ${employer.employerName}</div>
      </div>
    </div>
    <div class="confirmation-section confirmation-loan">
      <h3>Loan Summary</h3>
      <div class="confirmation-loan-info">
        <div><strong>Loan Amount:</strong> ₹${loanSummary.loanAmount?.toLocaleString('en-IN')}</div>
        <div><strong>Tenure:</strong> ${loanSummary.tenureMonths} months</div>
        <div><strong>Interest Rate:</strong> ${loanSummary.interestRate}%</div>
        <div><strong>Monthly EMI:</strong> ₹${loanSummary.monthlyEMI?.toLocaleString('en-IN', {maximumFractionDigits:0})}</div>
        <div><strong>Total Payable:</strong> ₹${loanSummary.totalPayable?.toLocaleString('en-IN', {maximumFractionDigits:0})}</div>
      </div>
    </div>
    <div class="confirmation-section confirmation-emi">
      <h3>EMI Schedule</h3>
      <table class="emi-table">
        <thead><tr><th>EMI No</th><th>EMI Amount</th><th>Due Date</th></tr></thead>
        <tbody>
          ${emiSchedule.map(row => `<tr><td>${row.emiNumber}</td><td>₹${row.emiAmount.toLocaleString('en-IN', {maximumFractionDigits:0})}</td><td>${row.dueDate}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="confirmation-final-action">
      <button class="btn btn-primary" id="confirmSubmitBtn">Confirm and Submit Application</button>
    </div>
  `
  document.getElementById('confirmSubmitBtn').onclick = function() {
    // Save application to localStorage
    const apps = JSON.parse(localStorage.getItem('loanApplications') || '[]')
    const allApps = JSON.parse(localStorage.getItem('allApplications') || '[]')
    const applicationId = getNextApplicationId()
    const newApp = {
      applicationId,
      customer,
      employer,
      location,
      laptop,
      loanSummary,
      emiSchedule,
      approvalStatus: 'Pending',
      confirmed: true,
      applicationDate: new Date().toISOString()
    }
    apps.push(newApp)
    allApps.push(newApp)
    localStorage.setItem('loanApplications', JSON.stringify(apps))
    localStorage.setItem('allApplications', JSON.stringify(allApps))
    localStorage.setItem('loanApplication', JSON.stringify(newApp))
    window.location.href = 'application-status.html'
  }
}

document.addEventListener('DOMContentLoaded', renderConfirmation) 