import { Calendar, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PnLHeader() {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Profit & Loss Report
        </h1>
        <p className="text-muted-foreground mt-1">
          Financial performance across all locations
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="gap-2">
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Dec 2024</span>
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
        <Button size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </div>
    </header>
  );
}
