import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Order } from '../../models/pharmacy.models';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-admin-orders',
  imports: [DatePipe],
  template: `
    <div class="card shadow-sm table-responsive">
      <table class="table align-middle mb-0">
        <thead><tr><th>Order</th><th>User</th><th>Total</th><th>Status</th><th>Created</th><th></th></tr></thead>
        <tbody>
          @for (order of orders; track order.orderId) {
            <tr>
              <td>#{{ order.orderId }}</td><td>{{ order.userId }}</td><td>₹{{ order.totalAmount }}</td><td>{{ order.status }}</td><td>{{ order.createdDate | date:'short' }}</td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-success me-1" (click)="status(order, 'Confirmed')">Confirm</button>
                <button class="btn btn-sm btn-outline-primary me-1" (click)="status(order, 'Delivered')">Deliver</button>
                <button class="btn btn-sm btn-outline-danger" (click)="status(order, 'Cancelled')">Cancel</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class AdminOrders implements OnInit {
  private api = inject(OrderService);
  orders: Order[] = [];
  ngOnInit() { this.load(); }
  load() { this.api.all().subscribe((x) => this.orders = x); }
  status(order: Order, status: string) { this.api.updateStatus(order.orderId, status).subscribe(() => this.load()); }
}
