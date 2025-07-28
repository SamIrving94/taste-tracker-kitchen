import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-food.jpg";
import { Camera, ChefHat, Search, Star } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Delicious restaurant food"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-overlay"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-accent" fill="currentColor" />
            <span className="text-sm font-medium">Transform Restaurant Meals Into Home Cooking Magic</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            From Restaurant
            <span className="block bg-gradient-to-r from-accent to-primary-glow bg-clip-text text-transparent">
              To Recipe
            </span>
            <span className="block">Reality</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            Never lose another incredible dining experience. Photograph your restaurant meals, 
            discover perfect recipes, and recreate restaurant magic in your own kitchen.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button variant="hero" size="xl" className="text-lg">
            <Camera className="w-5 h-5" />
            Start Your Culinary Journey
          </Button>
          <Button variant="outline" size="xl" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-foreground">
            <Search className="w-5 h-5" />
            Discover Recipes
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-1">10K+</div>
            <div className="text-sm text-white/80">Restaurants Mapped</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-1">50K+</div>
            <div className="text-sm text-white/80">Recipes Discovered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-1">95%</div>
            <div className="text-sm text-white/80">Success Rate</div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-accent/20 backdrop-blur-sm rounded-full flex items-center justify-center">
        <ChefHat className="w-8 h-8 text-accent" />
      </div>
      
      <div className="absolute bottom-20 right-10 w-20 h-20 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
        <Star className="w-10 h-10 text-primary-glow" fill="currentColor" />
      </div>
    </section>
  );
};

export default HeroSection;