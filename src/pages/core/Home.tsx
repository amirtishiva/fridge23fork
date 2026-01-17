import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Flame, Leaf, TrendingUp, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCardSkeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/useUser";


const Home = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="screen-padding pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-page-title text-foreground">Good morning! 👋</h1>
            <p className="text-body text-muted-foreground mt-1">
              What's cooking today?
            </p>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
          >
            <User className="w-6 h-6 text-primary" />
          </button>
        </div>
      </div>

      {/* Scan Card */}
      <div className="screen-padding mb-6">
        <div className="bg-card rounded-lg shadow-card p-6 transition-all duration-200 hover:shadow-floating hover:-translate-y-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-section-title text-foreground mb-2">
                Scan Your Fridge
              </h2>
              <p className="text-body text-muted-foreground">
                Take a photo and let AI find the perfect recipe for you
              </p>
            </div>
            <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
              <Camera className="w-7 h-7 text-primary" />
            </div>
          </div>
          <Button
            onClick={() => navigate('/scan')}
            className="w-full h-12 rounded-button text-card-title"
          >
            Start Scanning
          </Button>
        </div>
      </div>

      {/* Streak Section */}
      <div className="screen-padding mb-6">
        {isLoading ? (
          <div className="bg-card rounded-lg shadow-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="shimmer h-5 w-24 rounded" />
              <div className="shimmer h-5 w-16 rounded" />
            </div>
            <div className="flex gap-2">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="flex-1 h-10 shimmer rounded-lg" />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-lg shadow-card p-4 transition-all duration-200 hover:shadow-floating hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-card-title text-foreground">Your Streak</h3>
              <div className="flex items-center gap-1 text-secondary">
                <Flame className="w-5 h-5" />
                <span className="text-card-title">{user.stats.streak} Days</span>
              </div>
            </div>
            <div className="flex gap-2">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                <div
                  key={index}
                  className={`flex-1 h-10 rounded-lg flex items-center justify-center text-caption ${index < user.stats.streak
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                    }`}
                >
                  <Flame className={`w-4 h-4 ${index < user.stats.streak ? 'text-secondary' : 'text-muted-foreground'}`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="screen-padding">
        <div className="grid grid-cols-2 gap-4">
          {isLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/your-impact')}
                className="bg-card rounded-lg shadow-card p-4 text-left transition-all duration-200 hover:shadow-floating hover:-translate-y-1"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="w-5 h-5 text-primary" />
                  <span className="text-caption text-muted-foreground">Food Saved</span>
                </div>
                <p className="text-section-title text-foreground">{user.stats.foodRescued.toFixed(1)} kg</p>
                <p className="text-caption text-primary">Total saved</p>
              </button>
              <button
                onClick={() => navigate('/eco-hero-library')}
                className="bg-card rounded-lg shadow-card p-4 text-left transition-all duration-200 hover:shadow-floating hover:-translate-y-1"
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-caption text-muted-foreground">Money Saved</span>
                </div>
                <p className="text-section-title text-foreground">${user.stats.moneySaved.toFixed(0)}</p>
                <p className="text-caption text-primary">Total saved</p>
              </button>
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default Home;
