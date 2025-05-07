export interface ProductData {
  [x: string]: any;
  id: number;
  drugName: string;
  ingredients: string;
  indications: string;
  dosage: string;
  adverseReactions: string;
  contraindications: string;
  precautions: string;
  storage: string;
  specification: string;
  manufacturer: string;
  status: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
  image: string;
  price: number;
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  keyword?: string;
  category?: string;
  status?: number;
}
