import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, UtensilsCrossed, ShoppingCart, Trash2, MapPin, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShoppingList, ShoppingItem } from "@/hooks/useShoppingList";
import SwipeableItem from "@/components/common/SwipeableItem";


// Aisle icons for visual distinction
const aisleIcons: Record<string, string> = {
  "Produce": "🥬",
  "Dairy & Eggs": "🥛",
  "Meat & Seafood": "🥩",
  "Pantry & Grains": "🍞",
  "Frozen": "🧊",
  "Beverages": "🥤",
  "Other": "📦",
};

const formatPrice = (price: number) => `$${price.toFixed(2)}`;

const ShoppingItemCard = ({
  item,
  onToggle,
  onRemove
}: {
  item: ShoppingItem;
  onToggle: () => void;
  onRemove: () => void;
}) => (
  <SwipeableItem onDelete={onRemove}>
    <div className="p-4 shadow-card flex items-center gap-4">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${item.checked
          ? "bg-primary border-primary"
          : "border-muted-foreground"
          }`}
      >
        {item.checked && (
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
          </svg>
        )}
      </button>
      <div className="flex-1">
        <p className={`text-card-title font-semibold ${item.checked ? "line-through text-muted-foreground" : "text-foreground"}`}>
          {item.name}
        </p>
        <p className="text-caption text-muted-foreground">{item.quantity}</p>
      </div>
      {item.price && (
        <span className={`text-sm font-semibold ${item.checked ? "text-muted-foreground" : "text-primary"}`}>
          {formatPrice(item.price)}
        </span>
      )}
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${item.category === "outOfStock"
        ? "bg-primary/10 text-primary"
        : "bg-secondary/20 text-secondary"
        }`}>
        {item.source}
      </span>
    </div>
  </SwipeableItem>
);

const ShoppingList = () => {
  const navigate = useNavigate();
  const [activeSort, setActiveSort] = useState<"source" | "smart">("source");
  const {
    outOfStockItems,
    recipeItems,
    itemsByAisle,
    toggleItem,
    removeItem,
    clearChecked,
    checkedCount,
    totalCount,
    estimatedTotal,
    remainingTotal
  } = useShoppingList();

  const enterStoreMode = () => {
    navigate("/store-mode");
  };

  const totalToRestock = outOfStockItems.length;
  const totalForRecipes = recipeItems.length;

  return (
    <div className="h-screen w-full overflow-y-auto bg-background pb-40 hide-scrollbar">
      {/* Header */}
      <div className="screen-padding py-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/my-pantry")}
            className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-section-title text-foreground font-semibold">Shopping List</h1>
          {checkedCount > 0 ? (
            <button
              onClick={clearChecked}
              className="p-2 hover:bg-destructive/10 rounded-full transition-colors"
            >
              <Trash2 className="w-5 h-5 text-destructive" />
            </button>
          ) : (
            <div className="w-10" />
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card rounded-xl p-4 shadow-card">
            <p className="text-2xl font-bold text-foreground">{totalToRestock}</p>
            <div className="flex items-center gap-1 text-primary">
              <AlertTriangle className="w-3 h-3" />
              <span className="text-xs">to restock</span>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-card">
            <p className="text-2xl font-bold text-foreground">{totalForRecipes}</p>
            <div className="flex items-center gap-1 text-destructive">
              <UtensilsCrossed className="w-3 h-3" />
              <span className="text-xs">for recipes</span>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-card">
            <p className="text-2xl font-bold text-primary">{formatPrice(estimatedTotal)}</p>
            <div className="flex items-center gap-1 text-muted-foreground">
              <DollarSign className="w-3 h-3" />
              <span className="text-xs">est. total</span>
            </div>
          </div>
        </div>

        {/* Remaining total banner */}
        {checkedCount > 0 && (
          <div className="bg-primary/10 rounded-xl p-3 mb-4 flex items-center justify-between">
            <span className="text-sm text-foreground">
              <span className="font-medium">{checkedCount}</span> of {totalCount} items checked
            </span>
            <span className="text-sm font-semibold text-primary">
              {formatPrice(remainingTotal)} left
            </span>
          </div>
        )}

        {/* Sort Toggle */}
        <div className="flex bg-muted rounded-full p-1">
          <button
            onClick={() => setActiveSort("source")}
            className={`flex-1 py-3 rounded-full text-card-title font-medium transition-all ${activeSort === "source"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground"
              }`}
          >
            By Source
          </button>
          <button
            onClick={() => setActiveSort("smart")}
            className={`flex-1 py-3 rounded-full text-card-title font-medium transition-all flex items-center justify-center gap-2 ${activeSort === "smart"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground"
              }`}
          >
            <MapPin className="w-4 h-4" />
            Smart Sort
          </button>
        </div>

        {/* Swipe hint */}
        <p className="text-xs text-muted-foreground text-center mt-3">
          ← Swipe left on items to remove
        </p>
      </div>

      {/* Lists */}
      <div className="screen-padding space-y-6">
        {activeSort === "source" ? (
          <>
            {/* Out of Stock */}
            {outOfStockItems.length > 0 && (
              <div>
                <h2 className="text-section-title text-foreground font-semibold mb-4">
                  Out of Stock
                </h2>
                <div className="space-y-3">
                  {outOfStockItems.map((item) => (
                    <ShoppingItemCard
                      key={item.id}
                      item={item}
                      onToggle={() => toggleItem(item.id)}
                      onRemove={() => removeItem(item.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Missing for Recipes */}
            {recipeItems.length > 0 && (
              <div>
                <h2 className="text-section-title text-foreground font-semibold mb-4">
                  Missing for Recipes
                </h2>
                <div className="space-y-3">
                  {recipeItems.map((item) => (
                    <ShoppingItemCard
                      key={item.id}
                      item={item}
                      onToggle={() => toggleItem(item.id)}
                      onRemove={() => removeItem(item.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Smart Sort - By Aisle */
          Object.entries(itemsByAisle).map(([aisle, items]) => (
            <div key={aisle}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{aisleIcons[aisle] || "📦"}</span>
                <h2 className="text-section-title text-foreground font-semibold">
                  {aisle}
                </h2>
                <span className="ml-auto text-sm text-muted-foreground">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              </div>
              <div className="space-y-3">
                {items.map((item) => (
                  <ShoppingItemCard
                    key={item.id}
                    item={item}
                    onToggle={() => toggleItem(item.id)}
                    onRemove={() => removeItem(item.id)}
                  />
                ))}
              </div>
            </div>
          ))
        )}

        {/* Empty State */}
        {totalCount === 0 && (
          <div className="flex flex-col items-center py-12 text-muted-foreground">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <p className="text-lg font-medium text-foreground mb-2">Your list is empty</p>
            <p className="text-sm text-center">Add items from your pantry or recipes to get started.</p>
          </div>
        )}
      </div>

      {/* Enter Store Mode Button */}
      <div className="fixed bottom-20 left-0 right-0 bg-background screen-padding pb-4 pt-4">
        <Button
          onClick={enterStoreMode}
          disabled={totalCount === 0}
          className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-card-title flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <ShoppingCart className="w-5 h-5" />
          Enter Store Mode
        </Button>
      </div>

    </div>
  );
};

export default ShoppingList;
