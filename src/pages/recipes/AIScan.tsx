import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Sparkles, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import fridgeContents from "@/assets/fridge-contents.png";

interface DetectedIngredient {
  id: string;
  name: string;
  confidence: number;
  position: { top: string; left: string };
}

const AIScan = () => {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [ingredientsFound, setIngredientsFound] = useState(0);
  const [detectedIngredients, setDetectedIngredients] = useState<DetectedIngredient[]>([]);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Simulate AI detection
  useEffect(() => {
    const ingredients: DetectedIngredient[] = [
      { id: "1", name: "Spinach", confidence: 98, position: { top: "28%", left: "15%" } },
      { id: "2", name: "Milk", confidence: 92, position: { top: "38%", left: "65%" } },
      { id: "3", name: "Cheddar", confidence: 88, position: { top: "58%", left: "30%" } },
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < ingredients.length) {
        const ingredientToAdd = ingredients[currentIndex];
        if (ingredientToAdd) {
          setDetectedIngredients(prev => [...prev, ingredientToAdd]);
          setIngredientsFound(currentIndex + 1);
        }
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const handleStopScanning = () => {
    setIsAnalyzing(false);
    navigate("/review-ingredients");
  };

  const handleClose = () => {
    navigate("/home");
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      // Reset detection simulation on new upload if desired
      setIngredientsFound(0);
      setDetectedIngredients([]);
      // Restart mock detection
      setIsAnalyzing(true);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-foreground overflow-y-auto hide-scrollbar pb-32">
      {/* Camera View Area (Flexible height) */}
      <div className="relative flex-1 min-h-[60vh]">
        <div className="absolute inset-0">
          <img
            src={uploadedImage || fridgeContents}
            alt="Fridge contents"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-foreground/30" />

          {/* Click to capture overlay (only if no image uploaded yet, or always allow change) */}
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            {!uploadedImage && <p className="text-white/70 text-sm font-medium bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">Tap screen to capture</p>}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />

          {/* Scanning line animation */}
          <div className="absolute left-4 right-4 h-1 bg-primary/50 animate-pulse pointer-events-none"
            style={{ top: '40%' }}
          />
        </div>

        {/* Header (Absolute within Camera View) */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-foreground/50 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-section-title text-primary-foreground">AI Scan</span>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-foreground/50 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>

        {/* Detected Ingredient Labels */}
        {detectedIngredients.map((ingredient) => (
          <IngredientLabel key={ingredient.id} ingredient={ingredient} />
        ))}
      </div>

      {/* Bottom Panel (Static layout block) */}
      <div className="relative z-10 bg-card rounded-t-3xl p-6 animate-slide-up -mt-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-section-title text-foreground">Analyzing freshness...</h3>
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-muted rounded-full mb-3 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${(ingredientsFound / 5) * 100}%` }}
          />
        </div>

        <p className="text-body text-muted-foreground mb-6">
          Found {ingredientsFound} ingredients so far. Keep camera steady.
        </p>

        <Button
          onClick={handleStopScanning}
          className="w-full h-14 rounded-button bg-primary hover:bg-primary/90 text-primary-foreground text-card-title"
        >
          Stop Scanning
        </Button>
      </div>
    </div>
  );
};

const IngredientLabel = ({ ingredient }: { ingredient: DetectedIngredient }) => (
  <div
    className="absolute z-10 animate-scale-in"
    style={{ top: ingredient.position.top, left: ingredient.position.left }}
  >
    {/* Connection dot */}
    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
      <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
      <div className="w-0.5 h-8 bg-primary mx-auto" />
    </div>

    {/* Label */}
    <div className="bg-card rounded-pill px-3 py-2 flex items-center gap-2 shadow-floating">
      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
        <Check className="w-3 h-3 text-primary-foreground" />
      </div>
      <span className="text-card-title text-foreground">{ingredient.name}</span>
      <span className="text-caption text-primary font-semibold">{ingredient.confidence}%</span>
    </div>
  </div>
);

export default AIScan;
