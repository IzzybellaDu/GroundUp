import { useState, useEffect } from "react";
import { MapPin } from "lucide-react"; // make sure you have this import

interface MapViewProps {
  latittude: number;
  longitude: number;
  projectName: string;
}

export default function MapView({ latittude, longitude, projectName }: MapViewProps) {
  const [locationName, setLocationName] = useState("Loading location...");

  useEffect(() => {
    const fetchLocationName = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latittude}&lon=${longitude}&zoom=10&addressdetails=1`
        );
        const data = await response.json();

        if (data && data.display_name) {
          const address = data.address;
          const locationParts: string[] = [];

          if (address.city || address.town || address.village) {
            locationParts.push(address.city || address.town || address.village);
          }
          if (address.state) {
            locationParts.push(address.state);
          }
          if (address.country) {
            locationParts.push(address.country);
          }

          setLocationName(locationParts.join(", ") || data.display_name);
        }
      } catch (error) {
        console.error("Error fetching location:", error);
        setLocationName(`${latittude}, ${longitude}`);
      }
    };

    if (latittude && longitude) {
      fetchLocationName();
    }
  }, [latittude, longitude]);

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    longitude - 0.01
  },${latittude - 0.01},${parseFloat(longitude as any) + 0.01},${
    parseFloat(latittude as any) + 0.01
  }&layer=mapnik&marker=${latittude},${longitude}`;
    if (!latittude || !longitude || isNaN(latittude) || isNaN(longitude)) {
        
        return (
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <h3 className="font-semibold text-gray-900">Project Location</h3>
                </div>
                <p className="text-sm text-gray-600 mt-2">Location could not be displayed</p>
            </div>
            

        );
    }
    
    return (
        
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Project Location</h3>
                </div>
                <p className="text-sm text-gray-600">{locationName}</p>
                <p className="text-xs text-gray-400 mt-1">
                    Coordinates: {latittude}, {longitude}
                </p>
            </div>
            <div className="h-128"> {/* Changed from h-64 to h-128 (2x height) */}
                <iframe
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    title={`Map showing location of ${projectName}`}
                />
            </div>
        </div>
    );
    }
