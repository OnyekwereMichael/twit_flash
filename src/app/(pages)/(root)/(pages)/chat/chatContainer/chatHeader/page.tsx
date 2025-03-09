"use client";

import cloudinaryLoader from "@/app/lib/cloudinary";
import Image from "next/image";
import { IoArrowBack } from "react-icons/io5";
import Profile from "../../../../../../../../public/assets/profilepic.svg";
import { useOnlineUsers } from "@/app/lib/query";
import { useRouter } from "next/navigation";

interface User {
  username: string;
  profileImg: string;
  _id: string;
}

interface ChatHeaderProps {
  user?: User | null;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ user }) => {
  const router = useRouter();
  const { data: OnlineUsers } = useOnlineUsers();

  return (
    <div className="p-3 max-sm:bg-purple-600 border-b border-gray-700 bg-dark-3 flex items-center justify-between max-sm:w-full ">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Image
            loader={cloudinaryLoader}
            src={user?.profileImg || Profile}
            alt={user?.username || "User"}
            width={50}
            height={50}
            className="rounded-full w-12 h-12 border border-gray-600 shadow-sm"
          />
          {/* Online Indicator */}
          {user?._id && OnlineUsers?.includes(user._id) ? (
            <span className="absolute bottom-1 right-[1px] w-3 h-3 bg-green-500 border border-gray-900 rounded-full"></span>
          ) : (
            <span className="absolute bottom-1 right-[1px] w-3 h-3 bg-red-500 border border-gray-900 rounded-full"></span>
          )}
        </div>

        {/* User Details */}
        <div>
          <h3 className="text-white font-medium text-lg">{user?.username || "Unknown"}</h3>
          {user?._id && OnlineUsers?.includes(user._id) ? (
            <p className="text-sm text-green-500">Online</p>
          ) : (
            <p className="text-sm text-red-500">Offline</p>
          )}
        </div>
      </div>

      {/* Close Button */}
      <button
        className="text-gray-400 hover:text-white transition-all duration-300 text-2xl"
        onClick={() => router.push("/chat/chatContainer")}
      >
        <IoArrowBack className="max-sm:text-white" />
      </button>
    </div>
  );
};

export default ChatHeader;
