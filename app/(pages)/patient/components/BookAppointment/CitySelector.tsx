"use client";

import {
  Select,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Spinner,
} from "@nextui-org/react";
import { useCities } from "@hooks/useLocations";

interface CitySelectorProps {
  selectedState: string;
  selectedCity: string;
  onCityChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isOpenPopover: boolean;
  setIsOpenPopover: (open: boolean) => void;
}

export function CitySelector({
  selectedState,
  selectedCity,
  onCityChange,
  isOpenPopover,
  setIsOpenPopover,
}: CitySelectorProps) {
  const { cities, isLoading } = useCities(selectedState);

  return (
    <Popover
      placement="right"
      isOpen={isOpenPopover && !selectedState}
      onOpenChange={(open) => setIsOpenPopover(open)}
    >
      <PopoverTrigger>
        <Select
          isRequired
          label="Select City"
          placeholder="Select your city"
          className="max-w-xs"
          variant="bordered"
          value={selectedCity}
          onChange={onCityChange}
          disabled={isLoading || !selectedState}
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
          {cities.map((city) => (
            <SelectItem key={city.id} value={city.id}>
              {city.name}
            </SelectItem>
          ))}
        </Select>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">
          <div className="text-small font-bold">
            Please select a state first
          </div>
          <div className="text-tiny">
            You must select a state before selecting a city.
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
