"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  EllipsisVerticalIcon,
  PlusIcon,
  SearchIcon,
  LoaderCircle,
  ShieldCheckIcon,
} from "lucide-react"
import { toast } from "sonner"
import { getUsersAction, deleteUserAction } from "@/actions/users"
import { UserForm } from "@/components/user-form"
import useAuthContext from "@/context/auth/useContext"

interface StaffUser {
  id: string
  name: string
  email: string
  role: string
  phoneNumber: string | null
  department: string | null
  createdAt: string
  _count: {
    tickets: number
    assigned: number
  }
}

export default function StaffsPage() {
  const { user: currentUser } = useAuthContext()
  const [users, setUsers] = useState<StaffUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<StaffUser[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [selectedUser, setSelectedUser] = useState<StaffUser | undefined>()

  const isAdmin = currentUser?.role?.toLowerCase() === "admin"

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    const result = await getUsersAction()
    if (result.success && result.users) {
      // Filter only supervisors and admins
      const staffOnly = result.users.filter(
        (u) => u.role === "SUPERVISOR" || u.role === "ADMIN"
      ) as unknown as StaffUser[]
      setUsers(staffOnly)
      setFilteredUsers(staffOnly)
    } else {
      toast.error("Failed to load staff list")
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    if (!search.trim()) {
      setFilteredUsers(users)
    } else {
      const q = search.toLowerCase()
      setFilteredUsers(
        users.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.department?.toLowerCase().includes(q) ||
            u.role.toLowerCase().includes(q)
        )
      )
    }
  }, [search, users])

  const handleCreate = () => {
    if (!isAdmin) {
      toast.error("Only administrators can add staff")
      return
    }
    setSelectedUser(undefined)
    setFormMode("create")
    setFormOpen(true)
  }

  const handleEdit = (user: StaffUser) => {
    if (!isAdmin) {
      toast.error("Only administrators can edit staff")
      return
    }
    setSelectedUser(user)
    setFormMode("edit")
    setFormOpen(true)
  }

  const handleDelete = async (user: StaffUser) => {
    if (!isAdmin) {
      toast.error("Only administrators can delete staff")
      return
    }
    if (user.id === String(currentUser?.id)) {
      toast.error("You cannot delete your own account")
      return
    }
    if (!confirm(`Are you sure you want to delete staff member "${user.name}"? This action cannot be undone.`)) {
      return
    }
    const result = await deleteUserAction(user.id)
    if (result.success) {
      toast.success("Staff member deleted successfully")
      fetchUsers()
    } else {
      toast.error(result.error || "Failed to delete staff member")
    }
  }

  if (!isLoading && !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="font-semibold text-destructive">Access Denied</p>
        <p className="text-sm text-muted-foreground">
          You do not have permission to view the staff directory.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div>
          <p className="text-sm text-muted-foreground">
            Manage staff credentials, department assignments, and roles.
          </p>
        </div>
        {isAdmin && (
          <Button onClick={handleCreate} size="sm">
            <PlusIcon className="size-4" />
            Add Staff Member
          </Button>
        )}
      </div>

      <div className="px-4 lg:px-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search staff by name, email, role, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="px-4 lg:px-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <div className="rounded-full bg-muted p-3">
              <ShieldCheckIcon className="size-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">No staff members found</p>
              <p className="text-sm text-muted-foreground">
                {search ? "Try adjusting your search query." : "Add a staff member to start."}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-center">Assigned Tickets</TableHead>
                  {isAdmin && <TableHead className="w-10" />}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.role === "ADMIN" ? "default" : "secondary"}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.department ? (
                        <Badge variant="outline">{user.department}</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.phoneNumber || "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">
                        {user._count.assigned}
                      </Badge>
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <EllipsisVerticalIcon className="size-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem onClick={() => handleEdit(user)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => handleDelete(user)}
                              disabled={user.id === String(currentUser?.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <UserForm
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        roleFilter="SUPERVISOR"
        user={selectedUser}
        onSuccess={fetchUsers}
      />
    </div>
  )
}
