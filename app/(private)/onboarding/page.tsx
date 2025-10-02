'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AuthHeader from '@/components/shared/AuthHeader'
import { ArrowRight, ArrowLeft, MapPin, Heart, Scissors, Car, Home, Wrench, Camera, Music, BookOpen, Coffee, Dumbbell, Palette, Check, Star, Clock, Users, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'

interface Interest {
  id: string
  name: string
  icon: React.ReactNode
}

const interests: Interest[] = [
  { id: 'beauty', name: 'Beleza', icon: <Scissors className="w-6 h-6" /> },
  { id: 'wellness', name: 'Bem-estar', icon: <Heart className="w-6 h-6" /> },
  { id: 'automotive', name: 'Automotivo', icon: <Car className="w-6 h-6" /> },
  { id: 'home', name: 'Casa', icon: <Home className="w-6 h-6" /> },
  { id: 'repair', name: 'Reparos', icon: <Wrench className="w-6 h-6" /> },
  { id: 'photography', name: 'Fotografia', icon: <Camera className="w-6 h-6" /> },
  { id: 'music', name: 'Música', icon: <Music className="w-6 h-6" /> },
  { id: 'education', name: 'Educação', icon: <BookOpen className="w-6 h-6" /> },
  { id: 'food', name: 'Alimentação', icon: <Coffee className="w-6 h-6" /> },
  { id: 'fitness', name: 'Fitness', icon: <Dumbbell className="w-6 h-6" /> },
  { id: 'art', name: 'Arte', icon: <Palette className="w-6 h-6" /> }
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [userType, setUserType] = useState<'client' | 'provider'>('client')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [location, setLocation] = useState('')
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  const totalSteps = 4

  useEffect(() => {
    const type = localStorage.getItem('userType') as 'client' | 'provider' || 'client'
    setUserType(type)
  }, [])

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    )
  }

  const handleGetLocation = async () => {
    setIsLoadingLocation(true)
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            await new Promise(resolve => setTimeout(resolve, 1000))
            setLocation('São Paulo, SP - Brasil')
            setIsLoadingLocation(false)
          },
          () => {
            setIsLoadingLocation(false)
            toast.error('Não foi possível obter sua localização. Digite manualmente.')
          }
        )
      }
    } catch (error) {
      setIsLoadingLocation(false)
      toast.error('Erro ao obter localização')
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsCompleting(true)

    await new Promise(resolve => setTimeout(resolve, 2000))

    const dashboardPath = userType === 'client' ? '/dashboard/client' : '/dashboard/provider'
    router.push(dashboardPath)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true
      case 2:
        return userType === 'client' ? selectedInterests.length > 0 : true
      case 3:
        return userType === 'client' ? location.length > 0 : true
      case 4:
        return true
      default:
        return false
    }
  }

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex space-x-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${i + 1 <= currentStep
                ? 'bg-[#FC9056] text-white'
                : 'bg-gray-200 text-gray-500'
              }`}
          >
            {i + 1 <= currentStep ? <Check className="w-4 h-4" /> : i + 1}
          </div>
        ))}
      </div>
    </div>
  )

  const renderClientStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="border-1 shadow-xl backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-[#FC9056]/10 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-[#FC9056]" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Bem-vindo ao ConnectaServiços!
              </CardTitle>
              <CardDescription className="text-gray-600 font-poppins dark:text-gray-400">
                Vamos personalizar sua experiência para encontrar os melhores prestadores de serviços.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-[#FC9056]/5 p-4 rounded-lg">
                <h3 className="font-semibold text-[#FC9056] mb-2">O que você pode fazer:</h3>
                <ul className="space-y-2 text-sm text-[#FC9056]">
                  <li className="flex items-center font-poppins">
                    <Check className="w-4 h-4 mr-2 text-[#FC9056]" />
                    Encontrar prestadores qualificados
                  </li>
                  <li className="flex items-center font-poppins">
                    <Check className="w-4 h-4 mr-2 text-[#FC9056]" />
                    Agendar serviços facilmente
                  </li>
                  <li className="flex items-center font-poppins">
                    <Check className="w-4 h-4 mr-2 text-[#FC9056]" />
                    Avaliar e recomendar profissionais
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card className="border-1 shadow-xl backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Quais serviços te interessam?
              </CardTitle>
              <CardDescription className="text-gray-600 font-poppins dark:text-gray-400">
                Selecione suas áreas de interesse para receber recomendações personalizadas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {interests.map((interest) => (
                  <div
                    key={interest.id}
                    onClick={() => handleInterestToggle(interest.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedInterests.includes(interest.id)
                        ? 'border-[#FC9056] bg-[#FC9056]/10'
                        : 'border-gray-200 dark:border-gray-400 hover:border-[#FC9056]'
                      }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`${selectedInterests.includes(interest.id)
                          ? 'text-[#FC9056]'
                          : 'text-gray-500'
                        }`}>
                        {interest.icon}
                      </div>
                      <span className="text-sm font-medium text-center">
                        {interest.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4 text-center font-poppins dark:text-gray-400">
                Selecionados: {selectedInterests.length}
              </p>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card className="border-1 shadow-xl backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Onde você está localizado?
              </CardTitle>
              <CardDescription className="text-gray-600 font-poppins dark:text-gray-400">
                Isso nos ajuda a encontrar prestadores próximos a você.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className='font-poppins' htmlFor="location">Sua localização</Label>
                <div className="flex space-x-2">
                  <Input
                    id="location"
                    placeholder="Digite sua cidade ou endereço"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 font-poppins"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGetLocation}
                    disabled={isLoadingLocation}
                    className="px-3 cursor-pointer"
                  >
                    {isLoadingLocation ? (
                      <div className="w-4 h-4 border-2 border-[#FC9056] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <MapPin className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-[#FC9056]/10 p-4 rounded-lg">
                <h3 className="font-semibold text-[#FC9056] mb-2">💡 Dica:</h3>
                <p className="text-sm text-[#FC9056] font-poppins">
                  Quanto mais específica for sua localização, melhores serão as recomendações de prestadores próximos.
                </p>
              </div>
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card className="border-1 shadow-xl backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Tudo pronto!
              </CardTitle>
              <CardDescription className="text-gray-600 font-poppins dark:text-gray-400">
                Aqui estão algumas dicas para aproveitar ao máximo a plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-[#FC9056]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[#FC9056] font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Explore prestadores</h4>
                    <p className="text-sm text-gray-600 font-poppins dark:text-gray-400">Use os filtros para encontrar exatamente o que precisa.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-[#FC9056]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[#FC9056] font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Leia as avaliações</h4>
                    <p className="text-sm text-gray-600 font-poppins dark:text-gray-400">Veja o que outros clientes dizem sobre os prestadores.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-[#FC9056]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[#FC9056] font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Agende com facilidade</h4>
                    <p className="text-sm text-gray-600 font-poppins dark:text-gray-400">Escolha data e horário que funcionem para você.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  const renderProviderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-card dark:border backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-[#FC9056]/10 rounded-full flex items-center justify-center mb-4">
                <Star className="h-8 w-8 text-[#FC9056]" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Bem-vindo, Prestador!
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400 font-poppins">
                Vamos configurar seu perfil para atrair mais clientes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 font-poppins">
              <div className="bg-[#FC9056]/10 p-4 rounded-lg">
                <h3 className="font-semibold text-[#ff6410] mb-2">Benefícios da plataforma:</h3>
                <ul className="space-y-2 text-sm text-[#ff6410]">
                  <li className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-[#ff6410]" />
                    Aumente sua visibilidade
                  </li>
                  <li className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-[#ff6410]" />
                    Conecte-se com novos clientes
                  </li>
                  <li className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-[#ff6410]" />
                    Gerencie sua agenda facilmente
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-card dark:border backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Confirme seus serviços
              </CardTitle>
              <CardDescription className="text-gray-600 font-poppins dark:text-gray-500">
                Estes são os serviços que você pode oferece. Você pode ajustar depois.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-poppins">
                {interests.slice(0, 6).map((interest) => (
                  <div
                    key={interest.id}
                    className="p-4 rounded-lg border-1 border-[#FC9056]/50 bg-[#FC9056]/5"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="text-[#FC9056]">
                        {interest.icon}
                      </div>
                      <span className="text-sm font-medium text-center">
                        {interest.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4 text-center font-poppins">
                Você pode adicionar ou remover serviços no seu perfil.
              </p>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-card dark:border backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Configure sua disponibilidade
              </CardTitle>
              <CardDescription className="text-gray-600 font-poppins dark:text-gray-500">
                Defina quando você está disponível para atender clientes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 font-poppins">
              <div className="bg-[#FC9056]/20 p-4 rounded-lg">
                <h3 className="font-semibold text-[#ff6410] mb-2 font-sans">⏰ Horários sugeridos:</h3>
                <div className="space-y-2 text-sm text-[#ff6614]">
                  <div className="flex justify-between">
                    <span>Segunda a Sexta:</span>
                    <span>08:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábado:</span>
                    <span>08:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingo:</span>
                    <span>Fechado</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-500">
                  Você pode personalizar completamente sua agenda no painel de controle.
                </p>
              </div>
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-card dark:border backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Dicas para o sucesso
              </CardTitle>
              <CardDescription className="text-gray-600 font-poppins dark:text-gray-500">
                Siga estas dicas para atrair mais clientes e crescer seu negócio.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-[#FC9056]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[#FC9056] font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Complete seu perfil</h4>
                    <p className="text-sm text-gray-600 font-poppins dark:text-gray-500">Adicione fotos, descrição e certificações.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-[#FC9056]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[#FC9056] font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Responda rapidamente</h4>
                    <p className="text-sm text-gray-600 font-poppins dark:text-gray-500">Clientes valorizam respostas rápidas às solicitações.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-[#FC9056]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[#FC9056] font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Mantenha preços competitivos</h4>
                    <p className="text-sm text-gray-600 font-poppins dark:text-gray-500">Pesquise o mercado e ofereça preços justos.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen">
      <AuthHeader />

      <div className="flex mt-8 items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl space-y-6">
          {renderStepIndicator()}

          {userType === 'client' ? renderClientStep() : renderProviderStep()}

          <div className="flex justify-between font-poppins">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            {currentStep === totalSteps ? (
              <Button
                onClick={handleComplete}
                disabled={isCompleting}
                className="bg-[#FC9056] hover:bg-[#ff8340] text-white flex items-center cursor-pointer"
              >
                {isCompleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Finalizando...
                  </>
                ) : (
                  <>
                    Começar a usar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-[#FC9056] hover:bg-[#ff823f] cursor-pointer text-white flex items-center font-poppins"
              >
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
