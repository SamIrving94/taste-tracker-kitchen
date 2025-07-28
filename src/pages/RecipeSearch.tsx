import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  Clock, 
  ChefHat, 
  Users,
  Star,
  Heart,
  ExternalLink
} from 'lucide-react';

const RecipeSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Mock recipe data
  const mockRecipes = [
    {
      id: '1',
      title: 'Classic Coq au Vin',
      chef: 'Julia Child',
      rating: 4.8,
      cookTime: '2h 30min',
      difficulty: 'Intermediate',
      servings: 4,
      image: '/src/assets/beef-wellington.jpg',
      tags: ['French', 'Wine', 'Chicken'],
      source: 'Le Cordon Bleu',
      description: 'Traditional French braised chicken dish with wine, lardons, mushrooms, and garlic.',
      ingredients: ['1 whole chicken', '750ml red wine', '200g bacon lardons', '250g mushrooms'],
      matchScore: 95
    },
    {
      id: '2',
      title: 'Truffle Risotto Milanese',
      chef: 'Marco Bianchi',
      rating: 4.9,
      cookTime: '45min',
      difficulty: 'Advanced',
      servings: 4,
      image: '/src/assets/truffle-risotto.jpg',
      tags: ['Italian', 'Truffle', 'Rice'],
      source: 'Michelin Guide',
      description: 'Creamy Arborio rice with saffron, white wine, and fresh black truffle.',
      ingredients: ['400g Arborio rice', '1L warm stock', '50g butter', '50g truffle'],
      matchScore: 88
    },
    {
      id: '3',
      title: 'Dragon Roll Sushi',
      chef: 'Hiroshi Tanaka',
      rating: 4.7,
      cookTime: '1h 15min',
      difficulty: 'Advanced',
      servings: 2,
      image: '/src/assets/chocolate-lava.jpg',
      tags: ['Japanese', 'Sushi', 'Seafood'],
      source: 'Tokyo Sushi Academy',
      description: 'Inside-out roll with eel, cucumber, topped with avocado and eel sauce.',
      ingredients: ['Sushi rice', 'Nori sheets', 'Eel', 'Avocado', 'Cucumber'],
      matchScore: 82
    }
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    
    // Mock AI search delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Filter mock recipes based on search query
    const filteredRecipes = mockRecipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(filteredRecipes.length > 0 ? filteredRecipes : mockRecipes);
    setIsSearching(false);
  };

  const saveRecipe = (recipeId: string) => {
    const savedRecipes = JSON.parse(localStorage.getItem('recipe-rescue-saved') || '[]');
    const recipe = searchResults.find(r => r.id === recipeId);
    if (recipe && !savedRecipes.find((r: any) => r.id === recipeId)) {
      savedRecipes.push({ ...recipe, savedAt: new Date().toISOString() });
      localStorage.setItem('recipe-rescue-saved', JSON.stringify(savedRecipes));
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Recipe Search</h1>
        <p className="text-muted-foreground">
          Find recipes based on dishes you've tried at restaurants
        </p>
      </div>

      {/* Search Form */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="e.g., 'Coq au Vin from French restaurant' or 'Truffle risotto'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </form>
          
          {hasSearched && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <ChefHat className="h-4 w-4" />
                <span>AI analyzing your request and matching with {searchResults.length} recipes...</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading State */}
      {isSearching && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex space-x-4">
                  <Skeleton className="w-24 h-24 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-2/3" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Search Results */}
      {!isSearching && searchResults.length > 0 && (
        <div className="space-y-4">
          {searchResults.map((recipe) => (
            <Card key={recipe.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  <div className="w-32 h-32 relative">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="text-xs">
                        {recipe.matchScore}% Match
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{recipe.title}</h3>
                        <p className="text-sm text-muted-foreground">by {recipe.chef}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{recipe.rating}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {recipe.description}
                    </p>

                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{recipe.cookTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ChefHat className="h-3 w-3" />
                        <span>{recipe.difficulty}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{recipe.servings} servings</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {recipe.tags.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => saveRecipe(recipe.id)}
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {hasSearched && !isSearching && searchResults.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No recipes found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or add more details about the dish
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecipeSearch;