import RecipeCard from "./RecipeCard";
import truffleRisotto from "@/assets/truffle-risotto.jpg";
import beefWellington from "@/assets/beef-wellington.jpg";
import chocolateLava from "@/assets/chocolate-lava.jpg";

const RecipeShowcase = () => {
  const sampleRecipes = [
    {
      title: "Truffle Risotto alla Milanese",
      chef: "Gordon Ramsay",
      rating: 4.8,
      cookTime: "45 min",
      difficulty: "Medium",
      servings: 4,
      image: truffleRisotto,
      tags: ["Italian", "Vegetarian", "Gourmet"],
      source: "MasterClass"
    },
    {
      title: "Classic Beef Wellington",
      chef: "Julia Child",
      rating: 4.9,
      cookTime: "2h 30min",
      difficulty: "Hard",
      servings: 6,
      image: beefWellington,
      tags: ["British", "Main Course", "Special Occasion"],
      source: "Food Network"
    },
    {
      title: "Molten Chocolate Lava Cake",
      chef: "Jacques Pépin",
      rating: 4.7,
      cookTime: "25 min",
      difficulty: "Easy",
      servings: 2,
      image: chocolateLava,
      tags: ["Dessert", "Chocolate", "Date Night"],
      source: "Bon Appétit"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Discover Perfect 
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Recipe Matches
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            See how our AI finds restaurant-quality recipes that actually work in your home kitchen
          </p>
          
          {/* Search Example */}
          <div className="bg-muted/50 rounded-2xl p-6 max-w-2xl mx-auto mb-12">
            <div className="text-left">
              <div className="text-sm text-muted-foreground mb-2">You searched for:</div>
              <div className="bg-white rounded-lg p-4 border shadow-sm">
                <div className="font-semibold text-primary">"Truffle Risotto from Le Bernardin, NYC"</div>
              </div>
            </div>
            <div className="text-center mt-4">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                AI found 6 perfect matches in 2.3 seconds
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {sampleRecipes.map((recipe, index) => (
            <RecipeCard key={index} {...recipe} />
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Each recipe is carefully analyzed for authenticity, difficulty, and success rate
          </p>
          <div className="flex justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span>Chef Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              <span>Home Kitchen Tested</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span>Community Approved</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecipeShowcase;