import { useState } from "react";
import { WifiOff, RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const ConnectionLost = () => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      // Check connection and navigate if successful
    }, 2000);
  };

  const handleOfflineMode = () => {
    // Enable offline mode
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex flex-col items-center justify-center px-8">
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="w-48 h-48 rounded-full bg-muted flex items-center justify-center">
          {/* Whisk illustration placeholder */}
          <div className="w-32 h-32 bg-gradient-to-b from-muted to-muted/50 rounded-full flex items-center justify-center">
            <span className="text-6xl">🥄</span>
          </div>
        </div>
        {/* Wifi off badge */}
        <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
          <WifiOff className="w-6 h-6 text-secondary" />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-page-title text-foreground text-center mb-3">Connection Lost</h1>
      <p className="text-body text-muted-foreground text-center mb-8">
        Your kitchen is offline. Check your internet to keep rescue-cooking.
      </p>

      {/* Action Buttons */}
      <div className="w-full max-w-sm space-y-3">
        <Button
          onClick={handleRetry}
          disabled={isRetrying}
          className="w-full h-14 rounded-button bg-primary hover:bg-primary/90 text-primary-foreground text-card-title flex items-center justify-center gap-2"
        >
          Retry
          <RefreshCw className={`w-5 h-5 ${isRetrying ? "animate-spin" : ""}`} />
        </Button>

        <Button
          onClick={handleOfflineMode}
          variant="outline-primary"
          className="w-full h-14 rounded-button text-card-title flex items-center justify-center gap-2"
        >
          Use Offline Mode
          <Download className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ConnectionLost;
