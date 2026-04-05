"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Edit2, Save, X, Trash2, Plus, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateTrack, deleteTrack, createTrack } from "@/lib/actions/content";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Track = {
  id: string;
  slug: string;
  name: string;
  description: string;
  fullDescription: string;
  promptContent: string;
  icon: string;
  gradient: string;
  order: number;
  visible: boolean;
};

const ICON_OPTIONS = [
  { value: "Heart", label: "Heart (Health & Wellbeing)" },
  { value: "Leaf", label: "Leaf (Environment)" },
  { value: "GraduationCap", label: "Graduation Cap (Education)" },
  { value: "ShieldCheck", label: "Shield (Safety & Security)" },
  { value: "Accessibility", label: "Accessibility" },
  { value: "Zap", label: "Zap (Energy)" },
  { value: "Users", label: "Users (Community)" },
  { value: "Globe", label: "Globe (Global)" },
  { value: "Lightbulb", label: "Lightbulb (Innovation)" },
  { value: "Code", label: "Code (Technology)" },
];

const GRADIENT_OPTIONS = [
  { value: "from-rose-500 to-pink-600", label: "Rose to Pink" },
  { value: "from-emerald-500 to-teal-600", label: "Emerald to Teal" },
  { value: "from-blue-500 to-indigo-600", label: "Blue to Indigo" },
  { value: "from-amber-500 to-orange-600", label: "Amber to Orange" },
  { value: "from-purple-500 to-pink-600", label: "Purple to Pink" },
  { value: "from-cyan-500 to-blue-600", label: "Cyan to Blue" },
  { value: "from-green-500 to-emerald-600", label: "Green to Emerald" },
  { value: "from-red-500 to-rose-600", label: "Red to Rose" },
];

