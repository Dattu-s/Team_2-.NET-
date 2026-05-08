import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_BASE_URL } from './api.config';
import { Medicine } from '../models/pharmacy.models';

@Injectable({ providedIn: 'root' })
export class MedicineService {
  constructor(private http: HttpClient) {}

  list(search = '', categoryId = '') {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (categoryId) params = params.set('categoryId', categoryId);
    return this.http.get<Medicine[]>(`${API_BASE_URL}/medicines`, { params });
  }

  get(id: number) {
    return this.http.get<Medicine>(`${API_BASE_URL}/medicines/${id}`);
  }

  save(medicine: Partial<Medicine>) {
    return medicine.medicineId
      ? this.http.put(`${API_BASE_URL}/medicines/${medicine.medicineId}`, medicine)
      : this.http.post<Medicine>(`${API_BASE_URL}/medicines`, medicine);
  }

  delete(id: number) {
    return this.http.delete(`${API_BASE_URL}/medicines/${id}`);
  }
}
