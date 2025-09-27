import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, User } from "lucide-react"

export default function UpcomingAppointments() {
  const appointments = [
    {
      id: "1",
      clientName: "Ana Silva",
      service: "Limpeza Residencial",
      date: "2024-01-20",
      time: "09:00",
      status: "Confirmado",
    },
    {
      id: "2",
      clientName: "Carlos Santos",
      service: "Manutenção Elétrica",
      date: "2024-01-22",
      time: "14:00",
      status: "Confirmado",
    },
  ]

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <Card key={appointment.id}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center text-lg font-semibold">
                  <User className="w-5 h-5 mr-2 text-[#FC9056]" />
                  {appointment.clientName}
                </div>
                <p className="text-gray-600 font-poppins dark:text-gray-400">{appointment.service}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center font-poppins dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(appointment.date).toLocaleDateString("pt-BR")}
                  </div>
                  <div className="flex items-center font-poppins dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {appointment.time}
                  </div>
                </div>
              </div>
              <div className="text-right font-poppins">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {appointment.status}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
