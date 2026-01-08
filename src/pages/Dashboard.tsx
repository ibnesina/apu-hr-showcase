import { Users, Calendar, ClipboardList, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLayout } from '@/components/layout/AppLayout';
import { dashboardStats } from '@/lib/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';

const COLORS = ['#8B1538', '#A91E47', '#C72756', '#E53065', '#FF4D7A', '#FF6B8A'];

export default function Dashboard() {
  const stats = dashboardStats;

  const kpiCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      subtitle: `${stats.activeEmployees} Active`,
      icon: Users,
      trend: '+2 this month',
      trendUp: true,
    },
    {
      title: 'Attendance Today',
      value: `${stats.attendanceToday}%`,
      subtitle: 'Present employees',
      icon: Calendar,
      trend: '-3% from yesterday',
      trendUp: false,
    },
    {
      title: 'Pending Leave',
      value: stats.pendingLeaveRequests,
      subtitle: 'Requests to review',
      icon: ClipboardList,
      trend: '2 urgent',
      trendUp: false,
    },
    {
      title: 'Payroll Status',
      value: stats.payrollStatus,
      subtitle: 'January 2024',
      icon: DollarSign,
      trend: '4 pending',
      trendUp: true,
    },
  ];

  return (
    <AppLayout>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">Welcome to APU HR Management System</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((card, index) => (
          <Card key={index} className="kpi-card">
            <CardContent className="p-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-3xl font-bold mt-1">{card.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{card.subtitle}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <card.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4 text-sm">
                {card.trendUp ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-amber-600" />
                )}
                <span className={card.trendUp ? 'text-green-600' : 'text-amber-600'}>
                  {card.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Employees by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.departmentDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
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

        {/* Monthly Attendance Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.monthlyAttendance}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis domain={[80, 100]} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="#8B1538" 
                    strokeWidth={3}
                    dot={{ fill: '#8B1538', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Usage Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Leave Usage Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.leaveUsage} layout="vertical">
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="type" axisLine={false} tickLine={false} width={80} />
                <Tooltip />
                <Bar dataKey="used" fill="#8B1538" radius={[0, 4, 4, 0]} name="Used" />
                <Bar dataKey="total" fill="#E5E7EB" radius={[0, 4, 4, 0]} name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
