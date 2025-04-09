import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProjectBasicsData = {
  projectName: string;
  projectDescription: string;
  industryType: string;
  projectType: string;
};

type ProjectBasicsProps = {
  data: ProjectBasicsData;
  updateData: (data: ProjectBasicsData) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
};

export default function ProjectBasics({
  data,
  updateData,
  errors,
  setErrors,
}: ProjectBasicsProps) {
  const handleChange = (field: keyof ProjectBasicsData, value: string) => {
    const newData = { ...data, [field]: value };
    updateData(newData);

    // Clear error for this field if it exists
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const industryOptions = [
    "E-commerce",
    "Healthcare",
    "Finance",
    "Education",
    "Social Media",
    "Entertainment",
    "Travel",
    "Real Estate",
    "Food & Beverage",
    "Fitness",
    "Technology",
    "Other",
  ];

  const projectTypeOptions = [
    "Web Application",
    "Mobile App",
    "Desktop Application",
    "Cross-platform App",
    "API/Backend Service",
    "E-commerce Store",
    "Content Platform",
    "Marketplace",
    "SaaS Product",
    "Other",
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="projectName">Project Name</Label>
        <Input
          id="projectName"
          value={data.projectName}
          onChange={(e) => handleChange("projectName", e.target.value)}
          placeholder="Enter your project name"
          className={errors.projectName ? "border-red-500" : ""}
        />
        {errors.projectName && (
          <p className="text-red-500 text-sm mt-1">{errors.projectName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectDescription">Project Description</Label>
        <Textarea
          id="projectDescription"
          value={data.projectDescription}
          onChange={(e) => handleChange("projectDescription", e.target.value)}
          placeholder="Briefly describe your project and its main purpose"
          rows={4}
          className={errors.projectDescription ? "border-red-500" : ""}
        />
        {errors.projectDescription && (
          <p className="text-red-500 text-sm mt-1">
            {errors.projectDescription}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="industryType">Industry</Label>
        <Select
          value={data.industryType}
          onValueChange={(value) => handleChange("industryType", value)}
        >
          <SelectTrigger
            className={errors.industryType ? "border-red-500" : ""}
          >
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            {industryOptions.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.industryType && (
          <p className="text-red-500 text-sm mt-1">{errors.industryType}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectType">Project Type</Label>
        <Select
          value={data.projectType}
          onValueChange={(value) => handleChange("projectType", value)}
        >
          <SelectTrigger className={errors.projectType ? "border-red-500" : ""}>
            <SelectValue placeholder="Select project type" />
          </SelectTrigger>
          <SelectContent>
            {projectTypeOptions.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.projectType && (
          <p className="text-red-500 text-sm mt-1">{errors.projectType}</p>
        )}
      </div>
    </div>
  );
}
