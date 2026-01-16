import { useState, useEffect, useCallback, useMemo } from "react";

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  source: string;
  checked: boolean;
  category: "outOfStock" | "recipes";
  aisle?: string;
  price?: number; // Estimated price in dollars
}

// Estimated prices for common grocery items
const priceEstimates: Record<string, number> = {
  // Produce
  "spinach": 3.49,
  "tomatoes": 2.99,
  "avocados": 1.50,
  "bananas": 0.59,
  "fresh basil": 2.99,
  "lettuce": 2.49,
  "onions": 1.29,
  "garlic": 0.79,
  "lemons": 0.50,
  "apples": 1.99,
  
  // Dairy & Eggs
  "milk": 4.29,
  "eggs": 4.99,
  "butter": 5.49,
  "cheese": 4.99,
  "cheddar": 4.99,
  "mozzarella": 5.99,
  "ricotta cheese": 4.49,
  "yogurt": 5.99,
  "cream": 3.99,
  
  // Meat & Seafood
  "ground beef": 7.99,
  "chicken": 8.99,
  "salmon": 12.99,
  "bacon": 6.99,
  "sausage": 5.99,
  
  // Pantry & Grains
  "rice": 3.99,
  "pasta": 1.99,
  "bread": 3.49,
  "flour": 4.99,
  "olive oil": 8.99,
  "sugar": 3.49,
  
  // Frozen
  "ice cream": 5.99,
  "frozen vegetables": 2.99,
  "frozen pizza": 6.99,
  
  // Beverages
  "juice": 4.49,
  "soda": 2.49,
  "water": 5.99,
  "coffee": 9.99,
  "tea": 4.99,
};

const getEstimatedPrice = (itemName: string): number => {
  const lowerName = itemName.toLowerCase();
  for (const [keyword, price] of Object.entries(priceEstimates)) {
    if (lowerName.includes(keyword)) {
      return price;
    }
  }
  return 3.99; // Default estimated price
};

// Aisle mapping for common grocery items
const aisleMapping: Record<string, string> = {
  // Produce
  "spinach": "Produce",
  "tomatoes": "Produce",
  "avocados": "Produce",
  "bananas": "Produce",
  "fresh basil": "Produce",
  "lettuce": "Produce",
  "onions": "Produce",
  "garlic": "Produce",
  "lemons": "Produce",
  "apples": "Produce",
  
  // Dairy & Eggs
  "milk": "Dairy & Eggs",
  "eggs": "Dairy & Eggs",
  "butter": "Dairy & Eggs",
  "cheese": "Dairy & Eggs",
  "cheddar": "Dairy & Eggs",
  "mozzarella": "Dairy & Eggs",
  "ricotta cheese": "Dairy & Eggs",
  "yogurt": "Dairy & Eggs",
  "cream": "Dairy & Eggs",
  
  // Meat & Seafood
  "ground beef": "Meat & Seafood",
  "chicken": "Meat & Seafood",
  "salmon": "Meat & Seafood",
  "bacon": "Meat & Seafood",
  "sausage": "Meat & Seafood",
  
  // Pantry & Grains
  "rice": "Pantry & Grains",
  "pasta": "Pantry & Grains",
  "bread": "Pantry & Grains",
  "flour": "Pantry & Grains",
  "olive oil": "Pantry & Grains",
  "sugar": "Pantry & Grains",
  
  // Frozen
  "ice cream": "Frozen",
  "frozen vegetables": "Frozen",
  "frozen pizza": "Frozen",
  
  // Beverages
  "juice": "Beverages",
  "soda": "Beverages",
  "water": "Beverages",
  "coffee": "Beverages",
  "tea": "Beverages",
};

// Aisle order for store navigation
const aisleOrder = [
  "Produce",
  "Dairy & Eggs", 
  "Meat & Seafood",
  "Pantry & Grains",
  "Frozen",
  "Beverages",
  "Other",
];

const getAisleForItem = (itemName: string): string => {
  const lowerName = itemName.toLowerCase();
  for (const [keyword, aisle] of Object.entries(aisleMapping)) {
    if (lowerName.includes(keyword)) {
      return aisle;
    }
  }
  return "Other";
};

const STORAGE_KEY = "fridgeai-shopping-list";

