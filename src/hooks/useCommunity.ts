import { useState, useEffect, useCallback } from 'react';

export interface CommunityTip {
    id: string;
    text: string;
    author: string;
    upvotes: number;
    timestamp: string;
}

const INITIAL_TIPS: CommunityTip[] = [
    { id: '1', text: "Save veggie scraps for a delicious homemade broth!", author: "Sarah J.", upvotes: 24, timestamp: "2h ago" },
    { id: '2', text: "Store herbs in a glass of water to keep them fresh longer.", author: "Mike R.", upvotes: 42, timestamp: "5h ago" },
    { id: '3', text: "Don't toss those beet greens! Sauté them with garlic.", author: "Emma W.", upvotes: 18, timestamp: "1d ago" },
];

const STORAGE_KEY_TIPS = 'fridge23_community_tips';
const STORAGE_KEY_UPVOTES = 'fridge23_user_upvotes';

export const useCommunity = (userName: string = "Anonymous") => {
    const [tips, setTips] = useState<CommunityTip[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY_TIPS);
        return stored ? JSON.parse(stored) : INITIAL_TIPS;
    });

    const [upvotedIds, setUpvotedIds] = useState<string[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY_UPVOTES);
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_TIPS, JSON.stringify(tips));
    }, [tips]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_UPVOTES, JSON.stringify(upvotedIds));
    }, [upvotedIds]);

    const addTip = useCallback((text: string) => {
        const newTip: CommunityTip = {
            id: Math.random().toString(36).substr(2, 9),
            text,
            author: userName,
            upvotes: 0,
            timestamp: 'Just now'
        };
        setTips(prev => [newTip, ...prev]);
    }, [userName]);

    const toggleUpvote = useCallback((tipId: string) => {
        setUpvotedIds(prev => {
            const isUpvoted = prev.includes(tipId);
            let newIds;
            if (isUpvoted) {
                newIds = prev.filter(id => id !== tipId);
            } else {
                newIds = [...prev, tipId];
            }

            // Update tip upvote count optimistically
            setTips(currentTips =>
                currentTips.map(tip => {
                    if (tip.id === tipId) {
                        return {
                            ...tip,
                            upvotes: tip.upvotes + (isUpvoted ? -1 : 1)
                        };
                    }
                    return tip;
                })
            );

            return newIds;
        });
    }, []);

    return {
        tips: tips.map(tip => ({
            ...tip,
            isUpvoted: upvotedIds.includes(tip.id)
        })),
        addTip,
        toggleUpvote
    };
};
