"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PortfolioImage } from "@/types/PortfolioImage";
import { Plus, X, Loader2, Image as ImageIcon } from "lucide-react";
import { useState, useRef } from "react";
import Cookies from 'js-cookie';
import { toast } from "sonner";
import ImageUploadDropzone from "./ImageUploadDropzone"; // Importe o novo componente

interface Props {
    gallery: PortfolioImage[];
    onAddImage: (imageUrl: string) => void;
    onRemoveImage: (id: string) => void;
    onSaveProfile: () => Promise<void>;
}

export default function Gallery({ gallery, onAddImage, onRemoveImage, onSaveProfile }: Props) {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileSelected = (file: File) => {
        if (file) {
            handleUploadImage(file);
        }
    };

    const handleUploadImage = async (file: File) => {
        setIsUploading(true);
        const token = Cookies.get('authToken');

        if (!token) {
            toast.error("Sessão inválida. Faça login novamente.");
            setIsUploading(false);
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

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
            
            // Salva o perfil automaticamente após adicionar a imagem
            // Usamos um pequeno delay para garantir que o estado do pai seja atualizado
            setTimeout(async () => {
                try {
                    await onSaveProfile();
                    toast.success("Imagem adicionada com sucesso!");
                } catch (saveError: any) {
                    toast.error(saveError.message || "Erro ao salvar o perfil após adicionar a imagem.");
                }
            }, 100);

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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* O componente de Dropzone é o primeiro item da galeria */}
                    <ImageUploadDropzone 
                        onFileSelected={handleFileSelected}
                        isUploading={isUploading}
                    />

                    {/* Imagens existentes da galeria */}
                    {gallery && gallery.length > 0 ? (
                        gallery.map((image) => (
                            <div key={image.id} className="relative group">
                                <img
                                    src={image.imageUrl || "/placeholder.svg"}
                                    alt={`Trabalho do portfólio`}
                                    className="w-full h-32 object-cover rounded-lg bg-muted transition-transform duration-300 group-hover:scale-105"
                                />
                                <button
                                    onClick={() => onRemoveImage(image.id)}
                                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Remover imagem"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))
                    ) : null}
                </div>
                {gallery.length === 0 && (
                    <p className="col-span-full text-center text-muted-foreground mt-4">
                        Sua galeria está vazia. Adicione sua primeira imagem!
                    </p>
                )}
            </CardContent>
        </Card>
    );
}