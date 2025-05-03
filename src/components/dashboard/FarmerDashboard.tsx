import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MapPin, CheckCircle, XCircle, MessageCircle, Clock, Package, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';

// Interfaces
interface Item {
  name: string;
  quantity: number;
  unit: string;
}

interface ConsumerRequest {
  _id: string;
  consumerId: string;
  consumerName: string;
  items: Item[];
  urgency: 'low' | 'medium' | 'high';
  timeNeeded: string;
  location: {
    name: string;
    coordinates: [number, number];
  };
  status: 'pending' | 'accepted' | 'rejected' | 'fulfilled';
  createdAt: string;
  distance?: number;
  deliveryTime?: string;
}

interface Message {
  _id: string;
  requestId: string;
  senderId: string;
  receiverId: string;
  senderType: 'farmer' | 'consumer';
  message: string;
  createdAt: string;
  read: boolean;
}

const FarmerDashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [consumerRequests, setConsumerRequests] = useState<ConsumerRequest[]>([]);
  const [acceptedRequests, setAcceptedRequests] = useState<ConsumerRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ConsumerRequest | null>(null);
  const [deliveryTime, setDeliveryTime] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [farmerLocation, setFarmerLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [farmerName, setFarmerName] = useState('');

  useEffect(() => {
    // Get farmer's name from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setFarmerName(parsedUser.name);
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }

    // Get farmer's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFarmerLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: 'Location Error',
            description: 'Unable to get your location. Distance calculations will not be available.',
            variant: 'destructive'
          });
        }
      );
    }

    fetchRequests();
  }, [activeTab]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      if (activeTab === 'all') {
        const params = farmerLocation ? 
          { lat: farmerLocation[0], lng: farmerLocation[1] } : {};
        const response = await axios.get('/api/necessity-requests', { params });
        setConsumerRequests(response.data);
      } else if (activeTab === 'accepted') {
        const response = await axios.get('/api/necessity-requests/my-accepted');
        setAcceptedRequests(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch requests. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (requestId: string) => {
    try {
      const response = await axios.get(`/api/messages/request/${requestId}`);
      setMessages(response.data);
      // Mark messages as read
      await axios.patch(`/api/messages/read/${requestId}`);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleAcceptRequest = async (request: ConsumerRequest) => {
    setSelectedRequest(request);
    setShowAcceptDialog(true);
  };

  const handleRejectRequest = async (request: ConsumerRequest) => {
    try {
      await axios.patch(`/api/necessity-requests/${request._id}/reject`);
      setConsumerRequests(prev => 
        prev.map(req => 
          req._id === request._id ? { ...req, status: 'rejected' } : req
        )
      );
      toast({
        title: 'Request rejected',
        description: 'You have rejected this request.'
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
      await axios.patch(`/api/necessity-requests/${selectedRequest._id}/accept`, {
        deliveryTime
      });

      setConsumerRequests(prev => 
        prev.map(req => 
          req._id === selectedRequest._id ? { ...req, status: 'accepted' } : req
        )
      );

      setShowAcceptDialog(false);
      setDeliveryTime('');
      setSelectedRequest(null);

      toast({
        title: 'Request accepted!',
        description: `You will deliver the items in ${deliveryTime}.`
      });
    } catch (error) {
      console.error('Failed to accept request:', error);
      toast({
        title: 'Error',
        description: 'Failed to accept request. Please try again.'
      });
    }
  };

  const handleFulfillRequest = async (request: ConsumerRequest) => {
    try {
      await axios.patch(`/api/necessity-requests/${request._id}/fulfill`);
      setAcceptedRequests(prev => 
        prev.map(req => 
          req._id === request._id ? { ...req, status: 'fulfilled' } : req
        )
      );
      toast({
        title: 'Request fulfilled',
        description: 'You have marked this request as fulfilled.'
      });
    } catch (error) {
      console.error('Failed to fulfill request:', error);
      toast({
        title: 'Error',
        description: 'Failed to fulfill request. Please try again.'
      });
    }
  };

  const handleOpenChat = async (request: ConsumerRequest) => {
    setSelectedRequest(request);
    setChatOpen(true);
    await fetchMessages(request._id);
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !selectedRequest) return;

    try {
      const response = await axios.post(`/api/messages`, {
        requestId: selectedRequest._id,
        message: chatMessage,
        senderType: 'farmer',
        receiverId: selectedRequest.consumerId
      });

      setMessages(prev => [...prev, response.data]);
      setChatMessage('');
      toast({
        title: 'Message sent',
        description: 'Your message has been sent to the consumer.'
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.'
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, Farmer {farmerName}!</h1>
        <p className="mt-2 text-gray-600">Manage your requests and deliveries here.</p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="accepted">Accepted Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-6">
            {consumerRequests.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No consumer requests available at the moment.</p>
                </CardContent>
              </Card>
            ) : (
              consumerRequests.map((request) => (
                <Card key={request._id} className="relative">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Request from {request.consumerName}</CardTitle>
                        <CardDescription>
                          Created {new Date(request.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge variant={request.urgency === 'high' ? 'destructive' : 'default'}>
                        {request.urgency} Priority
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        {request.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            <span>{item.quantity} {item.unit} of {item.name}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{request.location.name}</span>
                        {request.distance && (
                          <span className="text-sm text-gray-500">
                            ({request.distance.toFixed(1)} km away)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Needed in: {request.timeNeeded}</span>
                      </div>
                      
                      {request.status === 'pending' && (
                        <div className="flex gap-2 mt-4">
                          <Button
                            onClick={() => handleAcceptRequest(request)}
                            className="flex-1"
                            variant="default"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Accept
                          </Button>
                          <Button
                            onClick={() => handleRejectRequest(request)}
                            className="flex-1"
                            variant="destructive"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                          <Button
                            onClick={() => handleOpenChat(request)}
                            className="flex-1"
                            variant="outline"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      )}
                      {request.status !== 'pending' && (
                        <Badge variant={request.status === 'accepted' ? 'default' : 'destructive'}>
                          {request.status}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="accepted">
          <div className="grid gap-6">
            {acceptedRequests.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">You haven't accepted any requests yet.</p>
                </CardContent>
              </Card>
            ) : (
              acceptedRequests.map((request) => (
                <Card key={request._id} className="relative">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Request from {request.consumerName}</CardTitle>
                        <CardDescription>
                          Accepted on {new Date(request.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge variant={request.status === 'fulfilled' ? 'default' : 'destructive'}>
                        {request.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        {request.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            <span>{item.quantity} {item.unit} of {item.name}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{request.location.name}</span>
                        {request.distance && (
                          <span className="text-sm text-gray-500">
                            ({request.distance.toFixed(1)} km away)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Delivery Time: {request.deliveryTime}</span>
                      </div>
                      
                      {request.status === 'accepted' && (
                        <div className="flex gap-2 mt-4">
                          <Button
                            onClick={() => handleFulfillRequest(request)}
                            className="flex-1"
                            variant="default"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Mark as Fulfilled
                          </Button>
                          <Button
                            onClick={() => handleOpenChat(request)}
                            className="flex-1"
                            variant="outline"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Accept Request Dialog */}
      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Request</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedRequest && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Request Details</h4>
                <div className="space-y-2">
                  {selectedRequest.items.map((item, index) => (
                    <p key={index} className="text-sm">
                      {item.quantity} {item.unit} of {item.name}
                    </p>
                  ))}
                  <p className="text-sm">Location: {selectedRequest.location.name}</p>
                  <p className="text-sm">Time Needed: {selectedRequest.timeNeeded}</p>
                </div>
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="deliveryTime">When will you deliver?</Label>
              <Input
                id="deliveryTime"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                placeholder="e.g., 2 days, 1 week"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAcceptDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAcceptSubmit}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chat Dialog */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chat with {selectedRequest?.consumerName}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedRequest && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Request Details</h4>
                <div className="space-y-2">
                  {selectedRequest.items.map((item, index) => (
                    <p key={index} className="text-sm">
                      {item.quantity} {item.unit} of {item.name}
                    </p>
                  ))}
                </div>
              </div>
            )}
            <div className="h-64 overflow-y-auto border rounded-lg p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${message.senderType === 'farmer' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.senderType === 'farmer'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid gap-2">
              <Textarea
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type your message..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChatOpen(false)}>
              Close
            </Button>
            <Button onClick={handleSendMessage}>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FarmerDashboard;
