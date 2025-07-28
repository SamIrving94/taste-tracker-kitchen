import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  ChefHat, 
  BookOpen, 
  TrendingUp,
  Calendar,
  Star,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data - would come from localStorage or API
  const stats = {
    restaurantsVisited: 12,
    recipesFound: 8,
    recipesSaved: 15,
    cookingAttempts: 6
  };

  const recentVisits = [
    {
      id: '1',
      restaurant: 'Chez Laurent',
      dish: 'Coq au Vin',
      date: '2024-01-25',
      rating: 5,
      location: 'Paris, France'
    },
    {
      id: '2',
      restaurant: 'Sakura Sushi',
      dish: 'Dragon Roll',
      date: '2024-01-22',
      rating: 4,
      location: 'Tokyo, Japan'
    },
    {
      id: '3',
      restaurant: 'Nonna\'s Kitchen',
      dish: 'Truffle Risotto',
      date: '2024-01-20',
      rating: 5,
      location: 'Rome, Italy'
    }
  ];

  const quickActions = [
    {
      title: 'Log New Visit',
      description: 'Record your latest restaurant experience',
      icon: MapPin,
      action: () => navigate('/app/log-visit'),
      variant: 'default' as const
    },
    {
      title: 'Find Recipes',
      description: 'Search for recipes based on your visits',
      icon: Search,
      action: () => navigate('/app/search'),
      variant: 'secondary' as const
    },
    {
      title: 'View Collections',
      description: 'Browse your saved recipes',
      icon: BookOpen,
      action: () => navigate('/app/collections'),
      variant: 'outline' as const
    }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="text-center py-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-muted-foreground">
          Ready to discover your next favorite recipe?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-2">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stats.restaurantsVisited}</div>
            <div className="text-sm text-muted-foreground">Restaurants</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-full mx-auto mb-2">
              <ChefHat className="h-6 w-6 text-secondary" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stats.recipesFound}</div>
            <div className="text-sm text-muted-foreground">Recipes Found</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mx-auto mb-2">
              <BookOpen className="h-6 w-6 text-accent" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stats.recipesSaved}</div>
            <div className="text-sm text-muted-foreground">Saved Recipes</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-2">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stats.cookingAttempts}</div>
            <div className="text-sm text-muted-foreground">Cooked</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant={action.variant}
                className="w-full justify-start h-auto p-4"
                onClick={action.action}
              >
                <Icon className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-sm opacity-70">{action.description}</div>
                </div>
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Recent Visits */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Visits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentVisits.map((visit) => (
            <div key={visit.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{visit.restaurant}</h4>
                <p className="text-sm text-muted-foreground">{visit.dish}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{visit.date}</span>
                  <MapPin className="h-3 w-3 text-muted-foreground ml-2" />
                  <span className="text-xs text-muted-foreground">{visit.location}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{visit.rating}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;