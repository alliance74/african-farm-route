import { Package, Clock, CheckCircle, X, MapPin, Phone, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const BookingCard = ({ booking, role, onCancel, onReschedule, onRate, onMarkPickedUp, onMarkDelivered, onContactFarmer }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in-transit': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <Clock className="h-4 w-4" />;
      case 'in-transit': return <Package className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <X className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };
  return (
    <Card className="card-elevated">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{booking.avatar || '🚚'}</div>
            <div>
              <CardTitle className="text-lg">{role === 'driver' ? booking.farmer?.full_name : booking.driver}</CardTitle>
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
              <span className="text-muted-foreground">{role === 'driver' ? booking.farmer?.phone : booking.phone}</span>
            </div>
          </div>
        </div>
        {/* Rating for completed bookings */}
        {role === 'farmer' && booking.status === 'completed' && (
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
                      onClick={() => onRate && onRate(booking.id, rating)}
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
          {role === 'farmer' && booking.status === 'confirmed' && (
            <>
              <Button variant="outline" size="sm" onClick={() => onReschedule && onReschedule(booking.id)}>Reschedule</Button>
              <Button variant="destructive" size="sm" onClick={() => onCancel && onCancel(booking.id)}>Cancel</Button>
            </>
          )}
          {role === 'farmer' && booking.status === 'in-transit' && (
            <Button variant="outline" size="sm">Track Shipment</Button>
          )}
          {role === 'farmer' && booking.status === 'completed' && (
            <Button variant="outline" size="sm">Book Again</Button>
          )}
          {role === 'driver' && booking.status === 'confirmed' && (
            <>
              <Button variant="outline" size="sm" onClick={() => onMarkPickedUp && onMarkPickedUp(booking.id)}>Mark as Picked Up</Button>
              <Button variant="outline" size="sm" onClick={() => onContactFarmer && onContactFarmer(booking.id)}>Contact Farmer</Button>
            </>
          )}
          {role === 'driver' && booking.status === 'in-transit' && (
            <>
              <Button variant="outline" size="sm" onClick={() => onMarkDelivered && onMarkDelivered(booking.id)}>Mark as Delivered</Button>
              <Button variant="outline" size="sm" onClick={() => onContactFarmer && onContactFarmer(booking.id)}>Contact Farmer</Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 