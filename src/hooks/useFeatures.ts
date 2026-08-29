"use client";

import { useEffect, useState } from "react";

type UserFeatures = {
  features: string[];
  paket: {
    id: string;
    nama: string;
    harga: number;
  } | null;
};

export function useUserFeatures() {
  const [data, setData] = useState<UserFeatures | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const res = await fetch("/api/fitur");
        if (!res.ok) throw new Error("Failed to fetch features");
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  return { data, loading, error };
}

export function useHasFeature(featureKey: string) {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFeature = async () => {
      try {
        const res = await fetch("/api/fitur", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ featureKey }),
        });
        if (!res.ok) throw new Error("Failed to check feature");
        const result = await res.json();
        setHasAccess(result.hasAccess);
      } catch (err) {
        console.error("Error checking feature:", err);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkFeature();
  }, [featureKey]);

  return { hasAccess, loading };
}
