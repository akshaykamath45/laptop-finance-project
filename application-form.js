if (!localStorage.getItem("currentUser")) {
  window.location.href = "login.html";
} else {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser.email === 'admin@demo.com') {
    window.location.href = 'dashboard.html';
  }
}

// --- Multi-Step Loan Application Form Logic ---

const dummyData = {
  customer: {
    customerName: "Rohit Sharma",
    dob: "1998-06-15",
    phone: "9876543210",
    email: "rohit@example.com",
    panNumber: "ABCDE1234F",
    aadharNumber: "123456789012"
  },
  location: {
    city: "Mumbai",
    state: "Maharashtra",
    locationId: "LOC001"
  },
  employer: {
    employerId: "EMP001",
    employerName: "Infosys",
    employmentType: "Salaried",
    monthlyIncome: 60000
  }
};

const employerMap = {
  "Infosys": "EMP001",
  "TCS": "EMP002",
  "Wipro": "EMP003",
  "HCL": "HCL004",
  "Accenture": "EMP005",
  "Capgemini": "EMP006",
  "Other": "EMP999"
};

// Prefill form fields from dummyData
function prefillForm() {
  document.getElementById('fullName').value = dummyData.customer.customerName;
  document.getElementById('dob').value = dummyData.customer.dob;
  document.getElementById('phone').value = dummyData.customer.phone;
  document.getElementById('email').value = dummyData.customer.email;
  document.getElementById('pan').value = dummyData.customer.panNumber;
  document.getElementById('aadhar').value = dummyData.customer.aadharNumber;

  document.getElementById('city').value = dummyData.location.city;
  document.getElementById('state').value = dummyData.location.state;
  document.getElementById('locationId').value = dummyData.location.locationId;

  document.getElementById('employerName').value = dummyData.employer.employerName;
  document.getElementById('employmentType').value = dummyData.employer.employmentType;
  document.getElementById('monthlyIncome').value = dummyData.employer.monthlyIncome;
  document.getElementById('employerId').value = dummyData.employer.employerId;
}

// Step navigation logic
let currentStep = 1;
const totalSteps = 3;

function showStep(step) {
  document.querySelectorAll('.form-step').forEach((el, idx) => {
    el.style.display = (idx === step - 1) ? 'block' : 'none';
    el.classList.toggle('form-step-active', idx === step - 1);
  });

  document.getElementById('step-indicator').textContent = `Step ${step} of ${totalSteps}`;
  document.getElementById('backBtn').style.display = step === 1 ? 'none' : 'inline-block';
  document.getElementById('nextBtn').style.display = step === totalSteps ? 'none' : 'inline-block';
  document.getElementById('submitBtn').style.display = step === totalSteps ? 'inline-block' : 'none';
}

function animateStepTransition(next) {
  const active = document.querySelector('.form-step-active');
  if (active) {
    active.classList.remove('form-step-active');
    active.classList.add(next ? 'slide-left' : 'slide-right');
    setTimeout(() => {
      active.classList.remove('slide-left', 'slide-right');
    }, 350);
  }
}

document.getElementById('nextBtn').addEventListener('click', () => {
  if (!validateStep(currentStep)) return;
  animateStepTransition(true);
  setTimeout(() => {
    currentStep++;
    showStep(currentStep);
  }, 200);
});

document.getElementById('backBtn').addEventListener('click', () => {
  animateStepTransition(false);
  setTimeout(() => {
    currentStep--;
    showStep(currentStep);
  }, 200);
});

document.getElementById('employerName').addEventListener('change', (e) => {
  document.getElementById('employerId').value = employerMap[e.target.value] || 'EMP999';
});

function validateStep(step) {
  let valid = true;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;

  if (step === 1) {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      showToast('Please enter a valid email address.');
      valid = false;
    }
    if (!/^\d{10}$/.test(phone)) {
      showToast('Please enter a valid 10-digit phone number.');
      valid = false;
    }
  }

  if (step === 3) {
    const income = parseInt(document.getElementById('monthlyIncome').value);
    if (isNaN(income) || income <= 0) {
      showToast('Please enter a valid monthly income.');
      valid = false;
    }
  }

  return valid;
}

