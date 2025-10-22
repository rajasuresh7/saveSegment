import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { toast } from "sonner";
import { Trash } from "lucide-react";

import {
  SchemaField,
  ALL_OPTIONS,
  SchemaLabels,
  SchemaIcons,
} from "~/lib/type";
import { useSaveSegment } from "~/lib/hook";

const getTraitType = (val: SchemaField) => {
  const found = ALL_OPTIONS.find((o) => o.value === val);
  return found?.type || "user";
};

export default function Home() {
  const [open, setOpen] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [addSelectValue, setAddSelectValue] = useState<SchemaField | "">("");
  const [selectedSchemas, setSelectedSchemas] = useState<SchemaField[]>([]);
  const [showAddSchemaDropdown, setShowAddSchemaDropdown] = useState(false);

  const { mutateAsync: saveSegmentMutation, isPending } = useSaveSegment();

  const availableForMainSelect = useMemo(
    () => ALL_OPTIONS.filter((o) => !selectedSchemas.includes(o.value)),
    [selectedSchemas]
  );

  const handleSave = async () => {
    if (!segmentName) return toast.error("Missing Segment Name");
    if (selectedSchemas.length === 0)
      return toast.error("Add at least one schema");

    const schema = selectedSchemas.map((val) => ({
      [val]: SchemaLabels[val],
    }));
    const payload = { segment_name: segmentName, schema };
    console.log(payload);

    try {
      await saveSegmentMutation(payload);
      toast.success("Segment saved successfully!");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save segment");
    }
  };

  return (
    <div className="p-6">
      <Sheet
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSegmentName("");
            setSelectedSchemas([]);
            setAddSelectValue("");
            setShowAddSchemaDropdown(false);
          }
          setOpen(isOpen);
        }}
      >
        <SheetTrigger asChild>
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            Save Segment
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-[400px] sm:w-[450px] p-6 flex flex-col h-full"
        >
          <SheetHeader>
            <SheetTitle>Saving Segment</SheetTitle>
          </SheetHeader>

          <div className="mt-4 flex-1 flex flex-col gap-6 overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="segment_name">
                Enter the Name of the Segment
              </Label>
              <Input
                id="segment_name"
                placeholder="e.g. last_10_days_blog_visits"
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                To save your segment, you need to add the schemas to build the
                query
              </p>
            </div>

            <div className="flex justify-end items-center gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[12px] text-gray-800 font-sans">
                  - User Traits
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-[12px] text-gray-800 font-sans">
                  - Group Traits
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Selected Schemas</Label>
              <div className="border rounded-md p-2 space-y-2 max-h-[200px] overflow-y-auto">
                {selectedSchemas.length === 0 && (
                  <p className="text-sm text-center text-muted-foreground">
                    -- No schemas added yet --
                  </p>
                )}
                {selectedSchemas.map((val, idx) => {
                  const allowedOptions = ALL_OPTIONS.filter(
                    (o) => !selectedSchemas.includes(o.value) || o.value === val
                  );
                  const traitType = getTraitType(val);

                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-1 rounded-md"
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          traitType === "user" ? "bg-green-500" : "bg-pink-500"
                        }`}
                      />
                      <Select
                        value={val}
                        onValueChange={(newValue) =>
                          setSelectedSchemas((prev) => {
                            const copy = [...prev];
                            copy[idx] = newValue as SchemaField;
                            return copy;
                          })
                        }
                      >
                        <SelectTrigger className="flex-1 flex items-center gap-2">
                          <SelectValue placeholder="Select schema" />
                        </SelectTrigger>
                        <SelectContent>
                          {allowedOptions.map((opt) => {
                            const Icon = SchemaIcons[opt.value];
                            return (
                              <SelectItem key={opt.value} value={opt.value}>
                                <div className="flex items-center gap-2">
                                  <Icon className="w-4 h-4 text-gray-500" />
                                  {opt.label}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>

                      <Button
                        onClick={() =>
                          setSelectedSchemas((prev) =>
                            prev.filter((_, i) => i !== idx)
                          )
                        }
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50 text-[12px] flex items-center gap-1"
                      >
                        <Trash size={2} />
                        Remove
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Add Schema to Segment</Label>

              {showAddSchemaDropdown ? (
                <div className="flex gap-2">
                  <Select
                    value={addSelectValue}
                    onValueChange={(value) => {
                      const val = value as SchemaField;
                      if (selectedSchemas.includes(val)) {
                        toast.error("Schema already added");
                      } else {
                        setSelectedSchemas((prev) => [...prev, val]);
                      }
                      setAddSelectValue("");
                      setShowAddSchemaDropdown(false);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Add Schema to Segment" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableForMainSelect.map((opt) => {
                        const Icon = SchemaIcons[opt.value];
                        return (
                          <SelectItem key={opt.value} value={opt.value}>
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  opt.type === "user"
                                    ? "bg-green-500"
                                    : "bg-pink-500"
                                }`}
                              />
                              <Icon className="w-4 h-4 text-gray-500" />
                              {opt.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <p
                  className="text-sm text-blue-600 underline underline-offset-2 cursor-pointer"
                  onClick={() => setShowAddSchemaDropdown(true)}
                >
                  + Add new schema
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-start gap-3 pt-2 border-t mt-4">
            <Button
              onClick={handleSave}
              className="bg-blue-600 text-white"
              disabled={
                !segmentName || selectedSchemas.length === 0 || isPending
              }
            >
              {isPending ? "Saving..." : "Save the Segment"}
            </Button>
            <Button
              variant="ghost"
              className="text-pink-600 hover:bg-pink-50"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
