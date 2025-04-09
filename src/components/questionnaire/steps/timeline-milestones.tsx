import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";

type TimelineMilestonesData = {
  durationMonths: number;
  startDate: string;
  milestones: { title: string; duration: number }[];
};

type TimelineMilestonesProps = {
  data: TimelineMilestonesData;
  updateData: (data: TimelineMilestonesData) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
};

export default function TimelineMilestones({
  data,
  updateData,
  errors,
  setErrors,
}: TimelineMilestonesProps) {
  const [newMilestone, setNewMilestone] = useState({ title: "", duration: 2 });

  const handleDurationChange = (value: number[]) => {
    updateData({ ...data, durationMonths: value[0] });

    // Clear error
    if (errors.durationMonths) {
      const newErrors = { ...errors };
      delete newErrors.durationMonths;
      setErrors(newErrors);
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ ...data, startDate: e.target.value });

    // Clear error
    if (errors.startDate) {
      const newErrors = { ...errors };
      delete newErrors.startDate;
      setErrors(newErrors);
    }
  };

  const handleNewMilestoneTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewMilestone({ ...newMilestone, title: e.target.value });
  };

  const handleNewMilestoneDurationChange = (value: number[]) => {
    setNewMilestone({ ...newMilestone, duration: value[0] });
  };

  const addMilestone = () => {
    if (newMilestone.title.trim() === "") return;

    const updatedMilestones = [...data.milestones, { ...newMilestone }];
    updateData({ ...data, milestones: updatedMilestones });
    setNewMilestone({ title: "", duration: 2 });
  };

  const removeMilestone = (index: number) => {
    const updatedMilestones = data.milestones.filter((_, i) => i !== index);
    updateData({ ...data, milestones: updatedMilestones });
  };

  // Calculate total milestone duration
  const totalMilestoneDuration = data.milestones.reduce(
    (total, milestone) => total + milestone.duration,
    0,
  );

  return (
    <div className="space-y-8">
      {/* Project Duration */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="duration" className="font-medium text-gray-900">
            Project Duration (months)
          </Label>
          <span className="text-lg font-semibold">{data.durationMonths}</span>
        </div>
        <Slider
          id="duration"
          min={1}
          max={24}
          step={1}
          value={[data.durationMonths]}
          onValueChange={handleDurationChange}
          className={errors.durationMonths ? "border-red-500" : ""}
        />
        {errors.durationMonths && (
          <p className="text-red-500 text-sm">{errors.durationMonths}</p>
        )}
      </div>

      {/* Start Date */}
      <div className="space-y-2">
        <Label htmlFor="startDate" className="font-medium text-gray-900">
          Estimated Start Date
        </Label>
        <Input
          id="startDate"
          type="date"
          value={data.startDate}
          onChange={handleStartDateChange}
          className={errors.startDate ? "border-red-500" : ""}
        />
        {errors.startDate && (
          <p className="text-red-500 text-sm">{errors.startDate}</p>
        )}
      </div>

      {/* Milestones */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Project Milestones</h3>
        <p className="text-sm text-gray-600">
          Add key milestones to track progress throughout your project
        </p>

        {/* Add new milestone */}
        <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
          <Label htmlFor="milestoneName" className="text-sm font-medium">
            New Milestone
          </Label>
          <div className="flex gap-2">
            <Input
              id="milestoneName"
              value={newMilestone.title}
              onChange={handleNewMilestoneTitleChange}
              placeholder="Milestone name"
              className="flex-1"
            />
            <div className="w-32">
              <div className="flex justify-between text-xs mb-1">
                <span>Duration</span>
                <span>{newMilestone.duration} weeks</span>
              </div>
              <Slider
                min={1}
                max={12}
                step={1}
                value={[newMilestone.duration]}
                onValueChange={handleNewMilestoneDurationChange}
              />
            </div>
            <Button
              type="button"
              onClick={addMilestone}
              size="icon"
              variant="outline"
              disabled={!newMilestone.title.trim()}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Milestone list */}
        {data.milestones.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Current Milestones</h4>
            <div className="space-y-2">
              {data.milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{milestone.title}</div>
                    <div className="text-sm text-gray-600">
                      {milestone.duration} weeks
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMilestone(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Total milestone duration: {totalMilestoneDuration} weeks (
              {Math.round(totalMilestoneDuration / 4.33)} months)
            </div>
          </div>
        )}
      </div>

      {/* Timeline Summary */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Timeline Summary</h4>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div>
            Project Duration:{" "}
            <span className="font-semibold">{data.durationMonths} months</span>
          </div>
          <div>
            Start Date:{" "}
            <span className="font-semibold">
              {data.startDate
                ? new Date(data.startDate).toLocaleDateString()
                : "Not set"}
            </span>
          </div>
          <div>
            End Date:{" "}
            <span className="font-semibold">
              {data.startDate
                ? new Date(
                    new Date(data.startDate).setMonth(
                      new Date(data.startDate).getMonth() + data.durationMonths,
                    ),
                  ).toLocaleDateString()
                : "Not set"}
            </span>
          </div>
          <div>
            Number of Milestones:{" "}
            <span className="font-semibold">{data.milestones.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
