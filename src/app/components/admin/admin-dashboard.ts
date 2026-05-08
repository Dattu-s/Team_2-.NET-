import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink, RouterOutlet],
  template: `
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
      <h1 class="page-title mb-0">Admin dashboard</h1>
      <div class="btn-group">
        <a class="btn btn-outline-success" routerLink="medicines">Medicines</a>
        <a class="btn btn-outline-success" routerLink="orders">Orders</a>
        <a class="btn btn-outline-success" routerLink="prescriptions">Prescriptions</a>
      </div>
    </div>
    <router-outlet />
  `
})
export class AdminDashboard {}
