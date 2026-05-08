import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './api.config';
import { CartItem } from '../models/pharmacy.models';

@Injectable({ providedIn: 'root' })
export class CartService {
  constructor(private http: HttpClient) {}
  add(userId: number, medicineId: number, quantity: number) { return this.http.post<CartItem>(`${API_BASE_URL}/cart`, { userId, medicineId, quantity }); }
  byUser(userId: number) { return this.http.get<CartItem[]>(`${API_BASE_URL}/cart/user/${userId}`); }
  remove(cartId: number) { return this.http.delete(`${API_BASE_URL}/cart/${cartId}`); }
}
