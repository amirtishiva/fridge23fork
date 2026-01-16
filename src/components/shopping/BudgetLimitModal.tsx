import { useState } from "react";
import { X, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BudgetLimitModalProps {
  currentBudget: number | null;
  onSetBudget: (budget: number | null) => void;
  onClose: () => void;
}

const BudgetLimitModal = ({ currentBudget, onSetBudget, onClose }: BudgetLimitModalProps) => {
  const [budgetInput, setBudgetInput] = useState(currentBudget?.toString() || "");

  const presetBudgets = [25, 50, 75, 100, 150, 200];

  const handleSave = () => {
    const budget = parseFloat(budgetInput);
    if (!isNaN(budget) && budget > 0) {
      onSetBudget(budget);
    }
    onClose();
  };

  const handleClear = () => {
    onSetBudget(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="w-full bg-card rounded-t-3xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Set Budget Limit</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <p className="text-muted-foreground text-sm mb-4">
          Get notified when your cart total approaches or exceeds your budget.
        </p>

        {/* Custom Input */}
        <div className="relative mb-4">
          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="number"
            placeholder="Enter budget amount"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            className="pl-12 h-14 text-lg rounded-xl"
          />
        </div>

        {/* Preset Amounts */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {presetBudgets.map((amount) => (
            <button
              key={amount}
              onClick={() => setBudgetInput(amount.toString())}
              className={`py-3 rounded-xl font-medium transition-all ${
                budgetInput === amount.toString()
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              ${amount}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleSave}
            disabled={!budgetInput || parseFloat(budgetInput) <= 0}
            className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold"
          >
            Set Budget
          </Button>
          
          {currentBudget && (
            <Button
              onClick={handleClear}
              variant="ghost"
              className="w-full h-12 rounded-xl text-destructive hover:text-destructive"
            >
              Remove Budget Limit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetLimitModal;
