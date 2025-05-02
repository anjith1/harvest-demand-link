
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Wheat, Building } from "lucide-react";

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'consumer' | 'farmer' | 'admin') => {
    // Store the selected role in localStorage
    localStorage.setItem('selectedRole', role);
    
    // Redirect to the appropriate registration page
    navigate(`/register?role=${role}`);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to AgroConnect</h1>
        <p className="text-xl text-gray-600">
          Please select your role to continue
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="overflow-hidden transition-all hover:shadow-lg cursor-pointer" onClick={() => handleRoleSelect('consumer')}>
          <div className="h-2 bg-blue-500"></div>
          <CardHeader className="text-center">
            <CardTitle>Consumer</CardTitle>
            <CardDescription>Need agricultural supplies</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <User className="h-16 w-16 text-blue-500 mb-4" />
            <p className="text-center text-gray-600 mb-4">
              Request agricultural products and connect with local farmers
            </p>
            <Button className="bg-blue-500 hover:bg-blue-600">
              Continue as Consumer
            </Button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all hover:shadow-lg cursor-pointer" onClick={() => handleRoleSelect('farmer')}>
          <div className="h-2 bg-agro-green-dark"></div>
          <CardHeader className="text-center">
            <CardTitle>Farmer</CardTitle>
            <CardDescription>Supply agricultural products</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Wheat className="h-16 w-16 text-agro-green-dark mb-4" />
            <p className="text-center text-gray-600 mb-4">
              List your products and fulfill consumer demands efficiently
            </p>
            <Button className="bg-agro-green-dark hover:bg-agro-green-light">
              Continue as Farmer
            </Button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all hover:shadow-lg cursor-pointer" onClick={() => handleRoleSelect('admin')}>
          <div className="h-2 bg-purple-600"></div>
          <CardHeader className="text-center">
            <CardTitle>Administrator</CardTitle>
            <CardDescription>Manage the platform</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Building className="h-16 w-16 text-purple-600 mb-4" />
            <p className="text-center text-gray-600 mb-4">
              Oversee operations, verify users, and manage requests
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Continue as Admin
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoleSelection;
