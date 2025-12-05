import { cn } from "@/lib/utils";
import { LayoutDashboard, Building2 } from "lucide-react";

export type ViewMode = "overview" | "locations";

interface ViewToggleProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function ViewToggle({ activeView, onViewChange }: ViewToggleProps) {
  return (
    <div className="inline-flex items-center rounded-lg bg-muted p-1 animate-fade-in">
      <button
        onClick={() => onViewChange("overview")}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all",
          activeView === "overview"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <LayoutDashboard className="h-4 w-4" />
        Overview
      </button>
      <button
        onClick={() => onViewChange("locations")}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all",
          activeView === "locations"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Building2 className="h-4 w-4" />
        Locations
      </button>
    </div>
  );
}
