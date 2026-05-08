import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category, Medicine } from '../../models/pharmacy.models';
import { CategoryService } from '../../services/category.service';
import { MedicineService } from '../../services/medicine.service';

@Component({
  selector: 'app-admin-medicine-management',
  imports: [FormsModule],
  template: `
    <div class="row g-3">
      <div class="col-lg-4">
        <form class="card p-3 shadow-sm" (ngSubmit)="save()">
          <h2 class="h5">Medicine</h2>
          <input class="form-control mb-2" placeholder="Name" [(ngModel)]="form.medicineName" name="name">
          <input class="form-control mb-2" placeholder="Dosage" [(ngModel)]="form.medicineDosage" name="dosage">
          <input class="form-control mb-2" placeholder="Price" type="number" [(ngModel)]="form.medicinePrice" name="price">
          <input class="form-control mb-2" placeholder="Stock" type="number" [(ngModel)]="form.medicineStock" name="stock">
          <input class="form-control mb-2" placeholder="Image URL" [(ngModel)]="form.medicineImage" name="image">
          <textarea class="form-control mb-2" placeholder="Description" [(ngModel)]="form.medicineDescription" name="description"></textarea>
          <select class="form-select mb-2" [(ngModel)]="form.categoryId" name="category">
            @for (category of categories; track category.categoryId) { <option [value]="category.categoryId">{{ category.categoryName }}</option> }
          </select>
          <label class="form-check mb-3"><input class="form-check-input" type="checkbox" [(ngModel)]="form.medicineRequiresPrescription" name="rx"> Requires prescription</label>
          <button class="btn btn-success">Save</button>
        </form>
      </div>
      <div class="col-lg-8">
        <div class="card shadow-sm table-responsive">
          <table class="table align-middle mb-0">
            <thead><tr><th>Name</th><th>Stock</th><th>Price</th><th></th></tr></thead>
            <tbody>
              @for (medicine of medicines; track medicine.medicineId) {
                <tr>
                  <td>{{ medicine.medicineName }}</td><td>{{ medicine.medicineStock }}</td><td>₹{{ medicine.medicinePrice }}</td>
                  <td class="text-end"><button class="btn btn-sm btn-outline-secondary me-2" (click)="edit(medicine)">Edit</button><button class="btn btn-sm btn-outline-danger" (click)="delete(medicine.medicineId)">Delete</button></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminMedicineManagement implements OnInit {
  private medicinesApi = inject(MedicineService);
  private categoriesApi = inject(CategoryService);
  medicines: Medicine[] = [];
  categories: Category[] = [];
  form: Partial<Medicine> = { medicineName: '', medicineDosage: '', medicinePrice: 0, medicineStock: 0, categoryId: 1, medicineRequiresPrescription: false };
  ngOnInit() { this.categoriesApi.list().subscribe((x) => this.categories = x); this.load(); }
  load() { this.medicinesApi.list().subscribe((x) => this.medicines = x); }
  edit(medicine: Medicine) { this.form = { ...medicine }; }
  save() { this.medicinesApi.save(this.form).subscribe(() => { this.form = { categoryId: 1, medicineRequiresPrescription: false }; this.load(); }); }
  delete(id: number) { this.medicinesApi.delete(id).subscribe(() => this.load()); }
}
