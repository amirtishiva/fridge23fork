import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, ReactNode } from "react";
import spinachImg from "@/assets/ingredient-spinach.png";
import milkImg from "@/assets/ingredient-milk.png";
import chickenImg from "@/assets/ingredient-chicken.png";
import tomatoesImg from "@/assets/ingredient-tomatoes.png";
import cheeseImg from "@/assets/ingredient-cheese.png";

// ============================================================================
// ENHANCED SCAN SESSION HOOK WITH CONTEXT
// Supports Indian household container detection, labeling, and classification
// Uses Context + sessionStorage for persistence across navigation
// ============================================================================

// Detection types for AI classification
export type DetectionType = 'identified' | 'low_confidence' | 'container' | 'unknown';

// Container types common in Indian households
export type ContainerType =
    | 'steel_dabba'
    | 'tupperware'
    | 'wrapped'
    | 'bottle'
    | 'jar'
    | 'polythene'
    | 'foil'
    | 'tiffin'
    | 'none';

// Content type for sealed containers
export type ContentType = 'liquid' | 'solid' | 'semi-solid' | 'unknown';

// Freshness levels
export type FreshnessLevel = 'fresh' | 'use-soon' | 'expired' | 'frozen' | 'unknown';

// Enhanced ScanItem interface for Indian household scanning
export interface ScanItem {
    id: string;
    name: string;                          // AI-detected or user-labeled name
    quantity: string;
    image: string;                         // Image path or cropped region

    // Detection metadata
    detection_type: DetectionType;
    confidence: number;                    // 0-100 percentage
    container_type: ContainerType;
    content_type: ContentType;             // For sealed containers

    // User labeling
    is_user_labeled: boolean;
    ai_suggestions: string[];              // Suggestions for unknown containers
    user_label?: string;                   // User's selected/typed label

    // Hotspot for UI rendering
    hotspot_position: { top: string; left: string };

    // Freshness assessment
    freshness: FreshnessLevel;
    status: 'green' | 'yellow' | 'red';    // Visual status indicator
}

// Session state interface
export interface ScanSessionState {
    isActive: boolean;
    startedAt: string | null;
    imageUrl: string | null;
    items: ScanItem[];
}

// AI suggestions based on container type
export const getAISuggestions = (containerType: ContainerType, contentType: ContentType): string[] => {
    switch (containerType) {
        case 'steel_dabba':
        case 'tiffin':
            return ['Dal', 'Dough', 'Curd', 'Leftovers', 'Rice', 'Sabzi'];
        case 'tupperware':
            return ['Curry', 'Curd', 'Salad', 'Leftovers', 'Fruits'];
        case 'jar':
            return contentType === 'liquid'
                ? ['Pickle', 'Chutney', 'Oil', 'Ghee']
                : ['Masala', 'Spices', 'Dry Fruits', 'Sugar'];
        case 'bottle':
            return ['Milk', 'Buttermilk', 'Water', 'Juice', 'Oil'];
        case 'wrapped':
        case 'polythene':
            return ['Vegetables', 'Fruits', 'Paneer', 'Bread', 'Cheese'];
        case 'foil':
            return ['Roti', 'Paratha', 'Cooked Food', 'Snacks'];
        default:
            return ['Unknown Item'];
    }
};

// Common Staples for quick selection (used in bottom sheet)
export const COMMON_STAPLES = [
    { id: 'gg_paste', label: 'G-G Paste', icon: '🧄' },
    { id: 'chutney', label: 'Chutney', icon: '🫚' },
    { id: 'leftovers', label: 'Leftovers', icon: '🍲' },
    { id: 'masala', label: 'Masala', icon: '🌶️' },
    { id: 'milk', label: 'Milk', icon: '🥛' },
    { id: 'pickle', label: 'Pickle', icon: '🫙' },
    { id: 'dal', label: 'Dal', icon: '🍛' },
    { id: 'curd', label: 'Curd', icon: '🥣' },
    { id: 'dough', label: 'Dough', icon: '🫓' },
];

// Storage key for sessionStorage
const STORAGE_KEY = 'fridgeai-scan-session';

