import { UserProfileData } from "@/app/(private)/dashboard/provider/profile/page";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface Props {
    profileData: UserProfileData | null
}

export default function Avaliability({ profileData }: Props) {
    const daysOfWeek = [
        "Domingo",
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado"
    ];

    const sortedAvailability = profileData?.availability?.sort((a, b) => a.dayOfWeek - b.dayOfWeek);

    return (
        <Card>
            <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Horário de Funcionamento</h2>
                <div className="space-y-2">
                    {sortedAvailability && sortedAvailability.length > 0 ? (
                        sortedAvailability.map((slot) => (
                            <div key={slot.id} className="flex items-center text-muted-foreground">
                                <Clock className="w-4 h-4 mr-3 flex-shrink-0" />
                                <div className="flex justify-between w-full">
                                    <span>{daysOfWeek[slot.dayOfWeek]}</span>
                                    <span>{`${slot.startTime} - ${slot.endTime}`}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center text-muted-foreground">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>Sem horários disponíveis por enquanto.</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

