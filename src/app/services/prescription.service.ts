import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './api.config';
import { Prescription } from '../models/pharmacy.models';

@Injectable({ providedIn: 'root' })
export class PrescriptionService {
  constructor(private http: HttpClient) {}
  upload(userId: number, file: File) {
    const form = new FormData();
    form.append('userId', String(userId));
    form.append('file', file);
    return this.http.post<Prescription>(`${API_BASE_URL}/prescriptions/upload`, form);
  }
  byUser(userId: number) { return this.http.get<Prescription[]>(`${API_BASE_URL}/prescriptions/user/${userId}`); }
  all() { return this.http.get<Prescription[]>(`${API_BASE_URL}/prescriptions`); }
  approve(id: number, status: string) { return this.http.put(`${API_BASE_URL}/prescriptions/approve/${id}`, { status }); }
}
