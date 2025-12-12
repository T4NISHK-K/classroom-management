import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  Shield, 
  Target, 
  Save, 
  CheckCircle,
  Sparkles,
  TrendingUp,
  Settings,
  Zap,
  BarChart3,
  Lock,
  Gauge
} from 'lucide-react';
import { HardConstraint, SoftConstraint } from '@/types/timetable';

const defaultHardConstraints: HardConstraint[] = [
  { id: 'no-faculty-clash', name: 'No Faculty Double Booking', description: 'Faculty cannot be assigned to multiple classes at the same time', enabled: true },
  { id: 'no-room-clash', name: 'No Room Double Booking', description: 'Room cannot be assigned to multiple classes at the same time', enabled: true },
  { id: 'no-batch-clash', name: 'No Batch Double Booking', description: 'Student batch cannot have multiple classes at the same time', enabled: true },
  { id: 'room-capacity', name: 'Room Capacity Check', description: 'Room capacity must be sufficient for batch size', enabled: true },
  { id: 'faculty-availability', name: 'Faculty Availability', description: 'Faculty must be available during assigned slots', enabled: true },
];

const defaultSoftConstraints: SoftConstraint[] = [
  { id: 'even-distribution', name: 'Even Distribution', description: 'Classes should be evenly distributed across the week', weight: 8, enabled: true },
  { id: 'minimize-gaps', name: 'Minimize Gaps', description: 'Minimize idle time for faculty and students', weight: 7, enabled: true },
  { id: 'lab-morning-preference', name: 'Lab Morning Preference', description: 'Schedule labs and practicals in morning slots when possible', weight: 6, enabled: true },
  { id: 'faculty-load-balance', name: 'Faculty Load Balance', description: 'Balance teaching loads fairly across faculty members', weight: 7, enabled: true },
  { id: 'avoid-last-period', name: 'Avoid Last Period', description: 'Minimize classes scheduled in the last period of the day', weight: 5, enabled: true },
];

