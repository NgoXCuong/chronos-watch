import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PackageCheck, PackageX, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import productApi from "../../../api/product.api";
import brandApi from "../../../api/brand.api";
import categoryApi from "../../../api/category.api";
import useDebounce from "../../../hooks/useDebounce";
import useBulkSelection from "../../../hooks/useBulkSelection";
import AdminHeader from "../../../components/admin/Common/AdminHeader";
import SearchBanner from "../../../components/admin/Common/SearchBanner";
import SelectionActions from "../../../components/admin/Common/SelectionActions";
import FilterSelect from "../../../components/admin/Common/FilterSelect";
import ProductTable from "../../../components/admin/Product/ProductTable";
import {
  PRODUCT_STATUS,
  PRODUCT_STATUS_KEYS,
} from "../../../constants/productStatus";

const PAGE_SIZE = 10;
const DEFAULT_SORT = { key: "created_at", dir: "desc" };
const BULK_ICON = "h-3.5 w-3.5";

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  ...PRODUCT_STATUS_KEYS.map((key) => ({
    value: key,
    label: PRODUCT_STATUS[key].label,
    dot: PRODUCT_STATUS[key].dot,
  })),
];

// /brands trả {count, rows}, /categories trả mảng trần — chuẩn hoá về mảng
const toRows = (res) => (Array.isArray(res) ? res : res?.rows || []);

const toOptions = (rows, allLabel) => [
  { value: "", label: allLabel },
  ...rows.map((row) => ({ value: String(row.id), label: row.name })),
];

const ProductListPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const debouncedSearch = useDebounce(searchTerm, 400);
  const isFirstQuery = useRef(true);

  const brandOptions = useMemo(
    () => toOptions(brands, "Tất cả thương hiệu"),
    [brands],
  );
  const categoryOptions = useMemo(
    () => toOptions(categories, "Tất cả danh mục"),
    [categories],
  );

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productApi.getAdminAll({
        search: debouncedSearch,
        brand_id: brandId,
        category_id: categoryId,
        status: statusFilter,
        page: currentPage,
        limit: PAGE_SIZE,
        sort: sort.key,
        dir: sort.dir,
      });
      setProducts(data.rows || []);
      setCount(data.count || 0);
    } catch {
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterData = async () => {
    try {
      const [brandRes, categoryRes] = await Promise.all([
        brandApi.getAll({ limit: 100 }),
        categoryApi.getAll({ limit: 100 }),
      ]);
      setBrands(toRows(brandRes));
      setCategories(toRows(categoryRes));
    } catch {
      toast.error("Không thể tải dữ liệu lọc");
    }
  };

  useEffect(() => {
    fetchFilterData();
  }, []);

  useEffect(() => {
    if (isFirstQuery.current) {
      isFirstQuery.current = false;
      return;
    }
    setCurrentPage(1);
  }, [debouncedSearch, brandId, categoryId, statusFilter, sort]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, debouncedSearch, brandId, categoryId, statusFilter, sort]);

  const handleDelete = async (product) => {
    if (!window.confirm(`Xóa sản phẩm "${product.name}"?`)) return;
    try {
      await productApi.delete(product.id);
      toast.success("Đã xóa sản phẩm");
      fetchProducts();
    } catch {
      toast.error("Không thể xóa sản phẩm");
    }
  };

  const bulk = useBulkSelection({
    rows: products,
    label: "sản phẩm",
    onDone: fetchProducts,
  });

  // Sản phẩm không xóa hẳn khỏi CSDL (đơn hàng cũ còn tham chiếu) →
  // hàng loạt chỉ đổi trạng thái bán, đúng semantics của nút xóa đơn lẻ
  const bulkActions = [
    {
      key: "on",
      label: "Mở bán",
      icon: <PackageCheck className={BULK_ICON} strokeWidth={2} />,
      onClick: () =>
        bulk.run((ids) => productApi.bulkUpdateStatus(ids, "active")),
    },
    {
      key: "off",
      label: "Ngừng bán",
      variant: "destructive",
      icon: <PackageX className={BULK_ICON} strokeWidth={2} />,
      onClick: () =>
        bulk.run(
          (ids) => productApi.bulkUpdateStatus(ids, "inactive"),
          `Ngừng bán ${bulk.selectedIds.length} sản phẩm? Khách sẽ không còn mua được các mã này.`,
        ),
    },
  ];

  const hasFilter = Boolean(brandId || categoryId || statusFilter);

  return (
    <div className="space-y-3 pb-8">
      <AdminHeader
        title="Quản lý sản phẩm"
        subtitle="Danh sách và thông tin chi tiết các mẫu đồng hồ"
        actions={
          <Button
            onClick={() => navigate("/admin/products/create")}
            className="h-9 gap-2 rounded-lg px-4 text-[13px] font-semibold"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Thêm sản phẩm mới
          </Button>
        }
      />

      <SearchBanner
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Tìm theo tên hoặc mã SKU..."
        onRefresh={fetchProducts}
        loading={loading}
        count={count}
        countLabel="sản phẩm"
      >
        <FilterSelect
          label="Danh mục"
          value={categoryId}
          onChange={setCategoryId}
          options={categoryOptions}
        />
        <FilterSelect
          label="Thương hiệu"
          value={brandId}
          onChange={setBrandId}
          options={brandOptions}
        />
        <FilterSelect
          label="Trạng thái"
          value={statusFilter}
          onChange={setStatusFilter}
          options={STATUS_OPTIONS}
        />
        {hasFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setBrandId("");
              setCategoryId("");
              setStatusFilter("");
            }}
            className="h-10 px-3 text-[13px] font-semibold text-muted-foreground hover:text-sale"
          >
            Xóa lọc
          </Button>
        )}
      </SearchBanner>

      <ProductTable
        products={products}
        loading={loading}
        sort={sort}
        onSortChange={setSort}
        selectedRowKeys={bulk.selectedIds}
        onSelectionChange={bulk.setSelectedIds}
        selectionActions={
          <SelectionActions busy={bulk.busy} actions={bulkActions} />
        }
        onView={(slug) => window.open(`/products/${slug}`, "_blank")}
        onEdit={(id) => navigate(`/admin/products/edit/${id}`)}
        onDelete={handleDelete}
        pagination={{
          currentPage,
          totalPages: Math.ceil(count / PAGE_SIZE),
          totalCount: count,
          countLabel: "sản phẩm",
          onPageChange: (page) => setCurrentPage(page),
        }}
      />
    </div>
  );
};

export default ProductListPage;
