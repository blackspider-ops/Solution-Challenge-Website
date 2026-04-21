"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { certificateSchema, type CertificateInput } from "@/lib/schemas/certificate";
import {
  createCertificate,
  updateCertificate,
  deleteCertificate,
  sendCertificates,
  searchUsersAndTeams,
} from "@/lib/actions/certificate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Mail, Award, Search, Users, User } from "lucide-react";
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

type Certificate = {
  id: string;
  name: string;
  htmlContent: string;
  createdAt: Date;
  creator: { name: string | null };
  sent: { id: string }[];
};

type Mode = "idle" | "create" | { edit: Certificate };

export function CertificateManager({ certificates }: { certificates: Certificate[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<Mode>("idle");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [sendTarget, setSendTarget] = useState<Certificate | null>(null);
  const [sendAudience, setSendAudience] = useState<string>("checked_in");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    users: Array<{ id: string; name: string; email: string; teamName?: string }>;
    teams: Array<{ id: string; name: string; memberCount: number; trackName?: string }>;
  }>({ users: [], teams: [] });
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectedTeam, setSelectedTeam] = useState<string>("");

  const isEditing = typeof mode === "object" && "edit" in mode;
  const editTarget = isEditing ? mode.edit : null;

  const form = useForm<CertificateInput>({
    resolver: zodResolver(certificateSchema),
    defaultValues: { name: "", htmlContent: "" },
  });

  function openCreate() {
    form.reset({ name: "", htmlContent: getDefaultTemplate() });
    setMode("create");
  }

  function openEdit(cert: Certificate) {
    form.reset({ name: cert.name, htmlContent: cert.htmlContent });
    setMode({ edit: cert });
  }

  function closeForm() {
    setMode("idle");
    form.reset();
  }

  function getDefaultTemplate() {
    return `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Georgia', serif; text-align: center; padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .certificate { background: white; padding: 60px; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 800px; margin: 0 auto; }
    h1 { color: #667eea; font-size: 48px; margin: 0 0 10px 0; }
    h2 { color: #333; font-size: 32px; margin: 30px 0; }
    .name { color: #764ba2; font-size: 42px; font-weight: bold; margin: 20px 0; }
    p { color: #666; font-size: 18px; line-height: 1.6; }
    .footer { margin-top: 50px; padding-top: 30px; border-top: 2px solid #667eea; }
  </style>
</head>
<body>
  <div class="certificate">
    <h1>🏆 Certificate of Achievement</h1>
    <h2>This is to certify that</h2>
    <div class="name">{{name}}</div>
    <p>has successfully participated in the</p>
    <h2>GDG @ Penn State Solution Challenge 2026</h2>
    <p>Team: <strong>{{team}}</strong></p>
    <p>Track: <strong>{{track}}</strong></p>
    <p>We commend their dedication, creativity, and technical excellence in building solutions that address real-world problems using technology.</p>
    <div class="footer">
      {{signature}}
    </div>
  </div>
</body>
</html>`;
  }

  function handleSubmit(data: CertificateInput) {
    startTransition(async () => {
      try {
        if (isEditing && editTarget) {
          const result = await updateCertificate(editTarget.id, data);
          if ("error" in result) { toast.error(result.error); return; }
          toast.success("Certificate updated");
        } else {
          const result = await createCertificate(data);
          if ("error" in result) { toast.error(result.error); return; }
          toast.success("Certificate created");
        }
        closeForm();
        router.refresh();
      } catch {
        toast.error("Network error");
      }
    });
  }

  function handleDelete(id: string, name: string) {
    setDeleteTarget({ id, name });
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        const result = await deleteCertificate(deleteTarget.id);
        if ("error" in result) { toast.error(result.error); return; }
        toast.success("Certificate deleted");
        setDeleteTarget(null);
        router.refresh();
      } catch {
        toast.error("Network error");
      }
    });
  }

  function handleSend(cert: Certificate) {
    setSendTarget(cert);
    setSendAudience("checked_in");
    setSearchQuery("");
    setSearchResults({ users: [], teams: [] });
    setSelectedUsers(new Set());
    setSelectedTeam("");
  }

  async function handleSearch() {
    if (searchQuery.trim().length < 2) {
      toast.error("Enter at least 2 characters to search");
      return;
    }

    startTransition(async () => {
      try {
        const results = await searchUsersAndTeams(searchQuery);
        setSearchResults(results);
      } catch {
        toast.error("Search failed");
      }
    });
  }

  function toggleUser(userId: string) {
    const newSet = new Set(selectedUsers);
    if (newSet.has(userId)) {
      newSet.delete(userId);
    } else {
      newSet.add(userId);
    }
    setSelectedUsers(newSet);
  }

  function confirmSend() {
    if (!sendTarget) return;

    const data: any = {
      certificateId: sendTarget.id,
      audience: sendAudience,
    };

    if (sendAudience === "team") {
      if (!selectedTeam) {
        toast.error("Please select a team");
        return;
      }
      data.teamId = selectedTeam;
    } else if (sendAudience === "individual") {
      if (selectedUsers.size === 0) {
        toast.error("Please select at least one user");
        return;
      }
      data.userIds = Array.from(selectedUsers);
    }

    startTransition(async () => {
      try {
        const result = await sendCertificates(data);
        if ("error" in result) { toast.error(result.error); return; }
        toast.success(`Sent ${result.data.sent} certificates!`);
        setSendTarget(null);
        router.refresh();
      } catch {
        toast.error("Network error");
      }
    });
  }

  const showForm = mode === "create" || isEditing;

  return (
    <>
      <div className="space-y-4">
        {!showForm && (
          <Button onClick={openCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            New Certificate Template
          </Button>
        )}

        {showForm && (
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {isEditing ? "Edit Certificate" : "New Certificate"}
              </h2>
              <button onClick={closeForm} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Certificate Name</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="e.g., Participation Certificate"
                  autoFocus
                />
                {form.formState.errors.name && (
                  <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="html">HTML Content</Label>
                <Textarea
                  id="html"
                  {...form.register("htmlContent")}
                  placeholder="HTML template with {{name}}, {{team}}, {{track}}, {{signature}} placeholders"
                  rows={15}
                  className="font-mono text-xs"
                />
                {form.formState.errors.htmlContent && (
                  <p className="text-xs text-destructive">{form.formState.errors.htmlContent.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Use placeholders: <code>{"{{name}}"}</code>, <code>{"{{team}}"}</code>, <code>{"{{track}}"}</code>, <code>{"{{signature}}"}</code>
                </p>
              </div>

              {/* Preview Section */}
              {form.watch("htmlContent") && (
                <div className="space-y-1.5">
                  <Label>Preview</Label>
                  <div className="border rounded-lg overflow-hidden bg-white">
                    <iframe
                      srcDoc={form.watch("htmlContent")
                        .replace(/\{\{name\}\}/g, "John Doe")
                        .replace(/\{\{team\}\}/g, "Sample Team")
                        .replace(/\{\{track\}\}/g, "Sample Track")
                        .replace(/\{\{signature\}\}/g, "")}
                      className="w-full h-[500px] border-0"
                      title="Certificate Preview"
                      sandbox="allow-same-origin"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Preview with sample data: John Doe, Sample Team, Sample Track
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : isEditing ? "Save" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={closeForm} disabled={isPending}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {certificates.length === 0 && !showForm ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No certificate templates yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {certificates.map((cert) => (
              <div key={cert.id} className="rounded-2xl border bg-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{cert.name}</p>
                      <Badge variant="outline">{cert.sent.length} sent</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Created by {cert.creator.name || "Admin"} on{" "}
                      {new Date(cert.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSend(cert)}
                      disabled={isPending}
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Send certificates"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEdit(cert)}
                      disabled={isPending}
                      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cert.id, cert.name)}
                      disabled={isPending}
                      className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Delete"
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

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Certificate?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Send Dialog */}
      <AlertDialog open={!!sendTarget} onOpenChange={() => setSendTarget(null)}>
        <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Send Certificates</AlertDialogTitle>
            <AlertDialogDescription>
              Send <strong>{sendTarget?.name}</strong> to participants
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Send to</Label>
              <select
                value={sendAudience}
                onChange={(e) => {
                  setSendAudience(e.target.value);
                  setSelectedUsers(new Set());
                  setSelectedTeam("");
                }}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="checked_in">Checked In Participants</option>
                <option value="registered">All Registered Participants</option>
                <option value="volunteers">Volunteers</option>
                <option value="admins">Admins</option>
                <option value="all">Everyone</option>
                <option value="team">Specific Team</option>
                <option value="individual">Specific Individuals</option>
              </select>
            </div>

            {(sendAudience === "team" || sendAudience === "individual") && (
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="flex gap-2">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, or team..."
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button onClick={handleSearch} disabled={isPending} size="sm">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {sendAudience === "team" && searchResults.teams.length > 0 && (
              <div className="space-y-2">
                <Label>Select Team</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {searchResults.teams.map((team) => (
                    <button
                      key={team.id}
                      onClick={() => setSelectedTeam(team.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedTeam === team.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{team.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {team.memberCount} members · {team.trackName || "No track"}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {sendAudience === "individual" && searchResults.users.length > 0 && (
              <div className="space-y-2">
                <Label>Select Users ({selectedUsers.size} selected)</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {searchResults.users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => toggleUser(user.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedUsers.has(user.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.email} {user.teamName && `· Team: ${user.teamName}`}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSend} disabled={isPending}>
              {isPending ? "Sending..." : "Send Certificates"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
