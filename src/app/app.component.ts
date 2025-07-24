import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgClass, CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    NgClass,
    RouterModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'laptop-loan-finance';
  opened = true;
  theme: 'dark' | 'light' = 'dark';
  themeIcon = 'fa-moon';
  loggedIn = false;
  userEmail = '';
  userPassword = '';
  showDropdown = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.opened = window.matchMedia('(min-width: 768px)').matches;
      // Set initial theme from localStorage or default
      const saved = localStorage.getItem('theme');
      this.theme = (saved === 'light' || saved === 'dark') ? saved : 'dark';
      this.applyTheme();
      this.checkLogin();
    }
  }

  checkLogin() {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (user && user.email) {
      this.loggedIn = true;
      this.userEmail = user.email;
      // Find password from users list
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const found = users.find((u: any) => u.email === user.email);
      this.userPassword = found ? '*'.repeat((found.password || '').length) : '********';
    } else {
      this.loggedIn = false;
      this.userEmail = '';
      this.userPassword = '';
    }
    this.showDropdown = false;
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', this.theme);
    this.applyTheme();
  }

  applyTheme() {
    if (typeof window !== 'undefined') {
      document.body.setAttribute('data-theme', this.theme);
      this.themeIcon = this.theme === 'dark' ? 'fa-sun' : 'fa-moon';
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.checkLogin();
    this.router.navigate(['/']);
  }
}
