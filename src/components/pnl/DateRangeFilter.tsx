import { useState } from "react";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type DatePreset = "today" | "this_week" | "this_month" | "this_year" | "custom";

export interface DateRange {
  from: Date;
  to: Date;
}

interface DateRangeFilterProps {
  onDateRangeChange: (range: DateRange, preset: DatePreset) => void;
}

const presets: { label: string; value: DatePreset }[] = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "this_week" },
  { label: "This Month", value: "this_month" },
  { label: "This Year", value: "this_year" },
  { label: "Custom Range", value: "custom" },
];

const getPresetDateRange = (preset: DatePreset): DateRange => {
  const now = new Date();
  switch (preset) {
    case "today":
      return { from: startOfDay(now), to: endOfDay(now) };
    case "this_week":
      return { from: startOfWeek(now, { weekStartsOn: 1 }), to: endOfWeek(now, { weekStartsOn: 1 }) };
    case "this_month":
      return { from: startOfMonth(now), to: endOfMonth(now) };
    case "this_year":
      return { from: startOfYear(now), to: endOfYear(now) };
    default:
      return { from: startOfMonth(now), to: endOfMonth(now) };
  }
};

export function DateRangeFilter({ onDateRangeChange }: DateRangeFilterProps) {
  const [selectedPreset, setSelectedPreset] = useState<DatePreset>("this_month");
  const [dateRange, setDateRange] = useState<DateRange>(getPresetDateRange("this_month"));
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const handlePresetSelect = (preset: DatePreset) => {
    if (preset === "custom") {
      setShowCustomPicker(true);
      return;
    }
    
    setShowCustomPicker(false);
    const range = getPresetDateRange(preset);
    setSelectedPreset(preset);
    setDateRange(range);
    onDateRangeChange(range, preset);
    setIsOpen(false);
  };

  const handleCustomDateSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (range?.from && range?.to) {
      const newRange = { from: range.from, to: range.to };
      setDateRange(newRange);
      setSelectedPreset("custom");
      onDateRangeChange(newRange, "custom");
    } else if (range?.from) {
      setDateRange({ ...dateRange, from: range.from });
    }
  };

  const getDisplayText = () => {
    if (selectedPreset !== "custom") {
      return presets.find(p => p.value === selectedPreset)?.label || "Select Date";
    }
    return `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={cn(
            "gap-2 min-w-[180px] justify-between",
            "bg-card border-border hover:bg-muted"
          )}
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{getDisplayText()}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 bg-card border-border z-50" 
        align="end"
      >
        <div className="flex">
          {/* Preset Options */}
          <div className="border-r border-border p-2 space-y-1 min-w-[140px]">
            <p className="text-xs font-medium text-muted-foreground px-2 py-1.5 uppercase tracking-wider">
              Quick Select
            </p>
            {presets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handlePresetSelect(preset.value)}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
                  selectedPreset === preset.value && preset.value !== "custom"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Custom Date Picker */}
          {showCustomPicker && (
            <div className="p-3">
              <Calendar
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={handleCustomDateSelect}
                numberOfMonths={2}
                className="pointer-events-auto"
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-sm font-medium text-foreground",
                  nav: "space-x-1 flex items-center",
                  nav_button: cn(
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                    "text-foreground hover:bg-muted rounded-md"
                  ),
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                  day: cn(
                    "h-9 w-9 p-0 font-normal",
                    "hover:bg-muted rounded-md transition-colors",
                    "text-foreground"
                  ),
                  day_range_start: "day-range-start bg-primary text-primary-foreground rounded-l-md",
                  day_range_end: "day-range-end bg-primary text-primary-foreground rounded-r-md",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "text-muted-foreground opacity-50",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_range_middle: "bg-accent/50 text-foreground",
                  day_hidden: "invisible",
                }}
              />
              <div className="flex justify-end gap-2 pt-3 border-t border-border mt-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setShowCustomPicker(false);
                    setIsOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  onClick={() => {
                    setIsOpen(false);
                    setShowCustomPicker(false);
                  }}
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
