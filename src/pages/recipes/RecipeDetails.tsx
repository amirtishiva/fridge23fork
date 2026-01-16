import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  Clock,
  Utensils,
  Flame,
  Check,
  Plus,
  ShoppingCart,
  Play,
  Leaf,
  Zap,
  DropletIcon,
  Edit3,
  Lock,
  Globe,
  Users
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import recipeImage from "@/assets/recipe-avocado-chicken.png";
import { useShoppingList } from "@/hooks/useShoppingList";
import { useToast } from "@/hooks/use-toast";

interface RecipeIngredient {
  id: string;
  name: string;
  quantity: string;
  inKitchen: boolean;
}

const inKitchenIngredients: RecipeIngredient[] = [
  { id: "1", name: "Chicken Breasts", quantity: "2 pieces (approx 400g)", inKitchen: true },
  { id: "2", name: "Olive Oil", quantity: "2 tablespoons", inKitchen: true },
  { id: "3", name: "Salt & Pepper", quantity: "To taste", inKitchen: true },
  { id: "4", name: "Paprika", quantity: "1 teaspoon", inKitchen: true },
];

const missingIngredients: RecipeIngredient[] = [
  { id: "5", name: "Ripe Avocado", quantity: "1 medium size", inKitchen: false },
  { id: "6", name: "Fresh Limes", quantity: "2 whole", inKitchen: false },
  { id: "7", name: "Cilantro (Coriander)", quantity: "1 small bunch", inKitchen: false },
];

interface CookingStep {
  id: number;
  title: string;
  description: string;
}

const cookingSteps: CookingStep[] = [
  {
    id: 1,
    title: "Prepare the Chicken",
    description: "Slice the chicken breasts into thin strips. Season generously with salt, pepper, and a pinch of paprika for color.",
  },
  {
    id: 2,
    title: "Heat the Pan",
    description: "Heat olive oil in a large skillet over medium-high heat. Ensure the pan is hot before adding the chicken to get a nice sear.",
  },
  {
    id: 3,
    title: "Cook & Lime",
    description: "Add chicken and cook for 5-7 mins until golden brown. Squeeze fresh lime juice over the chicken during the last minute.",
  },
];

// Quick tags for notes
interface QuickTag {
  id: string;
  label: string;
  icon: string;
}

interface NoteEntry {
  id: string;
  date: string;
  note: string;
  tag: string;
  isPrivate: boolean;
}

const quickTags: QuickTag[] = [
  { id: "1", label: "Too salty", icon: "😅" },
  { id: "2", label: "Perfect", icon: "👍" },
  { id: "3", label: "Need more time", icon: "⏱️" },
];

const noteHistory: NoteEntry[] = [
  {
    id: "1",
    date: "Oct 12, 2023",
    note: "Used fresh mozzarella instead of shredded. It was a bit watery, maybe pat it dry next time?",
    tag: "Needs tweak",
    isPrivate: false,
  },
  {
    id: "2",
    date: "Sep 05, 2023",
    note: "Doubled the garlic. Absolutely perfect.",
    tag: "Perfect",
    isPrivate: true,
  },
];

