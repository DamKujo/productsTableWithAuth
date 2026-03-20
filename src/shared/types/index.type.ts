export type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
};

export type ProductsApiResponse = {
  products: Product[];
  skip: number;
  limit: number;
  total: number;
};

export interface AuthTokenInterface {
  token: {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
  };
  type: string;
}

export interface Product {
  availabilityStatus: string;
  brand: string;
  category: string;
  description: string;
  id: number;
  images: string[];
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
  title: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  discountPercentage: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    qrCode: string;
    barcode: string;
  };
  minimumOrderQuantity: number;
  returnPolicy: string;
  reviews: {
    reviewerName: string;
    rating: number;
    comment: string;
    date: string;
    reviewerEmail: string;
  }[];
  shippingInformation: string;
  sku: string;
  tags: string[];
  warrantyInformation: string;
  weight: number;
}

export interface ItemsResponse {
  limit: number;
  products: Product[];
  skip: number;
  total: number;
}

export interface ItemsServiceInterface {
  getAllItems(): Promise<ItemsResponse>;
}

export interface AuthServiceInterface {
  getToken(): AuthTokenInterface | null;
  setToken({ token, type }: AuthTokenInterface): void;
  removeToken(type: string): void;
}
