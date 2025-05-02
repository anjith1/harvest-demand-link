
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AgroMap from '@/components/map/AgroMap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MapPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('user');

  const handleAddNecessity = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        userType={isLoggedIn ? JSON.parse(localStorage.getItem('user') || '{}').userType : null} 
      />
      
      <main className="flex-grow p-4 md:p-6 bg-agro-cream">
        <div className="container mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Necessity Map</h1>
            <p className="text-gray-600 mt-2">
              Explore agricultural needs in your area and see where demand is clustered
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card className="h-[70vh]">
                <CardHeader className="pb-2">
                  <CardTitle>Interactive Map</CardTitle>
                  <CardDescription>
                    Browse locations and their agricultural needs
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2 h-[calc(100%-80px)]">
                  <AgroMap 
                    initialCenter={[51.505, -0.09]} 
                    initialZoom={12} 
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Map Legend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-agro-green-dark rounded-full mr-2"></div>
                      <span>User Location</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-agro-brown rounded-full mr-2"></div>
                      <span>Farmer Location</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-agro-green-light bg-agro-green-light/20 rounded-full mr-2"></div>
                      <span>Demand Cluster (10km radius)</span>
                    </div>
                    
                    <div className="pt-4 border-t mt-4">
                      <h4 className="font-medium mb-2">Need to add your necessity?</h4>
                      <Button
                        className="w-full bg-agro-green-dark hover:bg-agro-green-light text-white"
                        onClick={handleAddNecessity}
                      >
                        {isLoggedIn ? 'Add Your Necessity' : 'Log in to Add'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Priority Areas</CardTitle>
                  <CardDescription>
                    Areas with high demand
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-2 border rounded-md">
                      <div className="flex justify-between">
                        <span className="font-medium">Eastside District</span>
                        <span className="text-sm bg-red-100 text-red-700 px-2 py-0.5 rounded">High</span>
                      </div>
                      <p className="text-sm text-gray-500">Rice, Vegetables</p>
                    </div>
                    <div className="p-2 border rounded-md">
                      <div className="flex justify-between">
                        <span className="font-medium">Central Community</span>
                        <span className="text-sm bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Medium</span>
                      </div>
                      <p className="text-sm text-gray-500">Clean Water</p>
                    </div>
                    <div className="p-2 border rounded-md">
                      <div className="flex justify-between">
                        <span className="font-medium">Western Suburbs</span>
                        <span className="text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded">Low</span>
                      </div>
                      <p className="text-sm text-gray-500">Dairy Products</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MapPage;
