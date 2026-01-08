import { useState, useEffect } from 'react';
import { DollarSign, Download, Check, FileText } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PayrollRecord } from '@/lib/mockData';
import { getPayrollRecords, processPayroll } from '@/lib/storage';
import { toast } from 'sonner';

export default function Payroll() {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollRecord | null>(null);

  useEffect(() => {
    setPayrollRecords(getPayrollRecords());
  }, []);

  const handleProcess = (id: string) => {
    processPayroll(id);
    setPayrollRecords(getPayrollRecords());
    toast.success('Payroll processed successfully');
  };

  const handleProcessAll = () => {
    const pending = payrollRecords.filter(r => r.status === 'Pending');
    pending.forEach(r => processPayroll(r.id));
    setPayrollRecords(getPayrollRecords());
    toast.success(`${pending.length} payroll records processed`);
  };

  const handleDownloadPayslip = (record: PayrollRecord) => {
    toast.success(`Downloading payslip for ${record.employeeName}...`);
  };

  const totalPayroll = payrollRecords.reduce((sum, r) => sum + r.netSalary, 0);
  const pendingCount = payrollRecords.filter(r => r.status === 'Pending').length;
  const processedCount = payrollRecords.filter(r => r.status === 'Processed').length;

  return (
    <AppLayout>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Payroll Management</h1>
          <p className="page-description">Process and manage employee payroll</p>
        </div>
        <Button onClick={handleProcessAll} disabled={pendingCount === 0}>
          <Check className="w-4 h-4 mr-2" />
          Process All Pending
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Payroll</p>
                <p className="text-2xl font-bold">RM {totalPayroll.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Processed</p>
                <p className="text-2xl font-bold">{processedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Table */}
      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="text-right">Basic Salary</TableHead>
              <TableHead className="text-right">Allowances</TableHead>
              <TableHead className="text-right">Deductions</TableHead>
              <TableHead className="text-right">Net Salary</TableHead>
              <TableHead>Month</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payrollRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.employeeName}</TableCell>
                <TableCell>{record.department}</TableCell>
                <TableCell className="text-right">RM {record.basicSalary.toLocaleString()}</TableCell>
                <TableCell className="text-right text-green-600">+RM {record.allowances.toLocaleString()}</TableCell>
                <TableCell className="text-right text-red-600">-RM {record.deductions.toLocaleString()}</TableCell>
                <TableCell className="text-right font-semibold">RM {record.netSalary.toLocaleString()}</TableCell>
                <TableCell>{record.month}</TableCell>
                <TableCell>
                  <span className={`status-badge ${record.status === 'Processed' ? 'status-approved' : 'status-pending'}`}>
                    {record.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {record.status === 'Pending' ? (
                      <Button size="sm" onClick={() => handleProcess(record.id)}>
                        Process
                      </Button>
                    ) : (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedPayslip(record)}>
                          View Payslip
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDownloadPayslip(record)}>
                          <Download className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Payslip Preview Dialog */}
      <Dialog open={!!selectedPayslip} onOpenChange={() => setSelectedPayslip(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Payslip Preview</DialogTitle>
          </DialogHeader>
          {selectedPayslip && (
            <div className="space-y-6">
              <div className="text-center border-b pb-4">
                <h3 className="font-bold text-lg text-primary">ASIA PACIFIC UNIVERSITY</h3>
                <p className="text-sm text-muted-foreground">Payslip for {selectedPayslip.month}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Employee Name</span>
                  <span className="font-medium">{selectedPayslip.employeeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Department</span>
                  <span>{selectedPayslip.department}</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Basic Salary</span>
                  <span>RM {selectedPayslip.basicSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Allowances</span>
                  <span>+RM {selectedPayslip.allowances.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Deductions</span>
                  <span>-RM {selectedPayslip.deductions.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Net Salary</span>
                  <span className="text-primary">RM {selectedPayslip.netSalary.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1" onClick={() => handleDownloadPayslip(selectedPayslip)}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" onClick={() => setSelectedPayslip(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
