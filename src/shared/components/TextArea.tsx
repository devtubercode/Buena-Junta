import { forwardRef } from "react";

import { cn } from "@/shared/utils/cn";

export const baseTextareaClass =
  "min-h-24 w-full min-w-0 resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-placeholder focus:border-primary focus:ring-2 focus:ring-primary/25";

export type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(baseTextareaClass, className)}
        {...props}
      />
    );
  },
);
TextArea.displayName = "TextArea";
