import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, Star } from "lucide-react"
import Link from "next/link"

interface PremiumRestrictionProps {
  feature: string
  description: string
}

export default function PremiumRestriction({ feature, description }: PremiumRestrictionProps) {
  return (
    <Card className="border-2 border-dashed border-[#FC9056]/30 bg-gradient-to-br from-[#FC9056]/5 to-[#FC9056]/5">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-[#FC9056] to-[#FC9056] rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">{feature} Restrito</h3>
        <p className="text-muted-foreground mb-6 dark:text-gray-400 font-poppins">{description}</p>
        <div className="flex items-center justify-center gap-2 mb-6">
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
          <span className="text-sm font-medium font-poppins">Recurso Premium</span>
        </div>
        <Link href="/subscription">
          <Button className="bg-gradient-to-r from-[#FC9056] to-[#FC9056] hover:from-[#FC9056] hover:to-[#ff803b] text-white cursor-pointer font-poppins">
            Assinar Premium
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
