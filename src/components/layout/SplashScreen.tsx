import React, { useEffect, useState } from "react";
import { Leaf, Sparkles } from "lucide-react";

/**
 * SplashScreen Component
 * 
 * Replicates the provided design 1:1.
 * - Custom SVG Fridge Logo with Leaf
 * - "FridgeAI" branding
 * - Loading bar animation
 * - "Powered by Organic Intelligence" badge
 */
const SplashScreen = ({ onComplete }: { onComplete?: () => void }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const duration = 2500; // 2.5 seconds total load time
        const intervalTime = 25;
        const steps = duration / intervalTime;
        const increment = 100 / steps;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(() => {
                        onComplete?.();
                    }, 300); // Slight delay after 100% before unmounting
                    return 100;
                }
                return prev + increment;
            });
        }, intervalTime);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-background px-4 pb-12 pt-0 font-inter text-foreground animate-in fade-in duration-300">

            {/* Background Circles (Subtle decorations based on the image's top left curves) */}
            <div className="absolute left-0 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-100 opacity-60" />
            <div className="absolute left-0 top-0 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-100 opacity-40" />

            {/* Main Content Centered Vertically */}
            <div className="flex flex-1 flex-col items-center justify-center">

                {/* Logo Container */}
                <div className="relative mb-8">
                    {/* Custom Fridge Icon + Leaf SVG */}
                    <svg
                        width="100"
                        height="150"
                        viewBox="0 0 100 150"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-foreground"
                    >
                        {/* Fridge Definition */}
                        <path
                            d="M15 15 H85 A12 12 0 0 1 97 27 V123 A12 12 0 0 1 85 135 H15 A12 12 0 0 1 3 123 V27 A12 12 0 0 1 15 15 Z"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                            fill="none"
                        />

                        {/* Freezer Line */}
                        <line
                            x1="12"
                            y1="55"
                            x2="88"
                            y2="55"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                        />

                        {/* Handle */}
                        <line
                            x1="82"
                            y1="65"
                            x2="82"
                            y2="95"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                        />

                        {/* Custom Leaf Overlay - Anchored top right */}
                        {/* Using a path that visually matches the teardrop shape in the image */}
                        <path
                            d="M85 15 C85 15 105 5 105 25 C105 45 65 55 65 30 C65 15 85 15 85 15 Z"
                            fill="currentColor"
                            className="text-primary"
                            transform="rotate(-10 85 15)"
                        />
                        {/* Leaf inner detail line */}
                        <path
                            d="M70 30 C80 35 95 25 100 10"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            className="text-white opacity-40"
                            transform="rotate(-10 85 15)"
                        />
                    </svg>
                </div>

                {/* Brand Name */}
                <h1 className="text-5xl font-bold tracking-tight text-foreground mb-3">
                    FridgeAI
                </h1>

                {/* Tagline */}
                <p className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
                    EAT FRESH • COOK SMART
                </p>

            </div>

            {/* Footer Content */}
            <div className="flex w-full flex-col items-center space-y-6">

                {/* Loading Section */}
                <div className="w-full max-w-xs space-y-3">
                    <p className="text-center text-sm text-gray-500 font-medium">
                        Finding fresh inspiration...
                    </p>

                    {/* Progress Bar */}
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                            className="h-full bg-primary transition-all duration-100 ease-out rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Powered By Badge */}
                <div className="flex items-center gap-2 rounded-full bg-green-50 px-6 py-2 border border-green-100">
                    <Sparkles className="h-4 w-4 text-primary fill-primary" />
                    <span className="text-[10px] font-bold tracking-wider text-green-600 uppercase">
                        Powered by Organic Intelligence
                    </span>
                </div>

            </div>
        </div>
    );
};

export default SplashScreen;
