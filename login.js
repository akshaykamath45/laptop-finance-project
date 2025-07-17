document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('login-form');
  const errorDiv = document.getElementById('login-error');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    let users = JSON.parse(localStorage.getItem('users')) || [];
    // Add demo accounts if not present
    if (!users.some(u => u.email === 'user@demo.com')) {
      users.push({ email: 'user@demo.com', password: 'user123' });
    }
    if (!users.some(u => u.email === 'admin@demo.com')) {
      users.push({ email: 'admin@demo.com', password: 'admin123' });
    }
    // Save back in case demo accounts were added
    localStorage.setItem('users', JSON.stringify(users));
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify({ email: user.email }));
      window.location.href = 'index.html';
    } else {
      errorDiv.textContent = 'Invalid email or password.';
      errorDiv.style.display = 'block';
    }
  });
}); 