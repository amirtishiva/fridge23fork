import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Settings, Plus, MoreHorizontal, Calendar, ShoppingCart, Refrigerator, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListItemSkeleton } from "@/components/ui/skeleton";
import { useShoppingList } from "@/hooks/useShoppingList";
import { useToast } from "@/hooks/use-toast";
import { usePantry } from "@/hooks/usePantry";


interface PantryItem {
  id: string;
  name: string;
  quantity: string;
  expiry: string;
  status: "full" | "low" | "empty";
  image: string;
  category: string;
}



const categories = ["All", "Grains", "Spices", "Oils", "Baking"];

const MyPantry = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const { items: pantryItems, removeItem } = usePantry();
  const { addItem, isInList, totalCount } = useShoppingList();
  const { toast } = useToast();

  const handleAddToList = (item: PantryItem) => {
    if (isInList(item.name)) {
      toast({
        title: "Already in list",
        description: `${item.name} is already on your shopping list.`,
      });
      return;
    }
    addItem({
      name: item.name,
      quantity: item.quantity === "Refill needed" ? "1 unit" : item.quantity,
      source: "Pantry",
      category: "outOfStock",
    });
    toast({
      title: "Added to list",
      description: `${item.name} added to your shopping list.`,
    });
  };

  useEffect(() => {
    // Simulate loading pantry data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const groupedItems = pantryItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, PantryItem[]>);

  const getStatusBadge = (status: PantryItem["status"]) => {
    switch (status) {
      case "full":
        return <span className="text-primary text-sm font-medium">● Full</span>;
      case "low":
        return <span className="text-destructive text-sm font-medium">▲ Low</span>;
      case "empty":
        return <span className="text-muted-foreground text-sm">Empty</span>;
    }
  };

  return (
    <div className="h-screen w-full overflow-y-auto bg-background pb-40 hide-scrollbar">
      {/* Header */}
      <div className="screen-padding py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Refrigerator className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-section-title text-foreground font-bold">My Pantry</h1>
          </div>
          <button className="p-2 hover:bg-muted rounded-full transition-colors">
            <Settings className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>

        {/* Search */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search pantry staples..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-xl bg-card border-border"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium ${activeCategory === category
                ? "bg-foreground text-background"
                : "bg-card text-muted-foreground border border-border hover:border-primary/50"
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Pantry Items */}
      <div className="screen-padding space-y-6">
        {isLoading ? (
          // Skeleton loading state
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <div className="shimmer h-4 w-32 rounded" />
              <div className="shimmer h-4 w-16 rounded" />
            </div>
            {[...Array(4)].map((_, i) => (
              <ListItemSkeleton key={i} />
            ))}
          </div>
        ) : (
          Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-caption text-muted-foreground uppercase tracking-wider font-medium">
                  {category.toUpperCase()}
                </h2>
                <span className="text-primary text-sm font-medium">
                  {items.length} items
                </span>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`bg-card rounded-xl p-4 shadow-card transition-all duration-200 hover:shadow-floating hover:-translate-y-0.5 animate-slide-up ${item.status === "low" ? "border-2 border-secondary" : ""
                      }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-3xl">
                        {item.image}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-card-title text-foreground font-semibold">
                              {item.name}
                            </h3>
                            <p className="text-caption text-muted-foreground">
                              {item.quantity}
                            </p>
                          </div>
                          {getStatusBadge(item.status)}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          {item.status === "empty" ? (
                            <button
                              onClick={() => handleAddToList(item)}
                              className={`flex items-center gap-1 text-sm font-medium transition-colors ${isInList(item.name)
                                ? "text-primary/60"
                                : "text-primary hover:text-primary/80"
                                }`}
                            >
                              {isInList(item.name) ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  IN LIST
                                </>
                              ) : (
                                <>
                                  <ShoppingCart className="w-4 h-4" />
                                  ADD TO LIST
                                </>
                              )}
                            </button>
                          ) : item.status === "low" ? (
                            <button
                              onClick={() => handleAddToList(item)}
                              className={`flex items-center gap-1 text-sm font-medium transition-colors ${isInList(item.name)
                                ? "text-secondary/60"
                                : "text-secondary hover:text-secondary/80"
                                }`}
                            >
                              {isInList(item.name) ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  IN LIST
                                </>
                              ) : (
                                <>
                                  <ShoppingCart className="w-4 h-4" />
                                  ADD TO LIST
                                </>
                              )}
                            </button>
                          ) : item.expiry ? (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>Exp: {item.expiry}</span>
                            </div>
                          ) : null}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="hover:bg-muted rounded-full p-1 transition-colors">
                                <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => toast({ title: "Edit feature coming soon" })}>
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => removeItem(item.id)}>
                                Delete Item
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        {/* End Message */}
        {!isLoading && (
          <div className="flex flex-col items-center py-6 text-muted-foreground">
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mb-2">
              📦
            </div>
            <p className="text-sm">That's all in Grains & Spices</p>
          </div>
        )}
      </div>

      {/* Shopping List Quick Access */}
      <div className="screen-padding mb-4">
        <button
          onClick={() => navigate("/shopping-list")}
          className="w-full bg-secondary/10 border-2 border-dashed border-secondary rounded-xl p-4 flex items-center justify-center gap-3 hover:bg-secondary/20 transition-all"
        >
          <ShoppingCart className="w-5 h-5 text-secondary" />
          <span className="text-secondary font-medium">View Shopping List</span>
          <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs font-bold">{totalCount}</span>
        </button>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => toast({ title: "Add item feature coming soon" })}
        className="fixed bottom-24 right-4 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary-hover hover:scale-105 active:scale-95 transition-all"
        aria-label="Add new pantry item"
      >
        <Plus className="w-6 h-6 text-primary-foreground" />
      </button>

    </div>
  );
};

export default MyPantry;
