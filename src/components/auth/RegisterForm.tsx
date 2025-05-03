import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FarmerFields {
  farmName: string;
  farmLocation: string;
  productsOffered: string;
}

interface ConsumerFields {
  address: string;
  city: string;
  zipCode: string;
}

const RegisterForm = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'consumer'
  });
  
  const [farmerFields, setFarmerFields] = useState<FarmerFields>({
    farmName: '',
    farmLocation: '',
    productsOffered: ''
  });
  
  const [consumerFields, setConsumerFields] = useState<ConsumerFields>({
    address: '',
    city: '',
    zipCode: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const role = searchParams.get('role');
    if (role && ['consumer', 'farmer', 'admin'].includes(role)) {
      setFormData(prev => ({ ...prev, userType: role }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFarmerFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFarmerFields(prev => ({ ...prev, [name]: value }));
  };

  const handleConsumerFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConsumerFields(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, userType: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.userType,
          ...(formData.userType === 'farmer' ? farmerFields : {}),
          ...(formData.userType === 'consumer' ? consumerFields : {})
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const data = await response.json();
      
      // Store the token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: data.user._id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        isLoggedIn: true
      }));
      
      toast({
        title: "Registration successful!",
        description: `Welcome to AgroConnect, ${data.user.name}!`,
      });

      // Redirect based on user role
      if (data.user.role === "admin") {
        navigate('/admin/dashboard');
      } else if (data.user.role === "farmer") {
        navigate('/farmer/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "There was a problem creating your account.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
        <CardDescription className="text-center">
          Choose your account type
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userType">Account Type</Label>
            <Select
              value={formData.userType}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consumer">Consumer</SelectItem>
                <SelectItem value="farmer">Farmer/Supplier</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Farmer-specific fields */}
          {formData.userType === 'farmer' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="farmName">Farm Name</Label>
                <Input
                  id="farmName"
                  name="farmName"
                  type="text"
                  placeholder="Your Farm Name"
                  value={farmerFields.farmName}
                  onChange={handleFarmerFieldChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="farmLocation">Farm Location</Label>
                <Input
                  id="farmLocation"
                  name="farmLocation"
                  type="text"
                  placeholder="City, State"
                  value={farmerFields.farmLocation}
                  onChange={handleFarmerFieldChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productsOffered">Products Offered</Label>
                <Input
                  id="productsOffered"
                  name="productsOffered"
                  type="text"
                  placeholder="Vegetables, Fruits, Dairy, etc."
                  value={farmerFields.productsOffered}
                  onChange={handleFarmerFieldChange}
                  required
                />
              </div>
            </>
          )}

          {/* Consumer-specific fields */}
          {formData.userType === 'consumer' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Street Address"
                  value={consumerFields.address}
                  onChange={handleConsumerFieldChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Your City"
                  value={consumerFields.city}
                  onChange={handleConsumerFieldChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  placeholder="12345"
                  value={consumerFields.zipCode}
                  onChange={handleConsumerFieldChange}
                  required
                />
              </div>
            </>
          )}

          <Button 
            type="submit" 
            className="w-full bg-agro-green-dark hover:bg-agro-green-light"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-agro-green-dark hover:underline">
            Log in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
