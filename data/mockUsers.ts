import { User } from "@/context/auth/context"

export const mockUsers: User[] = [
  {
    id: 1,
    fullName: "John Doe",
    email: "john.doe@example.com",
    password: "password123",
    role: "Admin",
  },
  {
    id: 2,
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    password: "password456",
    role: "student",
  },
  {
    id: 3,
    fullName: "Michael Johnson",
    email: "michael.johnson@example.com",
    password: "password789",
    role: "advisor",
  },
  {
    id: 4,
    fullName: "Emily Williams",
    email: "emily.williams@example.com",
    password: "password101",
    role: "student",
  },
  {
    id: 5,
    fullName: "David Brown",
    email: "david.brown@example.com",
    password: "password202",
    role: "Admin",
  },
  {
    id: 6,
    fullName: "Sarah Davis",
    email: "sarah.davis@example.com",
    password: "password303",
    role: "advisor",
  },
  {
    id: 7,
    fullName: "Daniel Wilson",
    email: "daniel.wilson@example.com",
    password: "password404",
    role: "student",
  },
  {
    id: 8,
    fullName: "Olivia Martinez",
    email: "olivia.martinez@example.com",
    password: "password505",
    role: "student",
  },
  {
    id: 9,
    fullName: "James Anderson",
    email: "james.anderson@example.com",
    password: "password606",
    role: "advisor",
  },
  {
    id: 10,
    fullName: "Sophia Taylor",
    email: "sophia.taylor@example.com",
    password: null,
    role: "student",
  },
]
