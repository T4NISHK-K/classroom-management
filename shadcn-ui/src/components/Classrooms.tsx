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
import { toast } from 'sonner';
import { Building, Plus, Trash2, Edit2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function Classrooms() {
  const queryClient = useQueryClient();
  const [roomNumber, setRoomNumber] = useState('');
  const [deptId, setDeptId] = useState('');
  const [type, setType] = useState<'Classroom' | 'Lab'>('Classroom');
  const [capacity, setCapacity] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch departments
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const response = await api.departments.list();
      return response.success && response.data ? response.data : [];
    },
  });

  // Fetch classrooms
  const { data: classrooms, isLoading } = useQuery({
    queryKey: ['classrooms'],
    queryFn: async () => {
      const response = await api.classrooms.list();
      return response.success && response.data ? response.data : [];
    },
  });

  // Create classroom
  const createMutation = useMutation({
    mutationFn: api.classrooms.create,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['classrooms'] });
        setRoomNumber('');
        setDeptId('');
        setType('Classroom');
        setCapacity('');
        toast.success('Classroom added successfully');
        setIsDialogOpen(false);
      } else {
        toast.error(response.error || 'Failed to add classroom');
      }
    },
  });

  // Update classroom
  const updateMutation = useMutation({
    mutationFn: api.classrooms.update,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['classrooms'] });
        setEditingId(null);
        toast.success('Classroom updated successfully');
      } else {
        toast.error(response.error || 'Failed to update classroom');
      }
    },
  });

  // Delete classroom
  const deleteMutation = useMutation({
    mutationFn: api.classrooms.delete,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['classrooms'] });
        toast.success('Classroom deleted successfully');
      } else {
        toast.error(response.error || 'Failed to delete classroom');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomNumber.trim() && deptId && capacity) {
      createMutation.mutate({
        room_number: roomNumber.trim(),
        dept_id: parseInt(deptId),
        type: type,
        capacity: parseInt(capacity),
      });
    }
  };

  const handleEdit = (classroom: any) => {
    setEditingId(classroom.id);
    setRoomNumber(classroom.room_number);
    setDeptId(classroom.dept_id.toString());
    setType(classroom.type);
    setCapacity(classroom.capacity.toString());
  };

  const handleUpdate = () => {
    if (editingId && roomNumber.trim() && deptId && capacity) {
      updateMutation.mutate({
        id: editingId,
        room_number: roomNumber.trim(),
        dept_id: parseInt(deptId),
        type: type,
        capacity: parseInt(capacity),
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this classroom?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Classrooms & Labs
            </CardTitle>
            <CardDescription>Manage classrooms and laboratory facilities</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Classroom/Lab
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Classroom / Lab</DialogTitle>
                <DialogDescription>Enter the details of the new classroom or lab</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Room Number</Label>
                    <Input
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      placeholder="e.g., 101, Lab-A"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Department</Label>
                    <Select value={deptId} onValueChange={setDeptId} required>
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
                    <Label>Type</Label>
                    <Select value={type} onValueChange={(v) => setType(v as 'Classroom' | 'Lab')} required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Classroom">Classroom</SelectItem>
                        <SelectItem value="Lab">Lab</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Capacity</Label>
                    <Input
                      type="number"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      placeholder="e.g., 60"
                      min="1"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? 'Adding...' : 'Add Classroom'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading classrooms...</div>
        ) : !classrooms || classrooms.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No classrooms found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Room Number</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classrooms.map((classroom: any) => (
                <TableRow key={classroom.id}>
                  {editingId === classroom.id ? (
                    <>
                      <TableCell>{classroom.id}</TableCell>
                      <TableCell>
                        <Input
                          value={roomNumber}
                          onChange={(e) => setRoomNumber(e.target.value)}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Select value={deptId} onValueChange={setDeptId}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {departments?.map((dept: any) => (
                              <SelectItem key={dept.id} value={dept.id.toString()}>
                                {dept.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select value={type} onValueChange={(v) => setType(v as 'Classroom' | 'Lab')}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Classroom">Classroom</SelectItem>
                            <SelectItem value="Lab">Lab</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={capacity}
                          onChange={(e) => setCapacity(e.target.value)}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingId(null);
                              setRoomNumber('');
                              setDeptId('');
                              setCapacity('');
                            }}
                          >
                            Cancel
                          </Button>
                          <Button size="sm" onClick={handleUpdate} disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? 'Saving...' : 'Save'}
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{classroom.id}</TableCell>
                      <TableCell className="font-medium">{classroom.room_number}</TableCell>
                      <TableCell>{classroom.dept_name}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          classroom.type === 'Lab' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {classroom.type}
                        </span>
                      </TableCell>
                      <TableCell>{classroom.capacity}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(classroom)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(classroom.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

