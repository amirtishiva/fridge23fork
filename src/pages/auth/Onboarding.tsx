import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Leaf, AlertTriangle, Check, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import onboardingScan from "@/assets/onboarding-scan.png";
import onboardingWaste from "@/assets/onboarding-waste.png";
import buddhaBowl from "@/assets/buddha-bowl.png";

interface OnboardingSlide {
  id: number;
  image: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
  hasRecipeCard?: boolean;
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    image: onboardingScan,
    title: "Snap a photo of your fridge",
    subtitle: "Our AI instantly identifies your ingredients with precision.",
  },
  {
    id: 2,
    image: onboardingWaste,
    title: "Stop food waste,",
    titleAccent: "save money",
    subtitle: "We prioritize expiring items so nothing goes to the bin.",
  },
  {
    id: 3,
    image: buddhaBowl,
    title: "Cook with confidence",
    subtitle: "Tailored recipes that fit your health goals and dietary needs.",
    hasRecipeCard: true,
  },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate("/home");
    }
  };

  const handleSkip = () => {
    navigate("/home");
  };

  const slide = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <div className="min-h-screen bg-background flex flex-col screen-padding">
      {/* Skip Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSkip}
          className="text-card-title text-foreground hover:text-primary transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Slide Content */}
      <div className="flex-1 flex flex-col items-center justify-center animate-slide-up" key={currentSlide}>
        {/* Image Container */}
        {slide.hasRecipeCard ? (
          <RecipeCard image={slide.image} />
        ) : (
          <div className="w-full max-w-sm mb-10 rounded-image overflow-hidden">
            {currentSlide === 1 && (
              <div className="relative">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-auto object-cover rounded-image"
                />
                {/* Use Soon Badge */}
                <div className="absolute top-6 right-8 bg-card rounded-pill px-3 py-1.5 flex items-center gap-1.5 shadow-card">
                  <AlertTriangle className="w-4 h-4 text-secondary" />
                  <span className="text-caption text-foreground font-medium">Use soon!</span>
                </div>
              </div>
            )}
            {currentSlide !== 1 && (
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-auto object-cover rounded-image"
              />
            )}
          </div>
        )}

        {/* Text Content */}
        <div className="text-center max-w-sm">
          {slide.titleAccent ? (
            <h2 className="text-page-title text-foreground mb-3">
              {slide.title}
              <br />
              <span className="text-primary">{slide.titleAccent}</span>
            </h2>
          ) : (
            <h2 className="text-page-title text-foreground mb-3">{slide.title}</h2>
          )}
          <p className="text-body text-muted-foreground">{slide.subtitle}</p>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mb-6">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-pill transition-all duration-300 ${
              index === currentSlide
                ? "w-6 bg-primary"
                : "w-2 bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Next Button */}
      <div className="pb-8">
        <Button
          onClick={handleNext}
          className="w-full h-14 rounded-button bg-primary hover:bg-primary/90 text-primary-foreground text-card-title shadow-floating flex items-center justify-center gap-2"
        >
          {isLastSlide ? "Get Started" : "Next"}
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

// Recipe Card Component for the third slide
const RecipeCard = ({ image }: { image: string }) => {
  return (
    <div className="w-full max-w-sm mb-6">
      <div className="bg-card rounded-lg shadow-card overflow-hidden">
        {/* Image with badges */}
        <div className="relative">
          <img
            src={image}
            alt="Buddha Bowl"
            className="w-full h-48 object-cover"
          />
          {/* Vegan Badge */}
          <div className="absolute top-3 left-3 bg-surface-secondary rounded-pill px-3 py-1 flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-primary" />
            <span className="text-caption text-foreground font-medium">VEGAN</span>
          </div>
          {/* Gluten-Free Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-caption text-foreground font-medium bg-card/80 rounded-pill px-2 py-0.5">
              Gluten-Free
            </span>
          </div>
          {/* Match Badge */}
          <div className="absolute bottom-3 right-3 bg-primary rounded-pill px-3 py-1.5 flex items-center gap-1.5">
            <Check className="w-4 h-4 text-primary-foreground" />
            <span className="text-caption text-primary-foreground font-medium">98% Match</span>
          </div>
        </div>

        {/* Recipe Info */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-card-title text-foreground">Buddha Bowl</h3>
              <p className="text-caption text-muted-foreground">15 min • Easy Prep</p>
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-secondary" />
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Droplets className="w-4 h-4 text-blue-500" />
              </div>
            </div>
          </div>

          {/* High Protein Badge */}
          <div className="inline-flex items-center gap-1.5 mb-3">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-caption text-foreground">High Protein</span>
          </div>

          {/* Nutrition Info */}
          <div className="flex border-t border-border pt-3">
            <div className="flex-1 text-center border-r border-border">
              <p className="text-caption text-muted-foreground">CAL</p>
              <p className="text-nutrition text-foreground">450</p>
            </div>
            <div className="flex-1 text-center border-r border-border">
              <p className="text-caption text-muted-foreground">PROT</p>
              <p className="text-nutrition text-foreground">22g</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-caption text-muted-foreground">CARB</p>
              <p className="text-nutrition text-foreground">35g</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
