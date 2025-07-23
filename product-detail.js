// --- Product Detail Page Logic ---
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(param)
}

const laptopId = getQueryParam('laptopId')
let laptop = null

function fetchLaptopDetails(id) {
  fetch(`http://localhost:9090/laptop-db/get/${id}`)
    .then(res => {
      if (!res.ok) throw new Error('Laptop not found')
      return res.json()
    })
    .then(data => {
      laptop = data
      renderLaptopDetails()
      updateEMICalculation()
    })
    .catch(err => {
      console.error('Error fetching laptop:', err)
      document.getElementById('product-detail-section').innerHTML = '<div class="no-results">Laptop not found.</div>'
      document.getElementById('emi-section').style.display = 'none'
    })
}

function renderLaptopDetails() {
  document.getElementById('product-image').innerHTML = `<img src=${laptop.imgurl} alt="${laptop.brand} ${laptop.model}">`
  document.getElementById('product-title').textContent = `${laptop.brand} ${laptop.model}`
  document.getElementById('product-specs').innerHTML = `
    <p><strong>Processor:</strong> ${laptop.processor}</p>
    <p><strong>RAM:</strong> ${laptop.ram} &nbsp; <strong>Storage:</strong> ${laptop.storage}</p>
    ${laptop.gpu ? `<p><strong>GPU:</strong> ${laptop.gpu}</p>` : ''}
  `
  document.getElementById('product-price').innerHTML = `<span class="price-label">Price:</span> <span class="price-value">₹${laptop.price.toLocaleString('en-IN')}</span>`
  document.getElementById('loan-amount').value = laptop.price
}

function calculateEMI(P_loan, R_annual, N) {
  const R = R_annual / 12 / 100
  if (P_loan === 0) return {emi: 0, totalInterest: 0, totalPayable: 0, schedule: []}
  const emi = (P_loan * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1)
  const totalPayable = emi * N
  const totalInterest = totalPayable - P_loan
  const schedule = []
  const today = new Date()
  for (let i = 1; i <= Math.min(N, 6); i++) {
    const dueDate = new Date(today.getFullYear(), today.getMonth() + i, today.getDate())
    schedule.push({
      emiNo: i,
      dueDate: dueDate.toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'}),
      emiAmount: emi,
      status: 'Pending',
      penalty: '—'
    })
  }
  return {emi, totalInterest, totalPayable, schedule}
}

function renderEMISummary(emiData) {
  document.getElementById('emi-summary-card').innerHTML = `
    <div class="emi-summary-row"><i class="fas fa-calendar"></i> <span>EMI per month:</span> <strong>₹${emiData.emi ? emiData.emi.toLocaleString('en-IN', {maximumFractionDigits:0}) : 0}</strong></div>
    <div class="emi-summary-row"><i class="fas fa-percent"></i> <span>Total Interest:</span> <strong>₹${emiData.totalInterest ? emiData.totalInterest.toLocaleString('en-IN', {maximumFractionDigits:0}) : 0}</strong></div>
    <div class="emi-summary-row"><i class="fas fa-wallet"></i> <span>Total Payable:</span> <strong>₹${emiData.totalPayable ? emiData.totalPayable.toLocaleString('en-IN', {maximumFractionDigits:0}) : 0}</strong></div>
  `
}

function updateEMICalculation() {
  const price = laptop?.price || 0
  let downPayment = parseInt(document.getElementById('down-payment').value) || 0
  if (downPayment > price - 5000) downPayment = price - 5000
  if (downPayment < 0) downPayment = 0
  document.getElementById('down-payment').value = downPayment
  let loanAmount = price - downPayment
  if (loanAmount < 5000) loanAmount = 5000
  document.getElementById('loan-amount').value = loanAmount
  const tenure = parseInt(document.getElementById('tenure').value)
  const interestRate = parseFloat(document.getElementById('interest-rate').value)
  const emiData = calculateEMI(loanAmount, interestRate, tenure)
  renderEMISummary(emiData)
}

function scrollToEMI() {
  document.getElementById('emi-section').scrollIntoView({behavior: 'smooth'})
}

document.addEventListener('DOMContentLoaded', () => {
  fetchLaptopDetails(laptopId)
  document.getElementById('loan-amount').addEventListener('input', updateEMICalculation)
  document.getElementById('down-payment').addEventListener('input', updateEMICalculation)
  document.getElementById('tenure').addEventListener('change', updateEMICalculation)
  document.getElementById('interest-rate').addEventListener('input', updateEMICalculation)
  document.getElementById('buy-finance-btn').addEventListener('click', scrollToEMI)
  document.getElementById('proceed-apply-btn').addEventListener('click', async function(e) {
    e.preventDefault()
    let downPayment = parseInt(document.getElementById('down-payment').value) || 0
    if (downPayment > laptop.price - 5000) downPayment = laptop.price - 5000
    if (downPayment < 0) downPayment = 0
    const loanAmount = laptop.price - downPayment
    const tenure = parseInt(document.getElementById('tenure').value)
    const interestRate = parseFloat(document.getElementById('interest-rate').value)
    const emiData = calculateEMI(loanAmount, interestRate, tenure)
    localStorage.setItem('selectedLaptop', JSON.stringify({
      laptopId: laptop.laptopId,
      brand: laptop.brand,
      model: laptop.model,
      price: laptop.price,
      imgurl:laptop.imgurl
    }))
    localStorage.setItem('loanSelection', JSON.stringify({
      loanAmount,
      tenureMonths: tenure,
      interestRate,
      emiAmount: emiData.emi
    }))
    // If logged in, fetch customer details and go to eligibility-result.html
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser)
        // Get customerId from email
        const res = await fetch(`http://localhost:9090/customer-db/getByEmail/${encodeURIComponent(user.email)}`)
        const data = await res.json()
        if (!data.t || !data.t.customerId) throw new Error('No customer found')
        // Fetch full customer details
        const res2 = await fetch(`http://localhost:9090/customer-db/get/${data.t.customerId}`)
        const data2 = await res2.json()
        const customer = data2.t || {}
        localStorage.setItem('loanApplication', JSON.stringify({
          customer,
          employer: customer.employer,
          location: customer.location
        }))
        window.location.href = 'eligibility-result.html'
        return
      } catch (e) {
        alert('Could not fetch your details. Please try again.')
        return
      }
    }
    // Not logged in: go to application form
    window.location.href = 'application-form.html'
  })
})
