import { useState, useEffect, useCallback } from 'react';

export function useMyBookings({ status = '', page = 1, limit = 10 } = {}) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(() => {
    setLoading(true);
    setError(null);
    let url = `/api/v1/bookings/my?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setBookings(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [status, page, limit]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, refetch: fetchBookings };
} 