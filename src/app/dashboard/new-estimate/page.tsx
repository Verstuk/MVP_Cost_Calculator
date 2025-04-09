import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import QuestionnaireForm from "@/components/questionnaire/questionnaire-form";
import DashboardNavbar from "@/components/dashboard-navbar";

export default async function NewEstimate() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">New Cost Estimation</h1>
          <p className="text-gray-600 mb-8">
            Complete the questionnaire below to generate a detailed cost
            estimate for your MVP project.
          </p>

          <QuestionnaireForm userId={user.id} />
        </div>
      </main>
    </>
  );
}
