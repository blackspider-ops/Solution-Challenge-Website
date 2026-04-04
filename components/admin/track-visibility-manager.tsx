"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { setTrackVisibility, setAllTracksVisibility } from "@/lib/actions/tracks";
import Link from "next/link";

type TrackRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  visible: boolean;
  icon: string;
  gradient: string;
};

export function TrackVisibilityManager({ tracks }: { tracks: TrackRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    action: () => void;
  }>({
    open: false,
    title: "",
    description: "",
    action: () => {},
  });

  function toggleTrack(id: string, currentlyVisible: boolean) {
    startTransition(async () => {
      try {
        const result = await setTrackVisibility(id, !currentlyVisible);
        if ("error" in result) { toast.error(result.error); return; }
        toast.success(currentlyVisible ? "Track hidden" : "Track is now public");
        router.refresh();
      } catch {
        toast.error("Network error — please try again");
      }
    });
  }

  function releaseAll() {
    setConfirmDialog({
      open: true,
      title: "Make all tracks visible?",
      description: "This will make ALL tracks publicly accessible to participants. They will be able to view track details and register for them.",
      action: () => {
        startTransition(async () => {
          try {
            const result = await setAllTracksVisibility(true);
            if ("error" in result) { toast.error(result.error); return; }
            toast.success(`All ${(result as { data: { count: number } }).data.count} tracks are now public`);
            router.refresh();
          } catch {
            toast.error("Network error — please try again");
          }
        });
      },
    });
  }

  function hideAll() {
    setConfirmDialog({
      open: true,
      title: "Hide all tracks?",
      description: "This will hide ALL tracks from public users. Only admins will be able to preview them. Participants will see a 'Track Locked' message.",
      action: () => {
        startTransition(async () => {
          try {
            const result = await setAllTracksVisibility(false);
            if ("error" in result) { toast.error(result.error); return; }
            toast.success("All tracks hidden");
            router.refresh();
          } catch {
            toast.error("Network error — please try again");
          }
        });
      },
    });
  }

  return (
    <>
      <div className="space-y-4">
        {/* Bulk actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={releaseAll}
            disabled={isPending}
            className="gap-2 text-emerald-700 border-emerald-500/30 hover:bg-emerald-500/10"
          >
            <Eye className="w-4 h-4" />
            Release all tracks
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={hideAll}
            disabled={isPending}
            className="gap-2 text-amber-700 border-amber-500/30 hover:bg-amber-500/10"
          >
            <EyeOff className="w-4 h-4" />
            Hide all tracks
          </Button>
        </div>

        {/* Track list */}
        <div className="space-y-3">
          {tracks.map((track) => (
            <div
              key={track.id}
              className={`rounded-2xl border bg-card p-5 flex items-center gap-4 transition-colors ${
                track.visible ? "border-emerald-500/20" : "border-dashed border-border/60"
              }`}
            >
              {/* Status indicator */}
              <div className={`w-3 h-3 rounded-full shrink-0 ${track.visible ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-foreground">{track.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    track.visible
                      ? "bg-emerald-500/10 text-emerald-700"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {track.visible ? "Public" : "Hidden"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{track.description}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Preview link — always works for admins */}
                <Link
                  href={`/tracks/${track.slug}`}
                  target="_blank"
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Preview track page"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>

                {/* Toggle visibility */}
                <button
                  onClick={() => toggleTrack(track.id, track.visible)}
                  disabled={isPending}
                  title={track.visible ? "Hide from public" : "Make public"}
                  className={`p-2 rounded-lg transition-colors ${
                    track.visible
                      ? "text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {track.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDialog.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                confirmDialog.action();
                setConfirmDialog({ ...confirmDialog, open: false });
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
