"use client";

import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import AnimatedBackground from "@components/AnimatedBackground";
import AccessDenied from "@admin/components/AccessDenied";
import LoginForm from "@admin/components/LoginForm";
import PinVerification from "@admin/components/PinVerification";

export default function AdminLoginPage() {
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkDeviceType = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = [
        "android",
        "webos",
        "iphone",
        "ipad",
        "ipod",
        "blackberry",
        "windows phone",
      ];
      const isMobile = mobileKeywords.some((keyword) =>
        userAgent.includes(keyword)
      );
      setIsDesktop(!isMobile);
    };

    checkDeviceType();
    window.addEventListener("resize", checkDeviceType);

    return () => {
      window.removeEventListener("resize", checkDeviceType);
    };
  }, []);

  if (!isDesktop) {
    return (
      <AnimatedBackground>
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <AccessDenied />
        </div>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground>
      <div className="flex justify-center items-center min-h-screen w-full">
        {!isPinVerified ? (
          <PinVerification onVerified={() => setIsPinVerified(true)} />
        ) : (
          <LoginForm />
        )}
      </div>
      <Toaster />
    </AnimatedBackground>
  );
}
