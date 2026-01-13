import { useState, useEffect } from 'react';
import { Download, Filter, BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { 
  Appraisal, 
  AppraisalCycle,
  getAppraisals, 
  getAppraisalCycles,
} from '@/lib/appraisalData';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];

export default function AppraisalReports() {
  const [appraisals, setAppraisals] = useState<Appraisal[]>([]);
  const [cycles, setCycles] = useState<AppraisalCycle[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  useEffect(() => {
    setAppraisals(getAppraisals());
    setCycles(getAppraisalCycles());
  }, []);

  // Filter appraisals
  const filteredAppraisals = appraisals.filter(a => {
    if (a.status !== 'Completed') return false;
    if (selectedCycle !== 'all' && a.cycleId !== selectedCycle) return false;
    if (selectedCategory !== 'all' && a.performanceCategory !== selectedCategory) return false;
    if (selectedDepartment !== 'all' && a.department !== selectedDepartment) return false;
    return true;
  });

  // Statistics
  const completedCount = appraisals.filter(a => a.status === 'Completed').length;
  const excellentCount = appraisals.filter(a => a.performanceCategory === 'Excellent').length;
  const goodCount = appraisals.filter(a => a.performanceCategory === 'Good').length;
  const needsImprovementCount = appraisals.filter(a => a.performanceCategory === 'Needs Improvement').length;

  const avgScore = filteredAppraisals.length > 0
    ? filteredAppraisals.reduce((sum, a) => sum + (a.finalScore || 0), 0) / filteredAppraisals.length
    : 0;

  // Chart data
  const categoryData = [
    { name: 'Excellent', value: excellentCount, color: '#22c55e' },
    { name: 'Good', value: goodCount, color: '#3b82f6' },
    { name: 'Needs Improvement', value: needsImprovementCount, color: '#f59e0b' },
  ].filter(d => d.value > 0);

  const departments = [...new Set(appraisals.map(a => a.department))];
  const departmentData = departments.map(dept => {
    const deptAppraisals = appraisals.filter(a => a.department === dept && a.status === 'Completed');
    const avgScore = deptAppraisals.length > 0
      ? deptAppraisals.reduce((sum, a) => sum + (a.finalScore || 0), 0) / deptAppraisals.length
      : 0;
    return { department: dept, score: Math.round(avgScore * 10) / 10 };
  });

  // Attendance contribution data
  const attendanceData = filteredAppraisals.map(a => ({
    name: a.employeeName.split(' ').slice(-1)[0],
    attendance: a.attendanceSummary?.attendancePercentage || 0,
    score: a.finalScore || 0,
  }));

  const getCategoryBadge = (category?: string) => {
    switch (category) {
      case 'Excellent':
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
      case 'Good':
        return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
      case 'Needs Improvement':
        return <Badge className="bg-yellow-100 text-yellow-800">Needs Improvement</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Appraisal Reports</h1>
          <p className="page-description">View appraisal summaries and performance analytics</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            <Select value={selectedCycle} onValueChange={setSelectedCycle}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Cycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cycles</SelectItem>
                {cycles.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Performance Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Excellent">Excellent</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Needs Improvement">Needs Improvement</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(d => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Appraisals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{completedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{avgScore.toFixed(1)}/10</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Excellent Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{excellentCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Needs Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{needsImprovementCount}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList>
          <TabsTrigger value="summary">Summary Table</TabsTrigger>
          <TabsTrigger value="charts">Analytics</TabsTrigger>
          <TabsTrigger value="attendance">Attendance Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <div className="table-container">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Cycle</TableHead>
                  <TableHead>Final Score</TableHead>
                  <TableHead>Attendance %</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppraisals.map((appraisal) => (
                  <TableRow key={appraisal.id}>
                    <TableCell className="font-medium">{appraisal.employeeName}</TableCell>
                    <TableCell>{appraisal.department}</TableCell>
                    <TableCell>{appraisal.cycleName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={(appraisal.finalScore || 0) * 10} className="w-16 h-2" />
                        <span className="font-bold">{appraisal.finalScore?.toFixed(1)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={
                        (appraisal.attendanceSummary?.attendancePercentage || 0) >= 90 
                          ? 'text-green-600' 
                          : (appraisal.attendanceSummary?.attendancePercentage || 0) >= 80 
                            ? 'text-yellow-600' 
                            : 'text-red-600'
                      }>
                        {appraisal.attendanceSummary?.attendancePercentage || '-'}%
                      </span>
                    </TableCell>
                    <TableCell>{getCategoryBadge(appraisal.performanceCategory)}</TableCell>
                    <TableCell>{appraisal.completedAt?.split('T')[0]}</TableCell>
                  </TableRow>
                ))}
                {filteredAppraisals.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No completed appraisals match the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="charts">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5" />
                  Performance Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Department Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {departmentData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={departmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#3b82f6" name="Avg Score" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Attendance Contribution to Performance
              </CardTitle>
              <CardDescription>
                Correlation between attendance rates and final appraisal scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {attendanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" domain={[0, 100]} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="attendance" fill="#22c55e" name="Attendance %" />
                    <Bar yAxisId="right" dataKey="score" fill="#3b82f6" name="Final Score" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  No completed appraisals to display attendance impact.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Attendance Impact Summary</CardTitle>
              <CardDescription>
                <Badge variant="secondary" className="text-xs">AI-ASSISTED Analysis (Demo)</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold text-green-700">High Attendance (≥95%)</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Employees with excellent attendance typically achieve 15-20% higher appraisal scores due to consistent presence and reliability.
                  </p>
                </div>
                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold text-yellow-700">Moderate Attendance (80-94%)</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Moderate attendance may indicate work-life balance considerations. Performance impact is neutral with other factors compensating.
                  </p>
                </div>
                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold text-red-700">Low Attendance (&lt;80%)</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Low attendance significantly impacts performance evaluation. Recommended for attendance improvement program.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
