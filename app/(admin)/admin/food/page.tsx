import { requireAdmin } from "@/lib/admin-guard";
import { getFoodStats, getRecentFoodDistributions } from "@/lib/actions/food";
import { FoodScanner } from "@/components/admin/food-scanner";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UtensilsCrossed, Users, Moon, Coffee, Clock } from "lucide-react";
import { formatLocalTimeWithSeconds } from "@/lib/format-date";
import { SecondServingsToggle } from "@/components/admin/second-servings-toggle";

export default async function FoodPage() {
  await requireAdmin();

  const [statsResult, recentResult] = await Promise.all([
    getFoodStats(),
    getRecentFoodDistributions(undefined, 30),
  ]);

  const stats = "data" in statsResult ? statsResult.data : null;
  const recent = "data" in recentResult ? recentResult.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Food Distribution</h1>
          <p className="text-muted-foreground mt-1">
            Scan participant QR codes to track food distribution
          </p>
        </div>
        {stats && <SecondServingsToggle initialValue={stats.allowSecondServings} />}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalCheckedIn}</p>
                <p className="text-xs text-muted-foreground">Checked In</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.dinner.unique}</p>
                <p className="text-xs text-muted-foreground">Dinner ({stats.dinner.total} total)</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Moon className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.midnightSnack.unique}</p>
                <p className="text-xs text-muted-foreground">Midnight ({stats.midnightSnack.total} total)</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Coffee className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.breakfast.unique}</p>
                <p className="text-xs text-muted-foreground">Breakfast ({stats.breakfast.total} total)</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Scanners */}
      <Tabs defaultValue="dinner" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dinner" className="gap-2">
            <UtensilsCrossed className="w-4 h-4" />
            Dinner
          </TabsTrigger>
          <TabsTrigger value="midnight" className="gap-2">
            <Moon className="w-4 h-4" />
            Midnight Snack
          </TabsTrigger>
          <TabsTrigger value="breakfast" className="gap-2">
            <Coffee className="w-4 h-4" />
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

      {/* Recent distributions */}
      {recent.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recent Distributions
          </h2>
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Participant</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Meal</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Serving</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Time</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recent.map((dist) => {
                  const user = dist.ticket.registration.user;
                  const mealLabels = {
                    dinner: "Dinner",
                    midnight_snack: "Midnight Snack",
                    breakfast: "Breakfast",
                  };
                  
                  return (
                    <tr key={dist.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {user.image ? (
                            <img src={user.image} alt="" className="w-6 h-6 rounded-full" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-semibold text-primary">
                                {(user.name ?? user.email)[0].toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{user.name ?? "—"}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm">{mealLabels[dist.mealType]}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          dist.servingNumber === 2 
                            ? "bg-blue-500/10 text-blue-600" 
                            : "bg-emerald-500/10 text-emerald-600"
                        }`}>
                          {dist.servingNumber === 2 ? "2nd" : "1st"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {formatLocalTimeWithSeconds(dist.distributedAt)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {dist.performer.name ?? dist.performer.email}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </div>
  );
}
