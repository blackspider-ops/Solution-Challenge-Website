"use client";

import { useState, useTransition, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Plus, Pencil, Trash2, DoorOpen, QrCode, Users, Mail, Printer, X } from "lucide-react";
import { createRoom, updateRoom, deleteRoom, removeTeamFromRoom } from "@/lib/actions/rooms";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import QRCodeLib from "qrcode";

type Room = {
  id: string;
  name: string;
  description: string | null;
  capacity: number;
  qrToken: string;
  active: boolean;
  bookings: Array<{
    id: string;
    team: {
      name: string;
      leader: {
        name: string | null;
        email: string;
      };
      members: Array<{ id: string }>; // Include members to calculate team size
    };
  }>;
};

export function RoomManager({ rooms }: { rooms: Room[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: 1,
  });

  // Generate QR codes for all rooms
  useEffect(() => {
    async function generateQRCodes() {
      const codes: Record<string, string> = {};
      for (const room of rooms) {
        try {
          const qrDataUrl = await QRCodeLib.toDataURL(room.qrToken, {
            width: 300,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
          });
          codes[room.id] = qrDataUrl;
        } catch (error) {
          console.error(`Failed to generate QR for room ${room.id}:`, error);
        }
      }
      setQrCodes(codes);
    }

    if (rooms.length > 0) {
      generateQRCodes();
    }
  }, [rooms]);

  function handlePrint(room: Room) {
    const qrDataUrl = qrCodes[room.id];
    if (!qrDataUrl) {
      toast.error("QR code not ready yet");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to print");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print QR Code - ${room.name}</title>
          <style>
            @media print {
              @page {
                size: A4;
                margin: 20mm;
              }
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 40px;
              text-align: center;
            }
            .container {
              max-width: 600px;
              border: 2px solid #e5e7eb;
              border-radius: 16px;
              padding: 40px;
              background: white;
            }
            h1 {
              font-size: 32px;
              font-weight: bold;
              margin: 0 0 8px 0;
              color: #111827;
            }
            .capacity {
              font-size: 18px;
              color: #6b7280;
              margin: 0 0 32px 0;
            }
            .qr-container {
              margin: 32px 0;
              padding: 20px;
              background: #f9fafb;
              border-radius: 12px;
            }
            img {
              max-width: 100%;
              height: auto;
              display: block;
              margin: 0 auto;
            }
            .instructions {
              font-size: 16px;
              color: #374151;
              margin-top: 24px;
              line-height: 1.6;
            }
            .token {
              font-family: 'Courier New', monospace;
              font-size: 14px;
              color: #6b7280;
              margin-top: 16px;
              padding: 8px 12px;
              background: #f3f4f6;
              border-radius: 6px;
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${room.name}</h1>
            <p class="capacity">Capacity: ${room.capacity} team${room.capacity !== 1 ? 's' : ''}</p>
            ${room.description ? `<p class="instructions">${room.description}</p>` : ''}
            <div class="qr-container">
              <img src="${qrDataUrl}" alt="QR Code for ${room.name}" />
            </div>
            <p class="instructions">
              <strong>Scan this QR code to book this hacking space</strong><br>
              Teams can scan this code from their Team page to reserve this room.
            </p>
            <div class="token">Token: ${room.qrToken}</div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  function resetForm() {
    setFormData({
      name: "",
      description: "",
      capacity: 1,
    });
    setEditingRoom(null);
  }

  function handleCreate() {
    if (!formData.name.trim()) {
      toast.error("Room name is required");
      return;
    }

    startTransition(async () => {
      const result = await createRoom(formData);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Room created successfully");
        setIsCreateOpen(false);
        resetForm();
        router.refresh();
      }
    });
  }

  function handleUpdate() {
    if (!editingRoom) return;

    startTransition(async () => {
      const result = await updateRoom(editingRoom.id, formData);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Room updated successfully");
        setEditingRoom(null);
        resetForm();
        router.refresh();
      }
    });
  }

  function handleDelete(id: string, name: string) {
    startTransition(async () => {
      const result = await deleteRoom(id);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success(`Deleted "${name}"`);
        router.refresh();
      }
    });
  }

  function handleToggleActive(id: string, active: boolean) {
    startTransition(async () => {
      const result = await updateRoom(id, { active });
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success(active ? "Room activated" : "Room deactivated");
        router.refresh();
      }
    });
  }

  function handleRemoveTeam(bookingId: string, teamName: string, roomName: string) {
    startTransition(async () => {
      const result = await removeTeamFromRoom(bookingId);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success(`Removed "${teamName}" from ${roomName}`);
        router.refresh();
      }
    });
  }

  function openEditDialog(r: Room) {
    setEditingRoom(r);
    setFormData({
      name: r.name,
      description: r.description || "",
      capacity: r.capacity,
    });
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Rooms</h2>
          <p className="text-sm text-muted-foreground">
            Manage hacking spaces and their QR codes
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Room</DialogTitle>
              <DialogDescription>
                Add a new hacking space for teams to book
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Room Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Innovation Lab A"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the room features..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="capacity">Team Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  How many teams can book this room
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={isPending}>
                Create Room
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Room List */}
      {rooms.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <DoorOpen className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No rooms yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Create rooms for teams to book hacking spaces
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {rooms.map((r) => {
            // Calculate current occupancy (sum of all team sizes)
            const currentOccupancy = r.bookings.reduce((sum, booking) => {
              const teamSize = 1 + booking.team.members.length; // leader + members
              return sum + teamSize;
            }, 0);
            
            return (
            <Card key={r.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="font-medium">{r.name}</h3>
                    <Badge variant={r.active ? "default" : "secondary"}>
                      {r.active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">
                      {currentOccupancy}/{r.capacity} people
                    </Badge>
                    {r.bookings.length > 0 && (
                      <Badge variant="secondary">
                        {r.bookings.length} {r.bookings.length === 1 ? "team" : "teams"}
                      </Badge>
                    )}
                  </div>
                  
                  {r.description && (
                    <p className="text-sm text-muted-foreground mb-2">{r.description}</p>
                  )}

                  {/* QR Code Display */}
                  <div className="mt-3 mb-3">
                    {qrCodes[r.id] ? (
                      <div className="inline-block p-3 bg-white rounded-lg border border-border">
                        <img 
                          src={qrCodes[r.id]} 
                          alt={`QR Code for ${r.name}`}
                          className="w-32 h-32"
                        />
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                        <QrCode className="w-4 h-4 animate-pulse" />
                        <span>Generating QR code...</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <code className="bg-muted px-2 py-0.5 rounded">{r.qrToken}</code>
                  </div>

                  {r.bookings.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground">Booked by:</p>
                      {r.bookings.map((booking) => {
                        const teamSize = 1 + booking.team.members.length;
                        return (
                        <div key={booking.id} className="text-xs bg-muted/50 rounded p-2 flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium">{booking.team.name}</p>
                              <span className="text-muted-foreground">
                                {teamSize} {teamSize === 1 ? "person" : "people"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
                              <Users className="w-3 h-3" />
                              <span>{booking.team.leader.name || "Team Leader"}</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              <span>{booking.team.leader.email}</span>
                            </div>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 shrink-0"
                                disabled={isPending}
                              >
                                <X className="w-3.5 h-3.5 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Team from Room</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove "{booking.team.name}" from {r.name}? 
                                  The team will be able to book a different room after removal.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRemoveTeam(booking.id, booking.team.name, r.name)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Remove Team
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )})}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePrint(r)}
                    disabled={!qrCodes[r.id]}
                    className="gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Print QR
                  </Button>

                  <Switch
                    checked={r.active}
                    onCheckedChange={(checked) => handleToggleActive(r.id, checked)}
                    disabled={isPending}
                  />

                  <Dialog
                    open={editingRoom?.id === r.id}
                    onOpenChange={(open) => {
                      if (!open) {
                        setEditingRoom(null);
                        resetForm();
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(r)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Room</DialogTitle>
                        <DialogDescription>
                          Update room details
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4 py-4">
                        <div>
                          <Label htmlFor="edit-name">Room Name</Label>
                          <Input
                            id="edit-name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                          />
                        </div>

                        <div>
                          <Label htmlFor="edit-description">Description</Label>
                          <Textarea
                            id="edit-description"
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({ ...formData, description: e.target.value })
                            }
                            rows={2}
                          />
                        </div>

                        <div>
                          <Label htmlFor="edit-capacity">Team Capacity</Label>
                          <Input
                            id="edit-capacity"
                            type="number"
                            min="1"
                            max="10"
                            value={formData.capacity}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                capacity: parseInt(e.target.value) || 1,
                              })
                            }
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingRoom(null);
                            resetForm();
                          }}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleUpdate} disabled={isPending}>
                          Update Room
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={isPending}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Room</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{r.name}"? This will also delete
                          all bookings for this room. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(r.id, r.name)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          )})}
        </div>
      )}
    </div>
  );
}
