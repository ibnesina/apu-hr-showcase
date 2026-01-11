import { useState, useEffect } from 'react';
import { Upload, FileText, File, Trash2, Download } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Document } from '@/lib/mockData';
import { getDocuments, addDocument, saveDocuments } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const categories = ['Policy', 'Template', 'Finance', 'Training', 'Personal', 'Other'];
const fileTypes = ['PDF', 'DOC', 'DOCX', 'XLS'] as const;

const getFileIcon = (type: string) => {
  switch (type) {
    case 'PDF':
      return <FileText className="w-5 h-5 text-red-500" />;
    case 'DOC':
    case 'DOCX':
      return <File className="w-5 h-5 text-blue-500" />;
    case 'XLS':
      return <File className="w-5 h-5 text-green-500" />;
    default:
      return <File className="w-5 h-5 text-gray-500" />;
  }
};

const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case 'PDF':
      return 'bg-red-100 text-red-700';
    case 'DOC':
    case 'DOCX':
      return 'bg-blue-100 text-blue-700';
    case 'XLS':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export default function Documents() {
  const { user, isAdmin, isFaculty } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'PDF' as typeof fileTypes[number],
    category: '',
    version: 'v1.0',
    uploadedBy: user?.name || 'Admin',
    size: '1.0 MB',
  });

  useEffect(() => {
    setDocuments(getDocuments());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDocument({
      ...formData,
      uploadedBy: user?.name || 'Admin',
      uploadedDate: new Date().toISOString().split('T')[0],
    });
    setDocuments(getDocuments());
    setIsDialogOpen(false);
    setFormData({
      name: '',
      type: 'PDF',
      category: '',
      version: 'v1.0',
      uploadedBy: user?.name || 'Admin',
      size: '1.0 MB',
    });
    toast.success('Document uploaded successfully');
  };

  const handleDownload = (doc: Document) => {
    toast.success(`Downloading ${doc.name}...`);
  };

  const handleDelete = (id: string) => {
    if (!isAdmin) {
      toast.error('Only admins can delete documents');
      return;
    }
    if (confirm('Are you sure you want to delete this document?')) {
      const updatedDocs = documents.filter(d => d.id !== id);
      saveDocuments(updatedDocs);
      setDocuments(updatedDocs);
      toast.success('Document deleted successfully');
    }
  };

  return (
    <AppLayout>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">{isFaculty ? 'My Documents' : 'Document Repository'}</h1>
          <p className="page-description">{isFaculty ? 'View and upload your documents' : 'Manage employee documents and policies'}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Document Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter document name"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>File Type</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as typeof fileTypes[number] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {fileTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Version</Label>
                <Input
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  placeholder="e.g., v1.0"
                />
              </div>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  (Demo only - no actual file upload)
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Upload Document</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Documents Table */}
      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Size</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {getFileIcon(doc.type)}
                    <span className="font-medium">{doc.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getTypeBadgeColor(doc.type)}>
                    {doc.type}
                  </Badge>
                </TableCell>
                <TableCell>{doc.category}</TableCell>
                <TableCell>
                  <Badge variant="outline">{doc.version}</Badge>
                </TableCell>
                <TableCell>{doc.uploadedBy}</TableCell>
                <TableCell>{doc.uploadedDate}</TableCell>
                <TableCell>{doc.size}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleDownload(doc)}>
                      <Download className="w-4 h-4" />
                    </Button>
                    {isAdmin && (
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
