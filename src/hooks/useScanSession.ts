import { useState, useCallback } from "react";
import spinachImg from "@/assets/ingredient-spinach.png";
import milkImg from "@/assets/ingredient-milk.png";
import chickenImg from "@/assets/ingredient-chicken.png";
import tomatoesImg from "@/assets/ingredient-tomatoes.png";
import cheeseImg from "@/assets/ingredient-cheese.png";

export interface ScanItem {
    id: string;
    name: string;
    quantity: string;
    image: string;
    freshness: "use-soon" | "fresh" | "frozen" | "unknown";
    confidence: "high" | "check";
    status: "green" | "yellow" | "red";
}

const initialScanItems: ScanItem[] = [
    {
        id: "1",
        name: "Spinach",
        quantity: "200g",
        image: spinachImg,
        freshness: "use-soon",
        confidence: "high",
        status: "green",
    },
    {
        id: "2",
        name: "Whole Milk",
        quantity: "1L",
        image: milkImg,
        freshness: "fresh",
        confidence: "high",
        status: "green",
    },
    {
        id: "3",
        name: "Chicken Breast",
        quantity: "500g",
        image: chickenImg,
        freshness: "frozen",
        confidence: "check",
        status: "yellow",
    },
    {
        id: "4",
        name: "Tomatoes",
        quantity: "6 pcs",
        image: tomatoesImg,
        freshness: "fresh",
        confidence: "high",
        status: "green",
    },
    {
        id: "5",
        name: "Cheddar Block",
        quantity: "250g",
        image: cheeseImg,
        freshness: "unknown",
        confidence: "check",
        status: "red",
    },
];

export const useScanSession = () => {
    const [items, setItems] = useState<ScanItem[]>(initialScanItems);

    const addItem = useCallback((item: Omit<ScanItem, "id">) => {
        const newItem = { ...item, id: crypto.randomUUID() };
        setItems((prev) => [...prev, newItem]);
    }, []);

    const updateItem = useCallback((id: string, updates: Partial<ScanItem>) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
        );
    }, []);

    const removeItem = useCallback((id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const resetSession = useCallback(() => {
        setItems(initialScanItems);
    }, []);

    return {
        items,
        addItem,
        updateItem,
        removeItem,
        resetSession,
    };
};
