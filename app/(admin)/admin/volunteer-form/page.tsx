import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { VolunteerFormBuilder } from "@/components/admin/volunteer-form-builder";
import { FileEdit } from "lucide-react";

export default async function VolunteerFormBuilderPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/dashboard");

  const sections = await db.volunteerFormSection.findMany({
    orderBy: { order: "asc" },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FileEdit className="w-6 h-6 text-blue-600" />
          Volunteer Form Builder
        </h1>
        <p className="text-muted-foreground mt-1">
          Create and manage the volunteer registration form
        </p>
      </div>

      <VolunteerFormBuilder sections={sections} />
    </div>
  );
}
