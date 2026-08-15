import Image from "next/image";

type SkinovaLogoProps = {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  subtitle?: string;
  className?: string;
};

const sizeMap = {
  sm: { box: 36, image: 28, text: "text-base", sub: "text-[11px]" },
  md: { box: 44, image: 36, text: "text-lg", sub: "text-xs" },
  lg: { box: 56, image: 48, text: "text-xl", sub: "text-sm" }
} as const;

export function SkinovaLogo({
  size = "md",
  showWordmark = true,
  subtitle,
  className = ""
}: SkinovaLogoProps) {
  const dimensions = sizeMap[size];

  return (
    <span className={`inline-flex min-w-0 items-center gap-3 ${className}`}>
      <span
        className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0a1528] ring-1 ring-cyan-300/25"
        style={{ width: dimensions.box, height: dimensions.box }}
      >
        <Image
          src="/brand/logo-circle.png"
          alt="Skinova logo"
          width={dimensions.image}
          height={dimensions.image}
          className="rounded-full object-cover"
          priority={size !== "sm"}
        />
      </span>
      {showWordmark ? (
        <span className="min-w-0">
          <span className={`block font-semibold tracking-normal text-white ${dimensions.text}`}>Skinova</span>
          {subtitle ? <span className={`block truncate text-slate-400 ${dimensions.sub}`}>{subtitle}</span> : null}
        </span>
      ) : null}
    </span>
  );
}
