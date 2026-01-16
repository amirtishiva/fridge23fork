import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const [selectedPreferences, setSelectedPreferences] = useState<string[]>(["Vegan"]);

    const preferences = [
        "Vegan", "Gluten-free", "Vegetarian",
        "Keto", "Dairy-free", "Quick Meals"
    ];

    const handleTogglePreference = (pref: string) => {
        setSelectedPreferences(prev =>
            prev.includes(pref)
                ? prev.filter(p => p !== pref)
                : [...prev, pref]
        );
    };

    const handleSignup = () => {
        // Navigate to onboarding or home
        navigate("/onboarding");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col screen-padding animate-slide-up pb-8">
            {/* Scrollable Content Container */}
            <div className="flex-1 flex flex-col pt-12">

                {/* Title & Subtitle */}
                <h1 className="text-3xl font-bold text-foreground text-left mb-3">
                    Join the movement
                </h1>
                <p className="text-body text-muted-foreground text-left mb-8 max-w-sm">
                    Save money, eat better, and help reduce global food waste starting today.
                </p>

                {/* Form */}
                <div className="w-full max-w-sm space-y-5 mb-8">

                    {/* Full Name */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-foreground">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground/60" />
                            <Input
                                type="text"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                className="pl-12 h-14 rounded-xl border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-foreground">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground/60" />
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                className="pl-12 h-14 rounded-xl border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* Create Password */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-foreground">Create Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground/60" />
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                className="pl-12 h-14 rounded-xl border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* Initial Preferences */}
                    <div className="space-y-3 pt-2">
                        <label className="text-sm font-semibold text-foreground">Initial Preferences</label>
                        <div className="flex flex-wrap gap-3">
                            {preferences.map((pref) => {
                                const isSelected = selectedPreferences.includes(pref);
                                return (
                                    <button
                                        key={pref}
                                        onClick={() => handleTogglePreference(pref)}
                                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${isSelected
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "bg-card border border-border text-foreground hover:bg-muted"
                                            }`}
                                    >
                                        {pref}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                </div>

                {/* Create Account Button */}
                <div className="w-full max-w-sm mb-8">
                    <Button
                        onClick={handleSignup}
                        className="w-full h-14 rounded-button bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold shadow-sm"
                    >
                        Create Account
                    </Button>
                </div>



                {/* Sign In Link */}
                <p className="text-sm text-center text-muted-foreground pb-8">
                    Already have an account?{" "}
                    <button
                        onClick={() => navigate("/login")}
                        className="text-foreground font-bold hover:underline"
                    >
                        Sign In
                    </button>
                </p>

            </div>
        </div>
    );
};

export default Signup;
