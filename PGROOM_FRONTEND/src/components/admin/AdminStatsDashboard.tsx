import React from 'react';
import { cn } from '@/lib/utils';

interface AdminStatsDashboardProps {
  className?: string;
}

/**
 * AdminStatsDashboard - Clean empty dashboard component
 */
const AdminStatsDashboard: React.FC<AdminStatsDashboardProps> = ({
  className,
}) => {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Empty dashboard - content has been cleared */}
      <div className="text-center p-8">
        <p className="text-gray-500 dark:text-gray-400">
          Admin dashboard content cleared
        </p>
      </div>
    </div>
  );
};

export default AdminStatsDashboard;
