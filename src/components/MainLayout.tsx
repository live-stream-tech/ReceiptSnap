"use client";

import { Navigation } from "./Navigation";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Subtle background orb effects */}
      <div
        className="bg-orb w-96 h-96 bg-sky-300"
        style={{ top: "-80px", right: "10%", animationDelay: "0s" }}
      />
      <div
        className="bg-orb w-80 h-80 bg-teal-300"
        style={{ bottom: "10%", left: "20%", animationDelay: "2s" }}
      />
      <div
        className="bg-orb w-64 h-64 bg-emerald-200"
        style={{ top: "40%", right: "5%", animationDelay: "4s" }}
      />

      <Navigation />

      {/* Main content */}
      <main className="md:ml-64 pt-16 md:pt-0 pb-24 md:pb-8 relative z-10">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
