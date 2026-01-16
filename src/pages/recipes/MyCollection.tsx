import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Search, Zap, Leaf, Sparkles, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { RecipeCardSkeleton } from "@/components/ui/skeleton";
import recipeAvocado from "@/assets/recipe-avocado-chicken.png";
import recipeFrittata from "@/assets/recipe-frittata.png";

interface SavedRecipe {
  id: string;
  title: string;
  image: string;
  savedAmount: string;
  savedDate: string;
  cookTime: string;
  isFavorite: boolean;
}

const savedRecipesData: SavedRecipe[] = [
  {
    id: "1",
    title: "Zero-Waste Veggie Pasta",
    image: recipeAvocado,
    savedAmount: "SAVED 200G",
    savedDate: "Saved Oct 12",
    cookTime: "20 min",
    isFavorite: true,
  },
  {
    id: "2",
    title: "Chicken Avocado Salad",
    image: recipeFrittata,
    savedAmount: "SAVED 150G",
    savedDate: "Saved Oct 10",
    cookTime: "15 min",
    isFavorite: false,
  },
  {
    id: "3",
    title: "Berry Blast Smoothie",
    image: recipeAvocado,
    savedAmount: "SAVED 100G",
    savedDate: "Saved Oct 8",
    cookTime: "5 min",
    isFavorite: true,
  },
  {
    id: "4",
    title: "Spicy Avocado Toast",
    image: recipeFrittata,
    savedAmount: "SAVED 80G",
    savedDate: "Saved Oct 5",
    cookTime: "10 min",
    isFavorite: false,
  },
];

const MyCollection = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"saved" | "cooked">("saved");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("quick");
  const [isLoading, setIsLoading] = useState(true);
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Simulate loading recipes
    const timer = setTimeout(() => {
      setSavedRecipes(savedRecipesData);
      setFavorites(savedRecipesData.filter(r => r.isFavorite).map(r => r.id));
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const filters = [
    { id: "quick", label: "Quick & Easy", icon: Zap },
    { id: "waste", label: "Low Waste", icon: Leaf },
    { id: "high", label: "High", icon: Sparkles },
  ];

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(fId => fId !== id)
        : [...prev, id]
    );
  };

  const handleRecipeClick = (id: string) => {
    navigate("/recipe-details");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="screen-padding py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-page-title text-foreground">My Collection</h1>
          <button className="p-2 hover:bg-muted rounded-full transition-colors">
            <MoreHorizontal className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-muted rounded-full p-1 mb-6">
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex-1 py-3 rounded-full text-card-title font-medium transition-all ${activeTab === "saved"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground"
              }`}
          >
            Saved
          </button>
          <button
            onClick={() => navigate("/cooked-history")}
            className="flex-1 py-3 rounded-full text-card-title font-medium transition-all text-muted-foreground hover:text-foreground"
          >
            Cooked
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search my recipes"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-xl bg-card border-border"
          />
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
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground border border-border hover:border-primary/50"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{filter.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="screen-padding">
        <div className="grid grid-cols-2 gap-4">
          {isLoading ? (
            // Skeleton loading state
            [...Array(4)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl overflow-hidden shadow-card">
                <div className="shimmer w-full h-32" />
                <div className="p-3 space-y-2">
                  <div className="shimmer h-4 w-3/4 rounded" />
                  <div className="shimmer h-3 w-1/2 rounded" />
                  <div className="shimmer h-3 w-2/3 rounded" />
                </div>
              </div>
            ))
          ) : (
            savedRecipes.map((recipe, index) => (
              <div
                key={recipe.id}
                onClick={() => handleRecipeClick(recipe.id)}
                className="bg-card rounded-xl overflow-hidden shadow-card cursor-pointer transition-all duration-200 hover:shadow-floating hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-32 object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(recipe.id);
                    }}
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 ${favorites.includes(recipe.id)
                      ? "bg-destructive"
                      : "bg-white/80"
                      }`}
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${favorites.includes(recipe.id)
                        ? "fill-white text-white"
                        : "text-muted-foreground"
                        }`}
                    />
                  </button>
                </div>
                <div className="p-3">
                  <h3 className="text-card-title text-foreground font-semibold mb-2 line-clamp-2">
                    {recipe.title}
                  </h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span className="text-xs text-primary font-medium">{recipe.savedAmount}</span>
                  </div>
                  <p className="text-caption text-muted-foreground">
                    {recipe.savedDate} • {recipe.cookTime}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default MyCollection;
