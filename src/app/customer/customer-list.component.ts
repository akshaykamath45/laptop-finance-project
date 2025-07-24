import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface Loan {
  loanId: number;
  laptopId: number;
  status: string;
  emiDetails: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  employer: string;
  loans: Loan[];
}

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatExpansionModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent {
  customers = signal<Customer[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  displayedColumns = ['name', 'email', 'employer', 'expand'];

  constructor(private http: HttpClient) {
    this.fetchCustomers();
  }

  fetchCustomers() {
    this.loading.set(true);
    this.http.get<Customer[]>('http://localhost:9090/customer-db/getAll').subscribe({
      next: (data) => {
        this.customers.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load customers: ' + (err?.message || err?.statusText || err));
        this.loading.set(false);
      }
    });
  }
}
