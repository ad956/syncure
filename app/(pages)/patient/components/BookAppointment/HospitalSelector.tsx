"use client";

import {
  Select,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Spinner,
} from "@nextui-org/react";
import useQuery from "@hooks/useQuery";
import { ChangeEvent } from "react";

interface BookAppointmentHospital {
  hospital_id: string;
  hospital_name: string;
}

interface HospitalSelectorProps {
  selectedState: string;
  selectedCity: string;
  selectedHospital: BookAppointmentHospital;
  onHospitalChange: (hospital: BookAppointmentHospital) => void;
  isOpenHospitalPopover: boolean;
  setIsOpenHospitalPopover: (open: boolean) => void;
}

export function HospitalSelector({
  selectedState,
  selectedCity,
  selectedHospital,
  onHospitalChange,
  isOpenHospitalPopover,
  setIsOpenHospitalPopover,
}: HospitalSelectorProps) {
  const { data: hospitals = [], isLoading } = useQuery<
    BookAppointmentHospital[]
  >(
    selectedState && selectedCity
      ? `/api/get-hospitals/?state=${selectedState}&city=${selectedCity}`
      : null
  );

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;

    const selectedHospitalObj = hospitals.find(
      (hospital) => hospital.hospital_id === selectedId
    );

    if (selectedHospitalObj) {
      // Call the parent's onHospitalChange with the complete hospital object
      onHospitalChange(selectedHospitalObj);
    }

    setIsOpenHospitalPopover(false);
  };

  return (
    <Popover
      placement="right"
      isOpen={isOpenHospitalPopover && !selectedCity}
      onOpenChange={(open) => setIsOpenHospitalPopover(open)}
    >
      <PopoverTrigger>
        <Select
          isRequired
          label="Select Hospital"
          placeholder="Select your preferred hospital"
          className="max-w-xs"
          variant="bordered"
          value={selectedHospital.hospital_name}
          onChange={handleChange}
          disabled={isLoading || !selectedCity}
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
          {hospitals.map((item) => (
            <SelectItem key={item.hospital_id} value={item.hospital_id}>
              {item.hospital_name}
            </SelectItem>
          ))}
        </Select>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">
          <div className="text-small font-bold">Please select a city first</div>
          <div className="text-tiny">
            You must select a city before selecting a hospital.
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
