
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Check, X, Clock } from 'lucide-react';
import AgroMap from '../map/AgroMap';

// Define interfaces
interface ClusterDemand {
  id: string;
  item: string;
  totalDemand: number;
  unit: string;
  locations: number;
  coordinates: [number, number];
  priority: 'high' | 'medium' | 'low';
}

interface User {
  id: string;
  name: string;
  email: string;
  type: 'user' | 'farmer';
  status: 'verified' | 'pending' | 'rejected';
  joinedDate: Date;
}

// Mock data
const generateMockDemandData = (): ClusterDemand[] => [
  { 
    id: '1', 
    item: 'Rice', 
    totalDemand: 120, 
    unit: 'kg', 
    locations: 5, 
    coordinates: [51.515, -0.09], 
    priority: 'high'
  },
  { 
    id: '2', 
    item: 'Potatoes', 
    totalDemand: 85, 
    unit: 'kg', 
    locations: 4, 
    coordinates: [51.505, -0.1], 
    priority: 'high' 
  },
  { 
    id: '3', 
    item: 'Tomatoes', 
    totalDemand: 60, 
    unit: 'kg', 
    locations: 3, 
    coordinates: [51.51, -0.085], 
    priority: 'medium' 
  },
  { 
    id: '4', 
    item: 'Water', 
    totalDemand: 40, 
    unit: 'liters', 
    locations: 3, 
    coordinates: [51.52, -0.095], 
    priority: 'medium' 
  },
  { 
    id: '5', 
    item: 'Onions', 
    totalDemand: 30, 
    unit: 'kg', 
    locations: 3, 
    coordinates: [51.525, -0.08], 
    priority: 'low' 
  },
];

const generateMockUsers = (): User[] => [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    type: 'farmer',
    status: 'verified',
    joinedDate: new Date('2023-03-15')
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    type: 'user',
    status: 'verified',
    joinedDate: new Date('2023-03-20')
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    type: 'farmer',
    status: 'pending',
    joinedDate: new Date('2023-04-01')
  },
  {
    id: '4',
    name: 'Lisa Davis',
    email: 'lisa@example.com',
    type: 'user',
    status: 'pending',
    joinedDate: new Date('2023-04-05')
  }
];

// Chart data
const generateChartData = (demands: ClusterDemand[]) => {
  return demands.map(demand => ({
    name: demand.item,
    value: demand.totalDemand,
    priority: demand.priority
  }));
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'verified':
      return <Check className="h-4 w-4 text-green-500" />;
    case 'rejected':
      return <X className="h-4 w-4 text-red-500" />;
    case 'pending':
    default:
      return <Clock className="h-4 w-4 text-amber-500" />;
  }
};

const AdminDashboard = () => {
  const [demandClusters, setDemandClusters] = useState<ClusterDemand[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    // In a real app, you'd fetch this data from an API
    const demands = generateMockDemandData();
    setDemandClusters(demands);
    setChartData(generateChartData(demands));
    setUsers(generateMockUsers());
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-amber-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleVerifyUser = (userId: string) => {
    // In a real app, this would call an API to update the user's status
    setUsers(users.map(user => {
      if (user.id === userId && user.status === 'pending') {
        return { ...user, status: 'verified' };
      }
      return user;
    }));
  };

  const handleRejectUser = (userId: string) => {
    // In a real app, this would call an API to update the user's status
    setUsers(users.map(user => {
      if (user.id === userId && user.status === 'pending') {
        return { ...user, status: 'rejected' };
      }
      return user;
    }));
  };

  const getChartItemColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const pendingUsers = users.filter(user => user.status === 'pending');

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Overview</CardTitle>
              <CardDescription>
                AgroConnect Admin Portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <p className="text-sm text-gray-500">Total Clusters</p>
                  <p className="text-2xl font-bold text-gray-800">{demandClusters.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="text-2xl font-bold text-gray-800">{users.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <p className="text-sm text-gray-500">Pending Verifications</p>
                  <p className="text-2xl font-bold text-amber-500">{pendingUsers.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <p className="text-sm text-gray-500">High Priority</p>
                  <p className="text-2xl font-bold text-red-500">
                    {demandClusters.filter(d => d.priority === 'high').length}
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Demand by Item</h3>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="value">
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getChartItemColor(entry.priority)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Tabs defaultValue="clusters">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="clusters">Priority Clusters</TabsTrigger>
              <TabsTrigger value="users">User Verification</TabsTrigger>
              <TabsTrigger value="map">Cluster Map</TabsTrigger>
            </TabsList>
            
            <TabsContent value="clusters">
              <Card>
                <CardHeader>
                  <CardTitle>Priority Demand Clusters</CardTitle>
                  <CardDescription>
                    Groups of 3+ requests for the same item within 10km radius
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {demandClusters.map((cluster) => (
                      <div 
                        key={cluster.id} 
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium">{cluster.item}</h3>
                              <Badge className={`ml-2 ${getPriorityColor(cluster.priority)}`}>
                                {cluster.priority}
                              </Badge>
                            </div>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm">
                                <span className="font-medium">Total Demand:</span> {cluster.totalDemand} {cluster.unit}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Locations:</span> {cluster.locations}
                              </p>
                            </div>
                          </div>
                          <div>
                            <Button variant="outline" size="sm">View Details</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Verification Queue</CardTitle>
                  <CardDescription>
                    Approve or reject pending user verifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingUsers.length > 0 ? (
                      pendingUsers.map((user) => (
                        <div 
                          key={user.id} 
                          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium">{user.name}</h3>
                              <p className="text-sm text-gray-500">{user.email}</p>
                              <div className="flex items-center mt-1">
                                <Badge className="bg-gray-200 text-gray-800">
                                  {user.type === 'farmer' ? 'Farmer/Supplier' : 'General User'}
                                </Badge>
                                <span className="text-xs text-gray-500 ml-2">
                                  Joined {new Date(user.joinedDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-red-500 text-red-500 hover:bg-red-50"
                                onClick={() => handleRejectUser(user.id)}
                              >
                                Reject
                              </Button>
                              <Button 
                                size="sm" 
                                className="bg-agro-green-dark hover:bg-agro-green-light"
                                onClick={() => handleVerifyUser(user.id)}
                              >
                                Verify
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">No pending verifications</p>
                      </div>
                    )}
                    
                    <div className="mt-4 pt-4 border-t">
                      <h3 className="text-sm font-medium mb-2">Recently Verified Users</h3>
                      <div className="space-y-2">
                        {users
                          .filter(user => user.status === 'verified')
                          .slice(0, 3)
                          .map((user) => (
                            <div 
                              key={user.id} 
                              className="p-2 rounded-lg flex justify-between items-center"
                            >
                              <div>
                                <p className="font-medium text-sm">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.type === 'farmer' ? 'Farmer/Supplier' : 'General User'}</p>
                              </div>
                              <div className="flex items-center text-green-500">
                                <Check className="h-4 w-4 mr-1" />
                                <span className="text-xs">Verified</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="map">
              <Card>
                <CardHeader>
                  <CardTitle>Cluster Map View</CardTitle>
                  <CardDescription>
                    Visual representation of demand clusters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px]">
                    <AgroMap 
                      initialCenter={[51.505, -0.09]} 
                      initialZoom={12} 
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

export default AdminDashboard;
