import { redirect } from "next/navigation";
import { createClient } from "../../../../../supabase/server";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, FileText } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Client component for PDF generation
const PDFDownloadButton = dynamic(
  () => import("@/components/pdf-download-button"),
  { ssr: false },
);

export default async function ReportPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch the report
  const { data: report, error } = await supabase
    .from("cost_reports")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (error || !report) {
    return redirect("/dashboard");
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate end date
  const startDate = new Date(report.timeline.startDate);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + report.timeline.durationMonths);

  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8" id="report-container">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/dashboard"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
            <PDFDownloadButton report={report} />
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-8 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {report.project_name}
                </h1>
                <p className="text-gray-600">
                  Created on {new Date(report.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Estimated Cost</div>
                <div className="text-4xl font-bold text-blue-600">
                  {formatCurrency(report.estimated_cost)}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Industry
                  </h3>
                  <p>{report.industry_type}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Project Type
                  </h3>
                  <p>{report.project_type}</p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    Description
                  </h3>
                  <p>{report.project_description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {report.timeline.durationMonths} months
                </div>
                <p className="text-sm text-gray-600">
                  {startDate.toLocaleDateString()} -{" "}
                  {endDate.toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Team Size
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {report.team_composition.developers +
                    report.team_composition.designers +
                    report.team_composition.projectManagers +
                    report.team_composition.qaTesters}{" "}
                  members
                </div>
                <p className="text-sm text-gray-600">
                  {report.team_composition.developers} developers,{" "}
                  {report.team_composition.designers} designers
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {report.features.length + report.custom_features.length} total
                </div>
                <p className="text-sm text-gray-600">
                  {report.features.length} standard,{" "}
                  {report.custom_features.length} custom
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                {report.features.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Standard Features
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {report.features.map((feature: string, index: number) => (
                        <li key={index} className="text-gray-700">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {report.custom_features.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Custom Features
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {report.custom_features.map(
                        (feature: string, index: number) => (
                          <li key={index} className="text-gray-700">
                            {feature}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Technology Stack */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Technology Stack
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Frontend
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {report.technologies.frontend.map(
                        (tech: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                          >
                            {tech}
                          </span>
                        ),
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Backend
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {report.technologies.backend.map(
                        (tech: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm"
                          >
                            {tech}
                          </span>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        Database
                      </h3>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                        {report.technologies.database}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        Hosting
                      </h3>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                        {report.technologies.hosting}
                      </span>
                    </div>
                  </div>

                  {report.technologies.additionalServices.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        Additional Services
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {report.technologies.additionalServices.map(
                          (service: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm"
                            >
                              {service}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cost Breakdown */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Team Costs
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span>
                          Developers ({report.team_composition.developers})
                        </span>
                        <span>
                          {formatCurrency(
                            report.team_composition.developers *
                              8000 *
                              report.timeline.durationMonths,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>
                          Designers ({report.team_composition.designers})
                        </span>
                        <span>
                          {formatCurrency(
                            report.team_composition.designers *
                              7000 *
                              report.timeline.durationMonths,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>
                          Project Managers (
                          {report.team_composition.projectManagers})
                        </span>
                        <span>
                          {formatCurrency(
                            report.team_composition.projectManagers *
                              9000 *
                              report.timeline.durationMonths,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>
                          QA Testers ({report.team_composition.qaTesters})
                        </span>
                        <span>
                          {formatCurrency(
                            report.team_composition.qaTesters *
                              6000 *
                              report.timeline.durationMonths,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Other Factors
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span>Technology Complexity</span>
                        <span>
                          +
                          {Math.round(
                            (report.estimated_cost /
                              (report.team_composition.developers * 8000 +
                                report.team_composition.designers * 7000 +
                                report.team_composition.projectManagers * 9000 +
                                report.team_composition.qaTesters * 6000) /
                              report.timeline.durationMonths -
                              1) *
                              100,
                          )}
                          %
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Feature Complexity</span>
                        <span>
                          +
                          {report.features.length * 10 +
                            report.custom_features.length * 15}
                          %
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Project Duration</span>
                        <span>{report.timeline.durationMonths} months</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">
                      Total Estimated Cost
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatCurrency(report.estimated_cost)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    This estimate includes development, design, project
                    management, and quality assurance costs for the entire
                    project duration.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          {report.timeline.milestones.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Project Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {report.timeline.milestones.map(
                    (milestone: any, index: number) => {
                      const offset = index * 4; // 4 weeks per milestone on average
                      return (
                        <div key={index} className="mb-6 relative">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-12 text-sm text-gray-500">
                              Week {offset + 1}
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                                <h3 className="font-medium">
                                  {milestone.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {milestone.duration} weeks
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  );
}
