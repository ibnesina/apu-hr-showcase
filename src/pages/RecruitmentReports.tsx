import { useState, useEffect } from 'react';
import { BarChart3, Briefcase, Users, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { getRecruitmentStats } from '@/lib/recruitmentData';

const COLORS = ['#3b82f6', '#22c55e', '#a855f7', '#f97316', '#ef4444'];

export default function RecruitmentReports() {
  const [stats, setStats] = useState<ReturnType<typeof getRecruitmentStats> | null>(null);

  useEffect(() => {
    setStats(getRecruitmentStats());
  }, []);

  if (!stats) return null;

  const statusChartData = [
    { name: 'Applied', value: stats.statusCounts.applied, color: '#3b82f6' },
    { name: 'Shortlisted', value: stats.statusCounts.shortlisted, color: '#22c55e' },
    { name: 'Interviewed', value: stats.statusCounts.interviewed, color: '#a855f7' },
    { name: 'Offered', value: stats.statusCounts.offered, color: '#f97316' },
    { name: 'Rejected', value: stats.statusCounts.rejected, color: '#ef4444' },
  ];

  const jobApplicationsData = stats.jobStats
    .filter(j => j.status === 'Published')
    .map(j => ({
      name: j.title.length > 25 ? j.title.substring(0, 25) + '...' : j.title,
      applications: j.applicationCount,
    }));

  const conversionRate = stats.totalApplications > 0 
    ? Math.round((stats.statusCounts.offered / stats.totalApplications) * 100) 
    : 0;

  return (
    <AppLayout>
      <div className="page-header">
        <h1 className="page-title">Recruitment Reports</h1>
        <p className="page-description">Analytics and insights for recruitment activities</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{stats.openPositions}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-2xl font-bold">{stats.totalApplications}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Offers Extended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{stats.statusCounts.offered}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">{conversionRate}%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Time to Hire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span className="text-2xl font-bold">{stats.avgTimeToHire}</span>
              <span className="text-sm text-muted-foreground">days</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Application Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Application Status Distribution</CardTitle>
            <CardDescription>Breakdown of applications by pipeline stage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {statusChartData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Applications per Position */}
        <Card>
          <CardHeader>
            <CardTitle>Applications per Position</CardTitle>
            <CardDescription>Number of applications received for each open position</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jobApplicationsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="applications" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Funnel */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Recruitment Funnel</CardTitle>
          <CardDescription>Candidate progression through the hiring pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statusChartData.filter(s => s.name !== 'Rejected').map((stage, index) => {
              const percentage = stats.totalApplications > 0 
                ? Math.round((stage.value / stats.totalApplications) * 100)
                : 0;
              return (
                <div key={stage.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />
                      <span className="font-medium">{stage.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">{stage.value}</span>
                      <span className="text-muted-foreground ml-2">({percentage}%)</span>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-3" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Job-wise Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Position-wise Application Summary</CardTitle>
          <CardDescription>Detailed breakdown of applications by position</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Applications</TableHead>
                <TableHead className="text-center">Fill Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.jobStats.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>
                    <Badge variant={job.status === 'Published' ? 'default' : 'secondary'}>
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{job.applicationCount}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Progress value={job.applicationCount * 10} className="w-20 h-2" />
                      <span className="text-sm text-muted-foreground">{Math.min(job.applicationCount * 10, 100)}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* System Generated Label */}
      <div className="mt-6 text-center">
        <Badge variant="outline" className="text-xs">
          <BarChart3 className="w-3 h-3 mr-1" />
          SYSTEM GENERATED REPORT
        </Badge>
        <p className="text-xs text-muted-foreground mt-2">
          Data sourced from session-based recruitment records. For demonstration purposes only.
        </p>
      </div>
    </AppLayout>
  );
}
