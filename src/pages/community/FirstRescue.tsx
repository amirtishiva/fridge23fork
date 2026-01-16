import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Share2, Leaf, PiggyBank, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Confetti, SuccessPulse } from "@/components/common/Confetti";

const FirstRescue = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    // Trigger confetti on mount
    setShowConfetti(true);
    setShowPulse(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex flex-col items-center justify-center px-8 relative overflow-hidden">
      {/* Confetti Animation */}
      <Confetti
        isActive={showConfetti}
        onComplete={() => setShowConfetti(false)}
        pieceCount={60}
        duration={4000}
      />

      {/* Close Button */}
      <button
        onClick={() => navigate("/home")}
        className="absolute top-6 right-6 w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
      >
        <X className="w-5 h-5 text-muted-foreground" />
      </button>

      {/* Decorative diamonds */}
      <div className="absolute top-24 left-8 w-4 h-4 bg-secondary/30 rotate-45 animate-pulse" />
      <div className="absolute top-32 right-12 w-3 h-3 bg-secondary/20 rotate-45 animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-40 left-16 w-3 h-3 bg-secondary/20 rotate-45 animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Badge Icon */}
      <SuccessPulse isActive={showPulse}>
        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-full bg-gradient-to-b from-primary/20 to-primary/5 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <Leaf className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          {/* Badge label */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary rounded-full shadow-floating">
            <span className="text-caption text-primary-foreground font-semibold uppercase tracking-wider">
              ZERO WASTE!
            </span>
          </div>
        </div>
      </SuccessPulse>

      {/* Title */}
      <h1 className="text-page-title text-foreground text-center mt-6">Your First</h1>
      <h2 className="text-page-title text-primary mb-4">Rescue!</h2>
      <p className="text-body text-muted-foreground text-center mb-8">
        You just turned leftover ingredients into something delicious.
      </p>

      {/* Stats */}
      <div className="flex gap-4 w-full max-w-sm mb-8">
        <div className="flex-1 bg-card rounded-lg p-5 shadow-card flex flex-col items-center transition-all duration-200 hover:shadow-floating hover:-translate-y-1">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Leaf className="w-6 h-6 text-primary" />
          </div>
          <p className="text-page-title text-foreground">3</p>
          <p className="text-caption text-muted-foreground uppercase tracking-wider">
            INGREDIENTS
          </p>
        </div>
        <div className="flex-1 bg-card rounded-lg p-5 shadow-card flex flex-col items-center transition-all duration-200 hover:shadow-floating hover:-translate-y-1">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <PiggyBank className="w-6 h-6 text-primary" />
          </div>
          <p className="text-page-title text-foreground">$12.50</p>
          <p className="text-caption text-muted-foreground uppercase tracking-wider">
            MONEY SAVED
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-sm space-y-3">
        <Button
          onClick={() => { }}
          className="w-full h-14 rounded-button text-card-title flex items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          Share My Impact
        </Button>

        <button
          onClick={() => navigate("/home")}
          className="w-full py-3 text-muted-foreground text-card-title flex items-center justify-center gap-1 hover:text-foreground transition-colors"
        >
          Continue to Home
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FirstRescue;
