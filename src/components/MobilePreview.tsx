import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Star, MapPin, Plus } from "lucide-react";

const MobilePreview = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-muted/30 to-secondary/20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Designed for 
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Mobile Magic
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Capture every culinary moment with our beautiful, intuitive mobile interface
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Mobile Mockup */}
          <div className="relative">
            <div className="w-80 h-[600px] mx-auto bg-black rounded-[3rem] p-4 shadow-2xl">
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                {/* Status Bar */}
                <div className="bg-black h-8 flex items-center justify-center">
                  <div className="w-32 h-6 bg-black rounded-b-xl"></div>
                </div>
                
                {/* App Content */}
                <div className="p-4 h-full bg-gradient-to-b from-primary/5 to-secondary/5">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold">Good evening, Sarah</h3>
                      <p className="text-sm text-muted-foreground">Ready to discover recipes?</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-primary">12</div>
                      <div className="text-xs text-muted-foreground">Visits</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-secondary">24</div>
                      <div className="text-xs text-muted-foreground">Recipes</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-accent">8</div>
                      <div className="text-xs text-muted-foreground">Cooked</div>
                    </div>
                  </div>

                  {/* Recent Visit */}
                  <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold">Le Bernardin</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">Yesterday</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mb-3">NYC • Fine Dining</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Truffle Risotto</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-accent" fill="currentColor" />
                          <span className="text-xs">5.0</span>
                        </div>
                      </div>
                      <Button size="sm" className="w-full h-8 text-xs">
                        Find Recipes
                      </Button>
                    </div>
                  </div>

                  {/* Add Visit Button */}
                  <Button className="w-full bg-gradient-primary text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Log New Restaurant Visit
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-white flex-shrink-0">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Instant Capture</h3>
                <p className="text-muted-foreground">
                  Snap photos and log details in seconds, right from your table. No more forgotten meals.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center text-white flex-shrink-0">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Smart Recommendations</h3>
                <p className="text-muted-foreground">
                  AI learns your taste preferences and suggests recipes you'll actually want to cook.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center text-white flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Location Memory</h3>
                <p className="text-muted-foreground">
                  Automatically track restaurants and build your personal dining history timeline.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobilePreview;