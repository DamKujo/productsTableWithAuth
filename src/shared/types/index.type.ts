export type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
};

// POST /auth/login returns the user together with the tokens
export type LoginResponse = User & {
  accessToken: string;
  refreshToken: string;
};

export interface AuthTokenInterface {
  token: {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
  };
  type: string;
}

export interface AuthServiceInterface {
  getToken(): AuthTokenInterface | null;
  setToken({ token, type }: AuthTokenInterface): void;
  removeToken(type: string): void;
}