const defaultItems: ShoppingItem[] = [
  { id: "1", name: "Milk", quantity: "1 Gallon", source: "Pantry", checked: false, category: "outOfStock", aisle: "Dairy & Eggs", price: 4.29 },
  { id: "2", name: "Eggs", quantity: "1 Dozen", source: "Pantry", checked: false, category: "outOfStock", aisle: "Dairy & Eggs", price: 4.99 },
  { id: "3", name: "Butter", quantity: "2 Sticks", source: "Pantry", checked: false, category: "outOfStock", aisle: "Dairy & Eggs", price: 5.49 },
  { id: "4", name: "Ricotta Cheese", quantity: "16oz", source: "Lasagna", checked: false, category: "recipes", aisle: "Dairy & Eggs", price: 4.49 },
  { id: "5", name: "Ground Beef", quantity: "1 lb", source: "Lasagna", checked: false, category: "recipes", aisle: "Meat & Seafood", price: 7.99 },
  { id: "6", name: "Fresh Basil", quantity: "1 Bunch", source: "Caprese", checked: false, category: "recipes", aisle: "Produce", price: 2.99 },
  { id: "7", name: "Mozzarella", quantity: "2 Balls", source: "Caprese", checked: false, category: "recipes", aisle: "Dairy & Eggs", price: 5.99 },
];

export const useShoppingList = () => {
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Add aisle info if missing
        return parsed.map((item: ShoppingItem) => ({
          ...item,
          aisle: item.aisle || getAisleForItem(item.name),
        }));
      }
      return defaultItems;
    } catch {
      return defaultItems;
    }
  });

  // Persist to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: Omit<ShoppingItem, "id" | "checked" | "aisle" | "price">) => {
    setItems((prev) => {
      // Check if item already exists
      const exists = prev.some(
        (i) => i.name.toLowerCase() === item.name.toLowerCase() && i.source === item.source
      );
      if (exists) return prev;

      const newItem: ShoppingItem = {
        ...item,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        checked: false,
        aisle: getAisleForItem(item.name),
        price: getEstimatedPrice(item.name),
      };
      return [...prev, newItem];
    });
  }, []);

  const updateItemPrice = useCallback((id: string, price: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, price } : item
      )
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleItem = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  }, []);

  const clearChecked = useCallback(() => {
    setItems((prev) => prev.filter((item) => !item.checked));
  }, []);

  const isInList = useCallback(
    (name: string) => {
      return items.some((i) => i.name.toLowerCase() === name.toLowerCase());
    },
    [items]
  );

  // Group items by aisle for smart sort
  const itemsByAisle = useMemo(() => {
    const grouped: Record<string, ShoppingItem[]> = {};
    
    items.forEach((item) => {
      const aisle = item.aisle || "Other";
      if (!grouped[aisle]) {
        grouped[aisle] = [];
      }
      grouped[aisle].push(item);
    });
    
    // Sort aisles by store navigation order
    const sortedGrouped: Record<string, ShoppingItem[]> = {};
    aisleOrder.forEach((aisle) => {
      if (grouped[aisle] && grouped[aisle].length > 0) {
        sortedGrouped[aisle] = grouped[aisle];
      }
    });
    
    return sortedGrouped;
  }, [items]);

  const outOfStockItems = items.filter((i) => i.category === "outOfStock");
  const recipeItems = items.filter((i) => i.category === "recipes");
  const totalCount = items.length;
  const checkedCount = items.filter((i) => i.checked).length;

  // Price calculations
  const estimatedTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price || 0), 0);
  }, [items]);

  const checkedTotal = useMemo(() => {
    return items.filter(i => i.checked).reduce((sum, item) => sum + (item.price || 0), 0);
  }, [items]);

  const remainingTotal = useMemo(() => {
    return items.filter(i => !i.checked).reduce((sum, item) => sum + (item.price || 0), 0);
  }, [items]);

  return {
    items,
    outOfStockItems,
    recipeItems,
    itemsByAisle,
    totalCount,
    checkedCount,
    estimatedTotal,
    checkedTotal,
    remainingTotal,
    addItem,
    removeItem,
    toggleItem,
    updateItemPrice,
    clearChecked,
    isInList,
  };
};
