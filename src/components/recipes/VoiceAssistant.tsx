import { useState, useEffect } from "react";
import { X, Mic, HelpCircle, ChevronRight, Timer, ArrowLeftRight, Volume2, VolumeX } from "lucide-react";
import { useVoiceCommands } from "@/hooks/useVoiceCommands";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

interface VoiceAssistantProps {
  onClose: () => void;
  onCommand: (command: string) => void;
  currentStepText?: string; // Optional: pass current step text for reading aloud
}

const VoiceAssistant = ({ onClose, onCommand, currentStepText }: VoiceAssistantProps) => {
  const [waveformHeights, setWaveformHeights] = useState<number[]>(
    Array(9).fill(20).map(() => Math.random() * 60 + 20)
  );

  // Real voice recognition using Web Speech API
  const {
    isListening,
    isSupported: voiceSupported,
    transcript,
    startListening,
    stopListening,
    toggleListening
  } = useVoiceCommands({
    onCommand: (command) => {
      // Parse voice commands
      const lowerCommand = command.toLowerCase();
      if (lowerCommand.includes("next") || lowerCommand.includes("forward")) {
        onCommand("next");
        onClose();
      } else if (lowerCommand.includes("previous") || lowerCommand.includes("back")) {
        onCommand("previous");
        onClose();
      } else if (lowerCommand.includes("timer") || lowerCommand.includes("start")) {
        onCommand("timer");
        onClose();
      } else if (lowerCommand.includes("stop") || lowerCommand.includes("pause")) {
        onCommand("stop");
        onClose();
      } else if (lowerCommand.includes("read") || lowerCommand.includes("repeat")) {
        onCommand("read");
      } else if (lowerCommand.includes("substitute") || lowerCommand.includes("replace")) {
        onCommand("substitute");
      }
    }
  });

  // Text-to-speech for reading steps aloud
  const { speak, stop: stopSpeaking, isSupported: ttsSupported, isSpeaking } = useSpeechSynthesis();
  const [isSpeakingState, setIsSpeakingState] = useState(false);

  // Start listening on mount
  useEffect(() => {
    if (voiceSupported) {
      startListening();
    }
    return () => {
      stopListening();
      stopSpeaking();
    };
  }, [voiceSupported, startListening, stopListening, stopSpeaking]);

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

  // Track speaking state
  useEffect(() => {
    const checkSpeaking = setInterval(() => {
      setIsSpeakingState(isSpeaking());
    }, 100);
    return () => clearInterval(checkSpeaking);
  }, [isSpeaking]);

  const handleToggleListening = () => {
    toggleListening();
  };

  const handleQuickCommand = (command: string) => {
    if (command === "read" && currentStepText) {
      speak(currentStepText);
    } else {
      onCommand(command);
      if (command !== "read") {
        onClose();
      }
    }
  };

  const handleReadStep = () => {
    if (isSpeakingState) {
      stopSpeaking();
    } else if (currentStepText) {
      speak(currentStepText);
    }
  };

  // Highlight recognized keywords in transcript
  const highlightedWords = ["next", "step", "timer", "start", "stop", "read", "previous", "back"];

  const renderTranscript = () => {
    if (!transcript) {
      return <span className="text-white/50">Listening...</span>;
    }

    const words = transcript.split(" ");
    return words.map((word, index) => {
      const cleanWord = word.toLowerCase().replace(/[.,!?]/g, "");
      const isHighlighted = highlightedWords.includes(cleanWord);
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
          <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-primary animate-pulse' : 'bg-white/30'}`} />
          <span className={`text-sm font-medium tracking-wider ${isListening ? 'text-primary' : 'text-white/50'}`}>
            {isListening ? 'LISTENING' : 'PAUSED'}
          </span>
        </div>

        {/* Read Step Button */}
        {ttsSupported && currentStepText && (
          <button
            onClick={handleReadStep}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center"
          >
            {isSpeakingState ? (
              <VolumeX className="w-6 h-6 text-secondary" />
            ) : (
              <Volume2 className="w-6 h-6 text-white/60" />
            )}
          </button>
        )}

        {(!ttsSupported || !currentStepText) && (
          <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-white/60" />
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Live Transcript Label */}
        <p className="text-white/50 text-sm tracking-widest uppercase mb-6">
          {voiceSupported ? 'LIVE TRANSCRIPT' : 'VOICE NOT SUPPORTED'}
        </p>

        {/* Transcript Display */}
        <div className="text-center mb-12 min-h-[80px]">
          <p className="text-4xl font-bold leading-tight">
            "{renderTranscript()}"
          </p>
        </div>

        {/* Browser Support Warning */}
        {!voiceSupported && (
          <div className="bg-secondary/20 rounded-lg px-4 py-3 mb-6 text-center">
            <p className="text-secondary text-sm">
              Voice recognition not supported in this browser. Use Chrome or Edge for best experience.
            </p>
          </div>
        )}

        {/* Quick Command Suggestions */}
        <div className="w-full max-w-sm">
          <p className="text-white/50 text-sm text-center mb-4">
            {voiceSupported ? 'Try saying:' : 'Tap a command:'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => handleQuickCommand("next")}
              className="flex items-center gap-2 bg-white/10 rounded-full px-5 py-3 text-white/90 text-sm hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-primary" />
              Next Step
            </button>
            <button
              onClick={() => handleQuickCommand("timer")}
              className="flex items-center gap-2 bg-white/10 rounded-full px-5 py-3 text-white/90 text-sm hover:bg-white/20 transition-colors"
            >
              <Timer className="w-4 h-4 text-secondary" />
              Start Timer
            </button>
            <button
              onClick={() => handleQuickCommand("previous")}
              className="flex items-center gap-2 bg-white/10 rounded-full px-5 py-3 text-white/90 text-sm hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-white/60 rotate-180" />
              Previous Step
            </button>
            {currentStepText && ttsSupported && (
              <button
                onClick={handleReadStep}
                className="flex items-center gap-2 bg-white/10 rounded-full px-5 py-3 text-white/90 text-sm hover:bg-white/20 transition-colors"
              >
                <Volume2 className="w-4 h-4 text-primary" />
                {isSpeakingState ? 'Stop Reading' : 'Read Step'}
              </button>
            )}
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
              className={`w-2 rounded-full transition-all duration-150 ${isListening ? 'bg-primary' : 'bg-white/20'}`}
              style={{ height: `${isListening ? height : 20}px` }}
            />
          ))}
        </div>

        {/* Mic Button */}
        <button
          onClick={handleToggleListening}
          disabled={!voiceSupported}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${!voiceSupported
              ? 'bg-white/10 cursor-not-allowed'
              : isListening
                ? "bg-primary shadow-[0_0_40px_rgba(76,175,80,0.4)]"
                : "bg-white/20 hover:bg-white/30"
            }`}
        >
          <Mic className={`w-8 h-8 ${isListening ? "text-white" : "text-white/60"}`} />
        </button>

        <p className="text-white/50 text-sm mt-4">
          {!voiceSupported
            ? "Voice not supported in this browser"
            : isListening
              ? "Tap to stop listening"
              : "Tap to start listening"
          }
        </p>
      </div>
    </div>
  );
};

export default VoiceAssistant;
