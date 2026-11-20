import { useEffect, useState } from 'react';
import voucherApi from '../api/voucher.api';
import { useAuth } from './useAuth';

export default function usePublicVouchers(total, scope = 'public') {
    const { user, isAuthenticated } = useAuth();
    const [attempt, setAttempt] = useState(0);
    const [result, setResult] = useState(null);
    const key = `${scope}:${total ?? 'catalog'}:${isAuthenticated ? user?.id : 'guest'}:${attempt}`;
    useEffect(() => {
        let alive = true;
        const load = scope === 'mine' ? voucherApi.getMine : scope === 'available' ? voucherApi.getAvailable : voucherApi.getPublic;
        load(total).then((data) => alive && setResult({ key, items: data.items || [], failed: false }))
            .catch(() => alive && setResult({ key, items: [], failed: true }));
        return () => { alive = false; };
    }, [key, total, scope]);
    return { items: result?.key === key ? result.items : [], loading: result?.key !== key, failed: result?.key === key && result.failed, reload: () => setAttempt((v) => v + 1) };
}
