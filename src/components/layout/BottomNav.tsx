import { Home, Refrigerator, Book, User, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/home", icon: Home, label: "Home" },
    { path: "/my-pantry", icon: Refrigerator, label: "Fridge" },
    { path: "/scan", icon: Plus, label: "Scan", isCenter: true },
    { path: "/my-collection", icon: Book, label: "Recipes" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  const isActive = (path: string) => {
    if (path === "/my-collection" && location.pathname === "/cooked-history") return true;
    if (path === "/my-pantry" && location.pathname === "/shopping-list") return true;
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          if (item.isCenter) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex items-center justify-center w-12 h-12 bg-primary rounded-full -mt-6 shadow-lg active:scale-95 transition-transform"
              >
                <item.icon className="w-6 h-6 text-primary-foreground" />
              </button>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 p-2 transition-colors ${isActive(item.path) ? "text-primary" : "text-muted-foreground"
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span className={`text-xs ${isActive(item.path) ? "font-medium" : ""}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
