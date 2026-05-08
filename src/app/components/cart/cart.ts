import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartItem } from '../../models/pharmacy.models';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  template: `
    <h1 class="page-title mb-3">Cart</h1>
    <div class="card shadow-sm">
      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead><tr><th>Medicine</th><th>Qty</th><th>Price</th><th>Total</th><th></th></tr></thead>
          <tbody>
            @for (item of items; track item.cartId) {
              <tr>
                <td>{{ item.medicineName }}</td>
                <td><input class="form-control form-control-sm qty" type="number" min="1" [value]="item.quantity" (change)="update(item, $event)"></td>
                <td>₹{{ item.price }}</td>
                <td>₹{{ item.lineTotal }}</td>
                <td><button class="btn btn-outline-danger btn-sm" (click)="remove(item.cartId)">Remove</button></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      <div class="card-footer d-flex justify-content-between align-items-center">
        <strong>Total ₹{{ total }}</strong>
        <a class="btn btn-success" routerLink="/checkout">Checkout</a>
      </div>
    </div>
  `,
  styles: ['.qty{width:80px}']
})
export class Cart implements OnInit {
  private cart = inject(CartService);
  private auth = inject(AuthService);
  items: CartItem[] = [];
  get total() { return this.items.reduce((sum, x) => sum + x.lineTotal, 0); }
  ngOnInit() { this.load(); }
  load() {
    const user = this.auth.currentUser();
    if (user) this.cart.byUser(user.userId).subscribe((x) => this.items = x);
  }
  update(item: CartItem, event: Event) {
    const quantity = Number((event.target as HTMLInputElement).value);
    this.cart.add(item.userId, item.medicineId, quantity).subscribe(() => this.load());
  }
  remove(id: number) { this.cart.remove(id).subscribe(() => this.load()); }
}
