"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/lib/auth";
import ManagerSidebar from "@/components/manager/sidebar";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Verify user is PM on mount
  useEffect(() => {
    const userRole = getUserRole();
    if (userRole !== "pm") {
      // Redirect non-PM users
      router.push("/auth/login");
    }
  }, [router]);

  return (
    <div className="flex h-screen bg-background">
      {/* PM Sidebar Navigation */}
      <ManagerSidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
