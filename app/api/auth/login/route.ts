import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

//login route
export async function POST(request: Request) {
  const { email, password } = await request.json()
  if (!email || !password) {
    return Response.json(
      { error: "Email and password are required" },
      { status: 400 }
    )
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        assigned: true,
        comments: true,
        tickets: true,
      },
    })
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 })
    }

    return Response.json(
      { user, message: "Login successful", success: true },
      { status: 200 }
    )
  } catch (error) {
    // console.error("Error during login:", error)
    console.error("Error:", error)
    return Response.json({ success: false, error: error }, { status: 500 })
  }
}
