import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TechnologyStackData = {
  frontend: string[];
  backend: string[];
  database: string;
  hosting: string;
  additionalServices: string[];
};

type TechnologyStackProps = {
  data: TechnologyStackData;
  updateData: (data: TechnologyStackData) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
};

export default function TechnologyStack({
  data,
  updateData,
  errors,
  setErrors,
}: TechnologyStackProps) {
  const frontendOptions = [
    "React",
    "Angular",
    "Vue",
    "Next.js",
    "Plain HTML/CSS/JS",
  ];

  const backendOptions = [
    "Node.js",
    "Python",
    "Ruby on Rails",
    "PHP",
    "Java",
    ".NET",
    "Go",
  ];

  const databaseOptions = [
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Firebase",
    "SQL Server",
  ];

  const hostingOptions = [
    "AWS",
    "Google Cloud",
    "Microsoft Azure",
    "Heroku",
    "Vercel",
    "Netlify",
    "Digital Ocean",
  ];

  const additionalServicesOptions = [
    "Authentication Service",
    "Payment Processing",
    "Email Service",
    "File Storage",
    "CDN",
    "Search Service",
    "Analytics",
    "Monitoring",
  ];

  const handleFrontendToggle = (tech: string) => {
    const newFrontend = data.frontend.includes(tech)
      ? data.frontend.filter((t) => t !== tech)
      : [...data.frontend, tech];

    updateData({ ...data, frontend: newFrontend });

    // Clear error if at least one option is selected
    if (newFrontend.length > 0) {
      const newErrors = { ...errors };
      delete newErrors.frontend;
      setErrors(newErrors);
    }
  };

  const handleBackendToggle = (tech: string) => {
    const newBackend = data.backend.includes(tech)
      ? data.backend.filter((t) => t !== tech)
      : [...data.backend, tech];

    updateData({ ...data, backend: newBackend });

    // Clear error if at least one option is selected
    if (newBackend.length > 0) {
      const newErrors = { ...errors };
      delete newErrors.backend;
      setErrors(newErrors);
    }
  };

  const handleDatabaseChange = (value: string) => {
    updateData({ ...data, database: value });

    // Clear error
    const newErrors = { ...errors };
    delete newErrors.database;
    setErrors(newErrors);
  };

  const handleHostingChange = (value: string) => {
    updateData({ ...data, hosting: value });

    // Clear error
    const newErrors = { ...errors };
    delete newErrors.hosting;
    setErrors(newErrors);
  };

  const handleAdditionalServiceToggle = (service: string) => {
    const newServices = data.additionalServices.includes(service)
      ? data.additionalServices.filter((s) => s !== service)
      : [...data.additionalServices, service];

    updateData({ ...data, additionalServices: newServices });
  };

  return (
    <div className="space-y-8">
      {/* Frontend */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Frontend Technologies</h3>
        <p className="text-sm text-gray-600">Select all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {frontendOptions.map((tech) => (
            <div key={tech} className="flex items-center space-x-2">
              <Checkbox
                id={`frontend-${tech}`}
                checked={data.frontend.includes(tech)}
                onCheckedChange={() => handleFrontendToggle(tech)}
              />
              <Label htmlFor={`frontend-${tech}`} className="cursor-pointer">
                {tech}
              </Label>
            </div>
          ))}
        </div>
        {errors.frontend && (
          <p className="text-red-500 text-sm">{errors.frontend}</p>
        )}
      </div>

      {/* Backend */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Backend Technologies</h3>
        <p className="text-sm text-gray-600">Select all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {backendOptions.map((tech) => (
            <div key={tech} className="flex items-center space-x-2">
              <Checkbox
                id={`backend-${tech}`}
                checked={data.backend.includes(tech)}
                onCheckedChange={() => handleBackendToggle(tech)}
              />
              <Label htmlFor={`backend-${tech}`} className="cursor-pointer">
                {tech}
              </Label>
            </div>
          ))}
        </div>
        {errors.backend && (
          <p className="text-red-500 text-sm">{errors.backend}</p>
        )}
      </div>

      {/* Database */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Database</h3>
        <Select value={data.database} onValueChange={handleDatabaseChange}>
          <SelectTrigger className={errors.database ? "border-red-500" : ""}>
            <SelectValue placeholder="Select database" />
          </SelectTrigger>
          <SelectContent>
            {databaseOptions.map((db) => (
              <SelectItem key={db} value={db}>
                {db}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.database && (
          <p className="text-red-500 text-sm">{errors.database}</p>
        )}
      </div>

      {/* Hosting */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Hosting/Deployment</h3>
        <Select value={data.hosting} onValueChange={handleHostingChange}>
          <SelectTrigger className={errors.hosting ? "border-red-500" : ""}>
            <SelectValue placeholder="Select hosting provider" />
          </SelectTrigger>
          <SelectContent>
            {hostingOptions.map((host) => (
              <SelectItem key={host} value={host}>
                {host}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.hosting && (
          <p className="text-red-500 text-sm">{errors.hosting}</p>
        )}
      </div>

      {/* Additional Services */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Additional Services</h3>
        <p className="text-sm text-gray-600">Select all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {additionalServicesOptions.map((service) => (
            <div key={service} className="flex items-center space-x-2">
              <Checkbox
                id={`service-${service}`}
                checked={data.additionalServices.includes(service)}
                onCheckedChange={() => handleAdditionalServiceToggle(service)}
              />
              <Label htmlFor={`service-${service}`} className="cursor-pointer">
                {service}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
