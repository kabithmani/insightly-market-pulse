import { useState, useCallback } from "react";

export interface SearchContext {
  location: string;        // display name of searched location
  city: string;            // detected city (Bangalore, Pune, Mumbai) or empty
  lat: number;
  lng: number;
  radius: number;
  searched: boolean;       // has a search been performed?
}

const DEFAULT_CONTEXT: SearchContext = {
  location: "",
  city: "Bangalore",
  lat: 0,
  lng: 0,
  radius: 25,
  searched: false,
};

export function useSearchContext() {
  const [context, setContext] = useState<SearchContext>(DEFAULT_CONTEXT);

  const updateContext = useCallback((update: Partial<SearchContext>) => {
    setContext(prev => ({ ...prev, ...update, searched: true }));
  }, []);

  return { context, updateContext };
}
