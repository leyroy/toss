"use client"

import { useCallback, useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { toast } from "sonner"
import {
  getTicketsAction,
  createTicketAction,
  updateTicketStatusAction,
  assignTicketAction,
  addCommentAction,
  type TicketStatus,
  type Priority,
} from "@/actions/tickets"
import { getUsersAction } from "@/actions/users"
import useAuthContext from "@/context/auth/useContext"
import {
  SearchIcon,
  PlusIcon,
  LoaderCircle,
  MessageSquareIcon,
  CheckCircle2Icon,
  ClockIcon,
  AlertTriangleIcon,
  ChevronRightIcon,
  CornerDownRightIcon,
  SendIcon,
  UserIcon,
  ArrowLeftIcon,
} from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

interface Comment {
  id: string
  body: string
  createdAt: Date
  author: {
    id: string
    name: string
    role: string
  }
}

interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  priority: Priority
  createdAt: Date
  createdBy: {
    id: string
    name: string
    email: string
  }
  assignedTo: {
    id: string
    name: string
    email: string
  } | null
  comments: Comment[]
}

interface StaffUser {
  id: string
  name: string
  role: string
}

const statusConfig: Record<TicketStatus, { label: string; color: string }> = {
  OPEN: { label: "Open", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  IN_PROGRESS: { label: "In Progress", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  RESOLVED: { label: "Resolved", color: "bg-green-500/10 text-green-500 border-green-500/20" },
  CLOSED: { label: "Closed", color: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
}

const priorityConfig: Record<Priority, { label: string; color: string }> = {
  LOW: { label: "Low", color: "bg-gray-100 dark:bg-zinc-800 text-muted-foreground" },
  MEDIUM: { label: "Medium", color: "bg-blue-500/10 text-blue-500" },
  HIGH: { label: "High", color: "bg-orange-500/10 text-orange-500" },
  URGENT: { label: "Urgent", color: "bg-destructive/10 text-destructive" },
}

export default function TicketsPage() {
  const { user: currentUser } = useAuthContext()
  const isMobile = useIsMobile()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  
  // Ticket Creation Form State
  const [createOpen, setCreateOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [newPriority, setNewPriority] = useState<Priority>("MEDIUM")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Message Form State
  const [newComment, setNewComment] = useState("")
  const [isSending, setIsSending] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Staff listing for assignment
  const [staffs, setStaffs] = useState<StaffUser[]>([])

  const userRole = currentUser?.role?.toLowerCase() || "student"

  const fetchTickets = useCallback(async (selectId?: string) => {
    setIsLoading(true)
    const result = await getTicketsAction()
    if (result.success && result.tickets) {
      const allTickets = result.tickets as unknown as Ticket[]
      setTickets(allTickets)
      setFilteredTickets(allTickets)
      if (selectId) {
        const updated = allTickets.find((t) => t.id === selectId)
        if (updated) setSelectedTicket(updated)
      }
    } else {
      toast.error("Failed to load tickets")
    }
    setIsLoading(false)
  }, [])

  const fetchStaff = useCallback(async () => {
    const result = await getUsersAction()
    if (result.success && result.users) {
      const supervisors = result.users.filter(
        (u) => u.role === "SUPERVISOR" || u.role === "ADMIN"
      ) as unknown as StaffUser[]
      setStaffs(supervisors)
    }
  }, [])

  useEffect(() => {
    fetchTickets()
    if (userRole === "admin" || userRole === "supervisor") {
      fetchStaff()
    }
  }, [fetchTickets, fetchStaff, userRole])

  // Scroll to bottom of chat
  useEffect(() => {
    if (selectedTicket) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedTicket?.comments])

  // Search filter
  useEffect(() => {
    if (!search.trim()) {
      setFilteredTickets(tickets)
    } else {
      const q = search.toLowerCase()
      setFilteredTickets(
        tickets.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.createdBy.name.toLowerCase().includes(q) ||
            t.id.toLowerCase().includes(q)
        )
      )
    }
  }, [search, tickets])

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newDesc.trim()) {
      toast.warning("Title and description are required")
      return
    }
    setIsSubmitting(true)
    const result = await createTicketAction({
      title: newTitle.trim(),
      description: newDesc.trim(),
      priority: newPriority,
    })
    if (result.success) {
      toast.success("Support ticket submitted successfully")
      setNewTitle("")
      setNewDesc("")
      setNewPriority("MEDIUM")
      setCreateOpen(false)
      fetchTickets()
    } else {
      toast.error(result.error || "Failed to submit ticket")
    }
    setIsSubmitting(false)
  }

  const handleStatusChange = async (status: TicketStatus) => {
    if (!selectedTicket) return
    const result = await updateTicketStatusAction(selectedTicket.id, status)
    if (result.success) {
      toast.success(`Ticket status updated to ${statusConfig[status].label}`)
      fetchTickets(selectedTicket.id)
    } else {
      toast.error(result.error || "Failed to update status")
    }
  }

  const handleAssignChange = async (staffId: string) => {
    if (!selectedTicket) return
    const idVal = staffId === "unassigned" ? null : staffId
    const result = await assignTicketAction(selectedTicket.id, idVal)
    if (result.success) {
      toast.success(idVal ? "Ticket assigned successfully" : "Ticket unassigned")
      fetchTickets(selectedTicket.id)
    } else {
      toast.error(result.error || "Failed to assign ticket")
    }
  }

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !selectedTicket) return
    setIsSending(true)
    const result = await addCommentAction(selectedTicket.id, newComment.trim())
    if (result.success) {
      setNewComment("")
      fetchTickets(selectedTicket.id)
    } else {
      toast.error(result.error || "Failed to send message")
    }
    setIsSending(false)
  }

  // Summary Metrics
  const openCount = tickets.filter((t) => t.status === "OPEN").length
  const progressCount = tickets.filter((t) => t.status === "IN_PROGRESS").length
  const resolvedCount = tickets.filter((t) => t.status === "RESOLVED").length

  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 overflow-hidden">
      {/* Cards Row */}
      <div className="grid grid-cols-3 gap-4 px-4 lg:px-6">
        <Card className="flex items-center gap-4 p-4 shadow-xs">
          <div className="rounded-lg bg-blue-500/10 p-2.5 text-blue-500">
            <AlertTriangleIcon className="size-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold">{openCount}</CardTitle>
            <CardDescription className="text-xs">Open Tickets</CardDescription>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-4 shadow-xs">
          <div className="rounded-lg bg-amber-500/10 p-2.5 text-amber-500">
            <ClockIcon className="size-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold">{progressCount}</CardTitle>
            <CardDescription className="text-xs">In Progress</CardDescription>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-4 shadow-xs">
          <div className="rounded-lg bg-green-500/10 p-2.5 text-green-500">
            <CheckCircle2Icon className="size-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold">{resolvedCount}</CardTitle>
            <CardDescription className="text-xs">Resolved</CardDescription>
          </div>
        </Card>
      </div>

      {/* Main Split Layout */}
      <div className="flex flex-1 gap-6 px-4 lg:px-6 overflow-hidden min-h-[450px]">
        {/* Ticket List Panel */}
        <div className={`flex flex-1 flex-col gap-4 overflow-hidden border rounded-lg bg-card ${selectedTicket ? "hidden md:flex" : "flex"}`}>
          <div className="flex items-center justify-between border-b p-4">
            <div className="relative flex-1 max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tickets by ID, title, student..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            {userRole === "student" && (
              <Button onClick={() => setCreateOpen(true)} size="sm">
                <PlusIcon className="size-4" />
                New Ticket
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto divide-y">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-center text-muted-foreground">
                <MessageSquareIcon className="size-8" />
                <p className="text-sm font-medium">No tickets found</p>
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`flex flex-col gap-2 p-4 cursor-pointer transition-colors hover:bg-muted/40 ${
                    selectedTicket?.id === ticket.id ? "bg-muted/60" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">
                      #{ticket.id.slice(-6).toUpperCase()}
                    </span>
                    <Badge variant="outline" className={statusConfig[ticket.status].color}>
                      {statusConfig[ticket.status].label}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-sm line-clamp-1">{ticket.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {ticket.description}
                  </p>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-muted-foreground">
                    <span>
                      By {ticket.createdBy.name} &middot; {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                    <Badge variant="outline" className={priorityConfig[ticket.priority].color}>
                      {priorityConfig[ticket.priority].label}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Ticket Conversation Panel */}
        <div className={`flex flex-1 flex-col overflow-hidden border rounded-lg bg-card ${!selectedTicket ? "hidden md:flex" : "flex"}`}>
          {selectedTicket ? (
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Header Info */}
              <div className="border-b p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    {/* Back Button for Mobile */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTicket(null)}
                      className="md:hidden self-start mb-2 -ml-2 text-muted-foreground gap-1.5"
                    >
                      <ArrowLeftIcon className="size-4" />
                      Back to tickets
                    </Button>
                    <span className="font-mono text-xs text-muted-foreground">
                      Ticket #{selectedTicket.id.slice(-6).toUpperCase()}
                    </span>
                    <h3 className="font-semibold text-base mt-1">{selectedTicket.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Submitted by {selectedTicket.createdBy.name} &middot;{" "}
                      {new Date(selectedTicket.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5 items-end">
                    <Badge variant="outline" className={statusConfig[selectedTicket.status].color}>
                      {statusConfig[selectedTicket.status].label}
                    </Badge>
                    <Badge variant="outline" className={priorityConfig[selectedTicket.priority].color}>
                      {priorityConfig[selectedTicket.priority].label}
                    </Badge>
                  </div>
                </div>

                {/* Staff Control Panel (Status and Assignment) */}
                {userRole !== "student" && (
                  <div className="flex flex-wrap items-center gap-3 pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="status-select" className="text-xs text-muted-foreground">
                        Status:
                      </Label>
                      <Select
                        value={selectedTicket.status}
                        onValueChange={(val) => handleStatusChange(val as TicketStatus)}
                      >
                        <SelectTrigger id="status-select" className="h-8 w-32 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="OPEN">Open</SelectItem>
                          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                          <SelectItem value="RESOLVED">Resolved</SelectItem>
                          <SelectItem value="CLOSED">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {userRole === "admin" && (
                      <div className="flex items-center gap-2">
                        <Label htmlFor="assignee-select" className="text-xs text-muted-foreground">
                          Assignee:
                        </Label>
                        <Select
                          value={selectedTicket.assignedTo?.id || "unassigned"}
                          onValueChange={handleAssignChange}
                        >
                          <SelectTrigger id="assignee-select" className="h-8 w-44 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unassigned">Unassigned</SelectItem>
                            {staffs.map((staff) => (
                              <SelectItem key={staff.id} value={staff.id}>
                                {staff.name} ({staff.role})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Chat/Messages Content */}
              <div className="flex-1 overflow-y-auto p-4 bg-zinc-50/50 dark:bg-zinc-950/20 space-y-4">
                {/* Original Description */}
                <div className="flex gap-2">
                  <div className="rounded-full bg-muted p-1.5 h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <UserIcon className="size-4" />
                  </div>
                  <div className="max-w-[85%] rounded-lg border bg-card p-3 shadow-xs">
                    <p className="font-semibold text-xs text-muted-foreground">
                      {selectedTicket.createdBy.name}
                    </p>
                    <p className="text-sm mt-1 whitespace-pre-wrap">
                      {selectedTicket.description}
                    </p>
                  </div>
                </div>

                {/* Submissions/Comments */}
                {selectedTicket.comments.map((comment) => {
                  const isStaffComment =
                    comment.author.role === "ADMIN" || comment.author.role === "SUPERVISOR"
                  return (
                    <div
                      key={comment.id}
                      className={`flex gap-2 ${isStaffComment ? "justify-end" : "justify-start"}`}
                    >
                      {isStaffComment && <CornerDownRightIcon className="size-4 text-emerald-500/60 mt-2 self-start" />}
                      <div
                        className={`max-w-[80%] rounded-lg p-3 text-sm border shadow-xs ${
                          isStaffComment
                            ? "bg-emerald-500/10 text-emerald-950 dark:text-emerald-50 border-emerald-500/20"
                            : "bg-card text-foreground"
                        }`}
                      >
                        <div className="flex justify-between items-center gap-6 text-[10px] text-muted-foreground mb-1 font-semibold">
                          <span>{comment.author.name}</span>
                          <span>{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="whitespace-pre-wrap">{comment.body}</p>
                      </div>
                    </div>
                  )
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendComment} className="border-t p-3 flex gap-2">
                <Input
                  placeholder="Type a response message..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1"
                  disabled={isSending}
                />
                <Button type="submit" size="icon" disabled={isSending || !newComment.trim()}>
                  {isSending ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <SendIcon className="size-4" />
                  )}
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-muted-foreground p-8 text-center">
              <MessageSquareIcon className="size-10 text-muted-foreground/40" />
              <p className="font-medium text-sm">Select a ticket from the left panel</p>
              <p className="text-xs text-muted-foreground max-w-xs">
                Choose a ticket to view the full description, assign staff, update ticket status, and read comments.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Creation Dialog Sheet */}
      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent side="left" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Submit Support Ticket</SheetTitle>
            <SheetDescription>
              Provide clear details about the issue and support will follow up shortly.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleCreateTicket} className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="ticket-title">Subject</Label>
              <Input
                id="ticket-title"
                placeholder="Brief description of the issue"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ticket-desc">Detailed Description</Label>
              <Textarea
                id="ticket-desc"
                placeholder="Describe your issue with as much detail as possible..."
                rows={5}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ticket-priority">Priority</Label>
              <Select
                value={newPriority}
                onValueChange={(val) => setNewPriority(val as Priority)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="ticket-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <SheetFooter className="mt-auto pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
                Submit Ticket
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
