import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Prescription } from '../../models/pharmacy.models';
import { AuthService } from '../../services/auth.service';
import { PrescriptionService } from '../../services/prescription.service';

@Component({
  selector: 'app-upload-prescription',
  imports: [DatePipe],
  template: `
    <div class="row g-4">
      <div class="col-md-5">
        <div class="card p-4 shadow-sm">
          <h1 class="page-title mb-3">Upload prescription</h1>
          <input class="form-control mb-3" type="file" accept=".jpg,.jpeg,.png,.pdf" (change)="pick($event)">
          <button class="btn btn-success" [disabled]="!file" (click)="upload()">Upload</button>
        </div>
      </div>
      <div class="col-md-7">
        <div class="card shadow-sm">
          <div class="card-header bg-white fw-semibold">My prescriptions</div>
          <ul class="list-group list-group-flush">
            @for (item of prescriptions; track item.prescriptionId) {
              <li class="list-group-item d-flex justify-content-between">
                <span>#{{ item.prescriptionId }} • {{ item.uploadedDate | date:'mediumDate' }}</span>
                <span class="badge text-bg-secondary">{{ item.status }}</span>
              </li>
            }
          </ul>
        </div>
      </div>
    </div>
  `
})
export class UploadPrescription implements OnInit {
  private auth = inject(AuthService);
  private api = inject(PrescriptionService);
  file?: File;
  prescriptions: Prescription[] = [];
  ngOnInit() { this.load(); }
  pick(event: Event) { this.file = (event.target as HTMLInputElement).files?.[0]; }
  upload() {
    const user = this.auth.currentUser();
    if (user && this.file) this.api.upload(user.userId, this.file).subscribe(() => this.load());
  }
  load() {
    const user = this.auth.currentUser();
    if (user) this.api.byUser(user.userId).subscribe((x) => this.prescriptions = x);
  }
}
