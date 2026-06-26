import { Link } from "react-router";
import { Edit3, ImageIcon, Plus, Trash2 } from "lucide-react";
import { appRoutes } from "@/app/routes";
import { AdminDataState } from "@/features/admin/shared/state/AdminDataState";
import { AdminSection } from "@/features/admin/shared/components/AdminSection";
import { AdminMediaListSkeleton } from "@/features/admin/shared/state/AdminSkeletons";
import { useProductsData } from "@/features/admin/products/useProductsData";
import { notify } from "@/shared/notifications/notify";
import { deleteProduct } from "@/features/admin/products/services/admin-products.service";
import { SUPABASE_BUCKETS } from "@/lib/supabase/constants";
import { getStorageImageUrl } from "@/shared/services/storage.service";
import type { AdminProductListRow } from "@/features/admin/types/products.types";

function getProductDetailPath(productId: string) {
  return `${appRoutes.adminProduct}?id=${productId}`;
}

function getNewProductPath() {
  return `${appRoutes.adminProduct}?id=new`;
}

export function ProductsPage() {
  const { data: products, isLoading, error, reload } = useProductsData();

  const handleDelete = async (product: AdminProductListRow) => {
    if (!window.confirm(`Eliminar ${product.name}?`)) {
      return;
    }

    try {
      await deleteProduct(product.id);
      notify.success("Producto eliminado.");
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
        title="Productos"
        description="Consulta productos del menú y entra a cada producto para editar su información, imagen y variantes."
      >
        <AdminMediaListSkeleton />
      </AdminSection>
    );
  }

  return (
    <AdminSection
      title="Productos"
      description="Consulta productos del menú y entra a cada producto para editar su información, imagen y variantes."
      actions={
        <Link
          to={getNewProductPath()}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-sm font-black text-primary-foreground"
        >
          <Plus className="size-4" />
          Nuevo
        </Link>
      }
    >
      <div className="grid gap-3">
        {products.map((product) => {
          const productVariants = [...(product.product_variants ?? [])].sort(
            (firstVariant, secondVariant) =>
              firstVariant.sort_order - secondVariant.sort_order,
          );
          const productGroups = product.product_option_groups ?? [];
          const imageUrl = product.image_path
            ? getStorageImageUrl(
                product.image_path,
                SUPABASE_BUCKETS.PRODUCT_IMAGES,
              )
            : null;

          return (
            <article
              key={product.id}
              className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 rounded-lg border border-border bg-surface p-2.5 shadow-elevated sm:grid-cols-[84px_minmax(0,1fr)_auto] sm:p-3"
            >
              <Link
                to={getProductDetailPath(product.id)}
                className="flex aspect-square items-center justify-center overflow-hidden rounded-md border border-border bg-surface-muted text-muted-foreground"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <ImageIcon className="size-7" />
                )}
              </Link>

              <div className="min-w-0 self-center">
                <Link
                  to={getProductDetailPath(product.id)}
                  className="block text-base font-black leading-tight text-foreground transition hover:text-primary sm:text-lg"
                >
                  {product.name}
                </Link>
                <p className="mt-1 text-xs font-bold leading-5 text-muted-foreground">
                  {product.categories?.name ?? "Sin categoría"} · {product.slug}
                </p>
                {productVariants.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {productVariants.map((variant) => (
                      <span
                        key={variant.id}
                        className="rounded-full bg-surface-muted px-2 py-1 text-[11px] font-black text-muted-foreground"
                      >
                        {variant.name}
                      </span>
                    ))}
                  </div>
                ) : null}
                {productGroups.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {productGroups.map((group) => (
                      <span
                        key={group.id}
                        className="rounded-full bg-primary-soft px-2 py-1 text-[11px] font-black text-primary"
                      >
                        {group.name}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="col-span-2 flex items-center justify-between gap-2 border-t border-border pt-2 sm:col-span-1 sm:border-t-0 sm:pt-0 sm:justify-end">
                <span
                  className="rounded-full px-2.5 py-1 text-[11px] font-black sm:text-xs"
                  data-available={product.is_available}
                >
                  {product.is_available ? "Activo" : "Oculto"}
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    to={getProductDetailPath(product.id)}
                    className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface-muted text-foreground transition hover:border-primary"
                    aria-label={`Editar ${product.name}`}
                  >
                    <Edit3 className="size-4" />
                  </Link>
                  <button
                    type="button"
                    className="inline-flex size-9 items-center justify-center rounded-full border border-error-border bg-error-soft text-error"
                    onClick={() => void handleDelete(product)}
                    aria-label={`Eliminar ${product.name}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </AdminSection>
  );
}
