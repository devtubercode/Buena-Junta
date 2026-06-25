import { useCallback, useEffect, useRef, useState } from "react";
import type { BlossomCarouselHandle } from "@blossom-carousel/react";
import { getPrefersReducedMotion } from "@/shared/utils/motion";

type UsePromotionsCarouselOptions = {
  itemCount: number;
  autoplayDelay?: number;
  resumeDelay?: number;
};

export function usePromotionsCarousel({
  itemCount,
  autoplayDelay = 5000,
  resumeDelay = 3000,
}: UsePromotionsCarouselOptions) {
  const carouselRef = useRef<BlossomCarouselHandle | null>(null);
  const interactionTimerRef = useRef<number | null>(null);
  const pageScrollTimerRef = useRef<number | null>(null);
  const [activePromotion, setActivePromotion] = useState(0);
  const [isInteractionPaused, setIsInteractionPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    getPrefersReducedMotion,
  );

  const pauseTemporarily = useCallback(() => {
    setIsInteractionPaused(true);

    if (interactionTimerRef.current) {
      window.clearTimeout(interactionTimerRef.current);
    }

    interactionTimerRef.current = window.setTimeout(() => {
      setIsInteractionPaused(false);
    }, resumeDelay);
  }, [resumeDelay]);

  const scrollToPromotion = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const carousel = carouselRef.current?.element;
      const slide = carousel?.children[index] as HTMLElement | undefined;

      if (!carousel || !slide) {
        return;
      }

      carousel.scrollTo({
        left: slide.offsetLeft,
        behavior: prefersReducedMotion ? "auto" : behavior,
      });
      setActivePromotion(index);
    },
    [prefersReducedMotion],
  );

  const showNextPromotion = useCallback(
    (shouldPause = true) => {
      if (shouldPause) {
        pauseTemporarily();
      }

      if (itemCount === 0) {
        return;
      }

      scrollToPromotion(
        activePromotion === itemCount - 1 ? 0 : activePromotion + 1,
      );
    },
    [activePromotion, itemCount, pauseTemporarily, scrollToPromotion],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateMotionPreference = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isInteractionPaused || itemCount <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      showNextPromotion(false);
    }, autoplayDelay);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    autoplayDelay,
    isInteractionPaused,
    itemCount,
    prefersReducedMotion,
    showNextPromotion,
  ]);

  useEffect(() => {
    const pauseWhilePageScrolls = () => {
      setIsInteractionPaused(true);

      if (pageScrollTimerRef.current) {
        window.clearTimeout(pageScrollTimerRef.current);
      }

      pageScrollTimerRef.current = window.setTimeout(() => {
        setIsInteractionPaused(false);
      }, resumeDelay);
    };

    window.addEventListener("scroll", pauseWhilePageScrolls, { passive: true });

    return () => {
      window.removeEventListener("scroll", pauseWhilePageScrolls);

      if (pageScrollTimerRef.current) {
        window.clearTimeout(pageScrollTimerRef.current);
      }
    };
  }, [resumeDelay]);

  useEffect(() => {
    const carousel = carouselRef.current?.element;

    if (!carousel) {
      return;
    }

    let frameId = 0;

    const updateActivePromotion = () => {
      pauseTemporarily();
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        const slides = Array.from(carousel.children) as HTMLElement[];

        if (slides.length === 0) {
          return;
        }

        const closestSlide = slides.reduce(
          (closest, slide, index) => {
            const distance = Math.abs(slide.offsetLeft - carousel.scrollLeft);

            return distance < closest.distance ? { distance, index } : closest;
          },
          { distance: Number.POSITIVE_INFINITY, index: 0 },
        );

        setActivePromotion(closestSlide.index);
      });
    };

    carousel.addEventListener("scroll", updateActivePromotion, {
      passive: true,
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      carousel.removeEventListener("scroll", updateActivePromotion);
    };
  }, [pauseTemporarily]);

  useEffect(() => {
    return () => {
      if (interactionTimerRef.current) {
        window.clearTimeout(interactionTimerRef.current);
      }
    };
  }, []);

  return {
    activePromotion,
    carouselRef,
    pauseTemporarily,
  };
}
