import { cn } from "@/lib/utils";

// Nhãn + control + phụ chú/lỗi — một chỗ duy nhất định dạng mọi field trong form
const FormField = ({
  label,
  htmlFor,
  required,
  hint,
  error,
  className,
  children,
}) => (
  <div className={cn("space-y-1.5", className)}>
    {label && (
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1 text-xs font-bold uppercase tracking-[0.02em] text-navy-700 dark:text-navy-100"
      >
        {label}
        {required && (
          <span className="text-sale" aria-hidden="true">
            *
          </span>
        )}
      </label>
    )}

    {children}

    {error ? (
      <p className="text-[11px] font-semibold text-sale">{error}</p>
    ) : (
      hint && <p className="text-[11px] text-muted-foreground">{hint}</p>
    )}
  </div>
);

export default FormField;
