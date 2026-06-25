import { useState, type FormEvent } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { AdminDataState } from "@/features/admin/components/AdminDataState";
import { AdminField, adminInputClass, adminTextareaClass } from "@/features/admin/components/AdminField";
import { AdminSection } from "@/features/admin/components/AdminSection";
import { AdminCategoriesSkeleton } from "@/features/admin/components/AdminSkeletons";
import { useAdditionsData } from "@/features/admin/hooks/useAdditionsData";
import { notify } from "@/shared/notifications/notify";
import {
  deleteAddition,
  saveAddition,
} from "@/features/admin/services/admin-additions.service";
import type { AdditionInput, AdditionRow } from "@/features/admin/types/admin.types";

const emptyForm: AdditionInput = {
  name: "",
  description: null,
  price: 0,
};

export function AdditionsPage() {
  const { data, isLoading, error, reload } = useAdditionsData();
  const { additions } = data;
  const [selected, setSelected] = useState<AdditionRow | null>(null);
  const [form, setForm] = useState<AdditionInput>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const selectAddition = (addition: AdditionRow) => {
    setSelected(addition);
    setForm({
      name: addition.name,
      description: addition.description,
      price: addition.price,
    });
  };

  const startNewAddition = () => {
    setSelected(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      await saveAddition(
        {
          name: form.name.trim(),
          description: form.description?.trim() || null,
          price: Math.max(0, Number(form.price) || 0),
        },
        selected?.id,
      );
      notify.success("Adición guardada.");
      startNewAddition();
      await reload();
    } catch (error) {
      notify.error(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (addition: AdditionRow) => {
    if (!window.confirm(`Eliminar ${addition.name}?`)) {
      return;
    }

    try {
      await deleteAddition(addition.id);
      notify.success("Adición eliminada.");
      if (selected?.id === addition.id) {
        startNewAddition();
      }
      await reload();
    } catch (error) {
      notify.error(error instanceof Error ? error.message : String(error));
    }
  };

  if (error) {
    return <AdminDataState isLoading={false} error={error} />;
  }

  if (isLoading) {
    return (
      <AdminSection
        title="Adiciones"
        description="Gestiona las adiciones globales reutilizables."
      >
        <AdminCategoriesSkeleton />
      </AdminSection>
    );
  }

  return (
    <AdminSection
      title="Adiciones"
      description="Gestiona las adiciones globales reutilizables."
      actions={
        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-sm font-black text-primary-foreground"
          onClick={startNewAddition}
        >
          <Plus className="size-4" />
          Nueva
        </button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
        <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-elevated">
          <div className="grid grid-cols-[1fr_120px_80px] gap-3 border-b border-border px-4 py-3 text-xs font-black uppercase text-muted-foreground">
            <span>Nombre</span>
            <span>Precio</span>
            <span />
          </div>
          {additions.map((addition) => (
            <div
              key={addition.id}
              className="grid grid-cols-[1fr_120px_80px] items-center gap-3 border-b border-border px-4 py-3 last:border-b-0"
            >
              <button
                type="button"
                className="min-w-0 text-left"
                onClick={() => selectAddition(addition)}
              >
                <span className="block truncate text-sm font-black text-foreground">
                  {addition.name}
                </span>
                <span className="block truncate text-xs font-bold text-muted-foreground">
                  {addition.description ?? "Sin descripción"}
                </span>
              </button>
              <span className="text-sm font-bold text-muted-foreground">
                ${addition.price}
              </span>
              <button
                type="button"
                className="inline-flex size-9 items-center justify-center rounded-full border border-error-border bg-error-soft text-error"
                onClick={() => void handleDelete(addition)}
                aria-label={`Eliminar ${addition.name}`}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>

        <form
          className="grid content-start gap-4 rounded-lg border border-border bg-surface p-4 shadow-elevated"
          onSubmit={handleSubmit}
        >
          <h2 className="m-0 font-heading text-2xl font-black text-foreground">
            {selected ? "Editar adición" : "Nueva adición"}
          </h2>
          <AdminField label="Nombre">
            <input
              className={adminInputClass}
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              required
            />
          </AdminField>
          <AdminField label="Descripción">
            <textarea
              className={adminTextareaClass}
              value={form.description ?? ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
            />
          </AdminField>
          <AdminField label="Precio">
            <input
              className={adminInputClass}
              type="number"
              min="0"
              value={form.price}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  price: Number(event.target.value),
                }))
              }
              required
            />
          </AdminField>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-black text-primary-foreground disabled:opacity-60"
          >
            <Save className="size-4" />
            {isSaving ? "Guardando" : "Guardar"}
          </button>
        </form>
      </div>
    </AdminSection>
  );
}
