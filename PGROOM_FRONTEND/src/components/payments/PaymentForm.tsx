/**
 * Payment Form Component
 *
 * A comprehensive form for creating payment orders with validation,
 * accessibility, and Razorpay integration.
 */

import React, { memo, useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, User, Building, Home } from 'lucide-react';
import { CreatePaymentOrderRequest, PaymentFormData } from '@/lib/types/payment';
import { usePayment } from '@/hooks/usePayments';
import { propertyService, tenantService, roomService } from '@/lib/api/services';

// Validation schema - Updated order: Property → Room → Tenant
const paymentFormSchema = z.object({
  propertyId: z.number().min(1, 'Please select a property'),
  roomId: z.number().min(1, 'Please select a room'),
  tenantId: z.number().min(1, 'Please select a tenant'),
  amount: z.number().min(1, 'Amount must be greater than 0')
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

// Props interface
interface PaymentFormProps {
  onSuccess?: (paymentId: string) => void;
  onCancel?: () => void;
  initialData?: Partial<PaymentFormData>;
  className?: string;
}

// Option interfaces - Updated to match actual API responses
interface TenantOption {
  id: number;
  userId: number;
  username: string;
}

interface PropertyOption {
  id: number;
  propertyName: string;
  propertyAddress: string;
}

interface RoomOption {
  id: number;
  roomNo: number;
  rent: string;
}

// Main Payment Form Component
export const PaymentForm = memo<PaymentFormProps>(({
  onSuccess,
  onCancel,
  initialData,
  className
}) => {
  // State - Updated order: Property → Room → Tenant
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [rooms, setRooms] = useState<RoomOption[]>([]);
  const [tenants, setTenants] = useState<TenantOption[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingTenants, setLoadingTenants] = useState(false);

  // Hooks
  const { processPayment, isLoading } = usePayment();

  // Form setup - Updated order: Property → Room → Tenant
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      propertyId: initialData?.propertyId || 0,
      roomId: initialData?.roomId || 0,
      tenantId: initialData?.tenantId || 0,
      amount: initialData?.amount || 0
    }
  });

  const { watch, setValue, reset } = form;
  const selectedPropertyId = watch('propertyId');
  const selectedRoomId = watch('roomId');

  // Load properties
  const loadProperties = useCallback(async () => {
    setLoadingProperties(true);
    try {
      const response = await propertyService.getProperties({
        page: 1,
        limit: 100
      });

      if (response.statusCode === 200 && response.data) {
        const propertyOptions = response.data.data.map(property => ({
          id: property.id,
          propertyName: property.propertyName,
          propertyAddress: property.propertyAddress
        }));

        setProperties(propertyOptions);
      } else {
        throw new Error(response.message || 'Failed to load properties');
      }
    } catch (error) {
      console.error('Failed to load properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoadingProperties(false);
    }
  }, []);

  // Load rooms for selected property
  const loadRooms = useCallback(async (propertyId: number) => {
    if (!propertyId) {
      setRooms([]);
      setTenants([]); // Clear tenants when property changes
      return;
    }

    setLoadingRooms(true);
    try {
      const response = await roomService.getRooms({
        propertyId,
        page: 1,
        limit: 100
      });

      if (response.statusCode === 200 && response.data) {
        // The response.data contains the RoomListResponse with data property
        const roomOptions = response.data.data.map(room => ({
          id: room.id,
          roomNo: parseInt(room.roomNo.toString()),
          rent: room.rent.toString()
        }));

        setRooms(roomOptions);
      } else {
        throw new Error(response.message || 'Failed to load rooms');
      }
    } catch (error) {
      console.error('Failed to load rooms:', error);
      toast.error('Failed to load rooms');
    } finally {
      setLoadingRooms(false);
    }
  }, []);

  // Load tenants for selected property and room
  const loadTenants = useCallback(async (propertyId: number, roomId: number) => {
    if (!propertyId || !roomId) {
      setTenants([]);
      return;
    }

    setLoadingTenants(true);
    try {
      const response = await tenantService.getTenantsByRoom(propertyId, roomId);

      if (response.statusCode === 200 && response.data) {
        // The API returns an array of tenant objects with id, userId, and username
        const tenantOptions = response.data.map((tenant: any) => ({
          id: tenant.id,
          userId: tenant.userId,
          username: tenant.username
        }));

        setTenants(tenantOptions);
      } else {
        // If no tenants found, set empty array (not an error)
        setTenants([]);
      }
    } catch (error) {
      console.error('Failed to load tenants:', error);
      setTenants([]);
      // Don't show error toast for no tenants found
      if (!error?.message?.includes('not found')) {
        toast.error('Failed to load tenants');
      }
    } finally {
      setLoadingTenants(false);
    }
  }, []);

  // Auto-fill amount when room is selected
  useEffect(() => {
    if (selectedRoomId && rooms.length > 0) {
      const selectedRoom = rooms.find(room => room.id === selectedRoomId);
      if (selectedRoom) {
        setValue('amount', parseFloat(selectedRoom.rent));
      }
    }
  }, [selectedRoomId, rooms, setValue]);

  // Load rooms when property changes
  useEffect(() => {
    if (selectedPropertyId) {
      loadRooms(selectedPropertyId);
      // Reset room and tenant selection when property changes
      setValue('roomId', 0);
      setValue('tenantId', 0);
    }
  }, [selectedPropertyId, loadRooms, setValue]);

  // Load tenants when room changes
  useEffect(() => {
    if (selectedPropertyId && selectedRoomId) {
      loadTenants(selectedPropertyId, selectedRoomId);
      // Reset tenant selection when room changes
      setValue('tenantId', 0);
    }
  }, [selectedPropertyId, selectedRoomId, loadTenants, setValue]);

  // Load initial data
  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  // Handle form submission
  const onSubmit = useCallback(async (values: PaymentFormValues) => {
    try {
      // Find the selected tenant to get the userId
      const selectedTenant = tenants.find(t => t.id === values.tenantId);
      if (!selectedTenant) {
        toast.error('Please select a valid tenant');
        return;
      }

      const orderData: CreatePaymentOrderRequest = {
        tenantId: selectedTenant.userId, // Use userId for the payment API
        propertyId: values.propertyId,
        roomId: values.roomId,
        amount: values.amount,
        description: 'Monthly rent payment' // Default description
      };

      // Get tenant details for prefill
      const userDetails = {
        name: selectedTenant.username,
        // Note: We don't have email from the tenant API, so we'll skip it
      };

      const response = await processPayment(orderData, userDetails);

      if (response.success) {
        reset();
        onSuccess?.(response.payment.razorpayPaymentId || '');
      }
    } catch (error) {
      // Error is already handled by the hook
      console.error('Payment processing failed:', error);
    }
  }, [tenants, processPayment, reset, onSuccess]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    reset();
    onCancel?.();
  }, [reset, onCancel]);

  return (
    <div className={className}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Property Selection */}
          <FormField
            control={form.control}
            name="propertyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Property
                </FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value ? field.value.toString() : ''}
                  disabled={loadingProperties}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={loadingProperties ? 'Loading properties...' : 'Select a property'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id.toString()}>
                        {property.propertyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Room Selection */}
          <FormField
            control={form.control}
            name="roomId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Room
                </FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value ? field.value.toString() : ''}
                  disabled={loadingRooms || !selectedPropertyId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !selectedPropertyId
                            ? 'Select a property first'
                            : loadingRooms
                              ? 'Loading rooms...'
                              : 'Select a room'
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id.toString()}>
                        Room {room.roomNo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tenant Selection */}
          <FormField
            control={form.control}
            name="tenantId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Tenant
                </FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value ? field.value.toString() : ''}
                  disabled={loadingTenants || !selectedRoomId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !selectedRoomId
                            ? 'Select a room first'
                            : loadingTenants
                              ? 'Loading tenants...'
                              : tenants.length === 0
                                ? 'No tenants assigned to this room'
                                : 'Select a tenant'
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tenants.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id.toString()}>
                        {tenant.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Amount */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Amount (₹)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="Enter amount"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Create Payment
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="w-full sm:w-auto"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
});

PaymentForm.displayName = 'PaymentForm';

export default PaymentForm;
