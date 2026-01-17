import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IngredientCardSkeleton } from "@/components/ui/skeleton";
import { useScanSession, ScanItem } from "@/hooks/useScanSession";
import { ContainerLabelBottomSheet } from "@/components/scan/ContainerLabelBottomSheet";
import { usePantry } from "@/hooks/usePantry";
import { useUser } from "@/hooks/useUser";

// ============================================================================
// REVIEW INGREDIENTS PAGE
// Displays all scanned items with support for editing, labeling, and Unknown tags
// ============================================================================

const ReviewIngredients = () => {
  const navigate = useNavigate();
  const {
    items,
    unknownItems,
    unlabeledCount,
    addItem,
    updateItem,
    labelItem,
    removeItem,
    getDisplayName
  } = useScanSession();
  const { addItems: addToPantry } = usePantry();
  const { addImpact } = useUser();

  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);

  // Add/Edit Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScanItem | null>(null);
  const [formData, setFormData] = useState({ name: "", quantity: "" });

  // Labeling Bottom Sheet State
  const [labelingItem, setLabelingItem] = useState<ScanItem | null>(null);
  const [isLabelSheetOpen, setIsLabelSheetOpen] = useState(false);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Group items by status for display
  const groupedItems = useMemo(() => {
    const identified = items.filter(i =>
      i.detection_type === 'identified' || i.is_user_labeled
    );
    const needsAttention = items.filter(i =>
      (i.detection_type === 'container' ||
        i.detection_type === 'low_confidence' ||
        i.detection_type === 'unknown') &&
      !i.is_user_labeled
    );
    return { identified, needsAttention };
  }, [items]);

  // Navigation handlers
  const handleBack = () => navigate("/scan");

  // Confirm and proceed
  const handleConfirm = () => {
    setIsConfirming(true);

    // Convert scanned items to pantry items
    const pantryItems = items.map(item => ({
      name: getDisplayName(item),
      quantity: item.quantity,
      expiry: "Unknown",
      status: "full" as const,
      image: item.detection_type === 'identified' ? "🥬" : "📦",
      category: "Unsorted"
    }));
    addToPantry(pantryItems);

    // Calculate impact based on items saved
    const impact = {
      money: items.length * 4.50,
      co2: items.length * 1.2,
      foodWeight: items.length * 0.5,
      recipeName: `Rescued Meal with ${getDisplayName(items[0]) || 'Ingredients'}`
    };
    addImpact(impact);

    setTimeout(() => {
      navigate("/health-constraints");
    }, 600);
  };

  // Add new item dialog
  const openAddDialog = () => {
    setEditingItem(null);
    setFormData({ name: "", quantity: "" });
    setIsDialogOpen(true);
  };

  // Edit existing item dialog
  const openEditDialog = (item: ScanItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name || item.user_label || "",
      quantity: item.quantity
    });
    setIsDialogOpen(true);
  };

  // Open labeling sheet for unknown items
  const openLabelSheet = (item: ScanItem) => {
    setLabelingItem(item);
    setIsLabelSheetOpen(true);
  };

  // Handle label submission
  const handleLabelSubmit = (id: string, label: string) => {
    labelItem(id, label);
    setIsLabelSheetOpen(false);
    setLabelingItem(null);
  };

  // Save item from dialog
  const handleSaveItem = () => {
    if (!formData.name || !formData.quantity) return;

    if (editingItem) {
      updateItem(editingItem.id, {
        name: formData.name,
        quantity: formData.quantity,
        is_user_labeled: true,
        user_label: formData.name,
      });
    } else {
      addItem({
        name: formData.name,
        quantity: formData.quantity,
        image: "/placeholder.svg",
        detection_type: 'identified',
        confidence: 100,
        container_type: 'none',
        content_type: 'solid',
        is_user_labeled: true,
        user_label: formData.name,
        ai_suggestions: [],
        freshness: 'fresh',
        status: 'green',
        hotspot_position: { top: '50%', left: '50%' },
      });
    }
    setIsDialogOpen(false);
  };

  // Delete item
  const handleDeleteItem = (id: string) => {
    removeItem(id);
    if (editingItem?.id === id) setIsDialogOpen(false);
  };

  // Get freshness badge
  const getFreshnessBadge = (freshness: ScanItem["freshness"]) => {
    const badges = {
      "use-soon": (
        <span className="px-3 py-1 rounded-md bg-secondary/20 text-secondary text-caption font-medium">
          Use Soon
        </span>
      ),
      fresh: (
        <span className="px-3 py-1 rounded-md bg-primary/10 text-primary text-caption font-medium">
          Fresh
        </span>
      ),
      frozen: (
        <span className="px-3 py-1 rounded-md bg-blue-100 text-blue-600 text-caption font-medium">
          Frozen
        </span>
      ),
      expired: (
        <span className="px-3 py-1 rounded-md bg-destructive/10 text-destructive text-caption font-medium">
          Expired
        </span>
      ),
      unknown: (
        <span className="px-3 py-1 rounded-md bg-muted text-muted-foreground text-caption font-medium">
          Unknown
        </span>
      ),
    };
    return badges[freshness] || badges.unknown;
  };

  // Get detection type badge
  const getDetectionBadge = (item: ScanItem) => {
    if (item.is_user_labeled) {
      return (
        <span className="px-3 py-1 rounded-md bg-primary/10 text-primary text-caption font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Labeled
        </span>
      );
    }

    switch (item.detection_type) {
      case 'identified':
        return (
          <span className="px-3 py-1 rounded-md bg-primary/10 text-primary text-caption font-medium">
            {item.confidence}% Confidence
          </span>
        );
      case 'container':
        return (
          <span className="px-3 py-1 rounded-md bg-secondary/20 text-secondary text-caption font-medium">
            Unknown Contents
          </span>
        );
      case 'low_confidence':
        return (
          <span className="px-3 py-1 rounded-md bg-destructive/10 text-destructive text-caption font-medium">
            Please Verify
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-md bg-muted text-muted-foreground text-caption font-medium">
            Unknown
          </span>
        );
    }
  };

  // Get status dot color
  const getStatusDot = (status: ScanItem["status"]) => {
    const colors = {
      green: "bg-primary",
      yellow: "bg-secondary",
      red: "bg-destructive",
    };
    return <div className={`w-3 h-3 rounded-full ${colors[status]}`} />;
  };

  // Render item card
  const renderItemCard = (item: ScanItem, index: number) => {
    const isUnknown = !item.name && !item.is_user_labeled;
    const displayName = getDisplayName(item);

    return (
      <div
        key={item.id}
        className={`bg-card rounded-lg shadow-card p-4 flex items-center gap-4 animate-slide-up transition-all duration-200 hover:shadow-floating hover:-translate-y-0.5 ${isUnknown ? 'ring-2 ring-secondary/30' : ''
          }`}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Image */}
        <div className={`w-20 h-20 rounded-full overflow-hidden flex-shrink-0 ${item.container_type !== 'none' ? 'bg-muted' : 'bg-foreground'
          }`}>
          {item.image && item.image !== "/placeholder.svg" ? (
            <img
              src={item.image}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">
              {item.container_type === 'steel_dabba' ? '🥘' :
                item.container_type === 'bottle' ? '🍼' :
                  item.container_type === 'wrapped' ? '📦' :
                    item.container_type === 'jar' ? '🫙' : '❓'}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`text-card-title truncate pr-2 ${isUnknown ? 'text-secondary' : 'text-foreground'
              }`}>
              {displayName}
            </h3>
            {getStatusDot(item.status)}
          </div>
          <p className="text-body text-muted-foreground mb-2">
            {item.quantity}
          </p>
          <div className="flex flex-wrap gap-2">
            {getFreshnessBadge(item.freshness)}
            {getDetectionBadge(item)}
          </div>
        </div>

        {/* Action Button */}
        {isUnknown ? (
          <button
            onClick={() => openLabelSheet(item)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-caption font-medium"
          >
            Label
          </button>
        ) : (
          <button
            onClick={() => openEditDialog(item)}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <Pencil className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
      </div>
    );
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

      {/* Attention Banner */}
      {!isLoading && unlabeledCount > 0 && (
        <div className="screen-padding mb-4">
          <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-xl">
            <AlertCircle className="w-6 h-6 text-secondary flex-shrink-0" />
            <div>
              <p className="text-card-title text-foreground font-medium">
                {unlabeledCount} item{unlabeledCount > 1 ? 's' : ''} need labels
              </p>
              <p className="text-caption text-muted-foreground">
                Tap "Label" to identify unknown containers
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Items Needing Attention */}
      {!isLoading && groupedItems.needsAttention.length > 0 && (
        <div className="screen-padding mb-6">
          <h2 className="text-card-title text-foreground font-medium mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-secondary" />
            Needs Your Attention
          </h2>
          <div className="space-y-3">
            {groupedItems.needsAttention.map((item, index) =>
              renderItemCard(item, index)
            )}
          </div>
        </div>
      )}

      {/* Identified Items */}
      <div className="screen-padding space-y-4">
        {!isLoading && groupedItems.identified.length > 0 && (
          <h2 className="text-card-title text-foreground font-medium">
            Identified Items
          </h2>
        )}

        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <IngredientCardSkeleton key={i} />
          ))
        ) : (
          groupedItems.identified.map((item, index) =>
            renderItemCard(item, groupedItems.needsAttention.length + index)
          )
        )}
      </div>

      {/* Confirm Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background screen-padding pb-8 pt-4">
        <Button
          onClick={handleConfirm}
          disabled={isLoading || items.length === 0 || isConfirming}
          className="w-full h-14 rounded-button text-card-title flex items-center justify-center gap-2"
        >
          {isConfirming ? "Processing..." : "Confirm & Continue"}
          {!isConfirming && <ArrowRight className="w-5 h-5" />}
        </Button>
      </div>

      {/* Add/Edit Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-sm rounded-xl p-6 shadow-xl animate-scale-in">
            <h2 className="text-section-title font-semibold mb-4">
              {editingItem ? "Edit Item" : "Add Item"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-caption font-medium text-muted-foreground mb-1 block">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 rounded-lg border border-border bg-background"
                  placeholder="e.g. Dal, Spinach, Milk"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-caption font-medium text-muted-foreground mb-1 block">
                  Quantity
                </label>
                <input
                  type="text"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  className="w-full p-3 rounded-lg border border-border bg-background"
                  placeholder="e.g. 500g, 1L, 2 pcs"
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

      {/* Container Label Bottom Sheet */}
      <ContainerLabelBottomSheet
        isOpen={isLabelSheetOpen}
        item={labelingItem}
        onClose={() => {
          setIsLabelSheetOpen(false);
          setLabelingItem(null);
        }}
        onLabel={handleLabelSubmit}
      />
    </div>
  );
};

export default ReviewIngredients;
