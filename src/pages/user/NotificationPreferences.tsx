import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const NotificationPreferences = () => {
  const navigate = useNavigate();
  const [expiryAlerts, setExpiryAlerts] = useState<"never" | "weekly" | "daily">("daily");
  const [pantryRestock, setPantryRestock] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [recipeSuggestions, setRecipeSuggestions] = useState(false);
  const [quietHours, setQuietHours] = useState(true);
  const [startTime] = useState("10:00 PM");
  const [endTime] = useState("07:00 AM");

  return (
    <div className="min-h-screen bg-background pb-40">
      {/* Header */}
      <div className="screen-padding py-4 flex items-center gap-4 border-b border-border">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-section-title text-foreground">Notification Preferences</h1>
      </div>

      {/* Inventory Management */}
      <div className="screen-padding py-6">
        <p className="text-caption text-muted-foreground uppercase tracking-wider mb-4">
          INVENTORY MANAGEMENT
        </p>

        <div className="bg-card rounded-lg p-4 shadow-card space-y-4">
          {/* Expiry Alerts */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-card-title text-foreground">Expiry Alerts</span>
              <Clock className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex bg-muted rounded-lg p-1">
              {(["never", "weekly", "daily"] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setExpiryAlerts(option)}
                  className={`flex-1 py-2 rounded-md text-body capitalize transition-all ${expiryAlerts === option
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground"
                    }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Pantry Restock */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <p className="text-card-title text-foreground">Pantry Restock</p>
              <p className="text-caption text-muted-foreground">
                Get notified when staples run low
              </p>
            </div>
            <Switch checked={pantryRestock} onCheckedChange={setPantryRestock} />
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="screen-padding pb-6">
        <p className="text-caption text-muted-foreground uppercase tracking-wider mb-4">
          INSIGHTS
        </p>

        <div className="bg-card rounded-lg p-4 shadow-card space-y-4">
          {/* Weekly Impact Reports */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-card-title text-foreground">Weekly Impact Reports</p>
              <p className="text-caption text-muted-foreground">
                Track your food waste savings
              </p>
            </div>
            <Switch checked={weeklyReports} onCheckedChange={setWeeklyReports} />
          </div>

          {/* New Recipe Suggestions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <p className="text-card-title text-foreground">New Recipe Suggestions</p>
              <p className="text-caption text-muted-foreground">
                Based on available ingredients
              </p>
            </div>
            <Switch checked={recipeSuggestions} onCheckedChange={setRecipeSuggestions} />
          </div>
        </div>
      </div>

      {/* Do Not Disturb */}
      <div className="screen-padding pb-6">
        <p className="text-caption text-muted-foreground uppercase tracking-wider mb-4">
          DO NOT DISTURB
        </p>

        <div className="bg-card rounded-lg p-4 shadow-card">
          {/* Quiet Hours Toggle */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-card-title text-foreground">Quiet Hours</p>
              <p className="text-caption text-muted-foreground">
                Pause notifications at night
              </p>
            </div>
            <Switch checked={quietHours} onCheckedChange={setQuietHours} />
          </div>

          {/* Time Selection */}
          {quietHours && (
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              <div className="flex-1">
                <p className="text-caption text-muted-foreground mb-1">Start</p>
                <p className="text-card-title text-primary">{startTime}</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex-1">
                <p className="text-caption text-muted-foreground mb-1">End</p>
                <p className="text-card-title text-foreground">{endTime}</p>
              </div>
            </div>
          )}

          <p className="text-caption text-muted-foreground mt-4 pt-4 border-t border-border">
            Important alerts about expired food will still be delivered regardless of quiet hours
            settings to prevent waste.
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background screen-padding pb-8 pt-4">
        <Button
          onClick={() => navigate(-1)}
          className="w-full h-14 rounded-button bg-primary hover:bg-primary/90 text-primary-foreground text-card-title"
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default NotificationPreferences;
