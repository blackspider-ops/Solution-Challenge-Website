"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Search, Shield, UserCog, User, CheckCircle, XCircle, Mail } from "lucide-react";
import { updateUserRole } from "@/lib/actions/users";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Role } from "@prisma/client";

type UserData = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  createdAt: Date;
  emailVerified: Date | null;
  image: string | null;
  registration: {
    id: string;
    status: string;
    createdAt: Date;
  } | null;
  accounts: {
    provider: string;
  }[];
};

export function UserManagement({ users, currentUser }: { 
  users: UserData[];
  currentUser: { name: string | null; email: string | null };
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [registrationFilter, setRegistrationFilter] = useState<string>("all");

  // Check if current user is super admin
  const isSuperAdmin = 
    currentUser.name === "Tejas Singhal" && 
    currentUser.email?.endsWith("@psu.edu");

  function handleRoleChange(userId: string, userName: string, newRole: Role) {
    startTransition(async () => {
      const result = await updateUserRole(userId, newRole);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success(`${userName}'s role updated to ${newRole}`);
        router.refresh();
      }
    });
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    const matchesRegistration =
      registrationFilter === "all" ||
      (registrationFilter === "registered" && user.registration) ||
      (registrationFilter === "unregistered" && !user.registration);

    return matchesSearch && matchesRole && matchesRegistration;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="participant">Participants</SelectItem>
            <SelectItem value="volunteer">Volunteers</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
          </SelectContent>
        </Select>

        <Select value={registrationFilter} onValueChange={setRegistrationFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="registered">Registered</SelectItem>
            <SelectItem value="unregistered">Not Registered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* User List */}
      <div className="space-y-3">
        {filteredUsers.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No users found matching your filters
          </Card>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Avatar */}
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                  )}

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-foreground">
                        {user.name || "Anonymous"}
                      </p>
                      
                      {/* Role Badge */}
                      <Badge
                        variant={
                          user.role === "admin"
                            ? "default"
                            : user.role === "volunteer"
                            ? "secondary"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {user.role === "admin" && <Shield className="w-3 h-3 mr-1" />}
                        {user.role === "volunteer" && <UserCog className="w-3 h-3 mr-1" />}
                        {user.role}
                      </Badge>

                      {/* Registration Status */}
                      {user.registration ? (
                        <Badge variant="default" className="text-xs bg-emerald-500">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Registered
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-orange-600 border-orange-600">
                          <XCircle className="w-3 h-3 mr-1" />
                          Not Registered
                        </Badge>
                      )}

                      {/* Email Verified */}
                      {user.emailVerified && (
                        <Badge variant="outline" className="text-xs">
                          <Mail className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mt-1">{user.email}</p>

                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                      {user.accounts.length > 0 && (
                        <span>
                          • Via {user.accounts.map((a) => a.provider).join(", ")}
                        </span>
                      )}
                      {user.registration && (
                        <span>
                          • Registered {new Date(user.registration.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Role Management */}
                <div className="flex items-center gap-2 shrink-0">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={isPending || (user.role === "admin" && !isSuperAdmin)}
                      >
                        Change Role
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Change User Role</AlertDialogTitle>
                        <AlertDialogDescription>
                          Select a new role for {user.name || user.email}
                          {user.role === "admin" && !isSuperAdmin && (
                            <span className="block mt-2 text-amber-600">
                              ⚠️ Only the super admin can change admin roles
                            </span>
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <div className="space-y-3 py-4">
                        <Button
                          variant="outline"
                          className={`w-full justify-start gap-2 ${
                            user.role === "admin" 
                              ? "bg-purple-500 text-white hover:bg-purple-600 border-purple-500" 
                              : "hover:bg-muted"
                          }`}
                          onClick={() => handleRoleChange(user.id, user.name || user.email, "admin")}
                          disabled={user.role === "admin"}
                        >
                          <Shield className="w-4 h-4" />
                          <div className="text-left">
                            <p className="font-medium">Admin</p>
                            <p className={`text-xs ${user.role === "admin" ? "text-purple-100" : "text-muted-foreground"}`}>
                              Full access to admin panel
                            </p>
                          </div>
                        </Button>

                        <Button
                          variant="outline"
                          className={`w-full justify-start gap-2 ${
                            user.role === "volunteer" 
                              ? "bg-blue-500 text-white hover:bg-blue-600 border-blue-500" 
                              : "hover:bg-muted"
                          }`}
                          onClick={() => handleRoleChange(user.id, user.name || user.email, "volunteer")}
                          disabled={user.role === "volunteer" || (user.role === "admin" && !isSuperAdmin)}
                        >
                          <UserCog className="w-4 h-4" />
                          <div className="text-left">
                            <p className="font-medium">Volunteer</p>
                            <p className={`text-xs ${user.role === "volunteer" ? "text-blue-100" : "text-muted-foreground"}`}>
                              Can check-in participants
                            </p>
                          </div>
                        </Button>

                        <Button
                          variant="outline"
                          className={`w-full justify-start gap-2 ${
                            user.role === "participant" 
                              ? "bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-500" 
                              : "hover:bg-muted"
                          }`}
                          onClick={() => handleRoleChange(user.id, user.name || user.email, "participant")}
                          disabled={user.role === "participant" || (user.role === "admin" && !isSuperAdmin)}
                        >
                          <User className="w-4 h-4" />
                          <div className="text-left">
                            <p className="font-medium">Participant</p>
                            <p className={`text-xs ${user.role === "participant" ? "text-emerald-100" : "text-muted-foreground"}`}>
                              Standard user access
                            </p>
                          </div>
                        </Button>
                      </div>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground text-center">
        Showing {filteredUsers.length} of {users.length} users
      </p>
    </div>
  );
}
