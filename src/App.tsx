import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React from "react";
import SplashScreen from "./components/layout/SplashScreen";
import BottomNav from "./components/layout/BottomNav";
import { ScanSessionProvider } from "./hooks/useScanSession";

import Onboarding from "./pages/auth/Onboarding";
import Home from "./pages/core/Home";
import AIScan from "./pages/recipes/AIScan";
import ReviewIngredients from "./pages/recipes/ReviewIngredients";
import HealthConstraints from "./pages/user/HealthConstraints";
import RecipeDetails from "./pages/recipes/RecipeDetails";
import CookingStep from "./pages/recipes/CookingStep";
import CookingComplete from "./pages/recipes/CookingComplete";
import RecipeSaved from "./pages/recipes/RecipeSaved";
import MyCollection from "./pages/recipes/MyCollection";
import CookedHistory from "./pages/recipes/CookedHistory";
import MyPantry from "./pages/pantry/MyPantry";
import ShoppingList from "./pages/shopping/ShoppingList";
import StoreMode from "./pages/shopping/StoreMode";
import InventoryUpdated from "./pages/pantry/InventoryUpdated";
import YourImpact from "./pages/community/YourImpact";
import CommunityPulse from "./pages/community/CommunityPulse";
import NotificationPreferences from "./pages/user/NotificationPreferences";
import ConnectionLost from "./pages/core/ConnectionLost";
import FirstRescue from "./pages/community/FirstRescue";
import EcoHeroLibrary from "./pages/community/EcoHeroLibrary";
import LevelUp from "./pages/community/LevelUp";
import Leaderboard from "./pages/community/Leaderboard";
import NotFound from "./pages/core/NotFound";
import Profile from "./pages/user/Profile";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Settings from "./pages/user/Settings";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  // Don't show bottom nav on scan or review pages to avoid overlapping buttons
  const showBottomNav = [
    "/home",
    "/my-pantry",
    "/my-collection",
    "/profile",
    "/cooked-history",
    "/shopping-list",
    "/leaderboard",
    "/eco-hero-library",
    "/your-impact",
    "/health-constraints"
  ].includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/home" element={<Home />} />
        <Route path="/scan" element={<AIScan />} />
        <Route path="/review-ingredients" element={<ReviewIngredients />} />
        <Route path="/health-constraints" element={<HealthConstraints />} />
        <Route path="/recipe-details" element={<RecipeDetails />} />
        <Route path="/cooking-step" element={<CookingStep />} />
        <Route path="/cooking-complete" element={<CookingComplete />} />
        <Route path="/recipe-saved" element={<RecipeSaved />} />
        <Route path="/my-collection" element={<MyCollection />} />
        <Route path="/cooked-history" element={<CookedHistory />} />
        <Route path="/my-pantry" element={<MyPantry />} />
        <Route path="/shopping-list" element={<ShoppingList />} />
        <Route path="/store-mode" element={<StoreMode />} />
        <Route path="/inventory-updated" element={<InventoryUpdated />} />
        <Route path="/your-impact" element={<YourImpact />} />
        <Route path="/community-pulse" element={<CommunityPulse />} />
        <Route path="/notification-preferences" element={<NotificationPreferences />} />
        <Route path="/connection-lost" element={<ConnectionLost />} />
        <Route path="/first-rescue" element={<FirstRescue />} />
        <Route path="/eco-hero-library" element={<EcoHeroLibrary />} />
        <Route path="/level-up" element={<LevelUp />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showBottomNav && <BottomNav />}
    </>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = React.useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ScanSessionProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AppContent />
          </BrowserRouter>
        </ScanSessionProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