export function TrackEditor({ tracks }: { tracks: Track[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Track>>({});
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const router = useRouter();

  function startEdit(track: Track) {
    setEditingId(track.id);
    setFormData({
      name: track.name,
      description: track.description,
      fullDescription: track.fullDescription,
      promptContent: track.promptContent,
      icon: track.icon,
      gradient: track.gradient,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setFormData({});
  }

  function saveTrack(id: string) {
    startTransition(async () => {
      try {
        const result = await updateTrack(id, formData);
        if ("error" in result) {
          toast.error(result.error);
          return;
        }
        toast.success("Track updated successfully");
        setEditingId(null);
        setFormData({});
        router.refresh();
      } catch {
        toast.error("Network error — please try again");
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        const result = await deleteTrack(id);
        if ("error" in result) {
          toast.error(result.error);
          return;
        }
        toast.success("Track deleted successfully");
        setDeleteId(null);
        router.refresh();
      } catch {
        toast.error("Network error — please try again");
      }
    });
  }

  function startNewTrack() {
    setShowNewForm(true);
    setFormData({
      name: "",
      slug: "",
      description: "",
      fullDescription: "",
      promptContent: "",
      icon: "Zap",
      gradient: "from-blue-500 to-indigo-600",
    });
  }

  function cancelNewTrack() {
    setShowNewForm(false);
    setFormData({});
  }

  function createNewTrack() {
    if (!formData.name || !formData.slug) {
      toast.error("Name and slug are required");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createTrack(formData as Omit<Track, "id" | "order" | "visible">);
        if ("error" in result) {
          toast.error(result.error);
          return;
        }
        toast.success("Track created successfully");
        setShowNewForm(false);
        setFormData({});
        router.refresh();
      } catch {
        toast.error("Network error — please try again");
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Add New Track Button */}
      <div className="flex justify-end">
        <Button
          onClick={startNewTrack}
          disabled={showNewForm}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Track
        </Button>
      </div>

      {/* New Track Form */}
      {showNewForm && (
        <div className="rounded-2xl border-2 border-primary/30 bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-foreground">Create New Track</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={cancelNewTrack}
                disabled={isPending}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={createNewTrack}
                disabled={isPending}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700"
              >
                <Save className="w-4 h-4" />
                Create
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="new-name">Track Name</Label>
              <Input
                id="new-name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Health & Wellbeing"
              />
            </div>

            <div>
              <Label htmlFor="new-slug">Slug (URL)</Label>
              <Input
                id="new-slug"
                value={formData.slug || ""}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                placeholder="e.g., health-wellbeing"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="new-icon">Icon</Label>
              <Select
                value={formData.icon || "Zap"}
                onValueChange={(value) => setFormData({ ...formData, icon: value })}
              >
                <SelectTrigger id="new-icon">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="new-gradient">Gradient</Label>
              <Select
                value={formData.gradient || "from-blue-500 to-indigo-600"}
                onValueChange={(value) => setFormData({ ...formData, gradient: value })}
              >
                <SelectTrigger id="new-gradient">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GRADIENT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded bg-gradient-to-r ${opt.value}`} />
                        {opt.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="new-desc">Short Description</Label>
            <Textarea
              id="new-desc"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Short description for track cards"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="new-full">Full Description</Label>
            <Textarea
              id="new-full"
              value={formData.fullDescription || ""}
              onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
              placeholder="Detailed description for track detail page"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="new-prompt">Challenge Prompt</Label>
            <Textarea
              id="new-prompt"
              value={formData.promptContent || ""}
              onChange={(e) => setFormData({ ...formData, promptContent: e.target.value })}
              placeholder="Challenge prompt / problem statement"
              rows={6}
            />
          </div>
        </div>
      )}

      {/* Existing Tracks */}
      {tracks.map((track) => {
        const isEditing = editingId === track.id;

        return (
          <div
            key={track.id}
            className="rounded-2xl border bg-card p-6 space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GripVertical className="w-5 h-5 text-muted-foreground cursor-move" />
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${track.gradient} flex items-center justify-center text-white font-bold`}>
                  {track.icon.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{track.name}</h3>
                  <p className="text-xs text-muted-foreground">/{track.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(track)}
                      className="gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(track.id)}
                      className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={cancelEdit}
                      disabled={isPending}
                      className="gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => saveTrack(track.id)}
                      disabled={isPending}
                      className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Content */}
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor={`name-${track.id}`}>Track Name</Label>
                  <Input
                    id={`name-${track.id}`}
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Track name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`icon-${track.id}`}>Icon</Label>
                    <Select
                      value={formData.icon || track.icon}
                      onValueChange={(value) => setFormData({ ...formData, icon: value })}
                    >
                      <SelectTrigger id={`icon-${track.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ICON_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor={`gradient-${track.id}`}>Gradient</Label>
                    <Select
                      value={formData.gradient || track.gradient}
                      onValueChange={(value) => setFormData({ ...formData, gradient: value })}
                    >
                      <SelectTrigger id={`gradient-${track.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GRADIENT_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded bg-gradient-to-r ${opt.value}`} />
                              {opt.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor={`desc-${track.id}`}>Short Description</Label>
                  <Textarea
                    id={`desc-${track.id}`}
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Short description for track cards"
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Shown on homepage track cards
                  </p>
                </div>

                <div>
                  <Label htmlFor={`full-${track.id}`}>Full Description</Label>
                  <Textarea
                    id={`full-${track.id}`}
                    value={formData.fullDescription || ""}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    placeholder="Detailed description for track detail page"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Shown on track detail page
                  </p>
                </div>

                <div>
                  <Label htmlFor={`prompt-${track.id}`}>Challenge Prompt</Label>
                  <Textarea
                    id={`prompt-${track.id}`}
                    value={formData.promptContent || ""}
                    onChange={(e) => setFormData({ ...formData, promptContent: e.target.value })}
                    placeholder="Challenge prompt / problem statement"
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The actual challenge participants will work on
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Icon</p>
                    <p className="text-foreground">{track.icon}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Gradient</p>
                    <div className={`w-20 h-6 rounded bg-gradient-to-r ${track.gradient}`} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Short Description</p>
                  <p className="text-foreground">{track.description}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Full Description</p>
                  <p className="text-foreground">{track.fullDescription}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Challenge Prompt</p>
                  <p className="text-foreground whitespace-pre-wrap">{track.promptContent}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Track?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this track. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
