import React from "react";

export interface InputLabelProps
    extends React.LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
    children?: React.ReactNode;
}

export const InputLabel: React.FC<InputLabelProps> = ({
    children,
    required,
    className = "",
    ...props
}) => {
    return (
        <label
            className={`text-fg mb-1.5 block text-xs font-semibold ${className}`}
            {...props}
        >
            {children}
            {required && <span className="text-danger ml-0.5">*</span>}
        </label>
    );
};

export default InputLabel;