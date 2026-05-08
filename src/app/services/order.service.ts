import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './api.config';
import { Order } from '../models/pharmacy.models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}
  place(userId: number, prescriptionId?: number) { return this.http.post<Order>(`${API_BASE_URL}/orders`, { userId, prescriptionId }); }
  byUser(userId: number) { return this.http.get<Order[]>(`${API_BASE_URL}/orders/user/${userId}`); }
  all() { return this.http.get<Order[]>(`${API_BASE_URL}/orders`); }
  updateStatus(orderId: number, status: string) { return this.http.put<Order>(`${API_BASE_URL}/orders/status/${orderId}`, { status }); }
}
