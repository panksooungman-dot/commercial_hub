/** 의뢰자 관심 호실(최대 3) — 브라우저 localStorage */

export const INTEREST_STORAGE_KEY = "ivysquare:interest-units:v1";
export const INTEREST_MAX = 3;

export type InterestState = {
  ids: string[];
  updatedAt: string;
};

export function readInterestIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(INTEREST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as InterestState;
    if (!Array.isArray(parsed?.ids)) return [];
    return parsed.ids.filter((id) => typeof id === "string").slice(0, INTEREST_MAX);
  } catch {
    return [];
  }
}

export function writeInterestIds(ids: string[]) {
  if (typeof window === "undefined") return;
  const next: InterestState = {
    ids: [...new Set(ids)].slice(0, INTEREST_MAX),
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(INTEREST_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("interest-units-change", { detail: next }));
}

export function toggleInterestId(id: string): { ids: string[]; added: boolean; limited: boolean } {
  const cur = readInterestIds();
  if (cur.includes(id)) {
    const ids = cur.filter((x) => x !== id);
    writeInterestIds(ids);
    return { ids, added: false, limited: false };
  }
  if (cur.length >= INTEREST_MAX) {
    return { ids: cur, added: false, limited: true };
  }
  const ids = [...cur, id];
  writeInterestIds(ids);
  return { ids, added: true, limited: false };
}
