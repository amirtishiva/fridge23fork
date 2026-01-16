import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IngredientCardSkeleton } from "@/components/ui/skeleton";
import { useScanSession } from "@/hooks/useScanSession";
import { usePantry } from "@/hooks/usePantry";
import { useUser } from "@/hooks/useUser";

interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  image: string;
  freshness: "use-soon" | "fresh" | "frozen" | "unknown";
  confidence: "high" | "check";
  status: "green" | "yellow" | "red";
}

const ReviewIngredients = () => {
  const navigate = useNavigate();
  const { items, addItem, updateItem, removeItem, resetSession } = useScanSession();
  const { addItems: addToPantry } = usePantry();
  const { addImpact } = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Ingredient | null>(null);
  const [formData, setFormData] = useState({ name: "", quantity: "" });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    navigate("/scan");
  };

  const handleConfirm = () => {
    setIsConfirming(true);
    // Add items to pantry
    const pantryItems = items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      expiry: "Unknown",
      status: "full" as const,
      image: item.image === "/placeholder.svg" ? "📦" : "🥬",
      category: "Unsorted"
    }));
    addToPantry(pantryItems);

    // Calculate and add impact
    // Simulating simplified impact calculation per item
    const impact = {
      money: items.length * 4.50, // Approx $4.50 per item saved
      co2: items.length * 1.2,    // 1.2kg CO2
      foodWeight: items.length * 0.5, // 0.5kg food
      recipeName: `Rescued Meal with ${items[0]?.name || 'Ingredients'}`
    };
    addImpact(impact);

    setTimeout(() => {
      // Navigate to Health Constraints to personalize recipes
      navigate("/health-constraints");
    }, 600);
  };

  const openAddDialog = () => {
    setEditingItem(null);
    setFormData({ name: "", quantity: "" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: Ingredient) => {
    setEditingItem(item);
    setFormData({ name: item.name, quantity: item.quantity });
    setIsDialogOpen(true);
  };

  const handleSaveItem = () => {
    if (!formData.name || !formData.quantity) return;

    if (editingItem) {
      updateItem(editingItem.id, {
        name: formData.name,
        quantity: formData.quantity
      });
    } else {
      addItem({
        name: formData.name,
        quantity: formData.quantity,
        image: "/placeholder.svg", // Default image
        freshness: "fresh",
        confidence: "high",
        status: "green"
      });
    }
    setIsDialogOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    removeItem(id);
    if (editingItem?.id === id) setIsDialogOpen(false);
  };

  const getFreshnessBadge = (freshness: Ingredient["freshness"]) => {
    switch (freshness) {
      case "use-soon":
        return (
          <span className="px-3 py-1 rounded-md bg-secondary/20 text-secondary text-caption font-medium">
            Use Soon
          </span>
        );
      case "fresh":
        return (
          <span className="px-3 py-1 rounded-md bg-primary/10 text-primary text-caption font-medium">
            Fresh
          </span>
        );
      case "frozen":
        return (
          <span className="px-3 py-1 rounded-md bg-blue-100 text-blue-600 text-caption font-medium">
            Frozen
          </span>
        );
      case "unknown":
        return (
          <span className="px-3 py-1 rounded-md bg-muted text-muted-foreground text-caption font-medium">
            Unknown
          </span>
        );
    }
  };

  const getConfidenceBadge = (confidence: Ingredient["confidence"]) => {
    if (confidence === "high") {
      return (
        <span className="px-3 py-1 rounded-md bg-primary/10 text-primary text-caption font-medium">
          High Confidence
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-md bg-destructive/10 text-destructive text-caption font-medium">
        Please Verify
      </span>
    );
  };

  const getStatusDot = (status: Ingredient["status"]) => {
    switch (status) {
      case "green":
        return <div className="w-3 h-3 rounded-full bg-primary" />;
      case "yellow":
        return <div className="w-3 h-3 rounded-full bg-secondary" />;
      case "red":
        return <div className="w-3 h-3 rounded-full bg-destructive" />;
    }
  };

  return (
    <div className="h-screen w-full overflow-y-auto bg-background pb-40 hide-scrollbar">
      {/* Header */}
      <div className="sticky top-0 bg-background z-10 screen-padding py-4">
        <div className="flex items-center justify-between">
          <button onClick={handleBack} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-section-title text-foreground">Review Ingredients</h1>
          <button
            onClick={openAddDialog}
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
          >
            <Plus className="w-5 h-5 text-primary" />
          </button>
        </div>
        <p className="text-body text-muted-foreground mt-2">
          {isLoading ? "Loading..." : `${items.length} items detected`}
        </p>
      </div>

      {/* Ingredient List */}
      <div className="screen-padding space-y-4">
        {isLoading ? (
          // Skeleton loading state
          [...Array(5)].map((_, i) => (
            <IngredientCardSkeleton key={i} />
          ))
        ) : (
          items.map((item, index) => (
            <div
              key={item.id}
              className="bg-card rounded-lg shadow-card p-4 flex items-center gap-4 animate-slide-up transition-all duration-200 hover:shadow-floating hover:-translate-y-0.5"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Image */}
              <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-foreground">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-card-title text-foreground truncate pr-2">
                    {item.name}
                  </h3>
                  {getStatusDot(item.status)}
                </div>
                <p className="text-body text-muted-foreground mb-2">{item.quantity}</p>
                <div className="flex flex-wrap gap-2">
                  {getFreshnessBadge(item.freshness)}
                  {getConfidenceBadge(item.confidence)}
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => openEditDialog(item)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <Pencil className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Confirm Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background screen-padding pb-8 pt-4">
        <Button
          onClick={handleConfirm}
          disabled={isLoading || items.length === 0 || isConfirming}
          className="w-full h-14 rounded-button text-card-title flex items-center justify-center gap-2"
        >
          {isConfirming ? "Cooking..." : "Confirm & Cook"}
          {!isConfirming && <ArrowRight className="w-5 h-5" />}
        </Button>
      </div>

      {/* Add/Edit Dialog Overlay */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-sm rounded-xl p-6 shadow-xl animate-scale-in">
            <h2 className="text-section-title font-semibold mb-4">
              {editingItem ? "Edit Ingredient" : "Add Ingredient"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-caption font-medium text-muted-foreground mb-1 block">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 rounded-lg border border-border bg-background"
                  placeholder="e.g. Carrots"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-caption font-medium text-muted-foreground mb-1 block">Quantity</label>
                <input
                  type="text"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  className="w-full p-3 rounded-lg border border-border bg-background"
                  placeholder="e.g. 500g"
                />
              </div>

              <div className="flex gap-3 pt-2">
                {editingItem && (
                  <button
                    onClick={() => handleDeleteItem(editingItem.id)}
                    className="flex-1 py-3 text-destructive font-medium bg-destructive/10 rounded-lg"
                  >
                    Delete
                  </button>
                )}
                <div className="flex-1 flex gap-3">
                  <button
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1 py-3 bg-muted font-medium rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveItem}
                    disabled={!formData.name || !formData.quantity}
                    className="flex-1 py-3 bg-primary text-primary-foreground font-medium rounded-lg disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewIngredients;
