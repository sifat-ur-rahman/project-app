"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, BarChart3, Zap, ArrowRight } from "lucide-react";

export default function Page() {
  const router = useRouter();

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Collaboration",
      description:
        "Work together seamlessly with real-time task updates and team communication.",
      accent: "from-amber-500/20 to-orange-500/5",
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/10",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Advanced Analytics",
      description:
        "Get insights into project progress, team productivity, and completion metrics.",
      accent: "from-sky-500/20 to-blue-500/5",
      iconColor: "text-sky-500",
      iconBg: "bg-sky-500/10",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Role-Based Access",
      description:
        "Admin, Project Manager, and Team Member roles with granular permissions.",
      accent: "from-violet-500/20 to-purple-500/5",
      iconColor: "text-violet-500",
      iconBg: "bg-violet-500/10",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Task Management",
      description:
        "Organize, assign, and track tasks with priorities, deadlines, and status updates.",
      accent: "from-emerald-500/20 to-green-500/5",
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-500/10",
    },
  ];

  const handleGetStarted = () => {
    const userRole = sessionStorage.getItem("userRole");
    if (userRole == "admin") {
      router.push("/admin/dashboard");
    } else if (userRole == "pm") {
      router.push("/manager/dashboard");
    } else if (userRole == "member") {
      router.push("/member/dashboard");
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="nav-blur sticky top-0 z-50 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-xl font-display tracking-tight">
              TaskForge
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => router.push("/auth/login")}
              className="text-muted-foreground hover:text-foreground"
            >
              Login
            </Button>
            <Button
              onClick={handleGetStarted}
              className="btn-primary-glow text-white rounded-xl gap-2 font-medium transition-all duration-300"
            >
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mesh-bg relative border-b border-border/50 py-14 sm:py-20 overflow-hidden">
        {/* Decorative orbs */}

        <div className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-primary/4 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-[1.5px] w-full overflow-hidden">
          <div className="animate-border-slide  h-full w-1/3 bg-linear-to-r from-transparent via-blue-500 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h1 className="animate-fade-up-1 font-display text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05]">
            <span className="text-primary">Forge Your</span>
            <br />
            <span className="text-foreground">Project Success</span>
          </h1>

          <p className="animate-fade-up-2 text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            The modern all-in-one platform with real-time collaboration,
            advanced analytics, and role-based access. Built for teams who ship.
          </p>

          <div className="animate-fade-up-3 flex flex-col sm:flex-row gap-3 justify-center mb-20">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="btn-primary-glow text-white rounded-xl gap-2 font-semibold px-8 transition-all duration-300 h-12"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-xl font-medium h-12 border-border/80 hover:bg-muted/70"
              onClick={() => {
                const featuresSection = document.getElementById("features");
                featuresSection?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore Features
            </Button>
          </div>
        </div>
      </section>

      <div className="divider-gradient" />

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              Everything You Need
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-5 tracking-tight">
              Powerful Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto font-light">
              Everything you need to manage projects efficiently and keep your
              team organized
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`card-hover p-8 border border-border rounded-2xl bg-gradient-to-br ${feature.accent} relative overflow-hidden group`}
              >
                <div className="absolute inset-0 bg-background/60 rounded-2xl" />
                <div className="relative z-10">
                  <div
                    className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-5 ${feature.iconColor}`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Key Capabilities */}
          <div className="mt-10 rounded-2xl p-8 border border-border bg-muted/30">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-5 w-1 rounded-full bg-primary" />
              <h3 className="font-display text-2xl font-bold tracking-tight">
                Key Capabilities
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "Projects",
                  desc: "Create, track, and manage projects with budgets and timelines",
                },
                {
                  title: "Tasks",
                  desc: "Assign tasks, set priorities, and track progress in real-time",
                },
                {
                  title: "Team",
                  desc: "Manage team members and set role-based permissions",
                },
                {
                  title: "Analytics",
                  desc: "Get insights with charts, trends, and performance metrics",
                },
              ].map((item) => (
                <div key={item.title} className="capability-item">
                  <h4 className="font-semibold mb-2 flex items-center">
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="divider-gradient" />

      {/* Footer */}
      <footer className="py-12 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Developer Section */}
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
              Developed By
            </p>
            <div className="rounded-2xl p-6 border border-border bg-background hover:border-primary/30 transition-colors duration-300 group">
              <div className="flex items-start gap-5">
                <div className="avatar-ring flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center">
                    <span className="font-display text-base font-bold text-white">
                      SR
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-display text-lg  font-bold mb-2 tracking-tight">
                    Sifat Ur Rahman
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed max-w-2xl">
                    Full-stack developer building modern, scalable web
                    applications with Next.js, React, TypeScript, and MongoDB.
                    Passionate about creating intuitive user experiences, robust
                    backend systems, and innovative solutions for complex
                    problems.
                  </p>
                  <a
                    href="http://sifat-ur-rahman.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-white gap-2 px-4 py-2 bg-primary  rounded-xl hover:bg-primary/90 transition-all duration-200 font-medium text-sm btn-primary-glow"
                  >
                    View Portfolio
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="divider-gradient mb-6" />

          {/* Copyright */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} TaskForge. Built by Sifat Ur Rahman.
              All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
