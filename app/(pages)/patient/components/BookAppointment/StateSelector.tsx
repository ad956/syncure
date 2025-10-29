"use client";

import { Select, SelectItem, Spinner } from "@nextui-org/react";
import { useStates } from "@hooks/useLocations";

interface StateSelectorProps {
  selectedState: string;
  onStateChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function StateSelector({
  selectedState,
  onStateChange,
}: StateSelectorProps) {
  const { states, isLoading } = useStates();

  return (
    <Select
      isRequired
      label="Select State"
      placeholder="Select your state"
      className="max-w-xs"
      variant="bordered"
      value={selectedState}
      onChange={onStateChange}
      endContent={
        isLoading ? (
          <Spinner color="primary" size="sm" className="bottom-1/2" />
        ) : (
          ""
        )
      }
      scrollShadowProps={{
        isEnabled: true,
      }}
    >
      {states.map((item) => (
        <SelectItem key={item} value={item}>
          {item}
        </SelectItem>
      ))}
    </Select>
  );
}
