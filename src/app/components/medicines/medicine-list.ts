import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Category, Medicine } from '../../models/pharmacy.models';
import { MedicineService } from '../../services/medicine.service';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-medicine-list',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="d-flex flex-wrap gap-3 justify-content-between align-items-center mb-4">
      <div>
        <h1 class="page-title mb-1">Browse medicines</h1>
        <p class="text-secondary mb-0">Search, filter, and add medicines to your cart.</p>
      </div>
      <div class="d-flex gap-2">
        <input class="form-control" placeholder="Search" [(ngModel)]="search" (ngModelChange)="load()">
        <select class="form-select" [(ngModel)]="categoryId" (ngModelChange)="load()">
          <option value="">All categories</option>
          @for (category of categories; track category.categoryId) {
            <option [value]="category.categoryId">{{ category.categoryName }}</option>
          }
        </select>
      </div>
    </div>
    <div class="row g-3">
      @for (medicine of medicines; track medicine.medicineId) {
        <div class="col-md-4">
          <div class="card h-100 shadow-sm">
            <img class="card-img-top medicine-img" [src]="medicine.medicineImage || 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600'" [alt]="medicine.medicineName">
            <div class="card-body d-flex flex-column">
              <div class="d-flex justify-content-between gap-2">
                <h2 class="h5">{{ medicine.medicineName }}</h2>
                <span class="fw-bold text-success">₹{{ medicine.medicinePrice }}</span>
              </div>
              <p class="text-secondary small mb-2">{{ medicine.medicineDosage }} • {{ medicine.categoryName }}</p>
              <p class="small flex-grow-1">{{ medicine.medicineDescription }}</p>
              <div class="d-flex justify-content-between align-items-center">
                <span class="badge" [class.text-bg-warning]="medicine.medicineRequiresPrescription" [class.text-bg-light]="!medicine.medicineRequiresPrescription">
                  {{ medicine.medicineRequiresPrescription ? 'Prescription' : 'OTC' }}
                </span>
                <span class="small text-secondary">Stock {{ medicine.medicineStock }}</span>
              </div>
              <div class="d-flex gap-2 mt-3">
                <a class="btn btn-outline-success flex-fill" [routerLink]="['/medicines', medicine.medicineId]">Details</a>
                <button class="btn btn-success flex-fill" (click)="add(medicine)">Add</button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class MedicineList implements OnInit {
  private medicinesApi = inject(MedicineService);
  private categoriesApi = inject(CategoryService);
  private cart = inject(CartService);
  private auth = inject(AuthService);
  medicines: Medicine[] = [];
  categories: Category[] = [];
  search = '';
  categoryId = '';

  ngOnInit() {
    this.categoriesApi.list().subscribe((x) => this.categories = x);
    this.load();
  }

  load() {
    this.medicinesApi.list(this.search, this.categoryId).subscribe((x) => this.medicines = x);
  }

  add(medicine: Medicine) {
    const user = this.auth.currentUser();
    if (!user) return;
    this.cart.add(user.userId, medicine.medicineId, 1).subscribe();
  }
}
