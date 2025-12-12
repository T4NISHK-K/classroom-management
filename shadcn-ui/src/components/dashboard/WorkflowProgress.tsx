import { Clock, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  status: "pending" | "active" | "completed";
  tab: string;
}

interface WorkflowProgressProps {
  steps: WorkflowStep[];
  onStepClick: (tab: string) => void;
}

export function WorkflowProgress({ steps, onStepClick }: WorkflowProgressProps) {
  const completedCount = steps.filter(s => s.status === "completed").length;
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const progressPercentage = (completedCount / steps.length) * 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progressPercentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  return (
    <div className="bento-card relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent rounded-full blur-3xl -z-0" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl blur-xl opacity-30 animate-pulse-glow" />
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
              <Clock className="w-5 h-5 text-primary-foreground relative z-10" strokeWidth={1.5} />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground tracking-tight flex items-center gap-2">
              Workflow Progress
              <Sparkles className="w-4 h-4 text-primary animate-sparkle" />
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Complete each step to generate your optimized timetable
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="workflow-step group relative"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="absolute left-5 top-12 w-px h-8 bg-gradient-to-b from-border via-border/50 to-transparent opacity-50" />
              )}
              
              <div className="relative flex items-center gap-4">
                <div
                  className={`step-number relative ${
                    step.status === "completed"
                      ? "step-completed"
                      : step.status === "active"
                      ? "step-active"
                      : "step-pending"
                  }`}
                >
                  {step.status === "completed" ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-teal to-teal/80 rounded-xl blur-md opacity-50 animate-pulse" />
                      <CheckCircle2 className="w-5 h-5 relative z-10 animate-check-in" strokeWidth={1.5} />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold relative z-10">{step.id}</span>
                      {step.status === "active" && (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl blur-md opacity-30 animate-pulse" />
                      )}
                    </>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors duration-300 flex items-center gap-2">
                    {step.title}
                    {step.status === "completed" && (
                      <Sparkles className="w-3.5 h-3.5 text-teal animate-sparkle" />
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{step.description}</p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onStepClick(step.tab)}
                  className="shrink-0 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300 gap-2 opacity-0 group-hover:opacity-100 hover:scale-105 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="text-xs font-medium relative z-10">{step.status === "completed" ? "Review" : "Begin"}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Progress indicator */}
        <div className="mt-8 pt-6 border-t border-border/50 relative">
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-muted-foreground font-medium">Overall Progress</span>
            <span className="text-foreground font-semibold tabular-nums">{Math.round(animatedProgress)}%</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 animate-shimmer" />
            <div 
              className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full transition-all duration-1000 relative overflow-hidden"
              style={{ width: `${animatedProgress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-line" />
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 blur-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

