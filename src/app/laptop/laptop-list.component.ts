import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

interface Laptop {
  id: number;
  imgUrl: string;
  brand: string;
  specs: string;
  price: number;
}

interface LoanForm {
  customerName: string;
  email: string;
  amount: number;
  tenure: number;
}

@Component({
  selector: 'app-laptop-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, MatButtonModule, MatProgressSpinnerModule, FormsModule],
  templateUrl: './laptop-list.component.html',
  styleUrl: './laptop-list.component.css'
})
export class LaptopListComponent {
  laptops = signal<Laptop[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  search: string = '';
  applyingLaptopId: number | null = null;
  loanForm: LoanForm = { customerName: '', email: '', amount: 0, tenure: 12 };
  formSubmitted: boolean = false;

  constructor(private http: HttpClient) {
    this.fetchLaptops();
  }

  fetchLaptops() {
    // NOTE: The backend at http://localhost:9090/laptop-db/getAll must be running for data to appear.
    this.loading.set(true);
    this.http.get<Laptop[]>('http://localhost:9090/laptop-db/getAll').subscribe({
      next: (data) => {
        this.laptops.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load laptops');
        this.loading.set(false);
      }
    });
  }

  filteredLaptops = computed(() => {
    const q = this.search.toLowerCase();
    return this.laptops().filter(l =>
      l.brand.toLowerCase().includes(q) ||
      l.specs.toLowerCase().includes(q)
    );
  });

  openLoanForm(laptopId: number) {
    this.applyingLaptopId = laptopId;
    this.loanForm = { customerName: '', email: '', amount: 0, tenure: 12 };
    this.formSubmitted = false;
  }

  closeLoanForm() {
    this.applyingLaptopId = null;
  }

  submitLoanForm(laptop: Laptop) {
    // For now, just show a success message. You can connect to backend here.
    this.formSubmitted = true;
    // Optionally, send this.loanForm and laptop.id to backend
  }
}
