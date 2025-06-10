import React, { useState, useEffect } from 'react';
import { FileText, Upload, Download, AlertCircle, File, Clock, Calendar } from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import TenantNavbar from '@/components/tenant/TenantNavbar';
import TenantSidebar from '@/components/tenant/TenantSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface Document {
  id: number;
  name: string;
  type: string;
  uploadedAt: string;
  expiryDate?: string;
  status: 'active' | 'expired' | 'pending';
  size: string;
}

const TenantDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        const mockData: Document[] = [
          {
            id: 1,
            name: "Rental Agreement",
            type: "PDF",
            uploadedAt: "2024-01-01T10:00:00Z",
            expiryDate: "2025-01-01T00:00:00Z",
            status: "active",
            size: "2.5 MB"
          },
          {
            id: 2,
            name: "ID Proof",
            type: "JPG",
            uploadedAt: "2024-01-02T15:30:00Z",
            status: "active",
            size: "1.2 MB"
          },
          {
            id: 3,
            name: "Previous Rent Receipts",
            type: "PDF",
            uploadedAt: "2023-12-15T09:00:00Z",
            status: "active",
            size: "3.7 MB"
          }
        ];
        setDocuments(mockData);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status badge based on document status
  const getStatusBadge = (status: Document['status']) => {
    const badges = {
      active: <Badge className="bg-green-100 text-green-800">Active</Badge>,
      expired: <Badge className="bg-red-100 text-red-800">Expired</Badge>,
      pending: <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    };
    return badges[status];
  };

  // Get icon based on document type
  const getDocumentIcon = (type: string) => {
    const icons = {
      PDF: <FileText className="h-8 w-8 text-red-500" />,
      JPG: <File className="h-8 w-8 text-blue-500" />,
      default: <File className="h-8 w-8 text-gray-500" />
    };
    return icons[type as keyof typeof icons] || icons.default;
  };

  return (
    <DashboardLayout
      navbar={<TenantNavbar />}
      sidebar={<TenantSidebar />}
    >
      <div className="w-full max-w-[98%] mx-auto space-y-8">
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Documents
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and access your important documents
          </p>
        </div>

        {/* Upload Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Upload Documents</h2>
                <p className="text-muted-foreground">
                  Upload your documents in PDF, JPG, or PNG format
                </p>
              </div>
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload New Document</DialogTitle>
                    <DialogDescription>
                      Choose a document to upload. Maximum file size: 10MB
                    </DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="documentName">Document Name</Label>
                      <Input id="documentName" placeholder="Enter document name" />
                    </div>
                    <div>
                      <Label htmlFor="documentFile">File</Label>
                      <Input id="documentFile" type="file" className="cursor-pointer" />
                    </div>
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                      <Input id="expiryDate" type="date" />
                    </div>
                  </form>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Upload</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Documents Grid */}
        <Card>
          <CardHeader>
            <CardTitle>My Documents</CardTitle>
            <CardDescription>All your uploaded documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <Card key={doc.id} className="cursor-pointer hover:border-primary transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {getDocumentIcon(doc.type)}
                      <div className="flex-1 space-y-1">
                        <h3 className="font-medium">{doc.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{doc.type}</span>
                          <span>•</span>
                          <span>{doc.size}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4" />
                          <span>Uploaded: {formatDate(doc.uploadedAt)}</span>
                        </div>
                        {doc.expiryDate && (
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4" />
                            <span>Expires: {formatDate(doc.expiryDate)}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-4">
                          {getStatusBadge(doc.status)}
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {documents.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No documents found</h3>
                <p className="text-muted-foreground">Upload your first document to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TenantDocuments;
