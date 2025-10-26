"use client";

import Link from "next/link";
import { Button, User } from "@nextui-org/react";
import { CiLogin } from "react-icons/ci";
import Notifications from "../Notifications";
import { useRouter } from "next/navigation";

type HeadbarProps = {
  user: User;
  role: string;
};

const USERS_WITH_ADD_BUTTON = ["patient", "receptionist"];

export default function Headbar({ user, role }: HeadbarProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    document.cookie = "better-auth.session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Syncure</h1>
            <p className="text-xs text-gray-500 -mt-1 font-medium">Healthcare Platform</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Quick Actions */}
          {USERS_WITH_ADD_BUTTON.includes(role) && (
            <Button
              as={Link}
              href={`/${role}/appointments`}
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              startContent={<span className="text-lg">+</span>}
            >
              Book Appointment
            </Button>
          )}
          
          {/* Notifications */}
          <div className="relative">
            <Notifications userId={user._id} />
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <User
              name={user.firstname}
              avatarProps={{
                src: user.profile,
                size: "sm",
                className: "ring-2 ring-gray-200 shadow-sm"
              }}
              description={
                <Link
                  href={`/${role}/settings`}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >{`@${user.username}`}</Link>
              }
              classNames={{
                name: "text-sm font-medium text-gray-900",
                description: "text-xs"
              }}
            />
            
            {/* Sign Out */}
            <Button 
              size="sm" 
              isIconOnly 
              variant="ghost"
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={handleSignOut}
            >
              <CiLogin size={20} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
