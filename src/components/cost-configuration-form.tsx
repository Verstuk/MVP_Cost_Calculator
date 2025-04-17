"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CostConfigurationFormProps {
  initialDeveloperRate?: number;
  initialDesignerRate?: number;
  initialProjectManagerRate?: number;
  initialQaTesterRate?: number;
}

export default function CostConfigurationForm({
  initialDeveloperRate = 8000,
  initialDesignerRate = 7000,
  initialProjectManagerRate = 9000,
  initialQaTesterRate = 6000,
}: CostConfigurationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    developerRate: initialDeveloperRate,
    designerRate: initialDesignerRate,
    projectManagerRate: initialProjectManagerRate,
    qaTesterRate: initialQaTesterRate,
  });

  // Fetch user's cost configuration on component mount
  useEffect(() => {
    const fetchCostConfig = async () => {
      try {
        setIsSubmitting(true);
        // Skip migration attempt since we can't use exec_sql

        const response = await fetch("/api/cost-configuration");

        if (response.ok) {
          const { data } = await response.json();
          if (data) {
            setFormData({
              developerRate: data.developerRate || initialDeveloperRate,
              designerRate: data.designerRate || initialDesignerRate,
              projectManagerRate:
                data.projectManagerRate || initialProjectManagerRate,
              qaTesterRate: data.qaTesterRate || initialQaTesterRate,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching cost configuration:", error);
        // Continue with default values if fetch fails
      } finally {
        setIsSubmitting(false);
      }
    };

    fetchCostConfig();
  }, [
    initialDeveloperRate,
    initialDesignerRate,
    initialProjectManagerRate,
    initialQaTesterRate,
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseInt(value) || 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/cost-configuration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update cost configuration");
      }

      setMessage({
        type: "success",
        text: "Cost configuration updated successfully",
      });
    } catch (error) {
      console.error("Error updating cost configuration:", error);
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="developerRate">Developer Rate (per month)</Label>
            <Input
              id="developerRate"
              name="developerRate"
              type="number"
              value={formData.developerRate}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="designerRate">Designer Rate (per month)</Label>
            <Input
              id="designerRate"
              name="designerRate"
              type="number"
              value={formData.designerRate}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectManagerRate">
              Project Manager Rate (per month)
            </Label>
            <Input
              id="projectManagerRate"
              name="projectManagerRate"
              type="number"
              value={formData.projectManagerRate}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="qaTesterRate">QA Tester Rate (per month)</Label>
            <Input
              id="qaTesterRate"
              name="qaTesterRate"
              type="number"
              value={formData.qaTesterRate}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`p-3 rounded-md ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
        >
          {message.text}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Configuration"}
      </Button>
    </form>
  );
}
