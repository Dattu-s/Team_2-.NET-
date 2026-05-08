import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './api.config';
import { Category } from '../models/pharmacy.models';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private http: HttpClient) {}
  list() { return this.http.get<Category[]>(`${API_BASE_URL}/categories`); }
  create(payload: Partial<Category>) { return this.http.post<Category>(`${API_BASE_URL}/categories`, payload); }
}
