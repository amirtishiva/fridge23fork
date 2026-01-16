import { useState, useEffect } from "react";
import { X, Check, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScannedProduct {
  name: string;
  price: number;
  barcode: string;
}

// Simulated product database
const productDatabase: Record<string, ScannedProduct> = {
  "5901234123457": { name: "Bananas", price: 0.59, barcode: "5901234123457" },
  "4006381333931": { name: "Avocados", price: 4.50, barcode: "4006381333931" },
  "7622210449283": { name: "Roma Tomatoes", price: 2.99, barcode: "7622210449283" },
  "8410076472878": { name: "Brown Rice", price: 3.99, barcode: "8410076472878" },
  "8000500310427": { name: "Olive Oil", price: 8.99, barcode: "8000500310427" },
  "0070470002514": { name: "Milk", price: 4.29, barcode: "0070470002514" },
  "0075925300207": { name: "Eggs", price: 4.99, barcode: "0075925300207" },
};

interface BarcodeScannerProps {
  onProductScanned: (product: ScannedProduct) => void;
  onClose: () => void;
  itemNames: string[];
}

const BarcodeScanner = ({ onProductScanned, onClose, itemNames }: BarcodeScannerProps) => {
  const [isScanning, setIsScanning] = useState(true);
  const [scanStatus, setScanStatus] = useState("Point at barcode...");
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null);
  const [matchedItem, setMatchedItem] = useState<string | null>(null);

  useEffect(() => {
    // Simulate barcode scanning - in production, use a real barcode scanner library
    const scanTimer = setTimeout(() => {
      // Randomly select a product from the database for demo
      const barcodes = Object.keys(productDatabase);
      const randomBarcode = barcodes[Math.floor(Math.random() * barcodes.length)];
      const product = productDatabase[randomBarcode];
      
      setScanStatus("Product found!");
      setScannedProduct(product);
      
      // Check if this product matches any item in the shopping list
      const match = itemNames.find(
        name => name.toLowerCase().includes(product.name.toLowerCase()) ||
                product.name.toLowerCase().includes(name.toLowerCase())
      );
      setMatchedItem(match || null);
      
      setIsScanning(false);
    }, 2000);

    return () => clearTimeout(scanTimer);
  }, [itemNames]);

  const handleConfirm = () => {
    if (scannedProduct) {
      onProductScanned(scannedProduct);
    }
  };

  const handleScanAgain = () => {
    setIsScanning(true);
    setScanStatus("Point at barcode...");
    setScannedProduct(null);
    setMatchedItem(null);
    
    // Simulate another scan
    setTimeout(() => {
      const barcodes = Object.keys(productDatabase);
      const randomBarcode = barcodes[Math.floor(Math.random() * barcodes.length)];
      const product = productDatabase[randomBarcode];
      
      setScanStatus("Product found!");
      setScannedProduct(product);
      
      const match = itemNames.find(
        name => name.toLowerCase().includes(product.name.toLowerCase()) ||
                product.name.toLowerCase().includes(name.toLowerCase())
      );
      setMatchedItem(match || null);
      
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Camera View (simulated) */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 to-slate-800/20" />
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 screen-padding py-6 flex items-center justify-between z-10">
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        <span className="text-white font-medium">Scan Product</span>
        <div className="w-12" />
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
        <div className="relative w-72 h-40">
          {/* Corner Brackets */}
          <div className="absolute -top-1 -left-1 w-10 h-10 border-t-4 border-l-4 border-primary rounded-tl-lg" />
          <div className="absolute -top-1 -right-1 w-10 h-10 border-t-4 border-r-4 border-primary rounded-tr-lg" />
          <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-4 border-l-4 border-primary rounded-bl-lg" />
          <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-4 border-r-4 border-primary rounded-br-lg" />
          
          {/* Scanning Line */}
          {isScanning && (
            <div 
              className="absolute left-2 right-2 h-0.5 bg-primary"
              style={{ 
                top: "50%",
                boxShadow: "0 0 20px hsl(var(--primary) / 0.6)",
                animation: "scan 1.5s ease-in-out infinite"
              }}
            />
          )}
          
          {/* Camera Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="w-12 h-12 text-white/30" />
          </div>
        </div>
      </div>

      {/* Scanned Product Card */}
      {scannedProduct && (
        <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl p-6 z-20 animate-slide-up">
          <div className="flex gap-4 mb-4">
            <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center text-3xl">
              🏷️
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {matchedItem ? (
                  <span className="bg-primary/20 text-primary text-xs font-medium px-2 py-0.5 rounded">
                    ON YOUR LIST
                  </span>
                ) : (
                  <span className="bg-muted text-muted-foreground text-xs font-medium px-2 py-0.5 rounded">
                    NOT ON LIST
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-foreground">
                {scannedProduct.name}
              </h3>
              <p className="text-2xl font-bold text-primary">
                ${scannedProduct.price.toFixed(2)}
              </p>
            </div>
          </div>

          {matchedItem ? (
            <Button
              onClick={handleConfirm}
              className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Check Off & Update Price
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-center text-muted-foreground text-sm">
                This item isn't on your current list
              </p>
              <Button
                onClick={handleScanAgain}
                variant="outline"
                className="w-full h-12 rounded-xl"
              >
                Scan Different Item
              </Button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(-20px); opacity: 0.5; }
          50% { transform: translateY(20px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default BarcodeScanner;
