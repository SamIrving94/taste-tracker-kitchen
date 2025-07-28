import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Heart, 
  Clock, 
  ChefHat, 
  Users,
  Star,
  Filter,
  BookOpen,
  Camera
} from 'lucide-react';

const Collections = () => {
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);
  const [cookingAttempts, setCookingAttempts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load saved recipes from localStorage
    const saved = JSON.parse(localStorage.getItem('recipe-rescue-saved') || '[]');
    setSavedRecipes(saved);

    // Mock cooking attempts data
    const attempts = [
      {
        id: '1',
        recipeId: '1',
        recipeName: 'Classic Coq au Vin',
        attemptDate: '2024-01-20',
        rating: 4,
        notes: 'Came out great! Next time I\'ll use a bit more wine.',
        photos: [],
        cookTime: '2h 45min'
      },
      {
        id: '2',
        recipeId: '2',
        recipeName: 'Truffle Risotto',
        attemptDate: '2024-01-15',
        rating: 5,
        notes: 'Perfect texture, the truffle oil made all the difference.',
        photos: [],
        cookTime: '50min'
      }
    ];
    setCookingAttempts(attempts);
  }, []);

  const filteredSavedRecipes = savedRecipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredAttempts = cookingAttempts.filter(attempt =>
    attempt.recipeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const RecipeCard = ({ recipe, showSaveDate = false }: { recipe: any; showSaveDate?: boolean }) => (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex">
          <div className="w-24 h-24 relative">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 p-3">
            <div className="flex items-start justify-between mb-1">
              <div>
                <h4 className="font-medium text-foreground text-sm">{recipe.title}</h4>
                <p className="text-xs text-muted-foreground">by {recipe.chef}</p>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="text-xs">{recipe.rating}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs text-muted-foreground mb-2">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{recipe.cookTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>{recipe.servings}</span>
              </div>
            </div>

            {showSaveDate && recipe.savedAt && (
              <p className="text-xs text-muted-foreground mb-2">
                Saved {new Date(recipe.savedAt).toLocaleDateString()}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {recipe.tags.slice(0, 2).map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                View Recipe
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const AttemptCard = ({ attempt }: { attempt: any }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-medium text-foreground">{attempt.recipeName}</h4>
            <p className="text-sm text-muted-foreground">
              Cooked on {new Date(attempt.attemptDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{attempt.rating}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-sm text-muted-foreground mb-3">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{attempt.cookTime}</span>
          </div>
          {attempt.photos.length > 0 && (
            <div className="flex items-center space-x-1">
              <Camera className="h-4 w-4" />
              <span>{attempt.photos.length} photos</span>
            </div>
          )}
        </div>

        {attempt.notes && (
          <div className="mb-3">
            <p className="text-sm text-muted-foreground italic">"{attempt.notes}"</p>
          </div>
        )}

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1">
            View Recipe
          </Button>
          <Button variant="ghost" size="sm">
            Cook Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">My Collections</h1>
        <p className="text-muted-foreground">
          Your saved recipes and cooking attempts
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="saved" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="saved" className="flex items-center space-x-2">
            <Heart className="h-4 w-4" />
            <span>Saved Recipes ({savedRecipes.length})</span>
          </TabsTrigger>
          <TabsTrigger value="attempts" className="flex items-center space-x-2">
            <ChefHat className="h-4 w-4" />
            <span>Cooking Attempts ({cookingAttempts.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="saved" className="space-y-4">
          {filteredSavedRecipes.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">
                  {searchQuery ? 'No matching recipes' : 'No saved recipes yet'}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? 'Try adjusting your search terms'
                    : 'Start saving recipes from your searches to build your collection'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredSavedRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} showSaveDate />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="attempts" className="space-y-4">
          {filteredAttempts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">
                  {searchQuery ? 'No matching attempts' : 'No cooking attempts yet'}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? 'Try adjusting your search terms'
                    : 'Start cooking recipes and track your progress here'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredAttempts.map((attempt) => (
                <AttemptCard key={attempt.id} attempt={attempt} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Collections;