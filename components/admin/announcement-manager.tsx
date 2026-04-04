"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { announcementSchema, type AnnouncementInput } from "@/lib/schemas/announcement";
import {
  createAnnouncement,
  updateAnnouncement,
  toggleAnnouncementPublished,
  toggleAnnouncementPinned,
  deleteAnnouncement,
  sendAnnouncementAsEmail,
} from "@/lib/actions/announcement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Plus, Eye, EyeOff, Pencil, Trash2, X, Megaphone, Pin, Mail } from "lucide-react";

type Announcement = {
  id: string;
  title: string;
  body: string;
  published: boolean;
  pinned: boolean;
  audience: string;
  createdAt: Date;
  createdBy: { name: string | null };
};

type Mode = "idle" | "create" | { edit: Announcement };

export function AnnouncementManager({ announcements }: { announcements: Announcement[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<Mode>("idle");

  const isEditing = typeof mode === "object" && "edit" in mode;
  const editTarget = isEditing ? mode.edit : null;

  const form = useForm<AnnouncementInput>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { title: "", body: "", published: false, audience: "all" },
  });

  function openCreate() {
    form.reset({ title: "", body: "", published: false, audience: "all" });
    setMode("create");
  }

  function openEdit(a: Announcement) {
    form.reset({ title: a.title, body: a.body, published: a.published, pinned: a.pinned, audience: a.audience as "all" | "registered" | "volunteers" });
    setMode({ edit: a });
  }

  function closeForm() {
    setMode("idle");
    form.reset();
  }

  function handleSubmit(data: AnnouncementInput) {
    startTransition(async () => {
      try {
        if (isEditing && editTarget) {
          const result = await updateAnnouncement(editTarget.id, data);
          if ("error" in result) { toast.error(result.error); return; }
          toast.success("Announcement updated");
        } else {
          const result = await createAnnouncement(data);
          if ("error" in result) { toast.error(result.error); return; }
          toast.success("Announcement created");
        }
        closeForm();
        router.refresh();
      } catch {
        toast.error("Network error — please try again");
      }
    });
  }

  function handleToggle(id: string, currentlyPublished: boolean) {
    startTransition(async () => {
      try {
        const result = await toggleAnnouncementPublished(id);
        if ("error" in result) { toast.error(result.error); return; }
        
        // If we just published it, send email to all registered users
        if (!currentlyPublished) {
          toast.promise(
            sendAnnouncementAsEmail(id),
            {
              loading: "Sending email to registered participants...",
              success: (emailResult) => {
                if ("error" in emailResult) {
                  return `Published, but email failed: ${emailResult.error}`;
                }
                return `Published and emailed to ${emailResult.data.sent} participants!`;
              },
              error: "Published, but email failed",
            }
          );
        } else {
          toast.success("Announcement unpublished");
        }
        
        router.refresh();
      } catch {
        toast.error("Network error — please try again");
      }
    });
  }

  function handleSendEmail(id: string, title: string) {
    if (!confirm(`Send "${title}" to all registered participants?`)) return;
    startTransition(async () => {
      try {
        const result = await sendAnnouncementAsEmail(id);
        if ("error" in result) { 
          toast.error(result.error); 
          return; 
        }
        toast.success(`Email sent to ${result.data.sent} participants!`);
      } catch {
        toast.error("Network error — please try again");
      }
    });
  }

  function handlePin(id: string) {
    startTransition(async () => {
      try {
        const result = await toggleAnnouncementPinned(id);
        if ("error" in result) { toast.error(result.error); return; }
        router.refresh();
      } catch {
        toast.error("Network error — please try again");
      }
    });
  }

  function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      try {
        const result = await deleteAnnouncement(id);
        if ("error" in result) { toast.error(result.error); return; }
        toast.success("Announcement deleted");
        router.refresh();
      } catch {
        toast.error("Network error — please try again");
      }
    });
  }

  const showForm = mode === "create" || isEditing;

  return (
    <div className="space-y-4">
      {/* Create button */}
      {!showForm && (
        <Button
          onClick={openCreate}
          className="gap-2 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
        >
          <Plus className="w-4 h-4" />
          New Announcement
        </Button>
      )}

      {/* Create / Edit form */}
      {showForm && (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              {isEditing ? "Edit Announcement" : "New Announcement"}
            </h2>
            <button
              onClick={closeForm}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="ann-title">Title</Label>
              <Input
                id="ann-title"
                {...form.register("title")}
                placeholder="Announcement title"
                autoFocus
              />
              {form.formState.errors.title && (
                <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ann-body">Body</Label>
              <Textarea
                id="ann-body"
                {...form.register("body")}
                placeholder="Write your announcement..."
                rows={5}
              />
              {form.formState.errors.body && (
                <p className="text-xs text-destructive">{form.formState.errors.body.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ann-audience">Send to</Label>
              <select
                id="ann-audience"
                {...form.register("audience")}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="all">All Registered Users</option>
                <option value="registered">Registered Participants Only</option>
                <option value="volunteers">Volunteers Only</option>
              </select>
              <p className="text-xs text-muted-foreground">
                Choose who will receive this announcement via email
              </p>
            </div>

            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer w-fit">
              <input
                type="checkbox"
                {...form.register("published")}
                className="rounded border-border"
              />
              Publish immediately (visible to participants)
            </label>

            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer w-fit">
              <input
                type="checkbox"
                {...form.register("pinned")}
                className="rounded border-border"
              />
              Pin to top of announcements
            </label>

            <div className="flex gap-2 pt-1">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground"
              >
                {isPending
                  ? (isEditing ? "Saving..." : "Creating...")
                  : (isEditing ? "Save changes" : "Create")}
              </Button>
              <Button type="button" variant="outline" onClick={closeForm} disabled={isPending}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {announcements.length === 0 && !showForm ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Megaphone className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">No announcements yet. Create one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div
              key={a.id}
              className={`rounded-2xl border bg-card p-5 transition-colors ${
                a.pinned
                  ? "border-primary/30 bg-primary/5"
                  : a.published ? "border-border" : "border-dashed border-border/60"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-semibold text-foreground">{a.title}</p>
                    {a.pinned && (
                      <span className="text-xs font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <Pin className="w-3 h-3" /> Pinned
                      </span>
                    )}
                    <Badge variant={a.published ? "default" : "secondary"}>
                      {a.published ? "Published" : "Draft"}
                    </Badge>
                    {a.audience !== "all" && (
                      <Badge variant="outline" className="text-xs">
                        {a.audience === "registered" ? "Participants" : "Volunteers"}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{a.body}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    By {a.createdBy.name ?? "Admin"} ·{" "}
                    {new Date(a.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {a.published && (
                    <button
                      onClick={() => handleSendEmail(a.id, a.title)}
                      disabled={isPending}
                      title="Send email to all registered participants"
                      className="p-2 rounded-lg text-muted-foreground hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handlePin(a.id)}
                    disabled={isPending}
                    title={a.pinned ? "Unpin" : "Pin to top"}
                    className={`p-2 rounded-lg transition-colors ${
                      a.pinned
                        ? "text-primary bg-primary/10 hover:bg-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggle(a.id, a.published)}
                    disabled={isPending}
                    title={a.published ? "Unpublish" : "Publish and email participants"}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    {a.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => openEdit(a)}
                    disabled={isPending}
                    title="Edit"
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(a.id, a.title)}
                    disabled={isPending}
                    title="Delete"
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
