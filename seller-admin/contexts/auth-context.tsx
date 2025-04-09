"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type User = {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  businessName?: string
  phoneNumber?: string
  address?: string
  bio?: string
  createdAt: Date
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => Promise<void>
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data for demo purposes
const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
    avatar: "/placeholder-user.jpg",
    businessName: "Demo Store",
    phoneNumber: "+1 (555) 123-4567",
    address: "123 Market St, San Francisco, CA 94103",
    bio: "E-commerce entrepreneur with 5+ years of experience in online retail.",
    createdAt: new Date("2023-01-15"),
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        // Convert string date back to Date object
        parsedUser.createdAt = new Date(parsedUser.createdAt)
        setUser(parsedUser)
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Find user with matching credentials
    const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

    if (!foundUser) {
      setIsLoading(false)
      throw new Error("Invalid email or password")
    }

    // Create a user object without the password
    const { password: _, ...userWithoutPassword } = foundUser
    setUser(userWithoutPassword)

    // Store user in localStorage
    localStorage.setItem("user", JSON.stringify(userWithoutPassword))
    setIsLoading(false)
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    if (mockUsers.some((u) => u.email === email)) {
      setIsLoading(false)
      throw new Error("Email already in use")
    }

    // Create new user
    const newUser = {
      id: `${mockUsers.length + 1}`,
      name,
      email,
      password,
      role: "seller",
      createdAt: new Date(),
    }

    // Add to mock users (in a real app, this would be an API call)
    mockUsers.push(newUser)

    // Create a user object without the password
    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)

    // Store user in localStorage
    localStorage.setItem("user", JSON.stringify(userWithoutPassword))
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const updateUser = async (userData: Partial<User>) => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (!user) {
      setIsLoading(false)
      throw new Error("No user logged in")
    }

    // Update user data
    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)

    // Update in localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser))

    // In a real app, you would make an API call to update the user in the database
    const userIndex = mockUsers.findIndex((u) => u.id === user.id)
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData, password: mockUsers[userIndex].password }
    }

    setIsLoading(false)
  }

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (!user) {
      setIsLoading(false)
      throw new Error("No user logged in")
    }

    // Find user in mock data
    const userIndex = mockUsers.findIndex((u) => u.id === user.id)
    if (userIndex === -1) {
      setIsLoading(false)
      throw new Error("User not found")
    }

    // Verify current password
    if (mockUsers[userIndex].password !== currentPassword) {
      setIsLoading(false)
      throw new Error("Current password is incorrect")
    }

    // Update password
    mockUsers[userIndex].password = newPassword

    setIsLoading(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
