export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="section-container section-padding min-h-screen-navbar bg-slate-50 flex flex-col items-center justify-center"
    >
      <h1 className="text-5xl">Pricing</h1>
    </section>
  )
}

// import { Check } from 'lucide-react'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// interface PriceCardProps {
//   title: string;
//   price: number | string;
//   period: string;
//   features: string[];
//   isAnnual?: boolean;
//   annualPrice?: string;
//   isBestValue?: boolean;
// }

// const PricingSection: React.FC = () => {
//   const monthlyPrice = 49
//   const annualPrice = monthlyPrice * 12 * 0.8 // 20% discount

//   const features = [
//     "Creación de posts para Facebook",
//     "Diseño de contenido para Instagram",
//     "Generación de campañas de email",
//     "Editor de blogs integrado",
//   ]

//   return (
//     <section
//       id="pricing"
//       className="bg-slate-50 w-full max-w-screen-xl mx-auto px-6 flex flex-col items-center justify-center"

//       style={{ height: 'calc(100vh - 4rem)', maxHeight: '900px' }} // Controlamos la altura con CSS
//     >
//       <div className="container mx-auto px-4">
//         <h2 className="text-3xl font-bold text-center mb-8">Planes de Suscripción</h2>
//         <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
//           <PriceCard
//             title="Plan Mensual"
//             price={monthlyPrice}
//             period="mes"
//             features={features}
//             annualPrice=""
//           />
//           <PriceCard
//             title="Plan Anual"
//             price={(annualPrice / 12).toFixed(2)}
//             period="mes"
//             features={features}
//             isAnnual={true}
//             annualPrice={annualPrice.toFixed(2)}
//             isBestValue={true}
//           />
//         </div>
//       </div>
//     </section>
//   )
// }

// function PriceCard({
//   title,
//   price,
//   period,
//   features,
//   isAnnual = false,
//   annualPrice,
//   isBestValue = false,
// }: PriceCardProps) {
//   return (
//     <Card className="w-full max-w-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
//       <CardHeader>
//         <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
//         {isBestValue && (
//           <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full absolute top-4 right-4">
//             Mejor valor
//           </span>
//         )}
//         <CardDescription className="text-center">
//           Potencia tu presencia en redes sociales y blogs
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="text-center mb-4">
//           <span className="text-4xl font-bold">${price}</span>
//           <span className="text-gray-500">/{period}</span>
//         </div>
//         {/* {isAnnual && annualPrice && (
//           <p className="text-center text-sm text-green-600 mb-4">
//             Facturado anualmente a ${annualPrice}
//           </p>
//         )} */}
//         <ul className="space-y-2">
//           {features.map((feature, index) => (
//             <li key={index} className="flex items-center">
//               <Check className="h-5 w-5 text-green-500 mr-2" />
//               <span>{feature}</span>
//             </li>
//           ))}
//         </ul>
//       </CardContent>
//       <CardFooter>
//         <Button className="w-full">Comenzar ahora</Button>
//       </CardFooter>
//     </Card>
//   );
// }

// export default PricingSection;

// import { Check } from 'lucide-react'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// interface PriceCardProps {
//   title: string;
//   price: number | string;
//   period: string;
//   features: string[];
//   isAnnual?: boolean;
//   annualPrice?: string;
//   isBestValue?: boolean;
// }

// const PricingSection: React.FC = () => {
//   const monthlyPrice = 49
//   const annualPrice = monthlyPrice * 12 * 0.8 // 20% discount

//   const features = [
//     "Creación de posts para Facebook",
//     "Diseño de contenido para Instagram",
//     "Generación de campañas de email",
//     "Editor de blogs integrado",
//   ]

//   return (
//     <section
//       id="pricing"
//       className="bg-slate-50 w-full max-w-screen-xl mx-auto px-6 flex flex-col items-center justify-center"

