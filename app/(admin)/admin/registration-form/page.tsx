import { requireAdmin } from "@/lib/admin-guard";
import { db } from "@/lib/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormBuilder } from "@/components/admin/form-builder";
import { FormResponses } from "@/components/admin/form-responses";
import { FileEdit, BarChart3 } from "lucide-react";

export default async function AdminRegistrationFormPage() {
  await requireAdmin();

  const sections = await db.formSection.findMany({
    orderBy: { order: "asc" },
    include: {
      questions: { orderBy: { order: "asc" } },
    },
  });

  const responsesCount = await db.formResponse.count({
    where: { completed: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Registration Form</h1>
        <p className="text-muted-foreground mt-1">
          Build and manage the registration form. View responses and analytics.
        </p>
      </div>

      <Tabs defaultValue="builder" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
          <TabsTrigger value="builder" className="gap-2">
            <FileEdit className="w-4 h-4" />
            <span>Form Builder</span>
          </TabsTrigger>
          <TabsTrigger value="responses" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            <span>Responses ({responsesCount})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-4">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm">
            <p className="font-medium text-blue-700 mb-1">Build Registration Form</p>
            <p className="text-blue-600 text-xs">
              Create sections and questions. Supports conditional logic, file uploads, and various question types.
            </p>
          </div>
          <FormBuilder sections={sections} />
        </TabsContent>

        <TabsContent value="responses" className="space-y-4">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm">
            <p className="font-medium text-blue-700 mb-1">View Responses</p>
            <p className="text-blue-600 text-xs">
              View all submitted responses, analytics, and export data to CSV.
            </p>
          </div>
          <FormResponses />
        </TabsContent>
      </Tabs>
    </div>
  );
}
