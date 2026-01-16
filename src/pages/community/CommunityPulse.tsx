import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  MoreHorizontal,
  Users,
  Flame,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Play,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCommunity } from "@/hooks/useCommunity";
import { useUser } from "@/hooks/useUser";

const CommunityPulse = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { tips, addTip, toggleUpvote } = useCommunity(user.profile.name);
  const [isFavorite, setIsFavorite] = useState(false);

  // Dialog State
  const [isTipDialogOpen, setIsTipDialogOpen] = useState(false);
  const [newTipText, setNewTipText] = useState("");

  const handleAddTip = () => {
    if (newTipText.trim()) {
      addTip(newTipText);
      setNewTipText("");
      setIsTipDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-foreground/80 flex flex-col">
      {/* Header with recipe image background */}
      <div className="h-48 bg-gradient-to-b from-foreground/90 to-foreground/80 relative">
        {/* Nav */}
        <div className="screen-padding py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-foreground/50 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-10 h-10 rounded-full bg-foreground/50 flex items-center justify-center"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-white text-white" : "text-white"}`} />
            </button>
            <button className="w-10 h-10 rounded-full bg-foreground/50 flex items-center justify-center">
              <MoreHorizontal className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="flex-1 bg-background rounded-t-[32px] -mt-8 relative">
        {/* Handle */}
        <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto mt-3 mb-6" />

        <div className="screen-padding pb-24">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-page-title text-foreground">Community Pulse</h1>
            <div className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-full">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-caption text-foreground font-medium">Live</span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 bg-card rounded-lg p-4 shadow-card">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-5 h-5 text-secondary" />
                <span className="text-caption text-muted-foreground">Cooks this week</span>
              </div>
              <p className="text-page-title text-foreground">124</p>
            </div>
            <div className="flex-1 bg-card rounded-lg p-4 shadow-card">
              <div className="flex items-center gap-2 mb-1">
                <RotateCcw className="w-5 h-5 text-secondary" />
                <span className="text-caption text-muted-foreground">Made again</span>
              </div>
              <p className="text-page-title text-foreground">98%</p>
            </div>
          </div>

          {/* Community Tips */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-caption text-primary uppercase tracking-wider font-semibold">
                COMMUNITY INSIGHTS
              </span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
              {tips.map((tip) => (
                <div
                  key={tip.id}
                  className="min-w-[280px] bg-card rounded-lg p-4 shadow-card border border-border"
                >
                  <span
                    className={`inline-block px-2 py-1 rounded text-caption font-medium mb-2 ${tip.upvotes > 20
                      ? "bg-secondary/10 text-secondary"
                      : "bg-primary/10 text-primary"
                      }`}
                  >
                    {tip.upvotes > 20 ? "MOST POPULAR" : "COMMUNITY TIP"}
                  </span>
                  <h3 className="text-card-title text-foreground mb-2">{tip.author} says:</h3>
                  <p className="text-body text-muted-foreground mb-4 line-clamp-3">{tip.text}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-caption text-muted-foreground">
                      {tip.timestamp}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleUpvote(tip.id)}
                        className={`flex items-center gap-1 ${tip.isUpvoted ? 'text-primary' : 'text-muted-foreground'}`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${tip.isUpvoted ? 'fill-primary' : ''}`} />
                        <span className="text-caption">{tip.upvotes}</span>
                      </button>
                      <button className="text-muted-foreground">
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add your own tip */}
          <button
            onClick={() => setIsTipDialogOpen(true)}
            className="w-full py-4 border-2 border-dashed border-border rounded-lg flex items-center justify-center gap-2 text-muted-foreground hover:bg-muted/50 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-card-title">Add your own tip</span>
          </button>
        </div>

        {/* Start Cooking Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-background screen-padding pb-8 pt-4 border-t border-border">
          <Button
            onClick={() => navigate("/cooking-step")}
            className="w-full h-14 rounded-button bg-primary hover:bg-primary/90 text-primary-foreground text-card-title flex items-center justify-center gap-2"
          >
            Start Cooking
            <Play className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Add Tip Dialog */}
      {isTipDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-sm rounded-xl p-6 shadow-xl animate-scale-in">
            <h2 className="text-section-title font-semibold mb-4">Share a Tip</h2>
            <textarea
              value={newTipText}
              onChange={(e) => setNewTipText(e.target.value)}
              className="w-full p-3 rounded-lg border border-border bg-background min-h-[100px] mb-4"
              placeholder="E.g., Save your veggie scraps for broth..."
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setIsTipDialogOpen(false)}
                className="flex-1 py-3 bg-muted font-medium rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTip}
                disabled={!newTipText.trim()}
                className="flex-1 py-3 bg-primary text-primary-foreground font-medium rounded-lg disabled:opacity-50"
              >
                Post Tip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPulse;
