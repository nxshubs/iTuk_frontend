import { UserProfileData } from "@/app/(private)/dashboard/provider/profile/page"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CreditCard, MapPin, Star } from "lucide-react"
import { useRouter } from "next/navigation"

interface Props {
    profileData: UserProfileData | null;
}

export function Essential({ profileData }: Props) {
    const router = useRouter()

    const handleWhatsApp = () => {
        if (!profileData?.whatsapp) return;
        const message = encodeURIComponent(
            `Olá ${profileData.name}! Vi seu perfil na Tuka e gostaria de conversar sobre seus serviços.`,
        )
        window.open(`https://wa.me/${profileData.whatsapp.replace(/\D/g, "")}?text=${message}`, "_blank")
    }

    const handleLocation = () => {
        if (!profileData?.address) return;
        const encodedAddress = encodeURIComponent(profileData.address)
        window.open(`https://maps.google.com/?q=${encodedAddress}`, "_blank")
    }

    const reviewCount = profileData?.reviewsReceived?.length || 0;
    const averageRating = reviewCount > 0
        ? (profileData!.reviewsReceived.reduce((acc, review) => acc + review.rating, 0) / reviewCount).toFixed(1)
        : 0;

    const startingPrice = profileData?.services && profileData.services.length > 0
        ? Math.min(...profileData.services.map(s => s.price))
        : null;

    const location = profileData?.address ? profileData.address.split(',').slice(1, 3).join(', ').trim() : "Local não informado";

    const getInitial = (name: string | undefined) => {
        return name ? name.charAt(0).toUpperCase() : '?';
    };

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                        {profileData?.photoUrl ? (
                            <img
                                src={profileData.photoUrl}
                                alt={profileData?.name || 'Foto de perfil'}
                                className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mx-auto md:mx-0 border border-orange-200">
                                <span className="text-5xl font-bold">{getInitial(profileData?.name)}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-foreground mb-2">{profileData?.name}</h1>
                        <p className="text-xl text-muted-foreground mb-3">{profileData?.profession}</p>
                        <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                            <div className="flex items-center">
                                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                <span className="ml-1 font-semibold">{averageRating}</span>
                                <span className="ml-1 text-muted-foreground">({reviewCount} avaliações)</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <MapPin className="w-4 h-4 mr-1" />
                                {location}
                            </div>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap mb-4">
                            <CreditCard className="w-4 h-4 text-muted-foreground" />
                            {profileData?.paymentMethods.map((method, index) => (
                                <Badge key={index} variant="outline" className="font-poppins text-xs">
                                    {method}
                                </Badge>
                            ))}
                        </div>
                        {startingPrice !== null && (
                            <div className="text-2xl font-bold text-[#FC9056] mb-4">A partir de R$ {startingPrice.toFixed(2)}</div>
                        )}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                            <Button onClick={() => { router.push("/dashboard/provider/profile/edit") }} variant="outline" className="flex-1 sm:flex-none cursor-pointer">
                                Editar Perfil
                            </Button>
                            <Button
                                onClick={handleWhatsApp}
                                variant="outline"
                                className="border-green-500 cursor-pointer text-green-600 hover:bg-green-50 flex-1 sm:flex-none bg-transparent"
                            >
                                <img className="w-4 h-4" src="/whatsapp.svg" alt="WhatsApp" />
                            </Button>
                            <Button
                                onClick={handleLocation}
                                variant="outline"
                                className="border-blue-500 cursor-pointer text-blue-600 hover:bg-blue-50 flex-1 sm:flex-none bg-transparent"
                            >
                                <MapPin className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
