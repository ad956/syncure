import { Divider, User, Button } from "@nextui-org/react";
import Link from "next/link";
import Notifications from "@components/Notifications";
import { signOut } from "@lib/auth/client";
import { CiLogin } from "react-icons/ci";

interface HeaderProps {
  admin: Admin;
}

export default function Header({ admin }: HeaderProps) {
  return (
    <div className="bg-white p-4 flex flex-row justify-between items-center shadow-sm">
      <div className="flex gap-3 items-center">
        <div className="flex items-center justify-between bg-warning-100 rounded-full px-4 py-2 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <span
              className="text-2xl mr-2 animate-[wave_2.5s_infinite]"
              role="img"
              aria-label="wave"
            >
              👋
            </span>
            <p className="text-lg font-semibold text-gray-800 tracking-wider">
              Welcome,{" "}
              <span className="ml-1 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text font-bold">
                {admin.firstname}
              </span>
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text animate-pulse">
                !
              </span>
            </p>
          </div>
          <div className="ml-4 text-sm text-gray-600 hidden sm:block">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Notifications userId={"user._id"} />
        <Divider orientation="vertical" className="h-8 bg-gray-300" />

        <User
          name={`${admin.firstname} ${admin.lastname}`}
          avatarProps={{
            src: `${admin.profile}`,
            className: "border-2 border-gray-200",
          }}
          description={
            <Link
              href={`/admin/settings`}
              className="text-xs text-blue-600 hover:underline"
            >
              @{admin.username}
            </Link>
          }
        />
        <Divider orientation="vertical" className="h-8 bg-gray-300" />

        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button size="sm" type="submit" isIconOnly className="bg-transparent">
            <CiLogin size={25} />
          </Button>
        </form>
      </div>
    </div>
  );
}
