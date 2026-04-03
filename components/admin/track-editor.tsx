"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Edit2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateTrack } from "@/lib/actions/content";

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

export function TrackEditor({ tracks }: { tracks: Track[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Track>>({});
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function startEdit(track: Track) {
    setEditingId(track.id);
    setFormData({
      name: track.name,
      description: track.description,
      fullDescription: track.fullDescription,
      promptContent: track.promptContent,
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

  return (
    <div className="space-y-4">
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(track)}
                    className="gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
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
    </div>
  );
}
