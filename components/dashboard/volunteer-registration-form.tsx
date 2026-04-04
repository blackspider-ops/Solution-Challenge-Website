"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { submitVolunteerRegistration, type VolunteerFormData } from "@/lib/actions/volunteer";
import { Loader2, CheckCircle2, UserCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const TIMESLOTS = [
  "5:30 PM - 7:30 PM, April 11",
  "7:30 PM - 9:30 PM, April 11",
  "9:30 PM - 11:30 PM, April 11",
  "12:30 AM - 4:00 AM, April 12",
  "4:00 AM - 7:00 AM, April 12",
  "7:00 AM - 9:00 AM, April 12",
  "9:00 AM - 12:00 PM, April 12",
];

const PREFERENCES = [
  "Registration / Check-in Desk",
  "Food & Logistics",
  "Participant Support",
  "Technical Mentor",
  "Photography / Social Media",
  "Runner (general help)",
  "Setup & Decorations",
  "Cleanup Crew",
];

const COMMUNICATION_METHODS = [
  "Email",
  "WhatsApp",
  "Instagram",
  "Discord",
  "GroupMe",
  "SMS / iMessage",
];

const ACADEMIC_YEARS = ["Freshman", "Sophomore", "Junior", "Senior"];

export function VolunteerRegistrationForm({
  preFillData,
  userEmail,
  onComplete,
}: {
  preFillData?: Partial<VolunteerFormData>;
  userEmail?: string;
  onComplete?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<VolunteerFormData>({
    name: preFillData?.name || "",
    pronouns: preFillData?.pronouns || "",
    psuEmail: userEmail || "",
    major: preFillData?.major || "",
    academicYear: preFillData?.academicYear || "",
    availableTimeslots: [],
    volunteerPreferences: [],
    communicationMethods: [],
    commitmentConfirmed: false,
    mediaConsent: false,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!formData.psuEmail.trim()) {
      toast.error("Please enter your PSU email");
      return;
    }
    if (!formData.major.trim()) {
      toast.error("Please enter your major");
      return;
    }
    if (!formData.academicYear) {
      toast.error("Please select your academic year");
      return;
    }
    if (formData.availableTimeslots.length === 0) {
      toast.error("Please select at least one available timeslot");
      return;
    }
    if (formData.volunteerPreferences.length === 0) {
      toast.error("Please select at least one volunteering preference");
      return;
    }
    if (formData.communicationMethods.length === 0) {
      toast.error("Please select at least one communication method");
      return;
    }
    if (!formData.commitmentConfirmed) {
      toast.error("Please confirm your commitment");
      return;
    }
    if (!formData.mediaConsent) {
      toast.error("Please provide media consent");
      return;
    }

    startTransition(async () => {
      const result = await submitVolunteerRegistration(formData);
      
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Volunteer registration submitted successfully!");
        if (onComplete) {
          onComplete();
        }
      }
    });
  }

  const isPreFilled = (field: keyof VolunteerFormData) => {
    return preFillData && preFillData[field] !== undefined && preFillData[field] !== "";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <Label>
                  Name <span className="text-destructive">*</span>
                  {isPreFilled("name") && (
                    <span className="ml-2 text-xs text-muted-foreground font-normal">
                      (from your registration)
                    </span>
                  )}
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                  className={isPreFilled("name") ? "bg-primary/5 border-primary/20" : ""}
                />
              </div>

              <div>
                <Label>
                  Pronouns
                  {isPreFilled("pronouns") && (
                    <span className="ml-2 text-xs text-muted-foreground font-normal">
                      (from your registration)
                    </span>
                  )}
                </Label>
                <Input
                  value={formData.pronouns}
                  onChange={(e) => setFormData({ ...formData, pronouns: e.target.value })}
                  placeholder="e.g., he/him, she/her, they/them"
                  className={isPreFilled("pronouns") ? "bg-primary/5 border-primary/20" : ""}
                />
              </div>

              <div>
                <Label>
                  PSU Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="email"
                  value={formData.psuEmail}
                  onChange={(e) => setFormData({ ...formData, psuEmail: e.target.value })}
                  placeholder="your@psu.edu"
                  required
                />
              </div>

              <div>
                <Label>
                  Major <span className="text-destructive">*</span>
                  {isPreFilled("major") && (
                    <span className="ml-2 text-xs text-muted-foreground font-normal">
                      (from your registration)
                    </span>
                  )}
                </Label>
                <Input
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  placeholder="Enter your major"
                  required
                  className={isPreFilled("major") ? "bg-primary/5 border-primary/20" : ""}
                />
              </div>

              <div>
                <Label>
                  Academic Year <span className="text-destructive">*</span>
                  {isPreFilled("academicYear") && (
                    <span className="ml-2 text-xs text-muted-foreground font-normal">
                      (from your registration)
                    </span>
                  )}
                </Label>
                <RadioGroup
                  value={formData.academicYear}
                  onValueChange={(value) => setFormData({ ...formData, academicYear: value })}
                  className={isPreFilled("academicYear") ? "bg-primary/5 border border-primary/20 rounded-lg p-3" : ""}
                >
                  {ACADEMIC_YEARS.map((year) => (
                    <div key={year} className="flex items-center space-x-2">
                      <RadioGroupItem value={year} id={`year-${year}`} />
                      <Label htmlFor={`year-${year}`} className="font-normal">
                        {year}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Availability</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Please select the timeslots you will be available for volunteering <span className="text-destructive">*</span>
            </p>
            <div className="space-y-2">
              {TIMESLOTS.map((slot) => (
                <div key={slot} className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.availableTimeslots.includes(slot)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData({
                          ...formData,
                          availableTimeslots: [...formData.availableTimeslots, slot],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          availableTimeslots: formData.availableTimeslots.filter((s) => s !== slot),
                        });
                      }
                    }}
                    id={`slot-${slot}`}
                  />
                  <Label htmlFor={`slot-${slot}`} className="font-normal">
                    {slot}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Volunteering Preferences</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select the areas you're interested in helping with <span className="text-destructive">*</span>
            </p>
            <div className="space-y-2">
              {PREFERENCES.map((pref) => (
                <div key={pref} className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.volunteerPreferences.includes(pref)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData({
                          ...formData,
                          volunteerPreferences: [...formData.volunteerPreferences, pref],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          volunteerPreferences: formData.volunteerPreferences.filter((p) => p !== pref),
                        });
                      }
                    }}
                    id={`pref-${pref}`}
                  />
                  <Label htmlFor={`pref-${pref}`} className="font-normal">
                    {pref}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Communication */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Preferred Mode of Communication</h3>
            <p className="text-sm text-muted-foreground mb-4">
              How would you like us to contact you? <span className="text-destructive">*</span>
            </p>
            <div className="space-y-2">
              {COMMUNICATION_METHODS.map((method) => (
                <div key={method} className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.communicationMethods.includes(method)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData({
                          ...formData,
                          communicationMethods: [...formData.communicationMethods, method],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          communicationMethods: formData.communicationMethods.filter((m) => m !== method),
                        });
                      }
                    }}
                    id={`comm-${method}`}
                  />
                  <Label htmlFor={`comm-${method}`} className="font-normal">
                    {method}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Confirmations */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-start space-x-2">
              <Checkbox
                checked={formData.commitmentConfirmed}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, commitmentConfirmed: checked as boolean })
                }
                id="commitment"
                required
              />
              <Label htmlFor="commitment" className="font-normal leading-relaxed">
                I understand that volunteering is a commitment and I will inform organizers if my availability changes. <span className="text-destructive">*</span>
              </Label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                checked={formData.mediaConsent}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, mediaConsent: checked as boolean })
                }
                id="media"
                required
              />
              <Label htmlFor="media" className="font-normal leading-relaxed">
                I consent to photos/videos being taken during the event. <span className="text-destructive">*</span>
              </Label>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className="gap-2">
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Submit Volunteer Registration
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export function VolunteerRegistrationDialog({
  preFillData,
  userEmail,
  children,
}: {
  preFillData?: Partial<VolunteerFormData>;
  userEmail?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

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
        <VolunteerRegistrationForm
          preFillData={preFillData}
          userEmail={userEmail}
          onComplete={() => {
            setOpen(false);
            window.location.reload();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
