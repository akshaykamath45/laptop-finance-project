// --- Application Detail Page Logic ---
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(param)
}

if (!localStorage.getItem("currentUser")) {
  window.location.href = "login.html";
}

async function fetchCustomerDetails(customerId) {
  try {
    const res = await fetch(`http://localhost:9090/customer-db/get/${customerId}`);
    const data = await res.json();
    return data.t || {};
  } catch (e) {
    return {};
  }
}

async function fetchLaptopDetails(laptopId) {
  try {
    const res = await fetch(`http://localhost:9090/laptop-db/get/${laptopId}`);
    const data = await res.json();
    return data;
  } catch (e) {
    return {};
  }
}

async function fetchApplicationDetails(appId) {
  try {
    const res = await fetch(`http://localhost:9090/loan-db/get/${appId}`);
    console.log('fetchApplicationDetails status:', res.status);
    if (!res.ok) {
      const text = await res.text();
      console.log('fetchApplicationDetails error response:', text);
      return null;
    }
    const data = await res.json();
    console.log('fetchApplicationDetails data:', data);
    return data;
  } catch (e) {
    console.error('fetchApplicationDetails exception:', e);
    return null;
  }
}

async function fetchEmiSchedule(loanId) {
  try {
    const res = await fetch(`http://localhost:9090/emi-db/getByLoan/${loanId}`);
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    return [];
  }
}

