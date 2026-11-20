import { Component } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

export default class AppErrorBoundary extends Component {
    state = { failed: false };
    static getDerivedStateFromError() { return { failed: true }; }
    componentDidCatch(error) { console.error('Không tải được giao diện:', error); }
    render() {
        if (!this.state.failed) return this.props.children;
        return <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center text-foreground"><RefreshCw size={32} aria-hidden="true" /><h1 className="text-xl font-semibold">Chưa tải được giao diện</h1><p className="max-w-md text-sm leading-relaxed text-muted-foreground">Kết nối hoặc phiên bản trang vừa thay đổi. Vui lòng tải lại để tiếp tục.</p><Button onClick={() => window.location.reload()}>Tải lại trang</Button></main>;
    }
}
