
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
  const roleParam = searchParams.get('role');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: roleParam || 'user',
  });
  
  const [farmerFields, setFarmerFields] = useState<FarmerFields>({
    farmName: '',
    farmLocation: '',
    productsOffered: '',
  });
  
  const [consumerFields, setConsumerFields] = useState<ConsumerFields>({
    address: '',
    city: '',
    zipCode: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Update the user type whenever the URL parameter changes
    if (roleParam) {
      setFormData(prev => ({ ...prev, userType: roleParam }));
    }
  }, [roleParam]);

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

  const handleUserTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, userType: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to register the user
      console.log('Registering with:', formData);
      
      // Add role-specific fields to the data being sent
      let additionalData = {};
      if (formData.userType === 'farmer') {
        console.log('Farmer fields:', farmerFields);
        additionalData = farmerFields;
      } else if (formData.userType === 'user' || formData.userType === 'consumer') {
        console.log('Consumer fields:', consumerFields);
        additionalData = consumerFields;
      }
      
      // For demo purposes, we'll simulate successful registration
      setTimeout(() => {
        toast({
          title: "Registration successful!",
          description: "Your account has been created.",
        });
        
        // Set user session (in a real app, you would store a JWT token)
        localStorage.setItem('user', JSON.stringify({
          email: formData.email,
          userType: formData.userType === 'consumer' ? 'user' : formData.userType,
          isLoggedIn: true,
          name: formData.name,
          ...additionalData
        }));
        
        // Remove the selected role from localStorage
        localStorage.removeItem('selectedRole');
        
        // Redirect based on user type
        if (formData.userType === "farmer") {
          navigate('/farmer');
        } else if (formData.userType === "admin") {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 1000);
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "There was an error creating your account.",
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
          {formData.userType === 'farmer' ? 'Register as a Farmer/Supplier' : 
           formData.userType === 'admin' ? 'Register as an Administrator' : 
           'Register as a Consumer'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="your@email.com"
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
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Display different fields based on the user type */}
          {(formData.userType === 'user' || formData.userType === 'consumer') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="123 Main St"
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
          
          {formData.userType === 'farmer' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="farmName">Farm Name</Label>
                <Input
                  id="farmName"
                  name="farmName"
                  type="text"
                  placeholder="Green Acres Farm"
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
                  placeholder="County, State"
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
          
          <Button 
            type="submit" 
            className={`w-full text-white ${
              formData.userType === 'farmer' ? 'bg-agro-green-dark hover:bg-agro-green-light' : 
              formData.userType === 'admin' ? 'bg-purple-600 hover:bg-purple-700' :
              'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center flex-col space-y-2">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-agro-green-dark hover:underline font-medium">
            Log in
          </Link>
        </p>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
        >
          Back to role selection
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
