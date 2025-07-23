document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('login-form');
  const errorDiv = document.getElementById('login-error');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const dob = document.getElementById('login-dob').value; // format: YYYY-MM-DD

    // Demo/admin login fallback (optional, keep if you want demo accounts)
    if ((email === 'akshaykamath193@gmail.com' && (dob === '2003-12-28' || dob === '28/12/2003')) ||
        (email === 'admin@demo.com' && (dob === '1980-01-01' || dob === '01/01/1980'))) {
      localStorage.setItem('currentUser', JSON.stringify({ email }));
      // Send login email notification for demo/admin logins
      fetch('http://localhost:9009/send-login-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      .then(res => res.json())
      .then(data => {
        console.log('Login email (demo/admin):', data.message);
      })
      .catch(err => {
        console.error('Failed to send login email (demo/admin):', err);
      });
      if (email === 'admin@demo.com') {
        window.location.href = 'dashboard.html';
      } else {
        window.location.href = 'index.html';
      }
      return;
    }

    // Customer login: fetch from backend
    try {
      console.log('Logging in with:', email, dob);
      const res = await fetch(`http://localhost:9090/customer-db/getByEmail/${encodeURIComponent(email)}`);
      console.log('API response status:', res.status);
      if (!res.ok) throw new Error('Customer not found');
      const data = await res.json();
      console.log('API response data:', data);
      const customer = data.t;
      console.log('Customer object:', customer);
      if (!customer) throw new Error('Customer not found');
      // Compare DOB (backend returns YYYY-MM-DD)
      console.log('Comparing DOBs:', 'Input:', dob, 'Backend:', customer.dob);
      if (normalizeDate(customer.dob) === normalizeDate(dob)) {
        localStorage.setItem('currentUser', JSON.stringify({ email: customer.email }));
        // Send login email notification
        fetch('http://localhost:9009/send-login-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: customer.email })
        })
        .then(res => res.json())
        .then(data => {
          console.log('Login email:', data.message);
        })
        .catch(err => {
          console.error('Failed to send login email:', err);
        });
        window.location.href = 'index.html';
      } else {
        errorDiv.style.display = 'none';
        showToast('Invalid email or date of birth.');
        console.log('DOB mismatch:', normalizeDate(customer.dob), normalizeDate(dob));
      }
    } catch (err) {
      errorDiv.style.display = 'none';
      showToast('Invalid email or date of birth.');
      console.error('Login error:', err);
    }
  });

  function normalizeDate(dateStr) {
    // Accepts 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:mm:ss' and returns 'YYYY-MM-DD'
    if (!dateStr) return '';
    return dateStr.split('T')[0];
  }

  function showToast(msg) {
    const toast = document.getElementById('form-toast');
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 2500);
  }
}); 