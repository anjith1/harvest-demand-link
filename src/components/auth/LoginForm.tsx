
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('user');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to authenticate
      console.log('Logging in with:', { email, password, userType });
      
      // For demo purposes, we'll simulate successful login
      setTimeout(() => {
        // In a real app, the userType would be returned from the backend
        // Here we're just using the selected userType
        
        // Set user session (in a real app, you would store a JWT token)
        localStorage.setItem('user', JSON.stringify({
          email,
          userType,
          isLoggedIn: true
        }));
        
        toast({
          title: "Logged in successfully!",
          description: `Welcome back ${email}`,
        });
        
        // Redirect based on user type
        if (userType === "admin") {
          navigate('/admin');
        } else if (userType === "farmer") {
          navigate('/farmer');
        } else {
          navigate('/dashboard');
        }
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Enter your email and password to log in
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="text-sm text-agro-green-dark hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userType">Login as</Label>
            <Select value={userType} onValueChange={setUserType}>
              <SelectTrigger id="userType">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Consumer</SelectItem>
                <SelectItem value="farmer">Farmer</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            type="submit" 
            className={`w-full text-white ${
              userType === 'farmer' ? 'bg-agro-green-dark hover:bg-agro-green-light' : 
              userType === 'admin' ? 'bg-purple-600 hover:bg-purple-700' :
              'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log in"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center flex-col space-y-2">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="text-agro-green-dark hover:underline font-medium">
            Sign up
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

export default LoginForm;
