import { Button } from "@/components/ui/button";
import { Trash2, Layers, Sparkles, LogOut, User } from "lucide-react";
import { useAuthStore } from '@/lib/auth-store';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface DashboardHeaderProps {
  onClearData?: () => void;
}

export function DashboardHeader({ onClearData }: DashboardHeaderProps) {
  const auth = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.auth.logout();
      auth.clearAuth();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      auth.clearAuth();
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10 animate-fade-in">
      <div className="space-y-2">
        <div className="flex items-center gap-4 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse-glow" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 animate-float">
              <Layers className="w-7 h-7 text-primary-foreground relative z-10" strokeWidth={1.5} />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
            </div>
          </div>
          <div className="relative">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight relative">
              <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                SmartClass
              </span>
              <Sparkles className="absolute -top-1 -right-8 w-5 h-5 text-primary animate-sparkle opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5 flex items-center gap-2">
              <span className="relative">
                Academic timetable management system
                <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {auth.authenticated && (
          <div className="relative group">
            {/* Glassmorphism User Info Card */}
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl backdrop-blur-xl bg-card/60 border border-border/50 shadow-md shadow-primary/5 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:scale-105 hover:border-primary/30">
              {/* Background glow */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* User Icon */}
              <div className="relative z-10 w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shadow-sm">
                <User className="w-4 h-4 text-primary" />
              </div>
              
              {/* User Info */}
              <div className="relative z-10 flex items-center gap-2">
                <span className="font-semibold text-sm text-foreground">{auth.username}</span>
                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                  {auth.role}
                </span>
              </div>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
            </div>
          </div>
        )}
        
        {/* Enhanced Logout Button */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleLogout}
          className="relative gap-2 px-4 h-9 backdrop-blur-xl bg-background/60 border-border/60 hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-destructive/20 group overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-destructive/0 via-destructive/10 to-destructive/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Icon */}
          <LogOut className="w-4 h-4 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
          
          {/* Text */}
          <span className="relative z-10 font-medium">Logout</span>
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        </Button>
        {onClearData && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onClearData}
            className="gap-2.5 text-muted-foreground border-border hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5 transition-all duration-300 hover:scale-105 hover:shadow-md group/btn relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-destructive/0 via-destructive/5 to-destructive/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
            <Trash2 className="w-4 h-4 relative z-10 group-hover/btn:rotate-12 transition-transform duration-300" strokeWidth={1.5} />
            <span className="text-sm font-medium relative z-10">Clear Data</span>
          </Button>
        )}
      </div>
    </div>
  );
}

