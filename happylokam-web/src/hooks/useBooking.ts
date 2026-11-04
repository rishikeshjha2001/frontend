import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

export function useCreateBooking() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createBooking = async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<any>('/api/v1/bookings', data);
      return response.data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createBooking, isLoading, error };
}

export function useMyBookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<any>('/api/v1/bookings/me');
      setBookings(response.data);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { bookings, isLoading, error, refetch: fetchBookings };
}
