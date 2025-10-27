"use client";

import { Card, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { FaHeartbeat, FaWeight, FaThermometerHalf, FaTint, FaPlus } from "react-icons/fa";
import { MdMonitorHeart } from "react-icons/md";
import { toast } from "react-hot-toast";

interface VitalSign {
  _id: string;
  weight?: number;
  systolic_bp?: number;
  diastolic_bp?: number;
  heart_rate?: number;
  temperature?: number;
  blood_sugar?: number;
  recorded_at: string;
}

interface VitalSignsProps {
  vitalSigns: VitalSign[];
}

export default function VitalSigns({ vitalSigns }: VitalSignsProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    weight: "",
    systolicBP: "",
    diastolicBP: "",
    heartRate: "",
    temperature: "",
    bloodSugar: "",
  });

  const latestVitals = vitalSigns[0] || {};

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/patient/vital-signs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weight: formData.weight,
          systolicBP: formData.systolicBP,
          diastolicBP: formData.diastolicBP,
          heartRate: formData.heartRate,
          temperature: formData.temperature,
          bloodSugar: formData.bloodSugar,
        }),
      });

      if (response.ok) {
        toast.success("Vital signs recorded successfully!");
        setFormData({
          weight: "",
          systolicBP: "",
          diastolicBP: "",
          heartRate: "",
          temperature: "",
          bloodSugar: "",
        });
        onClose();
        window.location.reload(); // Refresh to show new data
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to record vital signs");
      }
    } catch (error) {
      console.error('Error recording vital signs:', error);
      toast.error("An error occurred while recording vital signs");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MdMonitorHeart className="text-red-600 text-xl" />
          <h3 className="text-lg font-semibold text-gray-800">Today&apos;s Vitals</h3>
        </div>
        <Button 
          onPress={onOpen}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          startContent={<FaPlus className="text-sm" />}
          size="sm"
        >
          Record Vitals
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaWeight className="text-blue-600 text-lg" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Weight</p>
              <p className="text-lg font-bold text-gray-800">{latestVitals.weight || "--"} <span className="text-sm font-normal">kg</span></p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <FaHeartbeat className="text-red-600 text-lg" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Blood Pressure</p>
              <p className="text-lg font-bold text-gray-800">
                {latestVitals.systolic_bp && latestVitals.diastolic_bp 
                  ? `${latestVitals.systolic_bp}/${latestVitals.diastolic_bp}` 
                  : "--/--"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <FaHeartbeat className="text-pink-600 text-lg" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Heart Rate</p>
              <p className="text-lg font-bold text-gray-800">{latestVitals.heart_rate || "--"} <span className="text-sm font-normal">bpm</span></p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FaTint className="text-orange-600 text-lg" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Blood Sugar</p>
              <p className="text-lg font-bold text-gray-800">{latestVitals.blood_sugar || "--"} <span className="text-sm font-normal">mg/dL</span></p>
            </div>
          </div>
        </Card>
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader className="flex items-center gap-2">
            <MdMonitorHeart className="text-red-600 text-xl" />
            Record Vital Signs
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Weight (kg)"
                type="number"
                placeholder="Enter weight"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
                startContent={<FaWeight className="text-blue-600" />}
              />
              <Input
                label="Heart Rate (bpm)"
                type="number"
                placeholder="Enter heart rate"
                value={formData.heartRate}
                onChange={(e) => setFormData({...formData, heartRate: e.target.value})}
                startContent={<FaHeartbeat className="text-pink-600" />}
              />
              <Input
                label="Systolic BP (mmHg)"
                type="number"
                placeholder="Enter systolic BP"
                value={formData.systolicBP}
                onChange={(e) => setFormData({...formData, systolicBP: e.target.value})}
                startContent={<FaHeartbeat className="text-red-600" />}
              />
              <Input
                label="Diastolic BP (mmHg)"
                type="number"
                placeholder="Enter diastolic BP"
                value={formData.diastolicBP}
                onChange={(e) => setFormData({...formData, diastolicBP: e.target.value})}
                startContent={<FaHeartbeat className="text-red-600" />}
              />
              <Input
                label="Temperature (°C)"
                type="number"
                step="0.1"
                placeholder="Enter temperature"
                value={formData.temperature}
                onChange={(e) => setFormData({...formData, temperature: e.target.value})}
                startContent={<FaThermometerHalf className="text-orange-600" />}
              />
              <Input
                label="Blood Sugar (mg/dL)"
                type="number"
                placeholder="Enter blood sugar"
                value={formData.bloodSugar}
                onChange={(e) => setFormData({...formData, bloodSugar: e.target.value})}
                startContent={<FaTint className="text-orange-600" />}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
              onPress={handleSubmit}
              isLoading={isLoading}
            >
              Save Vitals
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}