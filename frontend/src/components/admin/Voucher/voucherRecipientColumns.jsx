export const getVoucherRecipientColumns = () => [
    { id: 'name', header: 'Khách hàng', width: '260px', cell: ({ row }) => <div><p className="font-semibold">{row.full_name || row.username}</p><p className="text-xs text-muted-foreground">@{row.username}</p></div> },
    { id: 'email', header: 'Email', width: '280px', cell: ({ row }) => <span className="break-all text-sm">{row.email}</span> },
];
