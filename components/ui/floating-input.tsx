// components/ui/FloatingInput.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelClassName?: string;
  isLabelBorder?: boolean;
  error?: string;
  inputHeight?: string;
  suffix?: React.ReactNode;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  (
    {
      className,
      label,
      labelClassName,
      isLabelBorder = true,
      error,
      type = "text",
      inputHeight = "h-14",
      suffix,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(!!props.value || !!props.defaultValue);

    React.useEffect(() => {
      if (props.value !== undefined) {
        setHasValue(!!props.value);
      }
    }, [props.value]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value !== "");
      props.onBlur?.(e);
    };

    const isActive = isFocused || hasValue;

    return (
      <div className="w-full">
        <div className="relative w-full">
         <input
            ref={ref}
            type={type}
            className={cn(
              "peer w-full bg-transparent outline-none transition-all duration-200",
              inputHeight,
              "px-4 text-base leading-none",
              "py-0",
              isLabelBorder
                ? cn(
                    "rounded-lg border border-input",
                    "focus:border-primary focus:ring-4 focus:ring-primary/10"
                  )
                : cn(
                    "border-b-2 border-x-0 border-t-0 border-input",
                    "focus:border-primary"
                  ),
              error &&
                (isLabelBorder
                  ? "border-destructive focus:border-destructive focus:ring-4 focus:ring-destructive/10"
                  : "border-destructive focus:border-destructive"),
              "disabled:pointer-events-none disabled:opacity-50",
              className
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder=" "
            aria-describedby={error && props.id ? `${props.id}-error` : undefined}
            {...(error ? { "aria-invalid": "true" as const } : {})} 
            {...props}
          />

          {/* Floating Label */}
          <label
            className={cn(
              "absolute left-4 pointer-events-none transition-all duration-200 ease-out",
              "text-muted-foreground select-none",
              !isActive && cn("top-1/2 -translate-y-1/2 text-base"),
              isActive &&
                (isLabelBorder
                  ? cn(
                      "top-0 -translate-y-1/2 text-xs font-medium px-1.5 bg-background",
                      isLabelBorder && "peer-focus:text-primary"
                    )
                  : cn("top-2 text-xs font-medium")),
              isFocused && !error && "text-primary",
              error && "text-destructive",
              !isActive && !error && labelClassName
            )}
          >
            {label}
          </label>

          {/* Suffix (e.g. eye icon) */}
          {suffix && (
            <div className="absolute right-0 top-0 h-full flex items-center">
              {suffix}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p
            id={`${props.id}-error`}          // ✅ Matches aria-describedby above
            className="mt-1.5 text-xs text-destructive leading-tight px-1"
            role="alert"                       // ✅ Announces to screen readers immediately
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

export { FloatingInput };