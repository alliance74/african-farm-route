import { useState } from 'react';
import { Package, Clock, CheckCircle, X, MapPin, Phone, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const MyBookings = () => {
  const { toast } = useToast();
  
  const [bookings] = useState([
    {
      id: 'BK001',
      status: 'confirmed',
      pickup: 'Kiambu Farm',
      delivery: 'Nairobi Market',
      date: '2024-01-15',
      time: '08:00',
      driver: 'James Kiprotich',
      vehicle: 'Toyota Hilux',
      phone: '+254 712 345 678',
      price: 'KSh 3,500',
      goods: 'Vegetables',
      weight: '800kg',
      rating: null,
      avatar: '👨‍🚀',
    },
    {
      id: 'BK002',
      status: 'in-transit',
      pickup: 'Nakuru Farm',
      delivery: 'Eldoret Market',
      date: '2024-01-14',
      time: '06:30',
      driver: 'Mary Wanjiku',
      vehicle: 'Isuzu Truck',
      phone: '+254 721 876 543',
      price: 'KSh 7,200',
      goods: 'Maize',
      weight: '3.2 tons',
      rating: null,
      avatar: '👩‍💼',
    },
    {
      id: 'BK003',
      status: 'completed',
      pickup: 'Meru Farm',
      delivery: 'Nairobi Market',
      date: '2024-01-10',
      time: '05:00',
      driver: 'Peter Muthee',
      vehicle: 'Mahindra Pickup',
      phone: '+254 733 654 321',
      price: 'KSh 4,100',
      goods: 'Coffee Beans',
      weight: '1.5 tons',
      rating: 5,
      avatar: '👨‍🌾',
    },
    {
      id: 'BK004',
      status: 'cancelled',
      pickup: 'Kisumu Farm',
      delivery: 'Nakuru Market',
      date: '2024-01-08',
      time: '07:00',
      driver: 'Grace Akinyi',
      vehicle: 'Toyota Probox',
      phone: '+254 745 321 654',
      price: 'KSh 2,800',
      goods: 'Fish',
      weight: '500kg',
      rating: null,
      avatar: '👩‍🌾',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in-transit': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <Clock className="h-4 w-4" />;
      case 'in-transit': return <Package className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <X className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    toast({
      title: "Booking Cancelled",
      description: `Booking ${bookingId} has been cancelled successfully.`,
    });
  };

  const handleReschedule = (bookingId: string) => {
    toast({
      title: "Reschedule Request",
      description: `Your reschedule request for ${bookingId} has been sent to the driver.`,
    });
  };

  const handleRating = (bookingId: string, rating: number) => {
    toast({
      title: "Thank you for your feedback!",
      description: `You rated this booking ${rating} stars.`,
    });
  };

  const filterBookings = (status: string) => {
    if (status === 'all') return bookings;
    return bookings.filter(booking => booking.status === status);
  };

  const BookingCard = ({ booking }: { booking: any }) => (
    <Card className="card-elevated">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{booking.avatar}</div>
            <div>
              <CardTitle className="text-lg">{booking.driver}</CardTitle>
              <p className="text-sm text-muted-foreground">{booking.vehicle}</p>
            </div>
          </div>
          <div className="text-right">
            <Badge className={`${getStatusColor(booking.status)} flex items-center gap-1`}>
              {getStatusIcon(booking.status)}
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
            <div className="text-sm text-muted-foreground mt-1">#{booking.id}</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 text-primary mr-2" />
              <span className="font-medium">From:</span>
              <span className="ml-1 text-muted-foreground">{booking.pickup}</span>
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 text-success mr-2" />
              <span className="font-medium">To:</span>
              <span className="ml-1 text-muted-foreground">{booking.delivery}</span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 text-primary mr-2" />
              <span className="font-medium">Date:</span>
              <span className="ml-1 text-muted-foreground">{booking.date} at {booking.time}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Goods:</span>
              <span className="ml-1 text-muted-foreground">{booking.goods} ({booking.weight})</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Price:</span>
              <span className="ml-1 text-primary font-semibold">{booking.price}</span>
            </div>
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 text-primary mr-2" />
              <span className="text-muted-foreground">{booking.phone}</span>
            </div>
          </div>
        </div>

        {/* Rating for completed bookings */}
        {booking.status === 'completed' && (
          <div className="pt-4 border-t border-border">
            {booking.rating ? (
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">Your rating:</span>
                {[...Array(booking.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-sm font-medium">Rate this booking:</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleRating(booking.id, rating)}
                      className="text-yellow-400 hover:text-yellow-500 transition-colors"
                    >
                      <Star className="h-5 w-5" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex space-x-2 pt-4 border-t border-border">
          {booking.status === 'confirmed' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReschedule(booking.id)}
              >
                Reschedule
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleCancelBooking(booking.id)}
              >
                Cancel
              </Button>
            </>
          )}
          {booking.status === 'in-transit' && (
            <Button variant="outline" size="sm">
              Track Shipment
            </Button>
          )}
          {booking.status === 'completed' && (
            <Button variant="outline" size="sm">
              Book Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-accent py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">My Bookings</h1>
          <p className="text-xl text-muted-foreground">
            Track and manage your transport bookings
          </p>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Bookings</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="in-transit">In Transit</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {filterBookings('all').map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>

          <TabsContent value="confirmed" className="space-y-6">
            {filterBookings('confirmed').map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>

          <TabsContent value="in-transit" className="space-y-6">
            {filterBookings('in-transit').map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {filterBookings('completed').map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-6">
            {filterBookings('cancelled').map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>
        </Tabs>

        {bookings.length === 0 && (
          <Card className="card-elevated">
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Bookings Yet
              </h3>
              <p className="text-muted-foreground mb-6">
                You haven't made any transport bookings yet. Start by booking your first transport!
              </p>
              <Button className="btn-hero">
                Book Transport
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyBookings;