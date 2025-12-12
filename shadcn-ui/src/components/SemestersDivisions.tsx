import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { GraduationCap, Plus, Trash2, Edit2, Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SemestersDivisions() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('semesters');
  
  // Semester form state
  const [semDeptId, setSemDeptId] = useState('');
  const [semName, setSemName] = useState('');
  const [semType, setSemType] = useState<'Odd' | 'Even'>('Odd');
  const [editingSemId, setEditingSemId] = useState<number | null>(null);
  const [isSemDialogOpen, setIsSemDialogOpen] = useState(false);
  
  // Division form state
  const [divSemesterId, setDivSemesterId] = useState('');
  const [divName, setDivName] = useState('');
  const [divNumStudents, setDivNumStudents] = useState('');
  const [editingDivId, setEditingDivId] = useState<number | null>(null);
  const [isDivDialogOpen, setIsDivDialogOpen] = useState(false);

  // Fetch departments
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const response = await api.departments.list();
      return response.success && response.data ? response.data : [];
    },
  });

  // Fetch semesters
  const { data: semesters, isLoading: semestersLoading } = useQuery({
    queryKey: ['semesters'],
    queryFn: async () => {
      const response = await api.semesters.list();
      return response.success && response.data ? response.data : [];
    },
  });

  // Fetch divisions
  const { data: divisions, isLoading: divisionsLoading } = useQuery({
    queryKey: ['divisions'],
    queryFn: async () => {
      const response = await api.divisions.list();
      return response.success && response.data ? response.data : [];
    },
  });

  // Create semester
  const createSemesterMutation = useMutation({
    mutationFn: api.semesters.create,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['semesters'] });
        queryClient.invalidateQueries({ queryKey: ['divisions'] });
        setSemDeptId('');
        setSemName('');
        setSemType('Odd');
        toast.success('Semester added successfully');
        setIsSemDialogOpen(false);
      } else {
        toast.error(response.error || 'Failed to add semester');
      }
    },
  });

  // Delete semester
  const deleteSemesterMutation = useMutation({
    mutationFn: api.semesters.delete,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['semesters'] });
        queryClient.invalidateQueries({ queryKey: ['divisions'] });
        toast.success('Semester deleted successfully');
      } else {
        toast.error(response.error || 'Failed to delete semester');
      }
    },
  });

  // Create division
  const createDivisionMutation = useMutation({
    mutationFn: api.divisions.create,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['divisions'] });
        setDivSemesterId('');
        setDivName('');
        setDivNumStudents('');
        toast.success('Division added successfully');
        setIsDivDialogOpen(false);
      } else {
        toast.error(response.error || 'Failed to add division');
      }
    },
  });

  // Delete division
  const deleteDivisionMutation = useMutation({
    mutationFn: api.divisions.delete,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['divisions'] });
        toast.success('Division deleted successfully');
      } else {
        toast.error(response.error || 'Failed to delete division');
      }
    },
  });

  const handleSemesterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (semDeptId && semName.trim()) {
      createSemesterMutation.mutate({
        dept_id: parseInt(semDeptId),
        name: semName.trim(),
        type: semType,
      });
    }
  };

  const handleDivisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (divSemesterId && divName.trim() && divNumStudents) {
      createDivisionMutation.mutate({
        semester_id: parseInt(divSemesterId),
        name: divName.trim(),
        num_students: parseInt(divNumStudents),
      });
    }
  };

  const handleDeleteSemester = (id: number) => {
    if (confirm('Are you sure you want to delete this semester? This will also delete all divisions.')) {
      deleteSemesterMutation.mutate(id);
    }
  };

  const handleDeleteDivision = (id: number) => {
    if (confirm('Are you sure you want to delete this division?')) {
      deleteDivisionMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Semesters & Divisions
          </CardTitle>
          <CardDescription>Manage semesters and student divisions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-transparent gap-2 p-0 h-auto mb-6">
              <TabsTrigger 
                value="semesters"
                className="py-3 data-[state=active]:from-primary data-[state=active]:to-primary/90"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Semesters</span>
              </TabsTrigger>
              <TabsTrigger 
                value="divisions"
                className="py-3 data-[state=active]:from-accent data-[state=active]:to-accent/90"
              >
                <Users className="w-4 h-4" />
                <span>Divisions</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="semesters" className="space-y-4">
              <Dialog open={isSemDialogOpen} onOpenChange={setIsSemDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Semester
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Semester</DialogTitle>
                    <DialogDescription>Create a new semester for a department</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSemesterSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label>Department</Label>
                        <Select value={semDeptId} onValueChange={setSemDeptId} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments?.map((dept: any) => (
                              <SelectItem key={dept.id} value={dept.id.toString()}>
                                {dept.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Semester Name</Label>
                        <Input
                          value={semName}
                          onChange={(e) => setSemName(e.target.value)}
                          placeholder="e.g., Semester 1"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Type</Label>
                        <Select value={semType} onValueChange={(v) => setSemType(v as 'Odd' | 'Even')} required>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Odd">Odd</SelectItem>
                            <SelectItem value="Even">Even</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsSemDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createSemesterMutation.isPending}>
                        {createSemesterMutation.isPending ? 'Adding...' : 'Add Semester'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {semestersLoading ? (
                <div className="text-center py-8">Loading semesters...</div>
              ) : !semesters || semesters.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No semesters found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {semesters.map((sem: any) => (
                      <TableRow key={sem.id}>
                        <TableCell>{sem.id}</TableCell>
                        <TableCell>{sem.dept_name}</TableCell>
                        <TableCell className="font-medium">{sem.name}</TableCell>
                        <TableCell>{sem.type}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteSemester(sem.id)}
                            disabled={deleteSemesterMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="divisions" className="space-y-4">
              <Dialog open={isDivDialogOpen} onOpenChange={setIsDivDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Division
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Division</DialogTitle>
                    <DialogDescription>Create a new division for a semester</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleDivisionSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label>Semester</Label>
                        <Select value={divSemesterId} onValueChange={setDivSemesterId} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Semester" />
                          </SelectTrigger>
                          <SelectContent>
                            {semesters?.map((sem: any) => (
                              <SelectItem key={sem.id} value={sem.id.toString()}>
                                {sem.dept_name} - {sem.name} ({sem.type})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Division Name</Label>
                        <Input
                          value={divName}
                          onChange={(e) => setDivName(e.target.value)}
                          placeholder="e.g., A, B, C"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Number of Students</Label>
                        <Input
                          type="number"
                          value={divNumStudents}
                          onChange={(e) => setDivNumStudents(e.target.value)}
                          placeholder="e.g., 60"
                          min="1"
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsDivDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createDivisionMutation.isPending}>
                        {createDivisionMutation.isPending ? 'Adding...' : 'Add Division'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {divisionsLoading ? (
                <div className="text-center py-8">Loading divisions...</div>
              ) : !divisions || divisions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No divisions found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {divisions.map((div: any) => (
                      <TableRow key={div.id}>
                        <TableCell>{div.id}</TableCell>
                        <TableCell>{div.dept_name}</TableCell>
                        <TableCell>{div.sem_name} ({div.type})</TableCell>
                        <TableCell className="font-medium">{div.name}</TableCell>
                        <TableCell>{div.num_students}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteDivision(div.id)}
                            disabled={deleteDivisionMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

