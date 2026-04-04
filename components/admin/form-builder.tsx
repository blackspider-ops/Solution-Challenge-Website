"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Edit, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import {
  createSection,
  updateSection,
  deleteSection,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "@/lib/actions/form-builder";
import { QuestionType } from "@prisma/client";

type Section = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  active: boolean;
  questions: Question[];
};

type Question = {
  id: string;
  sectionId: string;
  type: QuestionType;
  label: string;
  description: string | null;
  placeholder: string | null;
  required: boolean;
  options: string | null;
  order: number;
  active: boolean;
  conditionalOn: string | null;
  conditionalValue: string | null;
};

export function FormBuilder({ sections: initialSections }: { sections: Section[] }) {
  const [sections, setSections] = useState(initialSections);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  function toggleSection(id: string) {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <Card key={section.id} className="p-4">
          <div className="flex items-start gap-3">
            <Button variant="ghost" size="icon" className="cursor-move mt-1">
              <GripVertical className="w-4 h-4" />
            </Button>
            
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{section.title}</h3>
                    <Switch
                      checked={section.active}
                      onCheckedChange={(active) => {
                        startTransition(async () => {
                          const result = await updateSection(section.id, { active });
                          if ("error" in result) {
                            toast.error(result.error);
                          } else {
                            toast.success("Section updated");
                            setSections((prev) =>
                              prev.map((s) => (s.id === section.id ? { ...s, active } : s))
                            );
                          }
                        });
                      }}
                    />
                  </div>
                  {section.description && (
                    <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <SectionDialog section={section} onSuccess={(updated) => {
                    setSections((prev) =>
                      prev.map((s) => (s.id === section.id ? { ...s, ...updated } : s))
                    );
                  }} />
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleSection(section.id)}
                  >
                    {expandedSections.has(section.id) ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm("Delete this section and all its questions?")) {
                        startTransition(async () => {
                          const result = await deleteSection(section.id);
                          if ("error" in result) {
                            toast.error(result.error);
                          } else {
                            toast.success("Section deleted");
                            setSections((prev) => prev.filter((s) => s.id !== section.id));
                          }
                        });
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>

              {expandedSections.has(section.id) && (
                <div className="space-y-2 pl-4 border-l-2">
                  {section.questions.map((question) => (
                    <QuestionItem
                      key={question.id}
                      question={question}
                      allQuestions={sections.flatMap((s) => s.questions)}
                      onUpdate={(updated) => {
                        setSections((prev) =>
                          prev.map((s) =>
                            s.id === section.id
                              ? {
                                  ...s,
                                  questions: s.questions.map((q) =>
                                    q.id === question.id ? { ...q, ...updated } : q
                                  ),
                                }
                              : s
                          )
                        );
                      }}
                      onDelete={() => {
                        setSections((prev) =>
                          prev.map((s) =>
                            s.id === section.id
                              ? { ...s, questions: s.questions.filter((q) => q.id !== question.id) }
                              : s
                          )
                        );
                      }}
                    />
                  ))}

                  <QuestionDialog
                    sectionId={section.id}
                    allQuestions={sections.flatMap((s) => s.questions)}
                    onSuccess={(newQuestion) => {
                      setSections((prev) =>
                        prev.map((s) =>
                          s.id === section.id
                            ? { ...s, questions: [...s.questions, newQuestion as Question] }
                            : s
                        )
                      );
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}

      <SectionDialog
        onSuccess={(newSection) => {
          setSections((prev) => [...prev, newSection as Section]);
        }}
      />
    </div>
  );
}

function QuestionItem({
  question,
  allQuestions,
  onUpdate,
  onDelete,
}: {
  question: Question;
  allQuestions: Question[];
  onUpdate: (updated: Partial<Question>) => void;
  onDelete: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-start gap-2 p-3 rounded-lg border bg-card">
      <Button variant="ghost" size="icon" className="cursor-move shrink-0">
        <GripVertical className="w-3 h-3" />
      </Button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <p className="text-sm font-medium">{question.label}</p>
            <p className="text-xs text-muted-foreground">
              Type: {question.type} {question.required && "• Required"}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Switch
              checked={question.active}
              onCheckedChange={(active) => {
                startTransition(async () => {
                  const result = await updateQuestion(question.id, { active });
                  if ("error" in result) {
                    toast.error(result.error);
                  } else {
                    onUpdate({ active });
                  }
                });
              }}
            />

            <QuestionDialog
              sectionId={question.sectionId}
              question={question}
              allQuestions={allQuestions}
              onSuccess={(updated) => onUpdate(updated)}
            />

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                if (confirm("Delete this question?")) {
                  startTransition(async () => {
                    const result = await deleteQuestion(question.id);
                    if ("error" in result) {
                      toast.error(result.error);
                    } else {
                      toast.success("Question deleted");
                      onDelete();
                    }
                  });
                }
              }}
            >
              <Trash2 className="w-3 h-3 text-destructive" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionDialog({
  section,
  onSuccess,
}: {
  section?: Section;
  onSuccess: (section: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    title: section?.title || "",
    description: section?.description || "",
    order: section?.order || 0,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = section
        ? await updateSection(section.id, formData)
        : await createSection(formData);

      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success(section ? "Section updated" : "Section created");
        onSuccess(result.data);
        setOpen(false);
        if (!section) {
          setFormData({ title: "", description: "", order: 0 });
        }
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {section ? (
          <Button variant="ghost" size="icon">
            <Edit className="w-4 h-4" />
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Section
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{section ? "Edit Section" : "Create Section"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div>
            <Label>Order</Label>
            <Input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
            />
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Saving..." : section ? "Update" : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function QuestionDialog({
  sectionId,
  question,
  allQuestions,
  onSuccess,
}: {
  sectionId: string;
  question?: Question;
  allQuestions: Question[];
  onSuccess: (question: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    type: (question?.type || "text") as QuestionType,
    label: question?.label || "",
    description: question?.description || "",
    placeholder: question?.placeholder || "",
    required: question?.required || false,
    options: question?.options ? JSON.parse(question.options) : [""],
    order: question?.order || 0,
    conditionalOn: question?.conditionalOn || "",
    conditionalValue: question?.conditionalValue || "",
  });

  const needsOptions = ["select", "radio", "checkbox"].includes(formData.type);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const data = {
        ...formData,
        sectionId,
        options: needsOptions ? formData.options.filter(Boolean) : undefined,
        conditionalOn: formData.conditionalOn || undefined,
        conditionalValue: formData.conditionalValue || undefined,
      };

      const result = question
        ? await updateQuestion(question.id, data)
        : await createQuestion(data);

      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success(question ? "Question updated" : "Question created");
        onSuccess(result.data);
        setOpen(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {question ? (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit className="w-3 h-3" />
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="w-3 h-3" />
            Add Question
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{question ? "Edit Question" : "Create Question"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Question Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as QuestionType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Short Text</SelectItem>
                <SelectItem value="textarea">Long Text</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="select">Dropdown</SelectItem>
                <SelectItem value="radio">Radio Buttons</SelectItem>
                <SelectItem value="checkbox">Checkboxes</SelectItem>
                <SelectItem value="file">File Upload</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Label</Label>
            <Input
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Description (optional)</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <Label>Placeholder (optional)</Label>
            <Input
              value={formData.placeholder}
              onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
            />
          </div>

          {needsOptions && (
            <div>
              <Label>Options</Label>
              <div className="space-y-2">
                {formData.options.map((option: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...formData.options];
                        newOptions[index] = e.target.value;
                        setFormData({ ...formData, options: newOptions });
                      }}
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          options: formData.options.filter((_: string, i: number) => i !== index),
                        });
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({ ...formData, options: [...formData.options, ""] })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Switch
              checked={formData.required}
              onCheckedChange={(required) => setFormData({ ...formData, required })}
            />
            <Label>Required</Label>
          </div>

          <div>
            <Label>Conditional Logic (optional)</Label>
            <div className="space-y-2">
              <Select
                value={formData.conditionalOn}
                onValueChange={(value) => setFormData({ ...formData, conditionalOn: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Show only if..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No condition</SelectItem>
                  {allQuestions
                    .filter((q) => q.id !== question?.id)
                    .map((q) => (
                      <SelectItem key={q.id} value={q.id}>
                        {q.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {formData.conditionalOn && (
                <Input
                  value={formData.conditionalValue}
                  onChange={(e) => setFormData({ ...formData, conditionalValue: e.target.value })}
                  placeholder="Expected value"
                />
              )}
            </div>
          </div>

          <div>
            <Label>Order</Label>
            <Input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Saving..." : question ? "Update" : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
