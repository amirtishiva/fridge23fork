import { useState } from "react";
import { X, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PriceEditModalProps {
  itemName: string;
  currentPrice: number;
  onSave: (newPrice: number) => void;
  onClose: () => void;
}

const PriceEditModal = ({ itemName, currentPrice, onSave, onClose }: PriceEditModalProps) => {
  const [priceInput, setPriceInput] = useState(currentPrice.toFixed(2));

  const handleSave = () => {
    const price = parseFloat(priceInput);
    if (!isNaN(price) && price >= 0) {
      onSave(price);
    }
    onClose();
  };

  const quickAdjustments = [-1, -0.50, +0.50, +1];

  const handleQuickAdjust = (adjustment: number) => {
    const current = parseFloat(priceInput) || 0;
    const newPrice = Math.max(0, current + adjustment);
    setPriceInput(newPrice.toFixed(2));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="w-full bg-card rounded-t-3xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Edit Price</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <p className="text-muted-foreground mb-4">
          Update the price for <span className="font-semibold text-foreground">{itemName}</span>
        </p>

        {/* Price Input */}
        <div className="relative mb-4">
          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
            className="pl-12 h-14 text-2xl font-bold rounded-xl text-center"
          />
        </div>

        {/* Quick Adjustments */}
        <div className="flex gap-2 mb-6">
          {quickAdjustments.map((adj) => (
            <button
              key={adj}
              onClick={() => handleQuickAdjust(adj)}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                adj < 0
                  ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              }`}
            >
              {adj > 0 ? "+" : ""}${adj.toFixed(2)}
            </button>
          ))}
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={!priceInput || parseFloat(priceInput) < 0}
          className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold"
        >
          Update Price
        </Button>
      </div>
    </div>
  );
};

export default PriceEditModal;
