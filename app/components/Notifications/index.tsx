"use client";

import { useEffect, useState } from "react";
import {
  NovuProvider,
  PopoverNotificationCenter,
} from "@novu/notification-center";
import { IoNotificationsOutline } from "react-icons/io5";

export default function Notifications({ userId }: { userId: string }) {
  return (
    <NovuProvider
      subscriberId={userId}
      applicationIdentifier={process.env.NEXT_PUBLIC_NOVU_APP_IDENTIFIER || ""}
    >
      <PopoverNotificationCenter colorScheme="light">
        {({ unseenCount }) => <CustomBellIcon unseenCount={unseenCount} />}
      </PopoverNotificationCenter>
    </NovuProvider>
  );
}

const CustomBellIcon = ({
  unseenCount = 0,
}: {
  unseenCount: number | undefined;
}) => {
  const [prevCount, setPrevCount] = useState(unseenCount);
  const [isRinging, setIsRinging] = useState(false);

  useEffect(() => {
    if (unseenCount > prevCount) {
      const audio = new Audio("/sounds/bell.mp3");
      audio.play().catch(() => {});
      
      setIsRinging(true);
      setTimeout(() => setIsRinging(false), 800);
    }
    setPrevCount(unseenCount);
  }, [unseenCount, prevCount]);

  return (
    <div className="relative">
      <div className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
        <IoNotificationsOutline 
          size={22} 
          className={`text-gray-600 hover:text-gray-800 transition-transform duration-100 ${
            isRinging ? 'animate-wiggle' : ''
          }`}
        />
      </div>
      
      <style jsx global>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          10%, 30%, 50%, 70%, 90% { transform: rotate(-10deg); }
          20%, 40%, 60%, 80% { transform: rotate(10deg); }
        }
        .animate-wiggle {
          animation: wiggle 0.8s ease-in-out;
        }
      `}</style>
    </div>
  );
};