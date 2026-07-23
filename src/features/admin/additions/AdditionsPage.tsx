import { Plus } from "lucide-react";
import { AdminSection } from "@/features/admin/shared/components/AdminSection";
import { AdditionsSkeleton } from "@/features/admin/shared/state/AdminSkeletons";
import { useAdminResource } from "@/features/admin/shared/hooks/useAdminResource";
import { useAdminDeleteConfirm } from "@/features/admin/shared/hooks/useAdminDeleteConfirm";
import { useAdminCrudModal } from "@/features/admin/shared/hooks/useAdminCrudModal";
import { AdditionCard } from "@/features/admin/additions/components/AdditionCard";
import { AdditionEmptyState } from "@/features/admin/additions/components/AdditionEmptyState";
import { AdditionForm } from "@/features/admin/additions/components/AdditionForm";
import { Button } from "@/shared/components/Button";
import { EmptyState } from "@/shared/components/EmptyState";
import type { AdditionRow } from "@/features/admin/types/additions.types";
import {
  deleteAddition,
  fetchAdminAdditions,
} from "@/features/admin/additions/services/admin-additions.service";

export const AdditionsPage = () => {
  const {
    data: additions,
    setData: setAdditions,
    isLoading,
    error,
  } = useAdminResource<AdditionRow[]>(fetchAdminAdditions, []);

  const additionModal = useAdminCrudModal<AdditionRow>();

  const { confirmDelete, ConfirmDialog: AdditionDeleteDialog } =
    useAdminDeleteConfirm();

  const handleDelete = async (addition: AdditionRow) => {
    const deleted = await confirmDelete({
      item: addition,
      deleteFn: deleteAddition,
      id: addition.id,
      itemLabel: "Adición",
    });
    if (!deleted) return;
    setAdditions((prev) => prev.filter((a) => a.id !== addition.id));
  };

  const handleAdditionSaved = (savedAddition: AdditionRow) => {
    if (additionModal.selected === null) {
      setAdditions([...additions, { ...savedAddition }]);
      additionModal.close();
      return;
    }

    const updatedAdditions = additions.map((addition) => {
      if (addition.id === savedAddition.id) {
        return savedAddition;
      }
      return addition;
    });
    setAdditions(updatedAdditions);
    additionModal.close();
  };

  if (error) {
    return (
      <EmptyState
        title="No se pudieron cargar los datos"
        description={error.message}
      />
    );
  }

  if (isLoading) return <AdditionsSkeleton />;

  const hasAdditions = additions.length > 0;

  return (
    <AdminSection
      title="Adiciones"
      description="Gestiona las adiciones globales reutilizables."
      actions={
        <Button
          type="button"
          variant="primary"
          radius="full"
          size="md"
          onClick={additionModal.openNew}
          icon={<Plus className="size-4" />}
        >
          Nueva adición
        </Button>
      }
    >
      {!hasAdditions ? (
        <AdditionEmptyState type="empty" onCreate={additionModal.openNew} />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
          {additions.map((addition) => (
            <AdditionCard
              key={addition.id}
              addition={addition}
              onEdit={additionModal.openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {additionModal.isOpen && (
        <AdditionForm
          addition={additionModal.selected}
          onCloseModal={additionModal.close}
          onSuccessSaved={handleAdditionSaved}
        />
      )}

      <AdditionDeleteDialog />
    </AdminSection>
  );
};
