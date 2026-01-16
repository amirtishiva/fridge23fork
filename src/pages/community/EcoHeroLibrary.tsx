import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Award, Lock } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useGamification } from "@/hooks/useGamification";

const EcoHeroLibrary = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { badges } = useGamification(user.profile, user.stats);

  const unlockedCount = badges.filter(b => b.unlocked).length;
  // Calculate level progress based on XP: Level N starts at N*1000 XP.
  // Current XP = user.profile.xp.
  // Next Level XP = (user.profile.level + 1) * 1000.
  // Progress = (XP - CurrentLevelStart) / (NextLevelStart - CurrentLevelStart)
  const currentLevelStart = user.profile.level * 1000;
  const nextLevelStart = (user.profile.level + 1) * 1000;
  const xpProgress = ((user.profile.xp - currentLevelStart) / (nextLevelStart - currentLevelStart)) * 100;
  // Fallback if level 0 logic is weird, but we started at level 5 with 2450 XP?
  // Wait, Default user is Level 5, 2450 derived? 2450 XP should be level 3 based on '1 + floor(XP/1000)'.
  // Let's rely on user.profile.xp purely for bar.
  // Actually, let's just show progress to next 1000 milestone.
  const progressPercent = (user.profile.xp % 1000) / 10; // 0-1000 mapped to 0-100%

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="screen-padding py-4 flex items-center gap-4 border-b border-border">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-section-title text-foreground">Eco-Hero Library</h1>
      </div>

      {/* Level & Stats */}
      <div className="screen-padding py-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => navigate("/level-up")}
            className="flex-1 bg-card rounded-lg p-5 shadow-card flex flex-col items-center hover:bg-neutral-50 transition-colors"
          >
            <p className="text-[40px] font-bold text-foreground">Lvl {user.profile.level}</p>
            <div className="flex items-center gap-1 text-primary">
              <Shield className="w-4 h-4" />
              <span className="text-caption font-medium uppercase">ECO-RANK</span>
            </div>
          </button>
          <div className="flex-1 bg-card rounded-lg p-5 shadow-card flex flex-col items-center">
            <p className="text-[40px] font-bold text-foreground">
              {unlockedCount}<span className="text-muted-foreground text-lg">/{badges.length}</span>
            </p>
            <div className="flex items-center gap-1 text-primary">
              <Award className="w-4 h-4" />
              <span className="text-caption font-medium uppercase">UNLOCKED</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-card rounded-lg p-4 shadow-card mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-card-title text-foreground">XP Progress</p>
              <p className="text-caption text-muted-foreground">Next Level: {nextLevelStart} XP</p>
            </div>
            <span className="text-section-title text-primary font-bold">{user.profile.xp} XP</span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Badge Collection */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-card-title text-foreground">Badge Collection</h2>
        </div>

        {/* Leaderboard Link */}
        <button
          onClick={() => navigate('/leaderboard')}
          className="w-full mb-6 py-4 bg-card rounded-lg shadow-card flex items-center justify-center gap-2 text-primary hover:bg-primary/5 transition-colors"
        >
          <Award className="w-5 h-5" />
          <span className="text-card-title">View Community Leaderboard</span>
        </button>

        <div className="grid grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div key={badge.id} className="flex flex-col items-center">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-2 relative ${badge.unlocked
                  ? "bg-card border-2 border-primary"
                  : "bg-muted border-2 border-dashed border-muted-foreground/30"
                  }`}
              >
                {badge.unlocked ? (
                  <span className="text-3xl">{badge.icon}</span>
                ) : (
                  <Lock className="w-6 h-6 text-muted-foreground" />
                )}
                {badge.unlocked && (
                  <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <p
                className={`text-caption text-center font-medium ${badge.unlocked ? "text-foreground" : "text-muted-foreground"
                  }`}
              >
                {badge.name}
              </p>
              <p className="text-[10px] text-muted-foreground text-center leading-tight">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EcoHeroLibrary;
