"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { saveFormResponse, submitFormResponse, getMyFormResponse } from "@/lib/actions/form-builder";
import { Loader2, CheckCircle2 } from "lucide-react";

type Section = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  questions: Question[];
};

type Question = {
  id: string;
  type: string;
  label: string;
  description: string | null;
  placeholder: string | null;
  required: boolean;
  options: string | null;
  conditionalOn: string | null;
  conditionalValue: string | null;
};

export function RegistrationForm({
  sections,
  existingResponse,
  userName,
  userEmail,
  onComplete,
}: {
  sections: Section[];
  existingResponse?: any;
  userName?: string;
  userEmail?: string;
  onComplete?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [showSaved, setShowSaved] = useState(false);
  
  // Load saved section from localStorage or start at 0
  const [currentSection, setCurrentSection] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("registration-form-section");
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });
  
  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    
    // First, try to load from localStorage (draft answers)
    if (typeof window !== "undefined") {
      const savedAnswers = localStorage.getItem("registration-form-answers");
      if (savedAnswers) {
        try {
          const parsed = JSON.parse(savedAnswers);
          Object.assign(initial, parsed);
        } catch (e) {
          console.error("Failed to parse saved answers:", e);
        }
      }
    }
    
    // Then, load from database (submitted answers) - these override localStorage
    if (existingResponse) {
      existingResponse.answers?.forEach((answer: any) => {
        try {
          initial[answer.questionId] = JSON.parse(answer.value);
        } catch {
          initial[answer.questionId] = answer.value;
        }
      });
    }
    
    // Finally, auto-fill name and email from user account if not already answered
    sections.forEach((section) => {
      section.questions.forEach((question) => {
        // Auto-fill Full Name
        if (
          question.label.toLowerCase().includes("full name") ||
          question.label.toLowerCase() === "name"
        ) {
          if (!initial[question.id] && userName) {
            initial[question.id] = userName;
          }
        }
        
        // Auto-fill Email Address
        if (
          question.type === "email" ||
          question.label.toLowerCase().includes("email")
        ) {
          if (!initial[question.id] && userEmail) {
            initial[question.id] = userEmail;
          }
        }
      });
    });
    
    return initial;
  });

  const activeSections = sections.filter((s) => s.questions.some((q) => isQuestionVisible(q)));
  const totalSections = activeSections.length;
  const progress = ((currentSection + 1) / totalSections) * 100;

  // Validate current section is within bounds
  useEffect(() => {
    if (currentSection >= totalSections && totalSections > 0) {
      setCurrentSection(0);
      if (typeof window !== "undefined") {
        localStorage.setItem("registration-form-section", "0");
      }
    }
  }, [currentSection, totalSections]);

  function isQuestionVisible(question: Question): boolean {
    if (!question.conditionalOn) return true;
    const conditionAnswer = answers[question.conditionalOn];
    if (!conditionAnswer) return false;
    
    // Handle array values (checkboxes)
    if (Array.isArray(conditionAnswer)) {
      return conditionAnswer.includes(question.conditionalValue);
    }
    
    return conditionAnswer === question.conditionalValue;
  }

  function handleAnswerChange(questionId: string, value: any) {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    
    // Save to localStorage immediately
    if (typeof window !== "undefined") {
      localStorage.setItem("registration-form-answers", JSON.stringify(newAnswers));
    }
    
    // Show saved indicator briefly
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 1500);
  }

  function validateCurrentSection(): boolean {
    const section = activeSections[currentSection];
    const visibleQuestions = section.questions.filter(isQuestionVisible);
    
    for (const question of visibleQuestions) {
      if (question.required && !answers[question.id]) {
        toast.error(`Please answer: ${question.label}`);
        return false;
      }
    }
    return true;
  }

  function handleNext() {
    if (!validateCurrentSection()) return;

    // Just move to next section, no database save
    if (currentSection < totalSections - 1) {
      const nextSection = currentSection + 1;
      setCurrentSection(nextSection);
      // Save current section to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("registration-form-section", nextSection.toString());
      }
    }
  }

  function handleBack() {
    if (currentSection > 0) {
      const prevSection = currentSection - 1;
      setCurrentSection(prevSection);
      // Save current section to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("registration-form-section", prevSection.toString());
      }
    }
  }

  function handleSubmit() {
    if (!validateCurrentSection()) return;

    startTransition(async () => {
      // Save all answers to database for the first time
      const saveResult = await saveFormResponse(answers);
      if ("error" in saveResult) {
        toast.error(saveResult.error);
        return;
      }

      // Mark as completed
      const submitResult = await submitFormResponse();
      if ("error" in submitResult) {
        toast.error(submitResult.error);
      } else {
        toast.success("Registration form submitted successfully!");
        // Clear localStorage after successful submission
        if (typeof window !== "undefined") {
          localStorage.removeItem("registration-form-section");
          localStorage.removeItem("registration-form-answers");
        }
        // Notify parent component
        if (onComplete) {
          onComplete();
        }
      }
    });
  }

  const section = activeSections[currentSection];
  if (!section) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No form sections available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resume message */}
      {currentSection > 0 && (
        <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3 text-sm text-blue-700">
          <p className="font-medium">Continuing where you left off</p>
          <p className="text-xs text-blue-600 mt-1">
            Your progress is saved locally. Complete all sections to submit.
          </p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            Section {currentSection + 1} of {totalSections}
          </span>
          <div className="flex items-center gap-2">
            {showSaved && (
              <span className="text-blue-600 text-xs flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-3 h-3" />
                Saved locally
              </span>
            )}
            <span className="text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Section Content */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">{section.title}</h2>
            {section.description && (
              <p className="text-muted-foreground mt-1">{section.description}</p>
            )}
          </div>

          <div className="space-y-6">
            {section.questions.filter(isQuestionVisible).map((question) => {
              // Check if this field was autofilled
              const isNameField = question.label.toLowerCase().includes("full name") || 
                                 question.label.toLowerCase() === "name";
              const isEmailField = question.type === "email" || 
                                  question.label.toLowerCase().includes("email");
              const isAutofilled = Boolean((isNameField && userName) || (isEmailField && userEmail));
              
              return (
                <QuestionField
                  key={question.id}
                  question={question}
                  value={answers[question.id]}
                  onChange={(value) => handleAnswerChange(question.id, value)}
                  isAutofilled={isAutofilled}
                />
              );
            })}
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentSection === 0 || isPending}
        >
          Back
        </Button>

        {currentSection < totalSections - 1 ? (
          <Button onClick={handleNext} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Next"
            )}
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isPending} className="gap-2">
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Submit Registration
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

