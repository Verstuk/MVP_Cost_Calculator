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
  Shield,
  Users,
} from "lucide-react";
import { createClient } from "../../supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
