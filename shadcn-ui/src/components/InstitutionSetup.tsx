import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Save, 
  CheckCircle, 
  Plus, 
  Minus, 
  Building2, 
  CalendarDays,
  Clock3,
  Coffee,
  Sparkles,
  TrendingUp,
  CalendarCheck
} from 'lucide-react';
import { Institution } from '@/types/timetable';

interface InstitutionSetupProps {
  onComplete: () => void;
}

export default function InstitutionSetup({ onComplete }: InstitutionSetupProps) {
  const [institution, setInstitution] = useState<Partial<Institution>>({
    name: '',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    periodsPerDay: 6,
    periodTimings: [
      { period: 1, startTime: '09:00', endTime: '10:00' },
      { period: 2, startTime: '10:00', endTime: '11:00' },
      { period: 3, startTime: '11:15', endTime: '12:15' },
      { period: 4, startTime: '12:15', endTime: '13:15' },
      { period: 5, startTime: '14:00', endTime: '15:00' },
      { period: 6, startTime: '15:00', endTime: '16:00' }
    ],
    breaks: [
      { name: 'Tea Break', startTime: '11:00', endTime: '11:15' },
      { name: 'Lunch Break', startTime: '13:15', endTime: '14:00' }
    ],
    semesterStart: '',
    semesterEnd: '',
    holidays: []
  });

  const [saved, setSaved] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    const savedInstitution = localStorage.getItem('institution');
    if (savedInstitution) {
      try {
        setInstitution(JSON.parse(savedInstitution));
      } catch {
        console.error("Invalid institution data in localStorage");
      }
    }
  }, []);

  useEffect(() => {
    let completed = 0;
    if (institution.name) completed++;
    if (institution.semesterStart) completed++;
    if (institution.semesterEnd) completed++;
    if (institution.workingDays && institution.workingDays.length > 0) completed++;
    if (institution.periodTimings && institution.periodTimings.length > 0) completed++;
    setCompletionPercentage((completed / 5) * 100);
  }, [institution]);

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayAbbr = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleDayToggle = (day: string, checked: boolean) => {
    setInstitution(prev => ({
      ...prev,
      workingDays: checked 
        ? [...(prev.workingDays || []), day]
        : (prev.workingDays || []).filter(d => d !== day)
    }));
  };

  const handlePeriodChange = (index: number, field: 'startTime' | 'endTime', value: string) => {
    setInstitution(prev => ({
      ...prev,
      periodTimings: prev.periodTimings?.map((period, i) => 
        i === index ? { ...period, [field]: value } : period
      )
    }));
  };

  const addPeriod = () => {
    const newPeriod = institution.periodsPerDay! + 1;
    const lastPeriod = institution.periodTimings?.[institution.periodTimings.length - 1];
    const lastEndTime = lastPeriod?.endTime || '16:00';
    const [hours, minutes] = lastEndTime.split(':').map(Number);
    const nextStart = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    const nextEnd = `${String(hours + 1).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    
    setInstitution(prev => ({
      ...prev,
      periodsPerDay: newPeriod,
      periodTimings: [
        ...(prev.periodTimings || []),
        { period: newPeriod, startTime: nextStart, endTime: nextEnd }
      ]
    }));
  };

  const removePeriod = () => {
    if (institution.periodsPerDay! > 1) {
      setInstitution(prev => ({
        ...prev,
        periodsPerDay: prev.periodsPerDay! - 1,
        periodTimings: prev.periodTimings?.slice(0, -1)
      }));
    }
  };

  const handleSave = () => {
    localStorage.setItem('institution', JSON.stringify(institution));
    setSaved(true);
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const handleBreakChange = (index: number, field: 'name' | 'startTime' | 'endTime', value: string) => {
    setInstitution(prev => ({
      ...prev,
      breaks: prev.breaks?.map((breakTime, i) =>
        i === index ? { ...breakTime, [field]: value } : breakTime
      )
    }));
  };

  const addBreak = () => {
    setInstitution(prev => ({
      ...prev,
      breaks: [
        ...(prev.breaks || []),
        { name: 'New Break', startTime: '10:00', endTime: '10:15' }
      ]
    }));
  };

  const removeBreak = () => {
    if ((institution.breaks?.length || 0) > 0) {
      setInstitution(prev => ({
        ...prev,
        breaks: prev.breaks?.slice(0, -1)
      }));
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Card */}
      <div className="bento-card relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl blur-xl opacity-30" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                <Building2 className="w-7 h-7 text-primary-foreground" strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
                Institution Setup
                <Sparkles className="w-5 h-5 text-primary animate-sparkle" />
              </h2>
              <p className="text-muted-foreground mt-1">Configure your institution&apos;s basic details and schedule</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground font-medium">Setup Progress</span>
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

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Institution Name Card - Large */}
        <div className="lg:col-span-2">
          <div className="bento-card group hover:scale-[1.01] transition-all duration-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue/5 via-transparent to-violet/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue/20 to-blue/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Institution Name</h3>
                  <p className="text-xs text-muted-foreground">Enter your institution&apos;s name</p>
                </div>
              </div>
              <Input
                placeholder="Enter institution name"
                value={institution.name || ''}
                onChange={(e) => setInstitution(prev => ({ ...prev, name: e.target.value }))}
                className="h-12 text-lg font-medium border-2 focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="bento-card group hover:scale-[1.01] transition-all duration-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal/20 to-teal/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-teal" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Quick Stats</h3>
              <p className="text-xs text-muted-foreground">Overview</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">Periods</span>
              <span className="text-2xl font-bold text-foreground">{institution.periodsPerDay}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">Working Days</span>
              <span className="text-2xl font-bold text-foreground">{institution.workingDays?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">Breaks</span>
              <span className="text-2xl font-bold text-foreground">{institution.breaks?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Semester Dates Card */}
        <div className="lg:col-span-2">
          <div className="bento-card group hover:scale-[1.01] transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-coral/10 to-transparent rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral/20 to-coral/10 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-coral" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Semester Dates</h3>
                  <p className="text-xs text-muted-foreground">Set academic calendar period</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="semester-start" className="text-sm font-medium">Start Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="semester-start"
                      type="date"
                      value={institution.semesterStart || ''}
                      onChange={(e) => setInstitution(prev => ({ ...prev, semesterStart: e.target.value }))}
                      className="pl-10 h-11 border-2 focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester-end" className="text-sm font-medium">End Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="semester-end"
                      type="date"
                      value={institution.semesterEnd || ''}
                      onChange={(e) => setInstitution(prev => ({ ...prev, semesterEnd: e.target.value }))}
                      className="pl-10 h-11 border-2 focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Working Days Card */}
        <div className="bento-card group hover:scale-[1.01] transition-all duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet/20 to-violet/10 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5 text-violet" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Working Days</h3>
              <p className="text-xs text-muted-foreground">Select active days</p>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => {
              const isActive = institution.workingDays?.includes(day);
              return (
                <button
                  key={day}
                  onClick={() => handleDayToggle(day, !isActive)}
                  className={`
                    relative p-3 rounded-xl border-2 transition-all duration-300 group/day
                    ${isActive 
                      ? 'bg-gradient-to-br from-violet to-violet/80 border-violet text-primary-foreground shadow-lg shadow-violet/20 scale-105' 
                      : 'bg-card border-border hover:border-violet/50 hover:bg-muted/50'
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
                  )}
                  <div className="relative z-10">
                    <div className="text-xs font-medium mb-1">{dayAbbr[index]}</div>
                    <div className="w-6 h-6 rounded-full bg-background/20 flex items-center justify-center mx-auto">
                      {isActive && (
                        <CheckCircle className="w-4 h-4 text-primary-foreground animate-check-in" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Period Timings Card - Large */}
        <div className="lg:col-span-3">
          <div className="bento-card group hover:scale-[1.01] transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <Clock3 className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Period Timings</h3>
                    <p className="text-sm text-muted-foreground">Configure class periods and durations</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-lg bg-muted/50 border border-border">
                    <span className="text-sm font-medium text-muted-foreground">Total: </span>
                    <span className="text-lg font-bold text-foreground">{institution.periodsPerDay}</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={removePeriod}
                    disabled={institution.periodsPerDay! <= 1}
                    className="h-9 w-9 p-0 hover:scale-110 transition-transform"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={addPeriod}
                    className="h-9 w-9 p-0 hover:scale-110 transition-transform"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {institution.periodTimings?.map((period, index) => (
                  <div 
                    key={period.period} 
                    className="p-4 rounded-xl border-2 border-border bg-card hover:border-primary/50 hover:bg-muted/30 transition-all duration-300 group/period relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover/period:via-primary/5 group-hover/period:to-primary/10 transition-all duration-500" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline" className="font-semibold bg-primary/10 border-primary/30 text-primary">
                          Period {period.period}
                        </Badge>
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <div>
                          <Label className="text-xs text-muted-foreground">Start</Label>
                          <Input
                            type="time"
                            value={period.startTime}
                            onChange={(e) => handlePeriodChange(index, 'startTime', e.target.value)}
                            className="h-9 border-2 focus:border-primary transition-colors"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">End</Label>
                          <Input
                            type="time"
                            value={period.endTime}
                            onChange={(e) => handlePeriodChange(index, 'endTime', e.target.value)}
                            className="h-9 border-2 focus:border-primary transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Break Times Card */}
        <div className="lg:col-span-3">
          <div className="bento-card group hover:scale-[1.01] transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-amber/10 via-coral/10 to-transparent rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber/20 to-amber/10 flex items-center justify-center">
                    <Coffee className="w-6 h-6 text-amber" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Break Times</h3>
                    <p className="text-sm text-muted-foreground">Configure break periods and durations</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={removeBreak}
                    disabled={(institution.breaks?.length || 0) === 0}
                    className="h-9 w-9 p-0 hover:scale-110 transition-transform"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={addBreak}
                    className="h-9 w-9 p-0 hover:scale-110 transition-transform"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {institution.breaks?.map((breakTime, index) => (
                  <div 
                    key={index} 
                    className="p-4 rounded-xl border-2 border-border bg-card hover:border-amber/50 hover:bg-muted/30 transition-all duration-300 group/break relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber/0 via-amber/0 to-amber/0 group-hover/break:via-amber/5 group-hover/break:to-amber/10 transition-all duration-500" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <Coffee className="w-4 h-4 text-amber" />
                        <Input
                          type="text"
                          value={breakTime.name}
                          onChange={e => handleBreakChange(index, 'name', e.target.value)}
                          className="h-8 font-semibold border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          placeholder="Break name"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs text-muted-foreground">Start</Label>
                          <Input
                            type="time"
                            value={breakTime.startTime}
                            onChange={e => handleBreakChange(index, 'startTime', e.target.value)}
                            className="h-9 border-2 focus:border-amber transition-colors"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">End</Label>
                          <Input
                            type="time"
                            value={breakTime.endTime}
                            onChange={e => handleBreakChange(index, 'endTime', e.target.value)}
                            className="h-9 border-2 focus:border-amber transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {(!institution.breaks || institution.breaks.length === 0) && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    <Coffee className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No breaks configured. Click + to add one.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Card */}
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
                  {saved ? 'Configuration saved successfully!' : 'Save your configuration to proceed'}
                </p>
              </div>
            </div>
            <Button 
              onClick={handleSave} 
              disabled={!institution.name || saved}
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
                  <span className="relative z-10">Save Setup</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
