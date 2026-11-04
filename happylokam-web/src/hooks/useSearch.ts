import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export function useSearch(query: string, filters?: any) {
  const [results, setResults] = useState([]);
  const [facets, setFacets] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!query && !filters) return;
      
      setIsLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams({ q: query, ...filters }).toString();
        const response = await apiClient.get<any>(`/api/v1/search/listings?${queryParams}`);
        setResults(response.data?.results || response.data || []);
        setFacets(response.data?.facets || null);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, JSON.stringify(filters)]);

  return { results, facets, isLoading, error };
}