//       style={{ height: 'calc(100vh - 4rem)', maxHeight: '900px' }} // Controlamos la altura con CSS
//     >
//       <div className="container mx-auto px-4">
//         <h2 className="text-3xl font-bold text-center mb-8">Planes de Suscripción</h2>
//         <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
//           <PriceCard
//             title="Plan Mensual"
//             price={monthlyPrice}
//             period="mes"
//             features={features}
//             annualPrice=""
//           />
//           <PriceCard
//             title="Plan Anual"
//             price={(annualPrice / 12).toFixed(2)}
//             period="mes"
//             features={features}
//             isAnnual={true}
//             annualPrice={annualPrice.toFixed(2)}
//             isBestValue={true}
//           />
//         </div>
//       </div>
//     </section>
//   )
// }

// function PriceCard({
//   title,
//   price,
//   period,
//   features,
//   isAnnual = false,
//   annualPrice,
//   isBestValue = false,
// }: PriceCardProps) {
//   return (
//     <Card className="w-full max-w-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
//       <CardHeader>
//         <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
//         {isBestValue && (
//           <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full absolute top-4 right-4">
//             Mejor valor
//           </span>
//         )}
//         <CardDescription className="text-center">
//           Potencia tu presencia en redes sociales y blogs
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="text-center mb-4">
//           <span className="text-4xl font-bold">${price}</span>
//           <span className="text-gray-500">/{period}</span>
//         </div>
//         {/* {isAnnual && annualPrice && (
//           <p className="text-center text-sm text-green-600 mb-4">
//             Facturado anualmente a ${annualPrice}
//           </p>
//         )} */}
//         <ul className="space-y-2">
//           {features.map((feature, index) => (
//             <li key={index} className="flex items-center">
//               <Check className="h-5 w-5 text-green-500 mr-2" />
//               <span>{feature}</span>
//             </li>
//           ))}
//         </ul>
//       </CardContent>
//       <CardFooter>
//         <Button className="w-full">Comenzar ahora</Button>
//       </CardFooter>
//     </Card>
//   );
// }

// export default PricingSection;

// import { Check } from 'lucide-react'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// interface PriceCardProps {
//   title: string;
//   price: number | string;
//   period: string;
//   features: string[];
//   isAnnual?: boolean;
//   annualPrice?: string;
//   isBestValue?: boolean;
// }

// const PricingSection: React.FC = () => {
//   const monthlyPrice = 49
//   const annualPrice = monthlyPrice * 12 * 0.8 // 20% discount

//   const features = [
//     "Creación de posts para Facebook",
//     "Diseño de contenido para Instagram",
//     "Generación de campañas de email",
//     "Editor de blogs integrado",
//   ]

//   return (
//     <section
//       id="pricing"
//       className="bg-slate-50 w-full max-w-screen-xl mx-auto px-6 flex flex-col items-center justify-center"

//       style={{ height: 'calc(100vh - 4rem)', maxHeight: '900px' }} // Controlamos la altura con CSS
//     >
//       <div className="container mx-auto px-4">
//         <h2 className="text-3xl font-bold text-center mb-8">Planes de Suscripción</h2>
//         <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
//           <PriceCard
//             title="Plan Mensual"
//             price={monthlyPrice}
//             period="mes"
//             features={features}
//             annualPrice=""
//           />
//           <PriceCard
//             title="Plan Anual"
//             price={(annualPrice / 12).toFixed(2)}
//             period="mes"
//             features={features}
//             isAnnual={true}
//             annualPrice={annualPrice.toFixed(2)}
//             isBestValue={true}
//           />
//         </div>
//       </div>
//     </section>
//   )
// }

