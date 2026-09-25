import React, { forwardRef } from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-accent text-white hover:opacity-90 active:scale-[0.99]",
  secondary: "bg-surface-sub text-fg hover:bg-surface-sub/80",
  outline: "border-2 border-line bg-transparent text-fg hover:bg-surface-sub",
  ghost: "bg-transparent text-fg hover:bg-surface-sub",
  danger: "bg-danger text-white hover:opacity-90",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`inline-grid place-items-center font-medium rounded-sm transition-all duration-200 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-75 disabled:active:scale-100 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {/* Slot 1: Content Asli (Kalau loading, tetap nahan lebar tombol tapi tak terlihat) */}
        <span
          className={`col-start-1 row-start-1 flex items-center justify-center gap-2 transition-opacity duration-150 ${
            loading ? "invisible opacity-0" : "visible opacity-100"
          }`}
        >
          {children}
        </span>

        {/* Slot 2: Spinner Loading (Numpuk di tengah persis tanpa ngubah ukuran tombol) */}
        {loading && (
          <span className="col-start-1 row-start-1 flex items-center justify-center">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
