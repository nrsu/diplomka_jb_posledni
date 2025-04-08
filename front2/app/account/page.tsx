"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Save, Lock, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <AccountSettings />
    </ProtectedRoute>
  )
}

function AccountSettings() {
  const { user, isLoading, updateUserProfile, updatePassword } = useAuth()
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      handleProfileImageSubmit(selectedFile);
    }
  };

  const handleProfileImageSubmit = async (selectedFile: File) => {
    // e.preventDefault();
    // if (!file) return;
  
    // setIsSubmitting(true);
    const formData = new FormData();
    formData.append("image", selectedFile);
  
    try {
      // Отправляем POST-запрос на сервер с изображением
      const tokens = JSON.parse(localStorage.getItem("tokens") || "{}");
      const response = await fetch("http://127.0.0.1:8000/api/upload-profile-picture/", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${tokens.access}`, // или используйте актуальный способ авторизации
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
  
      // Получаем обновленный URL изображения
      const data = await response.json();
      setProfileData((prev) => ({ ...prev, profileImage: data.image }));
      
      toast({
        title: "Picture updated",
        description: "Your picture has been updated successfully.",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update avatar");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profileImage: ""
  })

  useEffect(() => {
    console.log("profileData:", profileData);
  }, [profileData]);
  

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

     
  useEffect(() => {
    console.log("User data from auth-context:", user);
    if (user) {
      setProfileData({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email,
        username: user.username,
        profileImage: user.image
      })
    }
  }, [user])


  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await updateUserProfile(profileData)
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate password match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match")
      return
    }

    setIsSubmitting(true)

    try {
      await updatePassword(passwordData.currentPassword, passwordData.newPassword)

      // Reset password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update password")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <AccountSettingsSkeleton />
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and email address</CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileSubmit}>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
    {profileData.profileImage ? (
      <img
        src={`http://127.0.0.1:8000${profileData.profileImage}`}
        alt="Profile"
        className="h-24 w-24 object-cover rounded-full"
      />
    ) : (
      <User className="h-12 w-12 text-muted-foreground" />
    )}
  </div>
  <Button
  size="sm"
  className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
  type="button"
  onClick={() => document.getElementById("avatar-upload")?.click()}
>
  <span className="sr-only">Change avatar</span>
  <span className="text-xl">+</span>
</Button>
<input
  type="file"
  id="avatar-upload"
  className="hidden"
  onChange={handleFileChange}
/>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" name="lastName" type="lastName" value={profileData.lastName} onChange={handleProfileChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? (
                    <>
                      <span className="mr-2">Saving...</span>
                      <span className="animate-spin">⟳</span>
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm new password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Password requirements:</p>
                  <ul className="list-disc list-inside">
                    <li>At least 8 characters long</li>
                    <li>Include at least one uppercase letter</li>
                    <li>Include at least one number</li>
                    <li>Include at least one special character</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? (
                    <>
                      <span className="mr-2">Updating...</span>
                      <span className="animate-spin">⟳</span>
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Update Password
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AccountSettingsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-20" />
      </div>

      <Skeleton className="h-12 w-full mb-8" />

      <div className="space-y-6">
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    </div>
  )
}

