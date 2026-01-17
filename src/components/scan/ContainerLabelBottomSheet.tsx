import { useState, useEffect, useRef } from "react";
import { X, Mic, MicOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    ScanItem,
    COMMON_STAPLES,
    getAISuggestions
} from "@/hooks/useScanSession";

// ============================================================================
// CONTAINER LABEL BOTTOM SHEET
// Allows users to label unknown containers or wrapped items
// Supports AI suggestions, common staples, text input, and voice input
// ============================================================================

interface ContainerLabelBottomSheetProps {
    isOpen: boolean;
    item: ScanItem | null;
    onClose: () => void;
    onLabel: (id: string, label: string) => void;
}

export const ContainerLabelBottomSheet = ({
    isOpen,
    item,
    onClose,
    onLabel,
}: ContainerLabelBottomSheetProps) => {
    const [selectedLabel, setSelectedLabel] = useState<string>("");
    const [customLabel, setCustomLabel] = useState<string>("");
    const [isListening, setIsListening] = useState(false);
    const [voiceSupported, setVoiceSupported] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    // Initialize speech recognition
    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                setVoiceSupported(true);
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = false;
                recognitionRef.current.lang = "en-IN"; // Indian English

                recognitionRef.current.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    setCustomLabel(transcript);
                    setSelectedLabel(""); // Clear AI/staple selection
                    setIsListening(false);
                };

                recognitionRef.current.onerror = () => {
                    setIsListening(false);
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                };
            }
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, []);

    // Reset state when item changes
    useEffect(() => {
        if (item) {
            setSelectedLabel(item.user_label || "");
            setCustomLabel("");
            setIsListening(false);
        }
    }, [item]);

    // Toggle voice input
    const toggleVoiceInput = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    // Handle label submission
    const handleSubmit = () => {
        if (!item) return;

        const finalLabel = customLabel.trim() || selectedLabel;
        if (finalLabel) {
            onLabel(item.id, finalLabel);
            onClose();
        }
    };

    // Get AI suggestions based on container type
    const aiSuggestions = item
        ? item.ai_suggestions.length > 0
            ? item.ai_suggestions
            : getAISuggestions(item.container_type, item.content_type)
        : [];

    // Determine title based on container type
    const getTitle = () => {
        if (!item) return "Label this item";

        switch (item.container_type) {
            case 'steel_dabba':
            case 'tiffin':
                return "What's inside this Dabba?";
            case 'tupperware':
                return "What's in this container?";
            case 'bottle':
                return "What's in this bottle?";
            case 'jar':
                return "What's in this jar?";
            case 'wrapped':
            case 'polythene':
                return "What's wrapped here?";
            case 'foil':
                return "What's in the foil?";
            default:
                return "What is this item?";
        }
    };

    // Get appropriate staples based on item type
    const getRelevantStaples = () => {
        if (!item) return COMMON_STAPLES;

        // Filter staples based on container/content type
        if (item.container_type === 'bottle' || item.content_type === 'liquid') {
            return COMMON_STAPLES.filter(s =>
                ['milk', 'buttermilk'].includes(s.id) || s.label.toLowerCase().includes('milk')
            );
        }

        if (item.container_type === 'wrapped' || item.container_type === 'polythene') {
            return COMMON_STAPLES.filter(s =>
                ['vegetables', 'fruits', 'paneer'].includes(s.id.toLowerCase())
            );
        }

        return COMMON_STAPLES;
    };

    if (!isOpen || !item) return null;

    const relevantStaples = getRelevantStaples();
    const hasSelection = selectedLabel || customLabel.trim();

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
                <div className="bg-card rounded-t-3xl p-6 pb-8 max-h-[85vh] overflow-y-auto">
                    {/* Handle bar */}
                    <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-4" />

                    {/* Header */}
                    <div className="text-center mb-6">
                        <h2 className="text-section-title text-foreground font-semibold">
                            {getTitle()}
                        </h2>
                        <p className="text-body text-muted-foreground mt-1">
                            Help the AI identify this container
                        </p>
                    </div>

                    {/* AI Suggestions */}
                    {aiSuggestions.length > 0 && (
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span className="text-card-title text-foreground font-medium">
                                    AI Suggestions
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {aiSuggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setSelectedLabel(suggestion);
                                            setCustomLabel("");
                                        }}
                                        className={`px-4 py-2 rounded-full border-2 transition-all ${selectedLabel === suggestion
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-border bg-background text-foreground hover:border-primary/50"
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            {selectedLabel === suggestion && "✓"}
                                            {index === 0 && selectedLabel !== suggestion && "?"}
                                            {suggestion}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Common Staples */}
                    <div className="mb-6">
                        <span className="text-card-title text-foreground font-medium mb-3 block">
                            Common Staples
                        </span>
                        <div className="grid grid-cols-3 gap-3">
                            {relevantStaples.slice(0, 6).map((staple) => (
                                <button
                                    key={staple.id}
                                    onClick={() => {
                                        setSelectedLabel(staple.label);
                                        setCustomLabel("");
                                    }}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${selectedLabel === staple.label
                                            ? "border-primary bg-primary/10"
                                            : "border-border bg-background hover:border-primary/50"
                                        }`}
                                >
                                    <span className="text-2xl">{staple.icon}</span>
                                    <span className="text-caption text-foreground font-medium">
                                        {staple.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Input with Voice */}
                    <div className="mb-6">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={customLabel}
                                onChange={(e) => {
                                    setCustomLabel(e.target.value);
                                    setSelectedLabel("");
                                }}
                                placeholder="Other..."
                                className="flex-1 p-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                            {voiceSupported && (
                                <button
                                    onClick={toggleVoiceInput}
                                    className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${isListening
                                            ? "bg-destructive text-destructive-foreground animate-pulse"
                                            : "bg-primary text-primary-foreground"
                                        }`}
                                >
                                    {isListening ? (
                                        <MicOff className="w-6 h-6" />
                                    ) : (
                                        <Mic className="w-6 h-6" />
                                    )}
                                </button>
                            )}
                        </div>
                        {isListening && (
                            <p className="text-caption text-primary mt-2 animate-pulse">
                                Listening... speak now
                            </p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 h-14 rounded-xl"
                        >
                            Skip
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!hasSelection}
                            className="flex-1 h-14 rounded-xl bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
                        >
                            Label Container
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContainerLabelBottomSheet;
