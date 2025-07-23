document.addEventListener('DOMContentLoaded', async function() {
  if (!localStorage.getItem('currentUser')) {
    window.location.href = 'login.html';
    return;
  }
  const container = document.getElementById('user-detail-container');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  // Render admin user immediately, do not fetch anything
  if (currentUser.email === 'admin@demo.com') {
    container.querySelector('.user-details').innerHTML = `
      <div class="appdetail-header">
        <h2><i class="fas fa-user-shield"></i> Admin User</h2>
      </div>
      <div class="appdetail-actions" style="margin: 12px 0 20px 0;">
        <button class="btn btn-secondary" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</button>
      </div>
      <div class="appdetail-section">
        <div><strong>Email:</strong> admin@demo.com</div>
        <div><strong>DOB:</strong> 01/01/1980</div>
      </div>
    `;
    return;
  }
  let customer = {};
  try {
    // Get customerId from email
    const res = await fetch(`http://localhost:9090/customer-db/getByEmail/${encodeURIComponent(currentUser.email)}`);
    const data = await res.json();
    if (!data.t || !data.t.customerId) throw new Error('No customer found');
    // Fetch full customer details
    const res2 = await fetch(`http://localhost:9090/customer-db/get/${data.t.customerId}`);
    const data2 = await res2.json();
    customer = data2.t || {};
  } catch (e) {
    container.innerHTML = '<div class="appdetail-empty">Could not load user details.</div>';
    return;
  }
  // Render user details (do not include logout button here)
  container.querySelector('.user-details').innerHTML = `
    <div class="appdetail-header">
      <h2><i class="fas fa-user"></i> My Profile</h2>
    </div>
    <div class="appdetail-actions" style="margin: 12px 0 20px 0;">
      <button class="btn btn-secondary" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</button>
    </div>
    <div class="appdetail-section appdetail-customer">
      <h3>Personal Info</h3>
      <div><strong>Name:</strong> ${customer.customerName || '-'}</div>
      <div><strong>Date of Birth:</strong> ${customer.dob || '-'}</div>
      <div><strong>Email:</strong> ${customer.email || '-'}</div>
      <div><strong>Phone:</strong> ${customer.phone || '-'}</div>
      <div><strong>PAN:</strong> ${customer.panNumber || '-'}</div>
      <div><strong>Aadhaar:</strong> ${customer.aadharNumber || '-'}</div>
    </div>
    <div class="appdetail-section appdetail-employer">
      <h3>Employment Info</h3>
      <div><strong>Employer Name:</strong> ${customer.employer?.employerName || '-'}</div>
      <div><strong>Employment Type:</strong> ${customer.employer?.employmentType || '-'}</div>
      <div><strong>Monthly Income:</strong> ₹${customer.employer?.monthlyIncome?.toLocaleString('en-IN') || '-'}</div>
    </div>
    <div class="appdetail-section appdetail-location">
      <h3>Location Info</h3>
      <div><strong>City:</strong> ${customer.location?.city || '-'}</div>
      <div><strong>State:</strong> ${customer.location?.state || '-'}</div>
    </div>
  `;
});

// Attach logout handler using event delegation to guarantee it works even if the button is rendered after DOMContentLoaded

document.addEventListener('click', function(e) {
  if (e.target && e.target.id === 'logout-btn') {
    console.log('Logout button clicked');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('customerId');
    localStorage.removeItem('eligibilityStatus');
    localStorage.removeItem('latestLoanId');
    localStorage.removeItem('loanApplication');
    localStorage.removeItem('selectedApplicationId');
    localStorage.removeItem('selectedLoanId');
    if (typeof renderNavbar === 'function') renderNavbar();
    window.location.replace('index.html');
  }
}); 