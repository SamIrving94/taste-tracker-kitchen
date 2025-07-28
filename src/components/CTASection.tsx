import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-hero">
      <div className="max-w-4xl mx-auto px-6 text-center text-white">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Ready to Transform
          <span className="block">Your Kitchen?</span>
        </h2>
        
        <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed">
          Join thousands of food lovers who never lose another incredible restaurant experience. 
          Start your culinary journey today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button variant="secondary" size="xl" className="bg-white text-primary hover:bg-white/90">
            <Mail className="w-5 h-5 mr-2" />
            Get Early Access
          </Button>
          <Button variant="outline" size="xl" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-primary">
            Watch Demo
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Beta Access Card */}
        <Card className="max-w-2xl mx-auto p-8 bg-white/10 backdrop-blur-sm border-white/20">
          <h3 className="text-2xl font-bold mb-4 text-white">🚀 Limited Beta Access</h3>
          <p className="text-white/80 mb-6">
            Be among the first 1,000 users to experience Recipe Rescue. 
            Get lifetime premium access and help shape the future of food discovery.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <Button className="bg-accent hover:bg-accent/90 text-white px-8">
              Join Beta
            </Button>
          </div>
          
          <p className="text-xs text-white/60 mt-3">
            No spam, ever. Unsubscribe anytime.
          </p>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-sm text-white/80">Featured in TechCrunch</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🔒</div>
            <div className="text-sm text-white/80">SOC 2 Compliant</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-sm text-white/80">4.9/5 Beta Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;