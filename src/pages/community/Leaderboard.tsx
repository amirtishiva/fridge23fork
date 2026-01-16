import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Trophy, ChevronUp } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useGamification } from "@/hooks/useGamification";

const Leaderboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { leaderboard } = useGamification(user.profile);
  const [tab, setTab] = useState<"global" | "friends">("global");
  const [timeFilter, setTimeFilter] = useState<"week" | "month" | "all">("week");

  // Split leaderboard into top 3 and others
  const top3 = leaderboard.slice(0, 3);
  const others = leaderboard.slice(3, 10); // Show up to 10
  const currentUserEntry = leaderboard.find(u => u.isCurrentUser);

  return (
    <div className="min-h-screen bg-background pb-48">
      {/* Header */}
      <div className="screen-padding py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-section-title text-foreground">Leaderboard</h1>
        <button className="p-2">
          <Info className="w-6 h-6 text-muted-foreground" />
        </button>
      </div>

      {/* Tabs */}
      <div className="screen-padding mb-4">
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => setTab("global")}
            className={`flex-1 py-2.5 rounded-md text-body transition-all ${tab === "global" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
          >
            Global
          </button>
          <button
            onClick={() => setTab("friends")}
            className={`flex-1 py-2.5 rounded-md text-body transition-all ${tab === "friends" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
          >
            Friends
          </button>
        </div>
      </div>

      {/* Time Filter */}
      <div className="screen-padding mb-6">
        <div className="flex gap-2">
          {(["week", "month", "all"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-4 py-2 rounded-full text-body transition-all ${timeFilter === filter
                ? "bg-secondary text-foreground"
                : "bg-card border border-border text-muted-foreground"
                }`}
            >
              {filter === "week" ? "This Week" : filter === "month" ? "Last Month" : "All Time"}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="screen-padding mb-6 text-center">
        <h2 className="text-section-title text-foreground">Top Rescuers</h2>
        <p className="text-body text-muted-foreground">Heroes of the week saving the planet</p>
      </div>

      {/* Top 3 Podium */}
      <div className="screen-padding mb-8">
        <div className="flex items-end justify-center gap-4">
          {/* #2 */}
          {top3[1] && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-muted border-2 border-muted-foreground/30 flex items-center justify-center mb-2 relative overflow-hidden">
                <img src={top3[1].avatar} alt={top3[1].name} className="w-full h-full object-cover" />
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-muted-foreground text-white text-xs flex items-center justify-center font-bold">
                  #2
                </span>
              </div>
              <p className="text-card-title text-foreground">{top3[1].name}</p>
              <p className="text-caption text-primary">{top3[1].xp} XP</p>
            </div>
          )}

          {/* #1 */}
          {top3[0] && (
            <div className="flex flex-col items-center -mt-4">
              <Trophy className="w-8 h-8 text-secondary mb-2" />
              <div className="w-20 h-20 rounded-full bg-secondary/20 border-3 border-secondary flex items-center justify-center mb-2 relative overflow-hidden">
                <img src={top3[0].avatar} alt={top3[0].name} className="w-full h-full object-cover" />
                <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-secondary text-white text-xs flex items-center justify-center font-bold">
                  #1
                </span>
              </div>
              <p className="text-card-title text-foreground font-bold">{top3[0].name}</p>
              <p className="text-caption text-primary font-bold">{top3[0].xp} XP</p>
            </div>
          )}

          {/* #3 */}
          {top3[2] && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-secondary/10 border-2 border-secondary/50 flex items-center justify-center mb-2 relative overflow-hidden">
                <img src={top3[2].avatar} alt={top3[2].name} className="w-full h-full object-cover" />
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-secondary/70 text-white text-xs flex items-center justify-center font-bold">
                  #3
                </span>
              </div>
              <p className="text-card-title text-foreground">{top3[2].name}</p>
              <p className="text-caption text-primary">{top3[2].xp} XP</p>
            </div>
          )}
        </div>
      </div>

      {/* Other Users List */}
      <div className="screen-padding space-y-3">
        {others.map((u) => (
          <div
            key={u.id}
            className={`bg-card rounded-lg p-4 shadow-card flex items-center gap-4 ${u.isCurrentUser ? 'border-2 border-primary' : ''}`}
          >
            <span className="text-body text-muted-foreground w-6">{u.rank}</span>
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-card-title text-foreground">{u.name} {u.isCurrentUser && '(You)'}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-card-title text-foreground">{u.xp}</p>
              <p className="text-caption text-primary">XP</p>
            </div>
          </div>
        ))}
      </div>

      {/* Your Position - Fixed Bottom (if not in top 10 view or always visible) */}
      {currentUserEntry && (
        <div className="fixed bottom-20 left-0 right-0 bg-foreground screen-padding py-4">
          <div className="flex items-center gap-4">
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
            <span className="text-white font-bold">{currentUserEntry.rank}</span>
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
              <img src={user.profile.avatar} alt="You" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-card-title text-white">You</p>
                <span className="px-2 py-0.5 bg-secondary/20 rounded text-caption text-secondary">
                  Lvl {user.profile.level}
                </span>
              </div>
              <p className="text-caption text-white/60">Keep cooking to rank up!</p>
            </div>
            <div className="text-right">
              <p className="text-card-title text-primary">{user.profile.xp}</p>
              <p className="text-caption text-white/60">XP</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
