export interface AuthResponse {
  userId: number;
  userName: string;
  userEmail: string;
  role: 'Admin' | 'Customer' | string;
  token: string;
}

export interface Category {
  categoryId: number;
  categoryName: string;
  description?: string;
}

export interface Medicine {
  medicineId: number;
  medicineName: string;
  medicineDescription?: string;
  medicineDosage: string;
  medicinePrice: number;
  medicineStock: number;
  medicineRequiresPrescription: boolean;
  medicineImage?: string;
  categoryId: number;
  categoryName?: string;
}

export interface CartItem {
  cartId: number;
  userId: number;
  medicineId: number;
  medicineName?: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface Prescription {
  prescriptionId: number;
  userId: number;
  filePath: string;
  status: 'Pending' | 'Approved' | 'Rejected' | string;
  uploadedDate: string;
}

export interface OrderItem {
  orderItemId: number;
  medicineId: number;
  medicineName?: string;
  quantity: number;
  price: number;
}

export interface Order {
  orderId: number;
  userId: number;
  prescriptionId?: number;
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled' | string;
  createdDate: string;
  items: OrderItem[];
}
