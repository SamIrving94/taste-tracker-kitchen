import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  MapPin, 
  Star, 
  Phone, 
  Globe, 
  Camera,
  ChefHat,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

interface RestaurantData {
  id: string;
  name: string;
  location: string;
  address?: string;
  cuisine_type?: string;
  rating?: number;
  price_level?: number;
  photo_url?: string;
  phone?: string;
  website?: string;
  visits?: Array<{
    id: string;
    dish_name: string;
    rating: number;
    notes?: string;
    photo_url?: string;
    created_at: string;
  }>;
}

interface Recommendation {
  name: string;
  location: string;
  cuisine_type: string;
  rating: number;
  why_recommended: string;
  specialties: string[];
}

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  useEffect(() => {
    fetchRestaurantData();
  }, [id]);

  const fetchRestaurantData = async () => {
    try {
      // For demo, check localStorage first
      const visits = JSON.parse(localStorage.getItem('recipe-rescue-visits') || '[]');
      const mockRestaurant = visits.find((v: any) => 
        v.restaurant.toLowerCase().replace(/\s+/g, '-') === id ||
        v.id === id
      );

      if (mockRestaurant) {
        const restaurantData: RestaurantData = {
          id: mockRestaurant.id,
          name: mockRestaurant.restaurant,
          location: mockRestaurant.location,
          cuisine_type: 'International',
          rating: 4.2,
          price_level: 3,
          visits: mockRestaurant.dishes.map((dish: any, idx: number) => ({
            id: `${mockRestaurant.id}-${idx}`,
            dish_name: dish.name,
            rating: dish.rating,
            notes: dish.notes,
            created_at: mockRestaurant.createdAt
          }))
        };
        setRestaurant(restaurantData);
      }
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      toast({
        title: "Error",
        description: "Failed to load restaurant details",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRecommendations = async () => {
    if (!restaurant) return;
    
    setLoadingRecommendations(true);
    try {
      const { data, error } = await supabase.functions.invoke('recommend-restaurants', {
        body: {
          restaurantName: restaurant.name,
          cuisineType: restaurant.cuisine_type || 'International',
          location: restaurant.location
        }
      });

      if (error) throw error;
      
      setRecommendations(data.recommendations || []);
      toast({
        title: "Recommendations ready!",
        description: `Found ${data.recommendations?.length || 0} similar restaurants`,
      });
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to get recommendations",
        variant: "destructive"
      });
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const getRecipeSuggestions = async (dishName: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('get-recipe-suggestions', {
        body: {
          dishName,
          restaurantName: restaurant?.name,
          description: restaurant?.visits?.find(v => v.dish_name === dishName)?.notes
        }
      });

      if (error) throw error;
      
      toast({
        title: "Recipe suggestions ready!",
        description: `Found ${data.recipes?.length || 0} similar recipes`,
      });
      
      // Navigate to recipe search with the suggestions
      navigate('/app/recipe-search', { 
        state: { 
          suggestions: data.recipes,
          searchTerm: dishName 
        } 
      });
    } catch (error) {
      console.error('Error getting recipe suggestions:', error);
      toast({
        title: "Error",
        description: "Failed to get recipe suggestions",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-muted rounded-lg"></div>
          <div className="h-8 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="p-4 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Restaurant not found</h1>
        <Button onClick={() => navigate('/app')} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/app')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Restaurant Hero */}
      <Card className="overflow-hidden">
        <div className="relative h-64 bg-gradient-to-r from-primary/20 to-primary/10">
          {restaurant.photo_url && (
            <img
              src={restaurant.photo_url}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {restaurant.location}
              </div>
              {restaurant.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {restaurant.rating}
                </div>
              )}
              {restaurant.cuisine_type && (
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {restaurant.cuisine_type}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dishes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                Your Dishes ({restaurant.visits?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {restaurant.visits && restaurant.visits.length > 0 ? (
                restaurant.visits.map((visit) => (
                  <Card key={visit.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2">{visit.dish_name}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < visit.rating
                                    ? 'text-yellow-500 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {visit.rating}/5
                          </span>
                        </div>
                        {visit.notes && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {visit.notes}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Visited: {new Date(visit.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {visit.photo_url && (
                          <div className="w-16 h-16 rounded-lg overflow-hidden">
                            <img
                              src={visit.photo_url}
                              alt={visit.dish_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => getRecipeSuggestions(visit.dish_name)}
                          className="text-xs"
                        >
                          <ChefHat className="h-3 w-3 mr-1" />
                          Recipes
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ChefHat className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No dishes logged yet</p>
                  <Button
                    variant="outline"
                    className="mt-3"
                    onClick={() => navigate('/app/log-visit')}
                  >
                    Log a visit
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Restaurant Info */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {restaurant.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <span className="text-sm">{restaurant.address}</span>
                </div>
              )}
              {restaurant.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{restaurant.phone}</span>
                </div>
              )}
              {restaurant.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a href={restaurant.website} className="text-sm text-primary hover:underline">
                    Website
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Similar Places
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={getRecommendations}
                disabled={loadingRecommendations}
              >
                {loadingRecommendations ? 'Loading...' : 'Get Ideas'}
              </Button>
            </CardHeader>
            <CardContent>
              {recommendations.length > 0 ? (
                <div className="space-y-3">
                  {recommendations.slice(0, 3).map((rec, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <h4 className="font-medium text-sm mb-1">{rec.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        {rec.location} • {rec.cuisine_type}
                      </p>
                      <p className="text-xs">{rec.why_recommended}</p>
                      {rec.specialties && rec.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {rec.specialties.slice(0, 2).map((specialty, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Click "Get Ideas" to discover similar restaurants
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;