import { SearchInput } from "@/shared/components/SearchInput";

type CategoriesToolbarProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;

  resultCount?: number;
};

export const CategoriesToolbar = ({
  searchQuery,
  onSearchChange,

  resultCount,
}: CategoriesToolbarProps) => {
  return (
    <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Buscar por nombre..."
          label="Buscar categoría"
        />
      </div>

      {resultCount !== undefined ? (
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {resultCount}{" "}
          {resultCount === 1
            ? "categoría encontrada"
            : "categorías encontradas"}
        </div>
      ) : null}
    </div>
  );
};
