import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllVolunteerRegistrations } from "@/lib/actions/volunteer";
import { UserCheck, Mail, GraduationCap, Calendar, Clock, MessageSquare, CheckCircle } from "lucide-react";

export default async function VolunteersPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/dashboard");

  const result = await getAllVolunteerRegistrations();
  
  if ("error" in result) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive">{result.error}</p>
      </div>
    );
  }

  const { registrations } = result;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-blue-600" />
          Volunteer Registrations
        </h1>
        <p className="text-muted-foreground mt-1">
          {registrations.length} volunteer{registrations.length !== 1 ? "s" : ""} registered
        </p>
      </div>

      {registrations.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <UserCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No volunteer registrations yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => {
            const timeslots = JSON.parse(reg.availableTimeslots);
            const preferences = JSON.parse(reg.volunteerPreferences);
            const communication = JSON.parse(reg.communicationMethods);

            return (
              <div
                key={reg.id}
                className="rounded-2xl border border-border bg-card p-6 hover:border-primary/20 transition-colors"
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                        <UserCheck className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">
                          {reg.name}
                          {reg.pronouns && (
                            <span className="text-sm text-muted-foreground font-normal ml-2">
                              ({reg.pronouns})
                            </span>
                          )}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" />
                            {reg.psuEmail}
                          </span>
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-3.5 h-3.5" />
                            {reg.major}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {reg.academicYear}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground">
                        Registered {new Date(reg.createdAt).toLocaleDateString()}
                      </p>
                      {reg.user.role === "volunteer" && (
                        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 border border-blue-500/20 font-medium">
                          Volunteer Role
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-border">
                    {/* Availability */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <h4 className="text-sm font-medium text-foreground">Available Timeslots</h4>
                      </div>
                      <div className="space-y-1">
                        {timeslots.map((slot: string) => (
                          <p key={slot} className="text-xs text-muted-foreground">
                            • {slot}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Preferences */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <CheckCircle className="w-4 h-4 text-muted-foreground" />
                        <h4 className="text-sm font-medium text-foreground">Preferences</h4>
                      </div>
                      <div className="space-y-1">
                        {preferences.map((pref: string) => (
                          <p key={pref} className="text-xs text-muted-foreground">
                            • {pref}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Communication */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <h4 className="text-sm font-medium text-foreground">Communication</h4>
                      </div>
                      <div className="space-y-1">
                        {communication.map((method: string) => (
                          <p key={method} className="text-xs text-muted-foreground">
                            • {method}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Confirmations */}
                  <div className="flex items-center gap-4 pt-4 border-t border-border text-xs">
                    <span className={`flex items-center gap-1 ${reg.commitmentConfirmed ? "text-emerald-600" : "text-muted-foreground"}`}>
                      <CheckCircle className="w-3.5 h-3.5" />
                      Commitment confirmed
                    </span>
                    <span className={`flex items-center gap-1 ${reg.mediaConsent ? "text-emerald-600" : "text-muted-foreground"}`}>
                      <CheckCircle className="w-3.5 h-3.5" />
                      Media consent
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
