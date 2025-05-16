import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")

  if (!lat || !lng) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  const apiKey = process.env.OPENWEATHER_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "OpenWeather API key not configured" }, { status: 500 })
  }

  const debugInfo = {
    request: {
      lat: Number.parseFloat(lat),
      lng: Number.parseFloat(lng),
      timestamp: new Date().toISOString(),
    },
    apis: {
      weather: null as any,
      oneCall: null as any,
    },
    calculations: {
      solarRadiation: {
        method: "",
        rawValue: 0,
        adjustedValue: 0,
        factors: {} as any,
      },
    },
    errors: [] as string[],
  }

  try {
    // 1. Obtener datos meteorológicos actuales
    console.log("🌤️ Fetching current weather data...")
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`

    const weatherResponse = await fetch(weatherUrl)

    if (!weatherResponse.ok) {
      const errorText = await weatherResponse.text()
      debugInfo.errors.push(`Weather API Error: ${weatherResponse.status} - ${errorText}`)
      throw new Error(`Weather API failed: ${weatherResponse.status}`)
    }

    const weatherData = await weatherResponse.json()
    debugInfo.apis.weather = {
      url: weatherUrl.replace(apiKey, "***API_KEY***"),
      status: weatherResponse.status,
      data: weatherData,
    }

    console.log("✅ Weather data obtained:", weatherData.name, weatherData.sys.country)

    // 2. Intentar obtener datos de One Call API
    console.log("☀️ Attempting One Call API...")
    const oneCallUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric&exclude=minutely,hourly,alerts`

    let solarRadiation = 5.0
    let calculationMethod = "fallback"

    try {
      const oneCallResponse = await fetch(oneCallUrl)

      debugInfo.apis.oneCall = {
        url: oneCallUrl.replace(apiKey, "***API_KEY***"),
        status: oneCallResponse.status,
        data: null,
        error: null,
      }

      if (oneCallResponse.ok) {
        const oneCallData = await oneCallResponse.json()
        debugInfo.apis.oneCall.data = oneCallData

        console.log("✅ One Call data obtained")

        if (oneCallData.daily && oneCallData.daily.length > 0) {
          const dailyData = oneCallData.daily.slice(0, 7)
          const uvValues = dailyData.map((day: any) => day.uvi || 0)
          const avgUV = uvValues.reduce((sum: number, uv: number) => sum + uv, 0) / uvValues.length

          // Convertir UV Index a radiación solar
          const rawRadiation = avgUV * 0.4 + 2.5
          solarRadiation = rawRadiation
          calculationMethod = "uv_index"

          debugInfo.calculations.solarRadiation = {
            method: "UV Index from One Call API",
            rawValue: rawRadiation,
            adjustedValue: solarRadiation,
            factors: {
              uvValues: uvValues,
              averageUV: avgUV,
              conversionFormula: "UV_Index × 0.4 + 2.5",
            },
          }

          console.log(`📊 Solar radiation from UV: ${solarRadiation.toFixed(2)} kWh/m²/day`)
        }
      } else {
        const errorText = await oneCallResponse.text()
        debugInfo.apis.oneCall.error = `${oneCallResponse.status} - ${errorText}`
        debugInfo.errors.push(`One Call API Error: ${oneCallResponse.status} - ${errorText}`)
        console.log("❌ One Call API failed, using fallback")
      }
    } catch (oneCallError) {
      debugInfo.apis.oneCall.error = oneCallError instanceof Error ? oneCallError.message : "Unknown error"
      debugInfo.errors.push(`One Call API Exception: ${oneCallError}`)
      console.log("❌ One Call API exception:", oneCallError)
    }

    // 3. Si no obtuvimos datos de One Call, usar estimación
    if (calculationMethod === "fallback") {
      console.log("🔄 Using fallback calculation...")

      const now = new Date()
      const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000)

      // Ajuste estacional
      const seasonalFactor = 0.8 + 0.4 * Math.cos((2 * Math.PI * (dayOfYear - 172)) / 365)

      // Ajuste por latitud
      const latitudeFactor = Math.cos((Math.abs(Number.parseFloat(lat)) * Math.PI) / 180)

      // Ajuste por nubosidad
      const cloudinessFactor = 1 - (weatherData.clouds.all / 100) * 0.3

      const baseRadiation = 5.5
      const rawRadiation = baseRadiation * seasonalFactor * latitudeFactor * cloudinessFactor
      solarRadiation = rawRadiation

      debugInfo.calculations.solarRadiation = {
        method: "Mathematical estimation",
        rawValue: rawRadiation,
        adjustedValue: solarRadiation,
        factors: {
          baseRadiation: baseRadiation,
          seasonalFactor: seasonalFactor,
          latitudeFactor: latitudeFactor,
          cloudinessFactor: cloudinessFactor,
          dayOfYear: dayOfYear,
          cloudiness: weatherData.clouds.all,
          formula: "base × seasonal × latitude × cloudiness",
        },
      }

      console.log(`📊 Solar radiation estimated: ${solarRadiation.toFixed(2)} kWh/m²/day`)
    }

    // 4. Aplicar límites de seguridad
    const originalRadiation = solarRadiation
    solarRadiation = Math.max(2.0, Math.min(8.0, solarRadiation))

    if (originalRadiation !== solarRadiation) {
      debugInfo.calculations.solarRadiation.adjustedValue = solarRadiation
      debugInfo.calculations.solarRadiation.factors.limitApplied = {
        original: originalRadiation,
        limited: solarRadiation,
        reason: "Applied safety limits (2.0 - 8.0 kWh/m²/day)",
      }
    }

    // 5. Preparar respuesta final
    const result = {
      location: {
        lat: Number.parseFloat(lat),
        lng: Number.parseFloat(lng),
        city: weatherData.name,
        country: weatherData.sys.country,
      },
      weather: {
        temperature: weatherData.main.temp,
        humidity: weatherData.main.humidity,
        cloudiness: weatherData.clouds.all,
        description: weatherData.weather[0].description,
        pressure: weatherData.main.pressure,
        windSpeed: weatherData.wind?.speed || 0,
        windDirection: weatherData.wind?.deg || 0,
        visibility: weatherData.visibility || 0,
      },
      solarRadiation: solarRadiation,
      timestamp: new Date().toISOString(),
      estimated: calculationMethod === "fallback",
      debug: debugInfo,
    }

    console.log("✅ Weather debug completed successfully")
    return NextResponse.json(result)
  } catch (error) {
    console.error("❌ Error in weather debug:", error)
    debugInfo.errors.push(`Main error: ${error}`)

    // Fallback completo
    const estimatedRadiation = getEstimatedSolarRadiation(Number.parseFloat(lat), Number.parseFloat(lng))

    return NextResponse.json({
      location: {
        lat: Number.parseFloat(lat),
        lng: Number.parseFloat(lng),
        city: "Unknown",
        country: "Unknown",
      },
      weather: {
        temperature: 25,
        humidity: 60,
        cloudiness: 30,
        description: "estimated",
        pressure: 1013,
        windSpeed: 0,
        windDirection: 0,
        visibility: 10000,
      },
      solarRadiation: estimatedRadiation,
      timestamp: new Date().toISOString(),
      estimated: true,
      error: error instanceof Error ? error.message : "Unknown error",
      debug: debugInfo,
    })
  }
}

function getEstimatedSolarRadiation(lat: number, lng: number): number {
  const absLat = Math.abs(lat)

  // Bolivia está entre -9° y -23° de latitud
  if (lat >= -12 && lat <= -9) {
    return 5.8 // Norte de Bolivia (más tropical)
  } else if (lat >= -18 && lat < -12) {
    return 5.4 // Centro de Bolivia
  } else if (lat >= -23 && lat < -18) {
    return 5.0 // Sur de Bolivia
  }

  // Para otras ubicaciones
  if (absLat < 15) return 5.5
  if (absLat < 25) return 5.0
  if (absLat < 35) return 4.5
  if (absLat < 45) return 4.0

  return 3.5
}
