import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, BookOpen, Dumbbell, Home, TrendingUp, User } from "lucide-react";
import type { UserProfile } from "../hooks/useProfile";

type Page = "dashboard" | "workouts" | "progress" | "library" | "profile";

interface NavBarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  profile: UserProfile | null;
}

const NAV_ITEMS: { id: Page; label: string; icon: typeof Home }[] = [
  { id: "dashboard", label: "Home", icon: Home },
  { id: "workouts", label: "Workouts", icon: Dumbbell },
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "library", label: "Library", icon: BookOpen },
  { id: "profile", label: "Profile", icon: User },
];

export default function NavBar({
  currentPage,
  onNavigate,
  profile,
}: NavBarProps) {
  const initials = profile?.name?.slice(0, 2).toUpperCase() ?? "FT";

  return (
    <>
      {/* Desktop navbar */}
      <header
        className="hidden md:flex sticky top-0 z-50 h-16 items-center px-6 border-b border-border/50"
        style={{
          background: "oklch(0.13 0.04 240 / 0.95)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-2 min-w-[180px]">
          <div className="w-8 h-8 rounded-lg bg-neon flex items-center justify-center">
            <Dumbbell className="w-4 h-4 text-neon-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight">FitTrainer</span>
        </div>
        <nav className="flex-1 flex items-center justify-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                data-ocid={`nav.${item.id}.link`}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                  active
                    ? "text-neon"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
                {active && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-neon" />
                )}
              </button>
            );
          })}
        </nav>
        <div className="flex items-center gap-3 min-w-[180px] justify-end">
          <button
            type="button"
            data-ocid="nav.notification.button"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Bell className="w-4 h-4" />
          </button>
          <button
            type="button"
            data-ocid="nav.profile.button"
            onClick={() => onNavigate("profile")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-neon text-neon-foreground text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            {profile?.name && (
              <span className="text-sm font-medium">{profile.name}</span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 px-2"
        style={{
          background: "oklch(0.13 0.04 240 / 0.97)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center justify-around h-16">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                data-ocid={`nav.mobile.${item.id}.link`}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  active ? "text-neon" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
