import { useEffect, useRef, useState } from "react";

const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
  const [data, setData] = useState<T | null>(null);
  const [loding, setLoding] = useState(autoFetch); // true only if autoFetch
  const [error, setError] = useState<Error | null>(null);

  // Cache the current promise to avoid React 19's uncached promise warning
  const promiseRef = useRef<Promise<T> | null>(null);

  const fetchData = async () => {
    // If there's already a promise in progress, reuse it (prevents duplicate calls)
    if (promiseRef.current) {
      return promiseRef.current;
    }

    try {
      setLoding(true);
      setError(null);

      // Create and cache the promise
      promiseRef.current = fetchFunction();

      const result = await promiseRef.current;
      setData(result);
      promiseRef.current = null; // Clear after success
    } catch (err) {
      const error = err instanceof Error ? err : new Error("An error occurred");
      setError(error);
      promiseRef.current = null; // Clear on error too
    } finally {
      setLoding(false);
    }
  };

  const reset = () => {
    setData(null);
    setLoding(false);
    setError(null);
    promiseRef.current = null; // Reset cached promise
  };

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array — only runs once on mount

  // Optional: clean up on unmount
  useEffect(() => {
    return () => {
      promiseRef.current = null;
    };
  }, []);

  return {
    data,
    loding,
    error,
    refetch: fetchData,
    reset,
  };
};

export default useFetch;
