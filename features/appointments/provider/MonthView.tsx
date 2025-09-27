
interface MonthViewProps {
  currentDate: Date;
  days: (number | null)[];
  weekDays: string[];
  isToday: (day: number) => boolean;
  getAppointmentsForDate: (date: Date) => any[];
  handleDayClick: (day: number) => void;
  getStatusColor: (status: string) => string;
  handleAppointmentClick: (appointment: any) => void;
}


export const MonthView = ({ currentDate, days, weekDays, isToday, getAppointmentsForDate, handleDayClick, getStatusColor, handleAppointmentClick }: MonthViewProps) => (
  <>
    <div className="grid grid-cols-7 gap-1 mb-2 sm:mb-4">
      {weekDays.map((day) => (
        <div
          key={day}
          className="p-1 sm:p-2 text-center text-xs sm:text-sm font-medium text-muted-foreground border-b"
        >
          {day}
        </div>
      ))}
    </div>
    <div className="grid grid-cols-7 gap-1">
      {days.map((day, index) => {
        const dayAppointments = day
          ? getAppointmentsForDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
          : []
        return (
          <div
            key={index}
            onClick={() => day && handleDayClick(day)}
            className={`min-h-[60px] sm:min-h-[80px] lg:min-h-[100px] p-1 sm:p-2 border rounded-lg cursor-pointer transition-colors ${day
              ? `bg-background hover:bg-muted/50 ${isToday(day) ? "ring-2 ring-[#FC9056] bg-[#FC9056]/5" : ""
              }`
              : "bg-muted/20"
              }`}
          >
            {day && (
              <>
                <div
                  className={`text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${isToday(day) ? "text-[#FC9056] font-bold" : "text-foreground"
                    }`}
                >
                  {day}
                </div>
                <div className="space-y-1">
                  {dayAppointments.slice(0, 2).map((appointment) => (
                    <div
                      key={appointment.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAppointmentClick(appointment)
                      }}
                      className={`p-1 rounded text-xs cursor-pointer transition-colors ${getStatusColor(appointment.status)}`}
                    >
                      <div className="font-medium truncate">
                        <span className="hidden sm:inline">{appointment.time} - </span>
                        {appointment.clientName}
                      </div>
                    </div>
                  ))}
                  {dayAppointments.length > 2 && (
                    <div className="text-xs text-muted-foreground text-center py-1">
                      +{dayAppointments.length - 2}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  </>
);