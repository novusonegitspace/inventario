import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { cn } from "@/src/shared/lib/cn";

const variantClasses = {
  primary:
    "bg-emerald-400 text-slate-950 shadow-[0_18px_50px_rgba(74,222,128,0.35)] hover:bg-emerald-300",
  secondary:
    "border border-white/10 bg-white/8 text-white hover:border-emerald-300/30 hover:bg-white/12",
  ghost: "text-white/72 hover:bg-white/6 hover:text-white",
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
      "inline-flex items-center justify-center rounded-full font-semibold transition duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
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
    "inline-flex items-center justify-center rounded-full font-semibold transition duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
    "disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-white/10 disabled:hover:bg-white/8 disabled:hover:text-white",
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
