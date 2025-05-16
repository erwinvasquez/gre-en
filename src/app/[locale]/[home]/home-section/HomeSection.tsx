"use client"

import Link from "next/link"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { AnimatedElement } from "@/components/AnimatedElement"
import { ArrowRight } from "lucide-react"
import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"

export default function HomeSection() {
  const t = useTranslations("HomeSection")

  return (
    <Section id="home" fullWidth={true} noPadding={true} fullHeight={false} className="relative h-screen">
      {/* Imagen de fondo a pantalla completa */}
      <div className="absolute inset-0 w-full h-full">
        <Image src="/images/hero.jpg" alt="Energía renovable" fill priority className="object-cover" />
        {/* Overlay oscuro para mejorar legibilidad del texto */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Contenido superpuesto */}
      <Container size="xlarge" className="relative z-10 flex flex-col items-start justify-end h-full pb-10 md:pb-24 overflow-hidden">
        <AnimatedElement animation="slide-in-left" className="max-w-2xl mb-4">
          <h1 className="font-bold text-white">
            <span className="block text-5xl md:text-6xl lg:text-7xl mb-2">{t("titleLine1")}</span>
            <span className="block text-3xl md:text-4xl lg:text-5xl text-white/90">{t("titleLine2")}</span>
          </h1>
        </AnimatedElement>

        <AnimatedElement animation="slide-up" delay={200} className="flex gap-4 mt-6">
          <Link
            href="#solutions"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-medium py-3 px-6 rounded-md transition-all hover:shadow-lg hover:from-green-600 hover:to-green-800"
          >
            {t("buttonSolutions")}
            <ArrowRight size={18} />
          </Link>
        </AnimatedElement>
      </Container>
    </Section>
  )
}






// "use client"

// import Link from "next/link"
// import { useTranslations } from "next-intl"
// import { AnimatedElement } from "@/components/AnimatedElement"

// export default function HomePage() {
//   const t = useTranslations("HomeSection")

//   return (
//     <section id="home" className="section-container section-padding min-h-screen-navbar bg-slate-50">
//       <div className="mx-auto px-[var(--spacing-6)] md:flex md:items-center md:justify-between gap-[var(--spacing-8)] py-[var(--spacing-12)]">
//         {/* Contenido del lado izquierdo */}
//         <div className="md:w-1/2 text-center md:text-left">
//           <AnimatedElement animation="fade-in">
//             <h1 className="font-headings font-bold text-4xl md:text-6xl leading-tight mb-[var(--spacing-4)]">
//               {t("title")}
//             </h1>
//           </AnimatedElement>

//           <AnimatedElement animation="slide-up" delay={200}>
//             <p className="font-body text-lg leading-relaxed text-gray-600 mb-[var(--spacing-6)]">{t("subtitle")}</p>
//           </AnimatedElement>

//           {/* Botones */}
//           <AnimatedElement animation="fade-in" delay={400}>
//             <div className="flex justify-center md:justify-start space-x-[var(--spacing-4)]">
//               <button className="font-navbar text-base font-medium bg-black text-white px-[var(--spacing-6)] py-[var(--spacing-2)] rounded hover:bg-gray-800 transition-[var(--transition-colors)]">
//                 {t("buttonGo")}
//               </button>
//               <Link href="/proyecto">
//                 <button className="font-navbar text-base font-medium border-2 border-black px-[var(--spacing-6)] py-[var(--spacing-2)] rounded hover:bg-black hover:text-white transition-[var(--transition-colors)]">
//                   {t("buttonSeeProject")}
//                 </button>
//               </Link>
//             </div>
//           </AnimatedElement>
//         </div>

//         {/* Imagen del lado derecho */}
//         <AnimatedElement
//           animation="slide-in-right"
//           delay={300}
//           className="md:w-1/2 mt-[var(--spacing-8)] md:mt-0 flex justify-center"
//         >
//           <div className="w-full max-w-sm h-72 bg-gray-300"></div> {/* Placeholder de imagen */}
//         </AnimatedElement>
//       </div>

//       {/* Sección inferior con íconos o elementos */}
//       <AnimatedElement
//         animation="slide-up"
//         delay={500}
//         className="mx-auto mt-[var(--spacing-12)] mb-[var(--spacing-12)]"
//       >
//         <div className="flex justify-center space-x-[var(--spacing-4)] flex-wrap gap-[var(--spacing-4)]">
//           <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-300"></div> {/* Placeholder de ícono */}
//           <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-300"></div>
//           <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-300"></div>
//           <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-300"></div>
//           <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-300"></div>
//         </div>
//       </AnimatedElement>
//     </section>
//   )
// }








  // export default function HomeSection (){
//   return (
//     <section
//       id="home"
//       className="bg-slate-50 w-full max-w-screen-xl mx-auto px-6 flex flex-col items-center justify-center"           
//       style={{ height: 'calc(100vh - 4rem)', maxHeight: '900px' }} // Controlamos la altura con CSS
//     >
//       <h1 className="text-5xl">Home</h1>
//     </section>
//   );
// };
