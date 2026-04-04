"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, User, Calendar, FileText, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { getAllFormResponses } from "@/lib/actions/form-builder";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

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

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

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

    const allQuestions = new Set<string>();
    responses.forEach((response) => {
      response.answers.forEach((answer) => {
        allQuestions.add(answer.question.label);
      });
    });

    const questionLabels = Array.from(allQuestions);
    const headers = ["Name", "Email", "Submitted At", ...questionLabels];

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

    const csvContent = [
      headers.map((h) => `"${h}"`).join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registration-responses-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("CSV exported successfully");
  }

  function getAnalytics() {
    const analytics: Record<string, Record<string, number>> = {};
    
    responses.forEach((response) => {
      response.answers.forEach((answer) => {
        const question = answer.question.label;
        if (!analytics[question]) {
          analytics[question] = {};
        }

        try {
          const parsed = JSON.parse(answer.value);
          if (Array.isArray(parsed)) {
            parsed.forEach((item) => {
              analytics[question][item] = (analytics[question][item] || 0) + 1;
            });
          } else {
            const value = String(parsed);
            analytics[question][value] = (analytics[question][value] || 0) + 1;
          }
        } catch {
          const value = answer.value || "No answer";
          analytics[question][value] = (analytics[question][value] || 0) + 1;
        }
      });
    });

    return analytics;
  }

  const filteredResponses = responses.filter((response) => {
    const query = searchQuery.toLowerCase();
    return (
      response.user.name?.toLowerCase().includes(query) ||
      response.user.email.toLowerCase().includes(query) ||
      response.answers.some((a) => a.value.toLowerCase().includes(query))
    );
  });

  const analytics = getAnalytics();
  const todayCount = responses.filter((r) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(r.createdAt) >= today;
  }).length;

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading responses...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold">{responses.length}</p>
              <p className="text-sm text-muted-foreground">Total Responses</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-bold">{todayCount}</p>
              <p className="text-sm text-muted-foreground">Submitted Today</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-bold">
                {responses.reduce((sum, r) => sum + r.answers.length, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Answers</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="responses" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="responses" className="gap-2">
              <FileText className="w-4 h-4" />
              Responses
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>
          <Button onClick={exportToCSV} className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        <TabsContent value="responses" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or answer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="space-y-3">
            {filteredResponses.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                {searchQuery ? "No responses match your search" : "No responses yet"}
              </Card>
            ) : (
              filteredResponses.map((response) => (
                <Card key={response.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{response.user.name || "Anonymous"}</p>
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
                      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Response Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Name</p>
                              <p className="font-medium">{response.user.name || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Email</p>
                              <p className="font-medium">{response.user.email}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                              <p className="font-medium">
                                {new Date(response.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Total Answers</p>
                              <p className="font-medium">{response.answers.length}</p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {response.answers.map((answer) => (
                              <div key={answer.id} className="p-4 rounded-lg border bg-card">
                                <p className="font-medium mb-2">{answer.question.label}</p>
                                <p className="text-muted-foreground whitespace-pre-wrap">
                                  {(() => {
                                    try {
                                      const parsed = JSON.parse(answer.value);
                                      if (Array.isArray(parsed)) {
                                        return parsed.join(", ");
                                      }
                                      if (typeof parsed === "object") {
                                        return JSON.stringify(parsed, null, 2);
                                      }
                                      return answer.value || "No answer provided";
                                    } catch {
                                      return answer.value || "No answer provided";
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
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {Object.entries(analytics).map(([question, data]) => {
            const chartData = Object.entries(data)
              .map(([name, value]) => ({ name, value }))
              .sort((a, b) => b.value - a.value)
              .slice(0, 10);

            const totalResponses = Object.values(data).reduce((sum, val) => sum + val, 0);

            return (
              <Card key={question} className="p-6">
                <h3 className="font-semibold text-lg mb-4">{question}</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {totalResponses} {totalResponses === 1 ? "response" : "responses"}
                </p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Bar Chart */}
                  <div>
                    <p className="text-sm font-medium mb-3">Distribution</p>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <XAxis 
                          dataKey="name" 
                          angle={-45}
                          textAnchor="end"
                          height={100}
                          interval={0}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Pie Chart */}
                  <div>
                    <p className="text-sm font-medium mb-3">Breakdown</p>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Stats Table */}
                <div className="mt-6 space-y-2">
                  {chartData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">{item.value} responses</span>
                        <span className="font-medium">
                          {((item.value / totalResponses) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
