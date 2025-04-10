"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

type SubscriptionFormProps = {
  plan: "free" | "basic" | "pro";
  currentPlan?: string;
};

export default function SubscriptionForm({
  plan,
  currentPlan,
}: SubscriptionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // For a real implementation, this would integrate with Stripe
      // For now, we'll just update the subscription in the database
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update subscription");
      }

      // Refresh the page to show updated subscription
      router.refresh();

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Subscription error:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isCurrentPlan = currentPlan === plan;

  return (
    <div>
      <Button
        onClick={handleSubscribe}
        disabled={isLoading || isCurrentPlan}
        className="w-full"
        variant={isCurrentPlan ? "outline" : "default"}
      >
        {isLoading
          ? "Processing..."
          : isCurrentPlan
            ? "Current Plan"
            : plan === "free"
              ? "Start Free Trial"
              : "Subscribe"}
      </Button>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
