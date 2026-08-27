import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'talentgraph-shortlist';

function readShortlist(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function useShortlist() {
  const [ids, setIds] = useState<string[]>(readShortlist);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // storage unavailable (e.g. incognito) - fail silently
    }
  }, [ids]);

  const isShortlisted = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback((id: string) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const clear = useCallback(() => setIds([]), []);

  return { ids, isShortlisted, toggle, clear };
}
