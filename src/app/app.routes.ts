import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { MedicineList } from './components/medicines/medicine-list';
import { MedicineDetails } from './components/medicines/medicine-details';
import { Cart } from './components/cart/cart';
import { Checkout } from './components/orders/checkout';
import { Orders } from './components/orders/orders';
import { UploadPrescription } from './components/prescriptions/upload-prescription';
import { AdminDashboard } from './components/admin/admin-dashboard';
import { AdminMedicineManagement } from './components/admin/admin-medicine-management';
import { AdminOrders } from './components/admin/admin-orders';
import { AdminPrescriptions } from './components/admin/admin-prescriptions';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'medicines' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'medicines', component: MedicineList },
  { path: 'medicines/:id', component: MedicineDetails },
  { path: 'cart', component: Cart, canActivate: [authGuard] },
  { path: 'checkout', component: Checkout, canActivate: [authGuard] },
  { path: 'orders', component: Orders, canActivate: [authGuard] },
  { path: 'upload-prescription', component: UploadPrescription, canActivate: [authGuard] },
  {
    path: 'admin',
    component: AdminDashboard,
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'medicines' },
      { path: 'medicines', component: AdminMedicineManagement },
      { path: 'orders', component: AdminOrders },
      { path: 'prescriptions', component: AdminPrescriptions }
    ]
  }
];
