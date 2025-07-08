import { useState } from 'react';
import { Truck, User, Phone, MapPin, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const RegisterVehicle = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    // Driver Info
    fullName: '',
    phoneNumber: '',
    email: '',
    licenseNumber: '',
    experience: '',
    
    // Vehicle Info
    vehicleType: '',
    vehicleMake: '',
    vehicleModel: '',
    year: '',
    plateNumber: '',
    capacity: '',
    
    // Service Info
    serviceAreas: '',
    specialization: '',
    pricePerKm: '',
    availability: '',
    additionalInfo: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.phoneNumber || !formData.vehicleType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Registration Successful!",
      description: "Your vehicle has been registered. We'll review your application and contact you within 24 hours.",
    });

    // Reset form
    setFormData({
      fullName: '', phoneNumber: '', email: '', licenseNumber: '', experience: '',
      vehicleType: '', vehicleMake: '', vehicleModel: '', year: '', plateNumber: '', capacity: '',
      serviceAreas: '', specialization: '', pricePerKm: '', availability: '', additionalInfo: '',
    });
  };

  return (
    <div className="min-h-screen bg-accent py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Register Your Vehicle</h1>
          <p className="text-xl text-muted-foreground">
            Join our network of trusted drivers and start earning with AgriMove
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Driver Information */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                Driver Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber" className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phoneNumber"
                    placeholder="+254 700 000 000"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <Label htmlFor="licenseNumber">Driving License Number</Label>
                  <Input
                    id="licenseNumber"
                    placeholder="Enter license number"
                    value={formData.licenseNumber}
                    onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="experience">Years of Driving Experience</Label>
                <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                  <SelectTrigger className="input-field">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2">1-2 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Information */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="h-5 w-5 mr-2 text-primary" />
                Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="vehicleType">Vehicle Type *</Label>
                  <Select value={formData.vehicleType} onValueChange={(value) => handleInputChange('vehicleType', value)}>
                    <SelectTrigger className="input-field">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pickup">Pickup Truck</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="motorcycle">Motorcycle</SelectItem>
                      <SelectItem value="tractor">Tractor with Trailer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="capacity">Load Capacity</Label>
                  <Select value={formData.capacity} onValueChange={(value) => handleInputChange('capacity', value)}>
                    <SelectTrigger className="input-field">
                      <SelectValue placeholder="Select capacity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">Up to 0.5 tons</SelectItem>
                      <SelectItem value="1">Up to 1 ton</SelectItem>
                      <SelectItem value="2">Up to 2 tons</SelectItem>
                      <SelectItem value="5">Up to 5 tons</SelectItem>
                      <SelectItem value="10">Up to 10 tons</SelectItem>
                      <SelectItem value="10+">More than 10 tons</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="vehicleMake">Vehicle Make</Label>
                  <Input
                    id="vehicleMake"
                    placeholder="e.g., Toyota, Isuzu, Mahindra"
                    value={formData.vehicleMake}
                    onChange={(e) => handleInputChange('vehicleMake', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleModel">Vehicle Model</Label>
                  <Input
                    id="vehicleModel"
                    placeholder="e.g., Hilux, Forward, Bolero"
                    value={formData.vehicleModel}
                    onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year of Manufacture</Label>
                  <Input
                    id="year"
                    placeholder="e.g., 2020"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <Label htmlFor="plateNumber">License Plate Number</Label>
                  <Input
                    id="plateNumber"
                    placeholder="e.g., KAA 123A"
                    value={formData.plateNumber}
                    onChange={(e) => handleInputChange('plateNumber', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Information */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                Service Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="serviceAreas">Service Areas</Label>
                <Input
                  id="serviceAreas"
                  placeholder="e.g., Nairobi, Kiambu, Nakuru"
                  value={formData.serviceAreas}
                  onChange={(e) => handleInputChange('serviceAreas', e.target.value)}
                  className="input-field"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  List the counties or areas where you provide transport services
                </p>
              </div>
              
              <div>
                <Label htmlFor="specialization">Specialization (Optional)</Label>
                <Select value={formData.specialization} onValueChange={(value) => handleInputChange('specialization', value)}>
                  <SelectTrigger className="input-field">
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Cargo</SelectItem>
                    <SelectItem value="refrigerated">Refrigerated Goods</SelectItem>
                    <SelectItem value="livestock">Livestock Transport</SelectItem>
                    <SelectItem value="bulk">Bulk Commodities</SelectItem>
                    <SelectItem value="fragile">Fragile Goods</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="pricePerKm">Rate per Kilometer (KSh)</Label>
                  <Input
                    id="pricePerKm"
                    placeholder="e.g., 50"
                    value={formData.pricePerKm}
                    onChange={(e) => handleInputChange('pricePerKm', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <Label htmlFor="availability">Availability</Label>
                  <Select value={formData.availability} onValueChange={(value) => handleInputChange('availability', value)}>
                    <SelectTrigger className="input-field">
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fulltime">Full-time (7 days)</SelectItem>
                      <SelectItem value="weekdays">Weekdays only</SelectItem>
                      <SelectItem value="weekends">Weekends only</SelectItem>
                      <SelectItem value="flexible">Flexible schedule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Any additional information about your services, special features of your vehicle, etc."
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                  className="input-field min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Card className="card-elevated bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-5 w-5 text-success mr-2" />
                <h3 className="text-lg font-semibold">Ready to Register?</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                By registering, you agree to our terms of service and commit to providing reliable transport services to farmers.
              </p>
              <Button type="submit" className="btn-hero w-full">
                <FileText className="h-5 w-5 mr-2" />
                Register My Vehicle
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default RegisterVehicle;