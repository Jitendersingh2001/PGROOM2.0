import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Building, Eye, Info } from 'lucide-react';
import { Property } from '@/lib/types/property';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';

interface TenantPropertyCardProps {
  property: Property;
  className?: string;
}

/**
 * TenantPropertyCard - A card component for displaying property information to tenants
 *
 * This component displays key information about a property for tenant browsing
 * without owner-specific actions like edit, delete, or status change.
 */
const TenantPropertyCard: React.FC<TenantPropertyCardProps> = ({
  property,
  className
}) => {
  // State for image loading
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Handle image load event
  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Handle image error event
  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  // Handle view details click - could navigate to property details page
  const handleViewDetails = () => {
    // For now, just log - could navigate to property details in future
    console.log('View property details:', property.id);
    // navigate(`/tenant/properties/${property.id}`);
  };

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-xl border-border",
        "group relative flex flex-col h-full",
        "bg-card hover:border-primary/50",
        className
      )}
    >
      {/* Property Image with AspectRatio for consistent sizing */}
      <div className="relative overflow-hidden group/image">
        <AspectRatio ratio={16/9} className="bg-muted/20">
          {property.propertyImage ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 z-10">
                  <Skeleton className="w-full h-full animate-pulse" />
                </div>
              )}
              <img
                src={property.propertyImage}
                alt={property.propertyName}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
                  imageLoading && "opacity-0"
                )}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </>
          ) : imageError ? (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Building className="w-12 h-12 text-muted-foreground/50" />
            </div>
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Building className="w-12 h-12 text-muted-foreground/50" />
            </div>
          )}
        </AspectRatio>

        {/* Property Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge 
            variant={property.propertyStatus === 'Active' ? 'default' : 'secondary'}
            className={cn(
              "shadow-sm",
              property.propertyStatus === 'Active' 
                ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                : "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800"
            )}
          >
            {property.propertyStatus}
          </Badge>
        </div>

        {/* Hover Overlay for Details */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center backdrop-blur-[2px]">
          <div className="text-center p-4 transform translate-y-4 group-hover/image:translate-y-0 transition-transform duration-300 scale-90 group-hover/image:scale-100">
            <p className="text-white text-sm mb-3 font-medium">Property Details</p>
            <Button
              variant="outline"
              size="sm"
              className="bg-primary/80 backdrop-blur-sm border-primary/30 text-white hover:bg-primary hover:text-white shadow-lg hover:shadow-primary/25 transition-all duration-300"
              onClick={handleViewDetails}
            >
              <Info className="mr-2 h-4 w-4" />
              View Details
            </Button>
          </div>
        </div>
      </div>

      {/* Property Title and Address */}
      <CardHeader className="pb-0 pt-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1 w-full">
            <CardTitle className="text-xl font-semibold line-clamp-1 group-hover:text-primary transition-colors duration-300">
              {property.propertyName}
            </CardTitle>
            <CardDescription className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 mr-1 inline flex-shrink-0" />
              <span className="line-clamp-1">{property.propertyAddress}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      {/* Property Details */}
      <CardContent className="pt-4 pb-6 flex-grow">
        <Separator className="mb-4 bg-border/50" />

        {/* Property Information List */}
        <div className="space-y-3">
          {/* Location */}
          <div className="flex items-center justify-between text-sm group/item hover:bg-muted/40 p-1.5 rounded-md transition-colors duration-300">
            <div className="text-muted-foreground flex items-center gap-2">
              <div className="bg-primary/10 p-1.5 rounded-md group-hover/item:bg-primary/20 transition-colors duration-300">
                <MapPin className="w-3.5 h-3.5 text-primary" />
              </div>
              <span>Location</span>
            </div>
            <div className="font-medium">{property.state}, {property.city}</div>
          </div>

          {/* Contact */}
          <div className="flex items-center justify-between text-sm group/item hover:bg-muted/40 p-1.5 rounded-md transition-colors duration-300">
            <div className="text-muted-foreground flex items-center gap-2">
              <div className="bg-primary/10 p-1.5 rounded-md group-hover/item:bg-primary/20 transition-colors duration-300">
                <Phone className="w-3.5 h-3.5 text-primary" />
              </div>
              <span>Contact</span>
            </div>
            <div className="font-medium">{property.propertyContact}</div>
          </div>
        </div>

        {/* Tenant-specific action - could add "Express Interest" or "Contact Owner" button */}
        <div className="mt-4 pt-4 border-t">
          <Button
            variant="outline" 
            size="sm"
            className="w-full bg-background hover:bg-primary/5 hover:border-primary/50 transition-all duration-300"
            onClick={handleViewDetails}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Available Rooms
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TenantPropertyCard;
