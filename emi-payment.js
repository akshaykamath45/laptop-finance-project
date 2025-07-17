// --- EMI Payment Page Logic ---
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(param)
}

if (!localStorage.getItem("currentUser")) {
  window.location.href = "login.html";
}

function renderEmiPaymentPage() {
  const container = document.getElementById('emi-payment-container')
  let currentEmiToPay = null
  try {
    currentEmiToPay = JSON.parse(localStorage.getItem('currentEmiToPay'))
  } catch (e) {}
  if (!currentEmiToPay || !currentEmiToPay.appId || !currentEmiToPay.emiNumber) {
    container.innerHTML = `<div class="myapps-empty">No EMI selected for payment.<br><a href='my-applications.html' class='btn btn-primary' style='margin-top:18px;'>Go to My Applications</a></div>`
    return
  }
  const allApps = JSON.parse(localStorage.getItem('allApplications') || '[]')
  const app = allApps.find(a => a.applicationId === currentEmiToPay.appId)
  if (!app) {
    container.innerHTML = `<div class="myapps-empty">Application not found.<br><a href='my-applications.html' class='btn btn-primary' style='margin-top:18px;'>Go to My Applications</a></div>`
    return
  }
  const emi = (app.emiSchedule || []).find(e => e.emiNumber == currentEmiToPay.emiNumber)
  if (!emi) {
    container.innerHTML = `<div class="myapps-empty">EMI not found.<br><a href='my-applications.html' class='btn btn-primary' style='margin-top:18px;'>Go to My Applications</a></div>`
    return
  }
  const isPaid = emi.emiStatus === 'Paid'
  const penalty = emi.penaltyApplied === 'YES' ? (emi.penaltyAmount || 0) : 0
  const totalPayable = (emi.emiAmount || 0) + penalty
  // --- Render UI ---
  container.innerHTML = `
    <div class="emi-payment-summary-card">
      <div class="emi-payment-summary-title"><i class="fas fa-credit-card"></i> EMI Payment</div>
      <div class="emi-payment-summary-details">
        <div><strong>Application ID:</strong> ${app.applicationId}</div>
        <div><strong>Laptop:</strong> ${app.laptop.brand} ${app.laptop.model}</div>
        <div><strong>EMI Number:</strong> ${emi.emiNumber}</div>
        <div><strong>Due Date:</strong> ${emi.dueDate}</div>
        <div><strong>EMI Amount:</strong> ₹${emi.emiAmount?.toLocaleString('en-IN', {maximumFractionDigits:0})}</div>
        <div><strong>Penalty:</strong> ${penalty ? `<span class='emi-penalty'>₹${penalty}</span>` : '-'} </div>
        <div class="emi-payment-total-row"><strong>Total Payable:</strong> <span class="emi-payment-total">₹${totalPayable.toLocaleString('en-IN', {maximumFractionDigits:0})}</span></div>
      </div>
    </div>
    <div class="emi-payment-method-section">
      <h3>Choose Payment Method</h3>
      <div class="emi-payment-methods">
        <label><input type="radio" name="payment-method" value="card" checked> Card</label>
        <label><input type="radio" name="payment-method" value="upi"> UPI</label>
      </div>
      <form id="emi-payment-form" class="emi-payment-form">
        <div class="emi-payment-form-fields" id="emi-payment-form-fields">
          <!-- Card fields by default -->
          <div class="emi-form-group"><label>Card Holder Name</label><input type="text" name="cardName" value="Rohit Sharma" required></div>
          <div class="emi-form-group"><label>Card Number</label><input type="text" name="cardNumber" value="1234 5678 9012 3456" maxlength="19" required></div>
          <div class="emi-form-row">
            <div class="emi-form-group"><label>Expiry</label><input type="text" name="cardExpiry" value="12/26" maxlength="5" required></div>
            <div class="emi-form-group"><label>CVV</label><input type="password" name="cardCvv" value="123" maxlength="3" required></div>
          </div>
        </div>
        <div class="emi-payment-actions">
          <button type="submit" class="btn btn-primary" id="payNowBtn" ${isPaid ? 'disabled' : ''}>${isPaid ? 'Already Paid' : 'Pay Now'}</button>
          <button type="button" class="btn btn-secondary" id="cancelBtn">Cancel</button>
        </div>
      </form>
    </div>
  `
  // --- Payment Method Switch ---
  const methodRadios = container.querySelectorAll('input[name="payment-method"]')
  const formFields = container.querySelector('#emi-payment-form-fields')
  methodRadios.forEach(radio => {
    radio.onchange = function() {
      if (this.value === 'card') {
        formFields.innerHTML = `
          <div class="emi-form-group"><label>Card Holder Name</label><input type="text" name="cardName" value="Rohit Sharma" required></div>
          <div class="emi-form-group"><label>Card Number</label><input type="text" name="cardNumber" value="1234 5678 9012 3456" maxlength="19" required></div>
          <div class="emi-form-row">
            <div class="emi-form-group"><label>Expiry</label><input type="text" name="cardExpiry" value="12/26" maxlength="5" required></div>
            <div class="emi-form-group"><label>CVV</label><input type="password" name="cardCvv" value="123" maxlength="3" required></div>
          </div>
        `
      } else {
        formFields.innerHTML = `
          <div class="emi-form-group"><label>UPI ID</label><input type="text" name="upiId" value="rohit@ybl" required></div>
        `
      }
    }
  })
  // --- Payment Form Submission ---
  const form = container.querySelector('#emi-payment-form')
  form.onsubmit = function(e) {
    e.preventDefault()
    if (isPaid) return false
    // Simulate payment
    setTimeout(() => {
      // Update EMI as paid
      emi.emiStatus = 'Paid'
      emi.emiPaidDate = new Date().toISOString().slice(0,10)
      emi.emiPaidAmount = totalPayable
      // Save back to allApplications
      const appIdx = allApps.findIndex(a => a.applicationId === app.applicationId)
      if (appIdx !== -1) {
        allApps[appIdx] = app
        localStorage.setItem('allApplications', JSON.stringify(allApps))
      }
      // Remove currentEmiToPay
      localStorage.removeItem('currentEmiToPay')
      // Show modal
      showPaymentModal(app.applicationId)
    }, 800)
    return false
  }
  // --- Cancel Button ---
  container.querySelector('#cancelBtn').onclick = function() {
    window.location.href = 'my-applications.html'
  }
}

function showPaymentModal(appId) {
  const modal = document.getElementById('emi-payment-modal')
  modal.style.display = 'flex'
  document.getElementById('goToMyAppsBtn').onclick = function() {
    window.location.href = 'my-applications.html'
  }
  document.getElementById('backToDetailBtn').onclick = function() {
    window.location.href = `application-detail.html?id=${appId}`
  }
}

document.addEventListener('DOMContentLoaded', renderEmiPaymentPage) 