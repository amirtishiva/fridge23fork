import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

export interface PantryItem {
    id: string;
    name: string;
    quantity: string;
    expiry: string;
    status: "full" | "low" | "empty";
    image: string;
    category: string;
}

const STORAGE_KEY = "fridgeai-pantry";

// Initial data for demo purposes (if empty)
const initialPantryItems: PantryItem[] = [
    {
        id: "1",
        name: "Basmati Rice",
        quantity: "2kg bag",
        expiry: "Dec 2025",
        status: "full",
        image: "🍚",
        category: "Grains & Pasta",
    },
    {
        id: "2",
        name: "Whole Wheat Pasta",
        quantity: "500g box",
        expiry: "Feb 2024",
        status: "low",
        image: "🍝",
        category: "Grains & Pasta",
    },
    {
        id: "3",
        name: "Cumin Seeds",
        quantity: "100g jar",
        expiry: "Oct 2026",
        status: "full",
        image: "🌿",
        category: "Spices",
    },
    {
        id: "4",
        name: "Smoked Paprika",
        quantity: "Refill needed",
        expiry: "",
        status: "empty",
        image: "🌶️",
        category: "Spices",
    },
];

export const usePantry = () => {
    const [items, setItems] = useState<PantryItem[]>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : initialPantryItems;
        } catch {
            return initialPantryItems;
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addItems = useCallback((newItems: Omit<PantryItem, "id">[]) => {
        setItems((prev) => {
            const itemsToAdd = newItems.map((item) => ({
                ...item,
                id: crypto.randomUUID(),
            }));
            return [...prev, ...itemsToAdd];
        });

        // Toast removed as per user request to avoid popup
        // if (newItems.length > 0) {
        //     toast({
        //         title: "Items Added",
        //         description: `Added ${newItems.length} items to your pantry.`,
        //     });
        // }
    }, []);

    const updateItem = useCallback((id: string, updates: Partial<PantryItem>) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
        );
    }, []);

    const removeItem = useCallback((id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
        toast({
            title: "Item Removed",
            description: "Item removed from pantry.",
        });
    }, []);

    return {
        items,
        addItems,
        updateItem,
        removeItem,
    };
};
