import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private router: Router) {}

  login() {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    // Add demo accounts if not present
    if (!users.some((u: any) => u.email === 'user@demo.com')) {
      users.push({ email: 'user@demo.com', password: 'user123' });
    }
    if (!users.some((u: any) => u.email === 'admin@demo.com')) {
      users.push({ email: 'admin@demo.com', password: 'admin123' });
    }
    localStorage.setItem('users', JSON.stringify(users));
    const user = users.find((u: any) => u.email === this.email && u.password === this.password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify({ email: user.email }));
      this.router.navigate(['/']);
    } else {
      this.error = 'Invalid email or password.';
    }
  }
} 