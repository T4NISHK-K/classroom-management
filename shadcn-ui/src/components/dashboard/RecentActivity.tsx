import { Activity, Clock, CheckCircle2, AlertCircle, Info } from "lucide-react";

interface ActivityItem {
  action: string;
  time: string;
  type: "info" | "success" | "warning" | "error";
}

interface RecentActivityProps {
  activities?: ActivityItem[];
}

const defaultActivities: ActivityItem[] = [
  { action: "System initialized", time: "Just now", type: "info" },
  { action: "Ready to configure", time: "Just now", type: "success" },
];

const typeIcons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  error: AlertCircle,
};

const typeColors = {
  info: "from-blue to-blue/80",
  success: "from-teal to-teal/80",
  warning: "from-amber to-amber/80",
  error: "from-destructive to-destructive/80",
};

export function RecentActivity({ activities = defaultActivities }: RecentActivityProps) {
  return (
    <div className="bento-card h-full relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-accent/10 via-primary/5 to-transparent rounded-full blur-3xl -z-0" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-accent/10 rounded-xl blur-md opacity-50" />
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-accent relative z-10" strokeWidth={1.5} />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Latest system events</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = typeIcons[activity.type];
            const gradient = typeColors[activity.type];
            
            return (
              <div 
                key={index} 
                className="flex items-start gap-4 group relative animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative mt-1.5 flex-shrink-0">
                  <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300`} />
                  <div className={`relative w-2.5 h-2.5 rounded-full bg-gradient-to-r ${gradient} shrink-0 animate-dot-pulse flex items-center justify-center`}>
                    <Icon className="w-1.5 h-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  {index < activities.length - 1 && (
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-border via-border/50 to-transparent" />
                  )}
                </div>
                <div className="flex-1 min-w-0 group-hover:translate-x-1 transition-transform duration-300">
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                    {activity.action}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <Clock className="w-3 h-3 opacity-70" strokeWidth={1.5} />
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
          
          {activities.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-12 animate-fade-in">
              <Activity className="w-10 h-10 mx-auto mb-3 opacity-30 animate-pulse" strokeWidth={1.5} />
              <p className="font-medium">No activity yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

