import { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface Restaurant {
  id?: string;
  name: string;
  location: string;
  address?: string;
  cuisine_type?: string;
  rating?: number;
  price_level?: number;
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

  useEffect(() => {
    if (query.length > 2) {
      searchRestaurants();
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const searchRestaurants = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('search-restaurants', {
        body: { query, location: '' }
      });

      if (error) throw error;
      
      setSuggestions(data.restaurants || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error searching restaurants:', error);
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

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {showSuggestions && (suggestions.length > 0 || query.length > 2) && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto">
          <CardContent className="p-0">
            {suggestions.map((restaurant, index) => (
              <div
                key={index}
                className="p-3 hover:bg-accent cursor-pointer border-b last:border-b-0"
                onClick={() => handleSelect(restaurant)}
              >
                <div className="font-medium">{restaurant.name}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {restaurant.location}
                  {restaurant.cuisine_type && ` • ${restaurant.cuisine_type}`}
                  {restaurant.rating && ` • ⭐ ${restaurant.rating}`}
                </div>
              </div>
            ))}
            
            {query.length > 2 && !suggestions.some(r => r.name.toLowerCase() === query.toLowerCase()) && (
              <div className="p-3 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
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