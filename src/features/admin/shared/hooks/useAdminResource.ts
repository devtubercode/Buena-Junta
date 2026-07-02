import { useCallback, useEffect, useState } from "react";

type UseAdminResourceOptions = {
  enabled?: boolean;
};

export function useAdminResource<TData>(
  fetcher: () => Promise<TData>,
  initialData: TData,
  options: UseAdminResourceOptions = {},
) {
  const { enabled = true } = options;

  const [data, setData] = useState<TData>(initialData);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const resultData = await fetcher();
      setData(resultData);
    } catch (error) {
      setError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let isMounted = true;

    const load = async () => {
      if (isMounted) {
        setIsLoading(true);
        setError(null);
      }

      try {
        const remoteData = await fetcher();
        if (isMounted) {
          setData(remoteData);
        }
      } catch (error) {
        if (isMounted) {
          setError(error instanceof Error ? error : new Error(String(error)));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [fetcher, enabled]);

  return {
    data,
    setData,
    isLoading,
    error,
    reload,
  };
}
