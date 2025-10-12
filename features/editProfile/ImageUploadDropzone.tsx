// features/profile/provider/ImageUploadDropzone.tsx
"use client"

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Plus, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadDropzoneProps {
    onFileSelected: (file: File) => void;
    isUploading: boolean;
}

export default function ImageUploadDropzone({ onFileSelected, isUploading }: ImageUploadDropzoneProps) {
    const [isDragActive, setIsDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragActive(true);
        } else if (e.type === "dragleave") {
            setIsDragActive(false);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelected(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            onFileSelected(e.target.files[0]);
        }
    };

    const onButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={onButtonClick}
            className={cn(
                "flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed cursor-pointer transition-colors",
                isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50",
                isUploading && "cursor-not-allowed"
            )}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                disabled={isUploading}
            />
            {isUploading ? (
                <div className="flex flex-col items-center gap-2 text-primary">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="text-sm font-medium">Enviando...</span>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon className="h-8 w-8" />
                    <span className="text-sm font-medium text-center">
                        Clique ou arraste a imagem aqui
                    </span>
                </div>
            )}
        </div>
    );
}