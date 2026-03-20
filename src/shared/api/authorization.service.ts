import { commonPostRequest } from "@/shared/api/instance";
import { AuthService, useSession } from "@/shared/model/session";
import {
  AuthServiceInterface,
  ItemsServiceInterface,
} from "@/shared/types/index.type";

//???????

//authFetch must get the token and save it after receive
export async function authFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const session = useSession.getState();
  let token = session.token;
  const authenticate = async (token: string | null) => {
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  };

  let response = await authenticate(token?.token.accessToken!);
  return response;
}

export class ItemService implements ItemsServiceInterface {
  async getAllItems(): Promise<any> {
    try {
      const response = await fetch(`https://dummyjson.com/products?limit=5`);
      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }
}
// get products logic -> hooks in features/products-overview
