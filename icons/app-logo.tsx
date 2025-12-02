interface ApplivantLogoProps {
  width?: number;
  height?: number;
}

export function ApplivantLogo({ width = 32, height = 32 }: ApplivantLogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gradUnified" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop
            offset="0%"
            style={{
              stopColor: "#5048e5",
              stopOpacity: 1,
            }}
          />
          <stop
            offset="100%"
            style={{
              stopColor: "#7d77f0",
              stopOpacity: 1,
            }}
          />
        </linearGradient>
      </defs>
      <path
        d="M256,471.52 L246.56,466.75 C237.12,461.98 147.52,406.75 137.92,400.18 C67.05,354.45 45.33,133.65 42.67,108.58 L40.96,89.92 L256,42.17 L471.04,89.92 L469.33,108.58 C467.04,133.4 445.33,354.2 374.4,400.18 C364.46,407.18 274.88,461.98 265.44,466.75 Z M87.15,123.19 C96.92,210.15 132.87,336.51 159.85,362.41 C203.93,391.81 237.65,410.91 256,421.01 C274.26,410.91 308.15,391.81 352.15,362.41 C379.13,336.51 415.08,210.15 424.85,123.19 L256,85.84 Z"
        fill="url(#gradUnified)"
      />
      <path
        d="M256,80 L400,440 L340,440 L315,360 L197,360 L172,440 L112,440 L256,80 Z M220,310 L292,310 L256,180 Z"
        fill="url(#gradUnified)"
      />
    </svg>
  );
}
