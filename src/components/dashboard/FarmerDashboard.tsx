import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MapPin, CheckCircle, Plus, Package, Bell } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';

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

interface ConsumerRequest {
  id: string;
  consumerName: string;
  item: string;
  quantity: number;
  unit: string;
  urgency: string;
  timeNeeded: string;
  location: {
    name: string;
    coordinates: [number, number];
  };
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
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

const generateMockConsumerRequests = (): ConsumerRequest[] => [
  {
    id: '1',
    consumerName: 'John Doe',
    item: 'Tomatoes',
    quantity: 10,
    unit: 'kg',
    urgency: 'High',
    timeNeeded: '2 days',
    location: {
      name: 'Community Center',
      coordinates: [51.505, -0.09]
    },
    status: 'pending',
    createdAt: new Date('2024-03-15')
  },
  {
    id: '2',
    consumerName: 'Jane Smith',
    item: 'Potatoes',
    quantity: 5,
    unit: 'kg',
    urgency: 'Medium',
    timeNeeded: '1 week',
    location: {
      name: 'Local School',
      coordinates: [51.51, -0.1]
    },
    status: 'pending',
    createdAt: new Date('2024-03-14')
  }
];

const FarmerDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [demands, setDemands] = useState<ClusterDemand[]>([]);
  const [consumerRequests, setConsumerRequests] = useState<ConsumerRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ConsumerRequest | null>(null);
  const [deliveryTime, setDeliveryTime] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const { toast } = useToast();
  const [farmerData, setFarmerData] = useState({
    name: 'John Smith',
    farm: 'Green Valley Farms',
    verified: true,
  });
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatDemand, setChatDemand] = useState<ClusterDemand | null>(null);
  
  useEffect(() => {
    fetchConsumerRequests();
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

  const fetchConsumerRequests = async () => {
    try {
      const response = await axios.get('/api/necessity-requests');
      setConsumerRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch consumer requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch consumer requests. Please try again.'
      });
    }
  };

  const handleAddProduct = () => {
    // In a real app, this would navigate to a form or open a modal
    toast({
      title: "Add a new product",
      description: "What can you supply to communities in need?"
    });
  };

  const handleAcceptRequest = async (request: ConsumerRequest) => {
    setSelectedRequest(request);
    setShowAcceptDialog(true);
  };

  const handleRejectRequest = async (request: ConsumerRequest) => {
    try {
      await axios.patch(`/api/necessity-requests/${request.id}/reject`);
      setConsumerRequests(prev => 
        prev.map(req => 
          req.id === request.id ? { ...req, status: 'rejected' } : req
        )
      );
      toast({
        title: 'Request rejected',
        description: `You have rejected the request for ${request.quantity} ${request.unit} of ${request.item}.`
      });
    } catch (error) {
      console.error('Failed to reject request:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject request. Please try again.'
      });
    }
  };

  const handleAcceptSubmit = async () => {
    if (!selectedRequest || !deliveryTime) {
      toast({ title: 'Error', description: 'Please specify delivery time.' });
      return;
    }

    try {
      await axios.patch(`/api/necessity-requests/${selectedRequest.id}/accept`, {
        deliveryTime
      });

      setConsumerRequests(prev => 
        prev.map(req => 
          req.id === selectedRequest.id ? { ...req, status: 'accepted' } : req
        )
      );

      setShowAcceptDialog(false);
      setDeliveryTime('');
      setSelectedRequest(null);

      toast({
        title: 'Request accepted!',
        description: `You will deliver ${selectedRequest.quantity} ${selectedRequest.unit} of ${selectedRequest.item} in ${deliveryTime}.`
      });
    } catch (error) {
      console.error('Failed to accept request:', error);
      toast({
        title: 'Error',
        description: 'Failed to accept request. Please try again.'
      });
    }
  };

  const handleOpenChat = (demand: ClusterDemand) => {
    setChatDemand(demand);
    setChatOpen(true);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    setChatDemand(null);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) {
      toast({ title: 'Error', description: 'Please enter a message.' });
      return;
    }

    // In a real app, this would send the message to the backend
    toast({
      title: 'Message sent',
      description: 'Your message has been sent to the consumer.'
    });
    setChatMessage('');
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
          <Tabs defaultValue="requests">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="requests">Consumer Requests</TabsTrigger>
              <TabsTrigger value="products">My Products</TabsTrigger>
              <TabsTrigger value="demands">Nearby Demands</TabsTrigger>
            </TabsList>

            <TabsContent value="requests">
              <Card>
                <CardHeader>
                  <CardTitle>Consumer Requests</CardTitle>
                  <CardDescription>
                    Manage requests from consumers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {consumerRequests.map((request) => (
                      <div 
                        key={request.id} 
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{request.item}</h3>
                            <p className="text-sm text-gray-500">
                              Requested by {request.consumerName}
                            </p>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm">
                                <span className="font-medium">Quantity:</span> {request.quantity} {request.unit}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Urgency:</span> {request.urgency}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Time Needed:</span> {request.timeNeeded}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Location:</span> {request.location.name}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 items-end">
                            {request.status === 'pending' && (
                              <>
                                <Button 
                                  size="sm" 
                                  className="bg-agro-green-dark hover:bg-agro-green-light"
                                  onClick={() => handleAcceptRequest(request)}
                                >
                                  Accept
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleRejectRequest(request)}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setChatDemand({
                                  id: request.id,
                                  item: request.item,
                                  totalDemand: request.quantity,
                                  unit: request.unit,
                                  locations: 1,
                                  distance: 0,
                                  coordinates: request.location.coordinates
                                });
                                setChatOpen(true);
                              }}
                            >
                              Chat
                            </Button>
                            {request.status !== 'pending' && (
                              <Badge className={request.status === 'accepted' ? 'bg-green-500' : 'bg-red-500'}>
                                {request.status}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {consumerRequests.length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">No consumer requests at the moment</p>
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
          </Tabs>
        </div>
      </div>
      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedRequest && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium mb-2">Request Details</h4>
                <p className="text-sm">Item: {selectedRequest.item}</p>
                <p className="text-sm">Quantity: {selectedRequest.quantity} {selectedRequest.unit}</p>
                <p className="text-sm">Urgency: {selectedRequest.urgency}</p>
                <p className="text-sm">Time Needed: {selectedRequest.timeNeeded}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label>When will you deliver?</Label>
              <Input 
                value={deliveryTime} 
                onChange={(e) => setDeliveryTime(e.target.value)}
                placeholder="e.g., Tomorrow, 2 days, Next week"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAcceptDialog(false)}>Cancel</Button>
            <Button onClick={handleAcceptSubmit}>Confirm Delivery</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={chatOpen} onOpenChange={handleCloseChat}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chat with Consumer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {chatDemand && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium mb-2">Request Details</h4>
                <p className="text-sm">Item: {chatDemand.item}</p>
                <p className="text-sm">Quantity: {chatDemand.totalDemand} {chatDemand.unit}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label>Your Message</Label>
              <Textarea 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseChat}>Close</Button>
            <Button onClick={handleSendMessage}>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FarmerDashboard;
