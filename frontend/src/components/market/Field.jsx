import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/** Ô form chuẩn: label đổi navy khi focus, icon đầu vào, message lỗi. */
export function Field({ id, label, error, className, ...props }) {
    return (
        <div className={cn('group/field peer space-y-1.5', className)}>
            <Label
                htmlFor={id}
                className="text-xs font-medium text-muted-foreground transition-colors group-focus-within/field:text-navy-600"
            >
                {label}
                {props.required && <span className="ml-0.5 text-sale">*</span>}
            </Label>
            <Input id={id} name={id} error={error} {...props} />
            {error && <p className="text-xs text-sale">{error}</p>}
        </div>
    );
}

/** Trường mật khẩu có nút hiện/ẩn, dùng chung cho login · register · reset. */
export function PasswordField({ show, onToggle, ...props }) {
    return (
        <div className="relative">
            <Field type={show ? 'text' : 'password'} {...props} />
            <button
                type="button"
                onClick={onToggle}
                aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                className="absolute right-3 top-[34px] text-muted-foreground transition-colors hover:text-navy-600"
            >
                {show ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
            </button>
        </div>
    );
}
