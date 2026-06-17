declare module "@blossom-carousel/react" {
  import type { ElementType, ForwardRefExoticComponent, HTMLAttributes, ReactNode, RefAttributes } from "react";

  export interface BlossomCarouselHandle {
    prev: (options?: { align?: string }) => void;
    next: (options?: { align?: string }) => void;
    element: HTMLElement | null;
  }

  export interface BlossomCarouselProps extends HTMLAttributes<HTMLElement> {
    children?: ReactNode | ReactNode[];
    as?: ElementType;
    repeat?: boolean;
    load?: "always" | "conditional";
  }

  export const BlossomCarousel: ForwardRefExoticComponent<
    BlossomCarouselProps & RefAttributes<BlossomCarouselHandle>
  >;
}
