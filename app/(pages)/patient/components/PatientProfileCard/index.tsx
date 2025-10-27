"use client";

import { Avatar, Card, Button } from "@nextui-org/react";
import { MdBloodtype, MdOutlineFileDownload } from "react-icons/md";
import { HiOutlinePhone, HiOutlineMail } from "react-icons/hi";
import { useQRCode } from "next-qrcode";
import domtoimage from "dom-to-image";

interface PatientProfileCardProps {
  patient: {
    firstname: string;
    lastname: string;
    email: string;
    contact: string;
    countryCode?: string;
    bloodType?: string;
    profile: string;
    age?: number;
    physicalDetails?: {
      blood: string;
      age: number;
    };
  };
  patientId: string;
}

export default function PatientProfileCard({ patient, patientId }: PatientProfileCardProps) {
  const { SVG } = useQRCode();

  const handleDownloadCard = () => {
    // Hide the download button temporarily
    const downloadBtn = document.querySelector('[data-download-btn]') as HTMLElement;
    if (downloadBtn) downloadBtn.style.display = 'none';
    
    const cardElement = document.querySelector('[data-card="patient-profile"]') as HTMLElement;
    
    if (cardElement) {
      domtoimage
        .toPng(cardElement, {
          quality: 1,
          bgcolor: '#ffffff',
          width: cardElement.offsetWidth * 2,
          height: cardElement.offsetHeight * 2,
          style: {
            transform: 'scale(2)',
            transformOrigin: 'top left'
          }
        })
        .then((dataUrl: string) => {
          const a = document.createElement("a");
          a.href = dataUrl;
          a.download = `${patient.firstname}-${patient.lastname}-patient-card.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          // Show the download button again
          if (downloadBtn) downloadBtn.style.display = 'flex';
        })
        .catch((error: any) => {
          console.error("Error downloading card:", error);
          // Show the download button again on error
          if (downloadBtn) downloadBtn.style.display = 'flex';
        });
    }
  };

  return (
    <Card 
      className="bg-white shadow-lg border-0 h-[400px] flex flex-col"
      data-card="patient-profile"
    >
      <div className="flex-1 p-4">
        {/* Main Content - Left Right Layout */}
        <div className="flex gap-6 h-full">
          {/* Left Side - Patient Info */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-start gap-4 mb-4">
              <div className="relative">
                <Avatar
                  src={patient.profile}
                  className="w-16 h-16 ring-2 ring-blue-200 shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  {patient.firstname} {patient.lastname}
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="p-1 bg-emerald-100 rounded-full">
                      <HiOutlinePhone className="text-emerald-600 text-sm" />
                    </div>
                    <span>{patient.countryCode || '+1'} {patient.contact}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="p-1 bg-violet-100 rounded-full">
                      <HiOutlineMail className="text-violet-600 text-sm" />
                    </div>
                    <span className="truncate">{patient.email}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Patient Details */}
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Patient ID</span>
                <span className="font-mono text-xs text-gray-600">#{patientId?.slice(-6) || '123456'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Age</span>
                <span className="font-semibold text-gray-800">{patient.physicalDetails?.age || patient.age || '25'} years</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Blood Type</span>
                <div className="flex items-center gap-1">
                  <MdBloodtype className="text-red-600" />
                  <span className="font-semibold text-gray-800">{patient.physicalDetails?.blood || patient.bloodType || 'O+'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - QR Code */}
          <div className="flex flex-col items-center justify-center">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4 shadow-sm">
              <div className="bg-white rounded-lg p-3 shadow-sm relative">
                <SVG
                  text={`patient-${patientId}`}
                  options={{
                    margin: 1,
                    width: 120,
                    color: {
                      dark: "#000000",
                      light: "#ffffff",
                    },
                  }}
                />
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center font-medium">Scan at hospital reception<br/>for instant check-in</p>
          </div>
        </div>
      </div>
      
      {/* System Info */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
          <img src="/icons/patient.svg" alt="Syncure" className="w-4 h-4" />
          <span>Powered by Syncure Healthcare Platform</span>
        </div>
      </div>
      
      {/* Download Button */}
      <div className="p-3 border-t border-gray-100">
        <Button
          onClick={handleDownloadCard}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg"
          startContent={<MdOutlineFileDownload size={16} />}
          size="sm"
          data-download-btn
        >
          Patient Card
        </Button>
      </div>
    </Card>
  );
}