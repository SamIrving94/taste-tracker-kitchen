import { useState, useEffect } from 'react';
import { Search, MapPin, Crosshair, Star, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Restaurant {
  id?: string;
  place_id?: string;
  name: string;
  location: string;
  address?: string;
  cuisine_type?: string;
  rating?: number;
  price_level?: number;
  photo_url?: string;
  latitude?: number;
  longitude?: number;
  google_data?: any;
}

interface RestaurantSearchProps {
  onSelect: (restaurant: Restaurant) => void;
  placeholder?: string;
}

export const RestaurantSearch = ({ onSelect, placeholder = "Search restaurants..." }: RestaurantSearchProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    if (query.length > 2) {
      searchRestaurants();
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationLoading(false);
          toast({
            title: "Location detected",
            description: "Now showing nearby restaurants",
          });
          if (query.length > 2) {
            searchRestaurants(position.coords.latitude, position.coords.longitude);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationLoading(false);
          toast({
            title: "Location access denied",
            description: "Search will show general results",
            variant: "destructive"
          });
        }
      );
    } else {
      setLocationLoading(false);
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support location services",
        variant: "destructive"
      });
    }
  };

  const searchRestaurants = async (lat?: number, lng?: number) => {
    setIsLoading(true);
    try {
      const searchData: any = { 
        query,
        location: '' // We'll use coordinates instead
      };

      // Use provided coordinates or stored user location
      if (lat && lng) {
        searchData.latitude = lat;
        searchData.longitude = lng;
      } else if (userLocation) {
        searchData.latitude = userLocation.lat;
        searchData.longitude = userLocation.lng;
      }

      const { data, error } = await supabase.functions.invoke('google-places-search', {
        body: searchData
      });

      if (error) throw error;
      
      setSuggestions(data.restaurants || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error searching restaurants:', error);
      toast({
        title: "Search failed",
        description: "Unable to search restaurants. Please try again.",
        variant: "destructive"
      });
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (restaurant: Restaurant) => {
    setQuery(restaurant.name);
    setShowSuggestions(false);
    onSelect(restaurant);
  };

  const addCustomRestaurant = () => {
    if (query.trim()) {
      const customRestaurant: Restaurant = {
        name: query.trim(),
        location: 'Custom Location',
        cuisine_type: 'Various'
      };
      handleSelect(customRestaurant);
    }
  };

  const getPriceDisplay = (level?: number) => {
    if (!level) return '';
    return '$'.repeat(level);
  };

  return (
    <div className="relative">
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
          {isLoading && (
            <div className="absolute right-3 top-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={getCurrentLocation}
          disabled={locationLoading}
          className="shrink-0"
          title="Use my location"
        >
          {locationLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          ) : (
            <Crosshair className="h-4 w-4" />
          )}
        </Button>
      </div>

      {showSuggestions && (suggestions.length > 0 || query.length > 2) && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {suggestions.map((restaurant, index) => (
              <div
                key={restaurant.place_id || index}
                className="p-4 hover:bg-accent cursor-pointer border-b last:border-b-0 transition-colors"
                onClick={() => handleSelect(restaurant)}
              >
                <div className="flex items-start space-x-3">
                  {restaurant.photo_url ? (
                    <img
                      src={restaurant.photo_url}
                      alt={restaurant.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-sm truncate">{restaurant.name}</h4>
                      <div className="flex items-center space-x-2 ml-2">
                        {restaurant.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium">{restaurant.rating}</span>
                          </div>
                        )}
                        {restaurant.price_level && (
                          <Badge variant="outline" className="text-xs">
                            {getPriceDisplay(restaurant.price_level)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground truncate">
                        {restaurant.address || restaurant.location}
                      </span>
                    </div>
                    {restaurant.cuisine_type && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        {restaurant.cuisine_type}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {query.length > 2 && !suggestions.some(r => r.name.toLowerCase() === query.toLowerCase()) && (
              <div className="p-3 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={addCustomRestaurant}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Add "{query}" as new restaurant
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};