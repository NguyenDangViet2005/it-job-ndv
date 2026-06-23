"use client";

import ProfileSection from "@/components/sections/qa/left-sidebar/profile.section";
import FriendFollow from "@/components/sections/qa/right-sidebar/friend-follow.section";

export default function LeftSidebar({ connections }: { connections: any[] }) {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Profile Card - Fixed size */}
      <div className="flex-shrink-0">
        <ProfileSection />
      </div>
      
      {/* Connections List - Takes remaining space */}
      <div className="flex-1 min-h-0">
        <FriendFollow connectionList={connections} />
      </div>
    </div>
  );
}
