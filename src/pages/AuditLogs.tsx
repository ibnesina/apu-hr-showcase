import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AuditLog } from '@/lib/mockData';
import { getAuditLogs } from '@/lib/storage';

const actionColors: Record<string, string> = {
  Created: 'bg-green-100 text-green-800',
  Updated: 'bg-blue-100 text-blue-800',
  Deleted: 'bg-red-100 text-red-800',
};

const modules = ['All', 'Employee', 'Leave Request', 'Document', 'Payroll'];

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');

  useEffect(() => {
    setLogs(getAuditLogs());
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.module.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase());
    
    const matchesModule = moduleFilter === 'All' || log.module === moduleFilter;
    
    return matchesSearch && matchesModule;
  });

  return (
    <AppLayout>
      <div className="page-header">
        <h1 className="page-title">Audit Logs</h1>
        <p className="page-description">Track all system activities and changes</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={moduleFilter} onValueChange={setModuleFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by module" />
          </SelectTrigger>
          <SelectContent>
            {modules.map((module) => (
              <SelectItem key={module} value={module}>{module}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Logs Table */}
      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Module</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                  {log.timestamp}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={actionColors[log.action]}>
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell>{log.module}</TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell className="max-w-md truncate">{log.details}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No audit logs found matching your criteria.
        </div>
      )}
    </AppLayout>
  );
}
