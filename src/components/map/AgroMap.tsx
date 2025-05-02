
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import { Icon, LatLngTuple } from 'leaflet';
import { Button } from '@/components/ui/button';
import AddNecessityForm from './AddNecessityForm';

// Fix the default leaflet icon issue
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Define the location interface
interface ILocation {
  id: string;
  position: [number, number];
  name: string;
  necessities: {
    item: string;
    quantity: number;
    unit: string;
  }[];
  userType: 'user' | 'farmer';
  timestamp: Date;
}

// Create custom marker icons
const userIcon = new Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Component to detect clicks and add markers
const LocationMarker = ({ onLocationSelect }: { onLocationSelect: (position: [number, number]) => void }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect([lat, lng]);
    },
  });

  return null;
};

interface AgroMapProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  editable?: boolean;
  clusterMode?: boolean;
  mockLocations?: ILocation[];
}

const AgroMap: React.FC<AgroMapProps> = ({
  initialCenter = [51.505, -0.09],
  initialZoom = 13,
  editable = false,
  clusterMode = false,
  mockLocations = []
}) => {
  const [locations, setLocations] = useState<ILocation[]>(mockLocations);
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [clusters, setClusters] = useState<any[]>([]);

  // Load locations from local storage on initial render
  useEffect(() => {
    const savedLocations = localStorage.getItem('agroConnectLocations');
    if (savedLocations) {
      setLocations(JSON.parse(savedLocations));
    }
  }, []);

  // Save locations to local storage when they change
  useEffect(() => {
    if (locations.length > 0) {
      localStorage.setItem('agroConnectLocations', JSON.stringify(locations));
    }
  }, [locations]);

  // Calculate clusters when in cluster mode
  useEffect(() => {
    if (clusterMode && locations.length > 0) {
      // Group by item
      const itemGroups: { [key: string]: ILocation[] } = {};
      locations.forEach(location => {
        location.necessities.forEach(necessity => {
          const key = necessity.item;
          if (!itemGroups[key]) {
            itemGroups[key] = [];
          }
          itemGroups[key].push(location);
        });
      });

      // Find clusters (3+ requests for same item within 10km)
      const newClusters: any[] = [];
      Object.entries(itemGroups).forEach(([item, locs]) => {
        if (locs.length >= 3) {
          // For each location, check if there are 2+ other locations within 10km
          locs.forEach(loc1 => {
            const nearby = locs.filter(loc2 => {
              if (loc1.id === loc2.id) return false;
              
              // Calculate distance using Haversine formula
              const lat1 = loc1.position[0];
              const lon1 = loc1.position[1];
              const lat2 = loc2.position[0];
              const lon2 = loc2.position[1];
              
              const R = 6371; // Earth's radius in km
              const dLat = (lat2 - lat1) * Math.PI / 180;
              const dLon = (lon2 - lon1) * Math.PI / 180;
              const a = 
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                Math.sin(dLon/2) * Math.sin(dLon/2); 
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
              const d = R * c;
              
              return d <= 10; // 10km radius
            });
            
            if (nearby.length >= 2) {
              // We've found a cluster
              const clusterCenter = loc1.position;
              const existingCluster = newClusters.find(c => 
                c.item === item && 
                Math.abs(c.center[0] - clusterCenter[0]) < 0.01 && 
                Math.abs(c.center[1] - clusterCenter[1]) < 0.01
              );
              
              if (!existingCluster) {
                newClusters.push({
                  item,
                  center: clusterCenter,
                  locations: [loc1, ...nearby],
                  totalDemand: [loc1, ...nearby].reduce((sum, loc) => {
                    const necessity = loc.necessities.find(n => n.item === item);
                    return sum + (necessity ? necessity.quantity : 0);
                  }, 0)
                });
              }
            }
          });
        }
      });
      
      setClusters(newClusters);
    }
  }, [locations, clusterMode]);

  const handleLocationSelect = (position: [number, number]) => {
    if (editable) {
      setSelectedPosition(position);
      setShowAddForm(true);
    }
  };

  const handleAddNecessity = (data: { name: string, necessities: { item: string, quantity: number, unit: string }[] }) => {
    if (selectedPosition) {
      const newLocation: ILocation = {
        id: Date.now().toString(),
        position: selectedPosition,
        name: data.name,
        necessities: data.necessities,
        userType: 'user',
        timestamp: new Date(),
      };

      setLocations([...locations, newLocation]);
      setSelectedPosition(null);
      setShowAddForm(false);
    }
  };

  const handleCancelAdd = () => {
    setSelectedPosition(null);
    setShowAddForm(false);
  };

  return (
    <div className="h-full relative">
      <MapContainer 
        className="h-full w-full rounded-md"
        zoom={initialZoom} 
        center={initialCenter as LatLngTuple}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {editable && <LocationMarker onLocationSelect={handleLocationSelect} />}

        {/* Display regular markers */}
        {locations.map((loc) => (
          <Marker 
            key={loc.id} 
            position={loc.position}
            icon={userIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{loc.name}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(loc.timestamp).toLocaleDateString()}
                </p>
                <div className="mt-2">
                  <h4 className="text-sm font-medium">Necessities:</h4>
                  <ul className="list-disc list-inside">
                    {loc.necessities.map((item, i) => (
                      <li key={i} className="text-sm">
                        {item.quantity} {item.unit} of {item.item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Display clusters if in cluster mode */}
        {clusterMode && clusters.map((cluster, idx) => (
          <React.Fragment key={`cluster-${idx}`}>
            <Circle 
              center={cluster.center}
              pathOptions={{ color: '#8BC34A', fillColor: '#8BC34A', fillOpacity: 0.2 }}
              radius={10000}
            />
            <Marker 
              position={cluster.center}
              icon={userIcon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-agro-green-dark">Priority Cluster</h3>
                  <p className="font-medium">{cluster.item}</p>
                  <p className="text-sm">
                    <span className="font-medium">Total Demand:</span> {cluster.totalDemand} units
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Locations:</span> {cluster.locations.length}
                  </p>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
      </MapContainer>

      {showAddForm && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000] w-80">
          <h3 className="text-lg font-semibold mb-2">Add Necessity</h3>
          <AddNecessityForm onSubmit={handleAddNecessity} onCancel={handleCancelAdd} />
        </div>
      )}
      
      {editable && !showAddForm && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white rounded-lg shadow-lg p-2">
          <p className="text-sm text-center mb-2">Click on the map to mark your location</p>
        </div>
      )}
    </div>
  );
};

export default AgroMap;
