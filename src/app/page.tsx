import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  Calculator,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Code,
  CreditCard,
  FileText,
  InfoIcon,
  Shield,
  UserCircle,
  Users,
} from "lucide-react";
import { createClient } from "../../supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch user's subscription if logged in
  let subscription = null;
  let isExpired = true;
  let daysLeft = 0;
  let isPaidSubscription = false;
  let hasInfiniteReports = false;
  let reportsLeft = 0;

  if (user) {
    // Fetch user's subscription
    const { data: userSubscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    subscription = userSubscription;

    // Calculate subscription status
    const now = new Date();
    const endDate = subscription ? new Date(subscription.end_date) : null;
    isExpired = subscription ? now > endDate : true;
    daysLeft =
      subscription && !isExpired
        ? Math.ceil(
            (endDate!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
          )
        : 0;
    isPaidSubscription =
      subscription && subscription.subscription_type !== "free";
    hasInfiniteReports = isPaidSubscription;
    reportsLeft = subscription
      ? hasInfiniteReports
        ? Infinity
        : subscription.reports_limit - subscription.reports_used
      : 0;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our interactive questionnaire guides you through a simple process
              to generate accurate MVP cost estimates in minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: <ClipboardCheck className="w-8 h-8" />,
                title: "1. Answer Questions",
                description:
                  "Complete our adaptive questionnaire about your project features, tech stack, and timeline.",
              },
              {
                icon: <Calculator className="w-8 h-8" />,
                title: "2. Get Instant Calculation",
                description:
                  "Our algorithm processes your inputs against industry cost metrics for accurate estimates.",
              },
              {
                icon: <FileText className="w-8 h-8" />,
                title: "3. Receive Detailed Report",
                description:
                  "Download a comprehensive PDF with cost breakdowns, timelines, and recommendations.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="text-blue-600 mb-4 flex justify-center">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our cost estimation tool is designed to give you the most accurate
              and comprehensive MVP project estimates.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Code className="w-6 h-6" />,
                title: "Technology Stack Analysis",
                description:
                  "Get cost implications for different tech choices and frameworks.",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Team Composition Planning",
                description:
                  "Optimize your team structure based on project requirements.",
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Timeline Projections",
                description:
                  "Visualize development milestones and delivery schedules.",
              },
              {
                icon: <CreditCard className="w-6 h-6" />,
                title: "Budget Breakdown",
                description:
                  "See detailed cost allocations across all project components.",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Secure Data Storage",
                description:
                  "Save and access your estimates with secure authentication.",
              },
              {
                icon: <CheckCircle2 className="w-6 h-6" />,
                title: "PDF Export",
                description:
                  "Download and share professional reports with stakeholders.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Estimation Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-blue-100">Projects Estimated</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">85%</div>
              <div className="text-blue-100">
                Time Saved vs Manual Estimation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Status Section (if logged in) */}
      {user && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            {/* User Profile Section */}
            <div className="bg-card rounded-xl p-6 border shadow-sm max-w-4xl mx-auto">
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
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Estimate Your MVP Costs?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Get accurate cost projections for your project in minutes, not days.
            No more guesswork or spreadsheet calculations.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Your Free Estimate
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
