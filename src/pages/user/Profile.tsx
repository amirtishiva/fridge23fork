import { useRef } from "react";
import { Settings, Pencil, Leaf, PiggyBank, UtensilsCrossed, User, Bell, CheckCircle, Zap, Sparkles, Trophy, Users, Award, ChevronRight, Refrigerator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/useUser";


const Profile = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      updateProfile({ avatar: imageUrl });
    }
  };

  const getBadgeStyle = (xp: number) => {
    if (xp > 150) return "bg-amber-100 text-amber-700 border-0";
    if (xp > 120) return "bg-primary/10 text-primary border-0";
    return "bg-blue-100 text-blue-700 border-0";
  };

  const getBadgeIcon = (xp: number) => {
    if (xp > 150) return <Zap className="w-3 h-3 mr-1" />;
    if (xp > 120) return <Sparkles className="w-3 h-3 mr-1" />;
    return <CheckCircle className="w-3 h-3 mr-1" />;
  };

  const getBadgeText = (xp: number) => {
    if (xp > 150) return "Zero Waste Hero";
    if (xp > 120) return "Rescued Items";
    return "Tasty Meal";
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-semibold text-foreground">My Profile</h1>
        <button
          onClick={() => navigate('/settings')}
          className="p-2 rounded-full hover:bg-muted transition-colors"
        >
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Profile Avatar & Info */}
      <div className="flex flex-col items-center py-6">
        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border-4 border-primary/30 transition-transform group-hover:scale-105">
            {user.profile.avatar.startsWith('http') || user.profile.avatar.startsWith('blob') ? (
              <img src={user.profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-primary" />
            )}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md group-hover:bg-primary/90 transition-colors">
            <Pencil className="w-4 h-4 text-primary-foreground" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
        <h2 className="text-xl font-bold text-foreground mt-4">{user.profile.name}</h2>
        <div className="flex items-center gap-1 mt-1">
          <Leaf className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Eco-Chef Level {user.profile.level}</span>
        </div>
      </div>

      {/* Impact Card */}
      <div className="px-4 mb-6">
        <Card className="p-6 bg-card rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Total Impact</h3>

          {/* Circular Progress */}
          <div className="flex justify-center mb-6">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(user.stats.foodRescued / (user.stats.foodRescued + 50)) * 264} 264`} // Simulated progress
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-foreground">{user.stats.foodRescued.toFixed(0)}</span>
                <span className="text-xs text-primary font-medium tracking-wide">LBS FOOD</span>
                <span className="text-xs text-primary font-medium tracking-wide">SAVED</span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex gap-4">
            <div className="flex-1 bg-muted/50 rounded-xl p-4 text-center">
              <div className="text-primary mb-1">
                <span className="text-lg">CO₂</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{user.stats.co2Saved.toFixed(1)}kg</div>
              <div className="text-sm text-muted-foreground">Prevented</div>
            </div>
            <div className="flex-1 bg-muted/50 rounded-xl p-4 text-center">
              <PiggyBank className="w-6 h-6 text-primary mx-auto mb-1" />
              <div className="text-2xl font-bold text-foreground">${user.stats.moneySaved.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Saved</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Gamification Section */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-3">Your Journey</h3>
        <div className="space-y-2">
          <button
            onClick={() => navigate('/eco-hero-library')}
            className="w-full flex items-center justify-between p-4 bg-card rounded-xl shadow-sm hover:shadow-floating hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Eco-Hero Library</p>
                <p className="text-sm text-muted-foreground">Badges & achievements</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button
            onClick={() => navigate('/leaderboard')}
            className="w-full flex items-center justify-between p-4 bg-card rounded-xl shadow-sm hover:shadow-floating hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-secondary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Leaderboard</p>
                <p className="text-sm text-muted-foreground">Community rankings</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button
            onClick={() => navigate('/community-pulse')}
            className="w-full flex items-center justify-between p-4 bg-card rounded-xl shadow-sm hover:shadow-floating hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Community Pulse</p>
                <p className="text-sm text-muted-foreground">Tips & feedback</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground">Preferences</h3>
          <button
            onClick={() => navigate('/health-constraints')}
            className="text-primary text-sm font-medium"
          >
            Edit
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => navigate('/health-constraints')}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium whitespace-nowrap"
          >
            <UtensilsCrossed className="w-4 h-4" />
            Dietary Profile
          </button>
          <button
            onClick={() => navigate('/my-pantry')}
            className="flex items-center gap-2 px-4 py-2.5 bg-muted text-foreground rounded-full text-sm font-medium whitespace-nowrap"
          >
            <Refrigerator className="w-4 h-4" />
            Pantry Setup
          </button>
          <button
            onClick={() => navigate('/notification-preferences')}
            className="flex items-center justify-center w-10 h-10 bg-muted text-foreground rounded-full"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recipe History */}
      <div className="px-4">
        <h3 className="text-lg font-semibold text-foreground mb-3">Recipe History</h3>
        {user.history.length === 0 ? (
          <p className="text-muted-foreground text-sm">No recipes cooked yet. Start cooking!</p>
        ) : (
          <div className="space-y-3">
            {user.history.map((recipe) => (
              <Card
                key={recipe.id}
                className="flex items-center gap-3 p-3 bg-card rounded-xl cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => navigate('/recipe-details')}
              >
                <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <UtensilsCrossed className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-foreground">{recipe.name}</h4>
                    <span className="text-xs text-muted-foreground">{new Date(recipe.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">+{recipe.xpEarned} XP</p>
                  <Badge className={`mt-1.5 text-xs ${getBadgeStyle(recipe.xpEarned)}`}>
                    {getBadgeIcon(recipe.xpEarned)}
                    {getBadgeText(recipe.xpEarned)}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Profile;
