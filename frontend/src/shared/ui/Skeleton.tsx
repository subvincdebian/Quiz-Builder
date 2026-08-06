export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-zinc-800 rounded-md ${className}`} />
);
