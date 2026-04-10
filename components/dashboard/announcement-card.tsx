"use client";

import { useState } from "react";
import { Megaphone, Pin, Clock, ChevronDown, ChevronUp } from "lucide-react";

type AnnouncementCardProps = {
  announcement: {
    id: string;
    title: string;
    body: string;
    pinned: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: { name: string | null };
  };
};

export function AnnouncementCard({ announcement: a }: AnnouncementCardProps) {
  const [isExpanded, setIsExpanded] = useState(a.pinned); // Pinned announcements are expanded by default
  const wasEdited = a.updatedAt.getTime() - a.createdAt.getTime() > 5000;

  return (
    <div
      className={`rounded-2xl border bg-card transition-colors ${
        a.pinned
          ? "border-primary/30 bg-primary/5"
          : "border-border hover:border-border/80"
      }`}
    >
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-start gap-3 text-left"
      >
        {/* Icon */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
          a.pinned ? "bg-primary/10" : "bg-muted"
        }`}>
          {a.pinned ? (
            <Pin className="w-4 h-4 text-primary" />
          ) : (
            <Megaphone className="w-4 h-4 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground">{a.title}</h3>
              {a.pinned && (
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Pinned
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1 shrink-0">
              <Clock className="w-3 h-3" />
              {new Date(a.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Preview when collapsed */}
          {!isExpanded && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {a.body}
            </p>
          )}
        </div>

        {/* Expand/Collapse Icon */}
        <div className="shrink-0 mt-1">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Full body - Only visible when expanded */}
      {isExpanded && (
        <div className="px-6 pb-6 -mt-3">
          <div className="pl-12">
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {a.body}
            </p>

            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
              {a.createdBy.name && <span>Posted by {a.createdBy.name}</span>}
              {wasEdited && <span>· Edited {new Date(a.updatedAt).toLocaleDateString()}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
