"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Edit2, Save, X, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { createFAQ, updateFAQ, deleteFAQ } from "@/lib/actions/content";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  order: number;
  published: boolean;
};

export function FAQManager({ faqs }: { faqs: FAQ[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<FAQ>>({
    order: faqs.length,
  });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<{ id: string; question: string } | null>(null);

  function startEdit(faq: FAQ) {
    setEditingId(faq.id);
    setFormData(faq);
    setIsCreating(false);
  }

  function startCreate() {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      question: "",
      answer: "",
      order: faqs.length,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ order: faqs.length });
  }

  function saveFAQ() {
    if (!formData.question || !formData.answer) {
      toast.error("Question and answer are required");
      return;
    }

    startTransition(async () => {
      try {
        const result = isCreating
          ? await createFAQ(formData as any)
          : await updateFAQ(editingId!, formData);

        if ("error" in result) {
          toast.error(result.error);
          return;
        }

        toast.success(isCreating ? "FAQ created" : "FAQ updated");
        cancelEdit();
        router.refresh();
      } catch {
        toast.error("Network error — please try again");
      }
    });
  }

  function togglePublished(id: string, currentPublished: boolean) {
    startTransition(async () => {
      try {
        const result = await updateFAQ(id, { published: !currentPublished });
        if ("error" in result) {
          toast.error(result.error);
          return;
        }
        toast.success(currentPublished ? "FAQ hidden" : "FAQ published");
        router.refresh();
      } catch {
        toast.error("Network error");
      }
    });
  }

  function removeFAQ(id: string, question: string) {
    setFaqToDelete({ id, question });
    setShowDeleteDialog(true);
  }

  function confirmDelete() {
    if (!faqToDelete) return;
    setShowDeleteDialog(false);

    startTransition(async () => {
      try {
        const result = await deleteFAQ(faqToDelete.id);
        if ("error" in result) {
          toast.error(result.error);
          return;
        }
        toast.success("FAQ deleted");
        setFaqToDelete(null);
        router.refresh();
      } catch {
        toast.error("Network error");
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Add button */}
      {!isCreating && !editingId && (
        <Button onClick={startCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Add FAQ
        </Button>
      )}

      {/* Create form */}
      {isCreating && (
        <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">New FAQ</h3>
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
                onClick={saveFAQ}
                disabled={isPending}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700"
              >
                <Save className="w-4 h-4" />
                Create
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="question">Question *</Label>
              <Input
                id="question"
                value={formData.question || ""}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Who can participate?"
              />
            </div>

            <div>
              <Label htmlFor="answer">Answer *</Label>
              <Textarea
                id="answer"
                value={formData.answer || ""}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="The challenge is open to..."
                rows={4}
              />
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
          </div>
        </div>
      )}

      {/* FAQ list */}
      <div className="space-y-3">
        {faqs.map((faq) => {
          const isEditing = editingId === faq.id;

          return (
            <div
              key={faq.id}
              className={`rounded-2xl border bg-card p-5 ${
                !faq.published ? "opacity-60" : ""
              }`}
            >
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">Edit FAQ</h3>
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
                        onClick={saveFAQ}
                        disabled={isPending}
                        className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Question *</Label>
                      <Input
                        value={formData.question || ""}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label>Answer *</Label>
                      <Textarea
                        value={formData.answer || ""}
                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label>Display Order</Label>
                      <Input
                        type="number"
                        value={formData.order || 0}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start gap-2">
                      <p className="font-semibold text-foreground flex-1">{faq.question}</p>
                      {!faq.published && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-muted text-muted-foreground shrink-0">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => togglePublished(faq.id, faq.published)}
                      disabled={isPending}
                      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title={faq.published ? "Hide" : "Publish"}
                    >
                      {faq.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => startEdit(faq)}
                      disabled={isPending}
                      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => removeFAQ(faq.id, faq.question)}
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

      {/* Delete FAQ Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete FAQ?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this FAQ?
              <div className="mt-2 p-2 bg-muted rounded text-sm">
                <strong>Q:</strong> {faqToDelete?.question}
              </div>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setFaqToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              Delete FAQ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