function QuestionField({
  question,
  value,
  onChange,
  isAutofilled,
}: {
  question: Question;
  value: any;
  onChange: (value: any) => void;
  isAutofilled?: boolean;
}) {
  const options = question.options ? JSON.parse(question.options) : [];

  return (
    <div className="space-y-2">
      <Label>
        {question.label}
        {question.required && <span className="text-destructive ml-1">*</span>}
        {isAutofilled && (
          <span className="ml-2 text-xs text-muted-foreground font-normal">
            (from your account)
          </span>
        )}
      </Label>
      {question.description && (
        <p className="text-sm text-muted-foreground">{question.description}</p>
      )}

      {question.type === "text" && (
        <div className="relative">
          <Input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder || ""}
            required={question.required}
            className={isAutofilled ? "bg-primary/5 border-primary/20" : ""}
          />
        </div>
      )}

      {question.type === "textarea" && (
        <Textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder || ""}
          required={question.required}
          rows={4}
          className={isAutofilled ? "bg-primary/5 border-primary/20" : ""}
        />
      )}

      {question.type === "email" && (
        <div className="relative">
          <Input
            type="email"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder || ""}
            required={question.required}
            className={isAutofilled ? "bg-primary/5 border-primary/20" : ""}
          />
        </div>
      )}

      {question.type === "select" && (
        <Select value={value || ""} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder={question.placeholder || "Select an option"} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option: string) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {question.type === "radio" && (
        <RadioGroup value={value || ""} onValueChange={onChange}>
          {options.map((option: string) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`${question.id}-${option}`} />
              <Label htmlFor={`${question.id}-${option}`} className="font-normal">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}

      {question.type === "checkbox" && (
        <div className="space-y-2">
          {options.map((option: string) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                checked={Array.isArray(value) && value.includes(option)}
                onCheckedChange={(checked) => {
                  const current = Array.isArray(value) ? value : [];
                  if (checked) {
                    onChange([...current, option]);
                  } else {
                    onChange(current.filter((v: string) => v !== option));
                  }
                }}
                id={`${question.id}-${option}`}
              />
              <Label htmlFor={`${question.id}-${option}`} className="font-normal">
                {option}
              </Label>
            </div>
          ))}
        </div>
      )}

      {question.type === "file" && (
        <div className="space-y-2">
          <Input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              // Show uploading state
              const uploadingToast = toast.loading("Uploading file...");

              try {
                // Upload to server
                const formData = new FormData();
                formData.append("file", file);

                const response = await fetch("/api/upload", {
                  method: "POST",
                  body: formData,
                });

                const data = await response.json();

                if (!response.ok) {
                  throw new Error(data.error || "Upload failed");
                }

                // Store the file URL and metadata
                onChange({
                  url: data.url,
                  name: data.filename,
                  size: data.size,
                  type: data.type,
                });

                toast.success("File uploaded successfully", { id: uploadingToast });
              } catch (error) {
                console.error("Upload error:", error);
                toast.error(
                  error instanceof Error ? error.message : "Failed to upload file",
                  { id: uploadingToast }
                );
              }
            }}
            required={question.required}
          />
          {value?.name && (
            <p className="text-xs text-muted-foreground">
              ✓ Uploaded: {value.name} ({Math.round(value.size / 1024)}KB)
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Accepted formats: PDF, DOC, DOCX (max 5MB)
          </p>
        </div>
      )}
    </div>
  );
}
