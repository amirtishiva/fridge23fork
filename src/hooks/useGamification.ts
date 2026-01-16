import { useState, useEffect } from 'react';
import { UserStats } from './useUser';

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string; // lucide icon name or emoji
    condition: (stats: UserStats) => boolean;
    unlocked: boolean;
    dateUnlocked?: string;
}

export interface LeaderboardUser {
    id: string;
    name: string;
    avatar: string;
    xp: number;
    rank: number;
    isCurrentUser: boolean;
}

const BADGE_DEFINITIONS = [
    {
        id: 'first_save',
        name: 'First Rescue',
        description: 'Rescued your first food item!',
        icon: '🌱',
        condition: (stats: UserStats) => stats.foodRescued > 0
    },
    {
        id: 'money_saver_1',
        name: 'Thrifty Chef',
        description: 'Saved over $50.',
        icon: '💰',
        condition: (stats: UserStats) => stats.moneySaved >= 50
    },
    {
        id: 'streak_master',
        name: 'Streak Master',
        description: 'Maintained a 7-day streak.',
        icon: '🔥',
        condition: (stats: UserStats) => stats.streak >= 7
    },
    {
        id: 'climate_hero',
        name: 'Climate Hero',
        description: 'Saved 10kg of CO2.',
        icon: '🌍',
        condition: (stats: UserStats) => stats.co2Saved >= 10
    }
];

const MOCK_LEADERBOARD: LeaderboardUser[] = [
    { id: 'u1', name: 'Alice M.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', xp: 3200, rank: 1, isCurrentUser: false },
    { id: 'u2', name: 'Bob D.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', xp: 2950, rank: 2, isCurrentUser: false },
    { id: 'u3', name: 'Charlie', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie', xp: 2800, rank: 3, isCurrentUser: false },
    // Current user will be inserted/updated here
    { id: 'u4', name: 'Diana', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana', xp: 1500, rank: 5, isCurrentUser: false },
    { id: 'u5', name: 'Evan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Evan', xp: 1200, rank: 6, isCurrentUser: false },
];

const STORAGE_KEY_BADGES = 'fridge23_badges';

export const useGamification = (userProfile?: { name: string; avatar: string; xp: number }, userStats?: UserStats) => {
    const [unlockedBadgeIds, setUnlockedBadgeIds] = useState<string[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY_BADGES);
        return stored ? JSON.parse(stored) : [];
    });

    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(MOCK_LEADERBOARD);

    // Check for auto-unlocking badges when stats change
    useEffect(() => {
        if (!userStats) return;

        const newUnlocked: string[] = [];
        BADGE_DEFINITIONS.forEach(def => {
            if (!unlockedBadgeIds.includes(def.id) && def.condition(userStats)) {
                newUnlocked.push(def.id);
            }
        });

        if (newUnlocked.length > 0) {
            const updated = [...unlockedBadgeIds, ...newUnlocked];
            setUnlockedBadgeIds(updated);
            localStorage.setItem(STORAGE_KEY_BADGES, JSON.stringify(updated));
            // Optionally trigger a toast here if we had access to the toast hook
        }
    }, [userStats, unlockedBadgeIds]);

    // Update leaderboard with current user
    useEffect(() => {
        if (!userProfile) return;

        setLeaderboard(prev => {
            // Create user entry
            const currentUserEntry: LeaderboardUser = {
                id: 'current-user',
                name: userProfile.name,
                avatar: userProfile.avatar,
                xp: userProfile.xp,
                rank: 0, // calc later
                isCurrentUser: true
            };

            // Merge and sort
            const allUsers = [...prev.filter(u => !u.isCurrentUser), currentUserEntry];
            allUsers.sort((a, b) => b.xp - a.xp);

            // Assign ranks
            return allUsers.map((u, index) => ({
                ...u,
                rank: index + 1
            }));
        });
    }, [userProfile?.xp, userProfile?.name, userProfile?.avatar]);

    const badges = BADGE_DEFINITIONS.map(def => ({
        ...def,
        unlocked: unlockedBadgeIds.includes(def.id)
    }));

    return {
        badges,
        leaderboard
    };
};
