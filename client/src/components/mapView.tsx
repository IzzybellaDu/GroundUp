import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Box, Typography, Paper } from "@mui/material";

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
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <MapPin size={20} color="#9e9e9e" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Project Location</Typography>
            </Box>
            <Typography color="text.secondary" sx={{ mt: 1 }}>Location could not be displayed</Typography>
          </Paper>
        );
    }
    
    return (
    <Paper sx={{ mb: 3, overflow: "hidden" }}>
      <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}> 
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}> 
          <MapPin size={20} color="#1976d2" /> 
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Project Location</Typography>
        </Box>
        <Typography color="text.secondary">{locationName}</Typography> 
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
          Coordinates: {latittude}, {longitude}
        </Typography>
      </Box>
      <Box sx={{ height: 400 }}>
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          title={`Map showing location of ${projectName}`}
        />
      </Box>
    </Paper>
  );
    }
