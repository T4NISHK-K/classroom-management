import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Download, 
  Share, 
  CheckCircle, 
  AlertTriangle, 
  Calendar,
  Sparkles,
  TrendingUp,
  Clock,
  Users,
  BookOpen,
  MapPin,
  BarChart3,
  FileDown,
  FileSpreadsheet
} from 'lucide-react';
import { GeneratedTimetable, TimetableEntry } from '@/types/timetable';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function TimetableViewer() {
  const [timetables, setTimetables] = useState<GeneratedTimetable[]>([]);
  const [selectedTimetable, setSelectedTimetable] = useState<GeneratedTimetable | null>(null);

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = [1, 2, 3, 4, 5, 6];

  useEffect(() => {
    const savedTimetables = localStorage.getItem('generatedTimetables');
    if (savedTimetables) {
      const parsed = JSON.parse(savedTimetables);
      setTimetables(parsed);
      if (parsed.length > 0) setSelectedTimetable(parsed[0]);
    }
  }, []);

  const getTimetableGrid = (entries: TimetableEntry[]) => {
    const grid: { [key: string]: TimetableEntry } = {};
    entries.forEach(entry => {
      const key = `${entry.timeSlot.day}-${entry.timeSlot.period}`;
      grid[key] = entry;
    });
    return grid;
  };

  const exportPDF = (timetable: GeneratedTimetable) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(timetable.name, 14, 16);

    const head = [['Period', ...weekDays]];
    const grid = getTimetableGrid(timetable.entries);
    const body = periods.map(period => {
      const row = [`Period ${period}`];
      weekDays.forEach(day => {
        const entry = grid[`${day}-${period}`];
        if (entry) {
          row.push(`${entry.subject.code}\n${entry.faculty.name}\n${entry.room.name}`);
        } else {
          row.push('Free');
        }
      });
      return row;
    });

    autoTable(doc, {
      head,
      body,
      startY: 22,
      theme: 'grid',
      headStyles: { fillColor: [200, 200, 200] },
      styles: { fontSize: 9, cellPadding: 2 },
    });

    doc.save(`${timetable.name}.pdf`);
  };

  const exportExcel = (timetable: GeneratedTimetable) => {
    const grid = getTimetableGrid(timetable.entries);
    const data = periods.map(period => {
      const row: any[] = [`Period ${period}`];
      weekDays.forEach(day => {
        const entry = grid[`${day}-${period}`];
        if (entry) {
          row.push(`${entry.subject.code} | ${entry.faculty.name} | ${entry.room.name}`);
        } else {
          row.push('Free');
        }
      });
      return row;
    });

    const worksheetData = [['Period', ...weekDays], ...data];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Timetable');
    XLSX.writeFile(workbook, `${timetable.name}.xlsx`);
  };

  const getTimetableStats = (timetable: GeneratedTimetable) => {
    const grid = getTimetableGrid(timetable.entries);
    const totalSlots = weekDays.length * periods.length;
    const filledSlots = Object.keys(grid).length;
    const uniqueSubjects = new Set(timetable.entries.map(e => e.subject.id)).size;
    const uniqueFaculty = new Set(timetable.entries.map(e => e.faculty.id)).size;
    const uniqueRooms = new Set(timetable.entries.map(e => e.room.id)).size;
    const conflicts = timetable.conflicts?.length || 0;

    return {
      totalSlots,
      filledSlots,
      utilization: Math.round((filledSlots / totalSlots) * 100),
      uniqueSubjects,
      uniqueFaculty,
      uniqueRooms,
      conflicts
    };
  };

  if (timetables.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bento-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent rounded-full blur-3xl" />
          <div className="relative z-10 text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Calendar className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">No Timetables Generated</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Run the optimization process to generate timetable solutions. Once generated, you can view, compare, and export them here.
            </p>
            <Button variant="outline" size="lg" className="hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4 mr-2" />
              Go to Optimizer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const stats = selectedTimetable ? getTimetableStats(selectedTimetable) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Card */}
      <div className="bento-card relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl blur-xl opacity-30" />
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                  <FileText className="w-7 h-7 text-primary-foreground" strokeWidth={1.5} />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
                  Timetable Results
                  <Sparkles className="w-5 h-5 text-primary animate-sparkle" />
                </h2>
                <p className="text-muted-foreground mt-1">View, analyze, and export your generated timetables</p>
              </div>
            </div>
            <Select
              value={selectedTimetable?.id || ''}
              onValueChange={(value) => {
                const timetable = timetables.find(tt => tt.id === value);
                if (timetable) setSelectedTimetable(timetable);
              }}
            >
              <SelectTrigger className="w-64 h-12 border-2 focus:border-primary transition-colors">
                <SelectValue placeholder="Select timetable" />
              </SelectTrigger>
              <SelectContent>
                {timetables.map(tt => (
                  <SelectItem key={tt.id} value={tt.id}>
                    {tt.name} ({tt.score}%)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Statistics Grid */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-teal/10 to-teal/5 border border-teal/20 hover:border-teal/40 transition-all duration-300 group/stat">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal/20 to-teal/10 flex items-center justify-center group-hover/stat:scale-110 transition-transform">
                    <BarChart3 className="w-5 h-5 text-teal" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Utilization</p>
                    <p className="text-2xl font-bold text-foreground">{stats.utilization}%</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-blue/10 to-blue/5 border border-blue/20 hover:border-blue/40 transition-all duration-300 group/stat">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue/20 to-blue/10 flex items-center justify-center group-hover/stat:scale-110 transition-transform">
                    <BookOpen className="w-5 h-5 text-blue" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Subjects</p>
                    <p className="text-2xl font-bold text-foreground">{stats.uniqueSubjects}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-violet/10 to-violet/5 border border-violet/20 hover:border-violet/40 transition-all duration-300 group/stat">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet/20 to-violet/10 flex items-center justify-center group-hover/stat:scale-110 transition-transform">
                    <Users className="w-5 h-5 text-violet" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Faculty</p>
                    <p className="text-2xl font-bold text-foreground">{stats.uniqueFaculty}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-coral/10 to-coral/5 border border-coral/20 hover:border-coral/40 transition-all duration-300 group/stat">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-coral/20 to-coral/10 flex items-center justify-center group-hover/stat:scale-110 transition-transform">
                    <MapPin className="w-5 h-5 text-coral" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Rooms</p>
                    <p className="text-2xl font-bold text-foreground">{stats.uniqueRooms}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedTimetable && (
        <>
          {/* Timetable Info Card */}
          <div className="bento-card group hover:scale-[1.01] transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">{selectedTimetable.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Generated on {new Date(selectedTimetable.generatedAt).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-teal to-green-500 bg-clip-text text-transparent">
                    {selectedTimetable.score}%
                  </div>
                  <div className="text-xs text-muted-foreground">Quality Score</div>
                </div>
              </div>

              {selectedTimetable.conflicts && selectedTimetable.conflicts.length > 0 && (
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-amber/10 to-amber/5 border border-amber/30">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <div>
                      <div className="text-sm font-semibold text-amber-800">
                        {selectedTimetable.conflicts.length} conflicts detected
                      </div>
                      <div className="text-xs text-amber-700 mt-0.5">
                        Review conflicts below for details
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timetable Grid */}
          <div className="bento-card group hover:scale-[1.01] transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Weekly Schedule</h3>
                  <p className="text-xs text-muted-foreground">Complete timetable view</p>
                </div>
              </div>

              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border-2 border-border bg-gradient-to-br from-muted to-muted/50 p-3 text-left font-semibold text-foreground sticky left-0 z-10">
                        Period
                      </th>
                      {weekDays.map(day => (
                        <th 
                          key={day} 
                          className="border-2 border-border bg-gradient-to-br from-primary/10 to-primary/5 p-3 text-center font-semibold text-foreground min-w-[180px]"
                        >
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {periods.map((period, pIndex) => {
                      const grid = getTimetableGrid(selectedTimetable.entries);
                      return (
                        <tr key={period} className="group/row">
                          <td className="border-2 border-border bg-gradient-to-br from-muted to-muted/50 p-3 font-semibold text-foreground sticky left-0 z-10">
                            Period {period}
                          </td>
                          {weekDays.map((day, dIndex) => {
                            const entry = grid[`${day}-${period}`];
                            return (
                              <td 
                                key={`${day}-${period}`} 
                                className="border-2 border-border p-2 text-xs group/cell hover:bg-muted/50 transition-colors"
                              >
                                {entry ? (
                                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 group-hover/cell:scale-105">
                                    <div className="space-y-1">
                                      <div className="font-bold text-primary flex items-center gap-1">
                                        <BookOpen className="w-3 h-3" />
                                        {entry.subject.code}
                                      </div>
                                      <div className="text-foreground flex items-center gap-1">
                                        <Users className="w-3 h-3 text-muted-foreground" />
                                        {entry.faculty.name}
                                      </div>
                                      <div className="text-muted-foreground flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {entry.room.name}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="p-2 rounded-lg bg-muted/30 text-center text-muted-foreground">
                                    Free
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Export Card */}
          <div className="bento-card group hover:scale-[1.01] transition-all duration-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <Download className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Export Timetable</h3>
                  <p className="text-xs text-muted-foreground">Download in various formats</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => exportPDF(selectedTimetable)}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 hover:scale-105 transition-all duration-300 relative overflow-hidden group/btn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                  <FileDown className="w-5 h-5 mr-2 relative z-10" />
                  <span className="relative z-10">Export as PDF</span>
                </Button>
                <Button 
                  onClick={() => exportExcel(selectedTimetable)}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 hover:scale-105 transition-all duration-300 relative overflow-hidden group/btn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                  <FileSpreadsheet className="w-5 h-5 mr-2 relative z-10" />
                  <span className="relative z-10">Export as Excel</span>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
