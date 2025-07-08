import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Lock, User, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const { toast } = useToast();
  const [loginData, setLoginData] = useState({
    phone: '',
    password: '',
  });
  const [signupData, setSignupData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'farmer',
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.phone || !loginData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Login Successful!",
      description: "Welcome back to AgriMove",
    });
    // Handle login logic here
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.fullName || !signupData.phone || !signupData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Account Created!",
      description: "Your account has been created successfully. You can now login.",
    });
    // Handle signup logic here
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Truck className="h-12 w-12 text-background" />
            <span className="text-4xl font-bold text-background">AgriMove</span>
          </div>
          <p className="text-xl text-background/90">
            Connect with reliable transport solutions
          </p>
        </div>

        <Card className="card-elevated backdrop-blur-sm bg-background/95">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <CardHeader>
                <CardTitle className="text-center">Welcome Back</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <Label htmlFor="loginPhone" className="flex items-center mb-2">
                      <Phone className="h-4 w-4 mr-2 text-primary" />
                      Phone Number
                    </Label>
                    <Input
                      id="loginPhone"
                      placeholder="+254 700 000 000"
                      value={loginData.phone}
                      onChange={(e) => setLoginData(prev => ({ ...prev, phone: e.target.value }))}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="loginPassword" className="flex items-center mb-2">
                      <Lock className="h-4 w-4 mr-2 text-primary" />
                      Password
                    </Label>
                    <Input
                      id="loginPassword"
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      className="input-field"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full btn-hero">
                    Login
                  </Button>

                  <div className="text-center">
                    <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/80">
                      Forgot your password?
                    </Link>
                  </div>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">
                    <Phone className="h-4 w-4 mr-2" />
                    Continue with Phone Number
                  </Button>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="signup">
              <CardHeader>
                <CardTitle className="text-center">Create Account</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-6">
                  <div>
                    <Label htmlFor="userType" className="mb-2 block">I am a</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        type="button"
                        variant={signupData.userType === 'farmer' ? 'default' : 'outline'}
                        onClick={() => setSignupData(prev => ({ ...prev, userType: 'farmer' }))}
                        className="flex items-center justify-center py-3"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Farmer
                      </Button>
                      <Button
                        type="button"
                        variant={signupData.userType === 'driver' ? 'default' : 'outline'}
                        onClick={() => setSignupData(prev => ({ ...prev, userType: 'driver' }))}
                        className="flex items-center justify-center py-3"
                      >
                        <Truck className="h-4 w-4 mr-2" />
                        Driver
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="signupPhone" className="flex items-center mb-2">
                      <Phone className="h-4 w-4 mr-2 text-primary" />
                      Phone Number
                    </Label>
                    <Input
                      id="signupPhone"
                      placeholder="+254 700 000 000"
                      value={signupData.phone}
                      onChange={(e) => setSignupData(prev => ({ ...prev, phone: e.target.value }))}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center mb-2">
                      <Mail className="h-4 w-4 mr-2 text-primary" />
                      Email (Optional)
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signupPassword">Password</Label>
                    <Input
                      id="signupPassword"
                      type="password"
                      placeholder="Create a strong password"
                      value={signupData.password}
                      onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="input-field"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full btn-hero">
                    Create Account
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By creating an account, you agree to our{' '}
                    <Link to="/terms" className="text-primary hover:text-primary/80">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-primary hover:text-primary/80">
                      Privacy Policy
                    </Link>
                  </p>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Login;