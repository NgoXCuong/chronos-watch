import { useEffect, useState } from 'react';
import { Gift, Users } from 'lucide-react';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from '../../ui/sheet';
import { Button } from '../../ui/button';
import DataTable from '../../ui/data-table';
import SearchBanner from '../Common/SearchBanner';
import SelectionActions from '../Common/SelectionActions';
import useDebounce from '../../../hooks/useDebounce';
import useBulkSelection from '../../../hooks/useBulkSelection';
import adminApi from '../../../api/admin.api';
import voucherApi from '../../../api/voucher.api';
import { getVoucherRecipientColumns } from './voucherRecipientColumns';

const columns = getVoucherRecipientColumns();
function GiftBody({ voucher, onClose }) {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [attempt, setAttempt] = useState(0);
    const [result, setResult] = useState(null);
    const keyword = useDebounce(search, 350);
    const key = `${keyword}:${page}:${attempt}`;
    useEffect(() => {
        let alive = true;
        adminApi.getAllUsers({ search: keyword, role: 'customer', status: 'active', page, limit: 10 }).then((data) => alive && setResult({ key, rows: data.rows || [], count: data.count || 0 }))
            .catch(() => alive && setResult({ key, rows: [], count: 0, failed: true }));
        return () => { alive = false; };
    }, [key, keyword, page]);
    const loading = result?.key !== key;
    const rows = loading ? [] : result.rows;
    const bulk = useBulkSelection({ rows, label: 'khách hàng', onDone: onClose });
    return <>
        <header className="flex justify-between gap-3 border-b border-border p-5"><div><SheetTitle>Tặng voucher {voucher.code}</SheetTitle><SheetDescription className="mt-2">Chọn khách đang hoạt động trên trang hiện tại. Khách đã nhận mã sẽ được bỏ qua, không gửi thông báo lặp.</SheetDescription></div><SheetClose /></header>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-5">
            <SearchBanner searchTerm={search} setSearchTerm={(value) => { setSearch(value); setPage(1); }} placeholder="Tìm khách theo tên hoặc email…" count={result?.count || 0} countLabel="khách hàng" loading={loading} onRefresh={() => setAttempt((v) => v + 1)} />
            {result?.failed && <p role="alert" className="text-sm text-destructive">Chưa tải được khách hàng. Vui lòng bấm tải lại.</p>}
            <DataTable columns={columns} data={rows} loading={loading} selectable selectedRowKeys={bulk.selectedIds} onSelectionChange={bulk.setSelectedIds} selectionActions={<SelectionActions busy={bulk.busy} actions={[{ key: 'gift', label: 'Tặng voucher cho khách đã chọn', icon: <Gift size={14} />, variant: 'default', onClick: () => bulk.run((ids) => voucherApi.gift(voucher.id, ids)) }]} />} emptyIcon={Users} emptyMessage="Không có khách phù hợp" pagination={{ currentPage: page, totalPages: Math.ceil((result?.count || 0) / 10), totalCount: result?.count || 0, onPageChange: setPage, countLabel: 'khách hàng' }} />
            <p className="text-xs leading-relaxed text-muted-foreground">Khách nhận thông báo trong tài khoản và thấy mã trong “Voucher của tôi”. Chỉ tài khoản được nhận mới dùng được; hạn dùng, tổng lượt và giới hạn mỗi người vẫn giữ nguyên.</p>
        </div>
        <footer className="flex flex-wrap justify-end gap-2 border-t border-border p-5"><Button variant="outline" onClick={onClose} disabled={bulk.busy}>Đóng</Button></footer>
    </>;
}

export default function VoucherGiftDialog({ voucher, onClose }) {
    return <Sheet open={Boolean(voucher)} onOpenChange={(open) => { if (!open) onClose(); }}><SheetContent className="max-w-3xl">{voucher && <GiftBody key={voucher.id} voucher={voucher} onClose={onClose} />}</SheetContent></Sheet>;
}
