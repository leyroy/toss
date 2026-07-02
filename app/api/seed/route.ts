import { SeedIntialData } from "@/prisma/seed"

export async function GET() {
  try {
    const result = await SeedIntialData()
    return Response.json(
      { success: true, message: "Seed data inserted successfully", result },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error:", error)
    return Response.json({ error: (error as Error).message }, { status: 500 })
  }
}
