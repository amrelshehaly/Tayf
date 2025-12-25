export interface User {
  id: number;
  email: string;
  name: string;
  role: 'superadmin' | 'branchadmin';
  branchId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Branch {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    branchAdmins: number;
  };
  branchAdmins?: BranchAdmin[];
}

export interface BranchAdmin {
  id: number;
  name: string;
  email: string;
  role: string;
  branchId: number;
  createdAt: string;
  updatedAt: string;
  branch?: {
    id: number;
    name: string;
  };
}

export interface RawMaterial {
  id: number;
  name: string;
  stock: number;
  branchId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRecipe {
  id: number;
  productId: number;
  rawMaterialId: number;
  quantityRequired: number;
  rawMaterial: RawMaterial;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  branchId: number;
  createdAt: string;
  updatedAt: string;
  recipe: ProductRecipe[];
  available?: number; // Calculated field from backend
}


export interface CreateBranchData {
  name: string;
}

export interface UpdateBranchData {
  name: string;
}

export interface CreateBranchAdminData {
  name: string;
  email: string;
  password: string;
  branchId: number;
}

export interface UpdateBranchAdminData {
  name?: string;
  email?: string;
}

export interface CreateMaterialData {
  name: string;
  stock: number;
}

export interface UpdateMaterialData {
  name?: string;
  stock?: number;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  recipe: {
    rawMaterialId: number;
    quantityRequired: number;
  }[];
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  recipe?: {
    rawMaterialId: number;
    quantityRequired: number;
  }[];
}

export interface ApiError {
  error: string;
}

