import { useState, useEffect } from 'react';
import { Briefcase, MapPin, Clock, GraduationCap, Send, CheckCircle, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  JobOpening,
  getPublishedJobs,
  addApplication,
} from '@/lib/recruitmentData';
import { toast } from 'sonner';

export default function Careers() {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    education: '',
    experience: '',
    resumeFileName: '',
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = () => {
    setJobs(getPublishedJobs());
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      education: '',
      experience: '',
      resumeFileName: '',
    });
  };

  const handleApply = (job: JobOpening) => {
    setSelectedJob(job);
    setIsApplyDialogOpen(true);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!selectedJob) return;

    addApplication({
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      education: formData.education,
      experience: formData.experience,
      resumeFileName: formData.resumeFileName || 'resume.pdf',
    });

    setIsApplyDialogOpen(false);
    setIsSuccessDialogOpen(true);
    resetForm();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, resumeFileName: file.name });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <img src="/apu_logo.png" alt="APU Logo" className="w-12 h-12 object-contain bg-white rounded p-1" />
            <div>
              <h1 className="text-2xl font-bold">Asia Pacific University</h1>
              <p className="text-primary-foreground/80">Career Opportunities</p>
            </div>
          </div>
          <p className="text-lg max-w-2xl">
            Join our team of dedicated professionals and make a difference in education. 
            Explore exciting career opportunities at APU.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Open Positions ({jobs.length})</h2>
          <p className="text-muted-foreground">Find your next career opportunity at Asia Pacific University</p>
        </div>

        {/* Job Listings */}
        <div className="grid gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.experienceLevel}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge variant={job.employmentType === 'Academic' ? 'default' : 'secondary'}>
                    {job.employmentType === 'Academic' ? (
                      <><GraduationCap className="w-3 h-3 mr-1" />Academic</>
                    ) : (
                      <><Briefcase className="w-3 h-3 mr-1" />Non-Academic</>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Qualifications:</span>
                    <p className="text-sm text-muted-foreground">{job.qualifications}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center border-t pt-4">
                <span className="text-xs text-muted-foreground">Posted: {job.publishedAt}</span>
                <Button onClick={() => handleApply(job)}>
                  <Send className="w-4 h-4 mr-2" />Apply Now
                </Button>
              </CardFooter>
            </Card>
          ))}

          {jobs.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Open Positions</h3>
                <p className="text-muted-foreground">
                  There are currently no open positions. Please check back later.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Application Dialog */}
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Apply for Position</DialogTitle>
            {selectedJob && (
              <p className="text-sm text-muted-foreground">{selectedJob.title}</p>
            )}
          </DialogHeader>
          <form onSubmit={handleSubmitApplication} className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Phone *</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+60 12-345 6789"
                required
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Education Background</Label>
              <Textarea
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                placeholder="e.g., PhD Computer Science - University of Melbourne (2020)"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Work Experience</Label>
              <Textarea
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="e.g., 5 years as Senior Lecturer at University X"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Resume / CV</Label>
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground">Accepted formats: PDF, DOC, DOCX</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsApplyDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Send className="w-4 h-4 mr-2" />Submit Application
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="text-center">
          <div className="py-6">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Application Submitted!</h2>
            <p className="text-muted-foreground mb-4">
              Thank you for your interest in joining Asia Pacific University. 
              Your application has been received and is being reviewed.
            </p>
            <p className="text-sm text-muted-foreground">
              Application Status: <Badge>Applied</Badge>
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsSuccessDialogOpen(false)} className="w-full">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-muted py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Asia Pacific University. All rights reserved.</p>
          <p className="mt-1">For inquiries, contact: hr@apu.edu.my</p>
        </div>
      </footer>
    </div>
  );
}
