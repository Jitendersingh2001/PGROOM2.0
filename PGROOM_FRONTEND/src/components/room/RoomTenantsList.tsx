import React, { useState, useEffect } from 'react';
import { tenantService } from '@/lib/api/services/tenantService';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { UserMinus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Tenant {
  id: number;
  userId: number;
  username: string;
}

interface RoomTenantsListProps {
  propertyId: number;
  roomId: number;
  onTenantUnassigned?: () => void;
}

/**
 * RoomTenantsList - A component to display and manage tenants assigned to a room
 */
const RoomTenantsList: React.FC<RoomTenantsListProps> = ({
  propertyId,
  roomId,
  onTenantUnassigned,
}) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isUnassignDialogOpen, setIsUnassignDialogOpen] = useState(false);
  const [isUnassigning, setIsUnassigning] = useState(false);
  const { toast } = useToast();

  // Fetch tenants assigned to this room
  const fetchTenants = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await tenantService.getTenantsByRoom(propertyId, roomId);

      if (response.statusCode === 200) {
        setTenants(response.data || []);
      } else {
        setError('Failed to load tenants');
        toast({
          title: 'Error',
          description: 'Failed to load tenants',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching tenants:', error);
      setError('Failed to load tenants');
      toast({
        title: 'Error',
        description: 'Failed to load tenants',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load tenants when component mounts
  useEffect(() => {
    fetchTenants();
  }, [propertyId, roomId]);

  // Handle unassign tenant
  const handleUnassignTenant = async () => {
    if (!selectedTenant) return;

    setIsUnassigning(true);

    try {
      // Call the tenant update API with an empty userIds array to unassign the tenant
      const response = await tenantService.updateTenant({
        ids: [selectedTenant.id],
        userIds: [], // Empty array to remove all tenants
        propertyId,
        roomId,
      });

      if (response.statusCode === 200) {
        toast({
          title: 'Success',
          description: 'Tenant unassigned successfully',
        });

        // Refresh the tenants list
        fetchTenants();

        // Call the callback if provided
        if (onTenantUnassigned) {
          onTenantUnassigned();
        }
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to unassign tenant',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error unassigning tenant:', error);
      toast({
        title: 'Error',
        description: 'Failed to unassign tenant',
        variant: 'destructive',
      });
    } finally {
      setIsUnassigning(false);
      setIsUnassignDialogOpen(false);
      setSelectedTenant(null);
    }
  };

  // Open unassign dialog
  const openUnassignDialog = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsUnassignDialogOpen(true);
  };

  // Get initials from username
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-semibold">Assigned Tenants</h3>
        <Badge variant="outline" className="bg-gradient-to-r from-primary/90 to-primary text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
          {tenants.length} {tenants.length === 1 ? 'Tenant' : 'Tenants'}
        </Badge>
      </div>

      {isLoading ? (
        // Loading state
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 bg-gray-50 animate-pulse">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          ))}
        </div>
      ) : error ? (
        // Error state
        <div className="p-4 border rounded-md bg-destructive/10 text-destructive">
          {error}
        </div>
      ) : tenants.length === 0 ? (
        // Empty state
        <div className="p-8 border border-gray-200 rounded-lg bg-gray-50 text-center flex flex-col items-center justify-center shadow-sm">
          <div className="bg-gradient-to-br from-primary/80 to-primary p-4 rounded-full mb-4 text-white shadow-sm">
            <UserMinus className="h-6 w-6" />
          </div>
          <h4 className="font-medium text-lg mb-2">No Tenants Assigned</h4>
          <p className="text-sm text-gray-500 max-w-xs">This room doesn't have any tenants assigned yet. Use the Edit Tenants button to assign tenants to this room.</p>
        </div>
      ) : (
        // Tenants list
        <div className="space-y-2">
          {tenants.map(tenant => (
            <div
              key={tenant.id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/80 to-primary text-white flex items-center justify-center shadow-sm">
                  <span className="text-sm font-medium">{getInitials(tenant.username)}</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{tenant.username}</p>
                  <p className="text-xs text-muted-foreground">Tenant</p>
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="font-medium transition-all duration-200 hover:shadow-md flex items-center gap-1.5 px-3 py-1 h-9 bg-red-500 hover:bg-red-600 text-white"
                onClick={() => openUnassignDialog(tenant)}
              >
                <UserMinus className="h-4 w-4" />
                Unassign
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Unassign Confirmation Dialog */}
      <AlertDialog open={isUnassignDialogOpen} onOpenChange={setIsUnassignDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <UserMinus className="h-5 w-5 text-destructive" />
              Unassign Tenant
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unassign <span className="font-medium">{selectedTenant?.username}</span> from this room?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUnassigning}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnassignTenant}
              disabled={isUnassigning}
              className="bg-red-500 hover:bg-red-600 text-white font-medium transition-all duration-200 hover:shadow-md"
            >
              {isUnassigning ? 'Unassigning...' : 'Unassign Tenant'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RoomTenantsList;
