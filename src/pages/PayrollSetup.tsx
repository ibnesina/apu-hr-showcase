import { useState, useEffect } from 'react';
import { Save, DollarSign } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Employee, PayrollSetup } from '@/lib/mockData';
import { getEmployees, getPayrollSetup, updatePayrollSetup } from '@/lib/storage';
import { toast } from 'sonner';

export default function PayrollSetupPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrollSetup, setPayrollSetup] = useState<PayrollSetup[]>([]);
  const [editedSetup, setEditedSetup] = useState<Record<string, PayrollSetup>>({});

  useEffect(() => {
    setEmployees(getEmployees().filter(e => e.status === 'Active'));
    setPayrollSetup(getPayrollSetup());
  }, []);

  const getSetupForEmployee = (employeeId: string): PayrollSetup => {
    return editedSetup[employeeId] || payrollSetup.find(s => s.employeeId === employeeId) || {
      employeeId, baseSalary: 0, perDayRate: 0, allowance: 0
    };
  };

  const handleChange = (employeeId: string, field: keyof PayrollSetup, value: number) => {
    setEditedSetup(prev => ({
      ...prev,
      [employeeId]: { ...getSetupForEmployee(employeeId), [field]: value }
    }));
  };

  const handleSave = (employeeId: string) => {
    const setup = editedSetup[employeeId];
    if (setup) {
      updatePayrollSetup(employeeId, setup);
      setPayrollSetup(getPayrollSetup());
      toast.success('Payroll setup saved');
    }
  };

  const handleSaveAll = () => {
    Object.keys(editedSetup).forEach(employeeId => {
      updatePayrollSetup(employeeId, editedSetup[employeeId]);
    });
    setPayrollSetup(getPayrollSetup());
    setEditedSetup({});
    toast.success('All payroll setups saved');
  };

  return (
    <AppLayout>
      <div className="page-header flex items-center justify-between">
        <div><h1 className="page-title">Payroll Setup</h1><p className="page-description">Configure salary components for employees</p></div>
        <Button onClick={handleSaveAll} disabled={Object.keys(editedSetup).length === 0}><Save className="w-4 h-4 mr-2" />Save All Changes</Button>
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><DollarSign className="w-5 h-5" />Salary Formula</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            <strong>Net Salary</strong> = Base Salary - (Absent Days × Per-Day Rate) - (Unpaid Leave Days × Per-Day Rate) + Allowance
          </p>
        </CardContent>
      </Card>

      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Base Salary (RM)</TableHead>
              <TableHead>Per-Day Rate (RM)</TableHead>
              <TableHead>Allowance (RM)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((emp) => {
              const setup = getSetupForEmployee(emp.id);
              const isEdited = !!editedSetup[emp.id];
              return (
                <TableRow key={emp.id}>
                  <TableCell className="font-medium">{emp.name}</TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell><Input type="number" value={setup.baseSalary} onChange={(e) => handleChange(emp.id, 'baseSalary', parseFloat(e.target.value) || 0)} className="w-32" /></TableCell>
                  <TableCell><Input type="number" value={setup.perDayRate} onChange={(e) => handleChange(emp.id, 'perDayRate', parseFloat(e.target.value) || 0)} className="w-28" /></TableCell>
                  <TableCell><Input type="number" value={setup.allowance} onChange={(e) => handleChange(emp.id, 'allowance', parseFloat(e.target.value) || 0)} className="w-28" /></TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant={isEdited ? 'default' : 'ghost'} onClick={() => handleSave(emp.id)} disabled={!isEdited}><Save className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
