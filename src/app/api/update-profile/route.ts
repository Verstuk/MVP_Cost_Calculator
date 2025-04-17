import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const name = formData.get("name") as string | null;
  const avatarUrl = formData.get("avatarUrl") as string | null;
  const costConfigStr = formData.get("costConfig") as string | null;
  let costConfig = null;

  if (costConfigStr) {
    try {
      costConfig = JSON.parse(costConfigStr);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid cost configuration format" },
        { status: 400 },
      );
    }
  }

  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Prepare user data update objects
  const authUpdateData: { data?: { full_name?: string; avatar_url?: string } } =
    { data: {} };
  const profileUpdateData: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
    cost_configuration?: any;
  } = {};

  // Add name to update objects if provided
  if (name) {
    authUpdateData.data!.full_name = name;
    profileUpdateData.full_name = name;
    profileUpdateData.name = name;
  }

  // Add avatar URL to update objects if provided
  if (avatarUrl) {
    authUpdateData.data!.avatar_url = avatarUrl;
    profileUpdateData.avatar_url = avatarUrl;
  }

  // Add cost configuration if provided
  if (costConfig) {
    profileUpdateData.cost_configuration = costConfig;
  }

  // Only proceed with updates if there's something to update
  if (Object.keys(profileUpdateData).length > 0) {
    // Update auth user only if name or avatar changed
    if (Object.keys(authUpdateData.data!).length > 0) {
      const { error: authUpdateError } =
        await supabase.auth.updateUser(authUpdateData);

      if (authUpdateError) {
        console.error("Error updating auth user:", authUpdateError);
        return NextResponse.json(
          { error: authUpdateError.message },
          { status: 500 },
        );
      }
    }

    // Update the user's profile in the users table
    const { error: profileUpdateError } = await supabase
      .from("users")
      .update(profileUpdateData)
      .eq("id", user.id);

    if (profileUpdateError) {
      console.error("Error updating user profile:", profileUpdateError);
      return NextResponse.json(
        { error: profileUpdateError.message },
        { status: 500 },
      );
    }
  } else {
    return NextResponse.json(
      { error: "No update data provided" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Profile updated successfully",
  });
}
