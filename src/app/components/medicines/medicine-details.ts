import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Medicine } from '../../models/pharmacy.models';
import { MedicineService } from '../../services/medicine.service';

@Component({
  selector: 'app-medicine-details',
  imports: [RouterLink],
  template: `
    @if (medicine) {
      <div class="row g-4">
        <div class="col-md-6"><img class="img-fluid rounded shadow-sm" [src]="medicine.medicineImage" [alt]="medicine.medicineName"></div>
        <div class="col-md-6">
          <a routerLink="/medicines" class="text-success">Back to medicines</a>
          <h1 class="page-title mt-3">{{ medicine.medicineName }}</h1>
          <p class="text-secondary">{{ medicine.categoryName }} • {{ medicine.medicineDosage }}</p>
          <p>{{ medicine.medicineDescription }}</p>
          <p class="display-6 text-success">₹{{ medicine.medicinePrice }}</p>
          <p>Available stock: {{ medicine.medicineStock }}</p>
          @if (medicine.medicineRequiresPrescription) {
            <div class="alert alert-warning">Prescription approval is required before checkout.</div>
          }
        </div>
      </div>
    }
  `
})
export class MedicineDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(MedicineService);
  medicine?: Medicine;
  ngOnInit() {
    this.api.get(Number(this.route.snapshot.paramMap.get('id'))).subscribe((x) => this.medicine = x);
  }
}
