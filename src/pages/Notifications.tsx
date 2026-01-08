import { useState } from 'react';
import { Bell, Check, CheckCheck, Info, AlertTriangle, Calendar, DollarSign, Users } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: 'leave' | 'payroll' | 'employee';
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    title: 'New Leave Request',
    message: 'Dr. Ahmad Razali has requested 3 days of annual leave.',
    time: '2 hours ago',
    read: false,
    icon: 'leave',
  },
  {
    id: '2',
    type: 'success',
    title: 'Payroll Processed',
    message: 'January 2024 payroll has been successfully processed for 3 employees.',
    time: '5 hours ago',
    read: false,
    icon: 'payroll',
  },
  {
    id: '3',
    type: 'info',
    title: 'New Employee Onboarded',
    message: 'Mr. Lee Wei Ming has been successfully added to the system.',
    time: '1 day ago',
    read: true,
    icon: 'employee',
  },
  {
    id: '4',
    type: 'warning',
    title: 'Pending Leave Request',
    message: 'Ms. Priya Sharma has requested 6 days of annual leave.',
    time: '2 days ago',
    read: true,
    icon: 'leave',
  },
  {
    id: '5',
    type: 'success',
    title: 'Leave Approved',
    message: 'Mr. Lee Wei Ming\'s medical leave has been approved.',
    time: '3 days ago',
    read: true,
    icon: 'leave',
  },
];

const iconMap = {
  leave: Calendar,
  payroll: DollarSign,
  employee: Users,
};

const typeStyles = {
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  success: 'bg-green-50 border-green-200 text-green-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
};

const iconStyles = {
  info: 'bg-blue-100 text-blue-600',
  success: 'bg-green-100 text-green-600',
  warning: 'bg-yellow-100 text-yellow-600',
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppLayout>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-description">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
          <CheckCheck className="w-4 h-4 mr-2" />
          Mark All as Read
        </Button>
      </div>

      <div className="space-y-4 max-w-3xl">
        {notifications.map((notification) => {
          const IconComponent = iconMap[notification.icon];
          return (
            <Card
              key={notification.id}
              className={`transition-all ${!notification.read ? 'border-l-4 border-l-primary shadow-md' : 'opacity-75'}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconStyles[notification.type]}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{notification.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      </div>
                      {!notification.read && (
                        <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {notifications.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg">No Notifications</h3>
              <p className="text-muted-foreground">You're all caught up!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
