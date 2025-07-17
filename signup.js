document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('signup-form');
  const errorDiv = document.getElementById('signup-error');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    let users = JSON.parse(localStorage.getItem('users')) || [];
    // Check if email already exists
    if (users.some(u => u.email === email)) {
      errorDiv.textContent = 'Email is already registered.';
      errorDiv.style.display = 'block';
      return;
    }
    if (password !== confirm) {
      errorDiv.textContent = 'Passwords do not match.';
      errorDiv.style.display = 'block';
      return;
    }
    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify({ email }));
    window.location.href = 'index.html';
  });
}); 