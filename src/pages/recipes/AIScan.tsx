import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Sparkles, Check, Loader2, HelpCircle, AlertCircle, Mic, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScanSession, ScanItem } from "@/hooks/useScanSession";
import { ContainerLabelBottomSheet } from "@/components/scan/ContainerLabelBottomSheet";
import fridgeContents from "@/assets/fridge-contents.png";

// ============================================================================
// AI SCAN PAGE - PRE-SCAN AND POST-SCAN LAYOUTS
// ============================================================================

const AIScan = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [hasCaptured, setHasCaptured] = useState(false);
    const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);

    const handleClose = useCallback(() => {
        navigate("/home");
    }, [navigate]);

    const handleCaptureClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setCapturedImageUrl(imageUrl);
            setHasCaptured(true);
        }
        event.target.value = '';
    };

    return (
        <>
            <input
                ref={fileInputRef}
                id="camera-capture-input"
                name="camera-capture"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
            />

            {!hasCaptured ? (
                <PreScanLayout onCapture={handleCaptureClick} onClose={handleClose} />
            ) : (
                <PostScanLayout capturedImageUrl={capturedImageUrl} onClose={handleClose} />
            )}
        </>
    );
};

// ============================================================================
// PRE-SCAN LAYOUT - Camera preview + Capture button only
// ============================================================================

interface PreScanLayoutProps {
    onCapture: () => void;
    onClose: () => void;
}

const PreScanLayout = ({ onCapture, onClose }: PreScanLayoutProps) => {
    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden bg-black">
            <img
                src={fridgeContents}
                alt="Camera preview"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />

            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-50 p-4 pt-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <Camera className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-semibold text-white drop-shadow-lg">
                        Scan Your Fridge
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
                >
                    <X className="w-5 h-5 text-white" />
                </button>
            </header>

            {/* Center hint */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/40 backdrop-blur-sm px-6 py-3 rounded-2xl">
                    <p className="text-white/90 text-center text-sm">
                        Point camera at your fridge
                        <br />
                        <span className="text-white/60 text-xs">AI will detect ingredients automatically</span>
                    </p>
                </div>
            </div>

            {/* Capture Button */}
            <div className="absolute left-0 right-0 bottom-0 z-50 pb-10 flex flex-col items-center">
                <span className="text-sm text-white/90 bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-sm mb-4">
                    Tap to capture
                </span>
                <button
                    onClick={onCapture}
                    className="w-20 h-20 rounded-full bg-white shadow-2xl flex items-center justify-center border-4 border-primary active:scale-95 transition-transform"
                >
                    <Camera className="w-8 h-8 text-primary" />
                </button>
            </div>
        </div>
    );
};

// ============================================================================
// POST-SCAN LAYOUT - Contained image frame with solid background
// Image in rounded frame, labels inside frame, distinct footer
// ============================================================================

interface PostScanLayoutProps {
    capturedImageUrl: string | null;
    onClose: () => void;
}

type PostScanPhase = 'PROCESSING' | 'RESULTS';

