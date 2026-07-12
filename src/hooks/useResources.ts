import { useEffect, useState } from "react";
import { subscribeResources, type Resource } from "../lib/resources";

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeResources(
      (data) => {
        setResources(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(
          "Couldn't load resources. Check your connection and try refreshing."
        );
        setLoading(false);
        void err;
      }
    );
    return unsubscribe;
  }, []);

  return { resources, loading, error };
}
