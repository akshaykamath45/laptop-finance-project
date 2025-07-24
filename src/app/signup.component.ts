import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './login.component.css'
})
export class SignupComponent {
  email = '';
  password = '';
  confirm = '';
  error = '';

  constructor(private router: Router) {}

  signup() {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some((u: any) => u.email === this.email)) {
      this.error = 'Email is already registered.';
      return;
    }
    if (this.password !== this.confirm) {
      this.error = 'Passwords do not match.';
      return;
    }
    users.push({ email: this.email, password: this.password });
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify({ email: this.email }));
    this.router.navigate(['/']);
  }
} 