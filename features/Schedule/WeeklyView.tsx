"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Plus, Trash2, Save, Loader2 } from "lucide-react"

interface WeeklySchedule {
  [key: number]: { start: string; end: string; id?: string; available: boolean; }[]
}

interface WeeklyViewProps {
  weeklySchedule: WeeklySchedule
  updateWeeklySchedule: (dayOfWeek: number, schedules: { start: string; end: string; available: boolean }[]) => void
  onSave: () => Promise<void>
  isSaving: boolean
}

const weekDaysFull = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]

export function WeeklyView({ weeklySchedule, updateWeeklySchedule, onSave, isSaving }: WeeklyViewProps) {
  
  const SaveButtonContent = () => (
    isSaving ? (
        <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Salvando...
        </>
    ) : (
        <>
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
        </>
    )
  );
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Horários Semanais Padrão
                </CardTitle>
                <p className="text-sm text-gray-600 font-poppins mt-1">Configure seus horários padrão para cada dia da semana.</p>
            </div>
            <Button onClick={onSave} disabled={isSaving} className="hidden sm:inline-flex">
                <SaveButtonContent />
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 font-poppins">
        {weekDaysFull.map((dayName, dayIndex) => {
          const daySchedules = weeklySchedule[dayIndex] || []

          return (
            <div key={dayIndex} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">{dayName}</h3>
                <Switch
                  className="font-poppins"
                  checked={daySchedules.length > 0}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateWeeklySchedule(dayIndex, [{ start: "09:00", end: "17:00", available: true }])
                    } else {
                      updateWeeklySchedule(dayIndex, [])
                    }
                  }}
                />
              </div>

              {daySchedules.length > 0 && (
                <div className="space-y-2">
                  {daySchedules.map((schedule, scheduleIndex) => (
                    <div key={scheduleIndex} className="flex items-center gap-2">
                      <Select
                        value={schedule.start}
                        onValueChange={(value) => {
                          const newSchedules = [...daySchedules]
                          newSchedules[scheduleIndex].start = value
                          updateWeeklySchedule(dayIndex, newSchedules)
                        }}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="font-poppins">
                          {Array.from({ length: 24 }, (_, i) => (
                            <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                              {`${i.toString().padStart(2, "0")}:00`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <span className="text-gray-500">até</span>

                      <Select
                        value={schedule.end}
                        onValueChange={(value) => {
                          const newSchedules = [...daySchedules]
                          newSchedules[scheduleIndex].end = value
                          updateWeeklySchedule(dayIndex, newSchedules)
                        }}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="font-poppins">
                          {Array.from({ length: 24 }, (_, i) => (
                            <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                              {`${i.toString().padStart(2, "0")}:00`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
      <CardFooter className="sm:hidden">
          <Button onClick={onSave} disabled={isSaving} className="w-full">
              <SaveButtonContent />
          </Button>
      </CardFooter>
    </Card>
  )
}

