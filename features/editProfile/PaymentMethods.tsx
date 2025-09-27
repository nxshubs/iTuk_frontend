import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface Props {
    paymentMethods: string[];
    paymentOptions: string[];
    onToggleMethod: (method: string) => void;
}

export default function PaymentMethods({ paymentMethods, paymentOptions, onToggleMethod }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Métodos de Pagamento
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {paymentOptions.map((method) => (
                        <div key={method} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id={`payment-${method}`}
                                checked={paymentMethods.includes(method)}
                                onChange={() => onToggleMethod(method)}
                                className="rounded"
                            />
                            <label htmlFor={`payment-${method}`} className="text-sm font-medium cursor-pointer">
                                {method}
                            </label>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
