// --- Multi-Step Signup Form Logic ---

const locationMap = {
  "Pune":        { locationId: "LOC001", state: "Maharashtra" },
  "Ahmedabad":   { locationId: "LOC002", state: "Gujarat" },
  "Jaipur":      { locationId: "LOC003", state: "Rajasthan" },
  "Surat":       { locationId: "LOC004", state: "Gujarat" },
  "Bhopal":      { locationId: "LOC005", state: "MP" },
  "Delhi":       { locationId: "LOC006", state: "Delhi" },
  "Lucknow":     { locationId: "LOC007", state: "UP" },
  "Indore":      { locationId: "LOC008", state: "MP" },
  "Hyderabad":   { locationId: "LOC009", state: "Telangana" },
  "Kolkata":     { locationId: "LOC010", state: "West Bengal" },
  "Chandigarh":  { locationId: "LOC011", state: "Chandigarh" },
  "Ranchi":      { locationId: "LOC012", state: "Jharkhand" }
};

const employerMap = {
  "Infosys":           { employerId: "EMP001", employmentType: "Salaried", monthlyIncome: 30000 },
  "Wipro":             { employerId: "EMP002", employmentType: "Salaried", monthlyIncome: 40000 },
  "Patel Electronics": { employerId: "EMP003", employmentType: "Self-Employed", monthlyIncome: 13000 },
  "HCL":               { employerId: "EMP004", employmentType: "Salaried", monthlyIncome: 32000 },
  "TCS":               { employerId: "EMP005", employmentType: "Salaried", monthlyIncome: 60000 },
  "Axis Bank":         { employerId: "EMP006", employmentType: "Salaried", monthlyIncome: 38000 },
  "Capgemini":         { employerId: "EMP007", employmentType: "Salaried", monthlyIncome: 22000 },
  "Cognizant":         { employerId: "EMP008", employmentType: "Salaried", monthlyIncome: 46000 },
  "Self Business":     { employerId: "EMP009", employmentType: "Self-Employed", monthlyIncome: 15000 },
  "Adobe":             { employerId: "EMP010", employmentType: "Salaried", monthlyIncome: 55000 },
  "HDFC Bank":         { employerId: "EMP011", employmentType: "Salaried", monthlyIncome: 25000 }
};

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

// City selection: set locationId and state
const citySelect = document.getElementById('city');
citySelect.addEventListener('change', function() {
  const city = citySelect.value;
  if (locationMap[city]) {
    document.getElementById('locationId').value = locationMap[city].locationId;
    document.getElementById('state').value = locationMap[city].state;
  } else {
    document.getElementById('locationId').value = '';
    document.getElementById('state').value = '';
  }
});

// Employer selection: set employerId, employmentType, and monthlyIncome
const employerSelect = document.getElementById('employerName');
employerSelect.addEventListener('change', function() {
  const emp = employerSelect.value;
  if (employerMap[emp]) {
    document.getElementById('employerId').value = employerMap[emp].employerId;
    document.getElementById('employmentType').value = employerMap[emp].employmentType;
    document.getElementById('monthlyIncome').value = employerMap[emp].monthlyIncome;
  } else {
    document.getElementById('employerId').value = '';
    document.getElementById('employmentType').value = '';
    document.getElementById('monthlyIncome').value = '';
  }
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
  // Set locationId and employerId if not set
  if (!customerData.location.locationId) {
    customerData.location.locationId = 'LOC' + Math.floor(Math.random() * 90000 + 10000);
  }
  if (!customerData.employer.employerId) {
    customerData.employer.employerId = employerMap[customerData.employer.employerName] || 'EMP999';
  }
  fetch('http://localhost:9090/customer-db/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customerData)
  })
    .then(response => {
      if (!response.ok) throw new Error('Failed to create account');
      return response.json();
    })
    .then(data => {
      localStorage.setItem('currentUser', JSON.stringify({ email: customerData.email }));
      showToast('Account created successfully! Redirecting...');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1800);
    })
    .catch(error => {
      console.error('Error:', error);
      showToast('Error creating account. Please try again.');
    });
});

document.addEventListener('DOMContentLoaded', () => {
  showStep(currentStep);
}); 