import { URLS } from "../model/config";
import { User } from "../types/index.type";
import { authFetch } from "./authorization.service";

type RequestPostBodyParams = {
  [key: string]: any;
};

export const commonPostRequest = async (
  url: string,
  paramsBody: RequestPostBodyParams,
) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...paramsBody,
      expiresInMins: 30,
    }),
  });
  return res;
};

export async function getUser(): Promise<User> {
  const res = await authFetch(URLS.AUTHORIZATION, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Unauthorized");
  }

  return res.json();
}
