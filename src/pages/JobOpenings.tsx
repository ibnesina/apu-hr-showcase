import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Briefcase, Users, GraduationCap } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  JobOpening,
  getJobOpenings,
  addJobOpening,
  updateJobOpening,
  deleteJobOpening,
  getApplicationsByJob,
} from '@/lib/recruitmentData';
import { addAuditLog } from '@/lib/storage';
import { toast } from 'sonner';

const DEPARTMENTS = [
  'School of Computing',
  'School of Business',
  'School of Engineering',
  'School of Media Arts & Design',
  'IT Services',
  'Human Resources',
  'Finance',
  'Student Services',
  'Library',
  'Facilities Management',
];

export default function JobOpenings() {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobOpening | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    employmentType: 'Academic' as 'Academic' | 'Non-Academic',
    qualifications: '',
    experienceLevel: '',
    description: '',
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = () => {
    setJobs(getJobOpenings());
  };

  const resetForm = () => {
    setFormData({
      title: '',
      department: '',
      employmentType: 'Academic',
      qualifications: '',
      experienceLevel: '',
      description: '',
    });
    setEditingJob(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.department) {
      toast.error('Please fill in required fields');
      return;
    }

    if (editingJob) {
      updateJobOpening(editingJob.id, formData);
      addAuditLog('Updated', 'Job Opening', `Updated job: ${formData.title}`);
      toast.success('Job opening updated');
    } else {
      addJobOpening({
        ...formData,
        status: 'Draft',
        createdBy: 'HR Admin',
      });
      addAuditLog('Created', 'Job Opening', `Created job: ${formData.title}`);
      toast.success('Job opening created');
    }

    loadJobs();
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (job: JobOpening) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      employmentType: job.employmentType,
      qualifications: job.qualifications,
      experienceLevel: job.experienceLevel,
      description: job.description,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (job: JobOpening) => {
    if (window.confirm(`Delete job opening: ${job.title}?`)) {
      deleteJobOpening(job.id);
      addAuditLog('Deleted', 'Job Opening', `Deleted job: ${job.title}`);
      loadJobs();
      toast.success('Job opening deleted');
    }
  };

  const handlePublish = (job: JobOpening) => {
    updateJobOpening(job.id, { 
      status: 'Published',
      publishedAt: new Date().toISOString().split('T')[0],
    });
    addAuditLog('Published', 'Job Opening', `Published job: ${job.title}`);
    loadJobs();
    toast.success('Job published successfully');
  };

  const handleUnpublish = (job: JobOpening) => {
    updateJobOpening(job.id, { status: 'Draft' });
    addAuditLog('Unpublished', 'Job Opening', `Unpublished job: ${job.title}`);
    loadJobs();
    toast.success('Job unpublished');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Published':
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case 'Draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'Closed':
        return <Badge variant="outline">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const publishedCount = jobs.filter(j => j.status === 'Published').length;
  const draftCount = jobs.filter(j => j.status === 'Draft').length;
  const academicCount = jobs.filter(j => j.employmentType === 'Academic').length;

  return (
    <AppLayout>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Job Openings</h1>
          <p className="page-description">Manage job requisitions and postings</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Create Job</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingJob ? 'Edit Job Opening' : 'Create Job Opening'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>Job Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Senior Lecturer - Computer Science"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Department *</Label>
                  <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Employment Type</Label>
                  <Select value={formData.employmentType} onValueChange={(v: 'Academic' | 'Non-Academic') => setFormData({ ...formData, employmentType: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Academic">Academic</SelectItem>
                      <SelectItem value="Non-Academic">Non-Academic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Experience Level</Label>
                  <Input
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                    placeholder="e.g., 5+ years"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Qualifications</Label>
                  <Textarea
                    value={formData.qualifications}
                    onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                    placeholder="Required qualifications..."
                    rows={3}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Job Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Job responsibilities and requirements..."
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button type="submit">{editingJob ? 'Update' : 'Create'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{jobs.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{publishedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{draftCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Academic Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <span className="text-2xl font-bold">{academicCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Job Openings</CardTitle>
          <CardDescription>Manage and publish job requisitions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => {
                const appCount = getApplicationsByJob(job.id).length;
                return (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.department}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {job.employmentType === 'Academic' ? (
                          <><GraduationCap className="w-3 h-3 mr-1" />Academic</>
                        ) : (
                          <><Briefcase className="w-3 h-3 mr-1" />Non-Academic</>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{appCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                    <TableCell>{job.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {job.status === 'Draft' && (
                          <Button size="sm" variant="outline" onClick={() => handlePublish(job)}>
                            <Eye className="w-4 h-4 mr-1" />Publish
                          </Button>
                        )}
                        {job.status === 'Published' && (
                          <Button size="sm" variant="outline" onClick={() => handleUnpublish(job)}>
                            <EyeOff className="w-4 h-4 mr-1" />Unpublish
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(job)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(job)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {jobs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No job openings found. Create one to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
