import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DetectedItem {
  id: string;
  name: string;
  quantity: string;
  brand: string;
  category: string;
}

const PantryScan = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(true);
  const [scanStatus, setScanStatus] = useState("Searching database...");
  const [detectedItem, setDetectedItem] = useState<DetectedItem | null>(null);

  useEffect(() => {
    // Simulate scanning process
    const scanTimer = setTimeout(() => {
      setScanStatus("Item found!");
      setDetectedItem({
        id: "1",
        name: "Organic Penne Pasta",
        quantity: "500g",
        brand: "Barilla",
        category: "Pantry",
      });
      setIsScanning(false);
    }, 2000);

    return () => clearTimeout(scanTimer);
  }, []);

  const handleConfirmAdd = () => {
    navigate("/my-pantry");
  };

  const handleClose = () => {
    navigate("/my-pantry");
  };

  const handleEnterManually = () => {
    // Would open manual entry form
  };

  return (
    <div className="fixed inset-0 bg-black">
      {/* Camera View (simulated) */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Blurred pantry background */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/30 to-amber-800/20" />
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 screen-padding py-6 flex items-center justify-between z-10">
        <button
          onClick={handleClose}
          className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <button className="w-12 h-12 rounded-full bg-black/50 border border-white/20 flex items-center justify-center">
          <Trash2 className="w-5 h-5 text-white/80" />
        </button>
      </div>

      {/* Status Indicator */}
      <div className="absolute top-24 left-0 right-0 flex justify-center z-10">
        <div className="bg-black/60 rounded-full px-4 py-2 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isScanning ? "bg-primary animate-pulse" : "bg-primary"}`} />
          <span className="text-white/80 text-sm">{scanStatus}</span>
        </div>
      </div>

      {/* Scanning Frame */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="relative w-72 h-80">
          {/* Corner Brackets */}
          <div className="absolute -top-1 -left-1 w-10 h-10 border-t-4 border-l-4 border-primary rounded-tl-lg" />
          <div className="absolute -top-1 -right-1 w-10 h-10 border-t-4 border-r-4 border-primary rounded-tr-lg" />
          <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-4 border-l-4 border-primary rounded-bl-lg" />
          <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-4 border-r-4 border-primary rounded-br-lg" />
          
          {/* Scanning Line */}
          {isScanning && (
            <div 
              className="absolute left-2 right-2 h-0.5 bg-primary animate-pulse"
              style={{ 
                top: "50%",
                boxShadow: "0 0 20px rgba(76, 175, 80, 0.6)"
              }}
            />
          )}
        </div>
      </div>

      {/* Manual Entry Option */}
      <div className="absolute bottom-64 left-0 right-0 flex justify-center z-10">
        <button 
          onClick={handleEnterManually}
          className="text-white/60 text-sm underline"
        >
          Enter manually
        </button>
      </div>

      {/* Detected Item Card */}
      {detectedItem && (
        <div className="absolute bottom-0 left-0 right-0 bg-[#0D1F0D] rounded-t-3xl p-6 z-20">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-primary/20 text-primary text-xs font-medium px-2 py-0.5 rounded">
                  FOUND
                </span>
                <span className="text-white/50 text-sm">{detectedItem.category}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">
                {detectedItem.name}
              </h3>
              <p className="text-white/60 text-sm">
                {detectedItem.quantity} • {detectedItem.brand}
              </p>
            </div>
            
            {/* Product Image Placeholder */}
            <div className="w-24 h-28 bg-white rounded-lg flex items-center justify-center relative">
              <span className="text-4xl">📦</span>
              <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          <Button
            onClick={handleConfirmAdd}
            className="w-full mt-6 h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Confirm & Add
          </Button>
        </div>
      )}
    </div>
  );
};

export default PantryScan;
