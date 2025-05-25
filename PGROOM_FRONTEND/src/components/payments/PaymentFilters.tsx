/**
 * PaymentFilters Component
 *
 * Advanced filtering component for payment management with modern UI,
 * including status filters, date range, search, and property/tenant filters.
 */

import React, { memo, useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Search, X } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { PaymentStatus, PaymentListParams } from '@/lib/types/payment';
import { cn } from '@/lib/utils';

// Filter form schema
const filterSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  propertyId: z.string().optional(),
  tenantId: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

// Props interface
interface PaymentFiltersProps {
  onFiltersChange: (filters: PaymentListParams) => void;
  isLoading?: boolean;
  className?: string;
}

// Status options
const statusOptions: { value: PaymentStatus | 'all'; label: string; color: string }[] = [
  { value: 'all', label: 'All Payments', color: 'bg-gray-100 text-gray-800' },
  { value: 'Pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'Captured', label: 'Completed', color: 'bg-green-100 text-green-800' },
  { value: 'Failed', label: 'Failed', color: 'bg-red-100 text-red-800' },
  { value: 'Refunded', label: 'Refunded', color: 'bg-gray-100 text-gray-800' },
];



// Main PaymentFilters Component
export const PaymentFilters = memo<PaymentFiltersProps>(({
  onFiltersChange,
  isLoading = false,
  className
}) => {
  const [activeFilters, setActiveFilters] = useState<PaymentListParams>({});

  // Form setup
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: '',
      status: '',
      propertyId: '',
      tenantId: '',
    }
  });

  // Watch form values for real-time filtering
  const watchedValues = form.watch();

  // Handle form submission
  const onSubmit = useCallback((values: FilterFormValues) => {
    const filters: PaymentListParams = {
      page: 1, // Reset to first page when filtering
    };

    if (values.search?.trim()) {
      filters.search = values.search.trim();
    }

    if (values.status && values.status !== 'all') {
      filters.status = values.status as PaymentStatus;
    }

    if (values.propertyId) {
      filters.propertyId = parseInt(values.propertyId);
    }

    if (values.tenantId) {
      filters.tenantId = parseInt(values.tenantId);
    }

    if (values.startDate) {
      filters.startDate = format(values.startDate, 'yyyy-MM-dd');
    }

    if (values.endDate) {
      filters.endDate = format(values.endDate, 'yyyy-MM-dd');
    }

    setActiveFilters(filters);
    onFiltersChange(filters);
  }, [onFiltersChange]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    form.reset({
      search: '',
      status: '',
      propertyId: '',
      tenantId: '',
      startDate: undefined,
      endDate: undefined,
    });
    setActiveFilters({});
    onFiltersChange({ page: 1 });
  }, [form, onFiltersChange]);

  // Count active filters
  const activeFilterCount = Object.keys(activeFilters).filter(
    key => key !== 'page' && activeFilters[key as keyof PaymentListParams] !== undefined
  ).length;

  // Auto-submit on form changes (debounced)
  useEffect(() => {
    const subscription = form.watch((values) => {
      const timer = setTimeout(() => {
        onSubmit(values as FilterFormValues);
      }, 500); // 500ms debounce

      return () => clearTimeout(timer);
    });

    return () => subscription.unsubscribe();
  }, [form, onSubmit]);

  return (
    <Card className={className}>
      <CardContent className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by tenant name, payment ID, or property..."
            className="pl-10"
            {...form.register('search')}
            disabled={isLoading}
          />
        </div>

        {/* Filters */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="All statuses" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <div className={cn('w-2 h-2 rounded-full', option.color)} />
                                {option.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Start Date */}
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                              disabled={isLoading}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />

                {/* End Date */}
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                              disabled={isLoading}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />

                {/* Clear Filters Button */}
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearFilters}
                    disabled={isLoading || activeFilterCount === 0}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </form>
          </Form>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {Object.entries(activeFilters).map(([key, value]) => {
              if (key === 'page' || !value) return null;

              let displayValue = String(value);
              if (key === 'status') {
                const statusOption = statusOptions.find(opt => opt.value === value);
                displayValue = statusOption?.label || displayValue;
              }

              return (
                <span key={key} className="text-xs bg-secondary px-2 py-1 rounded">
                  {key}: {displayValue}
                </span>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

PaymentFilters.displayName = 'PaymentFilters';

export default PaymentFilters;
