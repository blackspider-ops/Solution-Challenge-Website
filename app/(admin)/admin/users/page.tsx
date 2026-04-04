import { requireAdmin } from "@/lib/admin-guard";
import { getAllUsers, getUserStats } from "@/lib/actions/users";
import { UserManagement } from "@/components/admin/user-management";
import { Card } from "@/components/ui/card";
import { Users, UserCheck, UserX, Shield, UserCog } from "lucide-react";

export default async function AdminUsersPage() {
  await requireAdmin();

  const [usersResult, statsResult] = await Promise.all([
    getAllUsers(),
    getUserStats(),
  ]);

  if ("error" in usersResult || "error" in statsResult) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load users</p>
      </div>
    );
  }

  const users = usersResult.data;
  const stats = statsResult.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage user accounts and permissions
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
              <p className="text-xs text-muted-foreground">Total Users</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.registeredUsers}</p>
              <p className="text-xs text-muted-foreground">Registered</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
              <UserX className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.unregisteredUsers}</p>
              <p className="text-xs text-muted-foreground">Not Registered</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.adminUsers}</p>
              <p className="text-xs text-muted-foreground">Admins</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <UserCog className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.volunteerUsers}</p>
              <p className="text-xs text-muted-foreground">Volunteers</p>
            </div>
          </div>
        </Card>
      </div>

      {/* User List */}
      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm">
        <p className="font-medium text-blue-700 mb-1">User Management</p>
        <p className="text-blue-600 text-xs">
          View all users, their registration status, and manage roles. Grant admin or volunteer access as needed.
        </p>
      </div>

      <UserManagement users={users} />
    </div>
  );
}
