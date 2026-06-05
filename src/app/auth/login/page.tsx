"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getDashboardPathForRole } from "@/lib/route-protection";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Placeholder for actual auth logic
      if (email && password) {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Demo login - default to member role
        sessionStorage.setItem("userEmail", email);
        const role = "member" as const;
        sessionStorage.setItem("userRole", role);

        // Redirect to role-specific dashboard
        const dashboardPath = getDashboardPathForRole(role);
        router.push(dashboardPath);
      } else {
        setError("Please fill in all fields");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: "admin" | "pm" | "member") => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    sessionStorage.setItem("userEmail", `${role}@example.com`);
    sessionStorage.setItem("userRole", role);

    // Redirect to role-specific dashboard
    const dashboardPath = getDashboardPathForRole(role);
    router.push(dashboardPath);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card flex items-center justify-center px-4 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">TaskForge</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-lg border border-border p-6 space-y-4 mb-6"
        >
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded text-destructive text-sm">
              {error}
            </div>
          )}

          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />

          <Button
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
            className="w-full"
          >
            Sign In
          </Button>
        </form>

        {/* Demo Logins */}
        <div className="space-y-2 mb-6">
          <p className="text-sm text-muted-foreground text-center mb-3">
            Or try a demo account:
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleDemoLogin("admin")}
            disabled={isLoading}
            className="w-full"
          >
            Admin Demo
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleDemoLogin("pm")}
            disabled={isLoading}
            className="w-full"
          >
            PM Demo
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleDemoLogin("member")}
            disabled={isLoading}
            className="w-full"
          >
            Member Demo
          </Button>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
