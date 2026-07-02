import { useState, useCallback } from "react";

export function useExpandedGroups() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const isExpanded = useCallback(
    (id: string) => expandedIds.has(id),
    [expandedIds],
  );

  const expand = useCallback((id: string) => {
    setExpandedIds((prev) => new Set(prev).add(id));
  }, []);

  const collapse = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const toggle = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return { expandedIds, isExpanded, expand, collapse, toggle };
}
