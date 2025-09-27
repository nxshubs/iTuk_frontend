// "use client"

// import { useEffect, useState } from "react"
// import { TrendingUp, Users, Star, Calendar } from "lucide-react"

// export default function StatsSection() {
//   const [isVisible, setIsVisible] = useState(false)

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsVisible(true)
//         }
//       },
//       { threshold: 0.1 },
//     )

//     const element = document.getElementById("stats-section")
//     if (element) observer.observe(element)

//     return () => observer.disconnect()
//   }, [])

//   const stats = [
//     {
//       icon: Users,
//       value: "50K+",
//       label: "Usuários Ativos",
//       description: "Clientes e prestadores conectados",
//     },
//     {
//       icon: Calendar,
//       value: "100K+",
//       label: "Agendamentos",
//       description: "Serviços realizados com sucesso",
//     },
//     {
//       icon: Star,
//       value: "4.9/5",
//       label: "Satisfação",
//       description: "Avaliação média dos usuários",
//     },
//     {
//       icon: TrendingUp,
//       value: "95%",
//       label: "Taxa de Sucesso",
//       description: "Agendamentos concluídos",
//     },
//   ]

//   return (
//     <section id="stats-section" className="py-20 bg-muted/30">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
//           {stats.map((stat, index) => (
//             <div
//               key={index}
//               className={`text-center transition-all duration-1000 ${
//                 isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
//               }`}
//               style={{ transitionDelay: `${index * 200}ms` }}
//             >
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#6A0DAD] to-[#8A2BE2] rounded-2xl mb-4 shadow-lg">
//                 <stat.icon className="w-8 h-8 text-white" />
//               </div>
//               <div className="text-3xl lg:text-4xl font-bold text-foreground mb-2">{stat.value}</div>
//               <div className="text-lg font-semibold text-foreground mb-1">{stat.label}</div>
//               <div className="text-sm text-muted-foreground">{stat.description}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }
