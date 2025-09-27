import { Button } from "@/components/ui/button";
import { Clock, Plus } from "lucide-react";

interface WeekViewProps {
  selectedWeek: Date;
  weekDays: string[];
  weekDaysFull: string[];
  monthNames: string[];
  getWeekDays: (date: Date) => Date[];
  getAppointmentsForDate: (date: Date) => any[];
  getWorkingHoursForDate: (date: Date) => string[];
  getAppointmentForHour: (date: Date, hour: string) => any | undefined;
  isFirstHourOfAppointment: (date: Date, hour: string, appointment: any) => boolean;
  getAppointmentDuration: (appointment: any) => number;
  isTodayDate: (date: Date) => boolean;
  getStatusColor: (status: string) => string;
  handleAppointmentClick: (appointment: any) => void;
  handleWeekDayClick: (date: Date) => void;
  handleCreateAppointment: (date: Date, hour: string) => void;
}


export const WeekView = ({ selectedWeek, weekDays, weekDaysFull, monthNames, getWeekDays, getAppointmentsForDate, getWorkingHoursForDate, getAppointmentForHour, isFirstHourOfAppointment, getAppointmentDuration, isTodayDate, getStatusColor, handleAppointmentClick, handleWeekDayClick, handleCreateAppointment }: WeekViewProps) => {
  const weekDaysArray = getWeekDays(selectedWeek);
  const allWorkingHours = Array.from(new Set(weekDaysArray.flatMap((date) => getWorkingHoursForDate(date)))).sort();

  return (
    <>
      <div className="block sm:hidden">
        <div className="space-y-4">
          {weekDaysArray.map((date, index) => {
            const dayAppointments = getAppointmentsForDate(date);
            const workingHours = getWorkingHoursForDate(date);
            return (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div
                  onClick={() => handleWeekDayClick(date)}
                  className={`p-3 cursor-pointer transition-colors hover:bg-muted/50 ${isTodayDate(date) ? "bg-[#FC9056]/5 border-[#FC9056]" : "bg-muted/30"}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-sm font-medium ${isTodayDate(date) ? "text-[#FC9056]" : "text-muted-foreground"}`}>
                        {weekDaysFull[date.getDay()]}
                      </div>
                      <div className={`text-lg font-bold ${isTodayDate(date) ? "text-[#FC9056]" : "text-foreground"}`}>
                        {date.getDate()} de {monthNames[date.getMonth()]}
                      </div>
                      {workingHours.length === 0 && (
                        <div className="text-xs text-muted-foreground">Não trabalha</div>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {dayAppointments.length} agendamento{dayAppointments.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
                {dayAppointments.length > 0 && workingHours.length > 0 && (
                  <div className="p-3 space-y-2 bg-background">
                    {dayAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        onClick={() => handleAppointmentClick(appointment)}
                        className={`p-3 rounded cursor-pointer transition-all hover:shadow-md ${getStatusColor(appointment.status)}`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <div className="font-semibold text-sm">{appointment.clientName}</div>
                            <div className="text-xs opacity-90">{appointment.service}</div>
                          </div>
                          <div className="text-xs font-semibold">{appointment.price}</div>
                        </div>
                        <div className="flex items-center gap-2 text-xs opacity-90">
                          <Clock className="w-3 h-3" />
                          <span>{appointment.time} - {appointment.endTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="hidden sm:block overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-0 border rounded-lg overflow-hidden">
            <div className="p-3 border-r border-b bg-muted/30"></div>
            {weekDaysArray.map((date, index) => {
              const workingHours = getWorkingHoursForDate(date);
              return (
                <div
                  key={index}
                  onClick={() => handleWeekDayClick(date)}
                  className={`p-3 border-r last:border-r-0 border-b text-center cursor-pointer transition-colors hover:bg-muted/50 ${isTodayDate(date) ? "bg-[#FC9056]/5 border-[#FC9056]" : "bg-muted/30"} ${workingHours.length === 0 ? "opacity-50" : ""}`}
                >
                  <div className={`text-xs font-medium ${isTodayDate(date) ? "text-[#FC9056]" : "text-muted-foreground"}`}>
                    {weekDays[date.getDay()]}
                  </div>
                  <div className={`text-lg font-bold ${isTodayDate(date) ? "text-[#FC9056]" : "text-foreground"}`}>
                    {date.getDate()}
                  </div>
                  {workingHours.length === 0 && (
                    <div className="text-xs text-muted-foreground">Não trabalha</div>
                  )}
                </div>
              );
            })}
            {allWorkingHours.map((hour) => {
              const isCurrentHour = new Date().getHours() === Number.parseInt(hour.split(":")[0]);
              return (
                <div key={hour} className="contents">
                  <div className={`p-3 border-r border-b bg-muted/30 flex items-start ${isCurrentHour ? "bg-blue-50" : ""}`}>
                    <span className={`text-sm font-medium ${isCurrentHour ? "text-blue-600 font-bold" : "text-muted-foreground"}`}>
                      {hour}
                    </span>
                  </div>
                  {weekDaysArray.map((date, dayIndex) => {
                    const isWorkingHour = getWorkingHoursForDate(date).includes(hour);
                    const appointment = isWorkingHour ? getAppointmentForHour(date, hour) : null;
                    const isCurrentHourAndToday = isCurrentHour && isTodayDate(date);
                    const shouldRenderAppointment = appointment && isFirstHourOfAppointment(date, hour, appointment);
                    const appointmentDuration = appointment ? getAppointmentDuration(appointment) : 1;

                    return (
                      <div
                        key={dayIndex}
                        className={`p-2 border-r last:border-r-0 border-b min-h-[80px] relative ${isCurrentHourAndToday ? "bg-blue-50" : ""} ${!isWorkingHour ? "bg-muted/50" : ""}`}
                      >
                        {isWorkingHour ? (
                          shouldRenderAppointment ? (
                            <div
                              onClick={() => handleAppointmentClick(appointment)}
                              className={`absolute inset-x-2 top-2 p-2 rounded cursor-pointer transition-all hover:shadow-md text-xs z-10 ${getStatusColor(appointment.status)}`}
                              style={{
                                height:
                                  appointmentDuration === 1 ? "72px" : `${appointmentDuration * 80 - 8}px`,
                              }}
                            >
                              <div className="font-semibold truncate mb-1">{appointment.clientName}</div>
                              <div className="opacity-90 truncate text-xs">{appointment.service}</div>
                              <div className="opacity-90 text-xs mt-1">
                                {appointment.time} - {appointment.endTime}
                              </div>
                            </div>
                          ) : appointment ? (
                            <div className="h-full"></div>
                          ) : (
                            <div className="h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-foreground p-1 h-auto text-xs"
                                onClick={() => handleCreateAppointment(date, hour)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          )
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">Fora do horário</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};