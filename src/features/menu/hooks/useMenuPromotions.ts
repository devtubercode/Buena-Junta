import { useEffect, useState } from "react";
import { fetchPromotions } from "@/shared/services/promotion.service";
import { buildPromotions } from "@/features/home/mappers/promotion.mapper";
import type { Promotion } from "@/features/home/types/promotion.types";

export type UseMenuPromotionsResult = {
  promotions: Promotion[];
  isLoading: boolean;
  error: Error | null;
};

/**
 * Hook para cargar y mapear las promociones activas del menú.
 *
 * Usa el servicio de promociones y el mismo mapper que la página de inicio,
 * garantizando que la información sea consistente en toda la aplicación.
 */
export function useMenuPromotions(): UseMenuPromotionsResult {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPromotions = async () => {
      try {
        setIsLoading(true);
        const data = await fetchPromotions();

        if (!isMounted) return;

        setPromotions(buildPromotions(data));
        setError(null);
      } catch (err) {
        if (!isMounted) return;

        console.error("Could not load menu promotions.", err);
        setError(
          err instanceof Error
            ? err
            : new Error("No pudimos cargar las promociones."),
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadPromotions();

    return () => {
      isMounted = false;
    };
  }, []);

  return { promotions, isLoading, error };
}