const PostScanLayout = ({ capturedImageUrl, onClose }: PostScanLayoutProps) => {
    const navigate = useNavigate();
    const {
        items,
        unknownItems,
        startSession,
        addItems,
        labelItem,
        endSession,
        resetSession,
        simulateDetection,
        setCapturedImage
    } = useScanSession();

    const [phase, setPhase] = useState<PostScanPhase>('PROCESSING');
    const [detectionProgress, setDetectionProgress] = useState(0);
    const [detectedCount, setDetectedCount] = useState(0);
    const [labelingItem, setLabelingItem] = useState<ScanItem | null>(null);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

    // Start processing on mount (useEffect to avoid setState during render)
    useEffect(() => {
        if (!capturedImageUrl) return;

        setCapturedImage(capturedImageUrl);
        resetSession();
        startSession(capturedImageUrl);

        const mockItems = simulateDetection(capturedImageUrl);
        let currentIndex = 0;

        const interval = setInterval(() => {
            if (currentIndex < mockItems.length) {
                const itemToAdd = mockItems[currentIndex];
                if (itemToAdd) {
                    addItems([itemToAdd]);
                    setDetectedCount(currentIndex + 1);
                    setDetectionProgress(((currentIndex + 1) / mockItems.length) * 100);
                }
                currentIndex++;
            } else {
                clearInterval(interval);
                setPhase('RESULTS');
            }
        }, 600);

        return () => clearInterval(interval);
    }, [capturedImageUrl]); // Only run once when capturedImageUrl is set

    const handleStopScanning = useCallback(() => {
        endSession();
        navigate("/review-ingredients");
    }, [endSession, navigate]);

    const handleHotspotTap = (item: ScanItem) => {
        if (phase !== 'RESULTS') return;
        if (item.detection_type === 'container' ||
            item.detection_type === 'low_confidence' ||
            item.detection_type === 'unknown') {
            setLabelingItem(item);
            setIsBottomSheetOpen(true);
        }
    };

    const handleLabelSubmit = (id: string, label: string) => {
        labelItem(id, label);
        setIsBottomSheetOpen(false);
        setLabelingItem(null);
    };

    const displayImage = capturedImageUrl || fridgeContents;

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden bg-gray-900 flex flex-col">
            {/* Header - Clean top bar */}
            <header className="flex-shrink-0 px-4 pt-8 pb-4 flex items-center justify-between bg-gray-900">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-lg font-semibold text-white">
                        AI Processing
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>
            </header>

            {/* Central Workspace - The Scan Zone */}
            <div className="flex-1 px-4 pb-4 min-h-0">
                <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-gray-700 bg-gray-800">
                    {/* Image with object-contain - entire photo visible */}
                    <img
                        src={displayImage}
                        alt="Captured fridge"
                        className="w-full h-full object-contain"
                    />

                    {/* Scanning line (during processing) */}
                    {phase === 'PROCESSING' && (
                        <div
                            className="absolute left-0 right-0 h-1 bg-primary/70 animate-pulse"
                            style={{ top: '45%' }}
                        />
                    )}

                    {/* AI Detection Tags - Inside image frame only */}
                    <div className="absolute inset-0" style={{ pointerEvents: phase === 'RESULTS' ? 'auto' : 'none' }}>
                        {items.map((item) => (
                            <IngredientHotspot
                                key={item.id}
                                item={item}
                                onTap={handleHotspotTap}
                                interactive={phase === 'RESULTS'}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer/Action Area - Distinct from image frame */}
            <div className="flex-shrink-0 bg-white rounded-t-3xl px-6 py-5 shadow-xl">
                {phase === 'PROCESSING' ? (
                    <>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Processing storage...
                            </h3>
                            <Loader2 className="w-6 h-6 text-primary animate-spin" />
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full transition-all duration-300"
                                style={{ width: `${detectionProgress}%` }}
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Found {detectedCount} ingredient{detectedCount !== 1 ? 's' : ''} so far...
                        </p>
                    </>
                ) : (
                    <>
                        {/* Voice prompt hint */}
                        {unknownItems.length > 0 && (
                            <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-gray-100 rounded-full">
                                <Mic className="w-4 h-4 text-gray-400" />
                                <span className="text-xs text-gray-500">
                                    Tied bag or steel dabba? Tap labels to identify.
                                </span>
                            </div>
                        )}

                        {/* Scan complete status */}
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">Scan complete</h3>
                            <Check className="w-6 h-6 text-primary" />
                        </div>

                        {/* Full progress bar */}
                        <div className="w-full h-2 bg-gray-200 rounded-full mb-3 overflow-hidden">
                            <div className="h-full bg-primary rounded-full w-full" />
                        </div>

                        {/* Status message */}
                        {unknownItems.length > 0 ? (
                            <div className="flex items-start gap-2 mb-5">
                                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-gray-500">
                                    {unknownItems.length} unknown container{unknownItems.length !== 1 ? 's' : ''} detected. Tap to label.
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 mb-5">
                                Found {items.length} ingredients. Ready to cook!
                            </p>
                        )}

                        {/* Action Button */}
                        <Button
                            onClick={handleStopScanning}
                            className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-base"
                        >
                            Stop Scanning
                        </Button>
                    </>
                )}
            </div>

            {/* Labeling Bottom Sheet */}
            <ContainerLabelBottomSheet
                isOpen={isBottomSheetOpen}
                item={labelingItem}
                onClose={() => {
                    setIsBottomSheetOpen(false);
                    setLabelingItem(null);
                }}
                onLabel={handleLabelSubmit}
            />
        </div>
    );
};

// ============================================================================
// INGREDIENT HOTSPOT - Detection tag overlay
// ============================================================================

interface IngredientHotspotProps {
    item: ScanItem;
    onTap: (item: ScanItem) => void;
    interactive: boolean;
}

const IngredientHotspot = ({ item, onTap, interactive }: IngredientHotspotProps) => {
    const isUnknown = item.detection_type === 'container' ||
        item.detection_type === 'unknown' ||
        item.detection_type === 'low_confidence';
    const isLowConfidence = item.detection_type === 'low_confidence';
    const isContainer = item.detection_type === 'container';
    const isIdentified = item.detection_type === 'identified' || item.is_user_labeled;

    const displayName = item.name ||
        (isContainer ? 'Steel Container' : isLowConfidence ? 'Wrapped Item' : 'Unknown');

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                if (interactive && isUnknown) onTap(item);
            }}
            className={`absolute ${interactive && isUnknown ? 'cursor-pointer' : ''}`}
            style={{
                top: item.hotspot_position?.top || '50%',
                left: item.hotspot_position?.left || '50%',
                pointerEvents: interactive ? 'auto' : 'none'
            }}
        >
            {/* Connection line */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className={`w-0.5 h-5 ${isIdentified ? 'bg-primary' : isLowConfidence ? 'bg-amber-500' : 'bg-gray-400'}`} />
                <div className={`w-2.5 h-2.5 rounded-full ${isIdentified ? 'bg-primary' : isLowConfidence ? 'bg-amber-500' : 'bg-gray-400'} animate-pulse`} />
            </div>

            {/* Label card */}
            <div className={`bg-white rounded-full px-3 py-1.5 flex items-center gap-2 shadow-lg ${isUnknown && interactive ? 'ring-2 ring-amber-400/50' : ''}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isIdentified ? 'bg-primary' : isContainer ? 'bg-primary/20' : isLowConfidence ? 'bg-amber-500/20' : 'bg-gray-200'}`}>
                    {isIdentified ? (
                        <Check className="w-3 h-3 text-white" />
                    ) : (
                        <HelpCircle className={`w-3 h-3 ${isContainer ? 'text-primary' : isLowConfidence ? 'text-amber-500' : 'text-gray-400'}`} />
                    )}
                </div>

                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-gray-900 whitespace-nowrap">{displayName}</span>
                    <span className={`text-xs font-semibold ${item.confidence >= 80 ? 'text-primary' : item.confidence >= 50 ? 'text-amber-500' : 'text-gray-400'}`}>
                        {item.confidence}%
                    </span>
                </div>
            </div>

            {/* Sub-label for containers */}
            {(isContainer || (isLowConfidence && !item.is_user_labeled)) && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-8 whitespace-nowrap">
                    <span className={`text-[10px] ${isContainer ? 'text-gray-400' : 'text-amber-500'}`}>
                        {isContainer ? 'Contents unknown' : 'Low Confidence'}
                    </span>
                </div>
            )}
        </div>
    );
};

export default AIScan;
