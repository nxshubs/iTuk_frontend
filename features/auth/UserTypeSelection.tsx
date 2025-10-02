import { Briefcase, UserIcon } from "lucide-react";

export const UserTypeSelection = ({ onSelectType, onContinueWithEmail, selectedType, handleGoogleLogin }: { 
    onSelectType: (type: "CLIENT" | "PROVIDER") => void;
    onContinueWithEmail: () => void;
    selectedType: "CLIENT" | "PROVIDER" | null;
    handleGoogleLogin: () => void;
}) => {
    return (
        <div className="border text-card-foreground shadow-sm rounded-lg bg-white p-8 mx-12">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Criar uma conta</h2>
                <p className="text-muted-foreground">Para começar, diga-nos quem você é.</p>
            </div>
            <div className="space-y-4">
                <div onClick={() => onSelectType("CLIENT")} className={`cursor-pointer p-6 rounded-lg border-2 transition-all ${selectedType === 'CLIENT' ? 'border-orange-500 bg-orange-500/10' : 'border-gray-300 hover:border-orange-400'}`}>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center"><UserIcon className="w-6 h-6 text-orange-500" /></div>
                        <div>
                            <h4 className="font-semibold text-foreground">Sou Cliente</h4>
                            <p className="text-sm text-muted-foreground">Quero encontrar e contratar serviços.</p>
                        </div>
                    </div>
                </div>
                <div onClick={() => onSelectType("PROVIDER")} className={`cursor-pointer p-6 rounded-lg border-2 transition-all ${selectedType === 'PROVIDER' ? 'border-orange-500 bg-orange-500/10' : 'border-gray-300 hover:border-orange-400'}`}>
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
                    Continuar com E-mail e Senha
                </button>
                <button onClick={handleGoogleLogin} className="w-full h-11 border-2 rounded-md flex items-center justify-center disabled:opacity-50 cursor-pointer">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                    Continuar com Google
                </button>
            </div>
        </div>
    );
};