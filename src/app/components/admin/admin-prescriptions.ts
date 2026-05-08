import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Prescription } from '../../models/pharmacy.models';
import { PrescriptionService } from '../../services/prescription.service';

@Component({
  selector: 'app-admin-prescriptions',
  imports: [DatePipe],
  template: `
    <div class="card shadow-sm table-responsive">
      <table class="table align-middle mb-0">
        <thead><tr><th>ID</th><th>User</th><th>Uploaded</th><th>Status</th><th>File</th><th></th></tr></thead>
        <tbody>
          @for (item of prescriptions; track item.prescriptionId) {
            <tr>
              <td>#{{ item.prescriptionId }}</td><td>{{ item.userId }}</td><td>{{ item.uploadedDate | date:'short' }}</td><td>{{ item.status }}</td>
              <td><a [href]="apiRoot + item.filePath" target="_blank">View</a></td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-success me-2" (click)="setStatus(item, 'Approved')">Approve</button>
                <button class="btn btn-sm btn-outline-danger" (click)="setStatus(item, 'Rejected')">Reject</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class AdminPrescriptions implements OnInit {
  private api = inject(PrescriptionService);
  apiRoot = 'http://localhost:5078';
  prescriptions: Prescription[] = [];
  ngOnInit() { this.load(); }
  load() { this.api.all().subscribe((x) => this.prescriptions = x); }
  setStatus(item: Prescription, status: string) { this.api.approve(item.prescriptionId, status).subscribe(() => this.load()); }
}
