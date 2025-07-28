import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { RestaurantSearch } from '@/components/RestaurantSearch';
import { supabase } from '@/integrations/supabase/client';
import { 
  MapPin, 
  Camera, 
  Star,
  Calendar,
  Plus,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LogVisit = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [formData, setFormData] = useState({
    restaurant: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    dishes: [{ name: '', rating: 5, notes: '', photo: null as File | null }]
  });

  const addDish = () => {
    setFormData(prev => ({
      ...prev,
      dishes: [...prev.dishes, { name: '', rating: 5, notes: '', photo: null }]
    }));
  };

  const removeDish = (index: number) => {
    setFormData(prev => ({
      ...prev,
      dishes: prev.dishes.filter((_, i) => i !== index)
    }));
  };

  const updateDish = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      dishes: prev.dishes.map((dish, i) => 
        i === index ? { ...dish, [field]: value } : dish
      )
    }));
  };

  const handlePhotoUpload = (index: number, file: File | null) => {
    updateDish(index, 'photo', file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock submission - in real app, this would save to database
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Save to localStorage for demo
    const visits = JSON.parse(localStorage.getItem('recipe-rescue-visits') || '[]');
    const newVisit = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString()
    };
    visits.push(newVisit);
    localStorage.setItem('recipe-rescue-visits', JSON.stringify(visits));

    setIsSubmitting(false);
    toast({
      title: "Visit logged successfully!",
      description: `Added ${formData.restaurant} to your collection.`,
    });
    
    navigate('/app');
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Log Restaurant Visit</h1>
        <p className="text-muted-foreground">
          Record your dining experience to find matching recipes later
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Restaurant Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Restaurant Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="restaurant">Restaurant Name</Label>
              <RestaurantSearch
                onSelect={(restaurant) => {
                  setSelectedRestaurant(restaurant);
                  setFormData(prev => ({
                    ...prev,
                    restaurant: restaurant.name,
                    location: restaurant.location
                  }));
                }}
                placeholder="Search restaurants or add new..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Paris, France"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Visit Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Restaurant Notes</Label>
              <Textarea
                id="notes"
                placeholder="Atmosphere, service, overall experience..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Dishes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>Dishes</span>
              </CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addDish}>
                <Plus className="h-4 w-4 mr-1" />
                Add Dish
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.dishes.map((dish, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Dish {index + 1}</Label>
                  {formData.dishes.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDish(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Dish Name</Label>
                  <Input
                    placeholder="e.g., Coq au Vin"
                    value={dish.name}
                    onChange={(e) => updateDish(index, 'name', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rating (1-5 stars)</Label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => updateDish(index, 'rating', star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= dish.rating
                              ? 'text-yellow-500 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      {dish.rating} star{dish.rating !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Photo</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(index, e.target.files?.[0] || null)}
                      className="hidden"
                      id={`photo-${index}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`photo-${index}`)?.click()}
                    >
                      <Camera className="h-4 w-4 mr-1" />
                      {dish.photo ? 'Change Photo' : 'Add Photo'}
                    </Button>
                    {dish.photo && (
                      <span className="text-sm text-muted-foreground">
                        {dish.photo.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Dish Notes</Label>
                  <Textarea
                    placeholder="Taste, presentation, ingredients you noticed..."
                    value={dish.notes}
                    onChange={(e) => updateDish(index, 'notes', e.target.value)}
                    className="min-h-[60px]"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/app')}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Saving...' : 'Save Visit'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LogVisit;