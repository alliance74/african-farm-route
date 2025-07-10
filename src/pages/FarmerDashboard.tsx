import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookingCard } from '@/components/Bookings/BookingCard';
import { useMyBookings } from '@/hooks/useMyBookings';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const statuses = ['all', 'confirmed', 'in-transit', 'completed', 'cancelled'];

export default function FarmerDashboard() {
  const [status, setStatus] = useState('all');
  const { bookings, loading, error, refetch } = useMyBookings({ status: status === 'all' ? '' : status });
  const { toast } = useToast();

  const handleCancel = async (bookingId) => {
    try {
      const res = await fetch(`/api/v1/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Failed to cancel booking');
      toast({ title: 'Booking Cancelled', description: `Booking ${bookingId} has been cancelled.` });
      refetch();
    } catch (e) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const handleReschedule = (bookingId) => {
    toast({ title: 'Reschedule', description: `Reschedule request for ${bookingId} sent (not implemented).` });
  };

  const handleRate = async (bookingId, rating) => {
    try {
      const res = await fetch(`/api/v1/bookings/${bookingId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ rating })
      });
      if (!res.ok) throw new Error('Failed to submit rating');
      toast({ title: 'Thank you!', description: `You rated this booking ${rating} stars.` });
      refetch();
    } catch (e) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const summary = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    inTransit: bookings.filter(b => b.status === 'in-transit').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div className="min-h-screen bg-accent py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Farmer Dashboard</h1>
          <p className="text-xl text-muted-foreground">Manage your transport bookings</p>
        </div>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card><CardContent className="p-4 text-center"><div className="text-lg font-bold">{summary.total}</div><div className="text-xs text-muted-foreground">Total</div></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><div className="text-lg font-bold">{summary.confirmed}</div><div className="text-xs text-muted-foreground">Confirmed</div></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><div className="text-lg font-bold">{summary.inTransit}</div><div className="text-xs text-muted-foreground">In Transit</div></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><div className="text-lg font-bold">{summary.completed}</div><div className="text-xs text-muted-foreground">Completed</div></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><div className="text-lg font-bold">{summary.cancelled}</div><div className="text-xs text-muted-foreground">Cancelled</div></CardContent></Card>
        </div>
        {/* Tabs for filtering */}
        <Tabs defaultValue="all" value={status} onValueChange={setStatus} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            {statuses.map(s => <TabsTrigger key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</TabsTrigger>)}
          </TabsList>
          {statuses.map(s => (
            <TabsContent key={s} value={s} className="space-y-6">
              {loading ? <div>Loading...</div> : error ? <div>Error loading bookings</div> :
                bookings.filter(b => s === 'all' ? true : b.status === s).map(booking => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    role="farmer"
                    onCancel={handleCancel}
                    onReschedule={handleReschedule}
                    onRate={handleRate}
                    onMarkPickedUp={() => {}}
                    onMarkDelivered={() => {}}
                    onContactFarmer={() => {}}
                  />
                ))}
              {(!loading && bookings.filter(b => s === 'all' ? true : b.status === s).length === 0) && (
                <Card className="card-elevated"><CardContent className="p-8 text-center">No bookings found.</CardContent></Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
        <div className="mt-8 text-center">
          <Button className="btn-hero">Book Transport</Button>
        </div>
      </div>
    </div>
  );
} 