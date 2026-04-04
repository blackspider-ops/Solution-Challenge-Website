import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllVolunteerFormResponses } from "@/lib/actions/volunteer-form-builder";
import { UserCheck, Mail, Clock, FileEdit } from "lucide-react";
import { db } from "@/lib/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VolunteerFormBuilder } from "@/components/admin/volunteer-form-builder";

export default async function VolunteersPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/dashboard");

  const [result, sections] = await Promise.all([
    getAllVolunteerFormResponses(),
    db.volunteerFormSection.findMany({
      orderBy: { order: "asc" },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    }),
  ]);
  
  if ("error" in result) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive">{result.error}</p>
      </div>
    );
  }

  const { data: responses } = result;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-blue-600" />
          Volunteer Registrations
        </h1>
        <p className="text-muted-foreground mt-1">
          {responses.length} volunteer{responses.length !== 1 ? "s" : ""} registered
        </p>
      </div>

      <Tabs defaultValue="registrations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="registrations" className="gap-2">
            <UserCheck className="w-4 h-4" />
            Volunteer Registrations
          </TabsTrigger>
          <TabsTrigger value="form" className="gap-2">
            <FileEdit className="w-4 h-4" />
            Edit Volunteer Form
          </TabsTrigger>
        </TabsList>

        <TabsContent value="registrations" className="space-y-4">
          {responses.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center">
              <UserCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No volunteer registrations yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {responses.map((response) => (
                <div
                  key={response.id}
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
                            {response.user.name || "Volunteer"}
                          </h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5" />
                              {response.user.email}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(response.createdAt).toLocaleDateString()}
                        </p>
                        {response.user.role === "volunteer" && (
                          <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 border border-blue-500/20 font-medium">
                            Volunteer Role
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Answers */}
                    <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-border">
                      {response.answers.map((answer) => {
                        let displayValue: any;
                        try {
                          displayValue = JSON.parse(answer.value);
                        } catch {
                          displayValue = answer.value;
                        }

                        // Format display value
                        let formattedValue: string;
                        if (Array.isArray(displayValue)) {
                          formattedValue = displayValue.join(", ");
                        } else if (typeof displayValue === "object" && displayValue !== null) {
                          // File upload
                          formattedValue = displayValue.name || "File uploaded";
                        } else {
                          formattedValue = String(displayValue);
                        }

                        return (
                          <div key={answer.id}>
                            <p className="text-sm font-medium text-foreground mb-1">
                              {answer.question.label}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formattedValue || "—"}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="form">
          <VolunteerFormBuilder sections={sections} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
