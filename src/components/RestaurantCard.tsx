import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, DollarSign, Camera, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Restaurant {
  id?: string;
  name: string;
  location: string;
  address?: string;
  cuisine_type?: string;
  rating?: number;
  price_level?: number;
  photo_url?: string;
  visitCount?: number;
  lastVisit?: string;
  topDishes?: Array<{ name: string; rating: number; photo_url?: string }>;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  variant?: 'default' | 'compact';
}

export const RestaurantCard = ({ restaurant, variant = 'default' }: RestaurantCardProps) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleViewDetails = () => {
    navigate(`/app/restaurant/${restaurant.id || restaurant.name.replace(/\s+/g, '-').toLowerCase()}`);
  };

  const getPriceLevel = (level?: number) => {
    if (!level) return '';
    return '$'.repeat(level);
  };

  const defaultImage = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop";

  if (variant === 'compact') {
    return (
      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={handleViewDetails}>
        <div className="flex">
          <div className="relative w-24 h-24 flex-shrink-0">
            <img
              src={imageError ? defaultImage : (restaurant.photo_url || defaultImage)}
              alt={restaurant.name}
              className="w-full h-full object-cover rounded-l-lg"
              onError={() => setImageError(true)}
            />
            {restaurant.visitCount && (
              <Badge className="absolute -top-2 -right-2 bg-primary text-xs">
                {restaurant.visitCount}
              </Badge>
            )}
          </div>
          <CardContent className="flex-1 p-4">
            <h3 className="font-semibold text-lg mb-1">{restaurant.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <MapPin className="h-3 w-3" />
              <span>{restaurant.location}</span>
              {restaurant.rating && (
                <>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{restaurant.rating}</span>
                </>
              )}
            </div>
            {restaurant.lastVisit && (
              <p className="text-xs text-muted-foreground">
                Last visit: {new Date(restaurant.lastVisit).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-gradient-to-br from-background to-background/80">
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img
          src={imageError ? defaultImage : (restaurant.photo_url || defaultImage)}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {restaurant.visitCount && (
          <Badge className="absolute top-3 right-3 bg-white/90 text-black backdrop-blur-sm">
            <Camera className="h-3 w-3 mr-1" />
            {restaurant.visitCount} visits
          </Badge>
        )}

        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-2 text-white">
            {restaurant.rating && (
              <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{restaurant.rating}</span>
              </div>
            )}
            {restaurant.price_level && (
              <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
                <DollarSign className="h-3 w-3" />
                <span className="text-sm">{getPriceLevel(restaurant.price_level)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-xl mb-1 group-hover:text-primary transition-colors">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-1 text-muted-foreground mb-2">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{restaurant.location}</span>
            </div>
            {restaurant.cuisine_type && (
              <Badge variant="secondary" className="text-xs">
                {restaurant.cuisine_type}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {restaurant.topDishes && restaurant.topDishes.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1 mb-2">
              <Utensils className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Top Dishes</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {restaurant.topDishes.slice(0, 3).map((dish, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {dish.name} ({dish.rating}⭐)
                </Badge>
              ))}
            </div>
          </div>
        )}

        {restaurant.lastVisit && (
          <p className="text-xs text-muted-foreground mb-4">
            Last visited: {new Date(restaurant.lastVisit).toLocaleDateString()}
          </p>
        )}

        <Button 
          className="w-full" 
          variant="outline"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};