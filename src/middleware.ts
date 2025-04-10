import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll().map(({ name, value }) => ({
            name,
            value,
          }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value);
            res.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Auth session error:", error);
  }

  // Check subscription status for protected routes
  const path = req.nextUrl.pathname;

  // Only check subscription for new estimate creation
  if (path === "/dashboard/new-estimate" && session) {
    try {
      // Get user's subscription
      const { data: subscription, error: subscriptionError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (subscriptionError) {
        console.error("Subscription error:", subscriptionError);
        return res;
      }

      const now = new Date();
      const endDate = subscription ? new Date(subscription.end_date) : null;

      // Check if subscription is expired or report limit reached
      if (
        subscription &&
        (!subscription.is_active ||
          now > endDate ||
          subscription.reports_used >= subscription.reports_limit)
      ) {
        // Redirect to subscription page if trying to create a new estimate
        const subscribeUrl = new URL("/subscribe", req.url);

        // Add query parameter with reason
        if (!subscription.is_active || now > endDate) {
          subscribeUrl.searchParams.set("reason", "expired");
        } else if (subscription.reports_used >= subscription.reports_limit) {
          subscribeUrl.searchParams.set("reason", "limit");
        }

        return NextResponse.redirect(subscribeUrl);
      }
    } catch (err) {
      console.error("Error checking subscription:", err);
    }
  }

  return res;
}

// Ensure the middleware is only called for relevant paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
};
