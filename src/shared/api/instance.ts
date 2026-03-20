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

  // if (!res.ok) {
  //   throw new Error(res.statusText);
  // }
  return res;
};