// Load session from sessionStorage
const loadSession = (): ScanSessionState => {
    try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Failed to load scan session:', e);
    }
    return {
        isActive: false,
        startedAt: null,
        imageUrl: null,
        items: [],
    };
};

// Save session to sessionStorage
const saveSession = (session: ScanSessionState) => {
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
        console.warn('Failed to save scan session:', e);
    }
};

// Create mock detected items for demo
const createMockDetectedItems = (capturedImageUrl?: string | null): Omit<ScanItem, 'id'>[] => [
    {
        name: "Spinach",
        quantity: "200g",
        image: capturedImageUrl || spinachImg,
        detection_type: 'identified',
        confidence: 98,
        container_type: 'none',
        content_type: 'solid',
        is_user_labeled: false,
        ai_suggestions: [],
        freshness: 'use-soon',
        status: 'green',
        hotspot_position: { top: '28%', left: '15%' },
    },
    {
        name: "Whole Milk",
        quantity: "1L",
        image: capturedImageUrl || milkImg,
        detection_type: 'identified',
        confidence: 92,
        container_type: 'bottle',
        content_type: 'liquid',
        is_user_labeled: false,
        ai_suggestions: [],
        freshness: 'fresh',
        status: 'green',
        hotspot_position: { top: '38%', left: '65%' },
    },
    {
        name: "",  // Unknown - requires labeling
        quantity: "~500g",
        image: capturedImageUrl || chickenImg,
        detection_type: 'container',
        confidence: 94,
        container_type: 'steel_dabba',
        content_type: 'unknown',
        is_user_labeled: false,
        ai_suggestions: ['Dal', 'Dough', 'Curd'],
        freshness: 'unknown',
        status: 'yellow',
        hotspot_position: { top: '48%', left: '40%' },
    },
    {
        name: "",  // Wrapped item - low confidence
        quantity: "~300g",
        image: capturedImageUrl || tomatoesImg,
        detection_type: 'low_confidence',
        confidence: 65,
        container_type: 'wrapped',
        content_type: 'solid',
        is_user_labeled: false,
        ai_suggestions: ['Vegetables', 'Fruits', 'Paneer'],
        freshness: 'unknown',
        status: 'yellow',
        hotspot_position: { top: '58%', left: '25%' },
    },
    {
        name: "Cheese Block",
        quantity: "250g",
        image: capturedImageUrl || cheeseImg,
        detection_type: 'identified',
        confidence: 88,
        container_type: 'none',
        content_type: 'solid',
        is_user_labeled: false,
        ai_suggestions: [],
        freshness: 'fresh',
        status: 'green',
        hotspot_position: { top: '68%', left: '55%' },
    },
];

// Context type
interface ScanSessionContextType {
    // State
    items: ScanItem[];
    session: ScanSessionState;

    // Derived state
    unknownItems: ScanItem[];
    identifiedItems: ScanItem[];
    unlabeledCount: number;

    // Actions
    startSession: (imageUrl?: string) => void;
    endSession: () => void;
    simulateDetection: (capturedImage?: string | null) => Omit<ScanItem, 'id'>[];
    addItem: (item: Omit<ScanItem, 'id'>) => ScanItem;
    addItems: (items: Omit<ScanItem, 'id'>[]) => void;
    updateItem: (id: string, updates: Partial<ScanItem>) => void;
    labelItem: (id: string, label: string) => void;
    removeItem: (id: string) => void;
    resetSession: () => void;
    setCapturedImage: (imageUrl: string) => void;

    // Utilities
    getDisplayName: (item: ScanItem) => string;
}

// Create context
const ScanSessionContext = createContext<ScanSessionContextType | null>(null);

// Provider component
export const ScanSessionProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<ScanSessionState>(loadSession);

    // Persist to sessionStorage on every change
    useEffect(() => {
        saveSession(session);
    }, [session]);

    // Start a new scan session
    const startSession = useCallback((imageUrl?: string) => {
        setSession({
            isActive: true,
            startedAt: new Date().toISOString(),
            imageUrl: imageUrl || null,
            items: [],
        });
    }, []);

    // Set captured image
    const setCapturedImage = useCallback((imageUrl: string) => {
        setSession(prev => ({
            ...prev,
            imageUrl,
        }));
    }, []);

    // End the current scan session
    const endSession = useCallback(() => {
        setSession(prev => ({
            ...prev,
            isActive: false,
        }));
    }, []);

    // Simulate AI detection
    const simulateDetection = useCallback((capturedImage?: string | null) => {
        return createMockDetectedItems(capturedImage || session.imageUrl);
    }, [session.imageUrl]);

    // Add a single detected item
    const addItem = useCallback((item: Omit<ScanItem, 'id'>) => {
        const newItem: ScanItem = { ...item, id: crypto.randomUUID() };
        setSession(prev => ({
            ...prev,
            items: [...prev.items, newItem],
        }));
        return newItem;
    }, []);

    // Add multiple detected items
    const addItems = useCallback((newItems: Omit<ScanItem, 'id'>[]) => {
        const itemsWithIds = newItems.map(item => ({
            ...item,
            id: crypto.randomUUID(),
        }));
        setSession(prev => ({
            ...prev,
            items: [...prev.items, ...itemsWithIds],
        }));
    }, []);

    // Update an existing item
    const updateItem = useCallback((id: string, updates: Partial<ScanItem>) => {
        setSession(prev => ({
            ...prev,
            items: prev.items.map(item =>
                item.id === id ? { ...item, ...updates } : item
            ),
        }));
    }, []);

    // Label a container
    const labelItem = useCallback((id: string, label: string) => {
        setSession(prev => ({
            ...prev,
            items: prev.items.map(item =>
                item.id === id
                    ? {
                        ...item,
                        name: label,
                        user_label: label,
                        is_user_labeled: true,
                        detection_type: 'identified' as DetectionType,
                    }
                    : item
            ),
        }));
    }, []);

    // Remove an item
    const removeItem = useCallback((id: string) => {
        setSession(prev => ({
            ...prev,
            items: prev.items.filter(item => item.id !== id),
        }));
    }, []);

    // Reset session completely
    const resetSession = useCallback(() => {
        const newSession = {
            isActive: false,
            startedAt: null,
            imageUrl: null,
            items: [],
        };
        setSession(newSession);
        sessionStorage.removeItem(STORAGE_KEY);
    }, []);

    // Derived state
    const unknownItems = useMemo(() =>
        session.items.filter(item =>
            item.detection_type === 'container' ||
            item.detection_type === 'unknown' ||
            (item.detection_type === 'low_confidence' && !item.is_user_labeled)
        ),
        [session.items]
    );

    const identifiedItems = useMemo(() =>
        session.items.filter(item =>
            item.detection_type === 'identified' || item.is_user_labeled
        ),
        [session.items]
    );

    const unlabeledCount = useMemo(() =>
        session.items.filter(item => !item.name && !item.is_user_labeled).length,
        [session.items]
    );

    // Get display name for an item
    const getDisplayName = useCallback((item: ScanItem): string => {
        if (item.name) return item.name;
        if (item.user_label) return item.user_label;
        if (item.detection_type === 'container') {
            return `Unknown ${item.container_type.replace('_', ' ')}`;
        }
        if (item.container_type === 'wrapped') {
            return 'Wrapped Item';
        }
        return 'Unknown';
    }, []);

    const value: ScanSessionContextType = {
        items: session.items,
        session,
        unknownItems,
        identifiedItems,
        unlabeledCount,
        startSession,
        endSession,
        simulateDetection,
        addItem,
        addItems,
        updateItem,
        labelItem,
        removeItem,
        resetSession,
        setCapturedImage,
        getDisplayName,
    };

    return (
        <ScanSessionContext.Provider value={value}>
            {children}
        </ScanSessionContext.Provider>
    );
};

// Custom hook to use the context
export const useScanSession = () => {
    const context = useContext(ScanSessionContext);
    if (!context) {
        throw new Error('useScanSession must be used within a ScanSessionProvider');
    }
    return context;
};

// Re-export types
export type { ScanSessionContextType };
