import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

export function useListings(filters?: any) {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const qs = filters ? '?' + new URLSearchParams(filters).toString() : '';
      const response = await apiClient.get<any>(`/api/v1/listings${qs}`);
      setListings(response.data);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return { listings, isLoading, error, refetch: fetchListings };
}
