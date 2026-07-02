"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import {
  createUserAction,
  updateUserAction,
  type UserRole,
  type CreateUserData,
} from "@/actions/users"
import { LoaderCircle } from "lucide-react"

interface UserFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  roleFilter: "STUDENT" | "SUPERVISOR"
  user?: {
    id: string
    name: string
    email: string
    role: string
    phoneNumber?: string | null
    department?: string | null
  }
  onSuccess: () => void
}

export function UserForm({
  open,
  onOpenChange,
  mode,
  roleFilter,
  user,
  onSuccess,
}: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>(
    (user?.role as UserRole) || roleFilter
  )
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "")
  const [department, setDepartment] = useState(user?.department || "")

  const label = roleFilter === "STUDENT" ? "Student" : "Staff Member"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !email.trim()) {
      toast.warning("Name and email are required")
      return
    }
    if (mode === "create" && !password.trim()) {
      toast.warning("Password is required for new users")
      return
    }

    setIsLoading(true)

    try {
      if (mode === "create") {
        const data: CreateUserData = {
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
          role,
          phoneNumber: phoneNumber.trim() || undefined,
          department: department.trim() || undefined,
        }
        const result = await createUserAction(data)
        if (!result.success) {
          toast.error(result.error || "Failed to create user")
          return
        }
        toast.success(`${label} created successfully`)
      } else {
        const result = await updateUserAction(user!.id, {
          name: name.trim(),
          email: email.trim(),
          role,
          phoneNumber: phoneNumber.trim() || undefined,
          department: department.trim() || undefined,
          ...(password.trim() ? { password: password.trim() } : {}),
        })
        if (!result.success) {
          toast.error(result.error || "Failed to update user")
          return
        }
        toast.success(`${label} updated successfully`)
      }

      onSuccess()
      onOpenChange(false)
    } catch {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {mode === "create" ? `Add New ${label}` : `Edit ${label}`}
          </SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? `Fill in the details to create a new ${label.toLowerCase()}.`
              : `Update the ${label.toLowerCase()}'s information.`}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="user-name">Full Name</Label>
            <Input
              id="user-name"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-email">Email Address</Label>
            <Input
              id="user-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-password">
              Password {mode === "edit" && "(leave blank to keep current)"}
            </Label>
            <Input
              id="user-password"
              type="password"
              placeholder={mode === "create" ? "Enter password" : "••••••••"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required={mode === "create"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-phone">Phone Number</Label>
            <Input
              id="user-phone"
              type="tel"
              placeholder="+233-XX-XXX-XXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-department">Department</Label>
            <Input
              id="user-department"
              placeholder="e.g., Science, ICT Support"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {roleFilter === "SUPERVISOR" && (
            <div className="space-y-2">
              <Label htmlFor="user-role">Role</Label>
              <Select
                value={role}
                onValueChange={(v) => setRole(v as UserRole)}
                disabled={isLoading}
              >
                <SelectTrigger id="user-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <SheetFooter className="mt-auto pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <LoaderCircle className="size-4 animate-spin" />}
              {mode === "create" ? `Add ${label}` : `Save Changes`}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
