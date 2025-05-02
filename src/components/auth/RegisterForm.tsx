
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'user',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      
      // For demo purposes, we'll simulate successful registration
      setTimeout(() => {
        toast({
          title: "Registration successful!",
          description: "Your account has been created.",
        });
        
        // Set user session (in a real app, you would store a JWT token)
        localStorage.setItem('user', JSON.stringify({
          email: formData.email,
          userType: formData.userType,
          isLoggedIn: true,
          name: formData.name
        }));
        
        // Redirect based on user type
        if (formData.userType === "farmer") {
          navigate('/farmer/onboarding');
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
          Enter your details to create your AgroConnect account
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
          <div className="space-y-2">
            <Label>Account Type</Label>
            <RadioGroup
              value={formData.userType}
              onValueChange={handleUserTypeChange}
              className="flex flex-col space-y-1 pt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="user" id="user" />
                <Label htmlFor="user" className="font-normal">General User</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="farmer" id="farmer" />
                <Label htmlFor="farmer" className="font-normal">Farmer/Supplier</Label>
              </div>
            </RadioGroup>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-agro-green-dark hover:bg-agro-green-light text-white" 
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-agro-green-dark hover:underline font-medium">
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
