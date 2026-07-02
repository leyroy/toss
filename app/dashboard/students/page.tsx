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
  UsersIcon,
} from "lucide-react"
import { toast } from "sonner"
import { getUsersAction, deleteUserAction } from "@/actions/users"
import { UserForm } from "@/components/user-form"

interface StudentUser {
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

export default function StudentsPage() {
  const [users, setUsers] = useState<StudentUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<StudentUser[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [selectedUser, setSelectedUser] = useState<StudentUser | undefined>()

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    const result = await getUsersAction("STUDENT")
    if (result.success && result.users) {
      setUsers(result.users as unknown as StudentUser[])
      setFilteredUsers(result.users as unknown as StudentUser[])
    } else {
      toast.error("Failed to load students")
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
            u.department?.toLowerCase().includes(q)
        )
      )
    }
  }, [search, users])

  const handleCreate = () => {
    setSelectedUser(undefined)
    setFormMode("create")
    setFormOpen(true)
  }

  const handleEdit = (user: StudentUser) => {
    setSelectedUser(user)
    setFormMode("edit")
    setFormOpen(true)
  }

  const handleDelete = async (user: StudentUser) => {
    if (!confirm(`Are you sure you want to delete "${user.name}"? This action cannot be undone.`)) {
      return
    }
    const result = await deleteUserAction(user.id)
    if (result.success) {
      toast.success("Student deleted successfully")
      fetchUsers()
    } else {
      toast.error(result.error || "Failed to delete student")
    }
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div>
          <p className="text-sm text-muted-foreground">
            Manage student accounts and view their ticket activity.
          </p>
        </div>
        <Button onClick={handleCreate} size="sm">
          <PlusIcon className="size-4" />
          Add Student
        </Button>
      </div>

      <div className="px-4 lg:px-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search students by name, email or department..."
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
              <UsersIcon className="size-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">No students found</p>
              <p className="text-sm text-muted-foreground">
                {search
                  ? "Try adjusting your search."
                  : "Add your first student to get started."}
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
                  <TableHead>Department</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-center">Tickets</TableHead>
                  <TableHead className="w-10" />
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
                        {user._count.tickets}
                      </Badge>
                    </TableCell>
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
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
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
        roleFilter="STUDENT"
        user={selectedUser}
        onSuccess={fetchUsers}
      />
    </div>
  )
}
