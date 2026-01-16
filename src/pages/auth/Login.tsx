import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import fridgeIcon from "@/assets/fridge-icon.png";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        // Navigate to home for demo purposes
        navigate("/home");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col screen-padding animate-slide-up">
            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center pt-8 pb-8">

                {/* Fridge Icon Image */}
                <div className="w-24 h-24 mb-6 rounded-2xl bg-surface-secondary/50 p-3 flex items-center justify-center">
                    {/* Using a placeholder or the existing asset if it matches the green fridge look, 
                otherwise styling to match the image's aesthetic */}
                    <img
                        src={fridgeIcon}
                        alt="FridgeAI"
                        className="w-full h-full object-contain mix-blend-multiply opacity-90"
                    />
                </div>

                {/* Title & Subtitle */}
                <h1 className="text-3xl font-bold text-foreground text-center mb-2">
                    Welcome back
                </h1>
                <p className="text-body text-muted-foreground text-center mb-10">
                    Good to see you again!
                </p>

                {/* Form */}
                <div className="w-full max-w-sm space-y-5 mb-8">
                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-foreground">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground/60" />
                            <Input
                                type="email"
                                placeholder="example@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-12 h-14 rounded-xl border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-foreground">Password</label>
                            <button
                                className="text-sm font-medium text-primary hover:text-primary-hover"
                                onClick={() => { }}
                            >
                                Forgot password?
                            </button>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground/60" />
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-12 pr-12 h-14 rounded-xl border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sign In Button */}
                <div className="w-full max-w-sm mb-8">
                    <Button
                        onClick={handleLogin}
                        className="w-full h-14 rounded-button bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold shadow-sm"
                    >
                        Sign In
                    </Button>
                </div>



                {/* Sign Up Link */}
                <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <button
                        onClick={() => navigate("/signup")}
                        className="text-primary font-semibold hover:underline"
                    >
                        Sign Up
                    </button>
                </p>

            </div>
        </div>
    );
};

export default Login;