// function PriceCard({
//   title,
//   price,
//   period,
//   features,
//   isAnnual = false,
//   annualPrice,
//   isBestValue = false,
// }: PriceCardProps) {
//   return (
//     <Card className="w-full max-w-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
//       <CardHeader>
//         <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
//         {isBestValue && (
//           <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full absolute top-4 right-4">
//             Mejor valor
//           </span>
//         )}
//         <CardDescription className="text-center">
//           Potencia tu presencia en redes sociales y blogs
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="text-center mb-4">
//           <span className="text-4xl font-bold">${price}</span>
//           <span className="text-gray-500">/{period}</span>
//         </div>
//         {/* {isAnnual && annualPrice && (
//           <p className="text-center text-sm text-green-600 mb-4">
//             Facturado anualmente a ${annualPrice}
//           </p>
//         )} */}
//         <ul className="space-y-2">
//           {features.map((feature, index) => (
//             <li key={index} className="flex items-center">
//               <Check className="h-5 w-5 text-green-500 mr-2" />
//               <span>{feature}</span>
//             </li>
//           ))}
//         </ul>
//       </CardContent>
//       <CardFooter>
//         <Button className="w-full">Comenzar ahora</Button>
//       </CardFooter>
//     </Card>
//   );
// }

// export default PricingSection;




// import { Check } from 'lucide-react'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"


// interface PriceCardProps {
//   title: string;
//   price: number | string;
//   period: string;
//   features: string[];
//   isAnnual?: boolean;
//   annualPrice?: string;
//   isBestValue?: boolean;
// }



// const PricingSection: React.FC = () => {
//   const monthlyPrice = 49
//   const annualPrice = monthlyPrice * 12 * 0.8 // 20% discount

//   const features = [
//     "Creación de posts para Facebook",
//     "Diseño de contenido para Instagram",
//     "Generación de campañas de email",
//     "Editor de blogs integrado",
//   ]

//   return (
//     <section
//       id="pricing"
//       className="bg-slate-50 w-full max-w-screen-xl mx-auto px-6 flex flex-col items-center justify-center"
                   
//       style={{ height: 'calc(100vh - 4rem)', maxHeight: '900px' }} // Controlamos la altura con CSS
//     >
//       <div className="container mx-auto px-4">
//         <h2 className="text-3xl font-bold text-center mb-8">Planes de Suscripción</h2>
//         <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
//           <PriceCard
//             title="Plan Mensual"
//             price={monthlyPrice}
//             period="mes"
//             features={features}
//             annualPrice=""
//           />
//           <PriceCard
//             title="Plan Anual"
//             price={(annualPrice / 12).toFixed(2)}
//             period="mes"
//             features={features}
//             isAnnual={true}
//             annualPrice={annualPrice.toFixed(2)}
//             isBestValue={true}
//           />
//         </div>
//       </div>
//     </section>
//   )
// }

// function PriceCard({
//   title,
//   price,
//   period,
//   features,
//   isAnnual = false,
//   annualPrice,
//   isBestValue = false,
// }: PriceCardProps) {
//   return (
//     <Card className="w-full max-w-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
//       <CardHeader>
//         <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
//         {isBestValue && (
//           <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full absolute top-4 right-4">
//             Mejor valor
//           </span>
//         )}
//         <CardDescription className="text-center">
//           Potencia tu presencia en redes sociales y blogs
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="text-center mb-4">
//           <span className="text-4xl font-bold">${price}</span>
//           <span className="text-gray-500">/{period}</span>
//         </div>
//         {/* {isAnnual && annualPrice && (
//           <p className="text-center text-sm text-green-600 mb-4">
//             Facturado anualmente a ${annualPrice}
//           </p>
//         )} */}
//         <ul className="space-y-2">
//           {features.map((feature, index) => (
//             <li key={index} className="flex items-center">
//               <Check className="h-5 w-5 text-green-500 mr-2" />
//               <span>{feature}</span>
//             </li>
//           ))}
//         </ul>
//       </CardContent>
//       <CardFooter>
//         <Button className="w-full">Comenzar ahora</Button>
//       </CardFooter>
//     </Card>
//   );
// }


// export default PricingSection;