function showToast(msg) {
  const toast = document.getElementById('form-toast');
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, 2500);
}

function generateCustomerId() {
  return 'CUST' + Math.floor(Math.random() * 90000 + 10000);
}

function collectFormData() {
  return {
    customerId: generateCustomerId(),
    customerName: document.getElementById('fullName').value,
    dob: document.getElementById('dob').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    panNumber: document.getElementById('pan').value,
    aadharNumber: document.getElementById('aadhar').value,
    employer: {
      employerId: document.getElementById('employerId').value,
      employerName: document.getElementById('employerName').value,
      employmentType: document.getElementById('employmentType').value,
      monthlyIncome: parseFloat(document.getElementById('monthlyIncome').value)
    },
    location: {
      locationId: document.getElementById('locationId').value,
      city: document.getElementById('city').value,
      state: document.getElementById('state').value
    }
  };
}

document.getElementById('multiStepForm').addEventListener('submit', function (e) {
  e.preventDefault();
  if (!validateStep(currentStep)) return;

  const customerData = collectFormData();

  fetch('http://localhost:9090/customer-db/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customerData)
  })
    .then(response => {
      if (!response.ok) throw new Error('Failed to save customer');
      return response.json();
    })
    .then(data => {
      localStorage.setItem('loanApplication', JSON.stringify({
        customer: customerData,
        employer: customerData.employer,
        location: customerData.location
      }));
      showToast('Customer saved successfully!');
      setTimeout(() => {
        window.location.href = 'eligibility-result.html';
      }, 1800);
    })
    .catch(error => {
      console.error('Error:', error);
      showToast('Error saving customer. Please try again.');
    });
});

function renderSummary() {
  const summaryDiv = document.getElementById('application-summary-card');
  const laptop = JSON.parse(localStorage.getItem('selectedLaptop') || '{}');
  const loan = JSON.parse(localStorage.getItem('loanSelection') || '{}');

  if (!laptop.laptopId) {
    const cameFromHome = localStorage.getItem('fromHomePage') === 'true';
    if (cameFromHome) {
      summaryDiv.innerHTML = `
        <div class="summary-empty">
          <p>Please select a laptop to check eligibility.</p>
          <a href="products.html" class="btn btn-primary" style="margin-top: 10px;">Browse Laptops</a>
        </div>
      `;
      localStorage.removeItem('fromHomePage');
    } else {
      summaryDiv.innerHTML = '<div class="summary-empty">No laptop selected.</div>';
    }
    return;
  }

  const loanAmount = (typeof loan.loanAmount === 'number' && !isNaN(loan.loanAmount)) ? loan.loanAmount : laptop.price;
  const emiAmount = (typeof loan.emiAmount === 'number' && !isNaN(loan.emiAmount)) ? loan.emiAmount : '-';
  const tenure = loan.tenureMonths || '-';
  const interestRate = loan.interestRate || '-';

  summaryDiv.innerHTML = `
    <div class="summary-title"><i class="fas fa-laptop"></i> Applying for: <strong>${laptop.brand} ${laptop.model}</strong></div>
    <div class="summary-details">
      <span>Price: <strong>₹${laptop.price?.toLocaleString('en-IN')}</strong></span>
      <span>Loan Amount: <strong>₹${loanAmount?.toLocaleString('en-IN') || '-'}</strong></span>
      <span>EMI: <strong>${emiAmount !== '-' ? '₹' + emiAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '-'}</strong></span>
      <span>Tenure: <strong>${tenure} months</strong></span>
      <span>Interest Rate: <strong>${interestRate}%</strong></span>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  prefillForm();
  showStep(currentStep);
  renderSummary();
});
