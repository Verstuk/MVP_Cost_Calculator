import DashboardNavbar from "@/components/dashboard-navbar";
import { InfoIcon, UserCircle, PlusCircle, FileText } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch user's cost reports
  const { data: reports } = await supabase
    .from("cost_reports")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch user's subscription
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Calculate subscription status
  const now = new Date();
  const endDate = subscription ? new Date(subscription.end_date) : null;
  const isExpired = subscription ? now > endDate : true;
  const daysLeft =
    subscription && !isExpired
      ? Math.ceil((endDate!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : 0;
  const isPaidSubscription =
    subscription && subscription.subscription_type !== "free";
  const hasInfiniteReports = isPaidSubscription;
  const reportsLeft = subscription
    ? hasInfiniteReports
      ? Infinity
      : subscription.reports_limit - subscription.reports_used
    : 0;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <DashboardNavbar />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <Link href="/dashboard/new-estimate">
                <Button className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  New Cost Estimate
                </Button>
              </Link>
            </div>
            <div className="bg-secondary/50 text-sm p-3 px-4 rounded-lg text-muted-foreground flex gap-2 items-center">
              <InfoIcon size="14" />
              <span>
                Welcome to your MVP Cost Estimator dashboard. Create a new
                estimate or view your saved reports.
              </span>
            </div>
          </header>

          {/* User Profile Section */}
          <section className="bg-card rounded-xl p-6 border shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <UserCircle size={48} className="text-primary" />
              <div>
                <h2 className="font-semibold text-xl">User Profile</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            {/* Subscription Info */}
            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-3">Subscription Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">
                    Current Plan
                  </div>
                  <div className="font-semibold capitalize flex items-center">
                    {subscription?.subscription_type || "No active plan"}
                    {subscription?.subscription_type === "free" && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        Trial
                      </span>
                    )}
                  </div>
                  {subscription && (
                    <div className="text-sm mt-1">
                      {isExpired ? (
                        <span className="text-red-500">Expired</span>
                      ) : (
                        <span>{daysLeft} days left</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-secondary/30 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">
                    Reports
                  </div>
                  <div className="font-semibold">
                    {subscription ? (
                      <>
                        {subscription.reports_used}
                        {!hasInfiniteReports && (
                          <> / {subscription.reports_limit} used</>
                        )}
                        {!hasInfiniteReports && reportsLeft <= 0 && (
                          <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                            Limit reached
                          </span>
                        )}
                        {hasInfiniteReports && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            Unlimited
                          </span>
                        )}
                      </>
                    ) : (
                      "No reports available"
                    )}
                  </div>
                  {subscription && !hasInfiniteReports && reportsLeft > 0 && (
                    <div className="text-sm mt-1">
                      {reportsLeft} reports remaining
                    </div>
                  )}
                  {subscription && hasInfiniteReports && (
                    <div className="text-sm mt-1">
                      Unlimited reports with your premium plan
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Link href="/subscribe">
                  <Button variant="outline" size="sm">
                    {subscription?.subscription_type === "free" || isExpired
                      ? "Upgrade Plan"
                      : "Manage Subscription"}
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Reports Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Cost Reports</h2>

            {reports && reports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report) => (
                  <Link
                    href={`/dashboard/reports/${report.id}`}
                    key={report.id}
                  >
                    <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex justify-between items-start">
                          <span className="text-lg">{report.project_name}</span>
                          <span className="text-sm font-normal text-gray-500">
                            {new Date(report.created_at).toLocaleDateString()}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">
                              {report.project_type}
                            </p>
                            <p className="text-sm text-gray-500">
                              {report.timeline.durationMonths} months
                            </p>
                          </div>
                          <div className="text-xl font-bold text-blue-600">
                            {formatCurrency(report.estimated_cost)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No reports yet</h3>
                <p className="text-gray-500 mb-4">
                  You haven't created any cost estimates yet. Create your first
                  one to get started.
                </p>
                <Link href="/dashboard/new-estimate">
                  <Button className="flex items-center gap-2 mx-auto">
                    <PlusCircle className="h-4 w-4" />
                    Create Your First Estimate
                  </Button>
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
