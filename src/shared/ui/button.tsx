import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { cn } from "@/src/shared/lib/cn";

const variantClasses = {
  primary:
    "bg-[#0f988c] text-white shadow-[0_16px_32px_rgba(15,152,140,0.22)] hover:bg-[#087e75]",
  secondary:
    "border border-[#e4e7eb] bg-white text-[#14375a] hover:bg-[#f7f8fa]",
  ghost: "text-[#667085] hover:bg-[#f7f8fa] hover:text-[#14375a]",
} as const;

const sizeClasses = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-sm",
  lg: "h-14 px-7 text-base",
} as const;

type CommonProps = {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  size?: keyof typeof sizeClasses;
  variant?: keyof typeof variantClasses;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  if ("href" in props && props.href) {
    const {
      children,
      className,
      fullWidth = false,
      href,
      size = "md",
      variant = "primary",
      ...anchorProps
    } = props as ButtonAsLink;

    const classes = cn(
      "inline-flex items-center justify-center rounded-lg font-semibold transition duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16b8ac]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
      fullWidth && "w-full",
      sizeClasses[size],
      variantClasses[variant],
      className,
    );

    return (
      <Link className={classes} href={href} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const {
    children,
    className,
    fullWidth = false,
    size = "md",
    type = "button",
    variant = "primary",
    ...buttonProps
  } = props as ButtonAsButton;

  const classes = cn(
    "inline-flex items-center justify-center rounded-lg font-semibold transition duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16b8ac]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
    "disabled:cursor-not-allowed disabled:opacity-45",
    fullWidth && "w-full",
    sizeClasses[size],
    variantClasses[variant],
    className,
  );

  return (
    <button className={classes} type={type} {...buttonProps}>
      {children}
    </button>
  );
}
