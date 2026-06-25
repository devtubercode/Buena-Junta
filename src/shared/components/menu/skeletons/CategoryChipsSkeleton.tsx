export const CategoryChipsSkeleton = () => {
  return (
    <div className="flex gap-2 overflow-hidden pb-2 pt-1" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-10 w-28 shrink-0 animate-pulse rounded-full bg-surface-muted"
        />
      ))}
    </div>
  );
};
