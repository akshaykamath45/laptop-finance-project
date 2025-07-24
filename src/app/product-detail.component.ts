import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

interface Laptop {
  laptopId: number;
  imgurl: string;
  brand: string;
  model: string;
  processor: string;
  ram: string;
  storage: string;
  gpu?: string;
  price: number;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatInputModule, MatSelectModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  laptop: Laptop | null = null;
  loading = false;
  error: string | null = null;
  // EMI calculator
  loanAmount = 0;
  downPayment = 0;
  tenure = 12;
  interestRate = 12;
  emi = 0;
  totalInterest = 0;
  totalPayable = 0;
  emiSchedule: any[] = [];
  applySuccess = false;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading = true;
      this.http.get<Laptop>(`http://localhost:9090/laptop-db/get/${id}`).subscribe({
        next: (data) => {
          this.laptop = data;
          this.loanAmount = data.price;
          this.updateEMI();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Laptop not found.';
          this.loading = false;
        }
      });
    }
  }

  updateEMI() {
    if (!this.laptop) return;
    let price = this.laptop.price;
    let down = this.downPayment;
    if (down > price - 5000) down = price - 5000;
    if (down < 0) down = 0;
    this.downPayment = down;
    let loan = price - down;
    if (loan < 5000) loan = 5000;
    this.loanAmount = loan;
    const N = this.tenure;
    const R = this.interestRate / 12 / 100;
    if (loan === 0) {
      this.emi = 0; this.totalInterest = 0; this.totalPayable = 0; this.emiSchedule = [];
      return;
    }
    const emi = (loan * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalPayable = emi * N;
    const totalInterest = totalPayable - loan;
    this.emi = emi;
    this.totalInterest = totalInterest;
    this.totalPayable = totalPayable;
    // Schedule (first 6 months)
    const schedule = [];
    const today = new Date();
    for (let i = 1; i <= Math.min(N, 6); i++) {
      const dueDate = new Date(today.getFullYear(), today.getMonth() + i, today.getDate());
      schedule.push({
        emiNo: i,
        dueDate: dueDate.toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'}),
        emiAmount: emi,
        status: 'Pending',
        penalty: '—'
      });
    }
    this.emiSchedule = schedule;
  }

  proceedApply() {
    // Connect to backend or show success
    this.applySuccess = true;
  }

  scrollToEMI() {
    if (typeof window !== 'undefined') {
      const el = document.getElementById('emi-section');
      if (el) el.scrollIntoView({behavior: 'smooth'});
    }
  }
} 