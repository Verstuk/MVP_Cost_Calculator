import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, AlertCircle } from "lucide-react";
import Link from "next/link";
import SubscriptionForm from "@/components/subscription-form";

export default async function SubscribePage({
  searchParams,
}: {
  searchParams: { reason?: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get user's current subscription
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const now = new Date();
  const endDate = subscription ? new Date(subscription.end_date) : null;
  const isExpired = subscription ? now > endDate : true;
  const isLimitReached = subscription
    ? subscription.reports_used >= subscription.reports_limit
    : false;

  // Get reason from URL if provided
  const reason = searchParams.reason;

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select the subscription plan that best fits your needs. Upgrade to
              create more cost reports and access premium features.
            </p>

            {reason && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3 max-w-2xl mx-auto text-left">
                <AlertCircle className="text-amber-500 h-5 w-5 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800">
                    {reason === "expired"
                      ? "Your subscription has expired"
                      : "Report limit reached"}
                  </h3>
                  <p className="text-amber-700 text-sm">
                    {reason === "expired"
                      ? "Your free trial or subscription has ended. Please upgrade to continue creating cost reports."
                      : `You've reached the maximum number of reports (${subscription?.reports_limit}) for your current plan. Upgrade to create more reports.`}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card
              className={`border ${subscription?.subscription_type === "free" ? "border-blue-400 ring-2 ring-blue-200" : ""}`}
            >
              <CardHeader>
                <CardTitle>Free Trial</CardTitle>
                <CardDescription>For new users</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$0</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>3 cost reports</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Basic features</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>14-day access</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <SubscriptionForm
                  plan="free"
                  currentPlan={subscription?.subscription_type}
                />
              </CardFooter>
            </Card>

            {/* Basic Plan */}
            <Card
              className={`border ${subscription?.subscription_type === "basic" ? "border-blue-400 ring-2 ring-blue-200" : ""}`}
            >
              <CardHeader>
                <CardTitle>Basic</CardTitle>
                <CardDescription>For individuals</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$19</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>10 cost reports</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>PDF exports</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Email support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <SubscriptionForm
                  plan="basic"
                  currentPlan={subscription?.subscription_type}
                />
              </CardFooter>
            </Card>

            {/* Pro Plan */}
            <Card
              className={`border ${subscription?.subscription_type === "pro" ? "border-blue-400 ring-2 ring-blue-200" : ""}`}
            >
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>For businesses</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$49</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Unlimited cost reports</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Team collaboration</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <SubscriptionForm
                  plan="pro"
                  currentPlan={subscription?.subscription_type}
                />
              </CardFooter>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Need a custom plan for your enterprise? Contact our sales team.
            </p>
            <Link href="/dashboard">
              <Button variant="outline">Return to Dashboard</Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
