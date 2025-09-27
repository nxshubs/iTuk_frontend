"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { X, User, Camera } from 'lucide-react'

export function ProfilePhotoUploader({ 
    previewUrl, 
    onFileSelect,
    onRemovePhoto 
}: { 
    previewUrl: string | null;
    onFileSelect: (file: File) => void;
    onRemovePhoto: () => void;
}) {
  return (
    <div className="w-full space-y-2 flex flex-col items-center">
      <Label className="font-semibold text-gray-700 dark:text-white font-poppins">Foto do Perfil *</Label>
      <div className="relative group w-32 h-32">
        <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 group-hover:border-[#FC9056] transition-all">
          {previewUrl ? (
            <img src={previewUrl} alt="Prévia do perfil" className="w-full h-full object-cover" />
          ) : (
            <User className="w-16 h-16 text-gray-400" />
          )}
        </div>
        <label 
          htmlFor="photo-upload-client"
          className="absolute inset-0 rounded-full flex items-center justify-center transition-colors duration-300 cursor-pointer group-hover:bg-black/50"
        >
          <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </label>
        <input 
          type="file" 
          accept="image/*" 
          // FIX: Reset the input value after selection to allow re-uploading the same file.
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onFileSelect(file);
            }
            // This line is crucial! It resets the input so the onChange event
            // will fire again, even if the same file is selected.
            e.target.value = '';
          }} 
          className="hidden" 
          id="photo-upload-client" 
        />
      </div>
      <div className="font-poppins text-sm text-gray-500">
        <p>Escolha uma foto de perfil</p>
      </div>
      {previewUrl && (
        <Button type="button" variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 cursor-pointer" onClick={onRemovePhoto}>
          <X className="w-4 h-4 mr-1" />
          <p className="font-poppins">
            Remover Foto
          </p>
        </Button>
      )}
    </div>
  );
}