import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Video, MapPin, CheckCircle, XCircle, Pause, FileText, Edit } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Application,
  Interview,
  getApplications,
  updateInterview,
} from '@/lib/recruitmentData';
import { addAuditLog } from '@/lib/storage';
import { toast } from 'sonner';

interface InterviewWithApp {
  interview: Interview;
  application: Application;
}

export default function Interviews() {
  const [allInterviews, setAllInterviews] = useState<InterviewWithApp[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<InterviewWithApp | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    notes: '',
    outcome: 'Pending' as Interview['outcome'],
  });

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = () => {
    const apps = getApplications();
    const interviews: InterviewWithApp[] = [];
    
    apps.forEach(app => {
      app.interviews.forEach(interview => {
        interviews.push({ interview, application: app });
      });
    });

    // Sort by date descending
    interviews.sort((a, b) => 
      new Date(b.interview.scheduledDate).getTime() - new Date(a.interview.scheduledDate).getTime()
    );

    setAllInterviews(interviews);
  };

  const handleOpenUpdate = (item: InterviewWithApp) => {
    setSelectedInterview(item);
    setUpdateForm({
      notes: item.interview.notes,
      outcome: item.interview.outcome,
    });
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateInterview = () => {
    if (!selectedInterview) return;

    updateInterview(
      selectedInterview.application.id,
      selectedInterview.interview.id,
      {
        notes: updateForm.notes,
        outcome: updateForm.outcome,
      }
    );

    addAuditLog('Updated', 'Interview', `Updated interview for ${selectedInterview.application.fullName}`);
    loadInterviews();
    setIsUpdateDialogOpen(false);
    toast.success('Interview updated');
  };

  const getOutcomeBadge = (outcome: Interview['outcome']) => {
    switch (outcome) {
      case 'Passed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Passed</Badge>;
      case 'Failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      case 'On Hold':
        return <Badge className="bg-yellow-100 text-yellow-800"><Pause className="w-3 h-3 mr-1" />On Hold</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  const isUpcoming = (date: string) => new Date(date) > new Date();
  const isPast = (date: string) => new Date(date) < new Date();

  const upcomingInterviews = allInterviews.filter(i => isUpcoming(i.interview.scheduledDate));
  const pastInterviews = allInterviews.filter(i => isPast(i.interview.scheduledDate));

  const InterviewCard = ({ item }: { item: InterviewWithApp }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium">{item.application.fullName}</h3>
              {getOutcomeBadge(item.interview.outcome)}
            </div>
            <p className="text-sm text-muted-foreground mb-3">{item.application.jobTitle}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{new Date(item.interview.scheduledDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{new Date(item.interview.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.interview.interviewType === 'Online' ? (
                  <Video className="w-4 h-4 text-blue-600" />
                ) : (
                  <MapPin className="w-4 h-4 text-green-600" />
                )}
                <span>{item.interview.interviewType}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>{item.interview.panelMembers.length} panel members</span>
              </div>
            </div>

            {item.interview.notes && (
              <div className="mt-3 p-2 bg-muted/50 rounded text-sm">
                <FileText className="w-4 h-4 inline mr-1 text-muted-foreground" />
                {item.interview.notes}
              </div>
            )}

            <div className="mt-3 text-xs text-muted-foreground">
              Panel: {item.interview.panelMembers.join(', ')}
            </div>
          </div>
          <Button size="sm" variant="ghost" onClick={() => handleOpenUpdate(item)}>
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AppLayout>
      <div className="page-header">
        <h1 className="page-title">Interviews</h1>
        <p className="page-description">Manage and track candidate interviews</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{allInterviews.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{upcomingInterviews.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Passed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {allInterviews.filter(i => i.interview.outcome === 'Passed').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Outcome</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">
              {allInterviews.filter(i => i.interview.outcome === 'Pending').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Interviews Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingInterviews.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastInterviews.length})</TabsTrigger>
          <TabsTrigger value="all">All ({allInterviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <div className="grid gap-4">
            {upcomingInterviews.map((item) => (
              <InterviewCard key={item.interview.id} item={item} />
            ))}
            {upcomingInterviews.length === 0 && (
              <Card className="text-center py-8">
                <CardContent>
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Upcoming Interviews</h3>
                  <p className="text-muted-foreground">
                    Schedule interviews from the Applications page.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="past">
          <div className="grid gap-4">
            {pastInterviews.map((item) => (
              <InterviewCard key={item.interview.id} item={item} />
            ))}
            {pastInterviews.length === 0 && (
              <Card className="text-center py-8">
                <CardContent>
                  <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No past interviews found.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="all">
          <div className="grid gap-4">
            {allInterviews.map((item) => (
              <InterviewCard key={item.interview.id} item={item} />
            ))}
            {allInterviews.length === 0 && (
              <Card className="text-center py-8">
                <CardContent>
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No interviews found.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Update Interview Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Interview</DialogTitle>
            {selectedInterview && (
              <p className="text-sm text-muted-foreground">
                {selectedInterview.application.fullName} - {selectedInterview.application.jobTitle}
              </p>
            )}
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Interview Outcome</Label>
              <Select 
                value={updateForm.outcome} 
                onValueChange={(v: Interview['outcome']) => setUpdateForm({ ...updateForm, outcome: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Passed">Passed</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Interview Notes</Label>
              <Textarea
                value={updateForm.notes}
                onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                placeholder="Add interview notes, observations, recommendations..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateInterview}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
