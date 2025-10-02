import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Service } from "@/types/Service";
import { DollarSign, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
    services: Service[];
    onAddService: (newService: Omit<Service, 'id'>) => void;
    onRemoveService: (serviceId: string) => void;
    onUpdateService: (serviceId: string, updatedFields: Partial<Service>) => void;
}

export default function Services({ services, onAddService, onRemoveService, onUpdateService }: Props) {
    const [newServiceName, setNewServiceName] = useState("");
    const [newServicePrice, setNewServicePrice] = useState("");
    const [newServiceDuration, setNewServiceDuration] = useState("");

    const handleAddClick = () => {
        if (!newServiceName.trim() || !newServicePrice || !newServiceDuration) {
            toast.info("Por favor, preencha nome, preço e duração do novo serviço.");
            return;
        }
        onAddService({
            name: newServiceName,
            price: parseFloat(newServicePrice),
            durationInMinutes: parseInt(newServiceDuration, 10),
            description: ""
        });
        setNewServiceName("");
        setNewServicePrice("");
        setNewServiceDuration("");
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Serviços Oferecidos
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Formulário para adicionar novo serviço */}
                <div className="p-4 border rounded-lg space-y-3">
                    <h4 className="font-medium text-sm">Adicionar Novo Serviço</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <Label htmlFor="new-service-name" className="text-xs">Nome</Label>
                            <Input id="new-service-name" value={newServiceName} onChange={(e) => setNewServiceName(e.target.value)} placeholder="Ex: Limpeza Geral" />
                        </div>
                        <div>
                            <Label htmlFor="new-service-price" className="text-xs">Preço (R$)</Label>
                            <Input id="new-service-price" type="number" value={newServicePrice} onChange={(e) => setNewServicePrice(e.target.value)} placeholder="80" />
                        </div>
                        <div>
                            <Label htmlFor="new-service-duration" className="text-xs">Duração (min)</Label>
                            <Input id="new-service-duration" type="number" value={newServiceDuration} onChange={(e) => setNewServiceDuration(e.target.value)} placeholder="60" />
                        </div>
                    </div>
                    <Button onClick={handleAddClick} size="sm" className="w-full md:w-auto">
                        <Plus className="w-4 h-4 mr-2" /> Adicionar Serviço
                    </Button>
                </div>

                {/* Lista de serviços existentes */}
                <div className="space-y-4">
                    {services.map((service) => (
                        <div key={service.id} className="p-4 border rounded-lg space-y-3">
                            <div className="flex justify-between items-start">
                                <h4 className="font-medium">{service.name}</h4>
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500 h-8 w-8" onClick={() => onRemoveService(service.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor={`price-${service.id}`} className="text-xs">Preço (R$)</Label>
                                    <Input
                                        id={`price-${service.id}`}
                                        type="number"
                                        value={service.price}
                                        onChange={(e) => onUpdateService(service.id, { price: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`duration-${service.id}`} className="text-xs">Duração (min)</Label>
                                    <Input
                                        id={`duration-${service.id}`}
                                        type="number"
                                        value={service.durationInMinutes}
                                        onChange={(e) => onUpdateService(service.id, { durationInMinutes: parseInt(e.target.value, 10) || 0 })}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor={`description-${service.id}`} className="text-xs">Descrição (Opcional)</Label>
                                <Textarea
                                    id={`description-${service.id}`}
                                    value={service.description ?? ''}
                                    onChange={(e) => onUpdateService(service.id, { description: e.target.value })}
                                    placeholder="Descreva este serviço específico..."
                                    rows={2}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

