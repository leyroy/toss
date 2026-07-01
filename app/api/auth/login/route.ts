import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

//login route
export const POST = async (request: Request) => {
  const { email, password } = await request.json()
  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: "Email and password are required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
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
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(
      JSON.stringify({ user, message: "Login successful", success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    )
  } catch (error) {
    // console.error("Error during login:", error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
