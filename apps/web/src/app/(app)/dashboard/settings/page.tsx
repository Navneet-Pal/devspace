"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  Check,
  Edit3,
  ImagePlus,
  KeyRound,
  LogOut,
  Mail,
  Moon,
  Monitor,
  Palette,
  ShieldCheck,
  Sun,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import { useAuthStore } from "@/store/auth";
import authService from "@/services/auth/service";

import { useUpdateProfile } from "@/hooks/auth/useUpdateProfile";
import { useUpdateAvatar } from "@/hooks/auth/useUpdateAvatar";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

const ALLOWED_AVATAR_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);

  const accessToken = useAuthStore((state) => state.accessToken);

  const setAuth = useAuthStore((state) => state.setAuth);

  const clearAuth = useAuthStore((state) => state.clearAuth);

  const { theme, setTheme } = useTheme();

  const updateProfile = useUpdateProfile();

  const updateAvatar = useUpdateAvatar();

  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [isSendingResetEmail, setIsSendingResetEmail] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    setName(user.name);
    setEmail(user.email);
  }, [user]);

  if (!user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading account information...
        </p>
      </div>
    );
  }

  const selectedTheme =
    theme === "light" || theme === "dark" || theme === "system"
      ? theme
      : "system";

  const handleStartEditing = () => {
    setName(user.name);
    setEmail(user.email);
    setIsEditingProfile(true);
  };

  const handleCancelEditing = () => {
    setName(user.name);
    setEmail(user.email);
    setIsEditingProfile(false);
  };

  const handleUpdateProfile = () => {
    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      toast.error("Name is required.");
      return;
    }

    if (trimmedName.length < 3) {
      toast.error("Name must be at least 3 characters.");
      return;
    }

    if (trimmedName.length > 50) {
      toast.error("Name must not exceed 50 characters.");
      return;
    }

    if (!normalizedEmail) {
      toast.error("Email is required.");
      return;
    }

    const isEmailChanged = normalizedEmail !== user.email;

    const isNameChanged = trimmedName !== user.name;

    if (!isNameChanged && !isEmailChanged) {
      setIsEditingProfile(false);
      return;
    }

    updateProfile.mutate(
      {
        ...(isNameChanged && {
          name: trimmedName,
        }),
        ...(isEmailChanged && {
          email: normalizedEmail,
        }),
      },
      {
        onSuccess: (response) => {
          const updatedUser = response.data;

          if (!updatedUser) {
            toast.error("Profile update returned no user data.");
            return;
          }

          if (accessToken) {
            setAuth(updatedUser, accessToken);
          }

          setName(updatedUser.name);
          setEmail(updatedUser.email);
          setIsEditingProfile(false);

          if (isEmailChanged) {
            toast.success(
              "Profile updated. Please verify your new email address.",
            );
          } else {
            toast.success("Profile updated successfully.");
          }
        },

        onError: (error) => {
          const message =
            error.response?.data?.message ?? "Failed to update profile.";

          toast.error(message);
        },
      },
    );
  };

  const handleAvatarButtonClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!ALLOWED_AVATAR_TYPES.has(file.type)) {
      toast.error("Only JPEG, PNG, WEBP, and GIF images are allowed.");

      event.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      toast.error("Profile image must be 5 MB or smaller.");

      event.target.value = "";
      return;
    }

    updateAvatar.mutate(file, {
      onSuccess: (response) => {
        const updatedUser = response.data;

        if (!updatedUser) {
          toast.error("Avatar update returned no user data.");
          return;
        }

        if (accessToken) {
          setAuth(updatedUser, accessToken);
        }

        toast.success("Profile image updated successfully.");

        event.target.value = "";
      },

      onError: (error) => {
        const message =
          error.response?.data?.message ?? "Failed to update profile image.";

        toast.error(message);

        event.target.value = "";
      },
    });
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      await authService.logout();

      clearAuth();

      window.location.href = "/login";
    } catch {
      toast.error("Failed to log out.");
      setIsLoggingOut(false);
    }
  };

  const handlePasswordReset = async () => {
    try {
      setIsSendingResetEmail(true);

      await authService.forgotPassword({
        email: user.email,
      });

      toast.success(
        "Password reset instructions have been sent to your email.",
      );
    } catch {
      toast.error("Unable to send password reset instructions.");
    } finally {
      setIsSendingResetEmail(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="border-b pb-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-muted p-2">
            <User className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

            <p className="mt-1 text-muted-foreground">
              Manage your account and application preferences.
            </p>
          </div>
        </div>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />

                <CardTitle>Profile</CardTitle>
              </div>

              <CardDescription className="mt-1">
                Manage your DevSpace account information.
              </CardDescription>
            </div>

            {!isEditingProfile && (
              <Button
                type="button"
                variant="outline"
                onClick={handleStartEditing}
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Edit profile
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-8">
            {/* Avatar */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Avatar className="h-24 w-24 rounded-2xl">
                <AvatarImage src={user.avatar} alt={user.name} />

                <AvatarFallback className="rounded-2xl text-2xl font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-3">
                <div>
                  <p className="font-medium">Profile picture</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    JPG, PNG, WEBP, or GIF. Maximum 5 MB.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAvatarButtonClick}
                    disabled={updateAvatar.isPending}
                  >
                    <ImagePlus className="mr-2 h-4 w-4" />

                    {updateAvatar.isPending ? "Uploading..." : "Change avatar"}
                  </Button>

                  {user.avatar && (
                    <Button
                      type="button"
                      variant="ghost"
                      disabled
                      title="Avatar removal is not currently supported by the backend."
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile fields */}
            {isEditingProfile ? (
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Full name</Label>

                  <Input
                    id="profile-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter your name"
                    maxLength={50}
                    disabled={updateProfile.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-email">Email</Label>

                  <Input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                    disabled={updateProfile.isPending}
                  />
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Full name</p>

                  <p className="mt-1 text-base font-medium">{user.name}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Email</p>

                  <div className="mt-1 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />

                    <p className="text-sm font-medium">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Verification */}
            <div>
              <p className="text-sm text-muted-foreground">Account status</p>

              <div className="mt-2">
                {user.isVerified ? (
                  <Badge variant="secondary">
                    <Check className="mr-1.5 h-3.5 w-3.5" />
                    Email verified
                  </Badge>
                ) : (
                  <Badge variant="destructive">Email not verified</Badge>
                )}
              </div>
            </div>

            {/* Edit actions */}
            {isEditingProfile && (
              <div className="flex flex-wrap items-center gap-2 border-t pt-5">
                <Button
                  type="button"
                  onClick={handleUpdateProfile}
                  disabled={updateProfile.isPending}
                >
                  {updateProfile.isPending ? "Saving..." : "Save changes"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEditing}
                  disabled={updateProfile.isPending}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-muted-foreground" />

            <CardTitle>Security</CardTitle>
          </div>

          <CardDescription>
            Manage access to your DevSpace account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Password */}
          <div className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2">
                <KeyRound className="h-4 w-4 text-muted-foreground" />
              </div>

              <div>
                <p className="font-medium">Password</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Send a secure password reset link to your email.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handlePasswordReset}
              disabled={isSendingResetEmail}
            >
              {isSendingResetEmail ? "Sending..." : "Reset password"}
            </Button>
          </div>

          {/* Sign out */}
          <div className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2">
                <LogOut className="h-4 w-4 text-muted-foreground" />
              </div>

              <div>
                <p className="font-medium">Sign out</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Sign out from your current DevSpace session.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Signing out..." : "Sign out"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-muted-foreground" />

            <CardTitle>Appearance</CardTitle>
          </div>

          <CardDescription>
            Choose how DevSpace should look across the application.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <RadioGroup
            value={selectedTheme}
            onValueChange={setTheme}
            className="grid gap-4 md:grid-cols-3"
          >
            {/* Light */}
            <Label htmlFor="theme-light" className="cursor-pointer">
              <Card className="transition-colors hover:border-primary">
                <CardContent className="flex items-center gap-3 p-4">
                  <RadioGroupItem value="light" id="theme-light" />

                  <Sun className="h-5 w-5" />

                  <div>
                    <p className="font-medium">Light</p>

                    <p className="text-xs text-muted-foreground">
                      Always use light mode.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Label>

            {/* Dark */}
            <Label htmlFor="theme-dark" className="cursor-pointer">
              <Card className="transition-colors hover:border-primary">
                <CardContent className="flex items-center gap-3 p-4">
                  <RadioGroupItem value="dark" id="theme-dark" />

                  <Moon className="h-5 w-5" />

                  <div>
                    <p className="font-medium">Dark</p>

                    <p className="text-xs text-muted-foreground">
                      Always use dark mode.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Label>

            {/* System */}
            <Label htmlFor="theme-system" className="cursor-pointer">
              <Card className="transition-colors hover:border-primary">
                <CardContent className="flex items-center gap-3 p-4">
                  <RadioGroupItem value="system" id="theme-system" />

                  <Monitor className="h-5 w-5" />

                  <div>
                    <p className="font-medium">System</p>

                    <p className="text-xs text-muted-foreground">
                      Follow your device preference.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Label>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}
