import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { 
  Users, 
  BookOpen, 
  MapPin, 
  GraduationCap,
  Building2,
  GraduationCap as GradCap,
  Building
} from 'lucide-react';
import InstitutionSetup from '@/components/InstitutionSetup';
import DataManagement from '@/components/DataManagement';
import ConstraintManager from '@/components/ConstraintManager';
import TimetableOptimizer from '@/components/TimetableOptimizer';
import TimetableViewer from '@/components/TimetableViewer';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { NavigationTabs } from '@/components/dashboard/NavigationTabs';
import { StatCard } from '@/components/dashboard/StatCard';
import { WorkflowProgress } from '@/components/dashboard/WorkflowProgress';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import Departments from '@/components/Departments';
import SemestersDivisions from '@/components/SemestersDivisions';
import Classrooms from '@/components/Classrooms';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';

// ✅ Helper function to safely parse JSON
const safeParse = (key: string, fallback: any = []) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export default function Index() {
  const auth = useAuthStore();

  // Debug log
  useEffect(() => {
    console.log('Index component mounted', { authenticated: auth.authenticated, role: auth.role });
  }, [auth]);

  // Remove all saved setup and data
  const handleRemoveAllData = () => {
    localStorage.clear(); // ✅ clears all keys at once
    window.location.reload();
  };

  const [activeTab, setActiveTab] = useState('dashboard');

  // ✅ Persisted completion flags
  const [setupComplete, setSetupComplete] = useState<boolean>(() => safeParse("setupComplete", false));
  const [dataComplete, setDataComplete] = useState<boolean>(() => safeParse("dataComplete", false));
  const [optimizationComplete, setOptimizationComplete] = useState<boolean>(() => safeParse("optimizationComplete", false));

  // Real-time stats from backend API
  const { data: departmentsData } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const response = await api.departments.list();
      return response.success && response.data ? response.data : [];
    },
    enabled: auth.role === 'admin',
  });

  const { data: facultyData } = useQuery({
    queryKey: ['faculty'],
    queryFn: async () => {
      const response = await api.faculty.list();
      return response.success && response.data ? response.data : [];
    },
    enabled: auth.role === 'admin',
  });

  const { data: subjectsData } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const response = await api.subjects.list();
      return response.success && response.data ? response.data : [];
    },
    enabled: auth.role === 'admin',
  });

  const { data: classroomsData } = useQuery({
    queryKey: ['classrooms'],
    queryFn: async () => {
      const response = await api.classrooms.list();
      return response.success && response.data ? response.data : [];
    },
    enabled: auth.role === 'admin',
  });

  const { data: divisionsData } = useQuery({
    queryKey: ['divisions'],
    queryFn: async () => {
      const response = await api.divisions.list();
      return response.success && response.data ? response.data : [];
    },
    enabled: auth.role === 'admin',
  });

  // Calculate stats from backend data
  const facultyCount = facultyData?.length || 0;
  const subjectCount = subjectsData?.length || 0;
  const roomCount = classroomsData?.length || 0;
  const batchCount = divisionsData?.length || 0;

  // ✅ Save flags in localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("setupComplete", JSON.stringify(setupComplete));
  }, [setupComplete]);

  useEffect(() => {
    localStorage.setItem("dataComplete", JSON.stringify(dataComplete));
  }, [dataComplete]);

  useEffect(() => {
    localStorage.setItem("optimizationComplete", JSON.stringify(optimizationComplete));
  }, [optimizationComplete]);

  const stats = [
    { title: 'Total Faculty', value: facultyCount, icon: Users, variant: 'blue' as const },
    { title: 'Subjects', value: subjectCount, icon: BookOpen, variant: 'violet' as const },
    { title: 'Rooms', value: roomCount, icon: MapPin, variant: 'coral' as const },
    { title: 'Batches', value: batchCount, icon: GraduationCap, variant: 'teal' as const }
  ];

  const workflowSteps = [
    { 
      id: 1, 
      title: 'Institution Setup', 
      description: 'Configure basic institution details and calendar',
      status: setupComplete ? 'completed' as const : 'pending' as const,
      tab: 'setup'
    },
    { 
      id: 2, 
      title: 'Data Management', 
      description: 'Add faculty, subjects, rooms, and student batches',
      status: dataComplete ? 'completed' as const : 'pending' as const,
      tab: 'data'
    },
    { 
      id: 3, 
      title: 'Constraint Configuration', 
      description: 'Set up scheduling rules and preferences',
      status: 'pending' as const,
      tab: 'constraints'
    },
    { 
      id: 4, 
      title: 'Generate Timetable', 
      description: 'Run optimization algorithm to create schedules',
      status: optimizationComplete ? 'completed' as const : 'pending' as const,
      tab: 'optimizer'
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced gradient mesh with animated elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-primary/[0.03] via-transparent to-transparent animate-gradient-animate" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-accent/[0.03] via-transparent to-transparent animate-gradient-animate" style={{ animationDelay: '1s' }} />
        
        {/* Floating orbs */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet/5 rounded-full blur-3xl animate-breathe" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <DashboardHeader onClearData={handleRemoveAllData} />
          <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="mt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={stat.title}
                  className="animate-fade-in opacity-0"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
                >
                  <StatCard {...stat} />
                </div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Workflow Progress - Takes 2 columns on large screens */}
              <div 
                className="lg:col-span-2 animate-fade-in opacity-0" 
                style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
              >
                <WorkflowProgress 
                  steps={workflowSteps} 
                  onStepClick={(tab) => setActiveTab(tab)}
                />
              </div>

              {/* Recent Activity */}
              <div 
                className="animate-fade-in opacity-0" 
                style={{ animationDelay: "500ms", animationFillMode: "forwards" }}
              >
                <RecentActivity />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Backend Connected Tabs - Admin Only */}
        {auth.role === 'admin' && (
          <>
            <TabsContent value="departments" className="mt-0">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
                <Departments />
              </div>
            </TabsContent>

            <TabsContent value="semesters" className="mt-0">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
                <SemestersDivisions />
              </div>
            </TabsContent>

            <TabsContent value="classrooms" className="mt-0">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
                <Classrooms />
              </div>
            </TabsContent>
          </>
        )}

        {/* Other Tabs */}
        <TabsContent value="setup" className="mt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <InstitutionSetup onComplete={() => setSetupComplete(true)} />
          </div>
        </TabsContent>

        <TabsContent value="data" className="mt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <DataManagement onComplete={() => setDataComplete(true)} />
          </div>
        </TabsContent>

        <TabsContent value="constraints" className="mt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <ConstraintManager />
          </div>
        </TabsContent>

        <TabsContent value="optimizer" className="mt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <TimetableOptimizer onComplete={() => setOptimizationComplete(true)} />
          </div>
        </TabsContent>

        <TabsContent value="viewer" className="mt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <TimetableViewer />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
