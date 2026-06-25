import { useEffect, useState } from "react";
import { fetchPromotions } from "@/shared/services/promotion.service";

import { buildPromotions } from "../mappers/promotion.mapper";
import { getCurrentWeekday, sortPromotionsForWeekday } from "../utils";
import type { Promotion } from "@/features/home/types/promotion.types";

export const usePromotionData = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const onLoadData = async () => {
      try {
        const promotions = await fetchPromotions();

        if (!isMounted) return;

        const orderedPromotions = sortPromotionsForWeekday(
          buildPromotions(promotions),
          getCurrentWeekday(),
        );

        setPromotions(orderedPromotions);
        setError(null);
      } catch (error) {
        if (!isMounted) return;

        console.error("Could not load promotions from Supabase.", error);
        setError(
          error instanceof Error
            ? error
            : new Error("No pudimos cargar promociones."),
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void onLoadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    isLoading,
    promotions,
    error,
  };
};
