import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CircleAlert, Info, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import warrantyApi from "@/api/warranty.api";
import { WARRANTY_STATE } from "@/constants/warrantyStatus";
import { warrantyRequestBlockReason } from "@/utils/warrantyRequest";
import NoticeCard from "@/components/client/NoticeCard";
import WarrantyRequestDialog from "@/components/client/warranty/WarrantyRequestDialog";
import WarrantyRequestTimeline from "@/components/client/warranty/WarrantyRequestTimeline";
import WarrantyStateBadge from "@/components/client/warranty/WarrantyStateBadge";
import WarrantySummaryCard from "@/components/client/warranty/WarrantySummaryCard";

const PageSpinner = () => (
  <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-navy-600 border-t-transparent" />
    <p className="text-xs font-semibold uppercase tracking-[0.02em] text-muted-foreground">
      Đang tải phiếu bảo hành…
    </p>
  </div>
);

const WarrantyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [warranty, setWarranty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchWarranty = useCallback(async () => {
    setLoading(true);
    try {
      const data = await warrantyApi.getMyOne(id);
      setWarranty(data.warranty);
      setError(null);
    } catch (err) {
      const message = err?.message || "Không tải được phiếu bảo hành";
      setWarranty(null);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchWarranty();
  }, [fetchWarranty]);

  const handleSubmitRequest = async (issue) => {
    setSubmitting(true);
    try {
      const data = await warrantyApi.createRequest(id, issue);
      toast.success(data.message);
      setDialogOpen(false);
      await fetchWarranty();
    } catch (err) {
      toast.error(err?.message || "Không gửi được yêu cầu bảo hành");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageSpinner />;

  if (error || !warranty) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <NoticeCard
          icon={CircleAlert}
          tone="error"
          title="Không tìm thấy phiếu bảo hành"
          description={error || "Phiếu không tồn tại hoặc không thuộc tài khoản của bạn."}
        >
          <Button variant="outline" onClick={() => navigate("/warranties")}>
            Quay lại danh sách phiếu
          </Button>
        </NoticeCard>
      </div>
    );
  }

  const blockReason = warrantyRequestBlockReason(warranty);
  const StateIcon = WARRANTY_STATE[warranty.state]?.icon;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Link
            to="/warranties"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-navy-600 transition-colors hover:text-navy-800"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            Phiếu bảo hành của bạn
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            {StateIcon && (
              <StateIcon className="h-5 w-5 text-navy-600 dark:text-navy-100" strokeWidth={2} />
            )}
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {warranty.product_name || "Đồng hồ"}
            </h1>
            <WarrantyStateBadge state={warranty.state} />
          </div>
          <p className="font-mono text-[12px] tabular-nums text-muted-foreground">{warranty.code}</p>
        </div>

        <div className="space-y-2 text-right">
          <Button onClick={() => setDialogOpen(true)} disabled={Boolean(blockReason)} className="gap-2">
            <MessageSquarePlus className="h-4 w-4" strokeWidth={2} />
            Gửi yêu cầu bảo hành
          </Button>
          {blockReason && (
            <p className="flex items-start justify-end gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2} />
              {blockReason}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <WarrantySummaryCard warranty={warranty} />
        </div>
        <div className="lg:col-span-3">
          <WarrantyRequestTimeline requests={warranty.requests ?? []} />
        </div>
      </div>

      {dialogOpen && (
        <WarrantyRequestDialog
          open
          onOpenChange={setDialogOpen}
          submitting={submitting}
          onSubmit={handleSubmitRequest}
        />
      )}
    </div>
  );
};

export default WarrantyDetailPage;
