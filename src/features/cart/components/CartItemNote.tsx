import { useState } from "react";
import { Pencil, X, StickyNote } from "lucide-react";

type CartItemNoteProps = {
  note: string;
  onChange: (note: string) => void;
};

const MAX_NOTE_LENGTH = 160;

export function CartItemNote({ note, onChange }: CartItemNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const trimmedNote = note.trim();

  if (isEditing) {
    return (
      <div className="mt-3 rounded-xl border border-border bg-surface-muted p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
            <StickyNote className="size-3.5" />
            Observación
          </span>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="inline-flex min-h-8 items-center justify-center gap-1 rounded-full border border-border px-2.5 text-xs font-black text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <X className="size-3.5" />
            Cerrar
          </button>
        </div>
        <textarea
          value={note}
          maxLength={MAX_NOTE_LENGTH}
          rows={2}
          aria-label="Observación del producto"
          placeholder="Ej: sin cebolla, sin salsas..."
          className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground outline-none transition placeholder:text-placeholder focus:border-primary focus:ring-2 focus:ring-primary/20"
          onChange={(event) => onChange(event.target.value)}
        />
        <p className="mt-1.5 text-right text-xs font-bold text-muted-foreground">
          {note.length}/{MAX_NOTE_LENGTH}
        </p>
      </div>
    );
  }

  if (!trimmedNote) {
    return (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-full border border-primary-border bg-primary-soft px-3 text-xs font-black text-primary transition hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Pencil className="size-3.5" />
        Agregar observación
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className="mt-3 flex w-full items-start gap-2 rounded-xl border border-border bg-surface-muted px-3 py-2 text-left transition hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <StickyNote className="mt-0.5 size-4 shrink-0 text-primary" />
      <span className="min-w-0">
        <span className="text-xs font-black text-foreground">Nota:</span>{" "}
        <span className="text-xs font-semibold text-muted-foreground">
          {trimmedNote}
        </span>
      </span>
    </button>
  );
}
