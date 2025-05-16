"use client"

import { Lightbulb, Leaf, Home, TrendingUp, Shield } from "lucide-react"
import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"

export default function ResourcesSection() {
  const solutions = [
    {
      icon: <Lightbulb className="h-7 w-7 text-white" />,
      title: "Generación de Propia Energía",
      subtitle: "Reducción de Costos en Facturas",
      description:
        "Con nuestras soluciones de energía solar, eólica y fotovoltaica, puedes generar tu propia electricidad y reducir significativamente los costos de tus facturas de energía.",
      color: "bg-green-500",
    },
    {
      icon: <Leaf className="h-7 w-7 text-white" />,
      title: "Energía Limpia",
      subtitle: "Contribuye al Cuidado del Medio Ambiente",
      description:
        "Al elegir nuestras tecnologías de paneles solares, energía eólica y vidrios fotovoltaicos, estarás utilizando fuentes de energía 100% renovables y limpias.",
      color: "bg-teal-500",
    },
    {
      icon: <Home className="h-7 w-7 text-white" />,
      title: "Innovación en Sistemas de Generación",
      subtitle: "Tecnologías de Vanguardia",
      description:
        "Green es líder en ofrecer productos innovadores, como los vidrios fotovoltaicos y las tejas solares, que integran la generación de energía de forma elegante y funcional en cualquier espacio.",
      color: "bg-cyan-500",
    },
    {
      icon: <TrendingUp className="h-7 w-7 text-white" />,
      title: "Aumenta el Valor de Propiedades",
      subtitle: "Mejor Retorno de Inversión (ROI)",
      description:
        "Las propiedades con sistemas de energía renovable, como paneles solares, energía eólica o tejas fotovoltaicas, aumentan su valor y atractivo en el mercado, asegurando un retorno de inversión más alto y rápido.",
      color: "bg-green-500",
    },
    {
      icon: <Shield className="h-7 w-7 text-white" />,
      title: "Independencia Energética",
      subtitle: "Control Total Sobre tu Consumo de Energía",
      description:
        "Con nuestras soluciones, puedes reducir tu dependencia de las redes eléctricas y obtener una fuente de energía más confiable y estable para tu hogar o empresa.",
      color: "bg-teal-500",
    },
  ]

  return (
    <Section id="resources" heightType="min" className="bg-white">
      <Container>
        <div className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-700 mb-6">
              Soluciones Energéticas Innovadoras para el Futuro
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubre cómo nuestras soluciones están revolucionando la forma en que interactuamos con la energía
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
            {/* Primera fila - 3 elementos */}
            {solutions.slice(0, 3).map((solution, index) => (
              <div key={index} className="flex">
                <div
                  className={`${solution.color} p-3 rounded-full mr-5 h-14 w-14 flex items-center justify-center flex-shrink-0`}
                >
                  {solution.icon}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-800 mb-1">{solution.title}</h3>
                  <p className="text-base text-gray-600 font-medium mb-3">{solution.subtitle}</p>
                  <p className="text-base text-gray-600 leading-relaxed">{solution.description}</p>
                </div>
              </div>
            ))}

            {/* Segunda fila - 2 elementos centrados */}
            <div className="md:col-span-3 flex flex-col md:flex-row justify-center gap-16 mt-4">
              {solutions.slice(3, 5).map((solution, index) => (
                <div key={index} className="flex max-w-md">
                  <div
                    className={`${solution.color} p-3 rounded-full mr-5 h-14 w-14 flex items-center justify-center flex-shrink-0`}
                  >
                    {solution.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800 mb-1">{solution.title}</h3>
                    <p className="text-base text-gray-600 font-medium mb-3">{solution.subtitle}</p>
                    <p className="text-base text-gray-600 leading-relaxed">{solution.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}














// export default function ResourcesSection (){
//   return (
//     <section
//       id="resources"
//       className="bg-slate-50 w-full max-w-screen-xl mx-auto px-6 flex flex-col items-center justify-center"           
//       style={{ height: 'calc(100vh - 4rem)', maxHeight: '900px' }} // Controlamos la altura con CSS
//     >
//       <h1 className="text-5xl">Resources</h1>
//     </section>
//   );
// };










































// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import { Pagination } from 'swiper/modules';
// import { useTranslations } from 'next-intl';
// import { Link } from '@/i18n/routing';
// import Carousel from '@/components/swiper/Carousel';


// export default function ResorcesServices() {
//   const t = useTranslations('ServicesSection');

//   return (
//     <section
//       id="services"
//       className="bg-slate-50 w-full max-w-screen-xl mx-auto px-6 flex flex-col items-center justify-center"
//       style={{ height: 'calc(100vh - 4rem)', maxHeight: '900px' }}
//     >
//       {/* Encabezado con texto */}
//       <div className="mx-auto px-6 md:px-16 text-center mb-12">
//         <h2 className="text-4xl font-semibold mb-4">{t('header')}</h2>
//         <p className="text-gray-600 text-lg">{t('description')}</p>
//       </div>

//       {/* Estadísticas */}
//       <div className="mx-auto px-6 md:px-16 mb-12">
//         <div className="flex justify-center space-x-8 text-center">
//           {['150K', '20K', '15K'].map((stat, index) => (
//             <div key={index} className="flex flex-col items-center">
//               <span className="text-3xl font-bold mb-2">+{stat}</span>
//               <p className="text-gray-600">{t(`stat${index + 1}`)}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Botón debajo de estadísticas */}
//       <div className="flex justify-center mb-12">
//         <button className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition">
//           {t('button')}
//         </button>
//       </div>

//       {/* Carrusel para pantallas pequeñas */}
//       <div className="w-full md:hidden">
//         <Carousel />
//       </div>

//       {/* Diseño de columnas para pantallas más grandes */}
//       <div className="hidden md:grid grid-cols-3 gap-8 container mx-auto px-6 md:px-16">
//         {Array(3).fill(0).map((_, index) => (
//           <div key={index} className="text-center">
//             <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
//             <h4 className="text-xl font-semibold mb-2">{t(`service${index + 1}`)}</h4>
//             <p className="text-gray-600">{t(`serviceDescription${index + 1}`)}</p>
//           </div>
//         ))}
//       </div>

//       {/* Botón Ver más */}
//       <div className="flex justify-center mt-8 container mx-auto px-6 md:px-16 items-center">
//         <Link href="/services">
//           <button className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition">
//             {t('viewMore')}
//           </button>
//         </Link>
//       </div>
//     </section>
//   );
// }


// import Link from 'next/link';
// import { useTranslations } from 'next-intl';

// export default function ServicesSection() {
//   const t = useTranslations('ServicesSection');

//   return (
//     <section
//       id="services"
//       className="bg-slate-50 w-full max-w-screen-xl mx-auto px-6 flex flex-col items-center justify-center"
//       style={{ height: 'calc(100vh - 4rem)', maxHeight: '900px' }}
//     >
//       {/* Encabezado con texto */}
//       <div className="mx-auto px-6 md:px-16 text-center mb-12">
//         <h2 className="text-4xl font-semibold mb-4">{t('header')}</h2>
//         <p className="text-gray-600 text-lg">{t('description')}</p>
//       </div>

//       {/* Estadísticas */}
//       <div className="mx-auto px-6 md:px-16 mb-12">
//         <div className="flex justify-center space-x-8 text-center">
//           {['150K', '20K', '15K'].map((stat, index) => (
//             <div key={index} className="flex flex-col items-center">
//               <span className="text-3xl font-bold mb-2">+{stat}</span>
//               <p className="text-gray-600">{t(`stat${index + 1}`)}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Botón debajo de estadísticas */}
//       <div className="flex justify-center mb-12">
//         <button className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition">
//           {t('button')}
//         </button>
//       </div>

//       {/* Título de la lista de servicios */}
//       <div className="container mx-auto px-6 md:px-16">
//         <h3 className="text-3xl font-semibold mb-8">{t('servicesTitle')}</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {Array(3).fill(0).map((_, index) => (
//             <div key={index} className="text-center">
//               <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
//               <h4 className="text-xl font-semibold mb-2">{t(`service${index + 1}`)}</h4>
//               <p className="text-gray-600">{t(`serviceDescription${index + 1}`)}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Botón Ver más */}
//       <div className="flex justify-center mt-8 container mx-auto px-6 md:px-16 items-center">
//         <Link href="/services">
//           <button className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition">
//             {t('viewMore')}
//           </button>
//         </Link>
//       </div>
//     </section>
//   );
// }


