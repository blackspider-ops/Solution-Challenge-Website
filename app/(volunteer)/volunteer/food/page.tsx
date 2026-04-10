import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FoodScanner } from "@/components/admin/food-scanner";
import { getFoodStats, getRecentFoodDistributions } from "@/lib/actions/food";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogOut, UtensilsCrossed, Moon, Coffee, Clock } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default async function VolunteerFoodPage() {
  const session = await auth();
  if (!session || (session.user.role !== "volunteer" && session.user.role !== "admin")) {
    redirect("/dashboard");
  }

  const [statsResult, recentResult] = await Promise.all([
    getFoodStats(),
    getRecentFoodDistributions(undefined, 15),
  ]);

  const stats = "data" in statsResult ? statsResult.data : null;
  const recent = "data" in recentResult ? recentResult.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Food Distribution</h1>
        <p className="text-muted-foreground mt-1">
          Scan participant QR codes to distribute meals
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-orange-500" />
              <div>
                <p className="text-xl font-bold">{stats.dinner.unique}</p>
                <p className="text-xs text-muted-foreground">Dinner</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-xl font-bold">{stats.midnightSnack.unique}</p>
                <p className="text-xs text-muted-foreground">Midnight</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Coffee className="w-4 h-4 text-amber-500" />
              <div>
                <p className="text-xl font-bold">{stats.breakfast.unique}</p>
                <p className="text-xs text-muted-foreground">Breakfast</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-muted/30">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Second Servings</p>
              <p className="text-sm font-semibold">
                {stats.allowSecondServings ? "Enabled" : "Disabled"}
              </p>
            </div>
          </Card>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Scanners */}
        <div>
          <Tabs defaultValue="dinner" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dinner" className="text-xs">
                <UtensilsCrossed className="w-3 h-3 mr-1" />
                Dinner
              </TabsTrigger>
              <TabsTrigger value="midnight" className="text-xs">
                <Moon className="w-3 h-3 mr-1" />
                Midnight
              </TabsTrigger>
              <TabsTrigger value="breakfast" className="text-xs">
                <Coffee className="w-3 h-3 mr-1" />
                Breakfast
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dinner">
              <FoodScanner mealType="dinner" />
            </TabsContent>

            <TabsContent value="midnight">
              <FoodScanner mealType="midnight_snack" />
            </TabsContent>

            <TabsContent value="breakfast">
              <FoodScanner mealType="breakfast" />
            </TabsContent>
          </Tabs>
        </div>

        {/* Recent distributions */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Recent Distributions</h2>
          </div>

          {recent.length === 0 ? (
            <Card className="p-8 text-center">
              <UtensilsCrossed className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No distributions yet</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {recent.map((dist) => {
                const user = dist.ticket.registration.user;
                const mealIcons = {
                  dinner: UtensilsCrossed,
                  midnight_snack: Moon,
                  breakfast: Coffee,
                };
                const MealIcon = mealIcons[dist.mealType];
                const mealLabels = {
                  dinner: "Dinner",
                  midnight_snack: "Midnight",
                  breakfast: "Breakfast",
                };

                return (
                  <Card key={dist.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          dist.servingNumber === 2 
                            ? "bg-blue-500/10" 
                            : "bg-emerald-500/10"
                        }`}>
                          <MealIcon className={`w-4 h-4 ${
                            dist.servingNumber === 2 
                              ? "text-blue-600" 
                              : "text-emerald-600"
                          }`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">
                            {user.name || "Participant"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {mealLabels[dist.mealType]}
                            </span>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              dist.servingNumber === 2 
                                ? "bg-blue-500/10 text-blue-600" 
                                : "bg-emerald-500/10 text-emerald-600"
                            }`}>
                              {dist.servingNumber === 2 ? "2nd" : "1st"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                        {new Date(dist.distributedAt).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
