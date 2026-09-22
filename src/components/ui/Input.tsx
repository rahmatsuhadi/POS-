import React, { forwardRef } from "react";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = "", error, ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={`w-full rounded-sm border-2 bg-surface px-3.5 py-2.5 text-sm text-fg transition-colors duration-250 placeholder:text-muted/60 focus:outline-none disabled:cursor-not-allowed disabled:bg-surface-sub disabled:text-muted ${error
                    ? "border-danger focus:border-danger "
                    : "border-line focus:border-accent "
                    } ${className}`}
                {...props}
            />
        );
    }
);

Input.displayName = "Input";

export default Input;