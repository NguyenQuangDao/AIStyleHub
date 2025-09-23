export interface Shop {
  name: string;
  url: string;
}

export interface Product {
  id: number;
  name: string;
  type: string;
  price: number;
  imageUrl: string;
  styleTags: string[];
  shop: Shop;
  createdAt?: string;
}

export interface Outfit {
  id: number;
  style: string;
  imageUrl?: string | null;
  products: Product[];
  createdAt?: string;
}
