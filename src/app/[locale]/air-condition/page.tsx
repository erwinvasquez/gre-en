import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { getDefaultMetadata } from "@/lib/seo/metadata"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { 
  ArrowRight, 
  CheckCircle, 
  Info, 
  Zap, 
  Settings, 
  FileText, 
  Snowflake,
  Wifi,
  Battery,
  Thermometer,
  Power,
  Smartphone,
  BarChart3,
  Leaf,
  Shield,
  Gauge
} from "lucide-react"
import { AnimatedElement } from "@/components/AnimatedElement"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAirConditioners, type AirConditioner } from "@/lib/firestore-products"

// Generar metadatos para SEO
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: "Aires Acondicionados Solares - GreenEnergy Bolivia",
    description: "Aires acondicionados solares híbridos con tecnología MPPT integrada. Ahorro de energía del 60-100% con control WiFi inteligente.",
  }
}

export default async function AirConditionPage({ params: { locale } }: { params: { locale: string } }) {
  // Obtener datos de aires acondicionados desde la base de datos
  const airConditioners = await getAirConditioners()

  // Función para generar mensaje de WhatsApp
  const generateWhatsAppMessage = (product: AirConditioner) => {
    const message = `¡Hola! Quiero RESERVAR el Aire Acondicionado Solar Deye ${product.btu} BTU

📋 Modelo: ${product.model}
❄️ Capacidad de Enfriamiento: ${product.coolingCapacity}
🔥 Capacidad de Calefacción: ${product.heatingCapacity}
⚡ EER: ${product.eer}
💰 Precio: ${product.price_bs.toLocaleString()} Bs
📱 Control WiFi Inteligente
🌞 Funciona con Energía Solar (80V-380V DC)
💡 Ahorro de energía: 60-100%

¿Está disponible para reserva? ¿Cómo puedo reservarlo?`
    
    return `https://wa.me/59178457304?text=${encodeURIComponent(message)}`
  }

  return (
    <main className="flex-1 overflow-hidden">
      {/* Banner de Oferta Especial para Facebook Ads - Solo visible en desktop */}
      <div className="hidden md:block bg-gradient-to-r from-red-600 to-red-700 text-white py-3 text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm md:text-base font-semibold">
            🔥 OFERTA ESPECIAL - INSTALACIÓN GRATIS + DESCUENTO DEL 15% 🔥
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <Section id="air-condition-hero" fullWidth={true} className="relative min-h-screen">
        {/* Imagen de fondo a pantalla completa */}
        <div className="absolute inset-0 w-full h-full">
          {/* Imagen para desktop */}
          <Image 
            src="/images/aires/aires.png" 
            alt="Familia disfrutando aire acondicionado solar" 
            fill 
            priority 
            className="object-cover hidden md:block" 
          />
          {/* Imagen para móvil */}
          <Image 
            src="/images/aires/aires-movil.png" 
            alt="Familia disfrutando aire acondicionado solar" 
            fill 
            priority 
            className="object-cover block md:hidden" 
          />
          {/* Overlay oscuro para mejorar legibilidad del texto */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Contenido superpuesto - Posicionado para no tapar la familia */}
        <div className="relative z-10 flex flex-col">
          {/* Título en la parte superior */}
          <div className="pt-52 pb-96">
            <Container size="large">
              <div className="max-w-4xl mx-auto text-center">
                <AnimatedElement animation="fade-in" duration="slow">
                  <div className="flex items-center justify-center mb-4">
                    <Snowflake className="h-10 w-10 text-white mr-3" />
                    <h1 className="text-3xl md:text-4xl font-bold text-white">Aires Acondicionados Solares</h1>
                  </div>
                  <p className="text-lg text-white/90 mb-6">
                    Tecnología híbrida que combina energía solar y eléctrica para máximo ahorro y eficiencia
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Badge variant="secondary" className="text-xs px-3 py-1 bg-white/90 text-gray-800">
                      <Leaf className="h-3 w-3 mr-1" />
                      Hasta 100% ahorro energético
                    </Badge>
                    <Badge variant="secondary" className="text-xs px-3 py-1 bg-white/90 text-gray-800">
                      <Wifi className="h-3 w-3 mr-1" />
                      Control WiFi inteligente
                    </Badge>
                    <Badge variant="secondary" className="text-xs px-3 py-1 bg-white/90 text-gray-800">
                      <Zap className="h-3 w-3 mr-1" />
                      MPPT integrado
                    </Badge>
                  </div>
                </AnimatedElement>
              </div>
            </Container>
          </div>

          {/* Espacio libre para la familia (centro de la imagen) */}
          <div className="flex-1"></div>

          {/* CTAs en la parte inferior */}
          <div className="pb-16">
            <Container size="large">
              <div className="max-w-4xl mx-auto text-center">
                <AnimatedElement animation="fade-in" duration="slow">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    
                    <a 
                      href="#products"
                      className="inline-flex items-center justify-center rounded-md border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold transition-colors"
                    >
                      <ArrowRight className="mr-2 h-5 w-5" />
                      Ver Productos
                    </a>
                  </div>
                </AnimatedElement>
              </div>
            </Container>
          </div>
        </div>
      </Section>

      {/* Sección del PROBLEMA - ¿Sufres de estos problemas? */}
      <Section id="problem" heightType="content" >
        <Container size="large" className="pt-8 pb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-red-700">
              ¿Te suena familiar esta situación?
            </h2>
            <p className="text-xl text-red-600 max-w-3xl mx-auto">
              Si tienes un aire acondicionado tradicional, probablemente estés enfrentando estos problemas...
            </p>
          </div>
          
          {/* Layout de dos columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Columna izquierda - Cards de problemas */}
            <div className="space-y-6">
              <AnimatedElement animation="slide-in-left" className="p-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-2xl">💸</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-700 mb-2">Facturas de Luz por las Nubes</h3>
                    <p className="text-gray-600 text-sm">Tu aire acondicionado consume entre 1,500-3,000 watts por hora, disparando tu factura eléctrica hasta 3-5 veces más en verano.</p>
                  </div>
                </div>
              </AnimatedElement>
              
              <AnimatedElement animation="slide-in-left" style={{ animationDelay: '0.1s' }} className="p-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-700 mb-2">Alto Consumo Eléctrico</h3>
                    <p className="text-gray-600 text-sm">Los aires tradicionales consumen mucha corriente, sobrecargando tu instalación eléctrica y causando cortes frecuentes.</p>
                  </div>
                </div>
              </AnimatedElement>
              
              <AnimatedElement animation="slide-in-left" style={{ animationDelay: '0.2s' }} className="p-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-2xl">🌡️</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-700 mb-2">Temperatura Inestable</h3>
                    <p className="text-gray-600 text-sm">Los aires convencionales no mantienen una temperatura constante, causando incomodidad y mayor consumo energético.</p>
                  </div>
                </div>
              </AnimatedElement>
              
              <AnimatedElement animation="slide-in-left" style={{ animationDelay: '0.3s' }} className="p-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-2xl">🌍</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-700 mb-2">Impacto Ambiental</h3>
                    <p className="text-gray-600 text-sm">El alto consumo eléctrico contribuye al calentamiento global y aumenta tu huella de carbono.</p>
                  </div>
                </div>
              </AnimatedElement>
            </div>

            {/* Columna derecha - Imagen de persona preocupada */}
            <AnimatedElement animation="slide-in-right" className="text-center">
              <div className="relative rounded-lg overflow-hidden shadow-lg max-w-sm mx-auto">
                <Image 
                  src="/images/aires/hombre.png" 
                  alt="Persona preocupada por las altas facturas de luz" 
                  width={350}
                  height={420}
                  className="w-full h-auto object-cover"
                />
                {/* Overlay sutil para mejorar el contraste */}
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
            </AnimatedElement>
          </div>

          {/* Mensaje de cierre centrado */}
          <div className="text-center mt-12">
            <div className="bg-red-100 border-2 border-red-300 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-red-800 mb-2">¿Te identificas con alguno de estos problemas?</h3>
              <p className="text-red-700 text-lg">Si es así, tenemos la solución perfecta para ti...</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Sección de la SOLUCIÓN - Nuestra Propuesta */}
      <Section id="solution" heightType="content">
        <Container size="large" className="pt-8 pb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-green-700">
              La Solución: Aires Acondicionados Solares
            </h2>
            <p className="text-xl text-green-600 max-w-3xl mx-auto">
              Imagina tener un aire acondicionado que se pague solo con el ahorro en tu factura de luz...
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <AnimatedElement animation="slide-in-left" className="p-8">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-700 mb-2">Ahorro del 60-100%</h3>
                  <p className="text-gray-600">Funciona con energía solar durante el día, reduciendo tu consumo eléctrico hasta en un 100%.</p>
                </div>
              </div>
            </AnimatedElement>
            
            <AnimatedElement animation="slide-in-right" className="p-8">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-700 mb-2">Tecnología Híbrida</h3>
                  <p className="text-gray-600">Combina energía solar y eléctrica automáticamente, garantizando funcionamiento 24/7.</p>
                </div>
              </div>
            </AnimatedElement>
            
            <AnimatedElement animation="slide-in-left" className="p-8">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <Wifi className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-700 mb-2">Control Inteligente</h3>
                  <p className="text-gray-600">Controla tu aire desde cualquier lugar con WiFi y monitorea tu ahorro energético en tiempo real.</p>
                </div>
              </div>
            </AnimatedElement>
            
            <AnimatedElement animation="slide-in-right" className="p-8">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-700 mb-2">Inversión que se Paga Sola</h3>
                  <p className="text-gray-600">Con el ahorro en tu factura eléctrica, recuperas tu inversión en 2-3 años y luego es puro ahorro.</p>
                </div>
              </div>
            </AnimatedElement>
          </div>

          {/* Imagen de equipos Deye */}
          <AnimatedElement animation="fade-in" className="text-center">
            <div className="rounded-lg mb-8">
              <Image
                src="/images/aires/aires2.png"
                alt="Sistema completo de aire acondicionado solar Deye con unidades interior y exterior, control remoto y paneles solares"
                width={1000}
                height={600}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </AnimatedElement>

        </Container>
      </Section>

      {/* Productos */}
      <Section id="products" heightType="content">
        <Container size="large" className="pt-4 pb-8 overflow-hidden">
          <div className="text-center mb-12">
            <div className="mb-4">
              <Badge className="bg-orange-500 text-white px-4 py-2 text-sm font-semibold">
                🔥 PREVENTA ESPECIAL 🔥
              </Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
              Reserva tu Modelo Ahora
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
              Aprovecha nuestros precios especiales de preventa con instalación GRATIS
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-blue-800 font-semibold">
                ⏰ Plazo de entrega: 60 días desde la confirmación de reserva
              </p>
              <p className="text-blue-600 text-sm mt-1">
                Incluye instalación profesional, garantía de 10 años y soporte técnico especializado
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {airConditioners.map((product, index) => (
              <AnimatedElement 
                key={product.id} 
                animation="slide-up" 
                duration="slow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="text-center">
                      <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Snowflake className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{product.btu} BTU</CardTitle>
                      <p className="text-sm text-muted-foreground">{product.model}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Enfriamiento:</span>
                        <span className="font-medium">{product.coolingCapacity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Calefacción:</span>
                        <span className="font-medium">{product.heatingCapacity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">EER:</span>
                        <span className="font-medium">{product.eer}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Dimensiones:</span>
                        <span className="font-medium text-xs">{product.dimensions}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Características:</h4>
                      <ul className="space-y-1">
                        {product.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-xs">
                            <CheckCircle className="h-3 w-3 text-primary mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="text-center mb-4">
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-primary">{product.price_bs.toLocaleString()} Bs</div>
                          <div className="text-xs text-orange-600 font-semibold">💰 Precio especial de preventa</div>
                          <div className="text-xs text-muted-foreground">Incluye instalación GRATIS</div>
                          <div className="text-xs text-blue-600 font-medium">⏰ Entrega en 60 días</div>
                        </div>
                      </div>
                      <a 
                        href={generateWhatsAppMessage(product)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center rounded-md bg-green-600 hover:bg-green-700 px-4 py-3 text-sm font-semibold text-white transition-colors"
                      >
                        <Smartphone className="mr-2 h-4 w-4" />
                        ¡RESERVAR AHORA!
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedElement>
            ))}
          </div>
        </Container>
      </Section>
      

      {/* Sección de Social Proof / Testimoniales */}
     

      

      {/* Control WiFi Inteligente */}
      <Section id="smart-wifi" heightType="content">
        <Container size="large" className="pt-4 pb-4 overflow-hidden">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-primary">
            Control WiFi Inteligente
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-4">
            <AnimatedElement animation="slide-in-left" duration="slow">
              <h3 className="text-2xl font-bold mb-6 flex items-center text-primary">
                <Wifi className="mr-3 h-6 w-6" />
                Aplicación Móvil
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">Control remoto completo:</span> Enciende, apaga y ajusta desde cualquier lugar
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">Monitoreo de energía:</span> Visualiza el consumo y ahorro en tiempo real
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">Estadísticas detalladas:</span> Historial de consumo diario, mensual y anual
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">Configuración fácil:</span> Instalación y configuración en minutos
                  </div>
                </li>
              </ul>
            </AnimatedElement>
            <AnimatedElement
              animation="slide-in-right"
              duration="slow"
              className="text-center"
            >
              <div className="relative">
                <Image
                  src="/images/aires/control.png"
                  alt="Control WiFi inteligente del aire acondicionado solar"
                  width={300}
                  height={600}
                  className="w-full max-w-sm mx-auto h-auto object-contain"
                />
              </div>
            </AnimatedElement>
          </div>
        </Container>
      </Section>

      {/* Diagrama de Conexión */}
      <Section id="connection-diagram" heightType="content">
        <Container size="large" className="pt-4 pb-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-primary">
            Diagrama de Conexión del Sistema
          </h2>
          
          {/* Imagen del diagrama de conexión */}
          <AnimatedElement animation="fade-in" className="text-center">
            <div className="rounded-lg">
              <Image
                src="/images/aires/diagrama.png"
                alt="Diagrama de conexión de aire acondicionado solar Deye con paneles fotovoltaicos y red eléctrica"
                width={1200}
                height={700}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </AnimatedElement>
        </Container>
      </Section>

      
      {/* Sección de Urgencia/Escasez */}
      {/* <Section id="urgency" heightType="content" className="bg-gradient-to-r from-orange-500 to-red-600">
        <Container size="large" className="pt-8 pb-16">
          <AnimatedElement animation="fade-in" className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ⚠️ OFERTA LIMITADA - Solo por Tiempo Limitado
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Estamos ofreciendo <strong>instalación GRATIS</strong> y <strong>garantía extendida</strong> 
              en los primeros 50 equipos vendidos este mes.
            </p>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 mb-8 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold">50</div>
                  <div className="text-sm">Equipos Disponibles</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">15</div>
                  <div className="text-sm">Días Restantes</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">35</div>
                  <div className="text-sm">Ya Vendidos</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/59178457304?text=¡Hola! Vi la oferta limitada de aires acondicionados solares y quiero aprovechar la instalación GRATIS. ¿Aún está disponible?"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-green-600 hover:bg-green-700 px-8 py-4 text-lg font-bold text-white transition-colors shadow-lg"
              >
                <Smartphone className="mr-2 h-5 w-5" />
                ¡APROVECHAR OFERTA AHORA!
              </a>
            </div>
            
            <p className="text-sm mt-4 opacity-90">
              *Oferta válida solo para los primeros 50 equipos. Instalación gratuita en Santa Cruz, La Paz y Cochabamba.
            </p>
          </AnimatedElement>
        </Container>
      </Section> */}

      {/* Sección de Contacto */}
      {/* <Section id="air-condition-contact" heightType="content">
        <Container size="large" className="pt-8 pb-16 overflow-hidden">
          <AnimatedElement animation="fade-in" duration="slow" className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Listo para Ahorrar Energía?</h2>
            <p className="text-xl mb-8">
              Contacta con nuestros especialistas para una cotización personalizada de tu sistema de aire acondicionado solar
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/59178457304?text=¡Hola! Quiero reservar un aire acondicionado solar Deye. ¿Cuáles están disponibles?"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-lg font-medium text-primary-foreground hover:bg-primary/90 transition-colors w-full sm:w-auto"
              >
                <Smartphone className="mr-2 h-4 w-4" />
                Reservar por WhatsApp
              </a>
              <Link href={`/${locale}/contacto`}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Más Información
                </Button>
              </Link>
            </div>
          </AnimatedElement>
        </Container>
      </Section> */}
    </main>
  )
}
