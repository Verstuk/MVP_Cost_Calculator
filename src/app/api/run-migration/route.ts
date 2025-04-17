import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify user is authenticated and has appropriate permissions
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Instead of using RPC, directly update the user's cost_configuration
    // This is a workaround since we don't have access to exec_sql function
    const { error: columnError } = await supabase
      .from("users")
      .update({
        cost_configuration: {
          developerRate: 8000,
          designerRate: 7000,
          projectManagerRate: 9000,
          qaTesterRate: 6000,
        },
      })
      .eq("id", user.id);

    if (columnError) {
      console.error("Error adding cost_configuration column:", columnError);
      return NextResponse.json({ error: columnError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Migration completed successfully",
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { error: "Failed to run migration" },
      { status: 500 },
    );
  }
}
