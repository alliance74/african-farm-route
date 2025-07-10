import { Link } from 'react-router-dom';
import { Truck, Users, MapPin, Clock, Star, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-image.jpg';

const Home = () => {
  const stats = [
    { label: 'Tons Delivered', value: '500+', icon: Truck },
    { label: 'Active Farmers', value: '1,200+', icon: Users },
    { label: 'Countries Served', value: '3+', icon: MapPin },
    { label: 'Avg. Delivery Time', value: '2 hrs', icon: Clock },
  ];

  const testimonials = [
    {
      name: 'Sarah Kimani',
      location: 'Nakuru, Kenya',
      text: 'AgriMove helped me get my tomatoes to market 50% faster. My profits have increased significantly!',
      rating: 5,
    },
    {
      name: 'John Mwangi',
      location: 'Eldoret, Kenya',
      text: 'As a truck driver, this platform connects me with farmers who need transport. Great income source!',
      rating: 5,
    },
    {
      name: 'Mary Achieng',
      location: 'Kisumu, Kenya',
      text: 'Reliable, affordable, and easy to use. AgriMove is exactly what we farmers needed.',
      rating: 5,
    },
  ];

  const features = [
    {
      title: 'Quick Booking',
      description: 'Book transport in minutes with our simple booking system',
      icon: Clock,
    },
    {
      title: 'Verified Drivers',
      description: 'All drivers are vetted and rated by the community',
      icon: CheckCircle,
    },
    {
      title: 'Fair Pricing',
      description: 'Transparent pricing with no hidden fees',
      icon: Star,
    },
    {
      title: 'Live Tracking',
      description: 'Track your goods in real-time from farm to market',
      icon: MapPin,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/40" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-background mb-6 leading-tight">
            Connect Farmers to Markets
          </h1>
          <p className="text-xl md:text-2xl text-background/90 mb-8 max-w-2xl mx-auto">
            Book Transport Anytime — Get your farm products to market efficiently and affordably
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button className="btn-hero">
                <Truck className="h-5 w-5 mr-2" />
                Book a Vehicle
              </Button>
            </Link>
            <Link to="/login">
              <Button className="bg-background/20 backdrop-blur-sm text-background border-2 border-background/30 hover:bg-background/30 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300">
                Register as Driver
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose AgriMove?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make it easy for farmers to get their products to market while providing drivers with reliable income opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-elevated text-center hover:scale-105">
                <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-muted-foreground">
              Real stories from farmers and drivers across Africa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card-elevated">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-background mb-6">
            Ready to Transform Your Farm Business?
          </h2>
          <p className="text-xl text-background/90 mb-8">
            Join thousands of farmers who trust AgriMove for their transport needs
          </p>
          <Link to="/book">
            <Button className="bg-background text-primary hover:bg-background/90 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 hover:scale-105">
              Get Started Today
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;