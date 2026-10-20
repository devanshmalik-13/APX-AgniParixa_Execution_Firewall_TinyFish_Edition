"use client";

import { useEffect, useState } from "react";

/** Cancel obsolete reads and derive loading from the requested resource key. */
export function useJsonResource<T>(url: string | null, revision: string, errorMessage: string) {
  const key = JSON.stringify([url, revision]);
  const [result, setResult] = useState<{ key: string; data?: T; error?: string }>({ key: "" });

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    fetch(url, { cache: "no-store", signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error(errorMessage);
        return await response.json() as T;
      })
      .then(data => { if (!controller.signal.aborted) setResult({ key, data }); })
      .catch(() => { if (!controller.signal.aborted) setResult({ key, error: errorMessage }); });
    return () => controller.abort();
  }, [url, key, errorMessage]);

  return { data: result.data, loading: !!url && result.key !== key, error: result.key === key ? result.error : undefined };
}
