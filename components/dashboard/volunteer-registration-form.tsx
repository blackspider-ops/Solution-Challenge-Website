"use client";

import { useState } from "react";
import { UserCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RegistrationForm } from "@/components/dashboard/registration-form";

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

export function VolunteerRegistrationDialog({
  sections,
  existingResponse,
  preFillData,
  userEmail,
  children,
}: {
  sections: Section[];
  existingResponse?: any;
  preFillData?: Record<string, any>;
  userEmail?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  // Merge pre-fill data with existing response
  const mergedResponse = existingResponse || { answers: [] };
  
  // Add pre-fill data as answers if not already answered
  if (preFillData && !existingResponse) {
    const preFillAnswers: any[] = [];
    
    sections.forEach((section) => {
      section.questions.forEach((question) => {
        const label = question.label.toLowerCase();
        
        // Match pre-fill data to questions by label
        if ((label.includes("name") || label.includes("full name")) && preFillData.name) {
          preFillAnswers.push({
            questionId: question.id,
            value: preFillData.name,
            question,
          });
        } else if (label.includes("pronoun") && preFillData.pronouns) {
          preFillAnswers.push({
            questionId: question.id,
            value: preFillData.pronouns,
            question,
          });
        } else if (label.includes("major") && preFillData.major) {
          preFillAnswers.push({
            questionId: question.id,
            value: preFillData.major,
            question,
          });
        } else if ((label.includes("academic year") || label.includes("year")) && preFillData.academicYear) {
          preFillAnswers.push({
            questionId: question.id,
            value: preFillData.academicYear,
            question,
          });
        }
      });
    });
    
    mergedResponse.answers = preFillAnswers;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            Volunteer Registration
          </DialogTitle>
          <DialogDescription>
            Thank you for your interest in volunteering! Please fill out this form to register as a volunteer for Solution Challenge 2026.
          </DialogDescription>
        </DialogHeader>
        <RegistrationForm
          sections={sections}
          existingResponse={mergedResponse}
          userName={preFillData?.name}
          userEmail={userEmail}
          onComplete={() => {
            setOpen(false);
            window.location.reload();
          }}
          isVolunteerForm={true}
        />
      </DialogContent>
    </Dialog>
  );
}
