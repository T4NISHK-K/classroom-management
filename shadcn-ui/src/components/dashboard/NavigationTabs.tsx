import { 
  LayoutDashboard, 
  Settings2, 
  Database, 
  Sliders, 
  Sparkles, 
  BarChart3,
  Building2,
  GraduationCap,
  Building
} from "lucide-react";
import { useAuthStore } from '@/lib/auth-store';

interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

const allTabs: Tab[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "departments", label: "Departments", icon: Building2, adminOnly: true },
  { id: "semesters", label: "Semesters", icon: GraduationCap, adminOnly: true },
  { id: "classrooms", label: "Classrooms", icon: Building, adminOnly: true },
  { id: "setup", label: "Setup", icon: Settings2 },
  { id: "data", label: "Data", icon: Database },
  { id: "constraints", label: "Constraints", icon: Sliders },
  { id: "optimizer", label: "Optimize", icon: Sparkles },
  { id: "viewer", label: "Results", icon: BarChart3 },
];

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  const auth = useAuthStore();
  const tabs = allTabs.filter(tab => !tab.adminOnly || auth.role === 'admin');
  
  return (
    <div className="mb-10 flex justify-center">
      <div className="inline-flex flex-wrap gap-1.5 p-1.5 bg-card rounded-2xl border border-border/60 shadow-sm backdrop-blur-sm relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />
        
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-300 overflow-hidden
                ${isActive 
                  ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md shadow-primary/20 scale-105" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:scale-105"
                }
              `}
              style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
            >
              {/* Active indicator glow */}
              {isActive && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 animate-pulse" />
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                </>
              )}
              
              {/* Hover shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
              
              <Icon 
                className={`w-4 h-4 relative z-10 transition-all duration-300 ${isActive ? 'scale-110' : 'opacity-70 hover:opacity-100 hover:scale-110'}`} 
                strokeWidth={1.75} 
              />
              <span className="hidden sm:inline relative z-10">{tab.label}</span>
              
              {/* Active dot indicator */}
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-foreground animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

