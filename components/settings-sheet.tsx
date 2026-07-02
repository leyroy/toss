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
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import useAuthContext from "@/context/auth/useContext"
import { changePasswordAction } from "@/actions/users"
import { LoaderCircle, UserIcon, MailIcon, ShieldIcon, KeyIcon } from "lucide-react"

interface SettingsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsSheet({ open, onOpenChange }: SettingsSheetProps) {
  const { user, updateUser, logout, isLoading: authLoading } = useAuthContext()
  
  // Profile state
  const [fullName, setFullName] = useState(user?.fullName || "")
  const [email, setEmail] = useState(user?.email || "")
  const [isSaving, setIsSaving] = useState(false)

  // Password state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const isStudent = user?.role?.toLowerCase() === "student"

  // Reset form state when sheet opens
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && user) {
      setFullName(user.fullName || "")
      setEmail(user.email || "")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }
    onOpenChange(isOpen)
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim()) {
      toast.warning("Name is required")
      return
    }
    setIsSaving(true)
    try {
      // Update client-side state (Note: in database, students edit name; other roles are updated by Admin)
      updateUser({ fullName: fullName.trim(), email: email.trim() })
      toast.success("Profile updated successfully")
      onOpenChange(false)
    } catch {
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.warning("All password fields are required")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }
    if (newPassword.length < 6) {
      toast.warning("New password must be at least 6 characters")
      return
    }

    setIsChangingPassword(true)
    const result = await changePasswordAction({ currentPassword, newPassword })
    setIsChangingPassword(false)

    if (result.success) {
      toast.success("Password changed successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } else {
      toast.error(result.error || "Failed to change password")
    }
  }

  const roleBadgeVariant =
    user?.role?.toLowerCase() === "admin"
      ? "default"
      : user?.role?.toLowerCase() === "supervisor"
        ? "secondary"
        : "outline"

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="left" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Manage your account details and preferences.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-4">
          {/* Profile Avatar Section */}
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserIcon className="size-7" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">
                {user?.fullName || "User"}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {user?.email}
              </p>
              <Badge variant={roleBadgeVariant} className="mt-1 text-xs">
                {user?.role || "Unknown"}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Profile Edit Form */}
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
            <p className="text-sm font-semibold text-muted-foreground">
              Profile Information
            </p>

            <div className="space-y-2">
              <Label htmlFor="settings-name" className="flex items-center gap-1.5 text-xs">
                <UserIcon className="size-3.5" />
                Full Name
              </Label>
              <Input
                id="settings-name"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isSaving || !isStudent}
              />
              {!isStudent && (
                <p className="text-[10px] text-muted-foreground">
                  Only student names can be updated by the account owner.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="settings-email" className="flex items-center gap-1.5 text-xs">
                <MailIcon className="size-3.5" />
                Email Address
              </Label>
              <Input
                id="settings-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSaving || !isStudent}
              />
            </div>

            {isStudent && (
              <Button type="submit" disabled={isSaving} className="mt-2">
                {isSaving && <LoaderCircle className="size-4 animate-spin" />}
                Save Profile
              </Button>
            )}
          </form>

          <Separator />

          {/* Password Change Form */}
          <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
            <p className="text-sm font-semibold text-muted-foreground">
              Change Password
            </p>

            <div className="space-y-2">
              <Label htmlFor="current-pw" className="flex items-center gap-1.5 text-xs">
                <KeyIcon className="size-3.5" />
                Current Password
              </Label>
              <Input
                id="current-pw"
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isChangingPassword}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-pw" className="flex items-center gap-1.5 text-xs">
                <KeyIcon className="size-3.5" />
                New Password
              </Label>
              <Input
                id="new-pw"
                type="password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isChangingPassword}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-pw" className="flex items-center gap-1.5 text-xs">
                <KeyIcon className="size-3.5" />
                Confirm New Password
              </Label>
              <Input
                id="confirm-pw"
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isChangingPassword}
                required
              />
            </div>

            <Button type="submit" variant="secondary" disabled={isChangingPassword} className="mt-2">
              {isChangingPassword && <LoaderCircle className="size-4 animate-spin" />}
              Update Password
            </Button>
          </form>

          <Separator />

          {/* Danger Zone */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-destructive">
              Session
            </p>
            <Button
              variant="destructive"
              onClick={logout}
              disabled={authLoading}
              className="w-full"
            >
              {authLoading && <LoaderCircle className="size-4 animate-spin" />}
              Log Out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
