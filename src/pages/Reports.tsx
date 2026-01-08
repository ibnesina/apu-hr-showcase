import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardStats } from '@/lib/mockData';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  LineChart, Line, AreaChart, Area
} from 'recharts';

const COLORS = ['#8B1538', '#A91E47', '#C72756', '#E53065', '#FF4D7A', '#FF6B8A'];

const employeeGrowth = [
  { month: 'Jul', employees: 6 },
  { month: 'Aug', employees: 6 },
  { month: 'Sep', employees: 7 },
  { month: 'Oct', employees: 7 },
  { month: 'Nov', employees: 8 },
  { month: 'Dec', employees: 8 },
  { month: 'Jan', employees: 8 },
];

const leaveByDepartment = [
  { department: 'Computer Science', annual: 12, medical: 4, other: 2 },
  { department: 'Business', annual: 10, medical: 3, other: 1 },
  { department: 'Engineering', annual: 8, medical: 2, other: 1 },
  { department: 'Design', annual: 6, medical: 2, other: 0 },
  { department: 'Administration', annual: 5, medical: 2, other: 1 },
];

const attendanceByMonth = [
  { month: 'Aug', present: 92, absent: 5, leave: 3 },
  { month: 'Sep', present: 88, absent: 7, leave: 5 },
  { month: 'Oct', present: 95, absent: 3, leave: 2 },
  { month: 'Nov', present: 91, absent: 5, leave: 4 },
  { month: 'Dec', present: 87, absent: 8, leave: 5 },
  { month: 'Jan', present: 85, absent: 9, leave: 6 },
];

export default function Reports() {
  const stats = dashboardStats;

  return (
    <AppLayout>
      <div className="page-header">
        <h1 className="page-title">Reports & Analytics</h1>
        <p className="page-description">Visual insights into HR metrics and trends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Distribution by Department */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Employee Distribution by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.departmentDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {stats.departmentDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Employee Growth Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Employee Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={employeeGrowth}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 12]} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="employees" 
                    stroke="#8B1538" 
                    fill="#8B1538" 
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Attendance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceByMonth}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#22C55E" name="Present %" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="absent" fill="#EF4444" name="Absent %" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="leave" fill="#F59E0B" name="Leave %" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Leave Usage by Department */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Leave Usage by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leaveByDepartment} layout="vertical">
                  <XAxis type="number" axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="department" width={120} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="annual" fill="#8B1538" name="Annual" stackId="stack" />
                  <Bar dataKey="medical" fill="#C72756" name="Medical" stackId="stack" />
                  <Bar dataKey="other" fill="#FF6B8A" name="Other" stackId="stack" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Leave Usage Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Leave Usage Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.leaveUsage}>
                  <XAxis dataKey="type" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="used" fill="#8B1538" name="Used Days" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="total" fill="#E5E7EB" name="Total Available" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