async function renderApplicationDetail() {
  const container = document.getElementById('appdetail-container')
  const appId = getQueryParam('id')
  let app = null;
  if (appId) {
    app = await fetchApplicationDetails(appId);
  }
  console.log('Loaded application:', app);
  if (!app || !app.loanId) {
    container.innerHTML = '<div class="appdetail-empty">Application not found.</div>'
    return
  }

  // Fetch customer details from backend if customerId exists
  let customer = {};
  if (app.customerId) {
    customer = await fetchCustomerDetails(app.customerId);
  }

  // Fetch laptop details from backend if laptopId exists
  let laptop = {};
  if (app.laptopId) {
    laptop = await fetchLaptopDetails(app.laptopId);
  }

  // Fetch EMI schedule if not present in app
  let emiSchedule = Array.isArray(app.emiSchedule) ? app.emiSchedule : [];
  if (!emiSchedule.length) {
    emiSchedule = await fetchEmiSchedule(app.loanId);
  }

  // --- EMI Table & Alert Logic (copied from my-applications.js) ---
  let firstUnpaidIdx = emiSchedule.findIndex(e => !e.emiStatus || e.emiStatus === 'Pending')
  if (firstUnpaidIdx === -1) firstUnpaidIdx = null
  let emiDueAlert = ''
  if (firstUnpaidIdx !== null) {
    const emi = emiSchedule[firstUnpaidIdx]
    const dueDate = new Date(emi.dueDate)
    const now = new Date()
    if (
      dueDate.getFullYear() === now.getFullYear() &&
      dueDate.getMonth() === now.getMonth() &&
      (!emi.emiStatus || emi.emiStatus === 'Pending')
    ) {
      emiDueAlert = `<div class="emi-due-alert" style="background:#facc15;color:#7c5700;padding:12px 18px;border-radius:8px;margin-bottom:18px;font-weight:600;display:flex;align-items:center;gap:10px;"><i class='fas fa-exclamation-triangle'></i> EMI is due this month! Please pay to avoid penalty.</div>`
    }
  }

  // --- Render HTML ---
  container.innerHTML = `
    <div class="appdetail-header">
      <h2><i class="fas fa-file-alt"></i> Application Details</h2>
    </div>
    <div class="appdetail-section appdetail-status">
      <div><strong>Application ID:</strong> ${app.loanId}</div>
      <div><strong>Status:</strong> <span class="allapps-status-badge ${app.approvalStatus?.toLowerCase()}">${app.approvalStatus}</span></div>
      <div><strong>Loan Active:</strong> ${app.loanActive === 'YES' ? '<span style="color:#38d39f;font-weight:600;">YES</span>' : '<span style="color:#f87171;font-weight:600;">NO</span>'}</div>
      ${app.approvalStatus === 'Rejected' ? `<div><strong>Reason:</strong> <span style="color:#f87171;">${app.rejectionReason}</span></div>` : ''}
    </div>
    <div class="appdetail-section appdetail-customer">
      <h3>Customer Info</h3>
      <div><strong>Name:</strong> ${customer.customerName || '-'}</div>
      <div><strong>Email:</strong> ${customer.email || '-'}</div>
      <div><strong>Phone:</strong> ${customer.phone || '-'}</div>
      <div><strong>PAN:</strong> ${customer.panNumber || '-'}</div>
      <div><strong>Aadhaar:</strong> ${customer.aadharNumber || '-'}</div>
    </div>
    <div class="appdetail-section appdetail-laptop">
      <h3>Laptop Info</h3>
      <div><strong>Brand:</strong> ${laptop.brand || '-'}</div>
      <div><strong>Model:</strong> ${laptop.model || '-'}</div>
      <div><strong>Price:</strong> ₹${laptop.price ? laptop.price.toLocaleString('en-IN') : '-'}</div>
    </div>
    <div class="appdetail-section appdetail-loan">
      <h3>Loan Summary</h3>
      <div><strong>Loan Amount:</strong> ₹${app.loanAmount?.toLocaleString('en-IN')}</div>
      <div><strong>Tenure:</strong> ${app.tenureMonths} months</div>
      <div><strong>Interest Rate:</strong> ${app.interestRate}%</div>
      <div><strong>Monthly EMI:</strong> ₹${app.emiAmount?.toLocaleString('en-IN', {maximumFractionDigits:0})}</div>
    </div>
    <div class="appdetail-section appdetail-emi">
      <h3>EMI Schedule</h3>
      ${emiDueAlert}
      <table class="emi-table">
        <thead><tr><th>EMI No</th><th>Due Date</th><th>Paid Date</th><th>EMI Amount</th><th>Status</th><th>Penalty</th><th>Action</th></tr></thead>
        <tbody id="emi-table-body"></tbody>
      </table>
    </div>
    <div class="appdetail-actions">
      <button class="btn btn-secondary" onclick="window.location.href='all-applications.html'">Back to All Applications</button>
    </div>
  `

  // Render EMI table rows (with Pay EMI button and highlight)
  const emiTableBody = document.getElementById('emi-table-body')
  emiTableBody.innerHTML = emiSchedule.map((emi, idx) => {
    let penalty = ''
    let penaltyAmount = ''
    let isOverdue = false
    if ((!emi.emiStatus || emi.emiStatus === 'Pending' || emi.emiStatus === 'Unpaid') && new Date(emi.emiDueDate) < new Date()) {
      isOverdue = true
      penalty = 'YES'
      penaltyAmount = 100.00
    }
    const isFirstUnpaid = idx === firstUnpaidIdx
    return `<tr class="${isFirstUnpaid ? 'emi-unpaid-row' : ''}">
      <td>${emi.emiNumber}</td>
      <td>${emi.emiDueDate || '-'}</td>
      <td>${emi.emiPaidDate || '-'}</td>
      <td>₹${emi.emiPaidAmount ? emi.emiPaidAmount.toLocaleString('en-IN', {maximumFractionDigits:0}) : '-'}</td>
      <td>${emi.emiStatus === 'Paid' ? '<span class="emi-paid">Paid</span>' : '<span class="emi-pending">Pending</span>'}</td>
      <td>${emi.penaltyApplied === 'YES' ? `<span class="emi-penalty">₹${emi.penaltyAmount}</span>` : '-'}</td>
      <td>${isFirstUnpaid && emi.emiStatus !== 'Paid' ? `<button class="btn btn-primary btn-pay-emi" data-emi="${emi.emiNumber}">Pay EMI</button>` : ''}</td>
    </tr>`
  }).join('')

  // Pay EMI button handler
  document.querySelectorAll('.btn-pay-emi').forEach(btn => {
    btn.onclick = function() {
      const emiNumber = this.getAttribute('data-emi')
      localStorage.setItem('currentEmiToPay', JSON.stringify({ appId: app.loanId, emiNumber: Number(emiNumber) }))
      window.location.href = 'emi-payment.html'
    }
  })
}

document.addEventListener('DOMContentLoaded', () => { renderApplicationDetail(); }) 