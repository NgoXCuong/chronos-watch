// Lý do KHÔNG gửi được yêu cầu — mirror validation backend
// (warranty.service.createRequest: void / expired / đang có yêu cầu pending|processing)
// để khách thấy hint ngay trên nút thay vì ăn 400.
const OPEN_REQUEST_STATUSES = ["pending", "processing"];

export const hasOpenWarrantyRequest = (warranty) =>
  (warranty?.requests ?? []).some((request) => OPEN_REQUEST_STATUSES.includes(request.status));

export const warrantyRequestBlockReason = (warranty) => {
  if (!warranty) return "Chưa tải được phiếu bảo hành.";
  const state = warranty.state ?? warranty.status;
  if (state === "void") return "Phiếu này đã bị vô hiệu theo đơn hàng nên không gửi được yêu cầu.";
  if (state === "expired") return "Phiếu đã hết hạn bảo hành.";
  if (hasOpenWarrantyRequest(warranty)) return "Phiếu đang có yêu cầu chưa xử lý xong.";
  return null;
};
