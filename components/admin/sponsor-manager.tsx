"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Edit2, Save, X, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createSponsor, updateSponsor, deleteSponsor } from "@/lib/actions/content";

type Sponsor = {
  id: string;
  name: string;
  initial: string;
  tier: "platinum" | "gold" | "silver";
  logoUrl: string | null;
  websiteUrl: string | null;
  active: boolean;
  order: number;
};

export function SponsorManager({ sponsors }: { sponsors: Sponsor[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Sponsor>>({
    tier: "silver",
    order: sponsors.length,
  });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function startEdit(sponsor: Sponsor) {
    setEditingId(sponsor.id);
    setFormData(sponsor);
    setIsCreating(false);
  }

  function startCreate() {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      name: "",
      initial: "",
      tier: "silver",
      logoUrl: "",
      websiteUrl: "",
      order: sponsors.length,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ tier: "silver", order: sponsors.length });
  }

  function saveSponsor() {
    if (!formData.name || !formData.initial || !formData.tier) {
      toast.error("Name, initial, and tier are required");
      return;
    }

    startTransition(async () => {
      try {
        const result = isCreating
          ? await createSponsor(formData as any)
          : await updateSponsor(editingId!, formData as any);

        if ("error" in result) {
          toast.error(result.error);
          return;
        }

        toast.success(isCreating ? "Sponsor created" : "Sponsor updated");
        cancelEdit();
        router.refresh();
      } catch {
        toast.error("Network error — please try again");
      }
    });
  }

  function toggleActive(id: string, currentActive: boolean) {
    startTransition(async () => {
      try {
        const result = await updateSponsor(id, { active: !currentActive });
        if ("error" in result) {
          toast.error(result.error);
          return;
        }
        toast.success(currentActive ? "Sponsor hidden" : "Sponsor visible");
        router.refresh();
      } catch {
        toast.error("Network error");
      }
    });
  }

  function removeSponsor(id: string, name: string) {
    if (!confirm(`Delete sponsor "${name}"?`)) return;

    startTransition(async () => {
      try {
        const result = await deleteSponsor(id);
        if ("error" in result) {
          toast.error(result.error);
          return;
        }
        toast.success("Sponsor deleted");
        router.refresh();
      } catch {
        toast.error("Network error");
      }
    });
  }

  const tierColors = {
    platinum: "violet",
    gold: "amber",
    silver: "slate",
  };

  return (
    <div className="space-y-4">
      {/* Add button */}
      {!isCreating && !editingId && (
        <Button onClick={startCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Sponsor
        </Button>
      )}

      {/* Create form */}
      {isCreating && (
        <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">New Sponsor</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={cancelEdit}
                disabled={isPending}
              >
                <X className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={saveSponsor}
                disabled={isPending}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700"
              >
                <Save className="w-4 h-4" />
                Create
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Sponsor Name *</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Google"
              />
            </div>

            <div>
              <Label htmlFor="initial">Initial *</Label>
              <Input
                id="initial"
                value={formData.initial || ""}
                onChange={(e) => setFormData({ ...formData, initial: e.target.value.toUpperCase() })}
                placeholder="G"
                maxLength={2}
              />
            </div>

            <div>
              <Label htmlFor="tier">Tier *</Label>
              <Select
                value={formData.tier}
                onValueChange={(value: any) => setFormData({ ...formData, tier: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="platinum">Platinum</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order || 0}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              />
            </div>

            <div>
              <Label htmlFor="logoUrl">Logo URL (optional)</Label>
              <Input
                id="logoUrl"
                value={formData.logoUrl || ""}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label htmlFor="websiteUrl">Website URL (optional)</Label>
              <Input
                id="websiteUrl"
                value={formData.websiteUrl || ""}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Sponsor list */}
      <div className="space-y-3">
        {sponsors.map((sponsor) => {
          const isEditing = editingId === sponsor.id;
          const color = tierColors[sponsor.tier];

          return (
            <div
              key={sponsor.id}
              className={`rounded-2xl border bg-card p-5 ${
                !sponsor.active ? "opacity-60" : ""
              }`}
            >
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">Edit Sponsor</h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={cancelEdit}
                        disabled={isPending}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={saveSponsor}
                        disabled={isPending}
                        className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Sponsor Name *</Label>
                      <Input
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label>Initial *</Label>
                      <Input
                        value={formData.initial || ""}
                        onChange={(e) => setFormData({ ...formData, initial: e.target.value.toUpperCase() })}
                        maxLength={2}
                      />
                    </div>

                    <div>
                      <Label>Tier *</Label>
                      <Select
                        value={formData.tier}
                        onValueChange={(value: any) => setFormData({ ...formData, tier: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="platinum">Platinum</SelectItem>
                          <SelectItem value="gold">Gold</SelectItem>
                          <SelectItem value="silver">Silver</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Display Order</Label>
                      <Input
                        type="number"
                        value={formData.order || 0}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      />
                    </div>

                    <div>
                      <Label>Logo URL</Label>
                      <Input
                        value={formData.logoUrl || ""}
                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label>Website URL</Label>
                      <Input
                        value={formData.websiteUrl || ""}
                        onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 flex items-center justify-center shrink-0`}>
                    <span className={`text-xl font-bold text-${color}-500`}>
                      {sponsor.initial}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-foreground">{sponsor.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize bg-${color}-500/10 text-${color}-700`}>
                        {sponsor.tier}
                      </span>
                      {!sponsor.active && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-muted text-muted-foreground">
                          Hidden
                        </span>
                      )}
                    </div>
                    {sponsor.websiteUrl && (
                      <a
                        href={sponsor.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        {sponsor.websiteUrl}
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleActive(sponsor.id, sponsor.active)}
                      disabled={isPending}
                      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title={sponsor.active ? "Hide" : "Show"}
                    >
                      {sponsor.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => startEdit(sponsor)}
                      disabled={isPending}
                      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => removeSponsor(sponsor.id, sponsor.name)}
                      disabled={isPending}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
