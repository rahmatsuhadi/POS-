import Image from "next/image";
import type { ComponentProps } from "react";

export interface BrandLogoProps extends ComponentProps<"div"> {
  size?: number;
  imageClassName?: string;
}

export function BrandLogo({
  className = "",
  size = 25,
  imageClassName = "",
  ...props
}: BrandLogoProps) {
  return (
    <div
      className={`bg-fg grid h-10 w-10 shrink-0 place-items-center rounded-sm ${className}`}
      {...props}
    >
      <Image
        src="/logo-light.svg"
        width={size}
        height={size}
        alt="logo"
        className={imageClassName}
      />
    </div>
  );
}

