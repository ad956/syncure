"use client";

import { Card, Checkbox, Chip, Button } from "@nextui-org/react";
import { useState } from "react";
import { FaPills, FaClock, FaCheck } from "react-icons/fa";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions?: string;
  nextDose?: string;
  wasTaken?: boolean;
}

interface MedicationTrackerProps {
  medications: Medication[];
}

export default function MedicationTracker({ medications }: MedicationTrackerProps) {
  const [medicationStatus, setMedicationStatus] = useState<Record<string, boolean>>({});

  const handleMedicationTaken = async (medicationId: string, taken: boolean) => {
    try {
      const response = await fetch('/api/patient/medications/take', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicationId, wasTaken: taken })
      });
      
      if (response.ok) {
        setMedicationStatus(prev => ({
          ...prev,
          [medicationId]: taken
        }));
      }
    } catch (error) {
      console.error('Error updating medication status:', error);
    }
  };

  const todaysMedications = medications.slice(0, 5);
  const completedCount = Object.values(medicationStatus).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {medications.length > 0 && (
          <Chip size="sm" color="success" variant="flat" className="bg-green-50 text-green-700">
            {completedCount}/{medications.length} completed
          </Chip>
        )}
      </div>

      <div 
        className={`space-y-2 ${
          todaysMedications.length > 4 ? 'h-[240px] overflow-y-auto bills-scroll' : 'h-auto'
        }`}
      >
        {todaysMedications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-3 bg-green-50 rounded-full mb-3">
              <FaCheck className="text-green-500 text-xl" />
            </div>
            <h3 className="text-base font-semibold text-gray-700 mb-1">
              All Clear!
            </h3>
            <p className="text-xs text-gray-500">
              No medications scheduled
            </p>
          </div>
        ) : (
          todaysMedications.map((medication) => {
            const isTaken = medicationStatus[medication.id] || false;
            
            return (
              <div key={medication.id} className={`p-2.5 rounded-lg border transition-all ${
                isTaken ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-blue-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 flex-1">
                    <div className={`p-1.5 rounded-lg ${
                      isTaken ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      <FaPills className={`text-xs ${
                        isTaken ? 'text-green-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-xs text-gray-900 truncate">{medication.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-gray-600">{medication.dosage}</p>
                        {medication.nextDose && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <FaClock className="text-xs" />
                            <span>{medication.nextDose}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-2">
                    {!isTaken ? (
                      <Button
                        size="sm"
                        className="text-xs px-3 py-1 h-7 min-w-14 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                        onPress={() => handleMedicationTaken(medication.id, true)}
                      >
                        Take
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="text-xs px-3 py-1 h-7 min-w-14 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                        onPress={() => handleMedicationTaken(medication.id, false)}
                      >
                        <FaCheck className="text-xs" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {medications.length > 5 && (
        <Button size="sm" variant="flat" color="primary" className="w-full text-xs h-7">
          View All ({medications.length})
        </Button>
      )}
    </div>
  );
}