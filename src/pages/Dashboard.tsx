import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { 
  MapPin, 
  ChefHat, 
  BookOpen, 
  TrendingUp,
  Calendar,
  Star,
  Search,
  Camera,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  restaurantsVisited: number;
  recipesFound: number;
  recipesSaved: number;
  cookingAttempts: number;
}

interface RecentVisit {
  id: string;
  restaurant_name: string;
  dish_name: string;
  created_at: string;
  rating: number;
  location: string;
  photo_url?: string;
}

const Dashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    restaurantsVisited: 0,
    recipesFound: 0,
    recipesSaved: 0,
    cookingAttempts: 0
  });
  const [recentVisits, setRecentVisits] = useState<RecentVisit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load recent visits
      const { data: visits } = await supabase
        .from('restaurant_visits')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Load saved recipes
      const { data: savedRecipes } = await supabase
        .from('saved_recipes')
        .select('*')
        .eq('user_id', user?.id);

      // Load cooking attempts
      const { data: attempts } = await supabase
        .from('cooking_attempts')
        .select('*')
        .eq('user_id', user?.id);

      // Load unique restaurants
      const { data: restaurants } = await supabase
        .from('restaurant_visits')
        .select('restaurant_name')
        .eq('user_id', user?.id);

      const uniqueRestaurants = new Set(restaurants?.map(r => r.restaurant_name) || []);

      setStats({
        restaurantsVisited: uniqueRestaurants.size,
        recipesFound: visits?.length || 0,
        recipesSaved: savedRecipes?.length || 0,
        cookingAttempts: attempts?.length || 0
      });

      setRecentVisits(visits || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Log New Visit',
      description: 'Record your latest restaurant experience',
      icon: MapPin,
      action: () => navigate('/app/log-visit'),
      variant: 'default' as const,
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      title: 'Find Recipes',
      description: 'AI-powered recipe suggestions',
      icon: Search,
      action: () => navigate('/app/search'),
      variant: 'secondary' as const,
      gradient: 'from-green-500 to-teal-600'
    },
    {
      title: 'Browse Restaurants',
      description: 'Explore your dining history',
      icon: Users,
      action: () => navigate('/app/restaurants'),
      variant: 'outline' as const,
      gradient: 'from-orange-500 to-red-600'
    },
    {
      title: 'View Collections',
      description: 'Your saved recipes & attempts',
      icon: BookOpen,
      action: () => navigate('/app/collections'),
      variant: 'outline' as const,
      gradient: 'from-pink-500 to-rose-600'
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-6">
        <div className="text-center py-6">
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Enhanced Welcome Section */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
          {getGreeting()}, {profile?.full_name || user?.email?.split('@')[0]}!
        </h1>
        <p className="text-muted-foreground">
          {stats.restaurantsVisited > 0 
            ? `You've explored ${stats.restaurantsVisited} restaurants. Ready for your next culinary adventure?`
            : "Ready to start your culinary journey?"
          }
        </p>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-4 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 opacity-50" />
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-2 shadow-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stats.restaurantsVisited}</div>
              <div className="text-sm text-muted-foreground">Restaurants</div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-4 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20 opacity-50" />
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full mx-auto mb-2 shadow-lg">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stats.recipesFound}</div>
              <div className="text-sm text-muted-foreground">Dishes Tried</div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-4 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 opacity-50" />
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mx-auto mb-2 shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stats.recipesSaved}</div>
              <div className="text-sm text-muted-foreground">Saved Recipes</div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-4 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 opacity-50" />
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full mx-auto mb-2 shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stats.cookingAttempts}</div>
              <div className="text-sm text-muted-foreground">Cooked</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Quick Actions */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="ghost"
                className="h-auto p-4 group hover:shadow-md transition-all duration-300 border border-border/50 hover:border-primary/50"
                onClick={action.action}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${action.gradient} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </div>
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Enhanced Recent Visits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Recent Visits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentVisits.length > 0 ? (
            recentVisits.map((visit) => (
              <Card key={visit.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {visit.photo_url ? (
                      <img 
                        src={visit.photo_url} 
                        alt={visit.dish_name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center">
                        <Camera className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                      <Star className="h-3 w-3 text-white fill-current" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {visit.restaurant_name}
                    </h4>
                    <p className="text-sm text-muted-foreground">{visit.dish_name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(visit.created_at).toLocaleDateString()}
                      </span>
                      <MapPin className="h-3 w-3 text-muted-foreground ml-2" />
                      <span className="text-xs text-muted-foreground">{visit.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < visit.rating
                              ? 'text-yellow-500 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No visits logged yet</p>
              <p className="text-sm">Start by logging your first restaurant visit!</p>
              <Button
                variant="outline"
                className="mt-3"
                onClick={() => navigate('/app/log-visit')}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Log Your First Visit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;