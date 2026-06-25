import { useCallback, useEffect, useState } from "react";

export function useAdminResource<TData>(
  fetcher: () => Promise<TData>,
  initialData: TData,
) {
  const [data, setData] = useState<TData>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setData(await fetcher());
    } catch (error) {
      setError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    let isMounted = true;

    Promise.resolve()
      .then(async () => {
        if (isMounted) {
          setIsLoading(true);
          setError(null);
        }

        return fetcher();
      })
      .then((remoteData) => {
        if (isMounted) {
          setData(remoteData);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setError(error instanceof Error ? error : new Error(String(error)));
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [fetcher]);

  return {
    data,
    isLoading,
    error,
    reload,
  };
}
