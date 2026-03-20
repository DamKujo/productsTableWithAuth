import { Box, Typography, IconButton, Pagination } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

export const customBottomToolbar = ({ table }: { table: any }) => {
  const { pagination } = table.getState();

  const pageIndex = pagination.pageIndex;
  const pageSize = pagination.pageSize;
  const total = table.getRowCount();
  const totalPages = table.getPageCount();

  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, total);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 2,
        py: 1.5,
        backgroundColor: "#fff",
        marginTop: "40px",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Показано {start}-{end} из {total}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/* PAGES */}
        <Pagination
          count={totalPages}
          page={pageIndex + 1}
          onChange={(_, page) => table.setPageIndex(page - 1)}
          shape="rounded"
          size="small"
          siblingCount={1}
          boundaryCount={1}
          sx={{
            "& .MuiPaginationItem-root": {
              borderRadius: "6px",
              minWidth: "32px",
              height: "32px",
              border: "1px solid #eee",
            },
            "& .Mui-selected": {
              backgroundColor: "#3f51b5 !important",
              color: "#fff",
            },
          }}
        />
      </Box>
    </Box>
  );
};
