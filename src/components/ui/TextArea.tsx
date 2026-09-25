import React, { forwardRef } from "react";

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className = "", error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full rounded-md border-2 bg-surface px-3.5 py-2.5 text-sm text-fg transition-colors duration-250 placeholder:text-muted/60 focus:outline-none disabled:cursor-not-allowed disabled:bg-surface-sub disabled:text-muted ${
          error
            ? "border-danger focus:border-danger "
            : "border-line focus:border-accent "
        } ${className}`}
        {...props}
      />
    );
  },
);

TextArea.displayName = "TextArea";

export default TextArea;
