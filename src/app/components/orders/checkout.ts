import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-6 card p-4 shadow-sm">
        <h1 class="page-title mb-3">Checkout</h1>
        <label class="form-label">Approved prescription ID, if required</label>
        <input class="form-control mb-3" type="number" [(ngModel)]="prescriptionId">
        @if (message) { <div class="alert alert-info py-2">{{ message }}</div> }
        <button class="btn btn-success" (click)="place()">Place order</button>
      </div>
    </div>
  `
})
export class Checkout {
  private auth = inject(AuthService);
  private orders = inject(OrderService);
  private router = inject(Router);
  prescriptionId?: number;
  message = '';
  place() {
    const user = this.auth.currentUser();
    if (!user) return;
    this.orders.place(user.userId, this.prescriptionId || undefined).subscribe({
      next: () => this.router.navigateByUrl('/orders'),
      error: (err) => this.message = err.error?.message ?? 'Order could not be placed'
    });
  }
}
