"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { IoClose, IoQrCodeOutline } from "react-icons/io5";
import { FaGithub, FaDownload, FaStar } from "react-icons/fa";
import { useQRCode } from "next-qrcode";
import Image from "next/image";

export default function MobileAppPromo() {
  const [isVisible, setIsVisible] = useState(false);
  const [canClose, setCanClose] = useState(true);

  const githubReleaseUrl = "https://github.com/ad956/syncure/releases";

  useEffect(() => {
    const checkScreenSize = () => {
      const isTabletOrSmaller = window.innerWidth <= 1024;
      setIsVisible(isTabletOrSmaller);
      setCanClose(window.innerWidth >= 768);
      
      if (isTabletOrSmaller) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
      document.body.style.overflow = 'auto';
    };
  }, []);

  const QRCodeComponent = () => {
    const { Canvas } = useQRCode();
    return (
      <Canvas
        text={githubReleaseUrl}
        options={{
          width: 96,
          margin: 1,
          color: {
            dark: '#1f2937',
            light: '#ffffff',
          },
        }}

      />
    );
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-sm transform transition-all duration-300 hover:scale-105 mx-4">
        <Card className="shadow-2xl border-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-white/20 backdrop-blur-md bg-white/90">
          <CardBody className="p-4">
            {canClose && (
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onPress={() => setIsVisible(false)}
              >
                <IoClose className="w-4 h-4" />
              </Button>
            )}

            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto flex items-center justify-center">
                <Image src="/icons/patient.svg" height="64" width="64" alt="Syncure" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Get Our Mobile App!
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Access all patient features on-the-go with better performance and native mobile experience
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 py-2">
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-3 h-3" />
                  ))}
                </div>
                <span className="text-xs text-gray-500">Rated 5/5</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                  <IoQrCodeOutline className="w-4 h-4" />
                  <span>Scan QR to download</span>
                </div>
                
                <div className="flex justify-center">
                  <QRCodeComponent />
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg"
                  startContent={<FaGithub className="w-4 h-4" />}
                  onPress={() => window.open(githubReleaseUrl, "_blank")}
                >
                  View Releases
                </Button>
                
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <FaDownload className="w-3 h-3" />
                  <span>Free download • No ads • Secure</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500 leading-relaxed">
                  ✓ Faster appointments ✓ Push notifications ✓ Better UI/UX ✓ Native performance
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}