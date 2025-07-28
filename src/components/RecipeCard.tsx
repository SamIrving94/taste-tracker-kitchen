import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, ChefHat } from "lucide-react";

interface RecipeCardProps {
  title: string;
  chef: string;
  rating: number;
  cookTime: string;
  difficulty: string;
  servings: number;
  image: string;
  tags: string[];
  source: string;
}

const RecipeCard = ({ 
  title, 
  chef, 
  rating, 
  cookTime, 
  difficulty, 
  servings, 
  image, 
  tags, 
  source 
}: RecipeCardProps) => {
  return (
    <Card className="overflow-hidden recipe-card bg-card border-0 shadow-card">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-smooth hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-white/90 text-foreground">
            {source}
          </Badge>
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
          <Star className="w-4 h-4 text-accent" fill="currentColor" />
          <span className="text-sm font-semibold">{rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2 line-clamp-2">{title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ChefHat className="w-4 h-4" />
            <span>by {chef}</span>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{cookTime}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{servings} servings</span>
          </div>
          <Badge variant={difficulty === 'Easy' ? 'secondary' : difficulty === 'Medium' ? 'default' : 'destructive'}>
            {difficulty}
          </Badge>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button className="flex-1" size="sm">
            View Recipe
          </Button>
          <Button variant="outline" size="sm">
            Save
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default RecipeCard;