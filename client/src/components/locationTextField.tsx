import React, { useState, useEffect, useRef } from 'react';
import { TextField, Autocomplete, CircularProgress } from '@mui/material';


const useLocationAutocomplete = (formData, setFormData) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const abortController = useRef(null);

  const fetchSuggestions = async (query) => {
    if (!query || query.length < 3) {
      setOptions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1&countrycodes=au`,
        {
          headers: { 'User-Agent': 'GovConnect/1.0' }
        }
      );

      const data = await response.json();
      const suggestions = data.map(item => ({
        label: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon)
      }));

      setOptions(suggestions);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching suggestions:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=au`,
        { headers: { 'User-Agent': 'GovConnect/1.0' } }
      );

      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Error geocoding:', error);
      return null;
    }
  };

  return { options, loading, fetchSuggestions, geocodeAddress };
};



const LocationTextField = ({ formData, handleChange }) => {
  const [inputValue, setInputValue] = useState(formData.location || '');
  const { options, loading, fetchSuggestions, geocodeAddress } = useLocationAutocomplete(formData, handleChange);
  const timeoutRef = useRef(null);

  console.log(fetchSuggestions);
  console.log(geocodeAddress);

  // Debounced search
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(inputValue);
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inputValue]);

  const handleLocationSelect = async (event, value) => {
    if (value) {
      let coordinates = null;
      
      if (typeof value === 'object' && value.lat && value.lng) {
        // Selected from dropdown
        coordinates = { lat: value.lat, lng: value.lng };
        handleChange({
          target: {
            name: 'location',
            value: value.label
          }
        });
      } else {
        // Typed manually
        coordinates = await geocodeAddress(value);
        handleChange({
          target: {
            name: 'location',
            value: value
          }
        });
      }

      // Update coordinates in your form data
      if (coordinates) {
        handleChange({
          target: { name: 'latitude', value: coordinates.lat }
        });
        handleChange({
          target: { name: 'longitude', value: coordinates.lng }
        });
      }
    }
  };

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleBlur = async () => {
    if (inputValue && inputValue !== formData.location) {
      const coordinates = await geocodeAddress(inputValue);
      handleChange({
        target: { name: 'location', value: inputValue }
      });
      
      if (coordinates) {
        handleChange({
          target: { name: 'latitude', value: coordinates.lat }
        });
        handleChange({
          target: { name: 'longitude', value: coordinates.lng }
        });
      }
    }
  };

  return (
    <Autocomplete
      fullWidth
      freeSolo
      options={options}
      getOptionLabel={(option) => typeof option === 'string' ? option : option.label || ''}
      value={formData.location || null}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleLocationSelect}
      loading={loading}
      filterOptions={(x) => x}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label="Location"
          name="location"
          required
          multiline
          rows={4}
          variant="outlined"
          onBlur={handleBlur}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default LocationTextField;