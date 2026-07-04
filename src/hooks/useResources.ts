import { useEffect, useState } from "react";
import { subscribeResources, type Resource } from "../lib/resources";

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeResources((data) => {
      setResources(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { resources, loading };
}
