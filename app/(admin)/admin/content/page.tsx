import { requireAdmin } from "@/lib/admin-guard";
import { db } from "@/lib/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrackEditor } from "@/components/admin/track-editor";
import { SponsorManager } from "@/components/admin/sponsor-manager";
import { FAQManager } from "@/components/admin/faq-manager";
import { Settings, FileText, Award, HelpCircle } from "lucide-react";

export default async function AdminContentPage() {
  await requireAdmin();

  const [tracks, sponsors, faqs] = await Promise.all([
    db.track.findMany({ orderBy: { order: "asc" } }),
    db.sponsor.findMany({ orderBy: { order: "asc" } }),
    db.fAQ.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Content Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage all website content from one place. Changes are live immediately.
        </p>
      </div>

      <Tabs defaultValue="tracks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="tracks" className="gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Tracks</span>
          </TabsTrigger>
          <TabsTrigger value="sponsors" className="gap-2">
            <Award className="w-4 h-4" />
            <span className="hidden sm:inline">Sponsors</span>
          </TabsTrigger>
          <TabsTrigger value="faqs" className="gap-2">
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">FAQs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tracks" className="space-y-4">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm">
            <p className="font-medium text-blue-700 mb-1">Edit Track Content</p>
            <p className="text-blue-600 text-xs">
              Update track descriptions and challenge prompts. Changes appear immediately on the website.
              Use the Tracks page to control visibility.
            </p>
          </div>
          <TrackEditor tracks={tracks} />
        </TabsContent>

        <TabsContent value="sponsors" className="space-y-4">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm">
            <p className="font-medium text-blue-700 mb-1">Manage Sponsors</p>
            <p className="text-blue-600 text-xs">
              Add, edit, or remove sponsors. They appear on the homepage sponsors section.
            </p>
          </div>
          <SponsorManager sponsors={sponsors} />
        </TabsContent>

        <TabsContent value="faqs" className="space-y-4">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm">
            <p className="font-medium text-blue-700 mb-1">Manage FAQs</p>
            <p className="text-blue-600 text-xs">
              Add, edit, or remove frequently asked questions. They appear on the homepage FAQ section.
            </p>
          </div>
          <FAQManager faqs={faqs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
