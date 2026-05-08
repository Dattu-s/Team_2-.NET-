import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Order } from '../../models/pharmacy.models';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-orders',
  template: `
    <h1 class="page-title mb-3">Order history</h1>
    <div class="d-grid gap-3">
      @for (order of orders; track order.orderId) {
        <div class="card p-3 shadow-sm">
          <div class="d-flex justify-content-between">
            <strong>#{{ order.orderId }} • {{ order.status }}</strong>
            <span>₹{{ order.totalAmount }}</span>
          </div>
          <p class="small text-secondary mb-2">{{ order.createdDate | date:'medium' }}</p>
          <ul class="mb-3">
            @for (item of order.items; track item.orderItemId) {
              <li>{{ item.medicineName }} x {{ item.quantity }}</li>
            }
          </ul>
          <button class="btn btn-outline-success btn-sm align-self-start" (click)="reorder(order)">Quick reorder</button>
        </div>
      }
    </div>
  `,
  imports: [DatePipe]
})
export class Orders implements OnInit {
  private auth = inject(AuthService);
  private api = inject(OrderService);
  private cart = inject(CartService);
  orders: Order[] = [];
  ngOnInit() {
    const user = this.auth.currentUser();
    if (user) this.api.byUser(user.userId).subscribe((x) => this.orders = x);
  }
  reorder(order: Order) {
    const user = this.auth.currentUser();
    if (!user) return;
    order.items.forEach((item) => this.cart.add(user.userId, item.medicineId, item.quantity).subscribe());
  }
}
