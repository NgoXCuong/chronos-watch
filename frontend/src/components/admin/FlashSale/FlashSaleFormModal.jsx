import { useEffect, useState } from "react";
import { Save, Zap } from "lucide-react";
import { toast } from "sonner";
import flashSaleApi from "../../../api/flashSale.api";
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import FormField from "../Common/FormField";
import FormSelect from "../Common/FormSelect";
import FlashSaleItemsEditor from "./FlashSaleItemsEditor";
import {
  FLASH_ITEM_DEFAULTS,
  FLASH_SALE_MAX,
  STATUS_FILTER_OPTIONS,
} from "../../../constants/flashSale";
import {
  buildFlashSalePayload,
  emptyFlashItem,
  toLocalDateTime,
  validateFlashSale,
} from "../../../utils/flashSaleForm";

// Bỏ lựa chọn "Mọi..." (value "") — status là cột ENUM chỉ nhận active|inactive
const STATUS_OPTIONS = STATUS_FILTER_OPTIONS.filter((option) => option.value);

const EMPTY_FORM = () => ({
  name: "",
  description: "",
  start_date: "",
  end_date: "",
  status: "active",
  items: [{ ...emptyFlashItem(), ...FLASH_ITEM_DEFAULTS }],
});

// Danh sách trang chỉ có cột tổng hợp (không có items) → vào sửa phải nạp
// GET /admin/flash-sales/:id để có từng dòng ưu đãi kèm sold_count.
const detailToForm = (sale) => ({
  name: sale.name || "",
  description: sale.description || "",
  start_date: toLocalDateTime(sale.start_date),
  end_date: toLocalDateTime(sale.end_date),
  status: sale.status || "active",
  items: (sale.items || []).map((item) => ({
    id: item.id,
    product_id: item.product_id,
    name: item.product?.name ?? "",
    image_url: item.product?.image_url ?? "",
    list_price: Number(item.list_price) || 0,
    flash_price: Number(item.flash_price) || "",
    quota: Number(item.quota) || 0,
    sold_count: Number(item.sold_count) || 0,
    per_user_limit: Number(item.per_user_limit) || 0,
  })),
});

const FIELD_KEYS = ["name", "description", "start_date", "end_date"];

// Row từ danh sách đủ cho tên/lịch/status, nhưng KHÔNG có items → để trống mảng,
// detail nạp xuống sẽ thay toàn bộ (tránh chớp "chưa có sản phẩm" khi mới mở).
const formOf = (sale) =>
  sale
    ? {
        name: sale.name || "",
        description: sale.description || "",
        start_date: toLocalDateTime(sale.start_date),
        end_date: toLocalDateTime(sale.end_date),
        status: sale.status || "active",
        items: [],
      }
    : EMPTY_FORM();

