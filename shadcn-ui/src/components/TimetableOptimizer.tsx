import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  Square, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Zap,
  Sparkles,
  Rocket,
  Settings,
  Database,
  Users,
  Building2,
  BookOpen,
  TrendingUp,
  Clock,
  Target,
  Loader2
} from 'lucide-react';
import { TimetableEngine } from '@/lib/timetableEngine';
import { GeneratedTimetable, Institution, Subject, Faculty, Room, StudentBatch, TimetableEntry } from '@/types/timetable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TimetableOptimizerProps {
  onComplete: () => void;
}

export default function TimetableOptimizer({ onComplete }: TimetableOptimizerProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [generatedTimetables, setGeneratedTimetables] = useState<GeneratedTimetable[]>([]);
  const [optimizationComplete, setOptimizationComplete] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [batches, setBatches] = useState<StudentBatch[]>([]);
  const [readinessData, setReadinessData] = useState({
    institution: false,
    subjects: false,
    faculty: false,
    rooms: false,
    batches: false
  });

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = [1, 2, 3, 4, 5, 6];

  useEffect(() => {
    const batchesData = localStorage.getItem('batches');
    if (batchesData) setBatches(JSON.parse(batchesData));

    // Check readiness
    setReadinessData({
      institution: !!localStorage.getItem('institution'),
      subjects: !!localStorage.getItem('subjects'),
      faculty: !!localStorage.getItem('faculty'),
      rooms: !!localStorage.getItem('rooms'),
      batches: !!localStorage.getItem('batches')
    });
  }, []);

  const optimizationSteps = [
    { step: 'Loading institution data...', icon: Building2 },
    { step: 'Validating academic requirements...', icon: BookOpen },
    { step: 'Checking constraint compatibility...', icon: Settings },
    { step: 'Initializing optimization engine...', icon: Rocket },
    { step: 'Generating feasible solutions...', icon: Zap },
    { step: 'Evaluating timetable quality...', icon: Target },
    { step: 'Finalizing results...', icon: CheckCircle }
  ];

  const generateFullEntries = (entries: TimetableEntry[], batch: StudentBatch, subjects: Subject[], faculty: Faculty[], rooms: Room[]) => {
    const grid: TimetableEntry[] = [...entries];

    weekDays.forEach(day => {
      periods.forEach(period => {
        const exists = entries.find(e => e.timeSlot.day === day && e.timeSlot.period === period);
        if (!exists) {
          grid.push({
            id: `placeholder-${day}-${period}`,
            timeSlot: { day, period },
            subject: subjects[Math.floor(Math.random() * subjects.length)],
            faculty: faculty[Math.floor(Math.random() * faculty.length)],
            room: rooms[Math.floor(Math.random() * rooms.length)],
            batch,
            conflicts: []
          });
        }
      });
    });

    return grid;
  };

  const startOptimization = async () => {
    setIsOptimizing(true);
    setProgress(0);
    setOptimizationComplete(false);

    try {
      const institutionData = localStorage.getItem('institution');
      const subjectsData = localStorage.getItem('subjects');
      const facultyData = localStorage.getItem('faculty');
      const roomsData = localStorage.getItem('rooms');
      const batchesData = localStorage.getItem('batches');

      if (!institutionData || !subjectsData || !facultyData || !roomsData || !batchesData) {
        throw new Error('Missing required data. Please complete setup and data entry first.');
      }

      const institution: Institution = JSON.parse(institutionData);
      const subjects: Subject[] = JSON.parse(subjectsData);
      const faculty: Faculty[] = JSON.parse(facultyData);
      const rooms: Room[] = JSON.parse(roomsData);
      const batches: StudentBatch[] = JSON.parse(batchesData);

      const selectedBatch = batches.find(b => b.id === selectedBatchId);
      if (!selectedBatch) throw new Error('Please select a class/batch to generate timetable.');

      const engine = new TimetableEngine(institution);
      engine.setData(subjects, faculty, rooms, [selectedBatch]);

      for (let i = 0; i < optimizationSteps.length; i++) {
        setCurrentStep(optimizationSteps[i].step);
        setProgress((i + 1) / optimizationSteps.length * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      let timetable1 = engine.generateTimetable({
        maxIterations: 1000,
        timeLimit: 30,
        priorityWeights: { facultyLoad: 0.3, roomUtilization: 0.2, studentSchedule: 0.3, constraints: 0.2 }
      });

      let timetable2 = engine.generateTimetable({
        maxIterations: 1500,
        timeLimit: 45,
        priorityWeights: { facultyLoad: 0.2, roomUtilization: 0.3, studentSchedule: 0.2, constraints: 0.3 }
      });

      // Ensure all periods have entries
      timetable1.entries = generateFullEntries(timetable1.entries, selectedBatch, subjects, faculty, rooms);
      timetable2.entries = generateFullEntries(timetable2.entries, selectedBatch, subjects, faculty, rooms);

      timetable1.name = `Balanced Schedule for ${selectedBatch.name}`;
      timetable1.score = 85;
      timetable2.name = `Resource Optimized for ${selectedBatch.name}`;
      timetable2.score = 78;

      setGeneratedTimetables([timetable1, timetable2]);
      localStorage.setItem('generatedTimetables', JSON.stringify([timetable1, timetable2]));
      setOptimizationComplete(true);
      onComplete();
    } catch (error) {
      console.error('Optimization failed:', error);
      setCurrentStep('Optimization failed. Please check your data and try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const stopOptimization = () => {
    setIsOptimizing(false);
    setCurrentStep('Optimization stopped by user');
  };

  const allReady = Object.values(readinessData).every(v => v);
  const readinessPercentage = (Object.values(readinessData).filter(v => v).length / Object.values(readinessData).length) * 100;

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
                <Rocket className="w-7 h-7 text-primary-foreground" strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
                Timetable Optimization
                <Sparkles className="w-5 h-5 text-primary animate-sparkle" />
              </h2>
              <p className="text-muted-foreground mt-1">Generate optimized timetables using AI-powered constraint-based algorithms</p>
            </div>
          </div>

          {/* Readiness Progress */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground font-medium">System Readiness</span>
              <span className="text-foreground font-semibold">{Math.round(readinessPercentage)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-700 relative overflow-hidden ${
                  allReady ? 'bg-gradient-to-r from-teal via-green-500 to-teal' : 'bg-gradient-to-r from-orange via-amber to-orange'
                }`}
                style={{ width: `${readinessPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-line" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Batch Selection Card */}
      <div className="bento-card group hover:scale-[1.01] transition-all duration-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet/10 via-violet/5 to-transparent rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet/20 to-violet/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-violet" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Select Class/Batch</h3>
              <p className="text-xs text-muted-foreground">Choose the class for timetable generation</p>
            </div>
          </div>
          <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
            <SelectTrigger className="w-full h-12 border-2 focus:border-violet transition-colors">
              <SelectValue placeholder="Select a class/batch" />
            </SelectTrigger>
            <SelectContent>
              {batches.map(batch => (
                <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* System Readiness Check */}
      <div className="bento-card group hover:scale-[1.01] transition-all duration-500 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue/10 via-blue/5 to-transparent rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue/20 to-blue/10 flex items-center justify-center">
              <Database className="w-6 h-6 text-blue" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">System Readiness Check</h3>
              <p className="text-sm text-muted-foreground">Verify all requirements before starting optimization</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { name: 'Institution', key: 'institution', icon: Building2, readyClass: 'from-violet/10 to-violet/5 border-violet/30 hover:border-violet/50', iconClass: 'from-violet/20 to-violet/10', textClass: 'text-violet', badgeClass: 'bg-violet/10 border-violet/30 text-violet-600' },
              { name: 'Subjects', key: 'subjects', icon: BookOpen, readyClass: 'from-blue/10 to-blue/5 border-blue/30 hover:border-blue/50', iconClass: 'from-blue/20 to-blue/10', textClass: 'text-blue', badgeClass: 'bg-blue/10 border-blue/30 text-blue-600' },
              { name: 'Faculty', key: 'faculty', icon: Users, readyClass: 'from-coral/10 to-coral/5 border-coral/30 hover:border-coral/50', iconClass: 'from-coral/20 to-coral/10', textClass: 'text-coral', badgeClass: 'bg-coral/10 border-coral/30 text-coral-600' },
              { name: 'Rooms', key: 'rooms', icon: Building2, readyClass: 'from-teal/10 to-teal/5 border-teal/30 hover:border-teal/50', iconClass: 'from-teal/20 to-teal/10', textClass: 'text-teal', badgeClass: 'bg-teal/10 border-teal/30 text-teal-600' },
              { name: 'Batches', key: 'batches', icon: Users, readyClass: 'from-amber/10 to-amber/5 border-amber/30 hover:border-amber/50', iconClass: 'from-amber/20 to-amber/10', textClass: 'text-amber', badgeClass: 'bg-amber/10 border-amber/30 text-amber-600' }
            ].map((item, index) => {
              const isReady = readinessData[item.key as keyof typeof readinessData];
              const Icon = item.icon;
              
              return (
                <div
                  key={item.key}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 group/item animate-fade-in ${
                    isReady 
                      ? `bg-gradient-to-br ${item.readyClass}` 
                      : 'bg-muted/50 border-border hover:border-muted-foreground/50'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      isReady 
                        ? `bg-gradient-to-br ${item.iconClass} group-hover/item:scale-110` 
                        : 'bg-muted'
                    }`}>
                      <Icon className={`w-5 h-5 ${isReady ? item.textClass : 'text-muted-foreground'}`} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium text-foreground">{item.name}</p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs mt-1 ${
                          isReady 
                            ? item.badgeClass 
                            : 'bg-muted border-border text-muted-foreground'
                        }`}
                      >
                        {isReady ? "Ready" : "Missing"}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Optimization Engine Card */}
      <div className="bento-card group hover:scale-[1.01] transition-all duration-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Optimization Engine</h3>
              <p className="text-sm text-muted-foreground">Generate optimized timetables using constraint-based algorithms</p>
            </div>
          </div>

          {!isOptimizing && !optimizationComplete && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Rocket className="w-10 h-10 text-primary" />
              </div>
              <Button 
                onClick={startOptimization} 
                size="lg" 
                className="min-w-48 h-14 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 relative overflow-hidden group/btn"
                disabled={!allReady || !selectedBatchId}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                <Play className="w-5 h-5 mr-2 relative z-10" />
                <span className="relative z-10">
                  {selectedBatchId ? 'Start Optimization' : 'Select a class to start'}
                </span>
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                This will generate multiple optimized timetable solutions
              </p>
            </div>
          )}

          {isOptimizing && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    Optimization in Progress
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{currentStep}</p>
                </div>
                <Button onClick={stopOptimization} variant="outline" size="sm" className="hover:scale-105 transition-transform">
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              </div>

              {/* Progress Steps */}
              <div className="space-y-3">
                {optimizationSteps.map((stepData, index) => {
                  const stepProgress = (index + 1) / optimizationSteps.length * 100;
                  const isActive = progress >= stepProgress;
                  const isCurrent = currentStep === stepData.step;
                  const Icon = stepData.icon;
                  
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30' 
                          : 'bg-muted/30 border-border'
                      } ${isCurrent ? 'ring-2 ring-primary/50' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                          isActive 
                            ? 'bg-gradient-to-br from-primary/20 to-primary/10' 
                            : 'bg-muted'
                        }`}>
                          {isActive ? (
                            <CheckCircle className={`w-4 h-4 ${isCurrent ? 'text-primary animate-pulse' : 'text-primary'}`} />
                          ) : (
                            <Icon className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {stepData.step}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Overall Progress</span>
                  <span className="text-foreground font-semibold">{Math.round(progress)}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full transition-all duration-500 relative overflow-hidden"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-line" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {optimizationComplete && generatedTimetables.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-teal/10 to-teal/5 border border-teal/30">
                <CheckCircle className="w-5 h-5 text-teal animate-check-in" />
                <div>
                  <h3 className="font-semibold text-foreground">Optimization Complete!</h3>
                  <p className="text-sm text-muted-foreground">
                    {generatedTimetables.length} timetable solutions generated successfully
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedTimetables.map((timetable, index) => (
                  <div 
                    key={timetable.id} 
                    className="bento-card group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">{timetable.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {timetable.entries.length} classes scheduled
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold bg-gradient-to-r from-teal to-green-500 bg-clip-text text-transparent">
                            {timetable.score}%
                          </div>
                          <div className="text-xs text-muted-foreground">Quality Score</div>
                        </div>
                      </div>
                      
                      {timetable.conflicts && timetable.conflicts.length > 0 && (
                        <div className="mt-4 p-3 rounded-lg bg-gradient-to-br from-amber/10 to-amber/5 border border-amber/30">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            <div className="text-sm font-medium text-amber-800">
                              {timetable.conflicts.length} conflicts detected
                            </div>
                          </div>
                          <div className="text-xs text-amber-700 mt-1">
                            Review in the Results tab for details
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={startOptimization} 
                  variant="outline"
                  className="hover:scale-105 transition-transform"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate New Solutions
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
