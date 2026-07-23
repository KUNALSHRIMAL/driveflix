interface LoadingIndicatorProps {
  label: string;
}

const LoadingIndicator = ({ label }: LoadingIndicatorProps) => (
  <div
    role="status"
    aria-live="polite"
    className="flex min-h-[50vh] flex-col items-center justify-center gap-6 text-center"
  >
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className="size-20 animate-spin text-red-600"
    >
      <circle
        cx="32"
        cy="32"
        r="26"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="7"
      />
      <path
        d="M32 6a26 26 0 0 1 26 26"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="7"
      />
    </svg>
    <div>
      <p className="text-2xl font-semibold text-white">{label}</p>
      <p className="mt-2 text-lg text-zinc-400">This may take a moment.</p>
    </div>
  </div>
);

export default LoadingIndicator;
