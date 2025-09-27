"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PortfolioImage } from "@/types/PortfolioImage";
import { Plus, X, Loader2 } from "lucide-react";
import { useState, ChangeEvent, useRef } from "react";
import Cookies from 'js-cookie';
import { toast } from "sonner";

interface Props {
    gallery: PortfolioImage[];
    onAddImage: (imageUrl: string) => void;
    onRemoveImage: (id: string) => void;
    onSaveProfile: () => Promise<void>;
}

export default function Gallery({ gallery, onAddImage, onRemoveImage, onSaveProfile }: Props) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            clearSelection();
        }
    };

    const clearSelection = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUploadImage = async () => {
        if (!selectedFile) {
            toast.error("Por favor, selecione uma imagem.");
            return;
        }

        setIsUploading(true);
        const token = Cookies.get('authToken');

        if (!token) {
            toast.error("Sessão inválida. Faça login novamente.");
            setIsUploading(false);
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/image`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Falha no upload da imagem.");
            }

            const result = await response.json();

            onAddImage(result.imageUrl);
            setTimeout(async () => {
                try {
                    await onSaveProfile();
                    toast.success("Imagem adicionada e perfil salvo!");
                } catch (saveError: any) {
                    toast.error(saveError.message || "Erro ao salvar o perfil após adicionar a imagem.");
                }
            }, 100);
            clearSelection();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Galeria de Trabalhos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col gap-2 p-4 border-dashed border-2 rounded-lg">
                    <Input id="file-upload-input" ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
                    {previewUrl && (
                        <div className="relative w-32 h-32 mt-2">
                            <img src={previewUrl} alt="Pré-visualização" className="w-full h-full object-cover rounded-md" />
                            <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 rounded-full" onClick={clearSelection}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                    <Button onClick={handleUploadImage} size="sm" disabled={!selectedFile || isUploading} className="mt-2 w-full sm:w-auto">
                        {isUploading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Carregando...</>
                        ) : (
                            <><Plus className="w-4 h-4 mr-2" /> Adicionar Imagem</>
                        )}
                    </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {gallery && gallery.length > 0 ? (
                        gallery.map((image) => (
                            <div key={image.id} className="relative group">
                                <img
                                    src={image.imageUrl || "/placeholder.svg"}
                                    alt={`Trabalho do portfólio`}
                                    className="w-full h-32 object-cover rounded-lg bg-muted"
                                />
                                <button
                                    onClick={() => onRemoveImage(image.id)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-muted-foreground">Nenhuma imagem na galeria ainda.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}