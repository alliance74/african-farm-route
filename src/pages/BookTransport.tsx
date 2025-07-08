import { useState } from 'react';
import { MapPin, Calendar, Package, Truck, Filter, Star, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const BookTransport = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    pickup: '',
    delivery: '',
    goodsType: '',
    date: '',
    time: '',
    loadSize: '',
  });

  const [randomVehicles] = useState([
    {
      id: 1,
      driver: 'Jean Baptiste Uwimana',
      vehicle: 'Toyota Hilux',
      capacity: '2 tons',
      price: 'RWF 85,000',
      rating: 4.8,
      eta: '2 hours',
      phone: '+250 788 123 456',
      avatar: '👨‍🚀',
    },
    {
      id: 2,
      driver: 'Marie Claire Mukamana',
      vehicle: 'Isuzu Truck',
      capacity: '5 tons',
      price: 'RWF 180,000',
      rating: 4.9,
      eta: '3 hours',
      phone: '+250 789 654 321',
      avatar: '👩‍💼',
    },
    {
      id: 3,
      driver: 'Paul Kagabo',
      vehicle: 'Mahindra Pickup',
      capacity: '1.5 tons',
      price: 'RWF 65,000',
      rating: 4.7,
      eta: '1.5 hours',
      phone: '+250 790 987 654',
      avatar: '👨‍🌾',
    },
  ]);

  const [searchResults, setSearchResults] = useState([
    {
      id: 4,
      driver: 'Alice Uwimana',
      vehicle: 'Nissan NV200',
      capacity: '1 ton',
      price: 'RWF 55,000',
      rating: 4.6,
      eta: '1 hour',
      phone: '+250 785 123 987',
      avatar: '👩‍💼',
    },
    {
      id: 5,
      driver: 'David Nkuranga',
      vehicle: 'Mitsubishi Canter',
      capacity: '3 tons',
      price: 'RWF 120,000',
      rating: 4.8,
      eta: '2.5 hours',
      phone: '+250 786 432 109',
      avatar: '👨‍🔧',
    },
    {
      id: 6,
      driver: 'Grace Uwase',
      vehicle: 'Ford Ranger',
      capacity: '1.8 tons',
      price: 'RWF 75,000',
      rating: 4.9,
      eta: '1.8 hours',
      phone: '+250 787 890 543',
      avatar: '👩‍🌾',
    },
  ]);

  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    if (!formData.pickup || !formData.delivery) {
      toast({
        title: "Missing Information",
        description: "Please fill in pickup and delivery locations",
        variant: "destructive"
      });
      return;
    }
    setShowResults(true);
    toast({
      title: "Search Complete",
      description: `Found ${searchResults.length} available vehicles`,
    });
  };

  const handleBooking = (driver: any) => {
    toast({
      title: "Booking Confirmed!",
      description: `Your transport has been booked with ${driver.driver}. You will receive a confirmation SMS.`,
    });
  };

  return (
    <div className="min-h-screen bg-accent py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Book Transport</h1>
          <p className="text-xl text-muted-foreground">
            Find reliable vehicles to transport your goods to market
          </p>
        </div>

        {/* Random Available Vehicles Row */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Available Now</h2>
            <p className="text-muted-foreground">Quick book these vehicles</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {randomVehicles.map((vehicle) => (
              <Card key={vehicle.id} className="card-elevated hover:scale-102 transition-transform">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{vehicle.avatar}</div>
                      <div>
                        <h3 className="font-semibold text-foreground">{vehicle.driver}</h3>
                        <p className="text-sm text-muted-foreground">{vehicle.vehicle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{vehicle.price}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Package className="h-3 w-3 mr-1" />
                      {vehicle.capacity}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {vehicle.eta}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 mr-1 text-yellow-400 fill-current" />
                      {vehicle.rating}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleBooking(vehicle)}
                    className="w-full btn-hero"
                    size="sm"
                  >
                    Quick Book
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-1">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2 text-primary" />
                  Transport Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="pickup" className="flex items-center mb-2">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    Pickup Location
                  </Label>
                  <Input
                    id="pickup"
                    placeholder="e.g. Musanze, Northern Province"
                    value={formData.pickup}
                    onChange={(e) => handleInputChange('pickup', e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <Label htmlFor="delivery" className="flex items-center mb-2">
                    <MapPin className="h-4 w-4 mr-2 text-success" />
                    Delivery Location
                  </Label>
                  <Input
                    id="delivery"
                    placeholder="e.g. Kimisagara Market, Kigali"
                    value={formData.delivery}
                    onChange={(e) => handleInputChange('delivery', e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <Label htmlFor="goodsType" className="mb-2 block">Type of Goods</Label>
                  <Select value={formData.goodsType} onValueChange={(value) => handleInputChange('goodsType', value)}>
                    <SelectTrigger className="input-field">
                      <SelectValue placeholder="Select goods type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegetables">Vegetables</SelectItem>
                      <SelectItem value="fruits">Fruits</SelectItem>
                      <SelectItem value="grains">Grains</SelectItem>
                      <SelectItem value="dairy">Dairy Products</SelectItem>
                      <SelectItem value="livestock">Livestock</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date" className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <Label htmlFor="time" className="mb-2 block">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="loadSize" className="mb-2 block">Load Size</Label>
                  <Select value={formData.loadSize} onValueChange={(value) => handleInputChange('loadSize', value)}>
                    <SelectTrigger className="input-field">
                      <SelectValue placeholder="Select load size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (under 500kg)</SelectItem>
                      <SelectItem value="medium">Medium (500kg - 1 ton)</SelectItem>
                      <SelectItem value="large">Large (1 - 3 tons)</SelectItem>
                      <SelectItem value="bulk">Bulk (over 3 tons)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleSearch}
                  className="w-full btn-hero"
                >
                  <Truck className="h-5 w-5 mr-2" />
                  Search Vehicles
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-2">
            {showResults ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">Available Vehicles</h2>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>

                <div className="space-y-4">
                  {searchResults.map((result) => (
                    <Card key={result.id} className="card-elevated hover:scale-102 transition-transform">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-4xl">{result.avatar}</div>
                            <div>
                              <h3 className="text-lg font-semibold text-foreground">{result.driver}</h3>
                              <p className="text-muted-foreground">{result.vehicle}</p>
                              <div className="flex items-center mt-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                                <span className="text-sm text-muted-foreground">{result.rating} rating</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{result.price}</div>
                            <div className="text-sm text-muted-foreground">per trip</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
                          <div className="text-center">
                            <Package className="h-5 w-5 text-primary mx-auto mb-1" />
                            <div className="text-sm font-medium">{result.capacity}</div>
                            <div className="text-xs text-muted-foreground">Capacity</div>
                          </div>
                          <div className="text-center">
                            <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
                            <div className="text-sm font-medium">{result.eta}</div>
                            <div className="text-xs text-muted-foreground">ETA</div>
                          </div>
                          <div className="text-center">
                            <Button 
                              onClick={() => handleBooking(result)}
                              className="btn-hero"
                              size="sm"
                            >
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card className="card-elevated">
                <CardContent className="p-12 text-center">
                  <Truck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Search for Available Vehicles
                  </h3>
                  <p className="text-muted-foreground">
                    Fill in your transport details and click search to find available vehicles in your area.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTransport;