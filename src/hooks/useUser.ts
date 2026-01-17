import { useState, useEffect, useCallback } from 'react';

// Types
export interface UserProfile {
    name: string;
    avatar: string; // URL or placeholder identifier
    level: number;
    xp: number;
    joinDate: string;
}

export interface UserStats {
    moneySaved: number;
    co2Saved: number; // in kg
    foodRescued: number; // in kg
    streak: number;
    lastActiveDate: string; // YYYY-MM-DD
}

export interface CookedRecipe {
    id: string;
    name: string;
    date: string; // ISO string
    xpEarned: number;
    image?: string;
}

export interface UserSettings {
    notifications: boolean;
    dietaryPreferences: string[];
}

export interface UserData {
    profile: UserProfile;
    stats: UserStats;
    history: CookedRecipe[];
    settings: UserSettings;
}

const DEFAULT_USER: UserData = {
    profile: {
        name: "Eco Chef",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", // Default avatar
        level: 5,
        xp: 2450,
        joinDate: new Date().toISOString(),
    },
    stats: {
        moneySaved: 124.50, // Starting simulated values so it's not empty
        co2Saved: 45.2,
        foodRescued: 12.5,
        streak: 3,
        lastActiveDate: new Date().toISOString().split('T')[0],
    },
    history: [
        // Some initial history
        { id: '1', name: 'Vegetable Stir Fry', date: new Date(Date.now() - 86400000).toISOString(), xpEarned: 150 },
        { id: '2', name: 'Avocado Toast', date: new Date(Date.now() - 172800000).toISOString(), xpEarned: 100 },
    ],
    settings: {
        notifications: true,
        dietaryPreferences: [],
    }
};

const STORAGE_KEY = 'fridge23_user_data';

export const useUser = () => {
    const [userData, setUserData] = useState<UserData>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : DEFAULT_USER;
    });

    // Persist to localStorage whenever userData changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    }, [userData]);

    const updateProfile = useCallback((updates: Partial<UserProfile>) => {
        setUserData(prev => ({
            ...prev,
            profile: { ...prev.profile, ...updates }
        }));
    }, []);

    const updateSettings = useCallback((updates: Partial<UserSettings>) => {
        setUserData(prev => ({
            ...prev,
            settings: { ...prev.settings, ...updates }
        }));
    }, []);

    // Use this when a user completes a recipe (e.g., from ReviewIngredients)
    const addImpact = useCallback((impact: { money: number; co2: number; foodWeight: number; recipeName?: string; recipeId?: string; image?: string }) => {
        setUserData(prev => {
            const today = new Date().toISOString().split('T')[0];
            const lastActive = prev.stats.lastActiveDate;

            let newStreak = prev.stats.streak;
            if (today !== lastActive) {
                // If last active was yesterday, increment streak
                // Simple check: difference in days. For robustness, using a library like date-fns is better, but doing simple string compare for now
                const diffTime = Math.abs(new Date(today).getTime() - new Date(lastActive).getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    newStreak += 1;
                } else if (diffDays > 1) {
                    newStreak = 1; // Reset streak if missed a day
                }
                // if diffDays === 0 (same day), do nothing to streak
            }

            // Calculate XP - arbitrary rule: 10 XP per dollar saved + 100 base
            const earnedXp = Math.floor(impact.money * 10) + 100;

            // Level up logic: Level = 1 + floor(XP / 1000)
            const newXp = prev.profile.xp + earnedXp;
            const newLevel = 1 + Math.floor(newXp / 1000);

            const newHistoryItem: CookedRecipe = {
                id: impact.recipeId || Math.random().toString(36).substr(2, 9),
                name: impact.recipeName || 'Unknown Recipe',
                date: new Date().toISOString(),
                xpEarned: earnedXp,
                image: impact.image
            };

            return {
                ...prev,
                profile: {
                    ...prev.profile,
                    xp: newXp,
                    level: newLevel,
                },
                stats: {
                    moneySaved: prev.stats.moneySaved + impact.money,
                    co2Saved: prev.stats.co2Saved + impact.co2,
                    foodRescued: prev.stats.foodRescued + impact.foodWeight,
                    streak: newStreak,
                    lastActiveDate: today,
                },
                history: [newHistoryItem, ...prev.history]
            };
        });
    }, []);

    return {
        user: userData,
        updateProfile,
        updateSettings,
        addImpact,
        resetUser: () => setUserData(DEFAULT_USER) // Helper for dev/testing
    };
};
