import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Mic, HelpCircle, ChevronRight, Timer, ArrowLeftRight } from "lucide-react";

interface VoiceAssistantProps {
  onClose: () => void;
  onCommand: (command: string) => void;
}

const VoiceAssistant = ({ onClose, onCommand }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [highlightedWords, setHighlightedWords] = useState<string[]>([]);
  const [waveformHeights, setWaveformHeights] = useState<number[]>(
    Array(9).fill(20).map(() => Math.random() * 60 + 20)
  );

  // Simulate live transcript updates
  useEffect(() => {
    if (!isListening) return;

    const phrases = [
      { text: "Show me the", highlights: [] },
      { text: "Show me the next", highlights: ["next"] },
      { text: "Show me the next step", highlights: ["next", "step"] },
      { text: "Show me the next step...", highlights: ["next", "step"] },
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < phrases.length) {
        const phrase = phrases[index];
        setTranscript(phrase?.text || "");
        setHighlightedWords(phrase?.highlights || []);
        index++;
      } else {
        clearInterval(interval);
        // Simulate command recognition - ONLY triggers if user clicks suggestion or real voice logic implemented (placeholder)
        // Removed auto-next trigger to prevent collapsing steps
      }
    }, 600);

    return () => clearInterval(interval);
  }, [isListening, onCommand]);

  // Animate waveform
  useEffect(() => {
    if (!isListening) return;

    const interval = setInterval(() => {
      setWaveformHeights(
        Array(9).fill(0).map(() => Math.random() * 60 + 20)
      );
    }, 150);

    return () => clearInterval(interval);
  }, [isListening]);

  const handleToggleListening = () => {
    setIsListening(!isListening);
  };

  const handleQuickCommand = (command: string) => {
    onCommand(command);
  };

  const renderTranscript = () => {
    const words = transcript.split(" ");
    return words.map((word, index) => {
      const cleanWord = word.replace("...", "");
      const isHighlighted = highlightedWords.includes(cleanWord.toLowerCase());
      return (
        <span key={index}>
          <span className={isHighlighted ? "text-primary" : "text-white"}>
            {word}
          </span>
          {index < words.length - 1 ? " " : ""}
        </span>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0D1F0D] flex flex-col">
      {/* Header */}
      <div className="screen-padding py-4 flex items-center justify-between">
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="flex items-center gap-2 bg-[#1A3A1A] rounded-full px-4 py-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-primary text-sm font-medium tracking-wider">LISTENING</span>
        </div>

        <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
          <HelpCircle className="w-6 h-6 text-white/60" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Live Transcript Label */}
        <p className="text-white/50 text-sm tracking-widest uppercase mb-6">
          LIVE TRANSCRIPT
        </p>

        {/* Transcript Display */}
        <div className="text-center mb-12">
          <p className="text-4xl font-bold leading-tight">
            "{renderTranscript()}"
          </p>
        </div>

        {/* Quick Command Suggestions */}
        <div className="w-full max-w-sm">
          <p className="text-white/50 text-sm text-center mb-4">Try saying:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => handleQuickCommand("next")}
              className="flex items-center gap-2 bg-white/10 rounded-full px-5 py-3 text-white/90 text-sm"
            >
              <ChevronRight className="w-4 h-4 text-primary" />
              Next Step
            </button>
            <button
              onClick={() => handleQuickCommand("timer")}
              className="flex items-center gap-2 bg-white/10 rounded-full px-5 py-3 text-white/90 text-sm"
            >
              <Timer className="w-4 h-4 text-secondary" />
              Set Timer 5m
            </button>
            <button
              onClick={() => handleQuickCommand("substitute")}
              className="flex items-center gap-2 bg-white/10 rounded-full px-5 py-3 text-white/90 text-sm"
            >
              <ArrowLeftRight className="w-4 h-4 text-white/60" />
              Substitute Ingredient
            </button>
          </div>
        </div>
      </div>

      {/* Waveform & Mic Button */}
      <div className="pb-12 flex flex-col items-center">
        {/* Audio Waveform */}
        <div className="flex items-end gap-1 h-20 mb-6">
          {waveformHeights.map((height, index) => (
            <div
              key={index}
              className="w-2 bg-primary rounded-full transition-all duration-150"
              style={{ height: `${isListening ? height : 20}px` }}
            />
          ))}
        </div>

        {/* Mic Button */}
        <button
          onClick={handleToggleListening}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isListening
              ? "bg-primary shadow-[0_0_40px_rgba(76,175,80,0.4)]"
              : "bg-white/20"
            }`}
        >
          <Mic className={`w-8 h-8 ${isListening ? "text-white" : "text-white/60"}`} />
        </button>

        <p className="text-white/50 text-sm mt-4">
          {isListening ? "Tap to stop listening" : "Tap to start listening"}
        </p>
      </div>
    </div>
  );
};

export default VoiceAssistant;
