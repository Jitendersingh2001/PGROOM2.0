import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Tenant {
  id: string | number;
  name: string;
  email: string;
  status: 'active' | 'invited';
  joinDate: string;
  avatarUrl?: string;
}

interface TenantsListProps {
  tenants: Tenant[];
  className?: string;
}

/**
 * TenantsList - A component for displaying a list of recent tenants
 *
 * @param tenants - Array of tenant objects
 * @param className - Optional additional class names
 */
const TenantsList: React.FC<TenantsListProps> = ({ tenants, className }) => {
  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Recent Tenants</CardTitle>
      </CardHeader>
      <CardContent className="px-2 h-full">
        <div className="space-y-4">
          {tenants.map(tenant => (
            <div key={tenant.id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              {/* Avatar or Initials */}
              {tenant.avatarUrl ? (
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img
                    src={tenant.avatarUrl}
                    alt={tenant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
                  <span className="text-sm font-medium">{getInitials(tenant.name)}</span>
                </div>
              )}

              {/* Tenant Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {tenant.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {tenant.email}
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex flex-col items-end ml-2">
                <Badge
                  className={cn(
                    "text-xs font-medium",
                    tenant.status === 'active'
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/40"
                  )}
                >
                  {tenant.status === 'active' ? 'Active' : 'Invited'}
                </Badge>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatDate(tenant.joinDate)}
                </span>
              </div>
            </div>
          ))}

          {tenants.length === 0 && (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              No tenants found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TenantsList;
