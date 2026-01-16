import { X, ShoppingCart, Wheat } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LowStockNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToList: () => void;
  item: {
    name: string;
    daysLeft: number;
    percentRemaining: number;
  };
}

const LowStockNotification = ({
  isOpen,
  onClose,
  onAddToList,
  item,
}: LowStockNotificationProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div className="w-full max-w-lg bg-background rounded-t-3xl animate-slide-up">
        {/* Header */}
        <div className="screen-padding py-4 flex items-center justify-between border-b border-border">
          <button onClick={onClose} className="p-2 -ml-2">
            <X className="w-6 h-6 text-foreground" />
          </button>
          <span className="text-caption text-muted-foreground uppercase tracking-wider font-medium">
            NOTIFICATION
          </span>
          <div className="w-10" />
        </div>

        {/* Content */}
        <div className="screen-padding py-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center">
              <Wheat className="w-10 h-10 text-secondary" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-page-title text-foreground text-center mb-2">
            Heads up!
          </h2>
          <p className="text-body text-muted-foreground text-center mb-8">
            Your {item.name} is running low based on your recent cooking habits.
          </p>

          {/* Item Card */}
          <div className="bg-card rounded-xl p-4 shadow-card mb-6">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center text-4xl">
                🫒
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-caption text-muted-foreground uppercase tracking-wider">
                      PANTRY ITEM
                    </p>
                    <h3 className="text-section-title text-foreground font-semibold">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Approx. {item.daysLeft} days left
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-destructive/10 text-destructive text-sm font-medium rounded">
                    Low Stock
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">{item.percentRemaining}% remaining</span>
                <span className="text-muted-foreground">{100 - item.percentRemaining}% used</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${item.percentRemaining}%` }}
                />
              </div>
            </div>
          </div>

          {/* Substitutes */}
          <div className="mb-8">
            <h4 className="text-card-title text-foreground font-semibold mb-3">
              Frequent Substitutes
            </h4>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-3">
                <span className="text-2xl">🧈</span>
                <span className="text-body text-foreground">Butter</span>
              </div>
              <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-3">
                <span className="text-2xl">🥥</span>
                <span className="text-body text-foreground">Coconut Oil</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <Button
            onClick={onAddToList}
            className="w-full h-14 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground text-card-title flex items-center justify-center gap-2 mb-3"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Shopping List
          </Button>
          <button
            onClick={onClose}
            className="w-full py-4 text-muted-foreground text-card-title"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default LowStockNotification;
