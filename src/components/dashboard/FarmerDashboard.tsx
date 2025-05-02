
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MapPin, CheckCircle, Plus, Package, Bell } from 'lucide-react';
import AgroMap from '../map/AgroMap';

// Interfaces
interface Product {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

interface ClusterDemand {
  id: string;
  item: string;
  totalDemand: number;
  unit: string;
  locations: number;
  distance: number;
  coordinates: [number, number];
}

// Mock data
const generateMockProducts = (): Product[] => [
  { id: '1', name: 'Tomatoes', quantity: 100, unit: 'kg', price: 2.5 },
  { id: '2', name: 'Potatoes', quantity: 200, unit: 'kg', price: 1.8 },
  { id: '3', name: 'Onions', quantity: 50, unit: 'kg', price: 2.0 },
];

const generateMockDemands = (): ClusterDemand[] => [
  { 
    id: '1', 
    item: 'Tomatoes', 
    totalDemand: 50, 
    unit: 'kg', 
    locations: 4, 
    distance: 5.3,
    coordinates: [51.515, -0.09] 
  },
  { 
    id: '2', 
    item: 'Rice', 
    totalDemand: 75, 
    unit: 'kg', 
    locations: 3, 
    distance: 7.8,
    coordinates: [51.505, -0.1] 
  },
  { 
    id: '3', 
    item: 'Potatoes', 
    totalDemand: 35, 
    unit: 'kg', 
    locations: 3, 
    distance: 3.2,
    coordinates: [51.51, -0.085] 
  },
];

const FarmerDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [demands, setDemands] = useState<ClusterDemand[]>([]);
  const { toast } = useToast();
  const [farmerData, setFarmerData] = useState({
    name: 'John Smith',
    farm: 'Green Valley Farms',
    verified: true,
  });
  
  useEffect(() => {
    // In a real app, you'd fetch the farmer's products and nearby demands from an API
    setProducts(generateMockProducts());
    setDemands(generateMockDemands());
    
    // Get user data from localStorage if available
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setFarmerData({
          name: parsedUser.name || 'Farmer',
          farm: 'Your Farm',
          verified: true
        });
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }, []);

  const handleAddProduct = () => {
    // In a real app, this would navigate to a form or open a modal
    toast({
      title: "Add a new product",
      description: "What can you supply to communities in need?"
    });
  };

  const handleAcceptRequest = (demand: ClusterDemand) => {
    toast({
      title: "Request accepted!",
      description: `You've committed to supply ${demand.totalDemand} ${demand.unit} of ${demand.item}.`
    });
  };

  // Mock location for the farmer
  const farmerLocation: [number, number] = [51.505, -0.09];

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>{farmerData.name}</CardTitle>
                {farmerData.verified && (
                  <Badge className="bg-agro-green-dark">
                    <CheckCircle className="h-3 w-3 mr-1" /> Verified
                  </Badge>
                )}
              </div>
              <CardDescription>{farmerData.farm}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <Button 
                  className="bg-agro-green-dark hover:bg-agro-green-light w-full"
                  onClick={handleAddProduct}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
                <Button variant="outline" className="w-full">
                  <MapPin className="mr-2 h-4 w-4" />
                  Update Location
                </Button>
                <div className="bg-muted p-3 rounded-lg mt-2">
                  <h3 className="font-medium text-sm mb-2">Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-white p-2 rounded">
                      <p className="text-2xl font-bold text-agro-green-dark">{products.length}</p>
                      <p className="text-xs text-gray-500">Products</p>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <p className="text-2xl font-bold text-agro-green-dark">{demands.length}</p>
                      <p className="text-xs text-gray-500">Nearby Demands</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Tabs defaultValue="demands">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="demands">Nearby Demands</TabsTrigger>
              <TabsTrigger value="products">My Products</TabsTrigger>
              <TabsTrigger value="map">Area Map</TabsTrigger>
            </TabsList>
            
            <TabsContent value="demands">
              <Card>
                <CardHeader>
                  <CardTitle>Priority Demands Near You</CardTitle>
                  <CardDescription>
                    Clusters of requests within 10km of your location
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {demands.map((demand) => (
                      <div 
                        key={demand.id} 
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{demand.item}</h3>
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="h-3 w-3 mr-1" /> 
                              {demand.distance} km away
                            </div>
                            <div className="mt-2">
                              <p className="text-sm">
                                <span className="font-medium">Total Demand:</span> {demand.totalDemand} {demand.unit}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Communities:</span> {demand.locations}
                              </p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-agro-green-dark hover:bg-agro-green-light"
                            onClick={() => handleAcceptRequest(demand)}
                          >
                            Supply
                          </Button>
                        </div>
                      </div>
                    ))}
                    {demands.length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">No priority demands in your area</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Your Products</CardTitle>
                  <CardDescription>
                    Manage your available agricultural supplies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div 
                        key={product.id} 
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex justify-between items-center"
                      >
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-gray-500">
                            {product.quantity} {product.unit} available
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-agro-green-dark mr-2">
                            ${product.price.toFixed(2)}/{product.unit}
                          </span>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                    {products.length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">You haven't added any products yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="map">
              <Card>
                <CardHeader>
                  <CardTitle>Demand Map</CardTitle>
                  <CardDescription>
                    View clusters of demand in your area
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <AgroMap 
                      initialCenter={farmerLocation} 
                      initialZoom={11} 
                      clusterMode={true}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
