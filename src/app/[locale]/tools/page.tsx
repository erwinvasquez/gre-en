"use client"

export default function ToolsPage() {
  return (
    <section
      className="bg-slate-50 w-full max-w-screen-xl mx-auto px-6 flex flex-col items-center justify-center py-16"
      style={{ minHeight: "calc(100vh - 64px)" }} // Usar minHeight en lugar de height y restar la altura del navbar
    >
      <h1 className="text-5xl">Tools Page</h1>
    </section>
  )
}




// 



// import { useState } from 'react'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Label } from "@/components/ui/label"
// import { Loader2 } from 'lucide-react'

// const funnelStages = [
//   { value: 'awareness', label: 'Conciencia' },
//   { value: 'consideration', label: 'Consideración' },
//   { value: 'decision', label: 'Decisión' },
// ]

// const platforms = [
//   { value: 'facebook', label: 'Facebook' },
//   { value: 'instagram', label: 'Instagram' },
//   { value: 'email', label: 'Email' },
//   { value: 'blog', label: 'Blog' },
// ]


// const Tool: React.FC = () => {

//   const [topic, setTopic] = useState('')
//   const [funnelStage, setFunnelStage] = useState('')
//   const [platform, setPlatform] = useState('')
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [generatedContent, setGeneratedContent] = useState<string[]>([])

//   const handleGenerate = async () => {
//     if (!topic || !funnelStage || !platform) return

//     setIsGenerating(true)
//     setGeneratedContent([])

//     // Simular la generación de contenido con un retraso
//     await new Promise(resolve => setTimeout(resolve, 2000))

//     setGeneratedContent([
//       `Opción 1 para ${platform} (${funnelStage}): Contenido sobre ${topic}...`,
//       `Opción 2 para ${platform} (${funnelStage}): Contenido alternativo sobre ${topic}...`,
//       `Opción 3 para ${platform} (${funnelStage}): Otra variación de contenido sobre ${topic}...`,
//     ])

//     setIsGenerating(false)
//   }


//   return (
//     <section id="about-us" className="h-screen flex items-center justify-center bg-blue-200">
//       <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
//       <div className="container mx-auto px-4">
//         <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Generador de Contenido IA</h1>
        
//         <Card className="max-w-2xl mx-auto mb-8 shadow-lg">
//           <CardHeader>
//             <CardTitle className="text-2xl text-center">Configura tu Contenido</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="space-y-2">
//               <Label htmlFor="topic" className="text-lg font-medium">Tema del Contenido</Label>
//               <Input
//                 id="topic"
//                 type="text"
//                 placeholder="Ej: Beneficios de la meditación diaria"
//                 value={topic}
//                 onChange={(e) => setTopic(e.target.value)}
//                 className="w-full"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="funnel-stage" className="text-lg font-medium">Etapa del Embudo de Conversión</Label>
//               <Select onValueChange={setFunnelStage}>
//                 <SelectTrigger id="funnel-stage" className="w-full">
//                   <SelectValue placeholder="Selecciona la etapa del embudo" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {funnelStages.map((stage) => (
//                     <SelectItem key={stage.value} value={stage.value}>
//                       {stage.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="platform" className="text-lg font-medium">Plataforma</Label>
//               <Select onValueChange={setPlatform}>
//                 <SelectTrigger id="platform" className="w-full">
//                   <SelectValue placeholder="Selecciona la plataforma" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {platforms.map((p) => (
//                     <SelectItem key={p.value} value={p.value}>
//                       {p.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <Button 
//               onClick={handleGenerate} 
//               disabled={isGenerating} 
//               className="w-full text-lg py-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
//             >
//               {isGenerating ? (
//                 <>
//                   <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                   Generando Contenido...
//                 </>
//               ) : (
//                 'Generar Contenido'
//               )}
//             </Button>
//           </CardContent>
//         </Card>

//         {generatedContent.length > 0 && (
//           <div className="max-w-4xl mx-auto space-y-6">
//             {generatedContent.map((content, index) => (
//               <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-300">
//                 <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
//                   <CardTitle className="text-xl">Opción {index + 1}</CardTitle>
//                 </CardHeader>
//                 <CardContent className="mt-4">
//                   <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-md border border-gray-200">
//                     {content}
//                   </p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//     </section>
//   );
// };

// export default Tool;