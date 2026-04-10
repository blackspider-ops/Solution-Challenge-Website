"use client";

import { useState, useTransition } from "react";
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
import { Plus, Pencil, Trash2, Award } from "lucide-react";
import {
  createJudgingCriteria,
  updateJudgingCriteria,
  deleteJudgingCriteria,
} from "@/lib/actions/judging";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Criteria = {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  weight: number;
  order: number;
  active: boolean;
};

export function JudgingCriteriaManager({ criteria }: { criteria: Criteria[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState<Criteria | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    maxScore: 10,
    weight: 1.0,
  });

  function resetForm() {
    setFormData({
      name: "",
      description: "",
      maxScore: 10,
      weight: 1.0,
    });
    setEditingCriteria(null);
  }

  function handleCreate() {
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error("Name and description are required");
      return;
    }

    startTransition(async () => {
      const result = await createJudgingCriteria(formData);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Criteria created successfully");
        setIsCreateOpen(false);
        resetForm();
        router.refresh();
      }
    });
  }

  function handleUpdate() {
    if (!editingCriteria) return;

    startTransition(async () => {
      const result = await updateJudgingCriteria(editingCriteria.id, formData);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Criteria updated successfully");
        setEditingCriteria(null);
        resetForm();
        router.refresh();
      }
    });
  }

  function handleDelete(id: string, name: string) {
    startTransition(async () => {
      const result = await deleteJudgingCriteria(id);
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
      const result = await updateJudgingCriteria(id, { active });
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success(active ? "Criteria activated" : "Criteria deactivated");
        router.refresh();
      }
    });
  }

  function openEditDialog(c: Criteria) {
    setEditingCriteria(c);
    setFormData({
      name: c.name,
      description: c.description,
      maxScore: c.maxScore,
      weight: c.weight,
    });
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Judging Criteria</h2>
          <p className="text-sm text-muted-foreground">
            Configure scoring criteria for submissions
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Criteria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Judging Criteria</DialogTitle>
              <DialogDescription>
                Add a new criterion for judges to score submissions
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Criteria Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Innovation"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this criteria evaluates..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxScore">Max Score</Label>
                  <Input
                    id="maxScore"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.maxScore}
                    onChange={(e) =>
                      setFormData({ ...formData, maxScore: parseInt(e.target.value) || 10 })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="10"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: parseFloat(e.target.value) || 1.0 })
                    }
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={isPending}>
                Create Criteria
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Criteria List */}
      {criteria.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Award className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No judging criteria yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Create criteria to enable judges to score submissions
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {criteria.map((c) => (
            <Card key={c.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium">{c.name}</h3>
                    <Badge variant={c.active ? "default" : "secondary"}>
                      {c.active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">Max: {c.maxScore}</Badge>
                    <Badge variant="outline">Weight: {c.weight}x</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Switch
                    checked={c.active}
                    onCheckedChange={(checked) => handleToggleActive(c.id, checked)}
                    disabled={isPending}
                  />

                  <Dialog
                    open={editingCriteria?.id === c.id}
                    onOpenChange={(open) => {
                      if (!open) {
                        setEditingCriteria(null);
                        resetForm();
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(c)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Judging Criteria</DialogTitle>
                        <DialogDescription>
                          Update the criteria details
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4 py-4">
                        <div>
                          <Label htmlFor="edit-name">Criteria Name</Label>
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
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="edit-maxScore">Max Score</Label>
                            <Input
                              id="edit-maxScore"
                              type="number"
                              min="1"
                              max="100"
                              value={formData.maxScore}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  maxScore: parseInt(e.target.value) || 10,
                                })
                              }
                            />
                          </div>

                          <div>
                            <Label htmlFor="edit-weight">Weight</Label>
                            <Input
                              id="edit-weight"
                              type="number"
                              step="0.1"
                              min="0.1"
                              max="10"
                              value={formData.weight}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  weight: parseFloat(e.target.value) || 1.0,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingCriteria(null);
                            resetForm();
                          }}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleUpdate} disabled={isPending}>
                          Update Criteria
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
                        <AlertDialogTitle>Delete Criteria</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{c.name}"? This will also delete
                          all scores associated with this criteria. This action cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(c.id, c.name)}
                          className="bg-destructive hover:bg-destructive/90 text-white"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
