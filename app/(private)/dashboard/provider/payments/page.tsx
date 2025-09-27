// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { QrCode, CreditCard, Copy, CheckCircle, DollarSign, TrendingUp, Clock } from "lucide-react"
// import SidebarMenu from "@/components/shared/SidebarMenu"
// import DashboardHeader from "@/components/shared/DashboardHeader"

// export default function PaymentsPage() {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
//   const [pixKey, setPixKey] = useState("joao.silva@email.com") // Exemplo de chave
//   const [pixAmount, setPixAmount] = useState("")
//   const [pixDescription, setPixDescription] = useState("")
//   const [generatedQRCode, setGeneratedQRCode] = useState("")
//   const [qrCodeCopied, setQrCodeCopied] = useState(false)

//   const generatePixQRCode = () => {
//     if (!pixKey || !pixAmount) {
//       alert("Por favor, preencha a chave PIX e o valor.");
//       return;
//     }
//     // Simulação de geração de QR Code PIX (string "Copia e Cola")
//     const qrCodeData = `00020126580014br.gov.bcb.pix0136${pixKey}0208${pixDescription || "Pagamento"}5204000053039865802BR5925JoaoSilva6009SAOPAULO62070503***6304`
//     setGeneratedQRCode(qrCodeData)
//   }

//   const copyQRCode = () => {
//     if (!generatedQRCode) return;
//     navigator.clipboard.writeText(generatedQRCode)
//     setQrCodeCopied(true)
//     setTimeout(() => setQrCodeCopied(false), 2000)
//   }

//   return (
//     // Estrutura principal com Flexbox para alinhar o menu lateral e o conteúdo
//     <div className="flex min-h-screen bg-muted/30">
//       <SidebarMenu userType="PROVIDER" isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

//       {/* Div que agrupa o Header e o Conteúdo Principal */}
//       <div className="flex flex-col flex-1 md:ml-64">
//         <DashboardHeader
//           userType="PROVIDER"
//           userName="João Silva"
//           onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//         />

//         {/* Conteúdo principal da página com rolagem independente */}
//         <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
//           <div className="max-w-7xl mx-auto space-y-8">
//             {/* Header da Página */}
//             <div className="opacity-0 animate-slide-in-from-bottom">
//               <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Pagamentos</h1>
//               <p className="text-muted-foreground text-lg">Gerencie seus recebimentos via PIX e histórico financeiro</p>
//             </div>

//             {/* Cards de Estatísticas */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-0 animate-slide-in-from-bottom animation-delay-100">
//               <Card>
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-muted-foreground">Recebido Hoje</p>
//                       <p className="text-2xl font-bold text-foreground">R$ 450,00</p>
//                     </div>
//                     <DollarSign className="w-8 h-8 text-green-500" />
//                   </div>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-muted-foreground">Este Mês</p>
//                       <p className="text-2xl font-bold text-foreground">R$ 3.250,00</p>
//                     </div>
//                     <TrendingUp className="w-8 h-8 text-blue-500" />
//                   </div>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-muted-foreground">Pendentes</p>
//                       <p className="text-2xl font-bold text-foreground">R$ 180,00</p>
//                     </div>
//                     <Clock className="w-8 h-8 text-orange-500" />
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Configuração PIX e Gerador de QR Code em um único card */}
//             <Card className="opacity-0 animate-slide-in-from-bottom animation-delay-200">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <CreditCard className="w-5 h-5 text-[#FC9056]" />
//                   Recebimento PIX
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6 font-poppins">
//                 {/* Seção para configurar a chave PIX */}
//                 <div>
//                   <Label htmlFor="pix" className="text-sm font-medium">Sua Chave PIX</Label>
//                   <Input
//                     id="pix"
//                     placeholder="Digite sua chave PIX"
//                     value={pixKey}
//                     onChange={(e) => setPixKey(e.target.value)}
//                     className="mt-2"
//                   />
//                   <p className="text-xs text-muted-foreground mt-1">Esta chave será usada para gerar os QR Codes de cobrança.</p>
//                 </div>

//                 {/* Divisor e título para a seção de geração */}
//                 <div className="border-t pt-6">
//                   <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                     <QrCode className="w-5 h-5" />
//                     Gerar QR Code de Cobrança
//                   </h3>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="pixAmount">Valor (R$)</Label>
//                       <Input
//                         id="pixAmount"
//                         type="number"
//                         placeholder="Ex: 150.00"
//                         value={pixAmount}
//                         onChange={(e) => setPixAmount(e.target.value)}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="pixDescription">Descrição (opcional)</Label>
//                       <Input
//                         id="pixDescription"
//                         placeholder="Ex: Limpeza residencial"
//                         value={pixDescription}
//                         onChange={(e) => setPixDescription(e.target.value)}
//                       />
//                     </div>
//                   </div>

//                   <Button
//                     onClick={generatePixQRCode}
//                     className="w-full bg-[#FC9056] hover:bg-[#ff8340]"
//                     disabled={!pixKey || !pixAmount}
//                   >
//                     <QrCode className="w-4 h-4 mr-2" />
//                     Gerar QR Code PIX
//                   </Button>

//                   {generatedQRCode && (
//                     <div className="mt-6 p-4 bg-muted rounded-lg border">
//                       <div className="flex items-center justify-between mb-2">
//                         <h4 className="font-medium">QR Code Gerado</h4>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={copyQRCode}
//                           className={`transition-colors ${qrCodeCopied ? "text-green-600 border-green-600" : ""}`}
//                         >
//                           {qrCodeCopied ? <CheckCircle className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
//                           {qrCodeCopied ? "Copiado!" : "Copiar Código"}
//                         </Button>
//                       </div>
//                       <div className="bg-background p-4 rounded-lg border text-center">
//                         <div className="w-32 h-32 bg-muted mx-auto mb-2 flex items-center justify-center rounded">
//                           {/* Em uma aplicação real, você usaria uma biblioteca como 'qrcode.react' para renderizar a imagem do QR Code aqui */}
//                           <QrCode className="w-16 h-16 text-muted-foreground" />
//                         </div>
//                         <div className="bg-muted/50 p-2 rounded border">
//                           <p className="text-xs text-muted-foreground break-all font-mono">{generatedQRCode}</p>
//                         </div>
//                       </div>
//                       <p className="text-sm text-muted-foreground mt-2">
//                         Compartilhe este código com o cliente para receber o pagamento de R$ {pixAmount}.
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>

//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }