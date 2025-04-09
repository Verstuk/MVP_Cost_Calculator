import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PlusCircle, X } from "lucide-react";

type FeatureSelectionProps = {
  features: string[];
  customFeatures: string[];
  updateFeatures: (features: string[]) => void;
  updateCustomFeatures: (customFeatures: string[]) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
};

export default function FeatureSelection({
  features,
  customFeatures,
  updateFeatures,
  updateCustomFeatures,
  errors,
  setErrors,
}: FeatureSelectionProps) {
  const [newCustomFeature, setNewCustomFeature] = useState("");

  const commonFeatures = [
    {
      category: "User Management",
      features: [
        "User Registration/Login",
        "User Profiles",
        "Role-based Access Control",
        "Social Login Integration",
        "Password Reset",
      ],
    },
    {
      category: "Content & Data",
      features: [
        "Content Management System",
        "File Upload/Storage",
        "Search Functionality",
        "Data Visualization",
        "Filtering & Sorting",
        "Export to CSV/PDF",
      ],
    },
    {
      category: "E-commerce",
      features: [
        "Product Catalog",
        "Shopping Cart",
        "Payment Processing",
        "Order Management",
        "Inventory Management",
        "Discount/Promo Codes",
      ],
    },
    {
      category: "Communication",
      features: [
        "Messaging/Chat",
        "Email Notifications",
        "Push Notifications",
        "Comments/Reviews",
        "Contact Forms",
      ],
    },
    {
      category: "Integration",
      features: [
        "Third-party API Integration",
        "Payment Gateway",
        "Analytics Integration",
        "Social Media Integration",
        "Calendar Integration",
      ],
    },
  ];

  const handleFeatureToggle = (feature: string) => {
    const newFeatures = features.includes(feature)
      ? features.filter((f) => f !== feature)
      : [...features, feature];

    updateFeatures(newFeatures);

    // Clear error if at least one feature is selected
    if (newFeatures.length > 0 || customFeatures.length > 0) {
      const newErrors = { ...errors };
      delete newErrors.features;
      setErrors(newErrors);
    }
  };

  const addCustomFeature = () => {
    if (newCustomFeature.trim() === "") return;

    const updatedCustomFeatures = [...customFeatures, newCustomFeature.trim()];
    updateCustomFeatures(updatedCustomFeatures);
    setNewCustomFeature("");

    // Clear error if at least one feature is selected
    if (features.length > 0 || updatedCustomFeatures.length > 0) {
      const newErrors = { ...errors };
      delete newErrors.features;
      setErrors(newErrors);
    }
  };

  const removeCustomFeature = (index: number) => {
    const updatedCustomFeatures = customFeatures.filter((_, i) => i !== index);
    updateCustomFeatures(updatedCustomFeatures);

    // Add error if no features are selected
    if (features.length === 0 && updatedCustomFeatures.length === 0) {
      setErrors({
        ...errors,
        features: "Select at least one feature or add a custom feature",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-600 mb-4">
          Select the features you want to include in your MVP. This will help us
          estimate the development cost.
        </p>
        {errors.features && (
          <p className="text-red-500 text-sm mb-4">{errors.features}</p>
        )}
      </div>

      {/* Common features */}
      <div className="space-y-6">
        {commonFeatures.map((category) => (
          <div key={category.category} className="space-y-3">
            <h3 className="font-medium text-gray-900">{category.category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {category.features.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={features.includes(feature)}
                    onCheckedChange={() => handleFeatureToggle(feature)}
                  />
                  <Label htmlFor={feature} className="cursor-pointer">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Custom features */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Custom Features</h3>
        <div className="flex items-center space-x-2">
          <Input
            value={newCustomFeature}
            onChange={(e) => setNewCustomFeature(e.target.value)}
            placeholder="Enter a custom feature"
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomFeature();
              }
            }}
          />
          <Button
            type="button"
            onClick={addCustomFeature}
            size="icon"
            variant="outline"
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>

        {customFeatures.length > 0 && (
          <div className="space-y-2 mt-4">
            {customFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-2 rounded"
              >
                <span>{feature}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCustomFeature(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
