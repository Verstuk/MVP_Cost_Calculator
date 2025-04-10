"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ProjectBasics from "./steps/project-basics";
import FeatureSelection from "./steps/feature-selection";
import TechnologyStack from "./steps/technology-stack";
import TeamComposition from "./steps/team-composition";
import TimelineMilestones from "./steps/timeline-milestones";
import { useRouter } from "next/navigation";
import { createClient } from "../../../supabase/client";

type QuestionnaireStep = {
  id: number;
  title: string;
  component: React.ReactNode;
};

type QuestionnaireData = {
  projectBasics: {
    projectName: string;
    projectDescription: string;
    industryType: string;
    projectType: string;
  };
  features: string[];
  customFeatures: string[];
  technologies: {
    frontend: string[];
    backend: string[];
    database: string;
    hosting: string;
    additionalServices: string[];
  };
  team: {
    developers: number;
    designers: number;
    projectManagers: number;
    qaTesters: number;
  };
  timeline: {
    durationMonths: number;
    startDate: string;
    milestones: { title: string; duration: number }[];
  };
};

export default function QuestionnaireForm({ userId }: { userId: string }) {
  const router = useRouter();
  const supabase = createClient();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<QuestionnaireData>({
    projectBasics: {
      projectName: "",
      projectDescription: "",
      industryType: "",
      projectType: "",
    },
    features: [],
    customFeatures: [],
    technologies: {
      frontend: [],
      backend: [],
      database: "",
      hosting: "",
      additionalServices: [],
    },
    team: {
      developers: 1,
      designers: 1,
      projectManagers: 1,
      qaTesters: 0,
    },
    timeline: {
      durationMonths: 3,
      startDate: new Date().toISOString().split("T")[0],
      milestones: [],
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps: QuestionnaireStep[] = [
    {
      id: 1,
      title: "Project Basics",
      component: (
        <ProjectBasics
          data={formData.projectBasics}
          updateData={(data) =>
            setFormData({ ...formData, projectBasics: data })
          }
          errors={errors}
          setErrors={setErrors}
        />
      ),
    },
    {
      id: 2,
      title: "Feature Selection",
      component: (
        <FeatureSelection
          features={formData.features}
          customFeatures={formData.customFeatures}
          updateFeatures={(features) => setFormData({ ...formData, features })}
          updateCustomFeatures={(customFeatures) =>
            setFormData({ ...formData, customFeatures })
          }
          errors={errors}
          setErrors={setErrors}
        />
      ),
    },
    {
      id: 3,
      title: "Technology Stack",
      component: (
        <TechnologyStack
          data={formData.technologies}
          updateData={(technologies) =>
            setFormData({ ...formData, technologies })
          }
          errors={errors}
          setErrors={setErrors}
        />
      ),
    },
    {
      id: 4,
      title: "Team Composition",
      component: (
        <TeamComposition
          data={formData.team}
          updateData={(team) => setFormData({ ...formData, team })}
          errors={errors}
          setErrors={setErrors}
        />
      ),
    },
    {
      id: 5,
      title: "Timeline & Milestones",
      component: (
        <TimelineMilestones
          data={formData.timeline}
          updateData={(timeline) => setFormData({ ...formData, timeline })}
          errors={errors}
          setErrors={setErrors}
        />
      ),
    },
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    switch (step) {
      case 1: // Project Basics
        if (!formData.projectBasics.projectName) {
          newErrors.projectName = "Project name is required";
          isValid = false;
        }
        if (!formData.projectBasics.projectDescription) {
          newErrors.projectDescription = "Project description is required";
          isValid = false;
        }
        if (!formData.projectBasics.industryType) {
          newErrors.industryType = "Industry type is required";
          isValid = false;
        }
        if (!formData.projectBasics.projectType) {
          newErrors.projectType = "Project type is required";
          isValid = false;
        }
        break;
      case 2: // Feature Selection
        if (
          formData.features.length === 0 &&
          formData.customFeatures.length === 0
        ) {
          newErrors.features =
            "Select at least one feature or add a custom feature";
          isValid = false;
        }
        break;
      case 3: // Technology Stack
        if (formData.technologies.frontend.length === 0) {
          newErrors.frontend = "Select at least one frontend technology";
          isValid = false;
        }
        if (formData.technologies.backend.length === 0) {
          newErrors.backend = "Select at least one backend technology";
          isValid = false;
        }
        if (!formData.technologies.database) {
          newErrors.database = "Database selection is required";
          isValid = false;
        }
        if (!formData.technologies.hosting) {
          newErrors.hosting = "Hosting selection is required";
          isValid = false;
        }
        break;
      case 4: // Team Composition
        // All fields have defaults, so no validation needed
        break;
      case 5: // Timeline & Milestones
        if (formData.timeline.durationMonths < 1) {
          newErrors.durationMonths = "Duration must be at least 1 month";
          isValid = false;
        }
        if (!formData.timeline.startDate) {
          newErrors.startDate = "Start date is required";
          isValid = false;
        }
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const calculateCost = () => {
    // Base rates (per month)
    const developerRate = 8000;
    const designerRate = 7000;
    const projectManagerRate = 9000;
    const qaTesterRate = 6000;

    // Technology complexity multipliers
    const techComplexity = {
      frontend: {
        React: 1.2,
        Angular: 1.3,
        Vue: 1.1,
        "Next.js": 1.25,
        "Plain HTML/CSS/JS": 0.8,
      },
      backend: {
        "Node.js": 1.1,
        Python: 1.2,
        "Ruby on Rails": 1.15,
        PHP: 0.9,
        Java: 1.3,
        ".NET": 1.25,
        Go: 1.2,
      },
      database: {
        MongoDB: 1.1,
        PostgreSQL: 1.15,
        MySQL: 1.0,
        Firebase: 0.9,
        "SQL Server": 1.2,
      },
    };

    // Feature complexity
    const featureComplexity =
      1 +
      formData.features.length * 0.1 +
      formData.customFeatures.length * 0.15;

    // Calculate team cost
    const teamMonthlyCost =
      formData.team.developers * developerRate +
      formData.team.designers * designerRate +
      formData.team.projectManagers * projectManagerRate +
      formData.team.qaTesters * qaTesterRate;

    // Calculate technology multiplier
    let techMultiplier = 1.0;

    // Frontend multiplier (average if multiple)
    if (formData.technologies.frontend.length > 0) {
      const frontendMultipliers = formData.technologies.frontend.map(
        (tech) =>
          techComplexity.frontend[
            tech as keyof typeof techComplexity.frontend
          ] || 1.0,
      );
      techMultiplier *=
        frontendMultipliers.reduce((sum, val) => sum + val, 0) /
        frontendMultipliers.length;
    }

    // Backend multiplier (average if multiple)
    if (formData.technologies.backend.length > 0) {
      const backendMultipliers = formData.technologies.backend.map(
        (tech) =>
          techComplexity.backend[tech as keyof typeof techComplexity.backend] ||
          1.0,
      );
      techMultiplier *=
        backendMultipliers.reduce((sum, val) => sum + val, 0) /
        backendMultipliers.length;
    }

    // Database multiplier
    if (formData.technologies.database) {
      techMultiplier *=
        techComplexity.database[
          formData.technologies.database as keyof typeof techComplexity.database
        ] || 1.0;
    }

    // Additional services multiplier
    techMultiplier *=
      1 + formData.technologies.additionalServices.length * 0.05;

    // Calculate total cost
    const totalCost =
      teamMonthlyCost *
      formData.timeline.durationMonths *
      featureComplexity *
      techMultiplier;

    // Round to nearest thousand
    return Math.round(totalCost / 1000) * 1000;
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      // Check subscription status first
      const { data: subscription, error: subscriptionError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (subscriptionError) {
        console.error("Error fetching subscription:", subscriptionError);
        throw new Error("Failed to verify subscription status");
      }

      // Check if subscription is active and not expired
      const now = new Date();
      const endDate = subscription ? new Date(subscription.end_date) : null;

      if (
        !subscription ||
        !subscription.is_active ||
        now > endDate ||
        subscription.reports_used >= subscription.reports_limit
      ) {
        let errorMessage =
          "Your subscription doesn't allow creating more reports.";

        if (!subscription || !subscription.is_active || now > endDate) {
          errorMessage =
            "Your subscription has expired. Please upgrade to continue.";
        } else if (subscription.reports_used >= subscription.reports_limit) {
          errorMessage = `You've reached your limit of ${subscription.reports_limit} reports. Please upgrade your subscription.`;
        }

        setErrors({
          submit: errorMessage,
        });
        return;
      }

      // Calculate the cost estimate
      const estimatedCost = calculateCost();

      // Generate a report ID
      const reportId = `report-${Date.now()}`;

      // Save the report to Supabase
      const { error } = await supabase.from("cost_reports").insert({
        id: reportId,
        user_id: userId,
        project_name: formData.projectBasics.projectName,
        project_description: formData.projectBasics.projectDescription,
        industry_type: formData.projectBasics.industryType,
        project_type: formData.projectBasics.projectType,
        features: formData.features,
        custom_features: formData.customFeatures,
        technologies: formData.technologies,
        team_composition: formData.team,
        timeline: formData.timeline,
        estimated_cost: estimatedCost,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error saving report:", error);
        throw new Error("Failed to save report");
      }

      // Update the reports_used count in the subscription
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({ reports_used: subscription.reports_used + 1 })
        .eq("user_id", userId);

      if (updateError) {
        console.error("Error updating subscription usage:", updateError);
        // Continue anyway since the report was saved
      }

      // Redirect to the report page
      router.push(`/dashboard/reports/${reportId}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({
        submit: "Failed to generate report. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`text-sm font-medium ${currentStep >= step.id ? "text-blue-600" : "text-gray-400"}`}
            >
              {step.title}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Form card */}
      <Card className="p-6 shadow-md">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {steps[currentStep - 1].title}
          </h2>
          <p className="text-gray-600">
            Step {currentStep} of {steps.length}
          </p>
        </div>

        {/* Current step component */}
        <div className="mb-8">{steps[currentStep - 1].component}</div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Generating Report..." : "Generate Cost Report"}
            </Button>
          )}
        </div>

        {errors.submit && (
          <div className="mt-4 text-red-500 text-sm">{errors.submit}</div>
        )}
      </Card>
    </div>
  );
}
