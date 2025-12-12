import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  MapPin, 
  GraduationCap, 
  Plus, 
  Save, 
  CheckCircle,
  Trash2,
  Sparkles,
  TrendingUp,
  Database,
  X,
  Edit2
} from 'lucide-react';
import { Subject, Faculty, Room, StudentBatch } from '@/types/timetable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DataManagementProps {
  onComplete: () => void;
}

export default function DataManagement({ onComplete }: DataManagementProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [batches, setBatches] = useState<StudentBatch[]>([]);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('subjects');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Load saved data
  useEffect(() => {
    const savedSubjects = localStorage.getItem('subjects');
    const savedFaculty = localStorage.getItem('faculty');
    const savedRooms = localStorage.getItem('rooms');
    const savedBatches = localStorage.getItem('batches');
    if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
    if (savedFaculty) setFaculty(JSON.parse(savedFaculty));
    if (savedRooms) setRooms(JSON.parse(savedRooms));
    if (savedBatches) setBatches(JSON.parse(savedBatches));
  }, []);

  // Auto-save whenever data changes
  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('faculty', JSON.stringify(faculty));
  }, [faculty]);

  useEffect(() => {
    localStorage.setItem('rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('batches', JSON.stringify(batches));
  }, [batches]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const totalItems = subjects.length + faculty.length + rooms.length + batches.length;
  const completionPercentage = totalItems > 0 ? Math.min((totalItems / 20) * 100, 100) : 0;

  const addSubject = () => {
    const newSubject: Subject = {
      id: `SUB${Date.now()}`,
      code: '',
      name: '',
      type: 'Theory',
      credits: 0,
      weeklyHours: 0,
      sessionsPerWeek: 0,
      sessionDuration: 60,
      preferredTimeSlots: [],
      continuousHours: 1,
      equipmentRequired: []
    };
    setSubjects(prev => [...prev, newSubject]);
    setEditingId(newSubject.id);
  };

  const addFaculty = () => {
    const newFaculty: Faculty = {
      id: `FAC${Date.now()}`,
      name: '',
      eligibleSubjects: [],
      maxWeeklyLoad: 0,
      availability: [],
      unavailableSlots: [],
      preferences: {
        preferredDays: [],
        preferredTimeSlots: [],
        noBackToBack: false,
        maxDailyHours: 0
      },
      leaveFrequency: 0
    };
    setFaculty(prev => [...prev, newFaculty]);
    setEditingId(newFaculty.id);
  };

  const addRoom = () => {
    const newRoom: Room = {
      id: `ROOM${Date.now()}`,
      name: '',
      type: 'Classroom',
      capacity: 0,
      equipment: [],
      availability: [],
      location: ''
    };
    setRooms(prev => [...prev, newRoom]);
    setEditingId(newRoom.id);
  };

  const addBatch = () => {
    const newBatch: StudentBatch = {
      id: `BATCH${Date.now()}`,
      name: '',
      department: '',
      year: 1,
      section: '',
      size: 0,
      mandatorySubjects: [],
      electiveGroups: [],
      maxDailyClasses: 0,
      specialRequirements: []
    };
    setBatches(prev => [...prev, newBatch]);
    setEditingId(newBatch.id);
  };

  const deleteItem = (id: string, type: 'subjects' | 'faculty' | 'rooms' | 'batches') => {
    if (type === 'subjects') setSubjects(prev => prev.filter(s => s.id !== id));
    if (type === 'faculty') setFaculty(prev => prev.filter(f => f.id !== id));
    if (type === 'rooms') setRooms(prev => prev.filter(r => r.id !== id));
    if (type === 'batches') setBatches(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Card with Statistics */}
      <div className="bento-card relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl blur-xl opacity-30" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                <Database className="w-7 h-7 text-primary-foreground" strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
                Data Management
                <Sparkles className="w-5 h-5 text-primary animate-sparkle" />
              </h2>
              <p className="text-muted-foreground mt-1">Manage subjects, faculty, rooms, and student batches</p>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-violet/10 to-violet/5 border border-violet/20 hover:border-violet/40 transition-all duration-300 group/stat">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet/20 to-violet/10 flex items-center justify-center group-hover/stat:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5 text-violet" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Subjects</p>
                  <p className="text-2xl font-bold text-foreground">{subjects.length}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-blue/10 to-blue/5 border border-blue/20 hover:border-blue/40 transition-all duration-300 group/stat">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue/20 to-blue/10 flex items-center justify-center group-hover/stat:scale-110 transition-transform">
                  <Users className="w-5 h-5 text-blue" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Faculty</p>
                  <p className="text-2xl font-bold text-foreground">{faculty.length}</p>
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
                  <p className="text-2xl font-bold text-foreground">{rooms.length}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-teal/10 to-teal/5 border border-teal/20 hover:border-teal/40 transition-all duration-300 group/stat">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal/20 to-teal/10 flex items-center justify-center group-hover/stat:scale-110 transition-transform">
                  <GraduationCap className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Batches</p>
                  <p className="text-2xl font-bold text-foreground">{batches.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground font-medium">Data Collection Progress</span>
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

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bento-card p-2 backdrop-blur-xl bg-card/60 border-border/50">
          <TabsList className="grid w-full grid-cols-4 bg-transparent gap-2 p-0 h-auto">
            <TabsTrigger 
              value="subjects" 
              className="flex items-center gap-2 py-3 data-[state=active]:from-violet data-[state=active]:to-violet/90"
            >
              <BookOpen className="w-4 h-4 relative z-10" />
              <span className="relative z-10 font-semibold">Subjects</span>
              <Badge 
                variant="secondary" 
                className="ml-auto px-2 py-0.5 text-xs font-medium bg-background/40 backdrop-blur-sm border-border/50 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:border-white/30 relative z-10"
              >
                {subjects.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="faculty"
              className="flex items-center gap-2 py-3 data-[state=active]:from-blue data-[state=active]:to-blue/90"
            >
              <Users className="w-4 h-4 relative z-10" />
              <span className="relative z-10 font-semibold">Faculty</span>
              <Badge 
                variant="secondary" 
                className="ml-auto px-2 py-0.5 text-xs font-medium bg-background/40 backdrop-blur-sm border-border/50 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:border-white/30 relative z-10"
              >
                {faculty.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="rooms"
              className="flex items-center gap-2 py-3 data-[state=active]:from-coral data-[state=active]:to-coral/90"
            >
              <MapPin className="w-4 h-4 relative z-10" />
              <span className="relative z-10 font-semibold">Rooms</span>
              <Badge 
                variant="secondary" 
                className="ml-auto px-2 py-0.5 text-xs font-medium bg-background/40 backdrop-blur-sm border-border/50 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:border-white/30 relative z-10"
              >
                {rooms.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="batches"
              className="flex items-center gap-2 py-3 data-[state=active]:from-teal data-[state=active]:to-teal/90"
            >
              <GraduationCap className="w-4 h-4 relative z-10" />
              <span className="relative z-10 font-semibold">Batches</span>
              <Badge 
                variant="secondary" 
                className="ml-auto px-2 py-0.5 text-xs font-medium bg-background/40 backdrop-blur-sm border-border/50 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:border-white/30 relative z-10"
              >
                {batches.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Academic Subjects</h3>
              <p className="text-sm text-muted-foreground">Add and manage all subjects</p>
            </div>
            <Button 
              onClick={addSubject}
              className="bg-gradient-to-r from-violet to-violet/90 hover:from-violet/90 hover:to-violet shadow-lg shadow-violet/20 hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Subject
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject, index) => (
              <div
                key={subject.id}
                className="bento-card group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet/5 via-transparent to-violet/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet/20 to-violet/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-violet" />
                      </div>
                      <Badge variant="outline" className="bg-violet/10 border-violet/30 text-violet">
                        {subject.type}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteItem(subject.id, 'subjects')}
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Subject Name</Label>
                      <Input
                        placeholder="Enter subject name"
                        value={subject.name}
                        onChange={e => setSubjects(prev => prev.map(s => s.id === subject.id ? { ...s, name: e.target.value } : s))}
                        className="h-9 border-2 focus:border-violet transition-colors font-medium"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Subject Code</Label>
                      <Input
                        placeholder="e.g., CS101"
                        value={subject.code}
                        onChange={e => setSubjects(prev => prev.map(s => s.id === subject.id ? { ...s, code: e.target.value } : s))}
                        className="h-9 border-2 focus:border-violet transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Credits</Label>
                        <Input
                          type="number"
                          value={subject.credits}
                          onChange={e => setSubjects(prev => prev.map(s => s.id === subject.id ? { ...s, credits: parseInt(e.target.value) || 0 } : s))}
                          className="h-9 border-2 focus:border-violet transition-colors"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Hours/Week</Label>
                        <Input
                          type="number"
                          value={subject.weeklyHours}
                          onChange={e => setSubjects(prev => prev.map(s => s.id === subject.id ? { ...s, weeklyHours: parseInt(e.target.value) || 0 } : s))}
                          className="h-9 border-2 focus:border-violet transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {subjects.length === 0 && (
              <div className="col-span-full bento-card text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-muted-foreground mb-4">No subjects added yet</p>
                <Button onClick={addSubject} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Subject
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Faculty Tab */}
        <TabsContent value="faculty" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Faculty Members</h3>
              <p className="text-sm text-muted-foreground">Add and manage faculty members</p>
            </div>
            <Button 
              onClick={addFaculty}
              className="bg-gradient-to-r from-blue to-blue/90 hover:from-blue/90 hover:to-blue shadow-lg shadow-blue/20 hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Faculty
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {faculty.map((fac, index) => (
              <div
                key={fac.id}
                className="bento-card group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue/5 via-transparent to-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue/20 to-blue/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue" />
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteItem(fac.id, 'faculty')}
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Faculty Name</Label>
                      <Input
                        placeholder="Enter faculty name"
                        value={fac.name}
                        onChange={e => setFaculty(prev => prev.map(f => f.id === fac.id ? { ...f, name: e.target.value } : f))}
                        className="h-9 border-2 focus:border-blue transition-colors font-medium"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Max Weekly Load (hours)</Label>
                      <Input
                        type="number"
                        value={fac.maxWeeklyLoad}
                        onChange={e => setFaculty(prev => prev.map(f => f.id === fac.id ? { ...f, maxWeeklyLoad: parseInt(e.target.value) || 0 } : f))}
                        className="h-9 border-2 focus:border-blue transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {faculty.length === 0 && (
              <div className="col-span-full bento-card text-center py-12">
                <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-muted-foreground mb-4">No faculty members added yet</p>
                <Button onClick={addFaculty} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Faculty
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Rooms Tab */}
        <TabsContent value="rooms" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Rooms & Facilities</h3>
              <p className="text-sm text-muted-foreground">Add and manage rooms and facilities</p>
            </div>
            <Button 
              onClick={addRoom}
              className="bg-gradient-to-r from-coral to-coral/90 hover:from-coral/90 hover:to-coral shadow-lg shadow-coral/20 hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Room
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room, index) => (
              <div
                key={room.id}
                className="bento-card group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-coral/5 via-transparent to-coral/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-coral/20 to-coral/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-coral" />
                      </div>
                      <Badge variant="outline" className="bg-coral/10 border-coral/30 text-coral">
                        {room.type}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteItem(room.id, 'rooms')}
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Room Name</Label>
                      <Input
                        placeholder="e.g., Room 101"
                        value={room.name}
                        onChange={e => setRooms(prev => prev.map(r => r.id === room.id ? { ...r, name: e.target.value } : r))}
                        className="h-9 border-2 focus:border-coral transition-colors font-medium"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Capacity</Label>
                      <Input
                        type="number"
                        value={room.capacity}
                        onChange={e => setRooms(prev => prev.map(r => r.id === room.id ? { ...r, capacity: parseInt(e.target.value) || 0 } : r))}
                        className="h-9 border-2 focus:border-coral transition-colors"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Location (optional)</Label>
                      <Input
                        placeholder="Building, Floor, etc."
                        value={room.location || ''}
                        onChange={e => setRooms(prev => prev.map(r => r.id === room.id ? { ...r, location: e.target.value } : r))}
                        className="h-9 border-2 focus:border-coral transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {rooms.length === 0 && (
              <div className="col-span-full bento-card text-center py-12">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-muted-foreground mb-4">No rooms added yet</p>
                <Button onClick={addRoom} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Room
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Batches Tab */}
        <TabsContent value="batches" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Student Batches</h3>
              <p className="text-sm text-muted-foreground">Add and manage student batches</p>
            </div>
            <Button 
              onClick={addBatch}
              className="bg-gradient-to-r from-teal to-teal/90 hover:from-teal/90 hover:to-teal shadow-lg shadow-teal/20 hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Batch
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {batches.map((batch, index) => (
              <div
                key={batch.id}
                className="bento-card group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal/5 via-transparent to-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal/20 to-teal/10 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-teal" />
                      </div>
                      <Badge variant="outline" className="bg-teal/10 border-teal/30 text-teal">
                        Year {batch.year}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteItem(batch.id, 'batches')}
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Batch Name</Label>
                      <Input
                        placeholder="e.g., CS-A"
                        value={batch.name}
                        onChange={e => setBatches(prev => prev.map(b => b.id === batch.id ? { ...b, name: e.target.value } : b))}
                        className="h-9 border-2 focus:border-teal transition-colors font-medium"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Department</Label>
                        <Input
                          placeholder="Dept"
                          value={batch.department}
                          onChange={e => setBatches(prev => prev.map(b => b.id === batch.id ? { ...b, department: e.target.value } : b))}
                          className="h-9 border-2 focus:border-teal transition-colors"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Size</Label>
                        <Input
                          type="number"
                          value={batch.size}
                          onChange={e => setBatches(prev => prev.map(b => b.id === batch.id ? { ...b, size: parseInt(e.target.value) || 0 } : b))}
                          className="h-9 border-2 focus:border-teal transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {batches.length === 0 && (
              <div className="col-span-full bento-card text-center py-12">
                <GraduationCap className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-muted-foreground mb-4">No batches added yet</p>
                <Button onClick={addBatch} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Batch
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

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
                <h3 className="font-semibold text-foreground">Data Status</h3>
                <p className="text-sm text-muted-foreground">
                  {saved ? 'All data saved successfully!' : 'Save your data to proceed with optimization'}
                </p>
              </div>
            </div>
            <Button 
              onClick={handleSave} 
              disabled={totalItems === 0 || saved}
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
                  <span className="relative z-10">Save Data</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
