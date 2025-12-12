import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Building2, Plus, Trash2, Edit2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function Departments() {
  const queryClient = useQueryClient();
  const [deptName, setDeptName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch departments
  const { data, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const response = await api.departments.list();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || 'Failed to fetch departments');
    },
  });

  // Create department
  const createMutation = useMutation({
    mutationFn: api.departments.create,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['departments'] });
        setDeptName('');
        toast.success('Department added successfully');
        setIsDialogOpen(false);
      } else {
        toast.error(response.error || 'Failed to add department');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add department');
    },
  });

  // Update department
  const updateMutation = useMutation({
    mutationFn: api.departments.update,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['departments'] });
        setEditingId(null);
        setEditName('');
        toast.success('Department updated successfully');
      } else {
        toast.error(response.error || 'Failed to update department');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update department');
    },
  });

  // Delete department
  const deleteMutation = useMutation({
    mutationFn: api.departments.delete,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['departments'] });
        toast.success('Department deleted successfully');
      } else {
        toast.error(response.error || 'Failed to delete department');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete department');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (deptName.trim()) {
      createMutation.mutate({ name: deptName.trim() });
    }
  };

  const handleEdit = (dept: any) => {
    setEditingId(dept.id);
    setEditName(dept.name);
  };

  const handleUpdate = () => {
    if (editingId && editName.trim()) {
      updateMutation.mutate({ id: editingId, name: editName.trim() });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this department?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Departments
            </CardTitle>
            <CardDescription>Manage academic departments</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Department</DialogTitle>
                <DialogDescription>Enter the name of the new department</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Input
                      value={deptName}
                      onChange={(e) => setDeptName(e.target.value)}
                      placeholder="Department Name"
                      required
                      autoFocus
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? 'Adding...' : 'Add Department'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading departments...</div>
        ) : !data || data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No departments found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((dept: any) => (
                <TableRow key={dept.id}>
                  {editingId === dept.id ? (
                    <>
                      <TableCell>{dept.id}</TableCell>
                      <TableCell>
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full"
                          autoFocus
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingId(null);
                              setEditName('');
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
                      <TableCell>{dept.id}</TableCell>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(dept)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(dept.id)}
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

