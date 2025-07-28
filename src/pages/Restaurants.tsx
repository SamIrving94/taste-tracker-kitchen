import { useState, useEffect } from 'react';
import { RestaurantCard } from '@/components/RestaurantCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Restaurant {
  id: string;
  name: string;
  location: string;
  cuisine_type?: string;
  rating?: number;
  visitCount: number;
  lastVisit?: string;
  topDishes?: Array<{ name: string; rating: number; photo_url?: string }>;
  photo_url?: string;
}

const Restaurants = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    filterRestaurants();
  }, [searchQuery, restaurants]);

  const loadRestaurants = () => {
    // Load from localStorage for demo
    const visits = JSON.parse(localStorage.getItem('recipe-rescue-visits') || '[]');
    
    // Group visits by restaurant
    const restaurantMap = new Map<string, any>();
    
    visits.forEach((visit: any) => {
      const key = visit.restaurant.toLowerCase();
      if (!restaurantMap.has(key)) {
        restaurantMap.set(key, {
          id: visit.id,
          name: visit.restaurant,
          location: visit.location,
          cuisine_type: 'International',
          rating: 0,
          visitCount: 0,
          visits: [],
          topDishes: []
        });
      }
      
      const restaurant = restaurantMap.get(key);
      restaurant.visitCount++;
      restaurant.visits.push(visit);
      
      // Add dishes to topDishes
      visit.dishes.forEach((dish: any) => {
        restaurant.topDishes.push({
          name: dish.name,
          rating: dish.rating,
          visitDate: visit.createdAt
        });
      });
      
      restaurant.lastVisit = visit.createdAt;
    });

    // Calculate average ratings and sort top dishes
    const restaurantList = Array.from(restaurantMap.values()).map(restaurant => {
      const totalRating = restaurant.topDishes.reduce((sum: number, dish: any) => sum + dish.rating, 0);
      restaurant.rating = restaurant.topDishes.length > 0 ? Number((totalRating / restaurant.topDishes.length).toFixed(1)) : 0;
      
      // Sort and limit top dishes
      restaurant.topDishes = restaurant.topDishes
        .sort((a: any, b: any) => b.rating - a.rating)
        .slice(0, 3);
      
      // Add default photo
      restaurant.photo_url = `https://images.unsplash.com/photo-${1517248135467 + Math.floor(Math.random() * 1000)}?w=400&h=300&fit=crop`;
      
      return restaurant;
    });

    // Sort by visit count and last visit
    restaurantList.sort((a, b) => {
      if (a.visitCount !== b.visitCount) {
        return b.visitCount - a.visitCount;
      }
      return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
    });

    setRestaurants(restaurantList);
  };

  const filterRestaurants = () => {
    if (!searchQuery.trim()) {
      setFilteredRestaurants(restaurants);
      return;
    }

    const filtered = restaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.topDishes?.some(dish => 
        dish.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    setFilteredRestaurants(filtered);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Your Restaurants</h1>
          <p className="text-muted-foreground">
            Explore your dining history and discover new places
          </p>
        </div>
        <Button onClick={() => navigate('/app/log-visit')}>
          <Plus className="h-4 w-4 mr-2" />
          Log New Visit
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search restaurants, locations, or dishes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{restaurants.length}</div>
            <div className="text-sm text-muted-foreground">Restaurants</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {restaurants.reduce((sum, r) => sum + r.visitCount, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Visits</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {restaurants.reduce((sum, r) => sum + r.topDishes.length, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Dishes Tried</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {restaurants.length > 0 ? 
                (restaurants.reduce((sum, r) => sum + (r.rating || 0), 0) / restaurants.length).toFixed(1) : 
                '0.0'
              }
            </div>
            <div className="text-sm text-muted-foreground">Avg Rating</div>
          </CardContent>
        </Card>
      </div>

      {/* Restaurants Grid */}
      {filteredRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : searchQuery ? (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground mb-4">
            <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No restaurants found matching "{searchQuery}"</p>
          </div>
          <Button variant="outline" onClick={() => setSearchQuery('')}>
            Clear search
          </Button>
        </Card>
      ) : (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground mb-4">
            <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No restaurants in your collection yet</p>
            <p className="text-sm">Start by logging your first restaurant visit!</p>
          </div>
          <Button onClick={() => navigate('/app/log-visit')}>
            <Plus className="h-4 w-4 mr-2" />
            Log Your First Visit
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Restaurants;