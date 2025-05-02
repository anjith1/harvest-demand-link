
import React, { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import type { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import AddNecessityForm from './AddNecessityForm';

// Fix Leaflet's default icon path issues
const defaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

// Define the location interface
interface ILocation {
  id: string;
  lat: number;
  lng: number;
  type: string;
  icon?: L.Icon;
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

interface LocationMarkerProps {
  onLocationSelect: (position: LatLngTuple) => void;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect([lat, lng]);
    },
  });
  return null;
};

interface AgroMapProps {
  initialCenter?: LatLngTuple;
  initialZoom?: number;
  editable?: boolean;
  onLocationSelect?: (position: LatLngTuple) => void;
  clusterMode?: boolean; // Added for AdminDashboard compatibility
}

const AgroMap: React.FC<AgroMapProps> = ({
  initialCenter = [17.3850, 78.4867], // Hyderabad coordinates
  initialZoom = 13,
  editable = false,
  onLocationSelect = () => {},
  clusterMode = false, // Default value for AdminDashboard compatibility
}) => {
  const [selectedPosition, setSelectedPosition] = useState<LatLngTuple | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const handleLocationSelect = useCallback((position: LatLngTuple) => {
    if (editable) {
      setSelectedPosition(position);
      setShowAddForm(true);
      toast({
        title: 'Location selected',
        description: 'Please fill in your necessity details.',
      });
    }
  }, [editable, toast]);

  const handleFormSubmit = useCallback((data: any) => {
    if (selectedPosition) {
      onLocationSelect(selectedPosition);
      setShowAddForm(false);
      setSelectedPosition(null);
      toast({
        title: 'Success',
        description: 'Your necessity request has been submitted.',
      });
    }
  }, [selectedPosition, onLocationSelect, toast]);

  const handleFormCancel = useCallback(() => {
    setShowAddForm(false);
    setSelectedPosition(null);
  }, []);

  return (
    <div className="relative w-full h-[500px]">
      <MapContainer
        className="h-full w-full"
        defaultCenter={initialCenter}
        defaultZoom={initialZoom}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {editable && <LocationMarker onLocationSelect={handleLocationSelect} />}

        {selectedPosition && (
          <Marker position={selectedPosition}>
            <Popup>Selected Location</Popup>
          </Marker>
        )}
      </MapContainer>

      {showAddForm && selectedPosition && (
        <div className="absolute top-4 right-4 p-4 bg-white rounded-lg shadow-lg z-[1000] max-w-md">
          <AddNecessityForm
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
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
