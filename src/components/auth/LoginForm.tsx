
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to authenticate
      console.log('Logging in with:', { email, password });
      
      // For demo purposes, we'll simulate successful login
      setTimeout(() => {
        // Determine user type based on email (in a real app, this would come from the backend)
        let userType = "user";
        if (email.includes("admin")) {
          userType = "admin";
        } else if (email.includes("farmer")) {
          userType = "farmer";
        }
        
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
          <Button 
            type="submit" 
            className="w-full bg-agro-green-dark hover:bg-agro-green-light text-white" 
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log in"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="text-agro-green-dark hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
