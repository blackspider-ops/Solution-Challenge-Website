import { requireAdmin } from "@/lib/admin-guard";
import { getRooms } from "@/lib/actions/rooms";
import { RoomManager } from "@/components/admin/room-manager";
import { Card } from "@/components/ui/card";
import { DoorOpen, Users, CheckCircle } from "lucide-react";

export default async function RoomsPage() {
  await requireAdmin();

  const roomsResult = await getRooms();
  const rooms = "data" in roomsResult ? roomsResult.data : [];

  const totalRooms = rooms.length;
  const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);
  
  // Calculate total people currently booked (sum of all team sizes across all rooms)
  const totalBooked = rooms.reduce((sum, room) => {
    const roomOccupancy = room.bookings.reduce((bookingSum, booking) => {
      const teamSize = 1 + booking.team.members.length; // leader + members
      return bookingSum + teamSize;
    }, 0);
    return sum + roomOccupancy;
  }, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hacking Spaces</h1>
        <p className="text-muted-foreground mt-1">
          Manage rooms and hacking spaces for teams
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <DoorOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalRooms}</p>
              <p className="text-xs text-muted-foreground">Total Rooms</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCapacity}</p>
              <p className="text-xs text-muted-foreground">Total Capacity</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalBooked}</p>
              <p className="text-xs text-muted-foreground">Booked</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Room Manager */}
      <RoomManager rooms={rooms} />
    </div>
  );
}
