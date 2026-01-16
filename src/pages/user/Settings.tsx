import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  Bell, 
  UtensilsCrossed, 
  Moon, 
  Sun,
  Trash2, 
  Database,
  Info,
  Shield,
  FileText,
  HelpCircle,
  LogOut,
  ChevronRight,
  Lock
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(() => 
    document.documentElement.classList.contains('dark')
  );

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleClearCache = () => {
    toast({
      title: "Cache Cleared",
      description: "All cached data has been cleared successfully.",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="screen-padding py-4 flex items-center gap-4 border-b border-border">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-section-title text-foreground">Settings</h1>
      </div>

      {/* Account Section */}
      <div className="screen-padding py-6">
        <p className="text-caption text-muted-foreground uppercase tracking-wider mb-4">
          ACCOUNT
        </p>

        <div className="bg-card rounded-lg shadow-card overflow-hidden">
          <button
            onClick={() => navigate('/profile')}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-card-title text-foreground">Edit Profile</p>
                <p className="text-caption text-muted-foreground">Name, avatar, and details</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <div className="h-px bg-border mx-4" />

          <button
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            onClick={() => toast({ title: "Coming Soon", description: "Password change will be available in a future update." })}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-secondary" />
              </div>
              <div className="text-left">
                <p className="text-card-title text-foreground">Change Password</p>
                <p className="text-caption text-muted-foreground">Update your security credentials</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <div className="h-px bg-border mx-4" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-destructive" />
              </div>
              <div className="text-left">
                <p className="text-card-title text-destructive">Log Out</p>
                <p className="text-caption text-muted-foreground">Sign out of your account</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="screen-padding pb-6">
        <p className="text-caption text-muted-foreground uppercase tracking-wider mb-4">
          PREFERENCES
        </p>

        <div className="bg-card rounded-lg shadow-card overflow-hidden">
          <button
            onClick={() => navigate('/health-constraints')}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-card-title text-foreground">Dietary Profile</p>
                <p className="text-caption text-muted-foreground">Allergies and restrictions</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <div className="h-px bg-border mx-4" />

          <button
            onClick={() => navigate('/notification-preferences')}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-left">
                <p className="text-card-title text-foreground">Notification Preferences</p>
                <p className="text-caption text-muted-foreground">Alerts, reminders, quiet hours</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="screen-padding pb-6">
        <p className="text-caption text-muted-foreground uppercase tracking-wider mb-4">
          APPEARANCE
        </p>

        <div className="bg-card rounded-lg p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                {darkMode ? (
                  <Moon className="w-5 h-5 text-purple-500" />
                ) : (
                  <Sun className="w-5 h-5 text-purple-500" />
                )}
              </div>
              <div>
                <p className="text-card-title text-foreground">Dark Mode</p>
                <p className="text-caption text-muted-foreground">
                  {darkMode ? "Currently enabled" : "Currently disabled"}
                </p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={handleDarkModeToggle} />
          </div>
        </div>
      </div>

      {/* Storage Section */}
      <div className="screen-padding pb-6">
        <p className="text-caption text-muted-foreground uppercase tracking-wider mb-4">
          STORAGE
        </p>

        <div className="bg-card rounded-lg shadow-card overflow-hidden">
          <button
            onClick={handleClearCache}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-orange-500" />
              </div>
              <div className="text-left">
                <p className="text-card-title text-foreground">Clear Cache</p>
                <p className="text-caption text-muted-foreground">Free up storage space</p>
              </div>
            </div>
          </button>

          <div className="h-px bg-border mx-4" />

          <button
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            onClick={() => toast({ title: "Coming Soon", description: "Data management will be available in a future update." })}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-teal-500" />
              </div>
              <div className="text-left">
                <p className="text-card-title text-foreground">Manage Data</p>
                <p className="text-caption text-muted-foreground">Export or delete your data</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="screen-padding pb-6">
        <p className="text-caption text-muted-foreground uppercase tracking-wider mb-4">
          ABOUT
        </p>

        <div className="bg-card rounded-lg shadow-card overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Info className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-card-title text-foreground">App Version</p>
                <p className="text-caption text-muted-foreground">v1.0.0</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-border mx-4" />

          <button
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            onClick={() => toast({ title: "Privacy Policy", description: "Opening privacy policy..." })}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Shield className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-card-title text-foreground">Privacy Policy</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <div className="h-px bg-border mx-4" />

          <button
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            onClick={() => toast({ title: "Terms of Service", description: "Opening terms of service..." })}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-card-title text-foreground">Terms of Service</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <div className="h-px bg-border mx-4" />

          <button
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            onClick={() => toast({ title: "Help & Support", description: "Opening help center..." })}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-card-title text-foreground">Help & Support</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
