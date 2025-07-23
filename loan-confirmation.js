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
  const applicationData = JSON.parse(localStorage.getItem('loanApplication') || '{}')

  const customer = applicationData.customer || {}
  const employer = applicationData.employer || {}
  const location = applicationData.location || {}

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
        <div><strong>Name:</strong> ${customer.customerName}</div>
        <div><strong>DOB:</strong> ${customer.dob}</div>
        <div><strong>Phone:</strong> ${customer.phone}</div>
        <div><strong>Email:</strong> ${customer.email}</div>
        <div><strong>PAN:</strong> ${customer.panNumber}</div>
        <div><strong>Aadhaar:</strong> ${customer.aadharNumber}</div>
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
        <div><strong>Monthly EMI:</strong> ₹${loanSummary.monthlyEMI?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
        <div><strong>Total Payable:</strong> ₹${loanSummary.totalPayable?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
      </div>
    </div>

    <div class="confirmation-section confirmation-emi">
      <h3>EMI Schedule</h3>
      <table class="emi-table">
        <thead><tr><th>EMI No</th><th>EMI Amount</th><th>Due Date</th></tr></thead>
        <tbody>
          ${emiSchedule.map(row => `<tr><td>${row.emiNumber}</td><td>₹${row.emiAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td><td>${row.dueDate}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>

    <div class="confirmation-final-action">
      <button class="btn btn-primary" id="confirmSubmitBtn">Confirm and Submit Application</button>
    </div>
  `

  document.getElementById('confirmSubmitBtn').onclick = async function () {
    console.log("Submitting loan for customer:", customer)

    if (!customer.customerId) {
      alert("Missing customer ID. Please reapply or check your application data.");
      return;
    }

    const today = new Date().toISOString().slice(0, 10)
    const loanId = "LOAN" + Math.floor(Math.random() * 90000 + 10000)

    const loanData = {
      loanId: loanId,
      customerId: customer.customerId,
      laptopId: laptop.laptopId,
      applicationDate: today,
      confirmationDate: today,
      loanAmount: loanSummary.loanAmount,
      interestRate: loanSummary.interestRate,
      tenureMonths: loanSummary.tenureMonths,
      emiAmount: Math.round(loanSummary.monthlyEMI),
      approvalStatus: "Pending",
      rejectionReason: "",
      loanActive: "No"
    }

    // Disable the button to prevent double submission
    const submitBtn = document.getElementById('confirmSubmitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
      const loanRes = await fetch('http://localhost:9090/loan-db/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loanData)
      });
      if (!loanRes.ok) throw new Error("Loan submission failed");
      await loanRes.json();
      // Insert EMI schedule into backend
      for (const emi of emiSchedule) {
        const emiData = {
          loanId: loanId,
          emiNumber: emi.emiNumber,
          emiDueDate: toIsoDate(emi.dueDate), // convert to ISO format
          emiPaidDate: null, // use null for not paid
          emiPaidAmount: 0,
          emiStatus: "Unpaid", // match DB allowed value
          penaltyApplied: "No", // match DB allowed value
          penaltyAmount: 0
        };
        const emiRes = await fetch('http://localhost:9090/emi-db/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emiData)
        });
        if (!emiRes.ok) throw new Error(`Failed to insert EMI #${emi.emiNumber}`);
      }
      localStorage.setItem('latestLoanId', loanId)
      window.location.href = 'application-status.html'
    } catch (err) {
      alert("Failed to submit loan or EMI schedule: " + err.message)
      console.error(err)
      // Re-enable the button if there was an error
      submitBtn.disabled = false;
      submitBtn.textContent = 'Confirm and Submit Application';
    }
  }
}

// Helper to convert '22 Aug 2025' to '2025-08-22'
function toIsoDate(dateStr) {
  const d = new Date(dateStr);
  if (!isNaN(d)) {
    return d.toISOString().slice(0, 10);
  }
  // fallback: try to parse with day/month/year
  const parts = dateStr.split(' ');
  if (parts.length === 3) {
    const [day, monthStr, year] = parts;
    const month = [
      'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'
    ].indexOf(monthStr);
    if (month !== -1) {
      return `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    }
  }
  return dateStr; // fallback, may still fail
}

document.addEventListener('DOMContentLoaded', renderConfirmation)
