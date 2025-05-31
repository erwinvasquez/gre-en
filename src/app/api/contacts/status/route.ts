import { NextResponse } from "next/server"
import { getContactStats } from "@/lib/contacts"

export async function GET() {
  try {
    const stats = await getContactStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error getting contact stats:", error)
    return NextResponse.json({ error: "Failed to get contact statistics" }, { status: 500 })
  }
}
