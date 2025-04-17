import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Helper function to ensure the cost_configuration column exists
async function ensureCostConfigurationColumn(supabase) {
  try {
    await supabase.rpc("exec_sql", {
      sql_query: `
        ALTER TABLE public.users ADD COLUMN IF NOT EXISTS cost_configuration JSONB DEFAULT '{"developerRate": 8000, "designerRate": 7000, "projectManagerRate": 9000, "qaTesterRate": 6000}'::JSONB;
        COMMENT ON COLUMN public.users.cost_configuration IS 'User cost configuration settings';
        -- Force refresh schema cache
        NOTIFY pgrst, 'reload schema';
      `,
    });
  } catch (columnError) {
    console.error("Error ensuring column exists (non-blocking):", columnError);
    // Continue even if this fails
  }
}

// Default cost configuration values
const DEFAULT_COST_CONFIG = {
  developerRate: 8000,
  designerRate: 7000,
  projectManagerRate: 9000,
  qaTesterRate: 6000,
};

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Ensure the column exists
  await ensureCostConfigurationColumn(supabase);

  // Fetch the user's cost configuration
  const { data, error } = await supabase
    .from("users")
    .select("cost_configuration")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching cost configuration:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    data: data.cost_configuration || DEFAULT_COST_CONFIG,
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Get the cost configuration data from the request
  const costConfig = await request.json();

  // Validate the cost configuration data
  if (
    typeof costConfig.developerRate !== "number" ||
    typeof costConfig.designerRate !== "number" ||
    typeof costConfig.projectManagerRate !== "number" ||
    typeof costConfig.qaTesterRate !== "number"
  ) {
    return NextResponse.json(
      { error: "Invalid cost configuration data" },
      { status: 400 },
    );
  }

  // Ensure the column exists
  await ensureCostConfigurationColumn(supabase);

  // Update the user's cost configuration
  const { error } = await supabase
    .from("users")
    .update({ cost_configuration: costConfig })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating cost configuration:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: "Cost configuration updated successfully",
  });
}
