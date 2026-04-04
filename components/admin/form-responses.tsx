"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, User, Calendar, FileText } from "lucide-react";
import { getAllFormResponses } from "@/lib/actions/form-builder";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Response = {
  id: string;
  userId: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  answers: Array<{
    id: string;
    questionId: string;
    value: string;
    question: {
      id: string;
      label: string;
      type: string;
    };
  }>;
};

export function FormResponses() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadResponses();
  }, []);

  async function loadResponses() {
    setLoading(true);
    const result = await getAllFormResponses();
    if ("error" in result) {
      toast.error(result.error);
    } else {
      setResponses(result.data as Response[]);
    }
    setLoading(false);
  }

  function exportToCSV() {
    if (responses.length === 0) {
      toast.error("No responses to export");
      return;
    }

    // Get all unique questions
    const allQuestions = new Set<string>();
    responses.forEach((response) => {
      response.answers.forEach((answer) => {
        allQuestions.add(answer.question.label);
      });
    });

    const questionLabels = Array.from(allQuestions);
    const headers = ["Name", "Email", "Submitted At", ...questionLabels];

    // Build CSV rows
    const rows = responses.map((response) => {
      const answerMap = new Map(
        response.answers.map((a) => [a.question.label, a.value])
      );

      return [
        response.user.name || "",
        response.user.email,
        new Date(response.createdAt).toLocaleString(),
        ...questionLabels.map((label) => {
          const value = answerMap.get(label) || "";
          // Handle JSON values
          try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) return parsed.join("; ");
            if (typeof parsed === "object") return JSON.stringify(parsed);
            return value;
          } catch {
            return value;
          }
        }),
      ];
    });

    // Create CSV content
    const csvContent = [
      headers.map((h) => `"${h}"`).join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registration-responses-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("CSV exported successfully");
  }

  const filteredResponses = responses.filter((response) => {
    const query = searchQuery.toLowerCase();
    return (
      response.user.name?.toLowerCase().includes(query) ||
      response.user.email.toLowerCase().includes(query) ||
      response.answers.some((a) => a.value.toLowerCase().includes(query))
    );
  });

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading responses...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or answer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={exportToCSV} className="gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{responses.length}</p>
              <p className="text-sm text-muted-foreground">Total Responses</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {responses.filter((r) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return new Date(r.createdAt) >= today;
                }).length}
              </p>
              <p className="text-sm text-muted-foreground">Today</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {responses.reduce((sum, r) => sum + r.answers.length, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Answers</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Responses List */}
      <div className="space-y-3">
        {filteredResponses.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            {searchQuery ? "No responses match your search" : "No responses yet"}
          </Card>
        ) : (
          filteredResponses.map((response) => (
            <Card key={response.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{response.user.name || "Anonymous"}</p>
                      <p className="text-sm text-muted-foreground">{response.user.email}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Submitted {new Date(response.createdAt).toLocaleString()}
                  </p>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Response Details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                        <div>
                          <p className="text-sm font-medium">Name</p>
                          <p className="text-sm text-muted-foreground">
                            {response.user.name || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">{response.user.email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Submitted</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(response.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Total Answers</p>
                          <p className="text-sm text-muted-foreground">{response.answers.length}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {response.answers.map((answer) => (
                          <div key={answer.id} className="p-3 rounded-lg border">
                            <p className="text-sm font-medium mb-1">{answer.question.label}</p>
                            <p className="text-sm text-muted-foreground">
                              {(() => {
                                try {
                                  const parsed = JSON.parse(answer.value);
                                  if (Array.isArray(parsed)) {
                                    return parsed.join(", ");
                                  }
                                  if (typeof parsed === "object") {
                                    return JSON.stringify(parsed, null, 2);
                                  }
                                  return answer.value;
                                } catch {
                                  return answer.value;
                                }
                              })()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
