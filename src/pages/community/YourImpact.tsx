import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, Leaf, Share2, ChevronDown, CheckCircle, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";

interface RescuedItem {
  id: string;
  name: string;
  count: number;
  color: string;
  icon: string;
}

const topRescuedItems: RescuedItem[] = [
  { id: "1", name: "Avocados", count: 3, color: "bg-green-600", icon: "🥑" },
  { id: "2", name: "Spinach", count: 2, color: "bg-green-500", icon: "🍃" },
  { id: "3", name: "Milk", count: 1, color: "bg-orange-100", icon: "🥛" },
];

const YourImpact = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [selectedMonth, setSelectedMonth] = useState("This Month");

  // Calculate weekly activity from history
  const weeklyData = useMemo(() => {
    const now = new Date();
    const weeks = [0, 0, 0, 0]; // Last 4 weeks, index 3 is current week

    user.history.forEach(item => {
      const itemDate = new Date(item.date);
      const diffTime = Math.abs(now.getTime() - itemDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 7) weeks[3]++;
      else if (diffDays <= 14) weeks[2]++;
      else if (diffDays <= 21) weeks[1]++;
      else if (diffDays <= 28) weeks[0]++;
    });

    return [
      { week: "3w ago", value: weeks[0] * 20, count: weeks[0], active: weeks[0] > 0 },
      { week: "2w ago", value: weeks[1] * 20, count: weeks[1], active: weeks[1] > 0 },
      { week: "Last wk", value: weeks[2] * 20, count: weeks[2], active: weeks[2] > 0 },
      { week: "This wk", value: weeks[3] * 20, count: weeks[3], active: weeks[3] > 0 },
    ];
  }, [user.history]);

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="screen-padding py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-section-title text-foreground">Your Impact</h1>
        <button className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-full">
          <span className="text-caption text-foreground">{selectedMonth}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Cumulative Savings Card */}
      <div className="screen-padding mb-4">
        <div className="bg-card rounded-lg p-5 shadow-card">
          <p className="text-caption text-muted-foreground uppercase tracking-wider mb-1">
            CUMULATIVE SAVINGS
          </p>
          <h2 className="text-[40px] font-bold text-foreground mb-1">
            ${user.stats.moneySaved.toFixed(2)}
          </h2>
          <div className="flex items-center gap-1 text-primary mb-4">
            <TrendingUp className="w-4 h-4" />
            <span className="text-body font-medium">Keep it up!</span>
          </div>

          <div className="flex items-center gap-8 pt-4 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-lg">⚖️</span>
              </div>
              <div>
                <p className="text-section-title text-foreground font-bold">{user.stats.foodRescued.toFixed(1)} lbs</p>
                <p className="text-caption text-muted-foreground">Food Rescued</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-section-title text-foreground font-bold">{user.stats.co2Saved.toFixed(1)} kg</p>
                <p className="text-caption text-muted-foreground">CO2e Saved</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* First Rescue Badge Link */}
      <div className="screen-padding mb-4">
        <button
          onClick={() => navigate("/first-rescue")}
          className="w-full py-3 bg-secondary/10 border border-secondary/30 rounded-lg flex items-center justify-center gap-2 text-secondary font-medium"
        >
          <Award className="w-5 h-5" />
          View First Rescue Badge
        </button>
      </div>

      {/* Weekly Rescue Streak */}
      <div className="screen-padding mb-6">
        <div className="bg-card rounded-lg p-5 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-card-title text-foreground">Weekly Activity</h3>
              <p className="text-caption text-muted-foreground">Recipes cooked per week</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">{user.stats.streak} 🔥</span>
              <span className="text-caption text-muted-foreground">Day Streak</span>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-center gap-6 h-32 mt-4">
            {weeklyData.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="relative group">
                  <div
                    className={`w-10 rounded-t-lg transition-all ${item.active ? "bg-primary" : "bg-primary/30"
                      }`}
                    style={{ height: `${Math.max(item.value, 10)}px` }}
                  />
                  {/* Tooltip for count */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.count}
                  </div>
                </div>
                <span className="text-caption text-muted-foreground">{item.week}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Rescued */}
      <div className="screen-padding mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-card-title text-foreground">Top Rescued Categories</h3>
          <button className="text-caption text-primary font-medium">View All</button>
        </div>

        <div className="flex gap-3">
          {topRescuedItems.map((item) => (
            <div
              key={item.id}
              className="flex-1 bg-card rounded-lg p-4 shadow-card flex flex-col items-center"
            >
              <div className={`w-16 h-16 rounded-full ${item.color} mb-3 flex items-center justify-center`}>
                <span className="text-2xl">{item.icon}</span>
              </div>
              <p className="text-card-title text-foreground">{item.name}</p>
              <span className="px-2 py-0.5 bg-primary/10 rounded text-caption text-primary mt-1">
                Saved
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Share Button */}
      <div className="screen-padding">
        <Button
          onClick={() => { }}
          className="w-full h-14 rounded-button bg-primary hover:bg-primary/90 text-primary-foreground text-card-title flex items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          Share My Impact
        </Button>
      </div>
    </div>
  );
};

export default YourImpact;
