"use client";

import {
  Select,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Spinner,
} from "@nextui-org/react";
import { useDiseases } from "@hooks/useDiseases";

interface DiseaseSelectorProps {
  selectedHospital: { hospital_id: string };
  selectedDisease: string;
  onDiseaseChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isOpenDiseasePopover: boolean;
  setIsOpenDiseasePopover: (open: boolean) => void;
}

export function DiseaseSelector({
  selectedHospital,
  selectedDisease,
  onDiseaseChange,
  isOpenDiseasePopover,
  setIsOpenDiseasePopover,
}: DiseaseSelectorProps) {
  const { diseases, isLoading } = useDiseases(selectedHospital.hospital_id);

  return (
    <Popover
      placement="right"
      isOpen={isOpenDiseasePopover && !selectedHospital.hospital_id}
      onOpenChange={(open) => setIsOpenDiseasePopover(open)}
    >
      <PopoverTrigger>
        <Select
          isRequired
          label="Select Disease"
          placeholder="Select your disease"
          className="max-w-xs"
          variant="bordered"
          value={selectedDisease}
          onChange={onDiseaseChange}
          disabled={isLoading || !selectedHospital.hospital_id}
          scrollShadowProps={{
            isEnabled: true,
          }}
          endContent={
            isLoading ? (
              <Spinner color="primary" size="sm" className="bottom-1/2" />
            ) : (
              ""
            )
          }
        >
          {diseases.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </Select>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">
          <div className="text-small font-bold">
            Please select a Hospital first
          </div>
          <div className="text-tiny">
            You must select a hospital before selecting a disease.
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
