export const AnimatedArrow = ({ className = "" }: { className?: string }) => {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: unused component, kept as-is; add a title or aria-hidden when this is wired in.
    <svg
      viewBox="0 0 24 24"
      className={`size-5 stroke-[3px] fill-none stroke-current opacity-50 group-hover:opacity-100 transition-opacity duration-300 ease-in-out ${className}`}
    >
      <line
        x1="5"
        y1="12"
        x2="19"
        y2="12"
        className="scale-x-0 translate-x-[10px] group-hover:translate-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"
      />
      <polyline
        points="12 5 19 12 12 19"
        className="-translate-x-2 group-hover:translate-x-0 transition-transform duration-300 ease-in-out"
      />
    </svg>
  );
};
