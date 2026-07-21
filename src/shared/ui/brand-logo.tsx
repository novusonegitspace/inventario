import Image from "next/image";
import Link from "next/link";

import { cn } from "@/src/shared/lib/cn";

export function BrandLogo({
  href = "/",
  alt = "NovusOne AssetLens",
  className,
  imageClassName,
  size = "default",
}: {
  href?: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  size?: "default" | "large";
}) {
  const containerSize =
    size === "large" ? "h-[88px] w-[302px]" : "h-[72px] w-[248px]";

  return (
    <Link
      href={href}
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden rounded-[20px] bg-white/95",
        containerSize,
        className,
      )}
    >
      <Image
        alt={alt}
        className={cn("scale-[1.35] object-contain object-center", imageClassName)}
        fill
        priority
        sizes={size === "large" ? "302px" : "248px"}
        src="/logo.png"
      />
      <span className="sr-only">{alt}</span>
    </Link>
  );
}
