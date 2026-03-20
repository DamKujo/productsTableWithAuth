import { useMemo, memo } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from "material-react-table";
import { Product } from "@/shared/types/index.type";
import { Button } from "@/shared/ui/button";
import { customBottomToolbar } from "./custom-bottom-toolbar";
import { Ellipsis, Plus } from "lucide-react";
import { AddNewItem } from "./add-new-item";

type ItemsTableProps = {
  items: Product[];
  total: number;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  setPagination: (value: { pageIndex: number; pageSize: number }) => void;
  sorting: any;
  setSorting: React.Dispatch<React.SetStateAction<any>>;
  isRefetching?: boolean;
  isLoading?: boolean;
  refetch?: () => void;
  isError?: boolean;
};

type TableProduct = Pick<
  Product,
  "title" | "id" | "price" | "brand" | "category" | "images" | "rating" | "sku"
>;

type ColumnProduct = Product;

const ItemsTable = memo(
  ({
    items,
    total,
    pagination,
    setPagination,
    isRefetching,
    isLoading,
    refetch,
    isError,
    sorting,
    setSorting,
  }: ItemsTableProps) => {
    const columns: MRT_ColumnDef<ColumnProduct>[] = useMemo(
      () => [
        {
          accessorFn: (row) => row.title,
          id: "title",
          header: "Наименование",
          Header: <p style={{ color: "#B2B3B9" }}>Наименование</p>,
          Cell: ({ cell }) => (
            <div className="flex items-center gap-3">
              <div className="rounded-lg w-12 h-12 bg-gray-100 flex items-center justify-center">
                <img
                  src={cell.row.original.images[0]}
                  className="w-full"
                  alt="itemsIcon"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <p style={{ fontWeight: "bolder" }}>
                  {cell.getValue<string>()}
                </p>
                <p style={{ color: "#B2B3B9" }}>{cell.row.original.category}</p>
              </div>
            </div>
          ),
        },
        {
          accessorFn: (row) => row.brand,
          id: "brand",
          header: "Вендор",
          Header: <p style={{ color: "#B2B3B9" }}>Вендор</p>,
          Cell: ({ cell }) => (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <p style={{ fontWeight: "bolder" }}>{cell.getValue<string>()}</p>
            </div>
          ),
        },
        {
          accessorFn: (row) => row.sku,
          id: "sku",
          header: "Article",
          Header: <p style={{ color: "#B2B3B9" }}>Артикл</p>,
        },
        {
          accessorFn: (row) => row.rating,
          id: "rating",
          header: "Rating",
          Header: <p style={{ color: "#B2B3B9" }}>Оценка</p>,
          Cell: ({ cell }) => (
            <div className="flex items-center gap-1">
              <p
                className={
                  cell.getValue<number>() < 3.5 ? "text-red-700" : "text-black"
                }
              >
                {cell.getValue<number>()}
              </p>
            </div>
          ),
        },
        {
          accessorFn: (row) => row.price,
          id: "price",
          header: "Price",
          Header: <p style={{ color: "#B2B3B9" }}>Цена</p>,
        },
        {
          accessorFn: (row) => row.category,
          id: "managedColumn",
          header: "managedColumn",
          Header: <p style={{ color: "#B2B3B9" }}></p>,
          Cell: ({ cell }) => (
            <div className="flex gap-8">
              <Button
                variant="default"
                size="icon"
                className="bg-blue-700 w-13 rounded-3xl cursor-pointer"
              >
                <Plus color="white" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full cursor-pointer"
              >
                <Ellipsis />
              </Button>
            </div>
          ),
        },
      ],
      [],
    );

    const data = useMemo<TableProduct[]>(() => {
      return items.map((item) => ({
        id: item.id,
        title: item.title,
        brand: item.brand,
        sku: item.sku,
        rating: item.rating,
        price: item.price,
        category: item.category,
        images: item.images,
      }));
    }, [items]);

    const table = useMaterialReactTable({
      data: data as ColumnProduct[],
      columns: columns as MRT_ColumnDef<ColumnProduct>[],
      enableRowSelection: true,
      initialState: {
        showGlobalFilter: false,
      },
      state: {
        pagination,
        sorting,
        isLoading,
        showProgressBars: isRefetching,
        showAlertBanner: isError,
      },
      rowCount: total,
      manualPagination: true,
      onPaginationChange: setPagination as any,
      onSortingChange: setSorting,
      renderTopToolbar: () => (
        <div className="flex justify-between p-7 mb-2.5">
          <h1 className="font-bold text-2xl">Все позиции</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer"
              onClick={() => refetch!()}
            >
              <img src="./src/app/assets/refresh.svg" alt="refresh" />
            </Button>
            <AddNewItem />
          </div>
        </div>
      ),
      renderBottomToolbar: ({ table }) => customBottomToolbar({ table }),
      enableBottomToolbar: true,
      muiPaginationProps: { rowsPerPageOptions: [] },
      muiTableHeadRowProps: {
        style: {
          height: "73px",
        },
      },
      muiTableBodyRowProps: {
        style: {
          height: "73px",
        },
      },
      muiTablePaperProps: {
        style: {
          width: "100%",
          height: "80%",
          padding: "30px",
        },
      },
    });
    return <MaterialReactTable table={table} />;
  },
);

export default ItemsTable;
