import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Confetti, SuccessPulse } from "@/components/common/Confetti";
import { ListItemSkeleton } from "@/components/ui/skeleton";
import ingredientMilk from "@/assets/ingredient-milk.png";
import ingredientSpinach from "@/assets/ingredient-spinach.png";
import ingredientTomatoes from "@/assets/ingredient-tomatoes.png";

interface InventoryItem {
  id: string;
  name: string;
  quantity: string;
  image: string;
}

const inventoryItemsData: InventoryItem[] = [
  { id: "1", name: "Whole Milk", quantity: "1 Gallon", image: ingredientMilk },
  { id: "2", name: "Organic Eggs", quantity: "12 Count", image: ingredientMilk },
  { id: "3", name: "Baby Spinach", quantity: "16 oz bag", image: ingredientSpinach },
  { id: "4", name: "Roma Tomatoes", quantity: "5 count", image: ingredientTomatoes },
];

const InventoryUpdated = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    // Trigger celebration
    setShowConfetti(true);
    setShowPulse(true);

    // Simulate loading inventory data
    const timer = setTimeout(() => {
      setInventoryItems(inventoryItemsData);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-foreground/50 flex items-end justify-center overflow-hidden">
      {/* Confetti Animation */}
      <Confetti
        isActive={showConfetti}
        onComplete={() => setShowConfetti(false)}
        pieceCount={40}
        duration={3000}
      />

      {/* Bottom Sheet */}
      <div className="w-full bg-background rounded-t-[32px] pt-3 pb-8 animate-in slide-in-from-bottom duration-300">
        {/* Handle */}
        <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-6" />

        {/* Success Icon */}
        <SuccessPulse isActive={showPulse}>
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="w-10 h-10 text-primary" />
            </div>
          </div>
        </SuccessPulse>

        {/* Title */}
        <h1 className="text-page-title text-foreground text-center mb-2">
          Inventory Updated!
        </h1>
        <p className="text-body text-muted-foreground text-center mb-6">
          These items are now back in your Pantry.
        </p>

        {/* Items List */}
        <div className="screen-padding space-y-3 mb-8">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <ListItemSkeleton key={i} />
            ))
          ) : (
            inventoryItems.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 bg-card rounded-lg animate-slide-up transition-all duration-200 hover:shadow-card"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-card-title text-foreground">{item.name}</p>
                  <p className="text-caption text-muted-foreground">{item.quantity}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-primary" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action Buttons */}
        <div className="screen-padding space-y-3">
          <Button
            onClick={() => navigate("/my-collection")}
            className="w-full h-14 rounded-button text-card-title"
          >
            Back to Recipes
          </Button>
          <button
            onClick={() => navigate("/my-pantry")}
            className="w-full py-3 text-primary text-card-title hover:text-primary/80 transition-colors"
          >
            View Pantry
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryUpdated;
