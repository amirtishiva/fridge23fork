import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Check, Camera, Star, Leaf, Recycle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Confetti, SuccessPulse } from "@/components/common/Confetti";
import { usePantry } from "@/hooks/usePantry";
import { useUser } from "@/hooks/useUser";
import recipeImage from "@/assets/recipe-avocado-chicken.png";

const CookingComplete = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(4);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  useEffect(() => {
    // Trigger celebration on mount
    setShowConfetti(true);
    setShowPulse(true);
  }, []);

  const handleClose = () => {
    navigate("/home");
  };

  const { removeItem, items: pantryItems } = usePantry();
  const { addImpact } = useUser();

  // Mock ingredients used in this recipe (In a real app, this would be passed via navigation state)
  // For now, we'll try to find and remove "Chicken", "Lime", and "Avocado" if they exist
  const ingredientsUsed = ["Chicken", "Lime", "Avocado"];

  const handleDone = () => {
    setIsSubmitting(true);

    // Track impact for this cooking session
    // These are estimated values for the Avocado & Lime Chicken recipe
    addImpact({
      money: 8.50,      // Estimated savings from using ingredients before expiry
      co2: 2.5,         // Estimated CO2 saved (kg)
      foodWeight: 0.8,  // Estimated food weight rescued (kg)
      recipeName: "Avocado & Lime Chicken",
      recipeId: "avocado-lime-chicken-" + Date.now(),
      image: uploadedImage || undefined
    });

    // Deduct items from pantry
    ingredientsUsed.forEach(ingredientName => {
      const itemToRemove = pantryItems.find(p => p.name.toLowerCase().includes(ingredientName.toLowerCase()));
      if (itemToRemove) {
        removeItem(itemToRemove.id);
      }
    });

    // Navigate to inventory updated screen
    setTimeout(() => {
      navigate("/inventory-updated", { state: { itemsRemoved: ingredientsUsed } });
    }, 500);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
    }
  };

  const rescuedItems = [
    { emoji: "🥑", name: "Avocado" },
    { emoji: "🍋", name: "Lime" },
    { emoji: "🍗", name: "Chicken" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Confetti Animation */}
      <Confetti
        isActive={showConfetti}
        onComplete={() => setShowConfetti(false)}
        pieceCount={50}
        duration={3500}
      />

      {/* Header */}
      <div className="screen-padding py-4">
        <div className="flex items-center justify-between">
          <button onClick={handleClose} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
            <X className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-section-title text-foreground">Cooking Complete</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 screen-padding flex flex-col items-center">
        {/* Success Image */}
        <SuccessPulse isActive={showPulse}>
          <div className="relative mb-6">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary/20 shadow-floating">
              <img
                src={uploadedImage || recipeImage} // Show uploaded image if available
                alt="Completed dish"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Success Checkmark */}
            <div className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-floating">
              <Check className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
        </SuccessPulse>

        {/* Success Message */}
        <h2 className="text-page-title text-foreground text-center mb-2">
          Enjoy your Avocado & Lime Chicken!
        </h2>
        <p className="text-body text-muted-foreground text-center mb-8">
          Bon appétit!
        </p>

        {/* Waste Reduction Card */}
        <div className="w-full bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6 transition-all duration-200 hover:shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-primary" />
            </div>
            <span className="text-caption text-primary uppercase tracking-wider font-medium">
              Waste Reduction
            </span>
            <Recycle className="w-8 h-8 text-primary/20 ml-auto" />
          </div>
          <p className="text-section-title text-foreground mb-3">
            You rescued <span className="text-primary">3 items</span> today!
          </p>
          <div className="flex gap-2">
            {rescuedItems.map((item) => (
              <span
                key={item.name}
                className="px-3 py-1.5 bg-card rounded-pill text-caption text-foreground flex items-center gap-1"
              >
                {item.emoji} {item.name}
              </span>
            ))}
          </div>
        </div>

        {/* Capture Photo Section */}
        <div className="w-full mb-6">
          <p className="text-card-title text-foreground mb-3">Capture your creation</p>

          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className={`w-full py-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${uploadedImage
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5"
              }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${uploadedImage ? "bg-primary/20" : "bg-muted"
                }`}>
                <Camera className={`w-6 h-6 ${uploadedImage ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <span className={`text-body ${uploadedImage ? "text-primary font-medium" : "text-muted-foreground"}`}>
                {uploadedImage ? "Change photo" : "Upload photo"}
              </span>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        <div className="w-full bg-card rounded-lg shadow-card p-4 mb-6 transition-all duration-200 hover:shadow-floating">
          <p className="text-card-title text-foreground text-center mb-3">
            Rate this Recipe
          </p>
          <div className="flex justify-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  className={`w-10 h-10 transition-colors ${star <= rating
                    ? "fill-secondary text-secondary"
                    : "text-muted-foreground"
                    }`}
                />
              </button>
            ))}
          </div>
          <p className="text-caption text-muted-foreground text-center">
            Tap a star to rate
          </p>
        </div>
      </div>

      {/* Done Button */}
      <div className="screen-padding pb-8 pt-4">
        <Button
          onClick={handleDone}
          loading={isSubmitting}
          className="w-full h-14 rounded-button text-card-title flex items-center justify-center gap-2"
        >
          Done & Update Inventory
          {!isSubmitting && <Check className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
};

export default CookingComplete;
