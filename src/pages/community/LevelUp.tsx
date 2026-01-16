import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PartyPopper, DollarSign, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Confetti, SuccessPulse } from "@/components/common/Confetti";

const LevelUp = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    // Trigger celebrations on mount
    setShowConfetti(true);
    setShowPulse(true);
  }, []);

  const handleCelebrate = () => {
    setShowConfetti(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex flex-col items-center justify-center px-8 overflow-hidden">
      {/* Confetti Animation */}
      <Confetti
        isActive={showConfetti}
        onComplete={() => setShowConfetti(false)}
        pieceCount={80}
        duration={4000}
      />

      {/* Level Up Label */}
      <p className="text-caption text-muted-foreground uppercase tracking-widest mb-6 animate-pulse">
        LEVEL UP!
      </p>

      {/* Badge Circle */}
      <SuccessPulse isActive={showPulse}>
        <div className="relative mb-6">
          {/* Outer dashed circle */}
          <div className="w-48 h-48 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center animate-spin" style={{ animationDuration: '20s' }}>
            {/* Inner solid circle with image */}
            <div className="w-36 h-36 rounded-full bg-primary flex items-center justify-center shadow-lg" style={{ animation: 'none' }}>
              <span className="text-6xl">🍴</span>
            </div>
          </div>
          {/* Level badge */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-foreground rounded-full shadow-floating">
            <span className="text-caption text-background font-semibold uppercase tracking-wider">
              LEVEL 2
            </span>
          </div>
        </div>
      </SuccessPulse>

      {/* Title */}
      <h1 className="text-page-title text-foreground text-center mt-4 mb-4">Kitchen Scout</h1>

      {/* Savings */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-primary" />
        </div>
        <p className="text-body text-foreground">
          You've saved <span className="text-primary font-bold">$100</span> this month!
        </p>
      </div>

      {/* Progress */}
      <div className="w-full max-w-sm mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-body text-foreground">Level Progress</span>
          <span className="text-card-title text-primary">100/100 XP</span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: "100%" }} />
        </div>
      </div>

      {/* New Badge Unlocked */}
      <div className="w-full max-w-sm bg-card rounded-lg p-4 shadow-card flex items-center gap-4 mb-8 transition-all duration-200 hover:shadow-floating hover:-translate-y-1">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Award className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-caption text-muted-foreground uppercase tracking-wider">
            NEW BADGE UNLOCKED
          </p>
          <p className="text-card-title text-foreground">Thrift Master</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-sm space-y-3">
        <Button
          onClick={handleCelebrate}
          className="w-full h-14 rounded-button text-card-title flex items-center justify-center gap-2"
        >
          <PartyPopper className="w-5 h-5" />
          Celebrate
        </Button>

        <button
          onClick={() => navigate("/leaderboard", { replace: true })}
          className="w-full py-3 text-muted-foreground text-card-title hover:text-foreground transition-colors"
        >
          View Leaderboard
        </button>
      </div>
    </div>
  );
};

export default LevelUp;
