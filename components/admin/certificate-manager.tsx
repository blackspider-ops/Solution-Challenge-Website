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
  <meta charset="UTF-8">
  <style>
    @page { size: 11in 8.5in landscape; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { margin: 0; padding: 0; background: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; width: 1100px; height: 850px; overflow: hidden; }
    .certificate { background: white; width: 1100px; height: 850px; padding: 0; position: relative; }
    .top-bar { position: absolute; top: 0; left: 0; right: 0; height: 12px; background: linear-gradient(90deg, #EA4335 0%, #FBBC04 25%, #34A853 50%, #4285F4 75%, #EA4335 100%); }
    .content-wrapper { padding: 60px 100px; height: 100%; display: flex; flex-direction: column; justify-content: space-between; }
    .header { text-align: center; margin-bottom: 20px; }
    .google-logo span { font-size: 48px; font-weight: 700; display: inline-block; letter-spacing: -2px; }
    .google-logo .g { color: #EA4335; }
    .google-logo .o1 { color: #FBBC04; }
    .google-logo .o2 { color: #34A853; }
    .google-logo .g2 { color: #4285F4; }
    .google-logo .l { color: #EA4335; }
    .google-logo .e { color: #FBBC04; }
    .developers { font-size: 14px; color: #F09300; letter-spacing: 6px; font-weight: 400; margin-top: 5px; text-transform: lowercase; }
    .main-content { text-align: center; flex: 1; display: flex; flex-direction: column; justify-content: center; padding-bottom: 40px; }
    .certificate-title { font-size: 38px; font-weight: 300; color: #202124; margin-bottom: 20px; letter-spacing: 1px; }
    .presented-to { font-size: 13px; color: #5f6368; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 20px; font-weight: 500; }
    .recipient-name { font-size: 56px; font-weight: 700; color: #4285F4; margin-bottom: 25px; }
    .description { font-size: 15px; color: #5f6368; line-height: 1.7; max-width: 800px; margin: 0 auto 30px; font-weight: 400; }
    .details { display: flex; justify-content: center; gap: 70px; margin: 25px 0; }
    .detail-item { text-align: center; }
    .detail-label { font-size: 11px; color: #80868b; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px; font-weight: 500; }
    .detail-value { font-size: 18px; color: #202124; font-weight: 500; }
    .footer { display: flex; justify-content: space-between; align-items: flex-end; padding-top: 30px; border-top: 1px solid #e8eaed; }
    .signature-section { text-align: left; }
    .signature-image { width: 120px; height: auto; display: block; margin-bottom: 5px; }
    .signature-name { font-size: 16px; font-weight: 600; color: #202124; margin-bottom: 3px; }
    .signature-title { font-size: 12px; color: #5f6368; line-height: 1.4; }
    .date-section { text-align: right; }
    .date-label { font-size: 11px; color: #80868b; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 5px; }
    .date-value { font-size: 15px; color: #202124; font-weight: 500; }
    .corner-accent { position: absolute; width: 80px; height: 80px; }
    .corner-accent.top-left { top: 30px; left: 30px; border-top: 3px solid #EA4335; border-left: 3px solid #EA4335; opacity: 0.3; }
    .corner-accent.top-right { top: 30px; right: 30px; border-top: 3px solid #FBBC04; border-right: 3px solid #FBBC04; opacity: 0.3; }
    .corner-accent.bottom-left { bottom: 30px; left: 30px; border-bottom: 3px solid #34A853; border-left: 3px solid #34A853; opacity: 0.3; }
    .corner-accent.bottom-right { bottom: 30px; right: 30px; border-bottom: 3px solid #4285F4; border-right: 3px solid #4285F4; opacity: 0.3; }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="top-bar"></div>
    <div class="corner-accent top-left"></div>
    <div class="corner-accent top-right"></div>
    <div class="corner-accent bottom-left"></div>
    <div class="corner-accent bottom-right"></div>
    <div class="content-wrapper">
      <div class="header">
        <div class="google-logo">
          <span class="g">G</span><span class="o1">o</span><span class="o2">o</span><span class="g2">g</span><span class="l">l</span><span class="e">e</span>
        </div>
        <div class="developers">developers</div>
      </div>
      <div class="main-content">
        <h1 class="certificate-title">Certificate of Participation</h1>
        <div class="presented-to">This is to certify that</div>
        <div class="recipient-name">{{name}}</div>
        <p class="description">has successfully participated in the GDG @ Penn State Solution Challenge 2026, demonstrating creativity, technical excellence, and commitment to building innovative solutions for real-world challenges.</p>
        <div class="details">
          <div class="detail-item">
            <div class="detail-label">Team</div>
            <div class="detail-value">{{team}}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Track</div>
            <div class="detail-value">{{track}}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Event</div>
            <div class="detail-value">April 11-12, 2026</div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="signature-section">
          <img src="signature.png" alt="Signature" class="signature-image" />
          <div class="signature-name">Tejas Singhal</div>
          <div class="signature-title">President, GDG @ Penn State</div>
        </div>
        <div class="date-section">
          <div class="date-label">Date Issued</div>
          <div class="date-value">April 12, 2026</div>
        </div>
      </div>
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
                  <div className="border rounded-lg overflow-auto bg-gray-100 p-4">
                    <div className="bg-white rounded shadow-lg" style={{ width: '1100px', height: '850px', transform: 'scale(0.7)', transformOrigin: 'top left' }}>
                      <iframe
                        srcDoc={form.watch("htmlContent")
                          .replace(/\{\{name\}\}/g, "John Doe")
                          .replace(/\{\{team\}\}/g, "Sample Team")
                          .replace(/\{\{track\}\}/g, "Sample Track")
                          .replace(/\{\{signature\}\}/g, "")
                          .replace(/src="signature\.png"/g, 'src="https://sign-solution-challenge-cert.pages.dev/IMG_0730.PNG"')}
                        className="w-full h-full border-0"
                        title="Certificate Preview"
                        sandbox="allow-same-origin"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Preview with sample data: John Doe, Sample Team, Sample Track (scaled to 70%)
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
