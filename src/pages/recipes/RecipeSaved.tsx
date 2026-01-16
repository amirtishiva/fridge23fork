import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ArrowRight, Clock, Bookmark, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Confetti, SuccessPulse } from "@/components/common/Confetti";
import frittataImage from "@/assets/recipe-frittata.png";

const RecipeSaved = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    // Trigger celebration on mount
    setShowConfetti(true);
    setShowPulse(true);
  }, []);

  const handleStartCooking = () => {
    navigate("/recipe-details");
  };

  const handleViewCollection = () => {
    navigate("/my-collection");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Confetti Animation */}
      <Confetti
        isActive={showConfetti}
        onComplete={() => setShowConfetti(false)}
        pieceCount={40}
        duration={3000}
      />

      {/* Content */}
      <div className="flex-1 screen-padding flex flex-col items-center justify-center">
        {/* Success Icon */}
        <SuccessPulse isActive={showPulse}>
          <div className="relative mb-8">
            <div className="w-28 h-28 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <Check className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>
          </div>
        </SuccessPulse>

        {/* Success Message */}
        <h1 className="text-page-title text-foreground text-center mb-2">
          Recipe Saved to Your Kitchen!
        </h1>
        <p className="text-body text-muted-foreground text-center mb-8">
          You're one step closer to reducing food waste today.
        </p>

        {/* Recipe Card */}
        <div className="w-full bg-card rounded-lg shadow-card overflow-hidden mb-8 transition-all duration-200 hover:shadow-floating hover:-translate-y-1">
          {/* Image */}
          <div className="relative">
            <img
              src={frittataImage}
              alt="Zucchini & Feta Frittata"
              className="w-full h-48 object-cover"
            />
            {/* Saved Badge */}
            <div className="absolute top-3 right-3 bg-card rounded-pill px-3 py-1.5 flex items-center gap-1.5 shadow-card">
              <Bookmark className="w-4 h-4 fill-primary text-primary" />
              <span className="text-caption text-foreground font-medium">Saved</span>
            </div>
            {/* Match Badge */}
            <div className="absolute bottom-3 left-3 bg-primary/90 rounded-pill px-3 py-1.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
              <span className="text-caption text-primary-foreground font-medium">
                98% Fridge Match
              </span>
            </div>
          </div>

          {/* Recipe Info */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-section-title text-foreground">
                Zucchini & Feta Frittata
              </h3>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-caption">25 min</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex gap-2">
              <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-pill text-caption font-medium">
                Low Waste
              </span>
              <span className="px-3 py-1.5 bg-secondary/20 text-secondary rounded-pill text-caption font-medium">
                Vegetarian
              </span>
              <span className="px-3 py-1.5 bg-muted text-foreground rounded-pill text-caption">
                4 Ingredients
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="screen-padding pb-8 space-y-3">
        <Button
          onClick={handleStartCooking}
          className="w-full h-14 rounded-button text-card-title flex items-center justify-center gap-2"
        >
          Start Cooking
          <ArrowRight className="w-5 h-5" />
        </Button>
        <Button
          onClick={handleViewCollection}
          variant="outline-primary"
          className="w-full h-14 rounded-button text-card-title"
        >
          View My Collection
        </Button>
      </div>
    </div>
  );
};

export default RecipeSaved;
