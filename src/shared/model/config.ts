export const EXPIRES_AT = 1000 * 60 * 25;
export const VIEW_STALE_TIME = 5 * 60 * 1000;
export const BASE_URL = "https://dummyjson.com";
export const ROUTES = {
  ROOT: "/",
  LOGIN: "/login",
  PRODUCTS: "/products",
} as const;

export const URLS = {
  LOGIN: "https://dummyjson.com/auth/login",
  AUTHORIZATION: "https://dummyjson.com/auth/me",
  REFRESH: "https://dummyjson.com/auth/refresh",
} as const;
