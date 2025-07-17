// --- Eligibility Result Page Logic ---
function getAge(dob) {
  if (!dob) return 0
  const birth = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

function calculateEMISchedule(loanAmount, interestRate, tenureMonths) {
  const R = interestRate / 12 / 100
  const emi = (loanAmount * R * Math.pow(1 + R, tenureMonths)) / (Math.pow(1 + R, tenureMonths) - 1)
  const schedule = []
  const today = new Date()
  for (let i = 1; i <= tenureMonths; i++) {
    const dueDate = new Date(today.getFullYear(), today.getMonth() + i, today.getDate())
    schedule.push({
      emiNumber: i,
      dueDate: dueDate.toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'}),
      emiAmount: emi
    })
  }
  return {emi, schedule}
}

function renderEligibilityResult() {
  if (!localStorage.getItem("currentUser")) {
    window.location.href = "login.html";
  }
  const container = document.getElementById('eligibility-container')
  const customer = JSON.parse(localStorage.getItem('loanApplication') || '{}').customer || {}
  const employer = JSON.parse(localStorage.getItem('loanApplication') || '{}').employer || {}
  const laptop = JSON.parse(localStorage.getItem('selectedLaptop') || '{}')
  const loan = JSON.parse(localStorage.getItem('loanSelection') || '{}')

  // Eligibility checks
  const age = getAge(customer.dob)
  const minIncome = loan.loanAmount ? loan.loanAmount * 0.5 : 0
  let eligible = true
  let reason = ''
  if (!customer.pan || !customer.aadhar) {
    eligible = false
    reason = 'PAN and Aadhaar are required.'
  } else if (age > 60) {
    eligible = false
    reason = 'Applicant age exceeds 60 years.'
  } else if (!loan.loanAmount || employer.monthlyIncome < minIncome) {
    eligible = false
    reason = 'Monthly income is too low for the selected loan amount.'
  } else if (employer.monthlyIncome < 20000) {
    eligible = false
    reason = 'Monthly income must be above ₹20,000.'
  }

  if (eligible) {
    // Calculate EMI schedule and summary
    const {emi, schedule} = calculateEMISchedule(loan.loanAmount, loan.interestRate, loan.tenureMonths)
    const totalPayable = emi * loan.tenureMonths
    localStorage.setItem('eligibilityStatus', JSON.stringify({
      eligibilityStatus: 'Eligible',
      emiSchedule: schedule,
      loanSummary: {
        loanAmount: loan.loanAmount,
        tenureMonths: loan.tenureMonths,
        interestRate: loan.interestRate,
        monthlyEMI: emi,
        totalPayable: totalPayable
      }
    }))
    container.innerHTML = `
      <div class="eligibility-result success">
        <div class="result-icon"><i class="fas fa-check-circle"></i></div>
        <h2>Congratulations! You are eligible for Laptop Finance</h2>
        <div class="result-summary">
          <div><strong>Laptop:</strong> ${laptop.brand} ${laptop.model} <span class="result-price">(₹${laptop.price?.toLocaleString('en-IN')})</span></div>
          <div><strong>Loan Amount:</strong> ₹${loan.loanAmount?.toLocaleString('en-IN')}</div>
          <div><strong>Tenure:</strong> ${loan.tenureMonths} months</div>
          <div><strong>Interest Rate:</strong> ${loan.interestRate}%</div>
          <div><strong>EMI per month:</strong> ₹${emi.toLocaleString('en-IN', {maximumFractionDigits:0})}</div>
          <div><strong>Total Payable:</strong> ₹${totalPayable.toLocaleString('en-IN', {maximumFractionDigits:0})}</div>
        </div>
        <h3>EMI Schedule</h3>
        <table class="emi-table">
          <thead><tr><th>EMI No</th><th>EMI Amount</th><th>Due Date</th></tr></thead>
          <tbody>
            ${schedule.map(row => `<tr><td>${row.emiNumber}</td><td>₹${row.emiAmount.toLocaleString('en-IN', {maximumFractionDigits:0})}</td><td>${row.dueDate}</td></tr>`).join('')}
          </tbody>
        </table>
        <button class="btn btn-primary" id="proceedConfirmBtn">Proceed to Confirm Loan</button>
      </div>
    `
    document.getElementById('proceedConfirmBtn').onclick = () => {
      window.location.href = 'loan-confirmation.html'
    }
  } else {
    localStorage.setItem('eligibilityStatus', JSON.stringify({eligibilityStatus: 'Rejected', reason}))
    container.innerHTML = `
      <div class="eligibility-result rejected">
        <div class="result-icon"><i class="fas fa-times-circle"></i></div>
        <h2>Sorry, you are not eligible for Laptop Finance</h2>
        <div class="result-reason">Reason: ${reason}</div>
        <div class="result-actions">
          <button class="btn btn-secondary" onclick="window.location.href='application-form.html'">Edit Application</button>
          <button class="btn btn-primary" onclick="window.location.href='products.html'">Explore Laptops</button>
        </div>
      </div>
    `
  }
}

document.addEventListener('DOMContentLoaded', renderEligibilityResult) 