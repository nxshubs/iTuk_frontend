"use client"

export default function SettingsHeader() {
  return (
    <div className="opacity-0 animate-slide-in-from-bottom">
      <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Configurações</h1>
      <p className="text-muted-foreground text-lg font-poppins">
        Gerencie suas informações pessoais e preferências
      </p>
    </div>
  )
}