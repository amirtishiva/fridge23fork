import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Mic, ArrowLeft, ArrowRight, Play, Pause, RotateCcw, Lightbulb, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import recipeImage from "@/assets/recipe-avocado-chicken.png";
import VoiceAssistant from "@/components/recipes/VoiceAssistant";

interface Step {
  id: number;
  title: string;
  highlight: string;
  description: string;
  hasTimer?: boolean;
  timerSeconds?: number;
  tip?: string;
  substitution?: { missing: string; replacement: string };
}

const cookingSteps: Step[] = [
  {
    id: 1,
    title: "Prepare the",
    highlight: "Chicken",
    description: "Slice the chicken breasts into thin strips. Season generously with salt, pepper, and a pinch of paprika.",
    hasTimer: true,
    timerSeconds: 300,
    tip: "Slice against the grain for maximum tenderness. It makes the fibers shorter and easier to chew.",
    substitution: { missing: "Paprika", replacement: "Use ½ tsp Cumin mixed with a pinch of Cayenne pepper." },
  },
  {
    id: 2,
    title: "Heat the",
    highlight: "Pan",
    description: "Heat olive oil in a large skillet over medium-high heat. Ensure the pan is hot before adding the chicken.",
    hasTimer: true,
    timerSeconds: 120,
  },
  {
    id: 3,
    title: "Cook &",
    highlight: "Sear",
    description: "Add chicken strips to the hot pan. Cook for 5-7 minutes until golden brown on all sides.",
    hasTimer: true,
    timerSeconds: 420,
  },
  {
    id: 4,
    title: "Add the",
    highlight: "Lime",
    description: "During the last minute of cooking, squeeze fresh lime juice over the chicken to infuse flavor.",
  },
  {
    id: 5,
    title: "Prepare",
    highlight: "Avocado",
    description: "While the chicken rests, slice the fresh avocado. Arrange the slices on your serving plates.",
  },
  {
    id: 6,
    title: "Plate &",
    highlight: "Serve",
    description: "Top the avocado with the warm chicken. Garnish with fresh cilantro and serve immediately.",
  },
];

const CookingStep = () => {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);

  const handleVoiceCommand = (command: string) => {
    setShowVoiceAssistant(false);
    if (command === "next") {
      handleNext();
    } else if (command === "timer") {
      setTimerRunning(true);
    }
  };

  const currentStep = cookingSteps[currentStepIndex];
  const totalSteps = cookingSteps.length;

  useEffect(() => {
    if (currentStep.hasTimer && currentStep.timerSeconds) {
      setTimeRemaining(currentStep.timerSeconds);
    }
  }, [currentStepIndex, currentStep]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && timerRunning) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setTimerRunning(false);
    } else {
      navigate("/cooking-complete");
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setTimerRunning(false);
    }
  };

  const handleClose = () => {
    navigate("/recipe-details");
  };

  const toggleTimer = () => {
    setTimerRunning(!timerRunning);
  };

  const resetTimer = () => {
    if (currentStep.timerSeconds) {
      setTimeRemaining(currentStep.timerSeconds);
      setTimerRunning(false);
    }
  };

  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <>
      {showVoiceAssistant && (
        <VoiceAssistant
          onClose={() => setShowVoiceAssistant(false)}
          onCommand={handleVoiceCommand}
        />
      )}
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="screen-padding py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-lg border border-border flex items-center justify-center"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
            <span className="text-caption text-muted-foreground uppercase tracking-wider">
              Step {currentStepIndex + 1} of {totalSteps}
            </span>
            <button
              onClick={() => setShowVoiceAssistant(true)}
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <Mic className="w-5 h-5 text-primary" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 screen-padding overflow-auto">
          {/* Step Title */}
          <h1 className="text-page-title text-foreground mb-2">
            {currentStep.title}
            <br />
            <span className="text-primary">{currentStep.highlight}</span>
          </h1>

          {/* Recipe Image - Static Visual Only */}
          <div className="relative rounded-lg overflow-hidden mb-6">
            <img
              src={recipeImage}
              alt="Step visual"
              className="w-full h-48 object-cover"
            />
          </div>

          {/* Step Instructions Card */}
          <div className="bg-card rounded-lg shadow-card p-4 mb-4">
            {/* Substitution Tip */}
            {currentStep.substitution && (
              <div className="bg-foreground text-primary-foreground rounded-lg p-3 mb-4 relative">
                <button className="absolute top-2 right-2 text-primary-foreground/70 text-caption flex items-center gap-1 hover:text-primary-foreground">
                  <Sparkles className="w-3 h-3" /> Substitutions
                </button>
                <p className="text-caption text-primary-foreground/90 uppercase tracking-wider mb-1">
                  Pantry Match
                </p>
                <p className="text-card-title text-primary-foreground">
                  Out of {currentStep.substitution.missing}?
                </p>
                <p className="text-body text-primary-foreground/80">
                  {currentStep.substitution.replacement}
                </p>
              </div>
            )}

            <p className="text-body text-foreground leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* Timer */}
          {currentStep.hasTimer && (
            <div className="bg-card rounded-lg shadow-card p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-secondary-foreground text-xs">!</span>
                </div>
                <span className="text-body text-foreground">Resting Time</span>
                <span className="text-caption text-muted-foreground ml-auto">
                  {formatTime(currentStep.timerSeconds || 0)} Total
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Circular Progress */}
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={226}
                      strokeDashoffset={226 - (226 * timeRemaining) / (currentStep.timerSeconds || 1)}
                      className="text-primary transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-caption text-primary font-medium">
                      {timerRunning ? "Running" : "Paused"}
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-page-title text-foreground font-bold">
                    {formatTime(timeRemaining)}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button
                      onClick={toggleTimer}
                      size="sm"
                      className="bg-primary text-primary-foreground"
                    >
                      {timerRunning ? <Pause className="w-4 h-4 mr-1" /> : null}
                      {timerRunning ? "Pause" : "Start"}
                    </Button>
                    <Button
                      onClick={resetTimer}
                      size="sm"
                      variant="ghost-primary"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chef's Tip */}
          {currentStep.tip && (
            <div className="bg-secondary/10 rounded-lg p-4 border border-secondary/30">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-secondary" />
                <span className="text-caption text-secondary uppercase tracking-wider font-medium">
                  Chef's Tip
                </span>
              </div>
              <p className="text-body text-foreground">{currentStep.tip}</p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="screen-padding pb-8 pt-4 flex gap-4">
          <Button
            onClick={handlePrevious}
            variant="outline-primary"
            className="w-16 h-14 rounded-button"
            disabled={currentStepIndex === 0}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1 h-14 rounded-button bg-primary hover:bg-primary/90 text-primary-foreground text-card-title flex items-center justify-center gap-2"
          >
            {currentStepIndex === totalSteps - 1 ? "Finish" : "Next Step"}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default CookingStep;
