import { requireAdmin } from "@/lib/admin-guard";
import { db } from "@/lib/db";
import { CertificateManager } from "@/components/admin/certificate-manager";
import { Award } from "lucide-react";

export default async function AdminCertificatesPage() {
  await requireAdmin();

  const certificates = await db.certificate.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      creator: { select: { name: true } },
      sent: { select: { id: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Award className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Certificates</h1>
        </div>
        <p className="text-muted-foreground">
          Create certificate templates and send them to participants via email.
          Use placeholders: <code className="text-xs bg-muted px-1 rounded">{"{{name}}"}</code>,{" "}
          <code className="text-xs bg-muted px-1 rounded">{"{{team}}"}</code>,{" "}
          <code className="text-xs bg-muted px-1 rounded">{"{{track}}"}</code>,{" "}
          <code className="text-xs bg-muted px-1 rounded">{"{{signature}}"}</code>
        </p>
      </div>

      <CertificateManager certificates={certificates} />
    </div>
  );
}
