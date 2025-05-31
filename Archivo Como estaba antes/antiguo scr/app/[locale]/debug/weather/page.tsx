"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { MapPin, Cloud, Sun, Thermometer, Droplets, Eye, Clock } from "lucide-react"

type WeatherDebugData = {
  location: {
    lat: number
    lng: number
    city: string
    country: string
  }
  weather: {
    temperature: number
    humidity: number
    cloudiness: number
    description: string
  }
  solarRadiation: number
  timestamp: string
  estimated?: boolean
  rawData?: {
    weatherApi?: any
    oneCallApi?: any
  }
}

export default function WeatherDebugPage() {
  const [lat, setLat] = useState("-17.8146") // Santa Cruz, Bolivia
  const [lng, setLng] = useState("-63.1561")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<WeatherDebugData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [rawResponse, setRawResponse] = useState<any>(null)

  const fetchWeatherData = async () => {
    if (!lat || !lng) {
      setError("Por favor ingresa latitud y longitud")
      return
    }

    setLoading(true)
    setError(null)
    setData(null)
    setRawResponse(null)

    try {
      const response = await fetch(`/api/weather/debug?lat=${lat}&lng=${lng}`)
      const responseData = await response.json()

      setRawResponse(responseData)

      if (!response.ok) {
        throw new Error(responseData.error || "Error al obtener datos")
      }

      setData(responseData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const formatJson = (obj: any) => {
    return JSON.stringify(obj, null, 2)
  }

  return (
    <Section id="weather-debug" heightType="content" fullWidth={true} className="bg-background">
      <Container size="xlarge" className="py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">🌤️ Debug OpenWeatherMap API</h1>
          <p className="text-muted-foreground">
            Herramienta para verificar los datos que devuelve la API de OpenWeatherMap
          </p>
        </div>

        {/* Formulario de entrada */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Coordenadas de prueba
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Latitud</label>
                <Input
                  type="number"
                  step="any"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  placeholder="-17.8146"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Longitud</label>
                <Input
                  type="number"
                  step="any"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  placeholder="-63.1561"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={fetchWeatherData} disabled={loading} className="w-full">
                  {loading ? "Cargando..." : "Obtener Datos"}
                </Button>
              </div>
            </div>

            {/* Ubicaciones predefinidas */}
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Ubicaciones de prueba:</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setLat("-17.8146")
                    setLng("-63.1561")
                  }}
                >
                  Santa Cruz, Bolivia
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setLat("-16.5000")
                    setLng("-68.1500")
                  }}
                >
                  La Paz, Bolivia
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setLat("-17.3895")
                    setLng("-66.1568")
                  }}
                >
                  Cochabamba, Bolivia
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setLat("40.7128")
                    setLng("-74.0060")
                  }}
                >
                  Nueva York, USA
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Card className="mb-8 border-red-200">
            <CardContent className="pt-6">
              <div className="text-red-600">
                <strong>Error:</strong> {error}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Datos procesados */}
        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sun className="h-5 w-5 mr-2" />
                  Datos Procesados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Ubicación */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Ubicación
                  </h3>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <p>
                      <strong>Ciudad:</strong> {data.location.city}
                    </p>
                    <p>
                      <strong>País:</strong> {data.location.country}
                    </p>
                    <p>
                      <strong>Coordenadas:</strong> {data.location.lat}, {data.location.lng}
                    </p>
                  </div>
                </div>

                {/* Clima */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Cloud className="h-4 w-4 mr-1" />
                    Datos Meteorológicos
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-blue-50 p-2 rounded flex items-center">
                      <Thermometer className="h-4 w-4 mr-1" />
                      <span>{data.weather.temperature}°C</span>
                    </div>
                    <div className="bg-blue-50 p-2 rounded flex items-center">
                      <Droplets className="h-4 w-4 mr-1" />
                      <span>{data.weather.humidity}%</span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded flex items-center">
                      <Cloud className="h-4 w-4 mr-1" />
                      <span>{data.weather.cloudiness}%</span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{data.weather.description}</span>
                    </div>
                  </div>
                </div>

                {/* Radiación Solar */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Sun className="h-4 w-4 mr-1" />
                    Radiación Solar
                  </h3>
                  <div className="bg-yellow-50 p-3 rounded">
                    <p className="text-2xl font-bold text-yellow-600">{data.solarRadiation.toFixed(2)} kWh/m²/día</p>
                    {data.estimated && (
                      <p className="text-xs text-orange-600 mt-1">⚠️ Valor estimado (API no disponible)</p>
                    )}
                  </div>
                </div>

                {/* Timestamp */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Información de consulta
                  </h3>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <p>
                      <strong>Timestamp:</strong> {new Date(data.timestamp).toLocaleString()}
                    </p>
                    <p>
                      <strong>Fuente:</strong> {data.estimated ? "Estimación" : "OpenWeatherMap API"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Respuesta Raw */}
            <Card>
              <CardHeader>
                <CardTitle>📄 Respuesta Raw de la API</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-auto max-h-96">
                  <pre>{formatJson(data)}</pre>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Respuesta completa raw */}
        {rawResponse && (
          <Card>
            <CardHeader>
              <CardTitle>🔍 Respuesta Completa de la API</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-auto max-h-96">
                <pre>{formatJson(rawResponse)}</pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Información adicional */}
        <Card>
          <CardHeader>
            <CardTitle>ℹ️ Información sobre los datos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">¿Qué datos obtenemos?</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>
                  <strong>Temperatura:</strong> Temperatura actual en grados Celsius
                </li>
                <li>
                  <strong>Humedad:</strong> Porcentaje de humedad relativa
                </li>
                <li>
                  <strong>Nubosidad:</strong> Porcentaje de cobertura de nubes
                </li>
                <li>
                  <strong>Radiación Solar:</strong> Estimación en kWh/m²/día basada en UV Index y datos históricos
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">¿Cómo calculamos la radiación solar?</h3>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>Intentamos usar la API One Call 3.0 de OpenWeatherMap para obtener UV Index</li>
                <li>
                  Convertimos UV Index a radiación solar usando: <code>radiación = UV_Index × 0.4 + 2.5</code>
                </li>
                <li>Si no está disponible, estimamos basado en latitud y época del año</li>
                <li>Aplicamos factores de corrección estacional y geográfica</li>
                <li>Limitamos el resultado entre 2.0 y 8.0 kWh/m²/día</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-2">APIs utilizadas:</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>
                  <strong>Current Weather API:</strong> Datos meteorológicos básicos
                </li>
                <li>
                  <strong>One Call API 3.0:</strong> UV Index y datos avanzados (requiere suscripción)
                </li>
                <li>
                  <strong>Fallback:</strong> Estimación matemática basada en coordenadas
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </Container>
    </Section>
  )
}
