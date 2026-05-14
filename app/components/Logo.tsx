import Image from "next/image";

// 1. Added textColor as an optional property to the type
type LogoProps = { 
  size?: number; 
  textColor?: string; 
};

// 2. Defaulted textColor to your original variable so it doesn't break elsewhere
export function Logo({ size = 32, textColor = "var(--ink-1)" }: LogoProps) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10, color: textColor }}>
      <Image
        src="/logo.png"
        alt="WelloWork Logo"
        width={size}
        height={size}
        priority
        style={{ display: "block", width: size, height: size, objectFit: "contain" }}
      />
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 19,
          letterSpacing: "-0.02em",
          color: "currentColor", // This will now automatically follow the textColor prop
        }}
      >
        WelloWork
      </span>
    </span>
  );
}