export default function ConstraintManager() {
  const [hardConstraints, setHardConstraints] = useState<HardConstraint[]>([]);
  const [softConstraints, setSoftConstraints] = useState<SoftConstraint[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedHard = localStorage.getItem('hardConstraints');
    const savedSoft = localStorage.getItem('softConstraints');

    if (savedHard) setHardConstraints(JSON.parse(savedHard));
    else setHardConstraints([...defaultHardConstraints]);

    if (savedSoft) setSoftConstraints(JSON.parse(savedSoft));
    else setSoftConstraints([...defaultSoftConstraints]);
  }, []);

  const toggleHardConstraint = (id: string) => {
    setHardConstraints(prev => prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
  };

  const toggleSoftConstraint = (id: string) => {
    setSoftConstraints(prev => prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
  };

  const updateSoftConstraintWeight = (id: string, weight: number) => {
    setSoftConstraints(prev => prev.map(c => c.id === id ? { ...c, weight } : c));
  };

  const handleSave = () => {
    localStorage.setItem('hardConstraints', JSON.stringify(hardConstraints));
    localStorage.setItem('softConstraints', JSON.stringify(softConstraints));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getWeightColor = (weight: number) => {
    if (weight >= 8) return 'from-red-500 to-red-600';
    if (weight >= 6) return 'from-orange-500 to-orange-600';
    if (weight >= 4) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
  };

  const getWeightLabel = (weight: number) => weight >= 8 ? 'Critical' : weight >= 6 ? 'High' : weight >= 4 ? 'Medium' : 'Low';
  const getWeightBg = (weight: number) => {
    if (weight >= 8) return 'bg-red-500/10 border-red-500/30 text-red-600';
    if (weight >= 6) return 'bg-orange-500/10 border-orange-500/30 text-orange-600';
    if (weight >= 4) return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600';
    return 'bg-green-500/10 border-green-500/30 text-green-600';
  };

  const activeHardConstraints = hardConstraints.filter(c => c.enabled).length;
  const activeSoftConstraints = softConstraints.filter(c => c.enabled).length;
  const totalConstraints = hardConstraints.length + softConstraints.length;
  const activeTotal = activeHardConstraints + activeSoftConstraints;
  const completionPercentage = (activeTotal / totalConstraints) * 100;
  const averageWeight = softConstraints.filter(c => c.enabled).length > 0
    ? Math.round(softConstraints.filter(c => c.enabled).reduce((sum, c) => sum + c.weight, 0) / activeSoftConstraints)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Card */}
      <div className="bento-card relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl blur-xl opacity-30" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                <Settings className="w-7 h-7 text-primary-foreground" strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
                Constraint Management
                <Sparkles className="w-5 h-5 text-primary animate-sparkle" />
              </h2>
              <p className="text-muted-foreground mt-1">Configure hard and soft constraints for timetable optimization</p>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-red/10 to-red/5 border border-red/20 hover:border-red/40 transition-all duration-300 group/stat">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red/20 to-red/10 flex items-center justify-center group-hover/stat:scale-110 transition-transform">
                  <Shield className="w-5 h-5 text-red" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Hard Active</p>
                  <p className="text-2xl font-bold text-foreground">{activeHardConstraints}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-blue/10 to-blue/5 border border-blue/20 hover:border-blue/40 transition-all duration-300 group/stat">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue/20 to-blue/10 flex items-center justify-center group-hover/stat:scale-110 transition-transform">
                  <Target className="w-5 h-5 text-blue" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Soft Active</p>
                  <p className="text-2xl font-bold text-foreground">{activeSoftConstraints}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-violet/10 to-violet/5 border border-violet/20 hover:border-violet/40 transition-all duration-300 group/stat">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet/20 to-violet/10 flex items-center justify-center group-hover/stat:scale-110 transition-transform">
                  <Gauge className="w-5 h-5 text-violet" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg Weight</p>
                  <p className="text-2xl font-bold text-foreground">{averageWeight}/10</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-teal/10 to-teal/5 border border-teal/20 hover:border-teal/40 transition-all duration-300 group/stat">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal/20 to-teal/10 flex items-center justify-center group-hover/stat:scale-110 transition-transform">
                  <BarChart3 className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Active</p>
                  <p className="text-2xl font-bold text-foreground">{activeTotal}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground font-medium">Constraint Configuration Progress</span>
              <span className="text-foreground font-semibold">{Math.round(completionPercentage)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full transition-all duration-700 relative overflow-hidden"
                style={{ width: `${completionPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-line" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Constraints Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Hard Constraints */}
        <div className="bento-card group hover:scale-[1.01] transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red/10 via-red/5 to-transparent rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red/30 to-red/10 rounded-xl blur-md opacity-50" />
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-red/20 to-red/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-red" strokeWidth={1.5} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Hard Constraints</h3>
                <p className="text-sm text-muted-foreground">Must be satisfied - violations prevent generation</p>
              </div>
            </div>

            <div className="space-y-3">
              {hardConstraints.map((c, index) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl border-2 border-border bg-card hover:border-red/50 hover:bg-muted/30 transition-all duration-300 group/constraint relative overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red/0 via-red/0 to-red/0 group-hover/constraint:via-red/5 group-hover/constraint:to-red/10 transition-all duration-500" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Lock className="w-4 h-4 text-red/70" />
                          <h4 className="font-semibold text-foreground">{c.name}</h4>
                          <Badge 
                            variant="outline" 
                            className={`${c.enabled ? 'bg-red/10 border-red/30 text-red-600' : 'bg-muted border-border text-muted-foreground'}`}
                          >
                            {c.enabled ? "Active" : "Disabled"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{c.description}</p>
                      </div>
                      <Switch 
                        checked={c.enabled} 
                        onCheckedChange={() => toggleHardConstraint(c.id)}
                        className="ml-4"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Soft Constraints */}
        <div className="bento-card group hover:scale-[1.01] transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue/10 via-blue/5 to-transparent rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue/30 to-blue/10 rounded-xl blur-md opacity-50" />
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue/20 to-blue/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue" strokeWidth={1.5} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Soft Constraints</h3>
                <p className="text-sm text-muted-foreground">Optimization goals - higher weight = higher priority</p>
              </div>
            </div>

            <div className="space-y-3">
              {softConstraints.map((c, index) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl border-2 border-border bg-card hover:border-blue/50 hover:bg-muted/30 transition-all duration-300 group/constraint relative overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue/0 via-blue/0 to-blue/0 group-hover/constraint:via-blue/5 group-hover/constraint:to-blue/10 transition-all duration-500" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Zap className="w-4 h-4 text-blue/70" />
                          <h4 className="font-semibold text-foreground">{c.name}</h4>
                          <Badge variant="outline" className={getWeightBg(c.weight)}>
                            {getWeightLabel(c.weight)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{c.description}</p>
                      </div>
                      <Switch 
                        checked={c.enabled} 
                        onCheckedChange={() => toggleSoftConstraint(c.id)}
                        className="ml-4"
                      />
                    </div>
                    
                    {c.enabled && (
                      <div className="space-y-3 pt-3 border-t border-border/50">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium flex items-center gap-2">
                            <Gauge className="w-4 h-4 text-blue/70" />
                            Priority Weight
                          </Label>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-foreground">{c.weight}</span>
                            <span className="text-xs text-muted-foreground">/10</span>
                          </div>
                        </div>
                        <div className="relative">
                          <Slider 
                            value={[c.weight]} 
                            onValueChange={(v) => updateSoftConstraintWeight(c.id, v[0])} 
                            max={10} 
                            min={1} 
                            step={1} 
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Low</span>
                            <span>Medium</span>
                            <span>High</span>
                            <span>Critical</span>
                          </div>
                        </div>
                        {/* Weight Indicator Bar */}
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${getWeightColor(c.weight)} rounded-full transition-all duration-300`}
                            style={{ width: `${(c.weight / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary and Save Card */}
      <div className="bento-card relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                saved 
                  ? 'bg-gradient-to-br from-teal to-teal/80 shadow-lg shadow-teal/30' 
                  : 'bg-gradient-to-br from-primary/20 to-primary/10'
              }`}>
                {saved ? (
                  <CheckCircle className="w-6 h-6 text-primary-foreground animate-check-in" />
                ) : (
                  <Save className="w-6 h-6 text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Configuration Status</h3>
                <p className="text-sm text-muted-foreground">
                  {saved ? 'Constraints saved successfully!' : 'Save your constraint configuration to proceed'}
                </p>
              </div>
            </div>
            <Button 
              onClick={handleSave}
              size="lg"
              className="min-w-40 h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
              {saved ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2 relative z-10" />
                  <span className="relative z-10">Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2 relative z-10" />
                  <span className="relative z-10">Save Constraints</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