const RecipeDetails = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"ingredients" | "instructions" | "notes">("ingredients");
  const [isSaved, setIsSaved] = useState(false);
  const { addItem, isInList } = useShoppingList();
  const { toast } = useToast();

  const handleBack = () => {
    navigate("/home");
  };

  const handleStartCooking = () => {
    navigate("/cooking-step");
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="sticky top-0 bg-background z-10 screen-padding py-4">
        <div className="flex items-center justify-between">
          <button onClick={handleBack} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-section-title text-foreground">Recipe Details</h1>
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="p-2"
          >
            <Bookmark
              className={`w-6 h-6 ${isSaved ? 'fill-primary text-primary' : 'text-foreground'}`}
            />
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="screen-padding mb-4">
        <div className="relative rounded-lg overflow-hidden">
          <img
            src={recipeImage}
            alt="Avocado & Lime Chicken"
            className="w-full h-48 object-cover"
          />
          {/* Healthy Choice Badge */}
          <div className="absolute top-3 left-3 bg-primary rounded-pill px-3 py-1.5 flex items-center gap-1.5">
            <Leaf className="w-4 h-4 text-primary-foreground" />
            <span className="text-caption text-primary-foreground font-medium">Healthy Choice</span>
          </div>
          {/* Recipe Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 to-transparent p-4">
            <h2 className="text-section-title text-primary-foreground">
              Avocado & Lime Chicken
            </h2>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="screen-padding mb-6">
        <div className="flex justify-around py-3 bg-card rounded-lg shadow-card">
          <div className="flex flex-col items-center">
            <Clock className="w-6 h-6 text-primary mb-1" />
            <span className="text-card-title text-foreground">25 mins</span>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="flex flex-col items-center">
            <Utensils className="w-6 h-6 text-primary mb-1" />
            <span className="text-card-title text-foreground">2 Servings</span>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="flex flex-col items-center">
            <Flame className="w-6 h-6 text-primary mb-1" />
            <span className="text-card-title text-foreground">450 kcal</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="screen-padding mb-4">
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => setActiveTab("ingredients")}
            className={`flex-1 py-3 rounded-md text-card-title transition-all ${activeTab === "ingredients"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground"
              }`}
          >
            Ingredients
          </button>
          <button
            onClick={() => setActiveTab("instructions")}
            className={`flex-1 py-3 rounded-md text-card-title transition-all ${activeTab === "instructions"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground"
              }`}
          >
            Instructions
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex-1 py-3 rounded-md text-card-title transition-all ${activeTab === "notes"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground"
              }`}
          >
            My Notes
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="screen-padding">
        {activeTab === "ingredients" ? (
          <IngredientsTab
            onAddToList={(item) => {
              addItem({
                name: item.name,
                quantity: item.quantity,
                source: "Recipe: Avocado & Lime Chicken",
                category: "recipes",
              });
              toast({
                title: "Added to list",
                description: `${item.name} added to shopping list`,
              });
            }}
            isInList={isInList}
            onAddAllMissing={() => {
              missingIngredients.forEach(item => {
                if (!isInList(item.name)) {
                  addItem({
                    name: item.name,
                    quantity: item.quantity,
                    source: "Recipe: Avocado & Lime Chicken",
                    category: "recipes",
                  });
                }
              });
              toast({
                title: "Added all missing",
                description: "All missing ingredients added to shopping list",
              });
            }}
          />
        ) : activeTab === "instructions" ? (
          <InstructionsTab steps={cookingSteps} onViewCommunity={() => navigate("/community-pulse")} />
        ) : (
          <NotesTab />
        )}
      </div>

      {/* Start Cooking Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background screen-padding pb-8 pt-4">
        <Button
          onClick={handleStartCooking}
          className="w-full h-14 rounded-button bg-primary hover:bg-primary/90 text-primary-foreground text-card-title flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          Start Cooking
          <span className="text-primary-foreground/70 ml-2">Ready to prep?</span>
        </Button>
      </div>
    </div>
  );
};

const IngredientsTab = ({
  onAddToList,
  isInList,
  onAddAllMissing
}: {
  onAddToList: (item: RecipeIngredient) => void;
  isInList: (name: string) => boolean;
  onAddAllMissing: () => void;
}) => (
  <div className="space-y-6">
    {/* In Your Kitchen */}
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
            <Utensils className="w-4 h-4 text-primary" />
          </div>
          <span className="text-caption text-muted-foreground uppercase tracking-wider">
            In Your Kitchen
          </span>
        </div>
        <span className="text-caption text-primary font-medium">
          {inKitchenIngredients.length} Items
        </span>
      </div>
      <div className="space-y-3">
        {inKitchenIngredients.map((item) => (
          <div key={item.id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-card-title text-foreground">{item.name}</p>
              <p className="text-caption text-muted-foreground">{item.quantity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Missing */}
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-secondary/10 flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-secondary" />
          </div>
          <span className="text-caption text-muted-foreground uppercase tracking-wider">
            Missing
          </span>
        </div>
        <span className="text-caption text-destructive font-medium">
          {missingIngredients.length} Items
        </span>
      </div>
      <div className="space-y-3">
        {missingIngredients.map((item) => {
          const added = isInList(item.name);
          return (
            <div key={item.id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
              <div className={`w-10 h-10 rounded-full border-2 ${added ? 'bg-secondary/10 border-secondary' : 'border-dashed border-muted-foreground'} flex items-center justify-center transition-colors`}>
                {added && <Check className="w-5 h-5 text-secondary" />}
              </div>
              <div className="flex-1">
                <p className="text-card-title text-foreground">{item.name}</p>
                <p className="text-caption text-muted-foreground">{item.quantity}</p>
              </div>
              <button
                onClick={() => !added && onAddToList(item)}
                disabled={added}
                className={`p-2 rounded-full transition-colors ${added ? 'text-secondary' : 'text-muted-foreground hover:bg-muted'}`}
              >
                {added ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Add to Shopping List */}
      <button
        onClick={onAddAllMissing}
        className="w-full mt-4 py-3 flex items-center justify-center gap-2 bg-surface-secondary rounded-lg text-primary hover:bg-surface-secondary/80 transition-colors"
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="text-card-title">Add missing items to list</span>
      </button>
    </div>
  </div>
);

const InstructionsTab = ({ steps, onViewCommunity }: { steps: CookingStep[]; onViewCommunity: () => void }) => (
  <div className="space-y-6">
    {/* Instructions */}
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📋</span>
        <span className="text-card-title text-foreground">Instructions</span>
      </div>
      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.id} className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-caption text-primary font-semibold">{step.id}</span>
            </div>
            <div className="flex-1 pb-4 border-b border-border last:border-0">
              <p className="text-card-title text-foreground mb-1">{step.title}</p>
              <p className="text-body text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Nutrition Facts */}
    <div className="bg-card rounded-lg shadow-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-primary" />
          <span className="text-card-title text-foreground">Nutrition Facts</span>
        </div>
        <span className="text-caption text-muted-foreground bg-muted px-2 py-1 rounded">
          Per serving
        </span>
      </div>

      {/* Macros */}
      <div className="space-y-3 mb-4">
        <NutritionBar label="Protein" value={35} target={45} color="bg-primary" />
        <NutritionBar label="Carbs" value={12} target={150} color="bg-secondary" />
        <NutritionBar label="Fat" value={20} target={65} color="bg-destructive" />
      </div>

      {/* Micronutrients */}
      <p className="text-caption text-muted-foreground uppercase tracking-wider mb-3">
        Micronutrients
      </p>
      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1.5 bg-muted rounded-pill text-caption text-foreground flex items-center gap-1">
          <Zap className="w-3 h-3 text-secondary" /> Vitamin C
        </span>
        <span className="px-3 py-1.5 bg-muted rounded-pill text-caption text-foreground flex items-center gap-1">
          <DropletIcon className="w-3 h-3 text-muted-foreground" /> Iron
        </span>
        <span className="px-3 py-1.5 bg-muted rounded-pill text-caption text-foreground flex items-center gap-1">
          <span className="text-destructive">◉</span> B12
        </span>
      </div>
      <button className="text-caption text-primary mt-2">+3 more</button>
    </div>

    {/* Community Pulse Link */}
    <button
      onClick={onViewCommunity}
      className="w-full py-4 bg-card rounded-lg shadow-card flex items-center justify-center gap-2 text-primary hover:bg-primary/5 transition-colors"
    >
      <Users className="w-5 h-5" />
      <span className="text-card-title">View Community Tips & Feedback</span>
    </button>

    {/* Disclaimer */}
    <p className="text-caption text-muted-foreground text-center">
      Nutritional values are AI-estimates based on standard ingredient databases.
      Consult a medical professional for specific dietary needs.
    </p>
  </div>
);

// Notes Tab Component
const NotesTab = () => {
  const [noteText, setNoteText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSave = () => {
    if (!noteText.trim()) return;
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      setNoteText("");
      setSelectedTags([]);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* New Entry */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-primary" />
            <span className="text-card-title text-foreground">New Entry</span>
          </div>
          <span className="text-caption text-muted-foreground">Today</span>
        </div>

        {/* Note Input */}
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="What did you tweak? (e.g., 'Cooked for 2 mins less', 'Used spicy sausage instead')"
          className="w-full h-28 p-4 bg-muted rounded-lg text-body text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* Quick Tags */}
        <div className="mt-4">
          <p className="text-caption text-muted-foreground uppercase tracking-wider mb-3">
            QUICK TAGS
          </p>
          <div className="flex flex-wrap gap-2">
            {quickTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`px-4 py-2 rounded-full border flex items-center gap-2 transition-all ${selectedTags.includes(tag.id)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-foreground"
                  }`}
              >
                <span>{tag.icon}</span>
                <span className="text-body">{tag.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Private Note Toggle */}
        <div className="mt-4 flex items-center justify-between p-4 bg-card rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-card-title text-foreground">Private Note</p>
              <p className="text-caption text-muted-foreground">Only visible to you</p>
            </div>
          </div>
          <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!noteText.trim() || isSaving}
          className="w-full mt-4 py-3 bg-primary rounded-lg text-primary-foreground text-card-title flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {isSaving ? "Saving..." : "Save Note"}
        </button>
      </div>

      {/* History */}
      <div>
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-caption text-muted-foreground uppercase tracking-wider">
            HISTORY
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="space-y-4">
          {noteHistory.map((entry) => (
            <div key={entry.id} className="bg-card rounded-lg p-4 border border-border animate-slide-up">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-muted rounded text-caption text-foreground">
                  {entry.date}
                </span>
                {entry.isPrivate ? (
                  <Lock className="w-4 h-4 text-secondary" />
                ) : (
                  <Globe className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <p className="text-body text-foreground mb-3">{entry.note}</p>
              <span
                className={`inline-block px-2 py-1 rounded text-caption ${entry.tag === "Perfect"
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary/10 text-secondary"
                  }`}
              >
                {entry.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const NutritionBar = ({
  label,
  value,
  target,
  color
}: {
  label: string;
  value: number;
  target: number;
  color: string;
}) => (
  <div>
    <div className="flex items-center justify-between mb-1">
      <span className="text-body text-foreground">{label}</span>
      <span className="text-caption text-foreground">
        <span className="font-bold">{value}g</span>
        <span className="text-muted-foreground"> / {target}g target</span>
      </span>
    </div>
    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
      <div
        className={`h-full ${color} rounded-full`}
        style={{ width: `${Math.min((value / target) * 100, 100)}%` }}
      />
    </div>
  </div>
);

export default RecipeDetails;