// Component riêng để state seed từ props khi mở modal (Dialog unmount lúc đóng)
const FlashSaleFormBody = ({ sale, saving, onSubmit, onClose }) => {
  const [form, setForm] = useState(() => formOf(sale));
  const [errors, setErrors] = useState({});
  const [loadingDetail, setLoadingDetail] = useState(!!sale?.id);

  useEffect(() => {
    if (!sale?.id) return undefined;
    let alive = true;
    // GET /admin/flash-sales/:id trả items (product_id, sold_count, list_price) —
    // chỉ có ở detail, danh sách chỉ có cột tổng hợp
    flashSaleApi
      .getDetail(sale.id)
      .then((data) => {
        if (!alive || !data.flashSale) return;
        setForm(detailToForm(data.flashSale));
      })
      .catch((err) => alive && toast.error(err?.message || "Không tải được đợt Flash Sale"))
      .finally(() => alive && setLoadingDetail(false));
    return () => {
      alive = false;
    };
  }, [sale?.id]);

  const set = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    const next = validateFlashSale(form);
    setErrors(next);
    const hasFieldError = FIELD_KEYS.some((key) => next[key]);
    if (hasFieldError || next.hasItemError || loadingDetail) return;
    onSubmit(buildFlashSalePayload(form));
  };

  return (
    <>
      <DialogHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-navy-600 dark:text-navy-200" strokeWidth={2} />
              {sale ? "Cập nhật đợt Flash Sale" : "Tạo đợt Flash Sale mới"}
            </DialogTitle>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Hai đợt đang bật không được chồng lịch; lưu là thay toàn bộ danh sách
              sản phẩm của đợt.
            </p>
          </div>
          <DialogCloseButton onClick={onClose} />
        </div>
      </DialogHeader>

      <div className="max-h-[68vh] space-y-4 overflow-y-auto p-5">
        {/* Form CHỈ ôm các field tên/lịch/status — trình soạn sản phẩm (có Dialog chọn
            sản phẩm + phân trang) nằm ngoài <form> để không nút nào vô tình submit.
            Nút "Lưu" ở dưới nối với form qua attribute form="flash-sale-form". */}
        <form
          id="flash-sale-form"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <FormField
            label="Tên đợt"
            htmlFor="flash-name"
            required
            className="sm:col-span-2"
            hint={`Tối đa ${FLASH_SALE_MAX.name} ký tự — tên hiển thị trên panel Flash Sale trang chủ.`}
            error={errors.name}
          >
            <Input
              id="flash-name"
              value={form.name}
              maxLength={FLASH_SALE_MAX.name}
              onChange={set("name")}
              placeholder="VD: Flash Sale cuối tuần — đồng hồ cơ"
              error={errors.name}
            />
          </FormField>

          <FormField
            label="Mô tả"
            htmlFor="flash-description"
            className="sm:col-span-2"
            hint={`Để trống được; tối đa ${FLASH_SALE_MAX.description} ký tự.`}
            error={errors.description}
          >
            <Textarea
              id="flash-description"
              rows={3}
              value={form.description}
              maxLength={FLASH_SALE_MAX.description}
              onChange={set("description")}
              placeholder="Câu giới thiệu ngắn hiện dưới tên đợt..."
              error={errors.description}
            />
          </FormField>

          <FormField
            label="Bắt đầu"
            htmlFor="flash-start"
            required
            hint="Theo giờ máy của admin — server lưu mốc tuyệt đối."
            error={errors.start_date}
          >
            <Input
              id="flash-start"
              type="datetime-local"
              value={form.start_date}
              onChange={set("start_date")}
              className="h-11 text-[13px] tabular-nums"
              error={errors.start_date}
            />
          </FormField>

          <FormField
            label="Kết thúc"
            htmlFor="flash-end"
            required
            hint="Qua mốc này đợt chuyển sang 'Hết hạn' và ngừng áp giá Flash."
            error={errors.end_date}
          >
            <Input
              id="flash-end"
              type="datetime-local"
              value={form.end_date}
              onChange={set("end_date")}
              className="h-11 text-[13px] tabular-nums"
              error={errors.end_date}
            />
          </FormField>

          <FormField
            label="Cấu hình"
            htmlFor="flash-status"
            required
            hint="'Đang tắt' = lưu lịch nhưng chưa cho khách mua giá Flash."
          >
            <FormSelect
              id="flash-status"
              value={form.status}
              onChange={(next) => setForm((prev) => ({ ...prev, status: next }))}
              options={STATUS_OPTIONS}
            />
          </FormField>
        </form>

        {loadingDetail ? (
          <p className="rounded-xl border border-border bg-muted/40 px-4 py-10 text-center text-[13px] text-muted-foreground">
            Đang tải danh sách sản phẩm của đợt...
          </p>
        ) : (
          <FlashSaleItemsEditor
            items={form.items}
            errors={errors.items ?? []}
            onChangeItems={(items) => {
              setForm((prev) => ({ ...prev, items }));
              // Mảng lỗi items song song theo index với items: thêm/gỡ dòng là index
              // lệch ngay, nên bỏ hết lỗi dòng và validate lại lúc bấm Lưu.
              setErrors((prev) => (prev.items ? { ...prev, items: [] } : prev));
            }}
          />
        )}

        <DialogFooter className="border-t-0 px-0 pb-0 pt-1">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Hủy
          </Button>
          {/* Nút nằm NGOÀI <form> (form chỉ ôm field) nên phải nối qua form= */}
          <Button
            type="submit"
            form="flash-sale-form"
            loading={saving}
            className="min-w-[150px] gap-1.5"
          >
            {!saving && <Save className="h-4 w-4" strokeWidth={2} />}
            {sale ? "Lưu đợt" : "Tạo đợt"}
          </Button>
        </DialogFooter>
      </div>
    </>
  );
};

const FlashSaleFormModal = ({ open, sale, saving = false, onSubmit, onClose }) => {
  if (!open) return null;

  return (
    <Dialog open onOpenChange={(next) => !next && onClose?.()}>
      <DialogContent className="max-w-4xl">
        <FlashSaleFormBody
          key={sale?.id ?? "new"}
          sale={sale}
          saving={saving}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default FlashSaleFormModal;
