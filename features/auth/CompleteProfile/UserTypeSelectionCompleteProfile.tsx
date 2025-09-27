import { Briefcase, UserIcon } from "lucide-react";

export const UserTypeSelectionCompleteProfile = ({ onSelectType, onContinueWithEmail, selectedType, handleGoogleLogin }: { 
    onSelectType: (type: "CLIENT" | "PROVIDER") => void;
    onContinueWithEmail: () => void;
    selectedType: "CLIENT" | "PROVIDER" | null;
    handleGoogleLogin: () => void;
}) => {
    return (
        <div className="border bg-card text-card-foreground shadow-sm rounded-lg p-8">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">Criar uma conta</h3>
                <p className="text-muted-foreground">Para começar, diga-nos quem você é.</p>
            </div>
            <div className="space-y-4">
                <div onClick={() => onSelectType("CLIENT")} className={`cursor-pointer p-6 rounded-lg border-2 border-dashed transition-all ${selectedType === 'CLIENT' ? 'border-orange-500 bg-orange-500/10' : 'border-gray-300 hover:border-orange-400'}`}>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center"><UserIcon className="w-6 h-6 text-orange-500" /></div>
                        <div>
                            <h4 className="font-semibold text-foreground">Sou Cliente</h4>
                            <p className="text-sm text-muted-foreground">Quero encontrar e contratar serviços.</p>
                        </div>
                    </div>
                </div>
                <div onClick={() => onSelectType("PROVIDER")} className={`cursor-pointer p-6 rounded-lg border-2 border-dashed transition-all ${selectedType === 'PROVIDER' ? 'border-orange-500 bg-orange-500/10' : 'border-gray-300 hover:border-orange-400'}`}>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center"><Briefcase className="w-6 h-6 text-orange-500" /></div>
                        <div>
                            <h4 className="font-semibold text-foreground">Sou Prestador de Serviço</h4>
                            <p className="text-sm text-muted-foreground">Quero oferecer meus serviços na plataforma.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 space-y-3">
                <button onClick={onContinueWithEmail} disabled={!selectedType} className="w-full h-11 bg-orange-500 text-white rounded-md flex items-center justify-center disabled:opacity-50 cursor-pointer">
                    Continuar
                </button>
            </div>
        </div>
    );
};