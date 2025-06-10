import React, { useState, useEffect } from 'react';
import { Building2, BedDouble, Ruler, Users, ScrollText, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import TenantNavbar from '@/components/tenant/TenantNavbar';
import TenantSidebar from '@/components/tenant/TenantSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface RoomDetails {
  id: number;
  roomNo: string;
  floor: string;
  capacity: number;
  currentOccupancy: number;
  roomType: string;
  amenities: string[];
  property: {
    name: string;
    address: string;
    type: string;
  };
  rules: string[];
}

const TenantRoom = () => {
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchRoomDetails = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        const mockData: RoomDetails = {
          id: 1,
          roomNo: "201",
          floor: "2nd Floor",
          capacity: 2,
          currentOccupancy: 2,
          roomType: "Double Sharing",
          amenities: [
            "Air Conditioning",
            "Attached Bathroom",
            "Study Table",
            "Wardrobe",
            "Wi-Fi"
          ],
          property: {
            name: "Sunshine PG",
            address: "123 Main Street, Bangalore",
            type: "Co-living Space"
          },
          rules: [
            "No smoking",
            "No loud music after 10 PM",
            "Guests allowed only in common areas",
            "Keep room clean and tidy"
          ]
        };
        setRoomDetails(mockData);
      } catch (error) {
        console.error('Error fetching room details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomDetails();
  }, []);

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

        {/* Room Information */}
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
                  {roomDetails?.property.name}
                </h3>
                <p className="text-muted-foreground">
                  {roomDetails?.property.address}
                </p>
                <Badge variant="secondary" className="mt-2">
                  {roomDetails?.property.type}
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
                  <p className="font-medium">{roomDetails?.roomNo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Floor</p>
                  <p className="font-medium">{roomDetails?.floor}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{roomDetails?.roomType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Occupancy</p>
                  <p className="font-medium">{roomDetails?.currentOccupancy}/{roomDetails?.capacity}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-primary" />
                Amenities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {roomDetails?.amenities.map((amenity, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="justify-start"
                  >
                    {amenity}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rules Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-primary" />
              Room Rules
            </CardTitle>
            <CardDescription>
              Important guidelines to follow during your stay
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {roomDetails?.rules.map((rule, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2"
                >
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <p>{rule}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TenantRoom;
