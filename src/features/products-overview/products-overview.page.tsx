import ItemsTable from "@/features/products-overview/ui/items-table";
import SearchBar from "@/features/products-overview/ui/search-input";
import { GeneralLayout } from "@/shared/layout/general-layout";
import { useLocalStorage } from "@/services/use-local-storage";
import { MRT_PaginationState, MRT_SortingState } from "material-react-table";
import { useDeferredValue } from "react";
import { useProductOverview } from "./model/use-product-overview";

export default function ProductsOverview() {
  const [searchQuery, setSearchQuery] = useLocalStorage<string>(
    "searchQuery",
    "",
  );
  const [sorting, setSorting] = useLocalStorage<MRT_SortingState>(
    "sorting",
    [],
  );
  const [pagination, setPagination] = useLocalStorage<MRT_PaginationState>(
    "pagination",
    {
      pageIndex: 0,
      pageSize: 5,
    },
  );

  const productsList = useProductOverview({
    sort: sorting,
    pagination: pagination,
    searchQuery: useDeferredValue(searchQuery),
  });
  return (
    <GeneralLayout>
      <div className="flex h-screen flex-col items-center justify-center gap-8">
        <div className="flex w-full justify-between bg-white p-8">
          <h1 className="text-3xl font-bold">Товары</h1>
          <div className="w-[70%] mb-6">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Поиск по названию, вендору или категории..."
            />
          </div>
        </div>
        <ItemsTable
          items={productsList.products}
          total={productsList.total ? productsList.total : 0}
          pagination={pagination}
          setPagination={setPagination}
          isRefetching={productsList.isRefetching}
          isLoading={productsList.isLoading}
          refetch={productsList.refetch}
          isError={productsList.isError}
          setSorting={setSorting}
          sorting={sorting}
        />
      </div>
    </GeneralLayout>
  );
}
