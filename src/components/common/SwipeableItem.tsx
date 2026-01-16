import { useState, useRef, ReactNode } from "react";
import { Trash2 } from "lucide-react";

interface SwipeableItemProps {
  children: ReactNode;
  onDelete: () => void;
  className?: string;
}

const SwipeableItem = ({ children, onDelete, className = "" }: SwipeableItemProps) => {
  const [translateX, setTranslateX] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const isDraggingRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = e.touches[0].clientX;
    isDraggingRef.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    
    currentXRef.current = e.touches[0].clientX;
    const diff = currentXRef.current - startXRef.current;
    
    // Only allow swiping left (negative values)
    if (diff < 0) {
      // Limit the swipe distance
      const limitedDiff = Math.max(diff, -100);
      setTranslateX(limitedDiff);
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    
    // If swiped more than 60px, trigger delete
    if (translateX < -60) {
      setIsDeleting(true);
      setTranslateX(-100);
      // Animate out then delete
      setTimeout(() => {
        onDelete();
      }, 200);
    } else {
      // Snap back
      setTranslateX(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startXRef.current = e.clientX;
    currentXRef.current = e.clientX;
    isDraggingRef.current = true;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      
      currentXRef.current = e.clientX;
      const diff = currentXRef.current - startXRef.current;
      
      if (diff < 0) {
        const limitedDiff = Math.max(diff, -100);
        setTranslateX(limitedDiff);
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      
      if (translateX < -60) {
        setIsDeleting(true);
        setTranslateX(-100);
        setTimeout(() => {
          onDelete();
        }, 200);
      } else {
        setTranslateX(0);
      }
      
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      {/* Delete background */}
      <div 
        className={`absolute inset-y-0 right-0 w-24 bg-destructive flex items-center justify-center transition-opacity ${
          translateX < -20 ? "opacity-100" : "opacity-0"
        }`}
      >
        <Trash2 className="w-6 h-6 text-white" />
      </div>
      
      {/* Swipeable content */}
      <div
        className={`relative bg-card transition-transform ${isDeleting ? "duration-200" : translateX === 0 ? "duration-200" : "duration-0"}`}
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        {children}
      </div>
    </div>
  );
};

export default SwipeableItem;
