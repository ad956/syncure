import { Image } from "@nextui-org/react";
import React from "react";

type MedicineDetailsProp = {
  details: [
    {
      name: string;
      dosage: string;
      frequency: string;
    }
  ];
};

export default function MedicineDetails({ details }: MedicineDetailsProp) {
  if (details.length < 1) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="flex items-center">
          <Image
            src="/images/medicines.webp"
            alt="medicines-not-available"
            className="h-44"
          />
          <div className="font-semibold text-black/60">
            No medicines prescribed
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-row flex-wrap px-2 ${
        details.length > 4 ? "overflow-y-auto bills-scroll" : ""
      }`}
    >
      {details.map((medicine, index) => (
        <div
          key={index}
          className="flex flex-row gap-2 p-2"
          style={{ width: "50%" }}
        >
          <div className="p-2 rounded-xl">
            <Image
              alt="medicine-icon"
              src={`/icons/${index % 3 === 0 ? "tablets.png" : "tablets2.png"}`}
              className="h-10"
            />
          </div>

          <div className="flex flex-col justify-center">
            <div className="font-medium text-md">{medicine.name}</div>
            <div className="text-tiny">
              {medicine.dosage} {medicine.frequency}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
