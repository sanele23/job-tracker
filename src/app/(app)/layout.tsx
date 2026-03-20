import { Sidebar } from "@/components/layout/sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { OnboardingGate } from "@/components/layout/onboarding-gate";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingGate>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </OnboardingGate>
  );
}
