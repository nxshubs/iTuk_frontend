import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarHeaderProps {
  viewMode: "month" | "week" | "day";
  currentDate: Date;
  selectedWeek: Date | null;
  selectedDay: Date | null;
  monthNames: string[];
  formatDate: (date: Date) => string;
  formatWeekRange: (startDate: Date) => string;
  handleNavigation: (direction: "prev" | "next") => void;
}

export const CalendarHeader = ({ viewMode, currentDate, selectedWeek, selectedDay, monthNames, formatDate, formatWeekRange, handleNavigation }: CalendarHeaderProps) => {
  const isSelectedWeek = viewMode === "week" && selectedWeek;
  const isSelectedDay = viewMode === "day" && selectedDay;

  return (
    <CardHeader className="pb-2 sm:pb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="truncate">
            {viewMode === "month" ? (
              `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
            ) : isSelectedWeek ? (
              <span className="hidden sm:inline">{formatWeekRange(selectedWeek)}</span>
            ) : isSelectedDay ? (
              <span className="hidden sm:inline">{formatDate(selectedDay)}</span>
            ) : null}
          </span>
        </CardTitle>
        <div className="flex gap-1 sm:gap-2">
          <Button variant="outline" size="sm" onClick={() => handleNavigation("prev")}>
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleNavigation("next")}>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};