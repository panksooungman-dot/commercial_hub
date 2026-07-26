"use client";

import { useCallback, useEffect, useState } from "react";
import {
  INTEREST_MAX,
  readInterestIds,
  toggleInterestId,
  writeInterestIds,
} from "@/lib/interest-units";

export function useInterestUnits() {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setIds(readInterestIds());
    setReady(true);
    const onChange = () => setIds(readInterestIds());
    const onStorage = (e: StorageEvent) => {
      if (e.key === "ivysquare:interest-units:v1") onChange();
    };
    window.addEventListener("interest-units-change", onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("interest-units-change", onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const toggle = useCallback((id: string) => toggleInterestId(id), []);

  const clear = useCallback(() => {
    writeInterestIds([]);
    setIds([]);
  }, []);

  const setAll = useCallback((next: string[]) => {
    writeInterestIds(next);
    setIds(readInterestIds());
  }, []);

  return {
    ids,
    ready,
    max: INTEREST_MAX,
    toggle,
    clear,
    setAll,
    count: ids.length,
    isSelected: (id: string) => ids.includes(id),
    atLimit: ids.length >= INTEREST_MAX,
  };
}
