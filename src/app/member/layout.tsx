"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/lib/auth";
import MemberSidebar from "@/components/member/sidebar";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Verify user is member on mount
  useEffect(() => {
    const userRole = getUserRole();
    if (userRole !== "member") {
      // Redirect non-member users
      router.push("/auth/login");
    }
  }, [router]);

  return (
    <div className="flex h-screen bg-background">
      {/* Member Sidebar Navigation */}
      <MemberSidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
