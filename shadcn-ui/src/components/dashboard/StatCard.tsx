import { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  variant: "blue" | "violet" | "coral" | "teal";
  className?: string;
}

const variantStyles = {
  blue: {
    icon: "stat-icon-blue",
    gradient: "from-blue to-blue/80",
    glow: "shadow-blue/20",
  },
  violet: {
    icon: "stat-icon-violet", 
    gradient: "from-violet to-violet/80",
    glow: "shadow-violet/20",
  },
  coral: {
    icon: "stat-icon-coral",
    gradient: "from-coral to-coral/80",
    glow: "shadow-coral/20",
  },
  teal: {
    icon: "stat-icon-teal",
    gradient: "from-teal to-teal/80",
    glow: "shadow-teal/20",
  },
};

export function StatCard({ title, value, icon: Icon, variant, className = "" }: StatCardProps) {
  const styles = variantStyles[variant];
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    const element = document.querySelector(`[data-stat-card="${title}"]`);
    if (element) observer.observe(element);
    
    return () => observer.disconnect();
  }, [title, isVisible]);

  useEffect(() => {
    if (typeof value === "number" && isVisible) {
      const duration = 1500;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, isVisible]);
  
  return (
    <div 
      data-stat-card={title}
      className={`bento-card group cursor-default overflow-hidden relative ${className} hover:scale-[1.02] transition-all duration-500`}
    >
      {/* Animated gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-[0.02] group-hover:opacity-[0.08] transition-opacity duration-700`} />
      
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Glow effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-br ${styles.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10`} />
      
      <div className="relative flex items-start justify-between z-10">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70 group-hover:text-muted-foreground transition-colors duration-300">
            {title}
          </p>
          <p className="text-4xl font-bold tracking-tight text-foreground tabular-nums">
            {typeof value === "number" ? displayValue : value}
          </p>
        </div>
        <div className={`stat-icon ${styles.icon} group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl transition-all duration-500 relative`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500`} />
          <Icon className="w-6 h-6 relative z-10" strokeWidth={1.5} />
        </div>
      </div>
      
      {/* Animated bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${styles.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer-line" />
      </div>
      
      {/* Corner accent */}
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${styles.gradient} opacity-0 group-hover:opacity-5 rounded-bl-full transition-opacity duration-500`} />
    </div>
  );
}


