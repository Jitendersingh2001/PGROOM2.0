import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// UI components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, User } from 'lucide-react';
import { cn } from '@/lib/utils';

// API and types
import { TenantUser } from '@/lib/api/services/tenantService';

interface AssignTenantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: TenantUser | null;
}

/**
 * AssignTenantDialog - Dialog for assigning a tenant to a property and room
 */
const AssignTenantDialog: React.FC<AssignTenantDialogProps> = ({
  isOpen,
  onClose,
  tenant
}) => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedPropertyId('');
      setSelectedRoomId('');
    }
  }, [isOpen]);

  // Mock properties data
  const mockProperties = [
    { id: 1, propertyName: 'Sunset Apartments' },
    { id: 2, propertyName: 'Ocean View Residences' },
    { id: 3, propertyName: 'Mountain Lodge' },
    { id: 4, propertyName: 'City Center Suites' }
  ];

  // Mock rooms data based on selected property
  const mockRoomsByProperty = {
    '1': [
      { id: 101, roomName: 'Room 101 - Sunset' },
      { id: 102, roomName: 'Room 102 - Sunset' },
      { id: 103, roomName: 'Room 103 - Sunset' }
    ],
    '2': [
      { id: 201, roomName: 'Room 201 - Ocean' },
      { id: 202, roomName: 'Room 202 - Ocean' }
    ],
    '3': [
      { id: 301, roomName: 'Room 301 - Mountain' },
      { id: 302, roomName: 'Room 302 - Mountain' },
      { id: 303, roomName: 'Room 303 - Mountain' },
      { id: 304, roomName: 'Room 304 - Mountain' }
    ],
    '4': [
      { id: 401, roomName: 'Room 401 - City' },
      { id: 402, roomName: 'Room 402 - City' }
    ]
  };

  // Mock loading states for UI demonstration
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);

  // Simulate loading delay for properties
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsLoadingProperties(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Simulate loading delay for rooms when property changes
  useEffect(() => {
    if (selectedPropertyId) {
      setIsLoadingRooms(true);
      const timer = setTimeout(() => {
        setIsLoadingRooms(false);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [selectedPropertyId]);

  // Create mock data structures that match what the component expects
  const propertiesData = {
    data: mockProperties
  };

  const roomsData = {
    data: selectedPropertyId ? mockRoomsByProperty[selectedPropertyId] || [] : []
  };

  // Mock tenant assignment function
  const handleAssignTenant = async () => {
    if (!tenant || !selectedPropertyId || !selectedRoomId) {
      toast.error('Missing required fields');
      return false;
    }

    // Log the assignment details
    console.log('Assigning tenant:', {
      tenant: tenant.user.firstName + ' ' + tenant.user.lastName,
      propertyId: selectedPropertyId,
      roomId: selectedRoomId
    });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate success
    return true;
  };

  // We already have isSubmitting state defined above

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPropertyId) {
      toast.error('Please select a property');
      return;
    }

    if (!selectedRoomId) {
      toast.error('Please select a room');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await handleAssignTenant();
      if (success) {
        toast.success('Tenant assigned successfully');
        onClose();
      }
    } catch (error) {
      toast.error('Failed to assign tenant');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header with gradient background */}
          <div className="relative bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white">
            <DialogTitle className="text-xl font-bold text-white mb-1">
              Assign Tenant to Room
            </DialogTitle>
            <DialogDescription className="text-green-100 opacity-90">
              {tenant ?
                `Assign ${tenant.user.firstName || ''} ${tenant.user.lastName || ''} to a property and room.`
                : 'Loading tenant details...'}
            </DialogDescription>

            {/* Tenant info card - only show if we have tenant data */}
            {tenant && tenant.user && (
              <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
                {tenant.user.profileImage ? (
                  <img
                    src={tenant.user.profileImage}
                    alt={`${tenant.user.firstName} ${tenant.user.lastName}`}
                    className="h-12 w-12 rounded-full object-cover border-2 border-white/30"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                )}
                <div>
                  <div className="font-medium text-white">
                    {tenant.user.firstName} {tenant.user.lastName}
                  </div>
                  {tenant.user.email && (
                    <div className="text-xs text-green-100">
                      {tenant.user.email}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Property Selection */}
            <div className="space-y-2">
              <Label htmlFor="property" className="text-sm font-medium">Property</Label>
              <Select
                value={selectedPropertyId}
                onValueChange={(value) => {
                  setSelectedPropertyId(value);
                  setSelectedRoomId(''); // Reset room selection when property changes
                }}
                disabled={isLoadingProperties || isSubmitting}
              >
                <SelectTrigger id="property" className="h-10 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
                  <SelectValue placeholder="Select a property" />
                </SelectTrigger>
                <SelectContent>
                  <AnimatePresence mode="wait">
                    {isLoadingProperties ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center p-4"
                      >
                        <Loader2 className="h-4 w-4 animate-spin mr-2 text-primary" />
                        <span>Loading properties...</span>
                      </motion.div>
                    ) : propertiesData?.data.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-4 text-center text-sm text-gray-500"
                      >
                        No properties available
                      </motion.div>
                    ) : (
                      propertiesData?.data.map((property) => (
                        <SelectItem key={property.id} value={String(property.id)}>
                          {property.propertyName}
                        </SelectItem>
                      ))
                    )}
                  </AnimatePresence>
                </SelectContent>
              </Select>
            </div>

            {/* Room Selection */}
            <div className="space-y-2">
              <Label htmlFor="room" className="text-sm font-medium">Room</Label>
              <Select
                value={selectedRoomId}
                onValueChange={setSelectedRoomId}
                disabled={!selectedPropertyId || isLoadingRooms || isSubmitting}
              >
                <SelectTrigger id="room" className="h-10 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
                  <SelectValue placeholder={!selectedPropertyId ? "Select a property first" : "Select a room"} />
                </SelectTrigger>
                <SelectContent>
                  <AnimatePresence mode="wait">
                    {isLoadingRooms ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center p-4"
                      >
                        <Loader2 className="h-4 w-4 animate-spin mr-2 text-primary" />
                        <span>Loading rooms...</span>
                      </motion.div>
                    ) : roomsData?.data.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-4 text-center text-sm text-gray-500"
                      >
                        No rooms available for this property
                      </motion.div>
                    ) : (
                      roomsData?.data.map((room) => (
                        <SelectItem key={room.id} value={String(room.id)}>
                          {room.roomName}
                        </SelectItem>
                      ))
                    )}
                  </AnimatePresence>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="border-gray-200 dark:border-gray-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!selectedPropertyId || !selectedRoomId || isSubmitting}
                className={`relative group ${!selectedPropertyId || !selectedRoomId || isSubmitting ? '' : 'bg-primary/90 hover:bg-primary'}`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <span className="relative z-10">Assign Tenant</span>
                    {/* Animated background for enabled button */}
                    {!(!selectedPropertyId || !selectedRoomId) && (
                      <span className="absolute inset-0 rounded-md overflow-hidden">
                        <span className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600"></span>
                        <span className="absolute top-0 left-0 right-0 h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"></span>
                      </span>
                    )}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTenantDialog;
