import { useMemo } from "react";
import { Inbox } from "lucide-react";
import DataTable from "../../ui/data-table";
import { getRequestColumns } from "./requestColumns";

// Bảng yêu cầu bảo hành: DataTable cấu hình, không selection (reply là thao tác từng yêu cầu)
const RequestTable = ({
  requests = [],
  loading = false,
  searchTerm = "",
  stateFilter = "",
  sort,
  onSortChange,
  onReply,
  pagination,
}) => {
  const columns = useMemo(() => getRequestColumns({ onReply }), [onReply]);

  return (
    <DataTable
      columns={columns}
      data={requests}
      loading={loading}
      emptyMessage={
        searchTerm || stateFilter
          ? "Không có yêu cầu bảo hành nào khớp bộ lọc"
          : "Chưa có yêu cầu bảo hành nào cần xử lý"
      }
      emptyIcon={Inbox}
      pagination={pagination}
      sort={sort}
      onSortChange={onSortChange}
    />
  );
};

export default RequestTable;
