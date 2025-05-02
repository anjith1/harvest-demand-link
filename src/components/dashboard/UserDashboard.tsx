
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AgroMap from '../map/AgroMap';
import { MapPin, Plus, Clock, Check, X } from 'lucide-react';

// Define the necessity request interface
interface NecessityRequest {
  id: string;
  items: { name: string; quantity: number; unit: string }[];
  location: {
    name: string;
    coordinates: [number, number];
  };
  status: 'pending' | 'fulfilled' | 'rejected';
  createdAt: Date;
}

// Utility function to generate mock data
const generateMockRequests = (): NecessityRequest[] => {
  return [
    {
      id: '1',
      items: [
        { name: 'Tomatoes', quantity: 10, unit: 'kg' },
        { name: 'Potatoes', quantity: 5, unit: 'kg' }
      ],
      location: {
        name: 'Community Center',
        coordinates: [51.505, -0.09]
      },
      status: 'pending',
      createdAt: new Date('2023-04-15')
    },
    {
      id: '2',
      items: [
        { name: 'Rice', quantity: 20, unit: 'kg' }
      ],
      location: {
        name: 'Local School',
        coordinates: [51.51, -0.1]
      },
      status: 'fulfilled',
      createdAt: new Date('2023-04-10')
    }
  ];
};

const UserDashboard = () => {
  const [requests, setRequests] = useState<NecessityRequest[]>([]);
  const [activeTab, setActiveTab] = useState('requests');
  const { toast } = useToast();
  const [userData, setUserData] = useState<{name: string, email: string}>({
    name: '',
    email: ''
  });
  
  useEffect(() => {
    // In a real app, you'd fetch the user's necessity requests from an API
    setRequests(generateMockRequests());
    
    // Get user data from localStorage if available
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData({
          name: parsedUser.name || 'User',
          email: parsedUser.email || ''
        });
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }, []);

  const handleNewRequest = () => {
    setActiveTab('map');
    toast({
      title: "Create a new request",
      description: "Click anywhere on the map to mark your location and add your needs."
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-amber-500';
      case 'fulfilled':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'fulfilled':
        return <Check className="h-4 w-4" />;
      case 'rejected':
        return <X className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Welcome, {userData.name}</CardTitle>
              <CardDescription>{userData.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <Button 
                  className="bg-agro-green-dark hover:bg-agro-green-light w-full"
                  onClick={handleNewRequest}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Request
                </Button>
                <Button variant="outline" className="w-full">
                  <MapPin className="mr-2 h-4 w-4" />
                  My Locations
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="requests">My Requests</TabsTrigger>
              <TabsTrigger value="map">Area Map</TabsTrigger>
            </TabsList>
            <TabsContent value="requests">
              <Card>
                <CardHeader>
                  <CardTitle>Your Necessity Requests</CardTitle>
                  <CardDescription>
                    Track the status of your necessity requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {requests.length > 0 ? (
                      requests.map((request) => (
                        <div 
                          key={request.id} 
                          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{request.location.name}</h3>
                              <p className="text-sm text-gray-500">
                                {new Date(request.createdAt).toLocaleDateString()}
                              </p>
                              <ul className="mt-2 space-y-1">
                                {request.items.map((item, index) => (
                                  <li key={index} className="text-sm">
                                    {item.quantity} {item.unit} of {item.name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className={`flex items-center ${getStatusColor(request.status)}`}>
                              {getStatusIcon(request.status)}
                              <span className="ml-1 capitalize">{request.status}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">You haven't created any requests yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="map">
              <Card>
                <CardHeader>
                  <CardTitle>Area Map</CardTitle>
                  <CardDescription>
                    View necessities in your area
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ height: '500px' }}>
                    <AgroMap 
                      initialCenter={[51.505, -0.09]} 
                      initialZoom={12} 
                      editable={true}
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

export default UserDashboard;
