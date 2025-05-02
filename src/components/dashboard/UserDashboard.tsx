import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Clock, Check, X } from 'lucide-react';
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5000';

// Add axios interceptor to include token in all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface User {
  _id: string;
  name: string;
  email: string;
}

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

const UserDashboard = () => {
  const [requests, setRequests] = useState<NecessityRequest[]>([]);
  const [activeTab, setActiveTab] = useState('requests');
  const { toast } = useToast();
  const [userData, setUserData] = useState<User | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newRequest, setNewRequest] = useState({
    item: '',
    quantity: '',
    unit: '',
    urgency: '',
    time: '',
    lat: '',
    lng: '',
  });
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: 'Authentication Error',
        description: 'Please log in to access the dashboard.',
        variant: 'destructive'
      });
      return;
    }

    // Fetch user data from MongoDB
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data) {
          setUserData(response.data);
          console.log('User data loaded:', response.data);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          toast({
            title: 'Session Expired',
            description: 'Please log in again.',
            variant: 'destructive'
          });
          // Optionally redirect to login page
          // window.location.href = '/login';
        } else {
          toast({
            title: 'Error',
            description: 'Failed to load user data. Please try again.'
          });
        }
      }
    };

    // Test API connection
    const testConnection = async () => {
      try {
        const response = await axios.get('/api/test');
        console.log('API connection test:', response.data);
      } catch (error) {
        console.error('API connection test failed:', error);
        toast({
          title: 'Error',
          description: 'Cannot connect to server. Please try again later.'
        });
      }
    };
    
    testConnection();
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData?._id) {
      fetchRequests();
    }
  }, [userData]);

  const fetchRequests = async () => {
    if (!userData?._id) {
      console.error('No user ID available');
      return;
    }

    try {
      const response = await axios.get('/api/necessity-requests/my-requests');
      console.log('Fetched requests:', response.data);
      setRequests(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch your requests. Please try again.'
      });
      setRequests([]);
    }
  };

  const handleNewRequest = () => {
    setShowAddDialog(true);
  };

  const handleDialogChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewRequest({ ...newRequest, [e.target.name]: e.target.value });
  };

  const handleDialogSubmit = async () => {
    if (!userData?._id || !userData?.name) {
      toast({ 
        title: 'Error', 
        description: 'Please log in to create a request.' 
      });
      return;
    }

    if (!newRequest.item || !newRequest.quantity || !newRequest.unit || !newRequest.urgency || !newRequest.time || !newRequest.lat || !newRequest.lng) {
      toast({ title: 'Error', description: 'Please fill all fields.' });
      return;
    }

    try {
      const requestData = {
        items: [{ 
          name: newRequest.item, 
          quantity: Number(newRequest.quantity), 
          unit: newRequest.unit 
        }],
        urgency: newRequest.urgency.toLowerCase(),
        timeNeeded: newRequest.time,
        location: {
          name: `Lat: ${newRequest.lat}, Lng: ${newRequest.lng}`,
          coordinates: [Number(newRequest.lat), Number(newRequest.lng)]
        }
      };

      console.log('Sending request data:', requestData);
      const response = await axios.post('/api/necessity-requests', requestData);
      console.log('Server response:', response.data);
      
      if (response.data) {
        setShowAddDialog(false);
        setNewRequest({ item: '', quantity: '', unit: '', urgency: '', time: '', lat: '', lng: '' });
        fetchRequests();
        toast({ 
          title: 'Success', 
          description: 'Your necessity request has been added successfully.' 
        });
      }
    } catch (error) {
      console.error('Failed to create request:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create request. Please try again.';
      toast({
        title: 'Error',
        description: errorMessage
      });
    }
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
              <CardTitle>Welcome, {userData?.name}</CardTitle>
              <CardDescription>{userData?.email}</CardDescription>
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
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
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
        </div>
      </div>
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Necessity Request</DialogTitle>
            <DialogDescription>
              Fill in the details of your necessity request. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Item</Label>
            <Input 
              name="item" 
              value={newRequest.item} 
              onChange={handleDialogChange}
              placeholder="e.g., Tomatoes, Rice, etc."
            />
            <Label>Quantity</Label>
            <Input 
              name="quantity" 
              type="number" 
              value={newRequest.quantity} 
              onChange={handleDialogChange}
              placeholder="Enter quantity"
            />
            <Label>Unit</Label>
            <Input 
              name="unit" 
              value={newRequest.unit} 
              onChange={handleDialogChange}
              placeholder="e.g., kg, pieces"
            />
            <Label>Urgency</Label>
            <Input 
              name="urgency" 
              value={newRequest.urgency} 
              onChange={handleDialogChange} 
              placeholder="High, Medium, or Low"
            />
            <Label>Time Needed</Label>
            <Input 
              name="time" 
              value={newRequest.time} 
              onChange={handleDialogChange} 
              placeholder="e.g., 2 days, 1 week"
            />
            <Label>Latitude</Label>
            <Input 
              name="lat" 
              value={newRequest.lat} 
              onChange={handleDialogChange}
              placeholder="Enter latitude"
            />
            <Label>Longitude</Label>
            <Input 
              name="lng" 
              value={newRequest.lng} 
              onChange={handleDialogChange}
              placeholder="Enter longitude"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleDialogSubmit}>Add Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard;
