"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChatHeader from "./chatHeader/page";
import MessageInput from "./messageInput/page";
import MessageContainer from "./messageContainer/page";
import Loader from "../../../(component)/loader/page";

interface User {
  username: string;
  profileImg: string;
  _id: string;
}

const ChatContainer = () => {
  return (
    <Suspense fallback={<div><Loader /></div>}>
      <ChatContent />
    </Suspense>
  );
};

const ChatContent = () => {
  const searchParams = useSearchParams();
  const userParam = searchParams.get("user");

  let user: User | null = null;
  try {
    user = userParam ? (JSON.parse(decodeURIComponent(userParam)) as User) : null;
  } catch (error) {
    console.error("Invalid user data:", error);
  }

  return (
    <div className="post-car w-[52vw] max-sm:w-full max-h-[630px] overflow-y-auto">
      <style jsx>{`
        .post-car::-webkit-scrollbar {
          display: none;
        }
        .post-car {
          -ms-overflow-style: none; /* Internet Explorer 10+ */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>

      <ChatHeader user={user} />
      <MessageContainer user={user} />
      <MessageInput user={user} />
    </div>
  );
};

export default ChatContainer;
