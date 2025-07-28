import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Search, BookOpen, Star, Clock, Users } from "lucide-react";

const FeatureShowcase = () => {
  const steps = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Capture the Moment",
      description: "Log your restaurant visits and photograph dishes that blow your mind",
      color: "primary"
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "AI Recipe Discovery",
      description: "Our smart AI finds 5-6 perfect recipes to recreate that exact dish at home",
      color: "secondary"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Master & Share",
      description: "Build your personal recipe collection and track your cooking victories",
      color: "accent"
    }
  ];

  const features = [
    {
      icon: <Star className="w-6 h-6" />,
      title: "Restaurant-Grade Recipes",
      description: "Curated by professional chefs and food experts"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Smart Difficulty Matching",
      description: "Recipes adapted for home kitchens and skill levels"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Success Stories",
      description: "See what others cooked and share your victories"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        {/* Steps */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Three Simple Steps to 
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Culinary Mastery
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform every restaurant experience into a pathway to becoming a better home cook
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {steps.map((step, index) => (
            <Card key={index} className="p-8 text-center card-gradient border-0 shadow-card recipe-card">
              <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-${step.color} flex items-center justify-center text-white`}>
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              <div className="mt-6">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full text-sm font-bold">
                  {index + 1}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Why Recipe Rescue Works</h3>
          <p className="text-lg text-muted-foreground">
            Built with cutting-edge AI and real culinary expertise
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4 p-6 rounded-xl bg-card border transition-smooth hover:shadow-card">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-white flex-shrink-0">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="hero" size="lg">
            Join the Recipe Revolution
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;