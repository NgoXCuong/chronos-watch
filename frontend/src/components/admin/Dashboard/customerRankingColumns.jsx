import { CustomerIdentityCell, CustomerQuantityCell, CustomerRankCell, CustomerSpentCell } from './CustomerRankingCells';

// Xếp hạng toàn bộ dữ liệu tại server, không sort lại năm khách đang hiển thị.
export const getCustomerRankingColumns = () => [
    { id: 'rank', header: 'Hạng', width: '80px', cell: ({ index }) => <CustomerRankCell rank={index + 1} /> },
    { id: 'customer', header: 'Khách hàng', width: '360px', cell: ({ row }) => <CustomerIdentityCell customer={row} /> },
    { id: 'product_quantity', header: 'Sản phẩm đã mua', width: '180px', align: 'right', cell: ({ row }) => <CustomerQuantityCell quantity={Number(row.product_quantity) || 0} /> },
    { id: 'order_count', header: 'Đơn đã giao', width: '160px', align: 'right', cell: ({ row }) => <span className="tabular-nums">{Number(row.order_count).toLocaleString('vi-VN')}</span> },
    { id: 'total_spent', header: 'Tổng chi tiêu', width: '200px', align: 'right', cell: ({ row }) => <CustomerSpentCell total={row.total_spent} /> },
];
