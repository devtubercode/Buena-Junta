type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
};

export function SearchInput({
  value,
  onChange,
  placeholder = "Buscar",
  label = "Buscar productos",
}: SearchInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-primary">
        {label}
      </span>
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        className="min-h-12 w-full rounded-lg border border-border bg-surface px-4 text-base font-semibold text-foreground outline-none transition placeholder:text-placeholder focus:border-primary focus:ring-2 focus:ring-primary/20"
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
