import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, X, Sparkles, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const healthConditions = [
  { id: "diabetes", label: "Diabetes" },
  { id: "low-sodium", label: "Low Sodium" },
  { id: "hypertension", label: "Hypertension" },
  { id: "heart-healthy", label: "Heart Healthy" },
  { id: "gluten-intolerance", label: "Gluten Intolerance" },
  { id: "lactose-free", label: "Lactose Free" },
  { id: "keto", label: "Keto" },
  { id: "paleo", label: "Paleo" },
  { id: "vegetarian", label: "Vegetarian" },
];

const HealthConstraints = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([
    "diabetes",
    "low-sodium",
  ]);

  const [customConditions, setCustomConditions] = useState<{ id: string; label: string }[]>([]);

  const handleBack = () => {
    navigate("/review-ingredients");
  };

  const handleGenerateRecipes = () => {
    navigate("/recipe-details");
  };

  const toggleCondition = (id: string) => {
    setSelectedConditions((prev) =>
      prev.includes(id)
        ? prev.filter((c) => c !== id)
        : [...prev, id]
    );
  };

  const addCustomCondition = () => {
    if (!searchQuery.trim()) return;
    const newId = searchQuery.toLowerCase().replace(/\s+/g, "-");
    const newCondition = { id: newId, label: searchQuery.trim() };

    // Avoid duplicates
    if (![...healthConditions, ...customConditions].some(c => c.id === newId)) {
      setCustomConditions(prev => [...prev, newCondition]);
      setSelectedConditions(prev => [...prev, newId]);
    }
    setSearchQuery("");
  };

  const allConditions = [...healthConditions, ...customConditions];
  const filteredConditions = allConditions.filter((condition) =>
    condition.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showAddOption = searchQuery.trim() && !filteredConditions.some(c => c.label.toLowerCase() === searchQuery.trim().toLowerCase());

  return (
    <div className="h-screen w-full overflow-y-auto bg-background flex flex-col pb-32 hide-scrollbar">
      {/* Header */}
      <div className="screen-padding py-4">
        <div className="flex items-center justify-between">
          <button onClick={handleBack} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-section-title text-foreground">Health Constraints</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 screen-padding">
        <h2 className="text-page-title text-foreground mb-2">
          Personalize for your health
        </h2>
        <p className="text-body text-muted-foreground mb-6">
          Select any health conditions to tailor your recipes. This step is{" "}
          <span className="font-semibold text-foreground">optional</span>.
        </p>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search health conditions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && showAddOption) {
                addCustomCondition();
              }
            }}
            className="pl-12 h-14 rounded-lg border-border bg-card text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Add New Condition Option */}
        {showAddOption && (
          <button
            onClick={addCustomCondition}
            className="w-full bg-card rounded-button p-4 mb-6 flex items-center gap-3 animate-slide-up shadow-sm hover:bg-muted/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
            <div className="text-left">
              <p className="text-body font-semibold text-foreground">Add "{searchQuery}"</p>
              <p className="text-caption text-muted-foreground">As a new health condition</p>
            </div>
          </button>
        )}

        {/* Suggested Conditions */}
        <p className="text-caption text-muted-foreground uppercase tracking-wider mb-4">
          Suggested Conditions
        </p>

        <div className="flex flex-wrap gap-3">
          {filteredConditions.map((condition) => {
            const isSelected = selectedConditions.includes(condition.id);
            return (
              <button
                key={condition.id}
                onClick={() => toggleCondition(condition.id)}
                className={`px-4 py-3 rounded-pill flex items-center gap-2 transition-all ${isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground"
                  }`}
              >
                <span className="text-body font-medium">{condition.label}</span>
                {isSelected && <X className="w-4 h-4" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="screen-padding pb-8 pt-4">
        {/* Disclaimer */}
        <div className="flex items-center gap-2 mb-4 justify-center">
          <Info className="w-4 h-4 text-muted-foreground" />
          <p className="text-caption text-muted-foreground">
            Not medical advice. Consult a professional.
          </p>
        </div>

        <Button
          onClick={handleGenerateRecipes}
          className="w-full h-14 rounded-button bg-primary hover:bg-primary/90 text-primary-foreground text-card-title flex items-center justify-center gap-2"
        >
          Generate Recipes
          <Sparkles className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default HealthConstraints;
