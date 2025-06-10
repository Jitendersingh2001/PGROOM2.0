import React, { useState, useEffect } from 'react';
import { Wrench, Plus, Search, Filter, AlertTriangle } from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import TenantNavbar from '@/components/tenant/TenantNavbar';
import TenantSidebar from '@/components/tenant/TenantSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface MaintenanceRequest {
  id: number;
  title: string;
  description: string;
  type: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  updatedAt: string;
  comments?: string[];
}

const TenantMaintenance = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchMaintenanceRequests = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        const mockData: MaintenanceRequest[] = [
          {
            id: 1,
            title: "AC Not Working",
            description: "The air conditioner is not cooling properly",
            type: "Appliance",
            priority: "High",
            status: "In Progress",
            createdAt: "2024-01-15T10:30:00Z",
            updatedAt: "2024-01-15T14:20:00Z",
            comments: [
              "Technician scheduled for inspection",
              "Parts ordered for repair"
            ]
          },
          {
            id: 2,
            title: "Water Leakage",
            description: "Water leaking from bathroom tap",
            type: "Plumbing",
            priority: "Medium",
            status: "Open",
            createdAt: "2024-01-16T09:00:00Z",
            updatedAt: "2024-01-16T09:00:00Z"
          }
        ];
        setMaintenanceRequests(mockData);
      } catch (error) {
        console.error('Error fetching maintenance requests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaintenanceRequests();
  }, []);

  // Filter requests based on search query and status
  const filteredRequests = maintenanceRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Get badge color based on priority
  const getPriorityBadge = (priority: MaintenanceRequest['priority']) => {
    const colors = {
      High: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      Low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    };
    return (
      <Badge className={cn('font-medium', colors[priority])}>
        {priority}
      </Badge>
    );
  };

  // Get badge color based on status
  const getStatusBadge = (status: MaintenanceRequest['status']) => {
    const colors = {
      Open: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      Resolved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      Closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    };
    return (
      <Badge className={cn('font-medium', colors[status])}>
        {status}
      </Badge>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
            Maintenance Requests
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Submit and track your maintenance requests
          </p>
        </div>

        {/* Actions and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Search */}
              <div className="relative md:col-span-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search requests..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div className="md:col-span-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* New Request Button */}
              <div className="md:col-span-5 flex justify-end">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      New Request
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>New Maintenance Request</DialogTitle>
                      <DialogDescription>
                        Submit a new maintenance request for your room
                      </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" placeholder="Brief description of the issue" />
                      </div>
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select request type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="appliance">Appliance</SelectItem>
                            <SelectItem value="electrical">Electrical</SelectItem>
                            <SelectItem value="plumbing">Plumbing</SelectItem>
                            <SelectItem value="furniture">Furniture</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Detailed description of the issue"
                          className="h-32"
                        />
                      </div>
                    </form>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Submit Request</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        <Card>
          <CardHeader>
            <CardTitle>All Requests</CardTitle>
            <CardDescription>View and manage your maintenance requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.title}</TableCell>
                    <TableCell>{request.type}</TableCell>
                    <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>{formatDate(request.createdAt)}</TableCell>
                    <TableCell>{formatDate(request.updatedAt)}</TableCell>
                  </TableRow>
                ))}
                {filteredRequests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <AlertTriangle className="h-8 w-8 mb-2" />
                        <p className="font-medium">No requests found</p>
                        <p className="text-sm">Create a new request or adjust your filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TenantMaintenance;
