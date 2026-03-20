import { BASE_URL, VIEW_STALE_TIME } from "@/shared/model/config";
import { ProductsApiResponse } from "@/shared/types/index.type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { MRT_PaginationState, MRT_SortingState } from "material-react-table";

interface UseProductOverviewProps {
  pagination: MRT_PaginationState;
  sort: MRT_SortingState;
  searchQuery?: string;
}

export function useProductOverview({
  pagination,
  sort,
  searchQuery,
}: UseProductOverviewProps) {
  const {
    data: { products = [], total } = {},
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery<ProductsApiResponse>({
    queryKey: [
      "items-list",
      {
        pagination,
        sort,
        searchQuery,
      },
    ],
    queryFn: async () => {
      let finalFetchURL;
      const base = BASE_URL;

      let path = "/products";

      if (searchQuery) {
        path += "/search";
      }
      const fetchURL = new URL(path, base);
      const sortParams = sort[0];

      if (searchQuery) {
        fetchURL.searchParams.set("q", searchQuery);
      }
      fetchURL.searchParams.set("limit", `${pagination.pageSize}`);
      fetchURL.searchParams.set(
        "skip",
        `${pagination.pageIndex * pagination.pageSize}`,
      );

      if (sortParams) {
        fetchURL.searchParams.set("sortBy", `${sortParams.id}`);
        fetchURL.searchParams.set(
          "order",
          `${sortParams.desc ? "desc" : "asc"}`,
        );
      }
      finalFetchURL = fetchURL.href;
      const response = await fetch(finalFetchURL);
      const json = (await response.json()) as ProductsApiResponse;
      return json;
    },
    placeholderData: keepPreviousData,
    staleTime: VIEW_STALE_TIME,
  });
  return {
    products,
    total,
    isError,
    isLoading,
    refetch,
    isRefetching,
  };
}
