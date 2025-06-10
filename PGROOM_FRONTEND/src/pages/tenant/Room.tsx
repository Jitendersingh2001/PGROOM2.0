import React, { useState, useEffect } from 'react';
import { Building2, BedDouble, Ruler, Users, ScrollText, AlertCircle, ImageIcon } from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import TenantNavbar from '@/components/tenant/TenantNavbar';
import TenantSidebar from '@/components/tenant/TenantSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { tenantService, TenantRoomDetails } from '@/lib/api/services/tenantService';
import { useToast } from '@/hooks/use-toast';

const TenantRoom = () => {
  const [roomDetails, setRoomDetails] = useState<TenantRoomDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await tenantService.getTenantRoomDetails();
        
        if (response.statusCode === 200 && response.data) {
          setRoomDetails(response.data);
        } else {
          setError('No room assignment found');
          toast({
            title: "No Room Assignment",
            description: "You are not currently assigned to any room.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching room details:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch room details';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomDetails();
  }, [toast]);

  return (
    <DashboardLayout
      navbar={<TenantNavbar />}
      sidebar={<TenantSidebar />}
    >
      <div className="w-full max-w-[98%] mx-auto space-y-8">
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Room Details
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View details about your current accommodation
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Room Assignment</h3>
                <p className="text-muted-foreground">
                  You are not currently assigned to any room. Please contact the property manager.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Room Information */}
        {roomDetails && !isLoading && (
          <>
            {/* Room Images */}
            {roomDetails.roomImage && roomDetails.roomImage.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    Room Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {roomDetails.roomImage.map((imageUrl, index) => (
                      <div key={index} className="aspect-video relative rounded-lg overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={`Room ${roomDetails.roomNo} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-room.jpg';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Property Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Property Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {roomDetails.property.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {roomDetails.property.address}
                    </p>
                    <Badge variant="secondary" className="mt-2">
                      {roomDetails.property.type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Room Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BedDouble className="h-5 w-5 text-primary" />
                    Room Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Room Number</p>
                      <p className="font-medium">{roomDetails.roomNo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant={roomDetails.status === 'Available' ? 'secondary' : 'default'}>
                        {roomDetails.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rent</p>
                      <p className="font-medium">₹{roomDetails.rent}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Occupancy</p>
                      <p className="font-medium">{roomDetails.occupancy.current}/{roomDetails.occupancy.total}</p>
                    </div>
                  </div>
                  {roomDetails.description && (
                    <div>
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p className="text-sm">{roomDetails.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Roommates Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Roommates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {roomDetails.tenants.length > 0 ? (
                      roomDetails.tenants.map((tenant) => (
                        <div
                          key={tenant.id}
                          className="flex items-center gap-2 p-2 bg-muted rounded-md"
                        >
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {tenant.firstName[0]}{tenant.lastName[0]}
                            </span>
                          </div>
                          <span className="text-sm font-medium">{tenant.name}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No roommates assigned</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TenantRoom;
