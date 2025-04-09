import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

type TeamCompositionData = {
  developers: number;
  designers: number;
  projectManagers: number;
  qaTesters: number;
};

type TeamCompositionProps = {
  data: TeamCompositionData;
  updateData: (data: TeamCompositionData) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
};

export default function TeamComposition({
  data,
  updateData,
  errors,
  setErrors,
}: TeamCompositionProps) {
  const handleSliderChange = (
    field: keyof TeamCompositionData,
    value: number[],
  ) => {
    updateData({ ...data, [field]: value[0] });
  };

  return (
    <div className="space-y-8">
      <p className="text-sm text-gray-600">
        Adjust the number of team members for each role. This will affect the
        cost estimate.
      </p>

      {/* Developers */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="developers" className="font-medium text-gray-900">
            Developers
          </Label>
          <span className="text-lg font-semibold">{data.developers}</span>
        </div>
        <Slider
          id="developers"
          min={1}
          max={10}
          step={1}
          value={[data.developers]}
          onValueChange={(value) => handleSliderChange("developers", value)}
        />
        <p className="text-sm text-gray-600">
          Software engineers who will build the application
        </p>
      </div>

      {/* Designers */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="designers" className="font-medium text-gray-900">
            Designers
          </Label>
          <span className="text-lg font-semibold">{data.designers}</span>
        </div>
        <Slider
          id="designers"
          min={0}
          max={5}
          step={1}
          value={[data.designers]}
          onValueChange={(value) => handleSliderChange("designers", value)}
        />
        <p className="text-sm text-gray-600">
          UI/UX designers responsible for the look and feel
        </p>
      </div>

      {/* Project Managers */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label
            htmlFor="projectManagers"
            className="font-medium text-gray-900"
          >
            Project Managers
          </Label>
          <span className="text-lg font-semibold">{data.projectManagers}</span>
        </div>
        <Slider
          id="projectManagers"
          min={0}
          max={3}
          step={1}
          value={[data.projectManagers]}
          onValueChange={(value) =>
            handleSliderChange("projectManagers", value)
          }
        />
        <p className="text-sm text-gray-600">
          Oversee the project and ensure timely delivery
        </p>
      </div>

      {/* QA Testers */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="qaTesters" className="font-medium text-gray-900">
            QA Testers
          </Label>
          <span className="text-lg font-semibold">{data.qaTesters}</span>
        </div>
        <Slider
          id="qaTesters"
          min={0}
          max={5}
          step={1}
          value={[data.qaTesters]}
          onValueChange={(value) => handleSliderChange("qaTesters", value)}
        />
        <p className="text-sm text-gray-600">
          Quality assurance specialists who test the application
        </p>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">
          Team Composition Summary
        </h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            Developers: <span className="font-semibold">{data.developers}</span>
          </div>
          <div>
            Designers: <span className="font-semibold">{data.designers}</span>
          </div>
          <div>
            Project Managers:{" "}
            <span className="font-semibold">{data.projectManagers}</span>
          </div>
          <div>
            QA Testers: <span className="font-semibold">{data.qaTesters}</span>
          </div>
          <div className="col-span-2 mt-2 pt-2 border-t border-blue-100">
            Total Team Size:{" "}
            <span className="font-semibold">
              {data.developers +
                data.designers +
                data.projectManagers +
                data.qaTesters}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
