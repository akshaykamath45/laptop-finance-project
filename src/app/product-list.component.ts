import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
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
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatSelectModule, MatInputModule, MatIconModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  laptops: Laptop[] = [];
  filtered: Laptop[] = [];
  loading = false;
  error: string | null = null;
  // Filters
  brand = '';
  ram = '';
  processor = '';
  price = 200000;
  search = '';
  brands = ['HP', 'Dell', 'Apple', 'Lenovo', 'ASUS'];
  rams = ['8GB', '16GB', '32GB'];
  processors = ['i5', 'i7', 'Ryzen'];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loading = true;
    this.http.get<Laptop[]>('http://localhost:9090/laptop-db/getAll').subscribe({
      next: (data) => {
        this.laptops = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load laptops';
        this.loading = false;
      }
    });
  }

  applyFilters() {
    let filtered = this.laptops.slice();
    if (this.brand) filtered = filtered.filter(l => l.brand === this.brand);
    if (this.ram) filtered = filtered.filter(l => l.ram === this.ram);
    if (this.processor) filtered = filtered.filter(l => l.processor.includes(this.processor));
    if (this.price) filtered = filtered.filter(l => l.price <= this.price);
    if (this.search) {
      const q = this.search.toLowerCase();
      filtered = filtered.filter(l => l.brand.toLowerCase().includes(q) || l.model.toLowerCase().includes(q));
    }
    this.filtered = filtered;
  }

  viewDetails(laptop: Laptop) {
    this.router.navigate(['/product', laptop.laptopId]);
  }
} 