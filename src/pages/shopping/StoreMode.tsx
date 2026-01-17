import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Check, Mic, MicOff, Volume2, VolumeX, Wallet, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useVoiceCommands } from "@/hooks/useVoiceCommands";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useToast } from "@/hooks/use-toast";
import { usePantry } from "@/hooks/usePantry";
import { useShoppingList } from "@/hooks/useShoppingList";
import PriceEditModal from "@/components/shopping/PriceEditModal";
import BudgetLimitModal from "@/components/shopping/BudgetLimitModal";

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  checked: boolean;
  price: number;
}

interface ShoppingCategory {
  name: string;
  items: ShoppingItem[];
}

const initialCategories: ShoppingCategory[] = [
  {
    name: "Produce",
    items: [
      { id: "1", name: "Bananas", quantity: "1 bunch (approx 6)", checked: false, price: 0.59 },
      { id: "2", name: "Avocados", quantity: "3 ripe (check softness)", checked: false, price: 4.50 },
      { id: "3", name: "Roma Tomatoes", quantity: "5 large", checked: true, price: 2.99 },
    ],
  },
  {
    name: "Pantry / Grains",
    items: [
      { id: "4", name: "Brown Rice", quantity: "1kg bag", checked: false, price: 3.99 },
      { id: "5", name: "Olive Oil", quantity: "Extra Virgin", checked: false, price: 8.99 },
    ],
  },
  {
    name: "Dairy & Eggs",
    items: [
      { id: "6", name: "Milk", quantity: "1 Gallon", checked: false, price: 4.29 },
      { id: "7", name: "Eggs", quantity: "1 Dozen", checked: false, price: 4.99 },
    ],
  },
];

const formatPrice = (price: number) => `$${price.toFixed(2)}`;

// Voice command patterns
const checkPatterns = [
  /^(check|got|done|checked|mark|get|grabbed|have)\s+(.+)/i,
  /^(.+)\s+(done|checked|got|grabbed)$/i,
  /^(add|bought)\s+(.+)/i,
];

const uncheckPatterns = [
  /^(uncheck|remove|undo|put back)\s+(.+)/i,
  /^(.+)\s+(uncheck|undo)$/i,
];

