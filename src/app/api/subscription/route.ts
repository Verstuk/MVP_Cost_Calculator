import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await request.json();

    if (!plan || !["free", "basic", "pro"].includes(plan)) {
      return NextResponse.json(
        { error: "Invalid subscription plan" },
        { status: 400 },
      );
    }

    // Set plan details
    const planDetails = {
      free: { durationDays: 14, reportsLimit: 3 },
      basic: { durationDays: 30, reportsLimit: 10 },
      pro: { durationDays: 30, reportsLimit: 999 }, // Unlimited for practical purposes
    };

    const selectedPlan = planDetails[plan as keyof typeof planDetails];

    // Calculate end date
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + selectedPlan.durationDays);

    // Check if user already has a subscription
    const { data: existingSubscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (existingSubscription) {
      // Update existing subscription
      const { error } = await supabase
        .from("subscriptions")
        .update({
          subscription_type: plan,
          start_date: new Date().toISOString(),
          end_date: endDate.toISOString(),
          reports_limit: selectedPlan.reportsLimit,
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) {
        console.error("Error updating subscription:", error);
        return NextResponse.json(
          { error: "Failed to update subscription" },
          { status: 500 },
        );
      }
    } else {
      // Create new subscription
      const { error } = await supabase.from("subscriptions").insert({
        user_id: user.id,
        subscription_type: plan,
        start_date: new Date().toISOString(),
        end_date: endDate.toISOString(),
        reports_limit: selectedPlan.reportsLimit,
        reports_used: 0,
        is_active: true,
      });

      if (error) {
        console.error("Error creating subscription:", error);
        return NextResponse.json(
          { error: "Failed to create subscription" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({ success: true, plan });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's subscription
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is the error code for no rows returned
      console.error("Error fetching subscription:", error);
      return NextResponse.json(
        { error: "Failed to fetch subscription" },
        { status: 500 },
      );
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
