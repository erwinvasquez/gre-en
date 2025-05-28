import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { Card } from "@/components/ui/card"
import { getDefaultMetadata } from "@/lib/seo/metadata"
import {
  CheckCircle,
  Zap,
  Shield,
  Thermometer,
  Sun,
  Factory,
  TrendingUp,
  Award,
  FileText,
  Download,
} from "lucide-react"
import Image from "next/image"

// Generar metadatos para SEO
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getDefaultMetadata("/products/photovoltaic", params.locale)
}

export default async function PhotovoltaicPage({ params: { locale } }: { params: { locale: string } }) {
  // Obtener traducciones
  const t = await getTranslations({ locale, namespace: "SolutionsSection" })

  return (
    <main className="flex-1">
      <Section id="photovoltaic-content" heightType="content">
        <Container size="xlarge" className="py-12 md:py-16">
          {/* Introducción Técnica Directa */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
                Paneles Solares Bifaciales TOPCon
              </h1>
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">720W</div>
                  <div className="text-sm text-muted-foreground">Potencia Máxima</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">23%</div>
                  <div className="text-sm text-muted-foreground">Eficiencia</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">+30%</div>
                  <div className="text-sm text-muted-foreground">Ganancia Bifacial</div>
                </div>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                Módulos fotovoltaicos de última generación con células monocristalinas bifaciales tipo N y tecnología
                TOPCon, diseñados para maximizar la generación energética en proyectos comerciales e industriales de
                gran escala.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                  <FileText className="w-5 h-5 mr-2" />
                  Ficha Técnica
                </button>
                <button className="inline-flex items-center px-6 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors">
                  <Download className="w-5 h-5 mr-2" />
                  Solicitar Cotización
                </button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/photovoltaic/1.png"
                alt="Panel Solar Bifacial TOPCon"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-4 -right-4 bg-white dark:bg-slate-800 rounded-lg p-4 shadow-lg border">
                <div className="text-sm font-medium text-muted-foreground">Certificado</div>
                <div className="text-lg font-bold">IEC 61215/61730</div>
              </div>
            </div>
          </div>

          {/* Tecnología y Innovación */}
          <div className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Tecnología TOPCon Bifacial</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                La evolución de la tecnología fotovoltaica que redefine los estándares de eficiencia y durabilidad
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <div className="relative">
                <Image
                  src="/images/photovoltaic/TOPCon.png"
                  alt="Diagrama tecnología TOPCon"
                  width={500}
                  height={350}
                  className="rounded-lg shadow-md"
                />
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-sm font-medium">Estructura TOPCon</div>
                  <div className="text-xs text-muted-foreground">Contacto pasivado</div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-6">¿Qué es la tecnología TOPCon?</h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">TOPCon (Tunnel Oxide Passivated Contact)</strong> es una
                    tecnología avanzada de células solares tipo N que utiliza una capa de óxido ultrafina para crear un
                    contacto pasivado que reduce significativamente las pérdidas por recombinación.
                  </p>
                  <p>
                    Esta innovación permite alcanzar eficiencias superiores al 23% y una degradación anual menor al
                    0.4%, comparado con el 0.7% de las células tipo P convencionales.
                  </p>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{"<0.4%"}</div>
                    <div className="text-sm text-green-700 dark:text-green-300">Degradación anual</div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">25+</div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">Años vida útil</div>
                  </div>
                </div>
              </div>

            </div>


          </div>

          {/* Especificaciones Técnicas Completas */}
          <div className="mb-24">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Especificaciones Técnicas</h2>

            <Card className="p-8 mb-12">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Columna 1: Especificaciones Eléctricas */}
                <div>
                  <h3 className="text-xl font-semibold mb-6 flex items-center border-b pb-3">
                    <Zap className="w-6 h-6 mr-3 text-yellow-500" />
                    Características Eléctricas
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                      <span className="font-medium">Potencia nominal (Pmax)</span>
                      <span className="text-right font-semibold text-primary">Hasta 720W</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                      <span className="font-medium">Eficiencia del módulo</span>
                      <span className="text-right font-semibold text-primary">22.5% – 23.0%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                      <span className="font-medium">Voltaje Pmax (Vmp)</span>
                      <span className="text-right">42V – 49V</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                      <span className="font-medium">Corriente Pmax (Imp)</span>
                      <span className="text-right">14A – 15A</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                      <span className="font-medium">Voltaje circuito abierto (Voc)</span>
                      <span className="text-right">50V – 56V</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                      <span className="font-medium">Corriente cortocircuito (Isc)</span>
                      <span className="text-right">15.2A – 15.8A</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 py-2">
                      <span className="font-medium">Ganancia bifacial</span>
                      <span className="text-right font-semibold text-green-600">Hasta 30%</span>
                    </div>
                  </div>
                </div>

                {/* Columna 2: Especificaciones Físicas */}
                <div>
                  <h3 className="text-xl font-semibold mb-6 flex items-center border-b pb-3">
                    <Shield className="w-6 h-6 mr-3 text-blue-500" />
                    Características Físicas
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                      <span className="font-medium">Tipo de célula</span>
                      <span className="text-right font-semibold text-primary">Mono-c bifacial tipo N</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                      <span className="font-medium">Tecnología</span>
                      <span className="text-right font-semibold text-primary">TOPCon</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                      <span className="font-medium">Tamaño de célula</span>
                      <span className="text-right">182 mm</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                      <span className="font-medium">Configuración</span>
                      <span className="text-right">144 células (6x24)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                      <span className="font-medium">Dimensiones</span>
                      <span className="text-right">2278 x 1134 x 30 mm</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                      <span className="font-medium">Peso</span>
                      <span className="text-right">33.5 kg</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 py-2">
                      <span className="font-medium">Marco</span>
                      <span className="text-right">Aluminio anodizado</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fila adicional: Condiciones ambientales */}
              <div className="mt-12 pt-8 border-t">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <Thermometer className="w-6 h-6 mr-3 text-red-500" />
                  Condiciones Ambientales y Construcción
                </h3>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <div className="flex justify-between py-1">
                      <span className="font-medium">Temperatura operación</span>
                      <span>-40°C a +85°C</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-medium">Conectores</span>
                      <span>MC4-EVO2</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between py-1">
                      <span className="font-medium">Vidrio frontal</span>
                      <span>Templado 2.0 mm</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-medium">Vidrio posterior</span>
                      <span>Templado 2.0 mm</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between py-1">
                      <span className="font-medium">Certificaciones</span>
                      <span className="text-sm">IEC 61215/61730</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-medium">ISO</span>
                      <span className="text-sm">9001/14001/45001</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Rendimiento y Beneficios Cuantificables */}
          <div className="mb-24">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Rendimiento Superior Comprobado</h2>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-6">Ventajas Cuantificables</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Mayor Generación Energética</h4>
                      <p className="text-muted-foreground">
                        Hasta 30% más energía comparado con paneles monofaciales tradicionales gracias a la captación
                        bifacial y mayor eficiencia de células tipo N.
                      </p>
                      <div className="text-sm font-medium text-green-600 dark:text-green-400 mt-2">
                        +30% generación | +15% eficiencia vs tipo P
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Menor Degradación</h4>
                      <p className="text-muted-foreground">
                        Degradación anual inferior al 0.4% vs 0.7% de células tipo P, garantizando mayor producción
                        energética a lo largo de la vida útil del sistema.
                      </p>
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-2">
                        {"<0.4%"} degradación anual | 25+ años vida útil
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Thermometer className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Mejor Rendimiento Térmico</h4>
                      <p className="text-muted-foreground">
                        Coeficiente de temperatura más bajo (-0.30%/°C) permite mejor rendimiento en climas cálidos
                        comparado con tecnologías convencionales.
                      </p>
                      <div className="text-sm font-medium text-orange-600 dark:text-orange-400 mt-2">
                        -0.30%/°C | Ideal para climas cálidos
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/images/photovoltaic/Rendimiento.png"
                  alt="Gráfico de rendimiento comparativo"
                  width={500}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-sm font-medium mb-2">Rendimiento 25 años</div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-xs">TOPCon Bifacial</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <span className="text-xs">Convencional</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Casos de Uso Específicos */}
          <div className="mb-24">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Aplicaciones Optimizadas</h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Factory className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-3">Proyectos Utility-Scale</h3>
                    <p className="text-muted-foreground mb-4">
                      Instalaciones de gran escala (+10MW) donde la eficiencia y el LCOE son críticos. Ideal para
                      parques solares con alta irradiancia y superficies reflectantes.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Potencia recomendada:</span>
                        <span className="font-medium">10MW - 500MW+</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ROI típico:</span>
                        <span className="font-medium text-green-600">6-8 años</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-3">Instalaciones Industriales</h3>
                    <p className="text-muted-foreground mb-4">
                      Complejos industriales y comerciales que requieren alta densidad de potencia y máxima eficiencia
                      en espacios limitados.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Potencia recomendada:</span>
                        <span className="font-medium">500kW - 10MW</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ahorro energético:</span>
                        <span className="font-medium text-green-600">40-60%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sun className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-3">Sistemas en Suelo Optimizados</h3>
                    <p className="text-muted-foreground mb-4">
                      Instalaciones en suelo con superficies altamente reflectantes (arena, nieve, agua) que maximizan
                      la ganancia bifacial.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Ganancia bifacial:</span>
                        <span className="font-medium text-yellow-600">20-30%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Altura recomendada:</span>
                        <span className="font-medium">1.5-2.5m</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-3">Ambientes Extremos</h3>
                    <p className="text-muted-foreground mb-4">
                      Resistencia superior en condiciones adversas: alta humedad, salinidad, temperaturas extremas y
                      cargas de nieve.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Rango térmico:</span>
                        <span className="font-medium">-40°C a +85°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carga de nieve:</span>
                        <span className="font-medium">5400 Pa</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30 rounded-xl p-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Condiciones Ideales para Máximo Rendimiento</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>Superficies reflectantes (albedo {">"} 0.3)</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>Altura de montaje óptima: 1.5-2.5 metros</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>Irradiancia directa {">"} 1000 W/m²</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>Espaciado entre filas optimizado</span>
                    </li>
                  </ul>
                </div>
                <div className="relative">
                  <Image
                    src="/placeholder.svg?height=250&width=400"
                    alt="Instalación solar industrial"
                    width={400}
                    height={250}
                    className="rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Garantías y Soporte */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Garantías y Certificaciones</h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Garantía de Producto</h3>
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">12 años</div>
                <p className="text-muted-foreground">
                  Cobertura completa contra defectos de fabricación, materiales y mano de obra
                </p>
              </Card>

              <Card className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Garantía de Rendimiento</h3>
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">30 años</div>
                <p className="text-muted-foreground">
                  Garantía lineal de potencia con degradación máxima del 0.4% anual
                </p>
              </Card>
            </div>

            <Card className="p-8 mb-12">
              <h3 className="text-xl font-semibold mb-6 text-center">Certificaciones Internacionales</h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="font-semibold mb-2">Seguridad y Calidad</div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>IEC 61215 (Diseño y Calificación)</div>
                    <div>IEC 61730 (Seguridad)</div>
                    <div>UL 1703 (Seguridad)</div>
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-2">Gestión de Calidad</div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>ISO 9001 (Calidad)</div>
                    <div>ISO 14001 (Ambiental)</div>
                    <div>ISO 45001 (Seguridad)</div>
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-2">Resistencia Ambiental</div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>IEC 61701 (Niebla Salina)</div>
                    <div>IEC 62716 (Corrosión Amoníaco)</div>
                    <div>IEC 61215 (Ciclos Térmicos)</div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-6">¿Listo para implementar la tecnología más avanzada?</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="inline-flex items-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                  <FileText className="w-5 h-5 mr-2" />
                  Solicitar Cotización Técnica
                </button>
                <button className="inline-flex items-center px-8 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors">
                  <Download className="w-5 h-5 mr-2" />
                  Descargar Documentación
                </button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  )
}


