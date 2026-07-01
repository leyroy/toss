import { useContext } from "react"
import { AuthContext } from "./context"

function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("auth context must be used within an AuthProvider")
  }
  return { ...context }
}

export default useAuthContext
