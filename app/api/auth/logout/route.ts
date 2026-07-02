import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
  return Response.json({ success: true, message: "Logged out successfully" })
}