// Read list command patterns
const readListPatterns = [
  /^read\s*(my)?\s*list$/i,
  /^what('s|s)?\s*(left|remaining)$/i,
  /^what\s*do\s*i\s*need$/i,
  /^list\s*items$/i,
  /^tell\s*me\s*(what's\s*)?left$/i,
  /^remaining\s*items$/i,
];

const BUDGET_STORAGE_KEY = "fridgeai-budget-limit";

const StoreMode = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories, setCategories] = useState(initialCategories);
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<{ item: string; action: "checked" | "unchecked" } | null>(null);
  const [isSpeakingList, setIsSpeakingList] = useState(false);

  // New feature states
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetLimit, setBudgetLimit] = useState<number | null>(() => {
    const stored = localStorage.getItem(BUDGET_STORAGE_KEY);
    return stored ? parseFloat(stored) : null;
  });
  const [editingPrice, setEditingPrice] = useState<{ id: string; name: string; price: number } | null>(null);
  const [budgetAlertShown, setBudgetAlertShown] = useState(false);

  const { speak, stop: stopSpeaking, isSupported: ttsSupported } = useSpeechSynthesis({ rate: 0.9 });

  // Get all items for matching
  const allItems = categories.flatMap(cat => cat.items);
  const uncheckedItems = allItems.filter(item => !item.checked);

  // Price calculations
  const totalPrice = categories.reduce(
    (acc, cat) => acc + cat.items.reduce((sum, item) => sum + item.price, 0),
    0
  );
  const checkedPrice = categories.reduce(
    (acc, cat) => acc + cat.items.filter(i => i.checked).reduce((sum, item) => sum + item.price, 0),
    0
  );
  const remainingPrice = totalPrice - checkedPrice;

  // Budget calculations
  const budgetPercentage = budgetLimit ? (checkedPrice / budgetLimit) * 100 : 0;
  const isOverBudget = budgetLimit ? checkedPrice > budgetLimit : false;
  const isNearBudget = budgetLimit ? checkedPrice >= budgetLimit * 0.85 && checkedPrice <= budgetLimit : false;

  // Save budget to localStorage
  useEffect(() => {
    if (budgetLimit !== null) {
      localStorage.setItem(BUDGET_STORAGE_KEY, budgetLimit.toString());
    } else {
      localStorage.removeItem(BUDGET_STORAGE_KEY);
    }
  }, [budgetLimit]);

  // Budget alerts
  useEffect(() => {
    if (!budgetLimit || budgetAlertShown) return;

    if (isOverBudget) {
      toast({
        title: "⚠️ Budget Exceeded!",
        description: `You're $${(checkedPrice - budgetLimit).toFixed(2)} over your $${budgetLimit.toFixed(2)} budget.`,
        variant: "destructive",
      });
      setBudgetAlertShown(true);
    } else if (isNearBudget && !budgetAlertShown) {
      toast({
        title: "💰 Approaching Budget",
        description: `You've spent ${formatPrice(checkedPrice)} of your ${formatPrice(budgetLimit)} budget.`,
      });
      setBudgetAlertShown(true);
    }
  }, [checkedPrice, budgetLimit, isOverBudget, isNearBudget, budgetAlertShown, toast]);

  // Reset alert when budget changes
  useEffect(() => {
    setBudgetAlertShown(false);
  }, [budgetLimit]);

  const readRemainingItems = useCallback(() => {
    if (uncheckedItems.length === 0) {
      speak("Your list is complete! You've got everything.");
      toast({
        title: "🎉 All done!",
        description: "You've checked off everything on your list.",
      });
      return;
    }

    setIsSpeakingList(true);

    const itemNames = uncheckedItems.map(item => item.name);
    const lastItem = itemNames.pop();

    let speechText = "";
    if (itemNames.length === 0) {
      speechText = `You still need ${lastItem}.`;
    } else if (itemNames.length === 1) {
      speechText = `You still need ${itemNames[0]} and ${lastItem}.`;
    } else {
      speechText = `You still need ${itemNames.join(", ")}, and ${lastItem}.`;
    }

    speechText = `${uncheckedItems.length} items remaining. ${speechText}`;

    speak(speechText);

    toast({
      title: `📋 ${uncheckedItems.length} items left`,
      description: uncheckedItems.map(i => i.name).join(", "),
    });

    setTimeout(() => setIsSpeakingList(false), 3000 + (uncheckedItems.length * 500));
  }, [uncheckedItems, speak, toast]);

  const stopReadingList = useCallback(() => {
    stopSpeaking();
    setIsSpeakingList(false);
  }, [stopSpeaking]);

  const findItemByName = useCallback((searchTerm: string) => {
    const term = searchTerm.toLowerCase().trim();

    let found = allItems.find(item => item.name.toLowerCase() === term);
    if (found) return found;

    found = allItems.find(item =>
      item.name.toLowerCase().includes(term) ||
      term.includes(item.name.toLowerCase())
    );
    if (found) return found;

    const words = term.split(/\s+/);
    found = allItems.find(item =>
      words.some(word => item.name.toLowerCase().includes(word) && word.length > 2)
    );

    return found;
  }, [allItems]);

  const toggleItemById = useCallback((itemId: string, forceCheck?: boolean) => {
    setCategories(prev =>
      prev.map(category => ({
        ...category,
        items: category.items.map(item =>
          item.id === itemId
            ? { ...item, checked: forceCheck !== undefined ? forceCheck : !item.checked }
            : item
        ),
      }))
    );
  }, []);

  const updateItemPrice = useCallback((itemId: string, newPrice: number) => {
    setCategories(prev =>
      prev.map(category => ({
        ...category,
        items: category.items.map(item =>
          item.id === itemId ? { ...item, price: newPrice } : item
        ),
      }))
    );
  }, []);



  const handlePriceEdit = useCallback((itemId: string, name: string, currentPrice: number) => {
    setEditingPrice({ id: itemId, name, price: currentPrice });
  }, []);

  const handlePriceSave = useCallback((newPrice: number) => {
    if (editingPrice) {
      updateItemPrice(editingPrice.id, newPrice);
      toast({
        title: "Price updated",
        description: `${editingPrice.name} is now ${formatPrice(newPrice)}`,
      });
    }
    setEditingPrice(null);
  }, [editingPrice, updateItemPrice, toast]);

  const handleVoiceCommand = useCallback((command: string) => {
    for (const pattern of readListPatterns) {
      if (pattern.test(command)) {
        readRemainingItems();
        return;
      }
    }

    for (const pattern of checkPatterns) {
      const match = command.match(pattern);
      if (match) {
        const itemName = match[2] || match[1];
        const item = findItemByName(itemName);

        if (item) {
          toggleItemById(item.id, true);
          setHighlightedItem(item.id);
          setLastAction({ item: item.name, action: "checked" });

          toast({
            title: `✓ ${item.name}`,
            description: "Checked off your list",
          });

          setTimeout(() => setHighlightedItem(null), 1500);
          return;
        }
      }
    }

    for (const pattern of uncheckPatterns) {
      const match = command.match(pattern);
      if (match) {
        const itemName = match[2] || match[1];
        const item = findItemByName(itemName);

        if (item) {
          toggleItemById(item.id, false);
          setHighlightedItem(item.id);
          setLastAction({ item: item.name, action: "unchecked" });

          toast({
            title: `↩ ${item.name}`,
            description: "Back on your list",
          });

          setTimeout(() => setHighlightedItem(null), 1500);
          return;
        }
      }
    }

    const item = findItemByName(command);
    if (item) {
      const newCheckedState = !item.checked;
      toggleItemById(item.id, newCheckedState);
      setHighlightedItem(item.id);
      setLastAction({
        item: item.name,
        action: newCheckedState ? "checked" : "unchecked"
      });

      toast({
        title: newCheckedState ? `✓ ${item.name}` : `↩ ${item.name}`,
        description: newCheckedState ? "Checked off your list" : "Back on your list",
      });

      setTimeout(() => setHighlightedItem(null), 1500);
    }
  }, [findItemByName, toggleItemById, toast, readRemainingItems]);

  const {
    isListening,
    isSupported: sttSupported,
    transcript,
    toggleListening,
    stopListening
  } = useVoiceCommands({
    onCommand: handleVoiceCommand,
  });

  const toggleItem = (categoryIndex: number, itemId: string) => {
    setCategories((prev) =>
      prev.map((category, idx) =>
        idx === categoryIndex
          ? {
            ...category,
            items: category.items.map((item) =>
              item.id === itemId ? { ...item, checked: !item.checked } : item
            ),
          }
          : category
      )
    );
  };

  const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0);
  const checkedItems = categories.reduce(
    (acc, cat) => acc + cat.items.filter((item) => item.checked).length,
    0
  );
  const progress = (checkedItems / totalItems) * 100;

  const handleClose = () => {
    stopListening();
    stopReadingList();
    navigate("/shopping-list");
  };

  const { addItems: addToPantry } = usePantry();

  const handleFinishShopping = () => {
    stopListening();
    stopReadingList();

    // Get all checked items
    const purchasedItems = categories.flatMap(cat =>
      cat.items.filter(item => item.checked).map(item => ({
        name: item.name,
        quantity: item.quantity,
        expiry: "Unknown", // Default expiry
        status: "full" as const,
        image: "📦", // Default image
        category: cat.name
      }))
    );

    // Add to pantry
    if (purchasedItems.length > 0) {
      addToPantry(purchasedItems);
      toast({
        title: "Pantry Updated",
        description: `Added ${purchasedItems.length} items to your pantry.`,
      });
    }

    navigate("/inventory-updated");
  };

  useEffect(() => {
    return () => {
      stopListening();
      stopSpeaking();
    };
  }, [stopListening, stopSpeaking]);

  return (
    <div className="h-screen w-full overflow-y-auto bg-background pb-40 hide-scrollbar">
      {/* Budget Modal */}
      {showBudgetModal && (
        <BudgetLimitModal
          currentBudget={budgetLimit}
          onSetBudget={setBudgetLimit}
          onClose={() => setShowBudgetModal(false)}
        />
      )}

      {/* Price Edit Modal */}
      {editingPrice && (
        <PriceEditModal
          itemName={editingPrice.name}
          currentPrice={editingPrice.price}
          onSave={handlePriceSave}
          onClose={() => setEditingPrice(null)}
        />
      )}

      {/* Header */}
      <div className="screen-padding py-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={handleClose} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
            <X className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-section-title text-foreground font-semibold">Store Mode</h1>
          <button
            onClick={() => setShowBudgetModal(true)}
            className={`p-2 -mr-2 rounded-full transition-colors ${budgetLimit ? "text-primary" : "text-muted-foreground hover:bg-muted"
              }`}
          >
            <Wallet className="w-6 h-6" />
          </button>
        </div>

        {/* Budget Warning Banner */}
        {budgetLimit && (isOverBudget || isNearBudget) && (
          <div className={`rounded-xl p-3 mb-4 flex items-center gap-3 ${isOverBudget
            ? "bg-destructive/10 border-2 border-destructive"
            : "bg-secondary/10 border-2 border-secondary"
            }`}>
            <AlertTriangle className={`w-5 h-5 ${isOverBudget ? "text-destructive" : "text-secondary"}`} />
            <div className="flex-1">
              <p className={`text-sm font-medium ${isOverBudget ? "text-destructive" : "text-secondary"}`}>
                {isOverBudget ? "Over Budget!" : "Almost at Budget"}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatPrice(checkedPrice)} of {formatPrice(budgetLimit)}
                {isOverBudget && ` (+${formatPrice(checkedPrice - budgetLimit)})`}
              </p>
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-caption text-muted-foreground uppercase tracking-wider">
              PROGRESS
            </span>
            <div className="flex items-center gap-4">
              <span className="text-card-title">
                <span className="text-primary font-bold">{checkedItems}</span>
                <span className="text-muted-foreground"> / {totalItems}</span>
              </span>
              <span className="text-sm font-semibold text-primary">
                {formatPrice(remainingPrice)} left
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Running Total Banner with Budget */}
        <div className={`rounded-xl p-3 mb-4 flex items-center justify-between ${budgetLimit
          ? isOverBudget
            ? "bg-gradient-to-r from-destructive/10 to-destructive/5"
            : "bg-gradient-to-r from-primary/10 to-primary/5"
          : "bg-gradient-to-r from-primary/10 to-primary/5"
          }`}>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Cart Total</p>
            <p className={`text-xl font-bold ${isOverBudget ? "text-destructive" : "text-primary"}`}>
              {formatPrice(checkedPrice)}
            </p>
          </div>
          <div className="text-right">
            {budgetLimit ? (
              <>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Budget</p>
                <p className="text-lg font-semibold text-foreground">{formatPrice(budgetLimit)}</p>
                <Progress
                  value={Math.min(budgetPercentage, 100)}
                  className={`h-1 w-20 mt-1 ${isOverBudget ? "[&>div]:bg-destructive" : ""}`}
                />
              </>
            ) : (
              <>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Est. Total</p>
                <p className="text-lg font-semibold text-foreground">{formatPrice(totalPrice)}</p>
              </>
            )}
          </div>
        </div>

        {/* Voice Status Banner */}
        {sttSupported && (
          <div
            className={`rounded-xl p-3 mb-4 flex items-center gap-3 transition-all ${isListening
              ? "bg-primary/10 border-2 border-primary"
              : isSpeakingList
                ? "bg-secondary/10 border-2 border-secondary"
                : "bg-muted border-2 border-transparent"
              }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isListening
              ? "bg-primary animate-pulse"
              : isSpeakingList
                ? "bg-secondary animate-pulse"
                : "bg-muted-foreground/20"
              }`}>
              {isSpeakingList ? (
                <Volume2 className="w-5 h-5 text-secondary-foreground" />
              ) : isListening ? (
                <Mic className="w-5 h-5 text-primary-foreground" />
              ) : (
                <MicOff className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              {isSpeakingList ? (
                <>
                  <p className="text-sm font-medium text-foreground">Reading your list...</p>
                  <p className="text-xs text-muted-foreground">
                    {uncheckedItems.length} items remaining
                  </p>
                </>
              ) : isListening ? (
                <>
                  <p className="text-sm font-medium text-foreground">Listening...</p>
                  <p className="text-xs text-muted-foreground">
                    {transcript || 'Say "read my list" or item names'}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-muted-foreground">Voice commands off</p>
                  <p className="text-xs text-muted-foreground">Tap mic to enable hands-free</p>
                </>
              )}
            </div>
            {lastAction && isListening && (
              <div className="text-xs text-primary font-medium animate-slide-up">
                {lastAction.action === "checked" ? "✓" : "↩"} {lastAction.item}
              </div>
            )}
          </div>
        )}

        {/* Voice Command Examples */}
        {isListening && (
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 mb-2">
            {["Read my list", "Got milk", "Check eggs", "What's left"].map((example) => (
              <button
                key={example}
                onClick={() => {
                  if (example === "Read my list" || example === "What's left") {
                    readRemainingItems();
                  }
                }}
                className="px-3 py-1.5 bg-card border border-border rounded-full text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1 hover:bg-muted transition-colors"
              >
                <Volume2 className="w-3 h-3" />
                "{example}"
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Shopping Categories */}
      <div className="screen-padding space-y-6">
        {categories.map((category, categoryIndex) => (
          <div key={category.name}>
            <h2 className="text-section-title text-foreground font-bold mb-4">
              {category.name}
            </h2>
            <div className="space-y-3">
              {category.items.map((item) => (
                <div
                  key={item.id}
                  className={`bg-card rounded-xl p-4 shadow-card flex items-center gap-4 cursor-pointer transition-all ${item.checked ? "opacity-60" : ""
                    } ${highlightedItem === item.id ? "ring-2 ring-primary ring-offset-2 scale-[1.02]" : ""}`}
                >
                  <div
                    onClick={() => toggleItem(categoryIndex, item.id)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${item.checked
                      ? "bg-primary"
                      : "border-2 border-muted-foreground"
                      }`}
                  >
                    {item.checked && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1" onClick={() => toggleItem(categoryIndex, item.id)}>
                    <p
                      className={`text-card-title font-semibold transition-all ${item.checked
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                        }`}
                    >
                      {item.name}
                    </p>
                    <p
                      className={`text-caption transition-all ${item.checked
                        ? "line-through text-muted-foreground/60"
                        : "text-muted-foreground"
                        }`}
                    >
                      {item.quantity}
                    </p>
                  </div>
                  {/* Tappable Price */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePriceEdit(item.id, item.name, item.price);
                    }}
                    className={`text-sm font-semibold px-2 py-1 rounded-lg transition-all hover:bg-muted ${item.checked ? "text-muted-foreground" : "text-primary"
                      }`}
                  >
                    {formatPrice(item.price)}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-background screen-padding pb-8 pt-4">
        <div className="flex gap-3">
          {/* Voice Toggle Button */}
          {sttSupported && (
            <button
              onClick={toggleListening}
              className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${isListening
                ? "bg-primary text-primary-foreground animate-pulse"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
            >
              {isListening ? (
                <Mic className="w-6 h-6" />
              ) : (
                <MicOff className="w-6 h-6" />
              )}
            </button>
          )}

          {/* Read List Button */}
          {ttsSupported && (
            <button
              onClick={isSpeakingList ? stopReadingList : readRemainingItems}
              className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${isSpeakingList
                ? "bg-secondary text-secondary-foreground animate-pulse"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
            >
              {isSpeakingList ? (
                <VolumeX className="w-6 h-6" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </button>
          )}

          {/* Finish Button */}
          <Button
            onClick={handleFinishShopping}
            className="flex-1 h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-card-title flex items-center justify-center gap-2"
          >
            Finish Shopping
            <Check className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Listening Overlay */}
      {isListening && transcript && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-foreground/90 text-background px-6 py-4 rounded-2xl shadow-lg animate-scale-in z-50 max-w-[80%]">
          <p className="text-lg font-medium text-center">"{transcript}"</p>
        </div>
      )}
    </div>
  );
};

export default StoreMode;
