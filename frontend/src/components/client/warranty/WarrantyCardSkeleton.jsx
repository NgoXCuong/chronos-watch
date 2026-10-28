// Card giả trong lúc chờ API — khung xương theo đúng block của WarrantyCard
const WarrantyCardSkeleton = () => (
  <div className="animate-pulse space-y-3 rounded-xl bg-card p-4 ring-1 ring-border">
    <div className="flex items-start justify-between gap-2">
      <div className="h-4 w-2/3 rounded bg-muted" />
      <div className="h-5 w-20 rounded bg-muted" />
    </div>
    <div className="space-y-1.5">
      <div className="h-3 w-1/2 rounded bg-muted" />
      <div className="h-3 w-1/3 rounded bg-muted" />
    </div>
    <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted/60 px-3 py-2">
      <div className="h-7 rounded bg-muted" />
      <div className="h-7 rounded bg-muted" />
      <div className="h-7 rounded bg-muted" />
    </div>
    <div className="h-1.5 w-full rounded-full bg-muted" />
  </div>
);

export default WarrantyCardSkeleton;
