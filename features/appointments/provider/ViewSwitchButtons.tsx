import { Button } from "@/components/ui/button";

interface ViewSwitchButtonsProps {
  viewMode: "month" | "week" | "day";
  setViewMode: (mode: "month" | "week" | "day") => void;
  handleTodayClick: () => void;
}

export const ViewSwitchButtons = ({ viewMode, setViewMode, handleTodayClick }: ViewSwitchButtonsProps) => (
  <div className="flex gap-1 sm:gap-2">
    <Button
      variant={viewMode === "month" ? "default" : "outline"}
      onClick={() => setViewMode("month")}
      size="sm"
      className="text-xs sm:text-sm"
    >
      Mês
    </Button>
    <Button
      variant={viewMode === "week" ? "default" : "outline"}
      onClick={() => setViewMode("week")}
      size="sm"
      className="text-xs sm:text-sm"
    >
      Semana
    </Button>
    <Button
      variant={viewMode === "day" ? "default" : "outline"}
      onClick={() => setViewMode("day")}
      size="sm"
      className="text-xs sm:text-sm"
    >
      Dia
    </Button>
  </div>
);