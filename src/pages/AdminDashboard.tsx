import { useState } from 'react';
import { Users, Truck, Package, DollarSign, TrendingUp, Calendar, Star, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  const [stats] = useState({
    totalBookings: 156,
    activeDrivers: 48,
    totalRevenue: 2450000,
    deliveredGoods: 1250,
    dailyBookings: 12,
    weeklyGrowth: 15.3,
  });

  const [recentBookings] = useState([
    {
      id: 'BK156',
      farmer: 'Sarah Kimani',
      driver: 'James Kiprotich',
      pickup: 'Nakuru',
      delivery: 'Nairobi',
      status: 'in-transit',
      amount: 3500,
      date: '2024-01-15',
    },
    {
      id: 'BK155',
      farmer: 'John Mwangi',
      driver: 'Mary Wanjiku',
      pickup: 'Eldoret',
      delivery: 'Kisumu',
      status: 'completed',
      amount: 7200,
      date: '2024-01-15',
    },
    {
      id: 'BK154',
      farmer: 'Grace Achieng',
      driver: 'Peter Muthee',
      pickup: 'Meru',
      delivery: 'Nairobi',
      status: 'confirmed',
      amount: 4100,
      date: '2024-01-15',
    },
  ]);

  const [drivers] = useState([
    {
      id: 'DR001',
      name: 'James Kiprotich',
      vehicle: 'Toyota Hilux',
      rating: 4.8,
      trips: 23,
      earnings: 125000,
      phone: '+254 712 345 678',
      status: 'active',
      avatar: '👨‍🚀',
    },
    {
      id: 'DR002',
      name: 'Mary Wanjiku',
      vehicle: 'Isuzu Truck',
      rating: 4.9,
      trips: 31,
      earnings: 189000,
      phone: '+254 721 876 543',
      status: 'active',
      avatar: '👩‍💼',
    },
    {
      id: 'DR003',
      name: 'Peter Muthee',
      vehicle: 'Mahindra Pickup',
      rating: 4.7,
      trips: 18,
      earnings: 98000,
      phone: '+254 733 654 321',
      status: 'inactive',
      avatar: '👨‍🌾',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in-transit': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-accent py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Admin Dashboard</h1>
          <p className="text-xl text-muted-foreground">
            Monitor platform activity and manage operations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalBookings}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Drivers</p>
                  <p className="text-2xl font-bold text-foreground">{stats.activeDrivers}</p>
                </div>
                <Truck className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalRevenue)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Goods Delivered</p>
                  <p className="text-2xl font-bold text-foreground">{stats.deliveredGoods} tons</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Daily Bookings</p>
                  <p className="text-2xl font-bold text-foreground">{stats.dailyBookings}</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Growth</p>
                  <p className="text-2xl font-bold text-success">+{stats.weeklyGrowth}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
            <TabsTrigger value="drivers">Registered Drivers</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="font-medium text-foreground">#{booking.id}</h4>
                            <p className="text-sm text-muted-foreground">
                              {booking.farmer} → {booking.driver}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">{booking.pickup}</span>
                            <span className="text-muted-foreground">→</span>
                            <span className="text-sm text-muted-foreground">{booking.delivery}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium text-foreground">{formatCurrency(booking.amount)}</p>
                          <p className="text-sm text-muted-foreground">{booking.date}</p>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drivers" className="space-y-4">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Registered Drivers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {drivers.map((driver) => (
                    <div key={driver.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{driver.avatar}</div>
                        <div>
                          <h4 className="font-medium text-foreground">{driver.name}</h4>
                          <p className="text-sm text-muted-foreground">{driver.vehicle}</p>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-sm text-muted-foreground">{driver.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="font-medium text-foreground">{driver.trips}</p>
                          <p className="text-sm text-muted-foreground">Trips</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-foreground">{formatCurrency(driver.earnings)}</p>
                          <p className="text-sm text-muted-foreground">Earnings</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{driver.phone}</span>
                        </div>
                        <Badge className={getStatusColor(driver.status)}>
                          {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Contact
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;