import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Check, Star, Zap, Edit3, Sparkles, UtensilsCrossed } from "lucide-react";
import recipeAvocado from "@/assets/recipe-avocado-chicken.png";
import recipeFrittata from "@/assets/recipe-frittata.png";

interface CookedRecipe {
  id: string;
  title: string;
  image: string;
  date: string;
  rescuedItems: string;
  note: string;
}

const cookedRecipes: CookedRecipe[] = [
  {
    id: "1",
    title: "Spicy Avo Toast",
    image: recipeAvocado,
    date: "Oct 24",
    rescuedItems: "Rescued 2 Avocados",
    note: "Great with extra lime! Next time try adding some poached eggs for protein.",
  },
  {
    id: "2",
    title: "Vegetable Stir Fry",
    image: recipeFrittata,
    date: "Oct 20",
    rescuedItems: "Rescued 3 items",
    note: "Used sesame oil instead of olive. 10/10 flavor profile.",
  },
  {
    id: "3",
    title: "Basil Pesto Pasta",
    image: recipeAvocado,
    date: "Sep 15",
    rescuedItems: "Rescued Spinach",
    note: "Added walnuts for crunch. Easy weeknight meal.",
  },
];

const CookedHistory = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("recent");

  const filters = [
    { id: "recent", label: "Recent", icon: Check },
    { id: "rating", label: "Rating", icon: Star },
    { id: "quick", label: "Quick", icon: Zap },
    { id: "notes", label: "Notes", icon: Edit3 },
  ];

  const handleCookAgain = (id: string) => {
    navigate("/recipe-details");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="screen-padding py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-page-title text-foreground">Cooked History</h1>
          <button className="p-2">
            <Search className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all ${activeFilter === filter.id
                    ? "bg-foreground text-background"
                    : "bg-card text-muted-foreground border border-border"
                  }`}
              >
                {activeFilter === filter.id && <Check className="w-4 h-4" />}
                {activeFilter !== filter.id && <Icon className="w-4 h-4" />}
                <span className="text-sm font-medium">{filter.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recipe List */}
      <div className="screen-padding space-y-4">
        {cookedRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-card rounded-xl shadow-card overflow-hidden"
          >
            {/* Recipe Header */}
            <div className="p-4 flex gap-4">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="text-section-title text-foreground font-semibold">
                    {recipe.title}
                  </h3>
                  <span className="text-caption text-muted-foreground">
                    {recipe.date}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary font-medium">
                    {recipe.rescuedItems}
                  </span>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="px-4 pb-4">
              <div className="bg-muted rounded-lg p-3 flex gap-3">
                <Edit3 className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-body text-foreground italic">
                  "{recipe.note}"
                </p>
              </div>
            </div>

            {/* Cook Again Button */}
            <div className="px-4 pb-4">
              <button
                onClick={() => handleCookAgain(recipe.id)}
                className="w-full py-3.5 bg-primary rounded-xl flex items-center justify-center gap-2 text-primary-foreground font-medium"
              >
                <UtensilsCrossed className="w-5 h-5" />
                Cook Again
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default CookedHistory;
