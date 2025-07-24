import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface Loan {
  loanId: number;
  customerId: number;
  laptopId: number;
  status: string;
  emiDetails: string;
}

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatProgressSpinnerModule],
  templateUrl: './loan-list.component.html',
  styleUrl: './loan-list.component.css'
})
export class LoanListComponent {
  loans = signal<Loan[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  displayedColumns = ['loanId', 'customerId', 'laptopId', 'status', 'emiDetails'];

  constructor(private http: HttpClient) {
    this.fetchLoans();
  }

  fetchLoans() {
    this.loading.set(true);
    this.http.get<Loan[]>('http://localhost:9090/loan-db/getAll').subscribe({
      next: (data) => {
        this.loans.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load loans: ' + (err?.message || err?.statusText || err));
        this.loading.set(false);
      }
    });
  }
}
